import { Context } from 'koishi'
// import * as Admin from "./Admin";
import * as VN from './VN'
import * as Character from './Character'
import * as Producer from './Producer'
import * as ID from './ID'
import * as Event from "./Event";
import * as Sundry from "./Sundry";



export function apply(ctx: Context) {
    const main = ctx.command('vndb');

    // Admin.apply(ctx, main);

    VN.apply(ctx, main);
    Character.apply(ctx, main);
    Producer.apply(ctx, main);
    ID.apply(ctx, main);
    Event.apply(ctx, main);

    Sundry.apply(ctx, main);
}