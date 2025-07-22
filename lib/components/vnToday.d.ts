import { Context } from "koishi";
export declare class VnToday {
    todayDate: string;
    dateArr: string[];
    response: string;
    ctx: Context;
    method: string;
    search: string;
    rate_filter: number;
    constructor(_date: string, _response: string[], _ctx: Context, _method: string, _search: string, _rate_filter?: number);
    run(): Promise<string>;
    request(_method: string, _search: string, _response: string, _dateArr: string[]): Promise<object[]>;
    polishText(_unique: PolishText, ..._info: string[]): Promise<string>;
    getOne(array: string[]): Promise<string>;
}
declare const enum PolishText {
    Vn = 0,
    Cha = 1
}
export {};
