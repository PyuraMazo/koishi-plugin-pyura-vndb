import path from "path"

import { HTTP } from 'koishi'

import { Config } from "../api/Types";
import { Request } from "./Request";
import { File } from "../utils/File";
import { TipsError, FileReadError, ImageDownloadError } from "../api/Errors";


export class Downloader {
    private resourcesDir = path.join(__dirname, 'resources')

    private request: Request;

    private errorImage: Buffer;

    private static Instance: Downloader;

    private constructor() { }

    static getInstance(): Downloader {
        if (!Downloader.Instance) {
            Downloader.Instance = new Downloader();
        }
        return Downloader.Instance;
    }


    async init(_http: HTTP, _config: Config) {
        this.request = Request.getInstance();
        
        if (!this.errorImage) {
            const err = path.join(this.resourcesDir, 'image', 'error.jpg');
            this.errorImage = await File.readBuffer(err);
        }

        await this.request.init(_http, _config);
    }

    async download(_url: string) {
        if (_url === '') {
            return this.errorImage;
        } else {
            try {
                return await this.request.get(_url);
            } catch (e) {
                if (e instanceof ImageDownloadError) return this.errorImage;
                else throw new TipsError('图片意外下载失败！');
            }
        }
    }
}


export default Downloader;