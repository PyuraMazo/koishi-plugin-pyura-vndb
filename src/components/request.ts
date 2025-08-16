import { Context, Session } from "koishi";
import { VnMethod, ProducerMethod, CharacterMethod } from "./categories"



export interface api {
    searchKey: string[];
    category: string;
    apiUrl: string;
    payload: object;
    header: object;
    cateObj: object;
    scheme: number;
    ctx: Context;
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
    session: Session;
    startTips: boolean;
    


    constructor (_searchKey: string[], _category: string, _scheme: number, _ctx: Context, _session: Session) {
        this.scheme = _scheme;
        this.searchKey = _searchKey;
        this.category = _category;
        this.apiUrl = "https://api.vndb.org/kana/" + _category;
        this.ctx = _ctx;
        this.startTips = _ctx.config.startTips;
        this.session = _session;
    }

    async run() {
        const reqs = await this.go(this.session);
        if (!reqs) return;
        const cmdArr: string[] = await Promise.all(reqs);
        cmdArr.forEach(v => {
          try {
            this.session.sendQueued(v);
          } catch {
            this.session.send(`${`某些消息发送失败，重试或解决问题`}`)
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
              
              this.payload = this.buildPayload(v, resWords, "search", this.scheme);
              
              const res = await this.request(this.apiUrl, this.payload, this.header);
              if (!res) {
                _session.send("执行失败...网络请求失败...增加重试次数或解决问题。");
                return;
              }
              else if (res["results"].length === 0) {
                _session.send(`没有关键词~${v}~的搜索结果，注意简繁体`);
                return;
              }

              const cmd = this.category === "producer"
              ? await (this.cateObj as ProducerMethod).run(res)
              : await (this.cateObj as VnMethod | CharacterMethod).run(this.scheme, res);
              
              return cmd;
            });

            if (this.startTips) {
              _session.send("查找开始...")
            }
            
            return requests;
          } catch (error) {
            console.error('执行过程中出错:', error);
            _session.send('操作失败: ' + error.message);
          }
    }

    buildPayload (_searchKey: string, _expectWords: string[], _standard: string, _scheme: number): object {
        if (_scheme === 1) {
          return {
            "filters": [_standard, "=", _searchKey],
            "fields": _expectWords.join(","),
            "results": 1
        }} else {
          return {
            "filters": [_standard, "=", _searchKey],
            "fields": _expectWords.join(",")
        }}

    }

    async request (_url: string, _payload: object, _header: object) {
      let res = {};

      let retry = 0; 
      while (retry <= this.ctx.config.retryCount) {
        try{
          retry++;
          res = await this.ctx.http.post(_url, _payload, {headers: _header});
          break;
        } catch(err) {
          if (this.ctx.config.debug) console.log(`第${retry}次请求api失败...`);
        }
      }

      return res;
    }
}

export default RequestApi;
