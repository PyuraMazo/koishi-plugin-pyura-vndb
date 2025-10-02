import { Context, Schema } from 'koishi'
import RequestApi from './components/request'
import { init, load, downloadAssets } from './components/initCmd'
import {} from 'koishi-plugin-puppeteer'


export const name = 'pyura-vndb'

export interface Config {
  startTips: boolean,
  retryCount: number,
  filterRating: number,
  debug: boolean
}

export const Config: Schema<Config> = Schema.intersect([
  Schema.object({
    startTips: Schema.boolean().default(false).description("开始查找提示"),
    retryCount: Schema.number().min(0).max(5).default(2).description("最大请求重试次数")
  }).description('全局配置'),

  Schema.object({
    filterRating: Schema.number().min(60).max(85).default(70).description("过滤低于此评分的作品的内容展示"),
    font: Schema.boolean().default(true).description("启用特殊字体")
  }).description('VnToday配置'),

  Schema.object({
    debug: Schema.boolean().default(false).description("输出详细日志")
  }).description('开发者模式')
]
)


declare module "koishi" {
  interface Tables {
    vn_today_data: {
      id: number;
      date: string;
      cmd: string;
    };
  }
}

export const inject = {
  required: ["http", "database"],
  optional: ["puppeteer"]
}

export async function apply(ctx: Context) {
  if (ctx.config.debug) ctx.logger.warn("插件重载，删除当日数据库信息。");
  load(ctx);
  
  const resp = downloadAssets(ctx);
  if (ctx.config.debug) ctx.logger.warn(await resp);
  
  ctx
  .command('vndb <...searchKey: string>', '查找vndb中的搜索结果')
  .option("method", "-m <methodType: string> 搜索类型（vn/producer/character）")
  .option("fuzzy", "-f 开启模糊搜索")
  .usage('~不指定选项时默认搜索视觉小说并输出简约的信息结果~')
  .example('①vndb -m character -f 爱丽丝\n模糊查找名字中带有-爱丽丝-的人物\n②vndb -m producer AUGUST 枕\n仅查找出版商AUGUST、枕社的信息')
  .action(async ({session, options}, ...searchKey) => {
    
    const method: string = options["method"] || "vn";
    const scheme: number = options["fuzzy"] ? 0 : 1;

    new RequestApi(searchKey, method, scheme, ctx, session).run();
  })


  ctx
  .command('vntoday', '看看今天是什么特殊的日子')
  .action(async ({session}) => {
    return await init(ctx);
  })
}
