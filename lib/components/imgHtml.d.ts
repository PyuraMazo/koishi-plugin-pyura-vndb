export declare class VnTodayHtml {
    content_1: string;
    content_2: string;
    subtitle_1: string;
    subtitle_2: string;
    build(): string;
    insertSubtitle_1(text: string): void;
    insertSubtitle_2(text: string): void;
    insertBlock_1(info: VnTodayInfo_1): void;
    insertBlock_2(info: VnTodayInfo_2): void;
}
export interface VnTodayInfo_1 {
    img: string;
    date: string;
    title: string;
    producer: string;
}
export interface VnTodayInfo_2 {
    img: string;
    name: string;
    game: string;
}
