import { Context } from 'koishi';
export declare class DownloadImg {
    storagePath: string;
    ctx: Context;
    tasks: string[];
    constructor(_ctx: Context, _urls: string[]);
    download(): Promise<string[]>;
    clean(): Promise<void>;
}
export default DownloadImg;
