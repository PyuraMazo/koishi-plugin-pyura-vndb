import { Context, Session } from "koishi";
import { VnMethod, ProducerMethod, CharacterMethod } from "./categories"
import { Config } from "..";

export interface transferObj {
    startTips: boolean;
}

export interface api {
    searchKey: string[];
    category: string;
    apiUrl: string;
    payload: object;
    header: object;
    cateObj: object;
    scheme: number;
    ctx: Context;
    userConfig: transferObj;
    session: Session;
}

export class RequestApi implements api {
    searchKey: string[];
    category: string;
    apiUrl: string;
    payload: object;
    header: object = {
        "Content-Type": "application/json"
    }
    cateObj: VnMethod | ProducerMethod | CharacterMethod;
    scheme: number;
    ctx: Context;
    userConfig: transferObj = {
        startTips: false
    };
    session: Session;
    


    constructor (_searchKey: string[], _category: string, _scheme: number, _ctx: Context, _session: Session) {
        this.scheme = _scheme;
        this.searchKey = _searchKey;
        this.category = _category;
        this.apiUrl = "https://api.vndb.org/kana/" + _category;
        this.ctx = _ctx;
        this.transferConfig(_ctx.config);
        this.session = _session;
    }

    async run() {
        const reqs = await this.go(this.session);
        const cmdArr: string[] = await Promise.all(reqs);
        cmdArr.forEach(v => {
          try {
            this.session.sendQueued(v);
          } catch {
            this.session.send(`${`某些消息发送失败，重试可能解决问题`}`)
          }
        })
    }

    async go(_session: Session): Promise<Promise<string>[]> {
        try {
            let requests: Promise<string>[] = [];
            
            // 初始化分类对象
            switch (this.category) {
              case "vn":
                this.cateObj = new VnMethod(this.scheme);
                break;
              case "producer":
                this.cateObj = new ProducerMethod(this.ctx);
                break;
              case "character":
                this.cateObj = new CharacterMethod(this.scheme);
                break;
              default:
                throw new Error(`未知的分类: ${this.category}`);
            }
        
            // 为每个搜索关键词创建请求
            requests = this.searchKey.map(async (v) => {
              const resWords = this.cateObj.resWords.concat(
                this.category === "vn" || this.category === "character" 
                  ? (this.cateObj as VnMethod | CharacterMethod).innerWords 
                  : []
              );
              
              this.payload = this.buildPayload(v, resWords, "search");
              
              const res = await this.request(this.apiUrl, this.payload, this.header);
              if (res["results"].length === 0) {
                _session.send(`没有关键词~${v}~的搜索结果，注意简繁体`);
                return;
              }

              const cmd = this.category === "producer"
              ? await (this.cateObj as ProducerMethod).run(res)
              : await (this.cateObj as VnMethod | CharacterMethod).run(this.scheme, res);
              
              return cmd;
            });

            if (this.userConfig.startTips) {
              _session.send("查找开始...")
            }
            
            return requests;
          } catch (error) {
            console.error('执行过程中出错:', error);
            _session.send('操作失败: ' + error.message);
          }
    }

    transferConfig (_config: Config) {
        this.userConfig.startTips = _config.startTips;
    }

    buildPayload (_searchKey: string, _expectWords: string[], standard: string): object {
        return {
            "filters": [standard, "=", _searchKey],
            "fields": _expectWords.join(",")
        }
    }

    async request (_url: string, _payload: object, _header: object) {
        return await this.ctx.http.post(_url, _payload, {headers: _header});
    }
}

export default RequestApi;
