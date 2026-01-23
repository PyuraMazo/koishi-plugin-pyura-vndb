import { Command, Context } from 'koishi'


import { CommandType } from "../api/Grand";
import { TaskUnit } from "../api/Types";
import { Registry } from "../Registry";

export function apply(ctx: Context, main: Command<never, never, string[], {}>) {
    main
        .subcommand('.vn <keyword:text>', '查询作品')
        .alias('vndb.v', 'vn')
        .action(async ({ session }, keyword) => {
            const task: TaskUnit = {
                type: CommandType.VN,
                value: keyword,
                activated: false,
                session: session
            }

            const group = Registry.getInstance().register_or_get(session.channelId)
            group.groupProcesser.push(task);
        })
}