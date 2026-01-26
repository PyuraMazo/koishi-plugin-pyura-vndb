import path from "path";

import { Context, Schema, HTTP, Logger, Database, Tables, Types } from 'koishi'
import Puppteer from 'koishi-plugin-puppeteer'

import { Initialization } from "./core/Initialization";
import { Config as PluginConfig } from './core/api/Types'
import * as main from "./core/commands/Index";



export const name = 'pyura-vndb'

export let logger: Logger;
export let http: HTTP;
export let pptr: Puppteer;
export let db: Database<Tables, Types, Context>;
export let dataDir: string;
export const dbName = 'vndb';


declare module "koishi" {
  interface Tables {
    vndb: {
      id: number;
      date: Date;
      type: string;
      keyword: string;
    }
  }
}

export const Config: Schema<PluginConfig> = Schema.intersect([
  Schema.object({
    retryCount: Schema.number().min(1).max(10).default(3).description("请求服务器时最大重连次数"),
    withdrawTips: Schema.boolean().default(false).description("当本次任务发送成功后撤回提示消息"),
    adminsId: Schema.array(String).description("管理员ID列表"),
    detailLog: Schema.boolean().default(true).description("在控制台输出更详细的日志信息")
  }).description('全局配置'),

  Schema.object({
    processHandling: Schema.number().min(3).max(10).default(5).description("各群组并发处理数"),
    outputContent: Schema.array(Schema.union(['以图片方式发送', '以文本形式发送（数量受限）'])).role('checkbox').default(['以图片方式发送']).description("发送形式选项（至少选一个）"),
    backgroundPath: Schema.path().experimental().description("为生成的图片设置自定义的长背景图路径（jpg格式）"),
    fontPath: Schema.path().experimental().description("为生成的图片设置自定义的字体路径（ttf格式）"),
    isMerge: Schema.boolean().default(true).description("合并发送文字结果的多个内容")
  }).description('搜索通用配置'),

  Schema.object({
    characterOptions: Schema
      .array(Schema.union(['a-血型', 'b-身高/体重', 'c-性别（不剧透）', 'd-真实性别（含剧透）', 'e-三围', 'f-罩杯', 'g-简介（未翻译）']))
      .role('checkbox')
      .description("人物信息额外配置，无数据时不发送"),
  }).description('vndb.character指令配置'),

  Schema.object({
    maxImageNumber: Schema.number().min(3).max(100).default(10).description("以图片发送时显示的最多代表作品数（数字越大渲染时间越久）")
  }).description('vndb.producer指令配置'),

  Schema.object({
    lowestRating: Schema.number().min(60).max(95).default(75).description("仅展示rating不低于此值的作品及其角色")
  }).description('vndb.event指令配置'),

  Schema.object({
    dataStorage: Schema.number().min(0).default(3).description("数据库和本地缓存清理时间（0表示永不自动清理，配置更新仍会立刻清空以更新）")
  }).description('缓存配置')
]
)


export const inject = {
  required: ["http", "database", "puppeteer"]
}


export function apply(ctx: Context) {
  ctx.on('ready', async () => {
    ctx.model.extend(dbName, {
      id: 'unsigned',
      date: 'date',
      type: 'string',
      keyword: 'string'
    }, {
      primary: 'id',
      autoInc: true
    })
    logger = ctx.logger(name);
    http = ctx.http;
    pptr = ctx.puppeteer;
    db = ctx.database;
    dataDir = path.join(ctx.baseDir, 'data', name);

    await Initialization.getInstance().globalInit(ctx.http, ctx.config);
  })

  ctx.on('dispose', async () => {

  })


  main.apply(ctx);
}
