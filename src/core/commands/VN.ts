import { Command, Context } from 'koishi'


import { CommandType } from "../api/Grand";
import { TaskUnit, Options } from "../api/Types";
import { Registry } from "../Registry";

export function apply(ctx: Context, main: Command<never, never, string[], {}>) {
    main
        .subcommand('.vn <keyword:text>', '查询作品')
        .option('refresh', '-r', { fallback: false })
        .alias('vndb.v', 'vn')
        .action(async ({ session, options }, keyword) => {
            const task: TaskUnit = {
                type: CommandType.VN,
                value: keyword,
                activated: false,
                session: session,
                options: options
            }
            
            const group = Registry.getInstance().register_or_get(session.channelId)
            group.groupProcesser.push(task);
        })
}