import { Command, Context } from 'koishi'

import { CommandType } from "../api/Grand";
import { TaskUnit } from "../api/Types";
import { Registry } from "../Registry";

export function apply(ctx: Context, main: Command<never, never, string[], {}>) {
    main
        .subcommand('.event [date: string]', '查询今天历史发布、角色生日')
        .alias('vndb.e', 'event')
        .action(async ({ session }, date) => {
            let formatedDate;
            const now = new Date();
            const year = now.getFullYear();
            if (date) {
                const cut = date.split('-');
                if (cut.length === 2) {
                    try {
                        formatedDate = `${year}-${turnValidDate(cut)}`;
                    } catch {
                        return '日期错误！'
                    }
                } else {
                    return '日期格式错误！应为MM-DD格式。';
                }
            } else {
                const cut = now.toLocaleDateString().split('/')
                cut.shift();
                formatedDate = `${year}-${turnValidDate(cut)}`;
            }
            
            
            const task: TaskUnit = {
                type: CommandType.Event,
                value: formatedDate,
                activated: false,
                session: session
            }

            const group = Registry.getInstance().register_or_get(session.channelId)
            group.groupProcesser.push(task);
        })
}

function turnValidDate(_number: string[]){
    const n1 = Number(_number[0]);
    const n2 = Number(_number[1]);
    if (isNaN(n1) || isNaN(n2) || !Number.isInteger(n1 + n2)) {
        throw Error;
    } else {
        return `${_number[0].padStart(2, '0')}-${_number[1].padStart(2, '0')}`
    }
}