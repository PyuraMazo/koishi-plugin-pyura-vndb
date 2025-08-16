import { Context, Tables } from 'koishi'
import { VnToday } from './vnToday'
import { CreateImgVT } from "./createImg";


export interface ResponseInfo {
    vnField: object;
    characterField: object;
}

export async function init(_ctx: Context) {
    return await new Init(_ctx).init();
}

export async function load(_ctx: Context) {
    new Init(_ctx).deleteTodayData();
}


export class Init {
    now: string;
    ctx: Context;
    vnSearch: string[] = ["alttitle","title","released","image{url}","rating","developers{original,name}"];
    chaSearch: string[] = ["original","name","image{url}","vns{alttitle,title,rating}"];

    constructor (_ctx: Context) {
        this.now = this.getNow();
        this.ctx = _ctx;
    }

    async init(): Promise<string> {
        this.ctx.model.extend("vn_today_data", {
            id: "unsigned",
            date: "string",
            cmd: "text"
        }, {
            primary: 'id',
            autoInc: true
        })

        const res: Tables["vn_today_data"][] = await this.ctx.database.get("vn_today_data", {
            date: this.now
        })
        if (res.length === 0) {
            const vnRes = new VnToday(this.now, this.vnSearch, this.ctx, "vn", "released").run();
            const chaRes = new VnToday(this.now, this.chaSearch, this.ctx, "character", "birthday").run();
            const wait = await Promise.all([vnRes, chaRes]);

            if (!wait[0] || !wait[1]) return "执行失败...网络请求失败...增加重试次数或解决问题。";

            const img = await new CreateImgVT(this.ctx, wait).run();

            this.ctx.database.create("vn_today_data", {
                date: this.now,
                cmd: img
            })

            return img;
        } else if (res.length === 1) {
            return res[0].cmd;
        } else {
            console.log("数据库记录了错误的数据，需要排查错误！！");
        }

    }

    deleteTodayData() {
        this.ctx.database.remove("vn_today_data", {
            date: this.now
        })
    }

    getNow() {
        const now = new Date();
        const year = String(now.getFullYear());
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

}
