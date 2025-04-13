import { Context, Schema } from 'koishi'
import RequestApi from './components/request'

export const name = 'pyura-vndb'

export interface Config {
  startTips: boolean
}

export const Config: Schema<Config> = Schema.object({
  startTips: Schema.boolean().default(false).description("开始查找提示")
})

export const inject = {
  required: ["http"]
}

export function apply(ctx: Context) {
  
  ctx
  .command('vndb <search: string> [...more: string]', '查找vndb中的搜索结果')
  .option("method", "-m <method_type: string> 搜索类型（vn/producer/character）")
  .option("scheme", "-s <scheme_key: number> 显示方案（0/1）")
  .usage('~不指定选项时默认搜索视觉小说并输出简约的信息结果~')
  .example('①vndb -m character -s 1 水上由岐\n显示更全面的角色-水上由岐的信息\n②vndb -m producer AUGUSTA\n显示简约的出版商-AUGUSTA的信息')
  .action(async ({session, options}, search, ...more) => {
    
    const method = options["method"] ? options["method"] : "vn";
    const scheme = options["scheme"] ? options["scheme"] : 0;
    const wholeKeys = [search].concat(more);

    new RequestApi(wholeKeys, method, scheme, ctx, session).run();
  })
}
