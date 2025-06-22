import { Context } from "koishi";


export class VnToday {
    todayDate: string;
    dateArr: string[];
    response: string;
    ctx: Context;
    method: string;
    search: string;

    constructor (_date: string, _response: string[], _ctx: Context, _method: string, _search: string) {
        this.todayDate = _date;
        this.dateArr = _date.split("-");
        this.response = _response.join(",");
        this.ctx = _ctx;
        this.method = _method;
        this.search = _search;
    }

    async run(): Promise<string> {
        const res = await this.request(this.method, this.search, this.response, this.dateArr);
        let str = "";
        if (this.method === "vn") {
            str += "那年今天，这些GAL/VN发布了...\n";
            res.forEach(v => {
                str += v["image"]["url"] ? `<img src="${v["image"]["url"]}"/>` : "图片出错了！\n";
                str += `${v["released"]}《${v["alttitle"] || v["title"]}》发布了！\n-----\n`
            })
        } else if (this.method === "character") {
            str += "<message>你知道吗，今天是这些角色的生日，有你认识的吗？\n\n";
            res.forEach(v => {
                str += v["image"] ? `<img src="${v["image"]["url"]}"/>` : "图片出错了！\n";
                str += `出自《${v["vns"][0]["alttitle"] || v["vns"][0]["title"]}》的${v["original"] || v["name"]}\n-----\n`;
            })
        }

        
        return `<message>${str}</message>`
    }

    async request(_method: string, _search: string, _response: string, _dateArr: string[]): Promise<object[]> {
        

        let payload: object;
        if (_method === "vn") {
            let filters: (string | string[])[] = ["or"];
            for (let i = 2000; i < new Date().getFullYear(); i++) {
                filters.push([_search, "=", `${String(i)}-${_dateArr[1]}-${_dateArr[2]}`])
            }
            payload = {
                "filters": filters,
                "fields": this.response
            }
        } else if (_method === "character") {
            payload = {
                "filters": [_search, "=", [Number(_dateArr[1]), Number(_dateArr[2])]],
                "fields": this.response
            }
        }

        const obj = await this.ctx.http.post("https://api.vndb.org/kana/" + _method, payload, {headers: {
            "Content-Type": "application/json"
        }})
        return obj["results"];
    }

}

