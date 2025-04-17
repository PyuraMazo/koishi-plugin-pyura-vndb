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
  
  init(ctx);
  
  
  ctx
  .command('vndb <...searchKey: string>', '查找vndb中的搜索结果')
  .option("method", "-m <methodType: string> 搜索类型（vn/producer/character）")
  .option("scheme", "-s <schemeKey: number> 显示方案（0/1）")
  .usage('~不指定选项时默认搜索视觉小说并输出简约的信息结果~')
  .example('①vndb -m character -s 1 水上由岐\n显示更全面的角色-水上由岐的信息\n②vndb -m producer AUGUST 枕\n显示简约的出版商AUGUST、枕社的信息')
  .action(async ({session, options}, ...searchKey) => {
    
    const method: string = options["method"] || "vn";
    const scheme: number = options["scheme"] || 0;

    new RequestApi(searchKey, method, scheme, ctx, session).run();
  })


  ctx
  .command('vntoday')
  .action(async ({session}) => {
    session.send(await init(ctx));
  })
}
