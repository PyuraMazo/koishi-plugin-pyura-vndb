var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Config: () => Config,
  apply: () => apply,
  inject: () => inject,
  name: () => name
});
module.exports = __toCommonJS(src_exports);
var import_koishi = require("koishi");

// src/tools/handleOutput.ts
var HandleOutput = class {
  static {
    __name(this, "HandleOutput");
  }
  // 把数组内容依次拼接
  outputWholeArr(_arr, _conn) {
    return _arr.join(_conn);
  }
  // 更完整的标题
  outputMoreLangTitles(_singleObj) {
    let str = "";
    _singleObj["titles"].forEach((v) => {
      if (v["lang"] === "en") {
        str += `英文标题（${v["official"] ? "官方" : "非官方"}）：${v["title"]}
`;
      } else if (v["lang"] === "ja") {
        str += `日语标题（${v["official"] ? "官方" : "非官方"}）：${v["title"]}
`;
      } else if (v["lang"] === "zh-Hans" || v["lang"] === "zh-Hant") {
        str += `中文标题（${v["official"] ? "官方" : "非官方"}）：${v["title"]}
`;
      }
    });
    return str;
  }
  // 简单的标题
  outputlessLangTitles(_singleObj) {
    let str = "";
    _singleObj["titles"].forEach((v) => {
      if (v["lang"] === "ja") {
        str += `日语标题（${v["official"] ? "官方" : "非官方"}）：${v["title"]}
`;
      } else if (v["lang"] === "zh-Hans" || v["lang"] === "zh-Hant") {
        str += `中文标题（${v["official"] ? "官方" : "非官方"}）：${v["title"]}
`;
      }
    });
    return str;
  }
  outputObjProperties(_innerObj, _properties, _chsMatch) {
    let str = "";
    _properties.forEach((v, i, arr) => {
      str += `${_chsMatch[i]}：${String(_innerObj[v])}`;
      if (i !== arr.length - 1) {
        str += "\n";
      }
    });
    return str;
  }
  // 一张封面图的url
  outputCoverImg(_singleObj) {
    try {
      return `<img src="${_singleObj["image"]["url"]}"/>`;
    } catch {
      return "---图片链接失效！\n";
    }
  }
  // 出版商名+id
  outputProducersInfo(_singleObj) {
    let str = "出版商（id）：";
    _singleObj["developers"].forEach((v) => {
      str += v["original"] || `${v["name"]}`;
      str += `（${String(v["id"])}）
`;
    });
    return str;
  }
  outputVnVnDevstatus(_singleObj) {
    const num = _singleObj["devstatus"];
    if (num === 0) {
      return "已完成\n";
    } else if (num === 1) {
      return "制作中\n";
    } else if (num === 2) {
      return "已取消\n";
    }
  }
  outputProducerName(_singleObj) {
    let str = "名称：";
    str += _singleObj["original"] || `${_singleObj["name"]}
`;
    return str;
  }
  outputProducerType(_singleObj) {
    const type = _singleObj["type"];
    if (type === "co") {
      return "正式公司\n";
    } else if (type === "in") {
      return "个人\n";
    } else if (type === "ng") {
      return "业余组织\n";
    }
  }
  outputCharacterGenderMatch(_gender) {
    switch (_gender) {
      case "m":
        return "男性";
      case "f":
        return "女性";
      case "o":
        return "双性";
      case "a":
        return "无性";
    }
  }
  outputCharacterGenderMore(_singleObj) {
    if (!_singleObj["gender"]) {
      return "性别：无数据\n";
    }
    return `表面性别：${this.outputCharacterGenderMatch(_singleObj["gender"][0])}
真实性别：${this.outputCharacterGenderMatch(_singleObj["gender"][1])}
`;
  }
  outputCharacterGenderLess(_singleObj) {
    if (!_singleObj["gender"]) {
      return "性别：无数据\n";
    }
    return `性别：${this.outputCharacterGenderMatch(_singleObj["gender"][0])}
`;
  }
  outputCharacterVns(_singleObj) {
    let temp = [];
    _singleObj["vns"].forEach((v) => {
      temp.push(v["alttitle"]);
    });
    return `出场游戏：${temp.join("---")}
`;
  }
  outputCharacterBWH(_singleObj) {
    let temp = [];
    let isNone = 0;
    ["bust", "waist", "hips"].forEach((v) => {
      if (!_singleObj[v]) {
        isNone++;
      }
      temp.push(String(_singleObj[v]));
    });
    if (isNone === 3) {
      return;
    }
    return `三围：${temp.join("-")}
`;
  }
};

// src/tools/autoConnect.ts
function autoConn(_argSet, _singleObj) {
  const ho = new HandleOutput();
  let str = "";
  _argSet.kindKey2Value.forEach((v) => {
    if (!_singleObj[_argSet.argSourceArr[v]]) {
      return;
    }
    str += `${_argSet.argChsArr[v]}：${String(_singleObj[_argSet.argSourceArr[v]])}
`;
  });
  _argSet.kindkey2Arr.forEach((v) => {
    if (_singleObj[_argSet.argSourceArr[v]].length === 0) {
      return;
    }
    str += `${_argSet.argChsArr[v]}：${String(ho.outputWholeArr(_singleObj[_argSet.argSourceArr[v]], _argSet.argConnSymbol))}
`;
  });
  return str;
}
__name(autoConn, "autoConn");

// src/components/categories.ts
var VnMethod = class extends HandleOutput {
  static {
    __name(this, "VnMethod");
  }
  innerWords = ["titles.lang", "titles.title", "titles.official", "image.url", "developers.original", "developers.name"];
  resWords = ["id", "aliases", "devstatus", "released", "platforms", "average", "rating", "length"];
  chsWords = ["vndb唯一id", "别称", "开发状态", "发布日期", "支持平台", "平均分", "贝叶斯评分", "文本长度（1-5）"];
  miniOptions = [2, 3, 4, 5];
  currentChoice = {
    argSourceArr: [],
    argChsArr: [],
    argConnSymbol: "、",
    kindKey2Value: [],
    kindkey2Arr: []
  };
  constructor(_scheme) {
    super();
    if (_scheme === 0) {
      const miniArr = this.buildMini();
      this.currentChoice.argSourceArr = miniArr[0];
      this.currentChoice.argChsArr = miniArr[1];
      this.currentChoice.kindKey2Value = [1, 3];
      this.currentChoice.kindkey2Arr = [2];
    } else if (_scheme === 1) {
      this.currentChoice.argSourceArr = this.resWords;
      this.currentChoice.argChsArr = this.chsWords;
      this.currentChoice.kindKey2Value = [0, 3, 5, 6, 7];
      this.currentChoice.kindkey2Arr = [1, 4];
    }
  }
  async run(_scheme, _resObj) {
    if (_scheme === 0) {
      return this.buildlessCmdStr(_resObj);
    } else if (_scheme === 1) {
      return this.buildMoreCmdStr(_resObj);
    }
  }
  buildMini() {
    let miniRes = [];
    let miniChs = [];
    this.miniOptions.forEach((v) => {
      miniRes.push(this.resWords[v]);
      miniChs.push(this.chsWords[v]);
    });
    return [miniRes, miniChs];
  }
  buildMoreCmdStr(_resObj) {
    try {
      let handled = "<message forward>";
      const matched = _resObj["results"];
      matched.forEach((v) => {
        handled += "<message>";
        handled += this.outputCoverImg(v);
        handled += this.outputMoreLangTitles(v);
        handled += autoConn(this.currentChoice, v);
        handled += `开发状态：${this.outputVnVnDevstatus(v)}`;
        handled += this.outputProducersInfo(v);
        handled += "</message>";
      });
      return handled + "</message>";
    } catch (e) {
      return String(e);
    }
  }
  buildlessCmdStr(_resObj) {
    try {
      let handled = "<message forward>";
      const matched = _resObj["results"];
      matched.forEach((v) => {
        handled += "<message>";
        handled += this.outputCoverImg(v);
        handled += this.outputlessLangTitles(v);
        handled += autoConn(this.currentChoice, v);
        handled += this.outputProducersInfo(v);
        handled += "</message>";
      });
      return handled + "</message>";
    } catch (e) {
      return String(e);
    }
  }
};
var ProducerMethod = class extends HandleOutput {
  static {
    __name(this, "ProducerMethod");
  }
  currentId;
  resWords = ["id", "aliases", "lang", "type", "name", "original"];
  resWordsVn = ["alttitle", "title", "released", "rating", "image.url"];
  chsWords = ["vndb唯一id", "别称", "语言", "类型"];
  currentChoice = {
    argSourceArr: [],
    argChsArr: [],
    argConnSymbol: "、",
    kindKey2Value: [],
    kindkey2Arr: []
  };
  ctx;
  constructor(_ctx) {
    super();
    this.ctx = _ctx;
    this.currentChoice.argConnSymbol = "、", this.currentChoice.argSourceArr = this.resWords;
    this.currentChoice.argChsArr = this.chsWords;
    this.currentChoice.kindKey2Value = [0, 2];
    this.currentChoice.kindkey2Arr = [1];
  }
  async run(_resObj) {
    return this.buildCmdStr(_resObj);
  }
  async buildCmdStr(_resObj) {
    try {
      let handled = "<message forward>";
      const matched = _resObj["results"];
      for (const item of matched) {
        this.currentId = String(item["id"]);
        handled += "<message>";
        handled += this.outputProducerName(item);
        handled += `类型：${this.outputProducerType(item)}`;
        handled += autoConn(this.currentChoice, item);
        handled += await this.releaseWork();
        handled += "</message>";
      }
      return handled + "</message>";
    } catch (e) {
      return String(e);
    }
  }
  async releaseWork() {
    const payload = {
      "filters": ["developer", "=", ["id", "=", this.currentId]],
      "fields": this.resWordsVn.join(","),
      "sort": "rating",
      "reverse": true,
      "results": 6
    };
    const res = await this.ctx.http.post("https://api.vndb.org/kana/vn", payload, { headers: {
      "Content-Type": "application/json"
    } });
    let str = "创作作品（评分降序）：\n";
    res["results"].forEach((v, i) => {
      str += `${i + 1}    ${v["rating"]}    ${v["alttitle"] || v["title"]}    ${String(v["released"])}
${this.outputCoverImg(v)}
`;
    });
    return str;
  }
};
var CharacterMethod = class extends HandleOutput {
  static {
    __name(this, "CharacterMethod");
  }
  innerWords = ["image.url", "gender", "vns.alttitle"];
  resWords = ["id", "original", "aliases", "age", "birthday", "blood_type", "height", "weight", "bust,waist,hips", "cup"];
  chsWords = ["vndb唯一id", "名称", "别称", "年龄", "生日", "血型", "身高（cm）", "体重（kg）", "三围", "Cup"];
  miniOptions = [0, 1, 2, 3, 4];
  currentChoice = {
    argSourceArr: [],
    argChsArr: [],
    argConnSymbol: "、",
    kindKey2Value: [],
    kindkey2Arr: []
  };
  constructor(_scheme) {
    super();
    if (_scheme === 0) {
      const miniArr = this.buildMini();
      this.currentChoice.argSourceArr = miniArr[0];
      this.currentChoice.argChsArr = miniArr[1];
      this.currentChoice.kindKey2Value = [0, 1, 3, 4];
      this.currentChoice.kindkey2Arr = [2];
    } else if (_scheme === 1) {
      this.currentChoice.argSourceArr = this.resWords;
      this.currentChoice.argChsArr = this.chsWords;
      this.currentChoice.kindKey2Value = [0, 1, 3, 4, 5, 6, 7];
      this.currentChoice.kindkey2Arr = [2];
    }
  }
  async run(_scheme, _resObj) {
    if (_scheme === 0) {
      return this.buildlessCmdStr(_resObj);
    } else if (_scheme === 1) {
      return this.buildMoreCmdStr(_resObj);
    }
  }
  buildMini() {
    let miniRes = [];
    let miniChs = [];
    this.miniOptions.forEach((v) => {
      miniRes.push(this.resWords[v]);
      miniChs.push(this.chsWords[v]);
    });
    return [miniRes, miniChs];
  }
  buildMoreCmdStr(_resObj) {
    try {
      let handled = "<message forward>";
      const matched = _resObj["results"];
      matched.forEach((v) => {
        handled += "<message>";
        handled += this.outputCoverImg(v);
        handled += autoConn(this.currentChoice, v);
        handled += this.outputCharacterGenderMore(v);
        handled += this.outputCharacterVns(v);
        if (v["gender"][0] !== "m") {
          handled += this.outputCharacterBWH(v);
          handled += `Cup：${String(v["cup"])}
`;
        }
        handled += "</message>";
      });
      return handled + "</message>";
    } catch (e) {
      return String(e);
    }
  }
  buildlessCmdStr(_resObj) {
    try {
      let handled = "<message forward>";
      const matched = _resObj["results"];
      matched.forEach((v) => {
        handled += "<message>";
        handled += this.outputCoverImg(v);
        handled += autoConn(this.currentChoice, v);
        handled += this.outputCharacterGenderLess(v);
        handled += this.outputCharacterVns(v);
        handled += "</message>";
      });
      return handled + "</message>";
    } catch (e) {
      return String(e);
    }
  }
};

// src/components/request.ts
var RequestApi = class {
  static {
    __name(this, "RequestApi");
  }
  searchKey;
  category;
  apiUrl;
  payload;
  header = {
    "Content-Type": "application/json"
  };
  cateObj;
  scheme;
  ctx;
  session;
  startTips;
  constructor(_searchKey, _category, _scheme, _ctx, _session) {
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
    const cmdArr = await Promise.all(reqs);
    cmdArr.forEach((v) => {
      try {
        this.session.sendQueued(v);
      } catch {
        this.session.send(`${`某些消息发送失败，重试或解决问题`}`);
      }
    });
  }
  async go(_session) {
    try {
      let requests = [];
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
      requests = this.searchKey.map(async (v) => {
        const resWords = this.cateObj.resWords.concat(
          this.category === "vn" || this.category === "character" ? this.cateObj.innerWords : []
        );
        this.payload = this.buildPayload(v, resWords, "search", this.scheme);
        const res = await this.request(this.apiUrl, this.payload, this.header);
        if (!res) {
          _session.send("执行失败...网络请求失败...增加重试次数或解决问题。");
          return;
        } else if (res["results"].length === 0) {
          _session.send(`没有关键词~${v}~的搜索结果，注意简繁体`);
          return;
        }
        const cmd = this.category === "producer" ? await this.cateObj.run(res) : await this.cateObj.run(this.scheme, res);
        return cmd;
      });
      if (this.startTips) {
        _session.send("查找开始...");
      }
      return requests;
    } catch (error) {
      this.ctx.logger.error("执行过程中出错:", error);
      _session.send("操作失败: " + error.message);
    }
  }
  buildPayload(_searchKey, _expectWords, _standard, _scheme) {
    if (_scheme === 1) {
      return {
        "filters": [_standard, "=", _searchKey],
        "fields": _expectWords.join(","),
        "results": 1
      };
    } else {
      return {
        "filters": [_standard, "=", _searchKey],
        "fields": _expectWords.join(",")
      };
    }
  }
  async request(_url, _payload, _header) {
    let res = {};
    let retry = 0;
    while (retry <= this.ctx.config.retryCount) {
      try {
        retry++;
        res = await this.ctx.http.post(_url, _payload, { headers: _header });
        break;
      } catch (err) {
        if (this.ctx.config.debug) this.ctx.logger.warn(`第${retry}次请求api失败...`);
      }
    }
    return res;
  }
};
var request_default = RequestApi;

// src/components/vnToday.ts
var VnToday = class {
  static {
    __name(this, "VnToday");
  }
  todayDate;
  dateArr;
  response;
  ctx;
  method;
  search;
  rate_filter;
  constructor(_date, _response, _ctx, _method, _search, _rate_filter) {
    this.todayDate = _date;
    this.dateArr = _date.split("-");
    this.response = _response.join(",");
    this.ctx = _ctx;
    this.method = _method;
    this.search = _search;
    this.rate_filter = _rate_filter || 0;
  }
  async run() {
    return this.request(this.method, this.search, this.response, this.dateArr);
  }
  async request(_method, _search, _response, _dateArr) {
    let payload;
    if (_method === "vn") {
      let filters = ["or"];
      for (let i = 2e3; i < (/* @__PURE__ */ new Date()).getFullYear(); i++) {
        filters.push([_search, "=", `${String(i)}-${_dateArr[1]}-${_dateArr[2]}`]);
      }
      payload = {
        "filters": filters,
        "fields": this.response
      };
    } else if (_method === "character") {
      payload = {
        "filters": [_search, "=", [Number(_dateArr[1]), Number(_dateArr[2])]],
        "fields": this.response
      };
    }
    let obj = {};
    let retry = 0;
    while (retry <= this.ctx.config.retryCount) {
      try {
        retry++;
        obj = await this.ctx.http.post("https://api.vndb.org/kana/" + _method, payload, { headers: {
          "Content-Type": "application/json"
        } });
        break;
      } catch (err) {
        if (this.ctx.config.debug) this.ctx.logger.warn(`第${retry}次请求api失败...`);
      }
    }
    return obj["results"];
  }
};

// src/components/downloadImg.ts
var import_path = __toESM(require("path"));
var import_fs = __toESM(require("fs"));
var DownloadImg = class {
  static {
    __name(this, "DownloadImg");
  }
  storagePath = import_path.default.join(__dirname, "tempImgs");
  ctx;
  tasks;
  constructor(_ctx, _urls) {
    this.ctx = _ctx;
    this.tasks = _urls;
  }
  async download() {
    return Promise.allSettled(
      this.tasks.map(async (item, index) => {
        let retry = 0;
        while (retry <= this.ctx.config.retryCount) {
          try {
            retry++;
            if (item === "unknown") return "unknown";
            const source = await this.ctx.http.get(item, { responseType: "arraybuffer" });
            const file = import_path.default.join(this.storagePath, `${index}.png`);
            await import_fs.default.promises.writeFile(file, Buffer.from(source));
            return file;
          } catch (err) {
            if (this.ctx.config.debug) {
              this.ctx.logger.warn(`第${retry}次下载图片：${item}失败`);
            }
          }
        }
        if (this.ctx.config.debug) this.ctx.logger.warn(`图片链接 ${item} 保存失败`);
        return "error";
      })
    ).then(
      (results) => results.map((r) => r.status === "fulfilled" ? r.value : import_path.default.join(this.storagePath, `error.png`))
    );
  }
  async clean() {
    await Promise.allSettled(
      this.tasks.map(async (item) => {
        const file = import_path.default.join(this.storagePath, this.tasks.indexOf(item) + ".png");
        if (import_fs.default.existsSync(file)) {
          import_fs.default.unlink(file, () => {
          });
        }
      })
    );
  }
};
var downloadImg_default = DownloadImg;

// src/components/imgHtml.ts
var import_path2 = __toESM(require("path"));
var VnTodayHtml = class {
  static {
    __name(this, "VnTodayHtml");
  }
  date;
  week;
  content_1 = "";
  content_2 = "";
  subtitle_1;
  subtitle_2;
  constructor() {
    this.getDate();
  }
  build() {
    return `
        <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    @font-face {
                        font-family: "all";
                        src: url("${import_path2.default.join(__dirname, "fonts/simhei.ttf")}");
                    }
                    @font-face {
                        font-family: "CN";
                        src: url("${import_path2.default.join(__dirname, "fonts/GeTeShiZiTi-1.ttf")}");
                    }
                    @font-face {
                        font-family: "CN_1";
                        src: url("${import_path2.default.join(__dirname, "fonts/Hangyaku-L3oaG.ttf")}");
                    }
                    * {
                        margin: 0;
                        padding: 0;
                        font-family: "all";
                    }
                    body {
                        width: 600px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        background-image: url("${import_path2.default.join(__dirname, "elements/bg.png")}");
                        background-repeat: no-repeat;
                        background-size: cover;
                    }
                    .title {
                        font-family: "CN";
                        font-size: 50px;
                        color:blue;
                    }
                    .today {
                        font-family: "CN_1";
                        font-size: 40px;
                        color:rgb(86, 86, 227);
                    }
                    .content {
                        display: flex;
                        flex-direction: column;
                        margin-bottom: 10px;
                    }
                    .subtitle {
                        margin-top: 50px;
                        padding: 5px;
                        font-family: "CN";
                        font-size: 30px;
                        border-bottom: 3px blueviolet solid;
                        
                    }
                    .block {
                        width: 600px;
                        height: 250px;
                        display: flex;
                        margin-top: 25px;
                    }
                    .legend_block {
                        width: 600px;
                        height: 250px;
                        display: flex;
                        margin-top: 25px;
                        box-shadow: 3px 2px 2px 2px rgb(184, 186, 36);
                        background-image: 
                            linear-gradient(90deg, rgb(2, 172, 144),rgb(2, 107, 172),rgb(33, 136, 220),rgb(37, 63, 210),rgb(6, 151, 180),rgb(2, 172, 144));
                        background-clip: text;
                        -webkit-text-fill-color: transparent;
                    }
                    .img {
                        margin-left: 30px;
                        width: 250px;
                        background-repeat: no-repeat;
                        background-size: contain;
                    }
                    .text {
                        padding: 5px;
                        width: 350px;
                        font-size: 30px;
                        color: brown;
                        word-wrap: break-word;
                        overflow: hidden;
                    }
                </style>
            </head>
            <body>
                <div class="title">今日GAL</div>
                <div class="today">~ ${this.date} ~ ${this.week} ~</div>
                <div class="content">
                <div class="subtitle" id="vn">${this.subtitle_1}</div>
                ${this.content_1}
                <div class="subtitle" id="cha">${this.subtitle_2}</div>
                ${this.content_2}
                </div>
            </body>
            </html>
        `;
  }
  insertSubtitle_1(text) {
    this.subtitle_1 = text;
  }
  insertSubtitle_2(text) {
    this.subtitle_2 = text;
  }
  insertBlock_1(info) {
    this.content_1 += `
        <div class="block">
        <div class="img" style='background-image: url("${info.img}");'></div>
        <div class="text">
        ${info.title}<br>
        发售日：<br>${info.date}<br>
        厂商：<br>${info.producer}</div></div>
        `;
  }
  insertBlock_2(info) {
    this.content_2 += `
        <div class="block">
        <div class="img" style='background-image: url("${info.img}");'></div>
        <div class="text">
        ${info.name}<br>
        登场作品：<br>${info.game}</div></div>
        `;
  }
  insertLegendBlock_1(info, rating) {
    this.content_1 += `
        <div class="legend_block">
        <div class="img" style='background-image: url("${info.img}");'></div>
        <div class="text">
        ${info.title}<br>
        发售日：<br>${info.date}<br>
        厂商：<br>${info.producer}<br>
        ★评分：${rating}</div></div>
        `;
  }
  getDate() {
    const now = /* @__PURE__ */ new Date();
    const year = String(now.getFullYear());
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const week = now.getDay();
    const weekArr = ["日", "月", "火", "水", "木", "金", "土"];
    this.date = `${year}年${month}月${day}日`;
    this.week = weekArr[week] + "曜日";
  }
};

// src/components/createImg.ts
var CreateImgVT = class {
  static {
    __name(this, "CreateImgVT");
  }
  html;
  ctx;
  downloader;
  res_vn;
  res_cha;
  img_path;
  constructor(_ctx, _res) {
    this.ctx = _ctx;
    this.res_vn = _res[0];
    this.res_cha = _res[1];
  }
  async run() {
    [this.res_vn, this.res_cha] = this.filterRating();
    let retry = 0;
    while (retry <= this.ctx.config.retryCount) {
      try {
        retry++;
        await this.download();
        break;
      } catch (err) {
        if (this.ctx.config.debug) this.ctx.logger.warn(`第${retry}次下载图片失败...`);
      }
    }
    const html = new VnTodayHtml();
    let i = 0;
    let j = 0;
    this.res_vn.forEach((v) => {
      const info = {
        img: this.img_path[this.res_vn.indexOf(v)],
        date: v["released"],
        title: `《${v["alttitle"] || v["title"]}》`,
        producer: this.getProducer(v["developers"])
      };
      if (v["rating"] && v["rating"] >= 80) html.insertLegendBlock_1(info, v["rating"]);
      else html.insertBlock_1(info);
      i++;
    });
    this.res_cha.forEach((v) => {
      const info = {
        img: this.img_path[this.res_cha.indexOf(v) + i],
        name: v["original"] || v["name"],
        game: this.vnsArr(v["vns"])
      };
      html.insertBlock_2(info);
      j++;
    });
    if (i === 0) html.insertSubtitle_1("今天没有令人记忆深刻的作品诞生...");
    else html.insertSubtitle_1("这些作品在历史上的今天发售...");
    if (j === 0) html.insertSubtitle_2("好像没有找到知名的角色的生日是今天...");
    else html.insertSubtitle_2("今天是这些角色的生日  你认识TA们吗  ");
    const source = html.build();
    try {
      const base64 = await this.ctx.puppeteer.render(source, async (page, next) => {
        await page.setViewport({ width: 600, height: 800 });
        return next(await page.$("body"));
      });
      this.downloader.clean();
      return base64;
    } catch (err) {
      if (this.ctx.config.debug) this.ctx.logger.warn("图片渲染失败！");
      return "";
    }
  }
  async download() {
    let urls = [];
    this.res_vn.forEach((v) => {
      urls.push(v["image"]["url"] ? v["image"]["url"] : "unknown\n");
    });
    this.res_cha.forEach((v) => {
      urls.push(v["image"]["url"] ? v["image"]["url"] : "unknown\n");
    });
    this.downloader = new downloadImg_default(this.ctx, urls);
    this.img_path = await this.downloader.download();
  }
  getProducer(s) {
    const ss = [];
    s.forEach((v) => {
      ss.push(v["original"] || v["name"]);
    });
    return ss.join("、");
  }
  filterRating() {
    let vn = [];
    let cha = [];
    this.res_vn.forEach((v) => {
      if (!v["rating"] || v["rating"] < this.ctx.config.filterRating) return;
      vn.push(v);
    });
    this.res_cha.forEach((v) => {
      if (!this.vnsSatisfy(v["vns"])) return;
      cha.push(v);
    });
    return [vn, cha];
  }
  vnsSatisfy(vns) {
    for (const v of vns) {
      if (v["rating"] && v["rating"] >= this.ctx.config.filterRating) return true;
    }
    return false;
  }
  vnsArr(vns) {
    let arr = [];
    vns.forEach((v) => {
      arr.push(`《${v["alttitle"] || v["title"]}》`);
    });
    return arr.join("、");
  }
};

// src/components/initCmd.ts
var import_fs2 = __toESM(require("fs"));
var import_path3 = __toESM(require("path"));
var import_promises = require("stream/promises");
async function init(_ctx) {
  return await new Init(_ctx).init();
}
__name(init, "init");
async function downloadAssets(_ctx) {
  const res = [];
  const ele = import_path3.default.join(__dirname, "elememts");
  if (!import_fs2.default.existsSync(ele)) {
    try {
      let response;
      try {
        response = await _ctx.http.get("https://img.cdn1.vip/i/68dde984e2362_1759373700.webp", {
          responseType: "stream",
          timeout: 3e3
        });
      } catch {
        response = await _ctx.http.get("https://qwq.pyuramazo.online/bg.png", {
          responseType: "stream",
          timeout: 3e3
        });
      }
      import_fs2.default.mkdirSync(ele);
      await (0, import_promises.pipeline)(response, import_fs2.default.createWriteStream(import_path3.default.join(ele, "bg.png")));
      res.push("elements初始化成功！");
    } catch (e) {
      res.push(`elements初始化失败：${e.message}}`);
    }
  }
  const temp = import_path3.default.join(__dirname, "tempImgs");
  if (!import_fs2.default.existsSync(temp)) {
    try {
      let response;
      try {
        response = await _ctx.http.get("https://img.cdn1.vip/i/68ddeae4c7eac_1759374052.webp", {
          responseType: "stream",
          timeout: 3e3
        });
      } catch {
        response = await _ctx.http.get("https://qwq.pyuramazo.online/error.png", {
          responseType: "stream",
          timeout: 3e3
        });
      }
      import_fs2.default.mkdirSync(temp);
      await (0, import_promises.pipeline)(response, import_fs2.default.createWriteStream(import_path3.default.join(temp, "error.png")));
      res.push("tempImgs初始化成功！");
    } catch (e) {
      res.push(`tempImgs初始化失败：${e.message}}`);
    }
  }
  const font = import_path3.default.join(__dirname, "fonts");
  if (_ctx.config.font && !import_fs2.default.existsSync(font)) {
    try {
      import_fs2.default.mkdirSync(font);
      const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "application/font-ttf,application/font-woff,*/*",
        "Referer": "https://fonts.googleapis.com/"
      };
      const response1 = await _ctx.http.get("https://qwq.pyuramazo.online/Inner/Fonts/GeTeShiZiTi-1.ttf", {
        responseType: "stream",
        headers,
        timeout: 6e4
      });
      await (0, import_promises.pipeline)(response1, import_fs2.default.createWriteStream(import_path3.default.join(font, "GeTeShiZiTi-1.ttf")));
      const response2 = await _ctx.http.get("https://qwq.pyuramazo.online/Inner/Fonts/simhei.ttf", {
        responseType: "stream",
        headers,
        timeout: 6e4
      });
      await (0, import_promises.pipeline)(response2, import_fs2.default.createWriteStream(import_path3.default.join(font, "simhei.ttf")));
      const response3 = await _ctx.http.get("https://qwq.pyuramazo.online/Inner/Fonts/Hangyaku-L3oaG.ttf", {
        responseType: "stream",
        headers,
        timeout: 6e4
      });
      await (0, import_promises.pipeline)(response3, import_fs2.default.createWriteStream(import_path3.default.join(font, "Hangyaku-L3oaG.ttf")));
      res.push("tempImgs初始化成功！");
    } catch (e) {
      res.push(`tempImgs初始化失败：${e.message}}`);
    }
  }
  return res;
}
__name(downloadAssets, "downloadAssets");
async function load(_ctx) {
  _ctx.model.extend("vn_today_data", {
    id: "unsigned",
    date: "string",
    cmd: "text"
  }, {
    primary: "id",
    autoInc: true
  });
  new Init(_ctx).deleteTodayData();
}
__name(load, "load");
var Init = class {
  static {
    __name(this, "Init");
  }
  now;
  ctx;
  vnSearch = ["alttitle", "title", "released", "image{url}", "rating", "developers{original,name}"];
  chaSearch = ["original", "name", "image{url}", "vns{alttitle,title,rating}"];
  constructor(_ctx) {
    this.now = this.getNow();
    this.ctx = _ctx;
  }
  async init() {
    this.ctx.model.extend("vn_today_data", {
      id: "unsigned",
      date: "string",
      cmd: "text"
    }, {
      primary: "id",
      autoInc: true
    });
    const res = await this.ctx.database.get("vn_today_data", {
      date: this.now
    });
    if (res.length === 0) {
      const vnRes = new VnToday(this.now, this.vnSearch, this.ctx, "vn", "released").run();
      const chaRes = new VnToday(this.now, this.chaSearch, this.ctx, "character", "birthday").run();
      const wait = await Promise.all([vnRes, chaRes]);
      if (!wait[0] || !wait[1]) return "执行失败...网络请求失败...增加重试次数或解决问题。";
      const img = await new CreateImgVT(this.ctx, wait).run();
      this.ctx.database.create("vn_today_data", {
        date: this.now,
        cmd: img
      });
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
    });
  }
  getNow() {
    const now = /* @__PURE__ */ new Date();
    const year = String(now.getFullYear());
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
};

// src/index.ts
var name = "pyura-vndb";
var Config = import_koishi.Schema.intersect(
  [
    import_koishi.Schema.object({
      startTips: import_koishi.Schema.boolean().default(false).description("开始查找提示"),
      retryCount: import_koishi.Schema.number().min(0).max(5).default(2).description("最大请求重试次数")
    }).description("全局配置"),
    import_koishi.Schema.object({
      filterRating: import_koishi.Schema.number().min(60).max(85).default(70).description("过滤低于此评分的作品的内容展示"),
      font: import_koishi.Schema.boolean().default(true).description("启用特殊字体")
    }).description("VnToday配置"),
    import_koishi.Schema.object({
      debug: import_koishi.Schema.boolean().default(false).description("输出详细日志")
    }).description("开发者模式")
  ]
);
var inject = {
  required: ["http", "database"],
  optional: ["puppeteer"]
};
async function apply(ctx) {
  if (ctx.config.debug) ctx.logger.warn("插件重载，删除当日数据库信息。");
  load(ctx);
  const resp = downloadAssets(ctx);
  if (ctx.config.debug) ctx.logger.warn(await resp);
  ctx.command("vndb <...searchKey: string>", "查找vndb中的搜索结果").option("method", "-m <methodType: string> 搜索类型（vn/producer/character）").option("fuzzy", "-f 开启模糊搜索").usage("~不指定选项时默认搜索视觉小说并输出简约的信息结果~").example("①vndb -m character -f 爱丽丝\n模糊查找名字中带有-爱丽丝-的人物\n②vndb -m producer AUGUST 枕\n仅查找出版商AUGUST、枕社的信息").action(async ({ session, options }, ...searchKey) => {
    const method = options["method"] || "vn";
    const scheme = options["fuzzy"] ? 0 : 1;
    new request_default(searchKey, method, scheme, ctx, session).run();
  });
  ctx.command("vntoday", "看看今天是什么特殊的日子").action(async ({ session }) => {
    return await init(ctx);
  });
}
__name(apply, "apply");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Config,
  apply,
  inject,
  name
});
