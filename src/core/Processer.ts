import { HTTP, h } from "koishi";


import { Queue } from "./Queue";
import { ResponseHandler } from "./ResponseHandler";
import { Renderer } from "./Renderer";
import { Config, TaskUnit, VNResponse, CharacterResponse, ProducerResponse } from "./api/Types";
import { FetchAPI } from "./internet/FetchAPI";
import { Downloader } from "./internet/Downloader";
import { DataPersistence } from "./DataPersistence";
import { TipsError } from "./api/Errors";
import { logger } from "..";



// 每个群聊一个任务处理器，收到的命令直接分发给任务处理器
export class Processer {
    private textOutput = false;
    private imageOutput = false;
    private queue: Queue;
    private fetchAPI: FetchAPI;
    private responseHandler: ResponseHandler;
    private renderer: Renderer;
    private dataPersistence: DataPersistence;

    private processHandling: number;
    private withdrawTips: boolean;

    private running = false;
    private runningCount = 0;


    constructor(_config: Config, _queue: Queue) {
        this.queue = _queue;
        this.fetchAPI = FetchAPI.getInstance();
        this.responseHandler = ResponseHandler.getInstance();
        this.renderer = Renderer.getInstance();
        this.dataPersistence = DataPersistence.getInstance();

        this.textOutput = _config.outputContent.includes('以文本形式发送（数量受限）');
        this.imageOutput = _config.outputContent.includes('以图片方式发送');
        this.processHandling = _config.processHandling;
        this.withdrawTips = _config.withdrawTips;

    }

    async push(_task: TaskUnit) {
        try {
            this.queue.enQueue(_task);
            const ready = _task.session.sendQueued([h.quote(_task.session.messageId), '命令成功加入队列。'])
            if (this.withdrawTips) _task.replyId = (await ready)[0];
            this.running = !this.queue.isEmpty();
            while (this.running && this.runningCount < this.processHandling) {
                const handling = this.queue.next();
                if (handling === null) return;
                this.runningCount++;
                const msgId = await this.taskLine(handling);
                this.runningCount--;
                const finished = this.queue.deQueue(msgId);
                const sess = finished.session;
                if (this.withdrawTips) sess.bot.deleteMessage(sess.channelId, finished.replyId);
                this.running = !this.queue.isEmpty();
                if (this.queue.getSize() === this.runningCount) break;
                else if (this.queue.getSize() < this.runningCount) throw new Error('意外的状态！');
            }
        } catch (e) {
            const sess = _task.session;
            if (e instanceof TipsError) {
                sess.sendQueued([h.quote(sess.messageId), e.message]);
            } else {
                sess.sendQueued([h.quote(sess.messageId), '发生意外错误！']);
                logger.error(e.message)
            }
            if (this.withdrawTips) sess.bot.deleteMessage(sess.channelId, _task.replyId);

            try {
                // 强制异常任务出队
                this.queue.deQueue(sess.messageId, true);
            } catch {
                logger.error("引发异常，异常发生时本次任务已经出队。");
            }
        }
    }

    copyQueue() {
        return Array.from(this.queue.getQueue());
    }

    private async taskLine(_task: TaskUnit): Promise<string> {
        // 查找存储数据
        const data = await this.dataPersistence.withdraw(_task);
        if (data !== null) {
            data.map(e => {
                if (e !== null && e !== '') _task.session.send(e);
            })
            return _task.session.messageId;
        }
        // 获取返回信息
        const resp: [VNResponse[] | CharacterResponse[] | ProducerResponse[], any] = await this.fetchAPI.fetchMap[_task.type](_task);
        // 处理结果
        const [tMode, iMode] = await this.responseHandler.build(_task, ...resp)
        // 文字结果直接输出
        if (this.textOutput) {
            _task.session.send(tMode);
        }
        // 渲染图片，并输出
        let bs64: string;
        if (this.imageOutput) {
            const imgMsg = await this.renderer.render(_task, iMode);
            _task.session.send(imgMsg)
            bs64 = imgMsg.slice(32).slice(0 , -3);
        }
        await this.dataPersistence.record(_task, tMode, bs64)
        return _task.session.messageId;
    }
}