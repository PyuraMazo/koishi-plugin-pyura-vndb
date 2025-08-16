import { Context } from 'koishi';
export interface ResponseInfo {
    vnField: object;
    characterField: object;
}
export declare function init(_ctx: Context): Promise<string>;
export declare function load(_ctx: Context): Promise<void>;
export declare class Init {
    now: string;
    ctx: Context;
    vnSearch: string[];
    chaSearch: string[];
    constructor(_ctx: Context);
    init(): Promise<string>;
    deleteTodayData(): void;
    getNow(): string;
}
