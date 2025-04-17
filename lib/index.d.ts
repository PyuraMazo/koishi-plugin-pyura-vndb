import { Context, Schema } from 'koishi';
export declare const name = "pyura-vndb";
export interface Config {
    startTips: boolean;
}
export declare const Config: Schema<Config>;
declare module "koishi" {
    interface Tables {
        vndbDate: {
            id: number;
            date: string;
            cmd: string;
        };
    }
}
export declare const inject: {
    required: string[];
};
export declare function apply(ctx: Context): void;
