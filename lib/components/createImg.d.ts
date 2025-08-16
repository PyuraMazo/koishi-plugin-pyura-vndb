import { Context } from 'koishi';
import DownloadImg from "./downloadImg";
export declare class CreateImgVT {
    html: string;
    ctx: Context;
    downloader: DownloadImg;
    res_vn: Object[];
    res_cha: Object[];
    img_path: string[];
    constructor(_ctx: Context, _res: Object[][]);
    run(): Promise<string>;
    download(): Promise<void>;
    getProducer(s: Object[]): string;
    filterRating(): Object[][];
    vnsSatisfy(vns: Object[]): boolean;
    vnsArr(vns: Object[]): string;
}
