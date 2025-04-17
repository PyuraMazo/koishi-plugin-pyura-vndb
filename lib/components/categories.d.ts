import { HandleOutput, argSet } from "../tools/handleOutput";
import { Context } from "koishi";
export interface categoryBase {
    resWords: string[];
    chsWords: string[];
    currentChoice: argSet;
}
export declare class VnMethod extends HandleOutput implements categoryBase {
    innerWords: string[];
    resWords: string[];
    chsWords: string[];
    miniOptions: number[];
    currentChoice: argSet;
    constructor(_scheme: number);
    run(_scheme: number, _resObj: object): Promise<string>;
    buildMini(): string[][];
    buildMoreCmdStr(_resObj: object): string;
    buildlessCmdStr(_resObj: object): string;
}
export declare class ProducerMethod extends HandleOutput implements categoryBase {
    currentId: string;
    resWords: string[];
    resWordsVn: string[];
    chsWords: string[];
    currentChoice: argSet;
    ctx: Context;
    constructor(_ctx: Context);
    run(_resObj: object): Promise<string>;
    buildCmdStr(_resObj: object): Promise<string>;
    releaseWork(): Promise<string>;
}
export declare class CharacterMethod extends HandleOutput implements categoryBase {
    innerWords: string[];
    resWords: string[];
    chsWords: string[];
    miniOptions: number[];
    currentChoice: argSet;
    constructor(_scheme: number);
    run(_scheme: number, _resObj: object): Promise<string>;
    buildMini(): string[][];
    buildMoreCmdStr(_resObj: object): string;
    buildlessCmdStr(_resObj: object): string;
}
