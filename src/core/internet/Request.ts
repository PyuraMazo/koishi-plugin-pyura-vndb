import { HTTP } from 'koishi'
import { logger } from "../..";

import { Config } from "../api/Types";
import { TipsError, ImageDownloadError } from "../api/Errors";

export class Request {
    private http: HTTP;
    private retryCount: number

    private headers = { "Content-Type": "application/json" }

    private static Instance: Request;


    private constructor() {}

    static getInstance(): Request {
        if (!Request.Instance) {
            Request.Instance = new Request();
        }
        return Request.Instance;
    }

    async init(_http: HTTP, _config: Config){
        this.http = _http;

        this.retryCount = _config.retryCount;
    }

    async get(_url: string) {
        let count = 0;
        while (count < this.retryCount) {
            try {
                const arrayBuffer =  await this.http.get(_url, { responseType: 'arraybuffer' });
                return Buffer.from(arrayBuffer);
            } catch (e) {
                if (++count >= this.retryCount) throw new ImageDownloadError;

                logger.warn(`网络请求失败一次...${e.message}`);
            }
        }
        throw new Error('意外的异常！');
    }

    async post(_url: string, _data: object){
        let count = 0;
        while (count < this.retryCount) {
            try {
                const resp = await this.http.post(_url, _data, {
                    headers: this.headers
                })
                
                return resp;
            } catch (e) {
                if (++count >= this.retryCount) throw new TipsError(`网络请求全部失败！${e.message}`);

                logger.warn(`网络请求失败一次...${e.message}`);
            }
        }
        throw new Error('意外的异常！');
    }
}

export default Request;