import { Context, Schema } from 'koishi';
export declare const name = "pyura-vndb";
export interface Config {
    startTips: boolean;
    retryCount: number;
    filterRating: number;
    debug: boolean;
}
export declare const Config: Schema<Config>;
declare module "koishi" {
    interface Tables {
        vn_today_data: {
            id: number;
            date: string;
            cmd: string;
        };
    }
}
export declare const inject: {
    required: string[];
    optional: string[];
};
export declare function apply(ctx: Context): Promise<void>;
