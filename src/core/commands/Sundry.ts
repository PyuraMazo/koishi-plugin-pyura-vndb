import { Command, Context } from 'koishi'

import { CommandType } from "../api/Grand";
import { TaskUnit } from "../api/Types";
import { Registry } from "../Registry";



export function apply(ctx: Context, main: Command<never, never, string[], {}>) {
    main
        .subcommand('.queue', '查看当前群聊的任务队列')
        .alias('vndb.q', 'queue')
        .action(async ({ session }) => {

            const group = Registry.getInstance().register_or_get(session.channelId)
            const queue = group.groupProcesser.copyQueue()

            const running = queue.filter(e => e.activated)
            return `当前群聊有${queue.length}个任务。有${running.length}个正在运行。正在执行${buildRunning(running)}...`;
        })
}

function buildRunning(_run: TaskUnit[]): string[] {
    return _run.map(e => `「${e.type}-${e.value}」`)
}