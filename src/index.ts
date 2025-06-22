import { Context, Schema } from 'koishi'
import RequestApi from './components/request'
import { init } from './components/init'


export const name = 'pyura-vndb'

export interface Config {
  startTips: boolean
}

export const Config: Schema<Config> = Schema.object({
  startTips: Schema.boolean().default(false).description("开始查找提示")
})

declare module "koishi" {
  interface Tables {
    vndbDate: {
      id: number;
      date: string;
      cmd: string;
    };
  }
}

export const inject = {
  required: ["http", "database"]
}

export function apply(ctx: Context) {
  
  // init(ctx);
  
  
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


  // ctx
  // .command('vntoday', '看看今天是什么特殊的日子')
  // .action(async ({session}) => {
  //   session.send(await init(ctx));
  // })
}
