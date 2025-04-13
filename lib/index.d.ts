import { Context, Schema } from 'koishi';
export declare const name = "vndb";
export interface Config {
    startTips: boolean;
}
export declare const Config: Schema<Config>;
export declare const inject: {
    required: string[];
};
export declare function apply(ctx: Context): void;
