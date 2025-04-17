var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
  ouputCoverImg(_singleObj) {
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
        handled += this.ouputCoverImg(v);
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
        handled += this.ouputCoverImg(v);
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
  resWordsVn = ["alttitle", "title", "released", "rating"];
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
      "results": 10
    };
    const res = await this.ctx.http.post("https://api.vndb.org/kana/vn", payload, { headers: {
      "Content-Type": "application/json"
    } });
    let str = "创作作品（评分降序）：\n";
    res["results"].forEach((v, i) => {
      str += `${i + 1}    ${v["rating"]}    ${v["alttitle"] || v["title"]}    ${String(v["released"])}
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
        handled += this.ouputCoverImg(v);
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
        handled += this.ouputCoverImg(v);
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
  userConfig = {
    startTips: false
  };
  session;
  constructor(_searchKey, _category, _scheme, _ctx, _session) {
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
    const cmdArr = await Promise.all(reqs);
    cmdArr.forEach((v) => {
      try {
        this.session.sendQueued(v);
      } catch {
        this.session.send(`${`某些消息发送失败，重试可能解决问题`}`);
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
        this.payload = this.buildPayload(v, resWords, "search");
        const res = await this.request(this.apiUrl, this.payload, this.header);
        if (res["results"].length === 0) {
          _session.send(`没有关键词~${v}~的搜索结果，注意简繁体`);
          return;
        }
        const cmd = this.category === "producer" ? await this.cateObj.run(res) : await this.cateObj.run(this.scheme, res);
        return cmd;
      });
      if (this.userConfig.startTips) {
        _session.send("查找开始...");
      }
      return requests;
    } catch (error) {
      console.error("执行过程中出错:", error);
      _session.send("操作失败: " + error.message);
    }
  }
  transferConfig(_config) {
    this.userConfig.startTips = _config.startTips;
  }
  buildPayload(_searchKey, _expectWords, standard) {
    return {
      "filters": [standard, "=", _searchKey],
      "fields": _expectWords.join(",")
    };
  }
  async request(_url, _payload, _header) {
    return await this.ctx.http.post(_url, _payload, { headers: _header });
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
  constructor(_date, _response, _ctx, _method, _search) {
    this.todayDate = _date;
    this.dateArr = _date.split("-");
    this.response = _response.join(",");
    this.ctx = _ctx;
    this.method = _method;
    this.search = _search;
  }
  async run() {
    const res = await this.request(this.method, this.search, this.response, this.dateArr);
    let str = "";
    if (this.method === "vn") {
      str += "那年今天，这些GAL/VN发布了...\n";
      res.forEach((v) => {
        str += v["image"]["url"] ? `<img src="${v["image"]["url"]}"/>` : "图片出错了！\n";
        str += `${v["released"]}，${v["alttitle"] || v["title"]}发布了！
-----
`;
      });
    } else if (this.method === "character") {
      str += "<message>你知道吗，今天是这些角色的生日，有你认识的吗？\n\n";
      res.forEach((v) => {
        str += v["image"] ? `<img src="${v["image"]["url"]}"/>` : "图片出错了！\n";
        str += `出自《${v["vns"][0]["alttitle"] || v["vns"][0]["title"]}》的${v["original"] || v["name"]}
-----
`;
      });
    }
    return `<message>${str}</message>`;
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
    const obj = await this.ctx.http.post("https://api.vndb.org/kana/" + _method, payload, { headers: {
      "Content-Type": "application/json"
    } });
    return obj["results"];
  }
};

// src/components/init.ts
async function init(_ctx) {
  return await new Init(_ctx).init();
}
__name(init, "init");
var Init = class {
  static {
    __name(this, "Init");
  }
  now;
  ctx;
  vnSearch = ["alttitle", "title", "released", "image{url}"];
  chaSearch = ["original", "name", "image{url}", "vns{alttitle,title}"];
  constructor(_ctx) {
    this.now = this.getNow();
    this.ctx = _ctx;
  }
  async init() {
    this.ctx.model.extend("vndbDate", {
      id: "unsigned",
      date: "string",
      cmd: "text"
    }, {
      primary: "id",
      autoInc: true
    });
    const res = await this.ctx.database.get("vndbDate", {
      date: this.now
    });
    if (res.length === 0) {
      const vnCmd = new VnToday(this.now, this.vnSearch, this.ctx, "vn", "released").run();
      const chaCmd = new VnToday(this.now, this.chaSearch, this.ctx, "character", "birthday").run();
      const wait = await Promise.all([vnCmd, chaCmd]);
      const cmdStr = "<message forward>" + wait[0] + wait[1] + "</message>";
      this.ctx.database.create("vndbDate", {
        date: this.now,
        cmd: cmdStr
      });
      return cmdStr;
    } else if (res.length === 1) {
      return res[0].cmd;
    } else {
      console.log("数据库记录了错误的数据，需要排查错误！！");
    }
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
var Config = import_koishi.Schema.object({
  startTips: import_koishi.Schema.boolean().default(false).description("开始查找提示")
});
var inject = {
  required: ["http", "database"]
};
function apply(ctx) {
  init(ctx);
  ctx.command("vndb <...searchKey: string>", "查找vndb中的搜索结果").option("method", "-m <methodType: string> 搜索类型（vn/producer/character）").option("scheme", "-s <schemeKey: number> 显示方案（0/1）").usage("~不指定选项时默认搜索视觉小说并输出简约的信息结果~").example("①vndb -m character -s 1 水上由岐\n显示更全面的角色-水上由岐的信息\n②vndb -m producer AUGUST 枕\n显示简约的出版商AUGUST、枕社的信息").action(async ({ session, options }, ...searchKey) => {
    const method = options["method"] || "vn";
    const scheme = options["scheme"] || 0;
    new request_default(searchKey, method, scheme, ctx, session).run();
  });
  ctx.command("vntoday").action(async ({ session }) => {
    session.send(await init(ctx));
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
