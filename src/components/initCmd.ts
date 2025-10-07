import { Context, Tables } from 'koishi'
import { VnToday } from './vnToday'
import { CreateImgVT } from "./createImg";
import fs from 'fs'
import path from "path";
import { pipeline } from 'stream/promises';



export interface ResponseInfo {
    vnField: object;
    characterField: object;
}

export async function init(_ctx: Context) {
    return await new Init(_ctx).init();
}

export async function downloadAssets(_ctx: Context): Promise<string[] | string> {
    const res = [];

    const ele = path.join(__dirname, 'elements');
    if (!fs.existsSync(ele)) {
        try {
            let response;
            try {
                response = await _ctx.http.get('https://img.cdn1.vip/i/68dde984e2362_1759373700.webp', {
                    responseType: 'stream',
                    timeout: 3000
                });
            } catch {
                response = await _ctx.http.get('https://qwq.pyuramazo.online/bg.png', {
                    responseType: 'stream',
                    timeout: 3000
                });
            }
            fs.mkdirSync(ele);
            await pipeline(response, fs.createWriteStream(path.join(ele, 'bg.png')));
            res.push('elements初始化成功！');
        } catch (e) {
            res.push(`elements初始化失败：${e.message}}`);
        }
    }
    const temp = path.join(__dirname, 'tempImgs');
    if (!fs.existsSync(temp)) {
        try {
            let response;
            try {
                response = await _ctx.http.get('https://img.cdn1.vip/i/68ddeae4c7eac_1759374052.webp', {
                    responseType: 'stream',
                    timeout: 3000
                });
            } catch {
                response = await _ctx.http.get('https://qwq.pyuramazo.online/error.png', {
                    responseType: 'stream',
                    timeout: 3000
                });
            }
            fs.mkdirSync(temp);
            await pipeline(response, fs.createWriteStream(path.join(temp, 'error.png')));
            res.push('tempImgs初始化成功！');
        } catch (e) {
            res.push(`tempImgs初始化失败：${e.message}}`);
        }
    }
    const font = path.join(__dirname, 'fonts');
    try {
        fs.mkdirSync(font);
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'application/font-ttf,application/font-woff,*/*',
            'Referer': 'https://fonts.googleapis.com/'
        };

        const response1 = await _ctx.http.get('https://qwq.pyuramazo.online/Inner/Fonts/GeTeShiZiTi-1.ttf', {
            responseType: 'stream',
            headers,
            timeout: 60000
        })
        await pipeline(response1, fs.createWriteStream(path.join(font, 'GeTeShiZiTi-1.ttf')));

        const response2 = await _ctx.http.get('https://qwq.pyuramazo.online/Inner/Fonts/simhei.ttf', {
            responseType: 'stream',
            headers,
            timeout: 60000
        })
        await pipeline(response2, fs.createWriteStream(path.join(font, 'simhei.ttf')));

        const response3 = await _ctx.http.get('https://qwq.pyuramazo.online/Inner/Fonts/Hangyaku-L3oaG.ttf', {
            responseType: 'stream',
            headers,
            timeout: 60000
        })
        await pipeline(response3, fs.createWriteStream(path.join(font, 'Hangyaku-L3oaG.ttf')));

        res.push('tempImgs初始化成功！');
    } catch (e) {
        res.push(`tempImgs初始化失败：${e.message}}`);
    }
    if (res.length === 0) return '所有资源文件已经初始化！'
    return res;
}

export async function load(_ctx: Context) {
    _ctx.model.extend("vn_today_data", {
        id: "unsigned",
        date: "string",
        cmd: "text"
    }, {
        primary: 'id',
        autoInc: true
    })
    new Init(_ctx).deleteTodayData();
}


export class Init {
    now: string;
    ctx: Context;
    vnSearch: string[] = ["alttitle", "title", "released", "image{url}", "rating", "developers{original,name}"];
    chaSearch: string[] = ["original", "name", "image{url}", "vns{alttitle,title,rating}"];

    constructor(_ctx: Context) {
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
            this.ctx.logger.warn("数据库记录了错误的数据，需要排查错误！！");
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
