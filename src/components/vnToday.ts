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

    async run(): Promise<Object[]> {
        return this.request(this.method, this.search, this.response, this.dateArr);
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

