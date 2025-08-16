import { Context, Session } from "koishi";
import { VnMethod, ProducerMethod, CharacterMethod } from "./categories";
export interface api {
    searchKey: string[];
    category: string;
    apiUrl: string;
    payload: object;
    header: object;
    cateObj: object;
    scheme: number;
    ctx: Context;
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
    session: Session;
    startTips: boolean;
    constructor(_searchKey: string[], _category: string, _scheme: number, _ctx: Context, _session: Session);
    run(): Promise<void>;
    go(_session: Session): Promise<Promise<string>[]>;
    buildPayload(_searchKey: string, _expectWords: string[], _standard: string, _scheme: number): object;
    request(_url: string, _payload: object, _header: object): Promise<{}>;
}
export default RequestApi;
