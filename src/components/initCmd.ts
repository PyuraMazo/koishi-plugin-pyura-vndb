import { Context, Tables } from 'koishi'
import { VnToday } from './vnToday'
import { CreateImgVT } from "./createImg";


export interface ResponseInfo {
    vnField: object;
    characterField: object;
}

export async function init (_ctx: Context) {
    return await new Init(_ctx).init();
  }


export class Init {
    now: string;
    ctx: Context;
    vnSearch: string[] = ["alttitle","title","released","image{url}","rating"];
    chaSearch: string[] = ["original","name","image{url}","vns{alttitle,title,rating}"];

    constructor (_ctx: Context) {
        this.now = this.getNow();
        this.ctx = _ctx;
    }

    async init(): Promise< string> {
        this.ctx.model.extend("vndbDate", {
            id: "unsigned",
            date: "string",
            cmd: "text"
        }, {
            primary: 'id',
            autoInc: true
        })

        const res: Tables["vndbDate"][] = await this.ctx.database.get("vndbDate", {
            date: this.now
        })
        if (res.length === 0) {
            const vnRes = new VnToday(this.now, this.vnSearch, this.ctx, "vn", "released").run();
            const chaRes = new VnToday(this.now, this.chaSearch, this.ctx, "character", "birthday").run();
            const wait = await Promise.all([vnRes, chaRes]);

            const img = await new CreateImgVT(this.ctx, wait).run();

            this.ctx.database.create("vndbDate", {
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



    getNow() {
        const now = new Date();
        const year = String(now.getFullYear());
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

}
