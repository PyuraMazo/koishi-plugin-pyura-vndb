import { TaskUnit, Config } from './api/Types'


export class Queue {
    private config: Config;
    private queue: TaskUnit[] = [];


    constructor(_config: Config) {
        this.config = _config;
    }

    async enQueue(_node: TaskUnit) {
        this.queue.push(_node);
    }

    // 运行元素出队并获取出队元素
    deQueue(_id: string): TaskUnit {
        for (let index = 0; index < this.queue.length; index++) {
            if (!this.queue[index].activated) {
                continue;
            }

            if (this.queue[index].session.messageId === _id) {
                const e = this.queue.splice(index, 1)[0];
                return e;
            }
        }
        throw new Error('未能删除运行任务!');
    }

    // 获取下一个任务，并激活运行
    next(): TaskUnit | null {
        for (let index = 0; index < this.queue.length; index++) {
            if (!this.queue[index].activated) {
                this.queue[index].activated = true;
                return this.queue[index];
            }
        }
        return null;
    }

    isEmpty() {
        return this.queue.length === 0;
    }

    getSize(){
        return this.queue.length;
    }

    cleanAll() {
        this.queue.length = 0;
    }
}


export default Queue;