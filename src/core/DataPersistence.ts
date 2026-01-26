import path from "path"

import { Query, h, Element } from "koishi";

import { db, dbName, logger, dataDir } from "..";
import { TaskUnit, Config } from "./api/Types";
import { File } from "./utils/File";



export class DataPersistence {
    private cacheDir = path.join(dataDir, 'cache');
    private textCacheDir = path.join(this.cacheDir, 'text');
    private imageCacheDir = path.join(this.cacheDir, 'image');

    private textOutput: boolean;
    private imageOutput: boolean;
    private dataStorage: number;
    private detailLog: boolean;

    private static Instance: DataPersistence;

    private constructor() { }

    static getInstance(): DataPersistence {
        if (!DataPersistence.Instance) {
            DataPersistence.Instance = new DataPersistence();
        }
        return DataPersistence.Instance;
    }

    async init(_config: Config) {
        this.textOutput = _config.outputContent.includes('以文本形式发送（数量受限）');
        this.imageOutput = _config.outputContent.includes('以图片方式发送');
        this.dataStorage = _config.dataStorage;
        this.detailLog = _config.detailLog;

        this.setTimer();
        await Promise.all([this.clean(), File.removeAll(this.cacheDir)]);
        await Promise.all([File.mkdir(this.imageCacheDir), File.mkdir(this.textCacheDir)]);
    }

    // 返回包含可发送信息的元组
    async withdraw(_task: TaskUnit): Promise<[string, Element] | null> {
        const res = await this.select({
            type: _task.type,
            keyword: _task.value
        })
        if (res.length === 0) {
            return null;
        } else if (res.length > 1) {
            logger.info('数据库有重复数据！开始清除并保留一个。')

            try {
                for (let index = 1; index < res.length; index++) {
                    await this.drop({
                        id: res[index].id
                    });
                    if (this.textOutput) await File.removeFile(path.join(this.textCacheDir, `${res[index].id}.txt`))
                    if (this.imageOutput) await File.removeFile(path.join(this.imageCacheDir, `${res[index].id}.png`))
                }
            } catch (e) {
                logger.error('清除重复数据失败！建议重载插件以刷新。')
            }
        } else {
            const id = res[0].id;
            if (_task.options['refresh']) {
                await this.drop({
                    id: id
                });
                if (this.textOutput) await File.removeFile(path.join(this.textCacheDir, `${id}.txt`))
                if (this.imageOutput) await File.removeFile(path.join(this.imageCacheDir, `${id}.png`))
                return null;
            } else {
                logger.success('从数据库读取信息！')
                const textData = this.textOutput ? await File.readText(path.join(this.textCacheDir, `${id}.txt`)) : '';
                const imageData = this.imageOutput ? h.image(await File.readBuffer(path.join(this.imageCacheDir, `${id}.png`)), 'image/png') : null;
                return [textData, imageData]
            }
        }
    }

    async record(_task: TaskUnit, _text: string, _image: string) {
        const inserted = await this.insert(_task.type, _task.value)
        const id = inserted.id;

        if (this.textOutput) await File.writeText(path.join(this.textCacheDir, `${id}.txt`), _text);
        if (this.imageOutput) await File.storeBase64Image(path.join(this.imageCacheDir, `${id}.png`), _image);
    }

    private async clean() {
        await db.drop(dbName);
    }

    private async insert(_type: string, _keyword: string) {
        return await db.create(dbName, {
            date: new Date(),
            type: _type,
            keyword: _keyword
        })
    }

    private async drop(_query: Query) {
        return await db.remove(dbName, _query);
    }

    private async select(_query: Query) {
        return await db.get(dbName, _query)
    }

    private setTimer() {
        const now = new Date();
        const nowTimestamp = now.getTime();
        const todayZero = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const todayZeroTimestamp = todayZero.getTime();
        const oneDayInterval = 24 * 60 * 60 * 1000;
        if (this.dataStorage > 0) {
            const nextExecutionTime = todayZeroTimestamp + oneDayInterval - nowTimestamp + (this.dataStorage - 1) * oneDayInterval;

            setTimeout(() => {
                setInterval(() => {
                    this.cleanDB_Cache(todayZeroTimestamp + oneDayInterval, oneDayInterval);
                }, oneDayInterval);

                this.cleanDB_Cache(todayZeroTimestamp + oneDayInterval, oneDayInterval);
            }, nextExecutionTime);
        }
    }

    // 清除点执行
    private async cleanDB_Cache(nowStamp: number, oneDayInterval: number) {
        if (this.detailLog) logger.info(`${new Date(nowStamp)}：开始清理缓存数据...`);
        const targetDate = new Date(nowStamp - oneDayInterval * (this.dataStorage - 1));
        const query = {
            date: {
                $lte: targetDate,
                $gte: new Date(1)
            }
        };
        try {
            const checked = await this.select(query);
            checked.forEach(e => {
                if (this.textOutput) File.deleteFile(path.join(this.textCacheDir, `${e.id}.txt`));
                if (this.imageOutput) File.deleteFile(path.join(this.imageCacheDir, `${e.id}.png`));
            })
            const deleted = await this.drop(query);
            if (this.detailLog) logger.info(`匹配数据${checked.length}条，删除数据${deleted.matched}条。`);
        } catch {
            if (this.detailLog) logger.info(`待清理数据数为0，无需清理。`);
        }

    }
}


export default DataPersistence;