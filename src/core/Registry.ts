import { HTTP } from "koishi";

import { Queue } from "./Queue";
import { Processer } from "./Processer";
import { GroupRegistry, Config } from "./api/Types";
import {  } from "./api/Grand";


// 注册表，全局单例，管理不同群聊单例
export class Registry{
    private registry = new Map<string, GroupRegistry>();
    private config: Config;

    private static Instance: Registry;

    private constructor() { }

    static getInstance(): Registry {
        if (!Registry.Instance) {
            Registry.Instance = new Registry();
        }
        return Registry.Instance;
    }

    async init(_config: Config){
        this.config = _config;
    }

    register_or_get(_groupId: string): GroupRegistry {
        if (!_groupId) throw new Error('此会话频道ID不存在！') 

        if (this.registry.has(_groupId)) {
            return this.registry.get(_groupId);
        } else {
            const groupQueue = new Queue(this.config);
            const list: GroupRegistry = {
                groupProcesser: new Processer(this.config, groupQueue)
            }
            this.registry.set(_groupId, list);
            return list;
        }
    }
}