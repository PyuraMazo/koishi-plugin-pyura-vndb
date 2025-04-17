import { Context, Session } from "koishi";
import { VnMethod, ProducerMethod, CharacterMethod } from "./categories";
import { Config } from "..";
export interface transferObj {
    startTips: boolean;
}
export interface api {
    searchKey: string[];
    category: string;
    apiUrl: string;
    payload: object;
    header: object;
    cateObj: object;
    scheme: number;
    ctx: Context;
    userConfig: transferObj;
    session: Session;
}
export declare class RequestApi implements api {
    searchKey: string[];
    category: string;
    apiUrl: string;
    payload: object;
    header: object;
    cateObj: VnMethod | ProducerMethod | CharacterMethod;
    scheme: number;
    ctx: Context;
    userConfig: transferObj;
    session: Session;
    constructor(_searchKey: string[], _category: string, _scheme: number, _ctx: Context, _session: Session);
    run(): Promise<void>;
    go(_session: Session): Promise<Promise<string>[]>;
    transferConfig(_config: Config): void;
    buildPayload(_searchKey: string, _expectWords: string[], standard: string): object;
    request(_url: string, _payload: object, _header: object): Promise<any>;
}
export default RequestApi;
