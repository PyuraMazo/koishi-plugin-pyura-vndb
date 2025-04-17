import { Context } from "koishi";
export declare class VnToday {
    todayDate: string;
    dateArr: string[];
    response: string;
    ctx: Context;
    method: string;
    search: string;
    constructor(_date: string, _response: string[], _ctx: Context, _method: string, _search: string);
    run(): Promise<string>;
    request(_method: string, _search: string, _response: string, _dateArr: string[]): Promise<object[]>;
}
