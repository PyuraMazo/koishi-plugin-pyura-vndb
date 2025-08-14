export interface argSet {
    argSourceArr: string[];
    argChsArr: string[];
    argConnSymbol: string;
    kindKey2Value: number[];
    kindkey2Arr: number[];
}
export declare class HandleOutput {
    outputWholeArr(_arr: string[], _conn: string): string;
    outputMoreLangTitles(_singleObj: object): string;
    outputlessLangTitles(_singleObj: object): string;
    outputObjProperties(_innerObj: object, _properties: string[], _chsMatch: string[]): string;
    outputCoverImg(_singleObj: object): string;
    outputProducersInfo(_singleObj: object): string;
    outputVnVnDevstatus(_singleObj: object): string;
    outputProducerName(_singleObj: object): string;
    outputProducerType(_singleObj: object): string;
    outputCharacterGenderMatch(_gender: string): string;
    outputCharacterGenderMore(_singleObj: object): string;
    outputCharacterGenderLess(_singleObj: object): string;
    outputCharacterVns(_singleObj: object): string;
    outputCharacterBWH(_singleObj: object): string | null;
}
export default HandleOutput;
