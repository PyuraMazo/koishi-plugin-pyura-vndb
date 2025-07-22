import { Context } from "koishi";


export class VnToday {
    todayDate: string;
    dateArr: string[];
    response: string;
    ctx: Context;
    method: string;
    search: string;
    rate_filter: number;

    constructor (_date: string, _response: string[], _ctx: Context, _method: string, _search: string, _rate_filter?: number) {
        this.todayDate = _date;
        this.dateArr = _date.split("-");
        this.response = _response.join(",");
        this.ctx = _ctx;
        this.method = _method;
        this.search = _search;
        this.rate_filter = _rate_filter || 0;
    }

    async run(): Promise<string> {
        const res = await this.request(this.method, this.search, this.response, this.dateArr);
        let str = "";
        if (this.method === "vn") {
            str += "那年今天，这些作品发布了...\n";
            for (const v of res) {
                if (!v["rating"] || v["rating"] <= 75) {
                    continue;
                }
                str += v["image"]["url"] ? `<img src="${v["image"]["url"]}"/>` : "图片出错了！\n";
                str += await this.polishText(PolishText.Vn, v["released"], v["alttitle"] || v["title"]);
            }
            if (str === "那年今天，这些作品发布了...\n") {
                str = "今天没有热门的GAL/VN横空出世，真是乏味的一天...\n"
            }
        } else if (this.method === "character") {
            str += "<message>今天是这些角色的生日...\n\n";
            for (const v of res) {
                if (!v["vns"][0]["rating"] || v["vns"][0]["rating"] <= 75) {
                    continue;
                }
                str += v["image"] ? `<img src="${v["image"]["url"]}"/>` : "图片出错了！\n";
                str += await this.polishText(PolishText.Cha, v["vns"][0]["alttitle"] || v["vns"][0]["title"], v["original"] || v["name"]);
            }
            if (str == "<message>今天是这些角色的生日...\n\n") {
                str = "<message>今天没有令人印象深刻的角色诞生呢，真不巧...\n\n"
            }
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

    async polishText(_unique: PolishText, ..._info: string[]): Promise<string> {
        let index = 0;
        
        
        let x: string[] = [];
        switch (_unique) {
            case PolishText.Vn:
                x = [
                    "{}这一天，《{}》横空出世！时光飞逝，但经典永不褪色！",
                    "【本日発売！】{}，新作《{}》正式发售。",
                    "{}，数年前的今天，《{}》的发售仍然历历在目！",
                    "正是{}这一天，《{}》的出现为GAL界添砖加瓦。",
                    "今天是{}发布的《{}》的周年庆！",
                    "{}，当《{}》首次亮相时，多少玩家的青春被它点燃！"
                ]
                break;
            case PolishText.Cha:
                x = [
                    "你玩过《{}》吗？今天是{}的生日哦~",
                    "正是今天，《{}》中的{}悄然诞生。",
                    "今天是《{}》中{}的生日，这是属于TA的日子！",
                    "在这个特别的日子里，《{}》的{}迎来了自己的生日，你还记得关于TA的故事吗？",
                    "一年一度的日子又到了！你还记得今天是属于《{}》中{}的日子吗？"
                ]
                break;
            default:
                break;
        }

        return (await this.getOne(x) + "\n-----\n").replace(/\{\}/g, () => {
            return _info[index++] ?? ''
        });
    }

    async getOne(array: string[]): Promise<string> {
        return array[Math.floor(Math.random() * array.length)];
    }

}


const enum PolishText {
    Vn,
    Cha
}

