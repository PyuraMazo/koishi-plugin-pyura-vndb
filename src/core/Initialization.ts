import { HTTP } from "koishi";

import { logger } from "..";
import { Registry } from "./Registry";
import { FetchAPI } from "./internet/FetchAPI";
import { ResponseHandler } from "./ResponseHandler";
import { Downloader } from "./internet/Downloader";
import { DataPersistence } from "./DataPersistence";
import { Renderer } from "./Renderer";
import { Config } from "./api/Types";


// 只有index中调用，无需单例
export class Initialization {
    private registry: Registry;
    private fetchAPI: FetchAPI;
    private responseHandler: ResponseHandler;
    private dataPersistence: DataPersistence;
    private renderer: Renderer;

    private static Instance: Initialization;

    private constructor() {
        this.registry = Registry.getInstance();
        this.fetchAPI = FetchAPI.getInstance();
        this.responseHandler = ResponseHandler.getInstance();
        this.dataPersistence = DataPersistence.getInstance();
        this.renderer = Renderer.getInstance();
    }

    static getInstance(): Initialization {
        if (!Initialization.Instance) {
            Initialization.Instance = new Initialization();
        }
        return Initialization.Instance;
    }

    // 数据库创建、资源文件载入、
    async globalInit(_http: HTTP, _config: Config){
        await Promise.all([
            this.registry.init(_config),
            this.fetchAPI.init(_http, _config),
            this.responseHandler.init(_http, _config), 
            this.dataPersistence.init(_config), 
            this.renderer.init(_config)])
        logger.success('初始化成功！')
    }

    // 群组进程器创建、注册
    async commandInit(){
        await Promise.all([])
    }

    async destroy(){
        
    }
}

export default Initialization;