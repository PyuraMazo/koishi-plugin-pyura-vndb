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
  apply: () => apply8,
  dataDir: () => dataDir,
  db: () => db,
  dbName: () => dbName,
  http: () => http,
  inject: () => inject,
  logger: () => logger,
  name: () => name,
  pptr: () => pptr
});
module.exports = __toCommonJS(src_exports);
var import_path5 = __toESM(require("path"));
var import_koishi4 = require("koishi");

// src/core/Queue.ts
var Queue = class {
  static {
    __name(this, "Queue");
  }
  config;
  queue = [];
  constructor(_config) {
    this.config = _config;
  }
  async enQueue(_node) {
    this.queue.push(_node);
  }
  // 运行元素出队并获取出队元素
  deQueue(_id, _force = false) {
    for (let index = 0; index < this.queue.length; index++) {
      if (!(this.queue[index].activated || _force)) {
        continue;
      }
      if (this.queue[index].session.messageId === _id) {
        const e = this.queue.splice(index, 1)[0];
        return e;
      }
    }
    throw new Error("未能删除运行任务!");
  }
  // 获取下一个任务，并激活运行
  next() {
    for (let index = 0; index < this.queue.length; index++) {
      if (!this.queue[index].activated) {
        this.queue[index].activated = true;
        return this.queue[index];
      }
    }
    return null;
  }
  getQueue() {
    return this.queue;
  }
  isEmpty() {
    return this.queue.length === 0;
  }
  getSize() {
    return this.queue.length;
  }
  cleanAll() {
    this.queue.length = 0;
  }
};

// src/core/Processer.ts
var import_koishi3 = require("koishi");

// src/core/ResponseHandler.ts
var import_path2 = __toESM(require("path"));
var import_koishi = require("koishi");

// src/core/api/Grand.ts
var CommandFields = {
  "vn": "id,average,rating,released,length_minutes,platforms,aliases,developers{id,original,name},titles{lang,title,official},image{url},alttitle,title",
  "character": "id,name,aliases,sex,birthday,waist,hips,bust,blood_type,weight,height,cup,original,image{url},vns{id,alttitle,title}",
  "producer": "id,name,original,aliases,lang,type",
  "short_vn": "id,alttitle,title,released,rating,image{url}",
  "short_character": "id,name,aliases,birthday,original,image{url},vns{id,alttitle,title}"
};
var Id2Command = {
  "v": "vn" /* VN */,
  "c": "character" /* Character */,
  "p": "producer" /* Producer */
};
var TemplateMap = {
  "vn": 0,
  "character": 0,
  "producer": 1,
  "event": 1
};
var LangDic = {
  "ja": "日文",
  "en": "英文",
  "zh-Hans": "简中",
  "zh-Hant": "繁中"
};
var GenderDic = {
  "m": "男性",
  "f": "女性",
  "b": "双性",
  "n": "无性"
};
var TypeDic = {
  "co": "公司",
  "in": "个人",
  "ng": "业余团体"
};
var WeekDate = ["日", "月", "火", "水", "木", "金", "土"];

// src/core/internet/Downloader.ts
var import_path = __toESM(require("path"));

// src/core/api/Errors.ts
var TipsError = class extends Error {
  static {
    __name(this, "TipsError");
  }
  constructor(message) {
    super(message);
  }
};
var ImageDownloadError = class extends TipsError {
  static {
    __name(this, "ImageDownloadError");
  }
  constructor() {
    super("图片下载失败！改用错误图片。");
  }
};

// src/core/internet/Request.ts
var Request = class _Request {
  static {
    __name(this, "Request");
  }
  http;
  retryCount;
  headers = { "Content-Type": "application/json" };
  static Instance;
  constructor() {
  }
  static getInstance() {
    if (!_Request.Instance) {
      _Request.Instance = new _Request();
    }
    return _Request.Instance;
  }
  async init(_http, _config) {
    this.http = _http;
    this.retryCount = _config.retryCount;
  }
  async get(_url) {
    let count = 0;
    while (count < this.retryCount) {
      try {
        const arrayBuffer = await this.http.get(_url, { responseType: "arraybuffer" });
        return Buffer.from(arrayBuffer);
      } catch (e) {
        if (++count >= this.retryCount) throw new ImageDownloadError();
        logger.warn(`网络请求失败一次...${e.message}`);
      }
    }
    throw new Error("意外的异常！");
  }
  async post(_url, _data) {
    let count = 0;
    while (count < this.retryCount) {
      try {
        const resp = await this.http.post(_url, _data, {
          headers: this.headers
        });
        return resp;
      } catch (e) {
        if (++count >= this.retryCount) throw new TipsError(`网络请求全部失败！${e.message}`);
        logger.warn(`网络请求失败一次...${e.message}`);
      }
    }
    throw new Error("意外的异常！");
  }
};

// src/core/utils/File.ts
var import_promises = __toESM(require("fs/promises"));
var File = class _File {
  static {
    __name(this, "File");
  }
  static async readBuffer(_path) {
    if (!await _File.checkExist(_path)) throw new Error(`尝试读取不存在的文件！（${_path}）`);
    try {
      return await import_promises.default.readFile(_path);
    } catch {
      throw new TipsError("文件读取失败！");
    }
  }
  static async readText(_path) {
    if (!await _File.checkExist(_path)) throw new Error(`尝试读取不存在的文件！（${_path}）`);
    try {
      return await import_promises.default.readFile(_path, { encoding: "utf-8" });
    } catch {
      throw new TipsError("文件读取失败！");
    }
  }
  static async readBase64(_path) {
    if (!await _File.checkExist(_path)) throw new Error(`尝试读取不存在的文件！（${_path}）`);
    try {
      return await import_promises.default.readFile(_path, { encoding: "base64" });
    } catch {
      throw new TipsError("文件读取失败！");
    }
  }
  static async writeText(_path, _text) {
    try {
      await import_promises.default.writeFile(_path, _text, { encoding: "utf-8" });
    } catch {
      throw new Error(`写入文件失败！（${_path}）`);
    }
  }
  static async writeBuffer(_path, _buffer) {
    try {
      await import_promises.default.writeFile(_path, _buffer);
    } catch {
      throw new Error(`写入文件失败！（${_path}）`);
    }
  }
  static async storeBase64Image(_path, _base64) {
    await _File.writeBuffer(_path, Buffer.from(_base64, "base64"));
  }
  static async checkExist(_path) {
    try {
      await import_promises.default.access(_path);
      return true;
    } catch {
      return false;
    }
  }
  static async deleteFile(_path) {
    try {
      await import_promises.default.unlink(_path);
    } catch {
      throw new Error(`删除文件错误！（${_path}）`);
    }
  }
  static async removeFile(_path) {
    try {
      await import_promises.default.rm(_path, {
        force: true
      });
    } catch {
      throw new Error(`删除文件错误！（${_path}）`);
    }
  }
  static async removeAll(_path) {
    try {
      await import_promises.default.rm(_path, {
        recursive: true,
        force: true
      });
    } catch {
      throw new Error(`清空文件夹错误！（${_path}）`);
    }
  }
  static async mkdir(_path) {
    try {
      if (!await _File.checkExist(_path)) {
        await import_promises.default.mkdir(_path, { recursive: true });
      }
    } catch {
      throw new Error(`创建文件夹错误！（${_path}）`);
    }
  }
};
var File_default = File;

// src/core/internet/Downloader.ts
var Downloader = class _Downloader {
  static {
    __name(this, "Downloader");
  }
  resourcesDir = import_path.default.join(__dirname, "resources");
  request;
  errorImage;
  static Instance;
  constructor() {
  }
  static getInstance() {
    if (!_Downloader.Instance) {
      _Downloader.Instance = new _Downloader();
    }
    return _Downloader.Instance;
  }
  async init(_http, _config) {
    this.request = Request.getInstance();
    if (!this.errorImage) {
      const err = import_path.default.join(this.resourcesDir, "image", "error.jpg");
      this.errorImage = await File.readBuffer(err);
    }
    await this.request.init(_http, _config);
  }
  async download(_url) {
    if (_url === "") {
      return this.errorImage;
    } else {
      try {
        return await this.request.get(_url);
      } catch (e) {
        if (e instanceof ImageDownloadError) return this.errorImage;
        else throw new TipsError("图片意外下载失败！");
      }
    }
  }
};

// src/core/ResponseHandler.ts
var ResponseHandler = class _ResponseHandler {
  static {
    __name(this, "ResponseHandler");
  }
  textOutput = false;
  imageOutput = false;
  characterOptions;
  isMerge;
  backgroundPath;
  fontPath;
  downloader;
  resourcesDir = import_path2.default.resolve(__dirname, "resources");
  bgBase64 = "";
  fontBase64 = "";
  static Instance;
  constructor() {
  }
  static getInstance() {
    if (!_ResponseHandler.Instance) {
      _ResponseHandler.Instance = new _ResponseHandler();
    }
    return _ResponseHandler.Instance;
  }
  async init(_http, _config) {
    this.downloader = Downloader.getInstance();
    this.textOutput = _config.outputContent.includes("以文本形式发送（数量受限）");
    this.imageOutput = _config.outputContent.includes("以图片方式发送");
    this.characterOptions = _config.characterOptions.map((e) => e.split("-")[0]);
    this.backgroundPath = _config.backgroundPath ?? null;
    this.fontPath = _config.fontPath ?? null;
    this.isMerge = _config.isMerge;
    if (this.imageOutput) {
      if (this.bgBase64 === "") {
        const i1 = await File_default.readBuffer(this.backgroundPath ?? import_path2.default.join(this.resourcesDir, "image", "bg.jpg"));
        this.bgBase64 = `data:image/jpeg;base64,${i1.toString("base64")}`;
      }
      if (this.fontBase64 === "" && this.fontPath) {
        const i2 = await File_default.readBuffer(this.fontPath);
        this.fontBase64 = `data:font/ttf;base64,${i2.toString("base64")}`;
      }
    }
    await this.downloader.init(_http, _config);
  }
  async build(_cmd, _resp, _extraResp) {
    const title = this.handleTitle(_cmd, _resp.length);
    let handledType = _cmd.type;
    if (_cmd.type === "id" /* ID */) {
      handledType = Id2Command[_cmd.value[0]];
    }
    const text = [title[0]];
    const image = [];
    if (handledType === "vn" /* VN */) {
      for (let index = 0; index < _resp.length; index++) {
        const [tData, iData] = await this.handleVN(_resp[index]);
        text.push(tData);
        image.push(iData);
      }
    } else if (handledType === "character" /* Character */) {
      for (let index = 0; index < _resp.length; index++) {
        const [tData, iData] = await this.handleCharacter(_resp[index]);
        text.push(tData);
        image.push(iData);
      }
    } else if (handledType === "producer" /* Producer */) {
      for (let index = 0; index < _resp.length; index++) {
        const [tData, iData] = await this.handleProducer(_resp[index], _extraResp[index]["results"]);
        text.push(tData);
        image.push(iData);
      }
    } else if (handledType === "event" /* Event */) {
      const [vnText, vnImage, chaText, chaImage] = [[], [], [], []];
      for (let index = 0; index < _resp.length; index++) {
        const [tData, iData] = await this.handleVN(_resp[index]);
        vnText.push(tData);
        vnImage.push(iData);
      }
      image.push({
        columnInfo: _resp.length !== 0 ? "今天是这些作品的发布纪念日" : "过去的今天没有新作品发布...",
        vns: vnImage
      });
      for (let index = 0; index < _extraResp.length; index++) {
        const [tData, iData] = await this.handleCharacter(_extraResp[index]);
        chaText.push(tData);
        chaImage.push(iData);
      }
      image.push({
        columnInfo: _extraResp.length !== 0 ? "今天是这些角色的生日" : "今天没有角色的过生日...",
        vns: chaImage
      });
      text.push(vnText.join("\n"), chaText.join("\n"));
    } else {
      throw new Error("未知的指令类型。");
    }
    return [
      this.textOutput ? this.isMerge ? `<message forward>${text.join("</message>")}</message>` : text.join("</message>") : "",
      this.imageOutput ? {
        title: title[1],
        items: image,
        bgImage: this.bgBase64,
        font: this.fontBase64
      } : null
    ];
  }
  handleTitle(_cmd, _count) {
    let text = "";
    let image = "";
    const title = _cmd.type === "event" /* Event */ ? [`指令「${_cmd.type}」`, `「${_cmd.value}」`, `「${WeekDate[new Date(_cmd.value).getDay()]}曜日」`] : [`指令「${_cmd.type}」`, `关键词「${_cmd.value}」`, `结果数「${_count}」`];
    if (this.textOutput) {
      text = `${title.join("\n")}`;
    }
    if (this.imageOutput) {
      image = title.join("<br>");
    }
    return [text, image];
  }
  async handleVN(_resp) {
    let text = "";
    let image = null;
    const [avg, rat, rele, id] = this.simplyBuild([_resp.average, _resp.rating, _resp.released, _resp.id], ["平均分", "贝叶斯评分", "发布日期", "VNDB ID"]);
    const [plat, alia] = this.simplyBuildArray([_resp.platforms, _resp.aliases], ["支持平台", "别名"]);
    const len = _resp.length_minutes ? `游玩时间：${(_resp.length_minutes / 60).toFixed(2)}H` : "";
    const dev = _resp.developers ? `厂商（VNDB ID）：${_resp.developers.map((e) => `${e.original ?? e.name}（${e.id}）`).join("、")}` : "";
    const name2 = _resp.alttitle ?? _resp.title;
    const lang = [];
    if (_resp.titles) {
      const valid = Object.keys(LangDic);
      _resp.titles.forEach((e) => {
        if (valid.includes(e.lang)) lang.push(`${LangDic[e.lang]}标题（${e.official ? "" : "非"}官方）：${e.title}`);
      });
    }
    const imgUrl = _resp.image ? _resp.image.url : "";
    const imgBuffer = await this.downloader.download(imgUrl);
    if (this.textOutput) {
      const tit = lang.join("\n");
      text = [this.textImage(imgBuffer), name2, id, tit, alia, dev, rele, avg, rat, len, plat].filter((e) => e !== "").join("\n");
    }
    if (this.imageOutput) {
      const tit = lang.join("<br>");
      image = {
        subtitle: name2,
        text: [id, tit, alia, dev, rele, avg, rat, len, plat].filter((e) => e !== "").join("<br>"),
        image: `data:image/jpeg;base64,${imgBuffer.toString("base64")}`
      };
    }
    return [text, image];
  }
  async handleCharacter(_resp) {
    let text = "";
    let image = null;
    const [id] = this.simplyBuild([_resp.id], ["VNDB ID"]);
    const [alia] = this.simplyBuildArray([_resp.aliases], ["别名"]);
    const bir = _resp.birthday ? `生日：${_resp.birthday[0]}月${_resp.birthday[1]}日` : "";
    const vns = `出场作品（id）：${_resp.vns.map((e) => `『${e.alttitle ?? e.title}』（${e.id}）`).join("、")}`;
    const blo = this.characterOptions.includes("a") && _resp.blood_type ? `血型：${_resp.blood_type}` : "";
    const wh = this.characterOptions.includes("b") && (_resp.weight || _resp.height) ? `身高/体重（cm/kg）：${_resp.height ?? "??"}/${_resp.weight ?? "??"}` : "";
    const gender_o = this.characterOptions.includes("c") && _resp.sex ? `性别：${GenderDic[_resp.sex[0]]}` : "";
    const gender_i = this.characterOptions.includes("d") && _resp.sex ? `真实性别：${GenderDic[_resp.sex[1]]}` : "";
    const bwh = this.characterOptions.includes("e") && (_resp.bust || _resp.waist || _resp.hips) ? `三围：${_resp.bust ?? "??"}-${_resp.waist ?? "??"}-${_resp.hips ?? "??"}` : "";
    const cup = this.characterOptions.includes("f") && _resp.cup ? `罩杯：${_resp.cup}` : "";
    const des = this.characterOptions.includes("g") && _resp.description ? `简介：${_resp.description}` : "";
    const imgUrl = _resp.image ? _resp.image.url : "";
    const imgBuffer = await this.downloader.download(imgUrl);
    if (this.textOutput) {
      const name2 = `姓名：${_resp.original ?? _resp.name}`;
      text = [this.textImage(imgBuffer), id, name2, alia, bir, vns, blo, wh, gender_o, gender_i, bwh, cup, des].filter((e) => e !== "").join("\n");
    }
    if (this.imageOutput) {
      const name2 = _resp.original ?? _resp.name;
      image = {
        subtitle: name2,
        text: [id, alia, bir, vns, blo, wh, gender_o, gender_i, bwh, cup, des].filter((e) => e !== "").join("<br>"),
        image: `data:image/jpeg;base64,${imgBuffer.toString("base64")}`
      };
    }
    return [text, image];
  }
  async handleProducer(_resp, _vns) {
    let text = "";
    let image = null;
    let vnsImage = [];
    const [id, name2, lang, type, des] = this.simplyBuild(
      [_resp.id, _resp.original ?? _resp.name, LangDic[_resp.lang], TypeDic[_resp.type], _resp.description],
      ["VNDB ID", "名称", "文本语言", "类型", "简介"]
    );
    const [alia] = this.simplyBuildArray([_resp.aliases], ["别名"]);
    const tips = "代表作品：";
    const vnText = [];
    const vnImgCo = [];
    for (let index = 0; index < _vns.length; index++) {
      const vns = _vns[index];
      const [vnTi, vnId, vnRea, vnRat] = this.simplyBuild(
        [vns.aliases ?? vns.title, vns.released, vns.rating, vns.id],
        ["名称", "VNDB ID", "发布日期", "贝叶斯评分"]
      );
      vnText.push([vnTi, vnRea, vnRat, vnId]);
      const imgUrl = vns.image ? vns.image.url : "";
      vnImgCo.push(this.downloader.download(imgUrl));
    }
    const vnImg = await Promise.all(vnImgCo);
    if (this.textOutput) {
      const vnsArray = [];
      for (let index = 0; index < vnText.length && index < 3; index++) {
        const vn = vnText[index].filter((e) => e !== "");
        vn.unshift(this.textImage(vnImg[index]));
        vnsArray.push(vn.join("\n"));
      }
      text = [id, name2, alia, lang, type, des, tips, vnsArray.join("\n")].filter((v) => v !== "").join("\n");
    }
    if (this.imageOutput) {
      for (let index = 0; index < vnText.length; index++) {
        vnsImage.push({
          subtitle: "",
          image: `data:image/jpeg;base64,${vnImg[index].toString("base64")}`,
          text: vnText[index].filter((v) => v !== "").join("<br>")
        });
      }
      image = {
        columnInfo: [id, name2, alia, lang, type, des].join("<br>"),
        vns: vnsImage
      };
    }
    return [text, image];
  }
  simplyBuild(_data, _zh) {
    const res = [];
    for (let index = 0; index < _zh.length; index++) {
      res.push(_data[index] ? `${_zh[index]}：${_data[index]}` : "");
    }
    return res;
  }
  simplyBuildArray(_data, _zh, sign = "、") {
    const res = [];
    for (let index = 0; index < _zh.length; index++) {
      res.push(_data[index] && _data[index].length !== 0 ? `${_zh[index]}：${_data[index].join(sign)}` : "");
    }
    return res;
  }
  textImage(_buffer) {
    return import_koishi.h.image(_buffer, "image/jpeg");
  }
};

// src/core/Renderer.ts
var import_path3 = __toESM(require("path"));
var import_ejs = __toESM(require("ejs"));
var Renderer = class _Renderer {
  static {
    __name(this, "Renderer");
  }
  resourcesDir = import_path3.default.resolve(__dirname, "resources");
  compiledTemplate = [];
  imageOutput = false;
  static Instance;
  constructor() {
  }
  static getInstance() {
    if (!_Renderer.Instance) {
      _Renderer.Instance = new _Renderer();
    }
    return _Renderer.Instance;
  }
  async init(_config) {
    this.imageOutput = _config.outputContent.includes("以图片方式发送");
    if (!this.imageOutput) return;
    if (this.compiledTemplate.length < 2) {
      this.compiledTemplate = [];
      const i1 = File.readText(import_path3.default.join(this.resourcesDir, "template", "template0.html"));
      const i2 = File.readText(import_path3.default.join(this.resourcesDir, "template", "template1.html"));
      const data = await Promise.all([i1, i2]);
      data.forEach((e) => {
        this.compiledTemplate.push(import_ejs.default.compile(e));
      });
    }
  }
  async render(_task, _data) {
    const html = _task.type === "id" /* ID */ ? this.compiledTemplate[TemplateMap[Id2Command[_task.value[0]]]](_data) : this.compiledTemplate[TemplateMap[_task.type]](_data);
    return await pptr.render(html);
  }
};

// src/core/internet/FetchAPI.ts
var FetchAPI = class _FetchAPI {
  static {
    __name(this, "FetchAPI");
  }
  request;
  maxImageNumber;
  lowestRating;
  kana_url = "https://api.vndb.org/kana/";
  static Instance;
  constructor() {
  }
  static getInstance() {
    if (!_FetchAPI.Instance) {
      _FetchAPI.Instance = new _FetchAPI();
    }
    return _FetchAPI.Instance;
  }
  async init(_http, _config) {
    this.request = Request.getInstance();
    this.maxImageNumber = _config.maxImageNumber;
    this.lowestRating = _config.lowestRating;
    await this.request.init(_http, _config);
  }
  async fetchVN(_task) {
    const url = this.kana_url + _task.type;
    const payload = this.vnPayload(_task.value);
    const res = (await this.request.post(url, payload))["results"];
    if (res.length === 0) throw new TipsError("未搜索到相关结果。");
    return [res, ""];
  }
  async fetchCharacter(_task) {
    const url = this.kana_url + _task.type;
    const payload = this.characterPayload(_task.value);
    const res = (await this.request.post(url, payload))["results"];
    if (res.length === 0) throw new TipsError("未搜索到相关结果。");
    return [res, ""];
  }
  async fetchProducer(_task) {
    const url = this.kana_url + _task.type;
    const payload = this.producerPayload(_task.value);
    const proData = (await this.request.post(url, payload))["results"];
    if (proData.length === 0) throw new TipsError("未搜索到相关结果。");
    const vnUrl = this.kana_url + "vn" /* VN */;
    const vns = [];
    proData.forEach((pro) => {
      const vnPayload = this.vnPayload(pro.id, true);
      vns.push(this.request.post(vnUrl, vnPayload));
    });
    return [proData, await Promise.all(vns)];
  }
  async fetchId(_task) {
    const trueType = Id2Command[_task.value[0]];
    const url = this.kana_url + trueType;
    const payload = this.idPayload(_task.value);
    const res = (await this.request.post(url, payload))["results"];
    if (res.length === 0) throw new TipsError("未搜索到相关结果。");
    if (trueType === "producer" /* Producer */) {
      const vns = [];
      const vnUrl = this.kana_url + "vn" /* VN */;
      res.forEach((pro) => {
        const vnPayload = this.vnPayload(pro.id, true);
        vns.push(this.request.post(vnUrl, vnPayload));
      });
      return [res, await Promise.all(vns)];
    } else {
      return [res, ""];
    }
  }
  async fetchEvent(_task) {
    const vnUrl = this.kana_url + "vn" /* VN */;
    const vnPayload = this.eventVnPayload(_task.value);
    const vns = this.request.post(vnUrl, vnPayload);
    const chaUrl = this.kana_url + "character" /* Character */;
    const chaPayload = this.eventCharacterPayload(_task.value);
    const chas = this.request.post(chaUrl, chaPayload);
    const [resVns, resCha] = await Promise.all([vns, chas]);
    return [resVns["results"], resCha["results"]];
  }
  get fetchMap() {
    return {
      "vn": /* @__PURE__ */ __name((_task) => this.fetchVN(_task), "vn"),
      "character": /* @__PURE__ */ __name((_task) => this.fetchCharacter(_task), "character"),
      "producer": /* @__PURE__ */ __name((_task) => this.fetchProducer(_task), "producer"),
      "id": /* @__PURE__ */ __name((_task) => this.fetchId(_task), "id"),
      "event": /* @__PURE__ */ __name((_task) => this.fetchEvent(_task), "event")
    };
  }
  vnPayload(_value, _fromProducer = false) {
    if (!_fromProducer) {
      const filters = ["search", "=", _value];
      const fields = CommandFields["vn" /* VN */];
      return {
        "filters": filters,
        "fields": fields
      };
    } else {
      const filters = ["developer", "=", ["id", "=", _value]];
      const fields = CommandFields["short_vn"];
      return {
        "filters": filters,
        "fields": fields,
        "sort": "rating",
        "reverse": true,
        "results": this.maxImageNumber
      };
    }
  }
  characterPayload(_value) {
    const filters = ["search", "=", _value];
    const fields = CommandFields["character" /* Character */];
    return {
      "filters": filters,
      "fields": fields
    };
  }
  producerPayload(_value) {
    const filters = ["search", "=", _value];
    const fields = CommandFields["producer" /* Producer */];
    return {
      "filters": filters,
      "fields": fields
    };
  }
  idPayload(_value) {
    const filters = ["id", "=", _value];
    const fields = CommandFields[Id2Command[_value[0]]];
    return {
      "filters": filters,
      "fields": fields
    };
  }
  eventVnPayload(_value) {
    const y_m_d = _value.split("-");
    const released = [];
    for (let i = Number(y_m_d[0]); i >= 1990; i--) {
      released.push(["released", "=", `${i}-${y_m_d[1]}-${y_m_d[2]}`]);
    }
    const filters = ["and", ["or", ...released], ["rating", ">=", this.lowestRating]];
    const fields = CommandFields["short_vn"];
    return {
      "filters": filters,
      "fields": fields,
      "sort": "rating",
      "reverse": true
    };
  }
  eventCharacterPayload(_value) {
    const ymd = _value.split("-");
    const filters = ["and", ["birthday", "=", [Number(ymd[1]), Number(ymd[2])]], ["vn", "=", ["rating", ">=", this.lowestRating]]];
    const fields = CommandFields["short_character"];
    return {
      "filters": filters,
      "fields": fields
    };
  }
};

// src/core/DataPersistence.ts
var import_path4 = __toESM(require("path"));
var import_koishi2 = require("koishi");
var DataPersistence = class _DataPersistence {
  static {
    __name(this, "DataPersistence");
  }
  cacheDir = import_path4.default.join(dataDir, "cache");
  textCacheDir = import_path4.default.join(this.cacheDir, "text");
  imageCacheDir = import_path4.default.join(this.cacheDir, "image");
  textOutput;
  imageOutput;
  dataStorage;
  detailLog;
  static Instance;
  constructor() {
  }
  static getInstance() {
    if (!_DataPersistence.Instance) {
      _DataPersistence.Instance = new _DataPersistence();
    }
    return _DataPersistence.Instance;
  }
  async init(_config) {
    this.textOutput = _config.outputContent.includes("以文本形式发送（数量受限）");
    this.imageOutput = _config.outputContent.includes("以图片方式发送");
    this.dataStorage = _config.dataStorage;
    this.detailLog = _config.detailLog;
    this.setTimer();
    await Promise.all([this.clean(), File.removeAll(this.cacheDir)]);
    await Promise.all([File.mkdir(this.imageCacheDir), File.mkdir(this.textCacheDir)]);
  }
  // 返回包含可发送信息的元组
  async withdraw(_task) {
    const res = await this.select({
      type: _task.type,
      keyword: _task.value
    });
    if (res.length === 0) {
      return null;
    } else if (res.length > 1) {
      logger.info("数据库有重复数据！开始清除并保留一个。");
      try {
        for (let index = 1; index < res.length; index++) {
          await this.drop({
            id: res[index].id
          });
          if (this.textOutput) await File.removeFile(import_path4.default.join(this.textCacheDir, `${res[index].id}.txt`));
          if (this.imageOutput) await File.removeFile(import_path4.default.join(this.imageCacheDir, `${res[index].id}.png`));
        }
      } catch (e) {
        logger.error("清除重复数据失败！建议重载插件以刷新。");
      }
    } else {
      const id = res[0].id;
      if (_task.options["refresh"]) {
        await this.drop({
          id
        });
        if (this.textOutput) await File.removeFile(import_path4.default.join(this.textCacheDir, `${id}.txt`));
        if (this.imageOutput) await File.removeFile(import_path4.default.join(this.imageCacheDir, `${id}.png`));
        return null;
      } else {
        logger.success("从数据库读取信息！");
        const textData = this.textOutput ? await File.readText(import_path4.default.join(this.textCacheDir, `${id}.txt`)) : "";
        const imageData = this.imageOutput ? import_koishi2.h.image(await File.readBuffer(import_path4.default.join(this.imageCacheDir, `${id}.png`)), "image/png") : null;
        return [textData, imageData];
      }
    }
  }
  async record(_task, _text, _image) {
    const inserted = await this.insert(_task.type, _task.value);
    const id = inserted.id;
    if (this.textOutput) await File.writeText(import_path4.default.join(this.textCacheDir, `${id}.txt`), _text);
    if (this.imageOutput) await File.storeBase64Image(import_path4.default.join(this.imageCacheDir, `${id}.png`), _image);
  }
  async clean() {
    await db.drop(dbName);
  }
  async insert(_type, _keyword) {
    return await db.create(dbName, {
      date: /* @__PURE__ */ new Date(),
      type: _type,
      keyword: _keyword
    });
  }
  async drop(_query) {
    return await db.remove(dbName, _query);
  }
  async select(_query) {
    return await db.get(dbName, _query);
  }
  setTimer() {
    const now = /* @__PURE__ */ new Date();
    const nowTimestamp = now.getTime();
    const todayZero = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayZeroTimestamp = todayZero.getTime();
    const oneDayInterval = 24 * 60 * 60 * 1e3;
    if (this.dataStorage > 0) {
      const nextExecutionTime = todayZeroTimestamp + oneDayInterval - nowTimestamp + (this.dataStorage - 1) * oneDayInterval;
      setTimeout(() => {
        setInterval(() => {
          this.cleanDB_Cache(todayZeroTimestamp + oneDayInterval, oneDayInterval);
        }, oneDayInterval);
        this.cleanDB_Cache(todayZeroTimestamp + oneDayInterval, oneDayInterval);
      }, nextExecutionTime);
    }
  }
  // 清除点执行
  async cleanDB_Cache(nowStamp, oneDayInterval) {
    if (this.detailLog) logger.info(`${new Date(nowStamp)}：开始清理缓存数据...`);
    const targetDate = new Date(nowStamp - oneDayInterval * (this.dataStorage - 1));
    const query = {
      date: {
        $lte: targetDate,
        $gte: /* @__PURE__ */ new Date(1)
      }
    };
    try {
      const checked = await this.select(query);
      checked.forEach((e) => {
        if (this.textOutput) File.deleteFile(import_path4.default.join(this.textCacheDir, `${e.id}.txt`));
        if (this.imageOutput) File.deleteFile(import_path4.default.join(this.imageCacheDir, `${e.id}.png`));
      });
      const deleted = await this.drop(query);
      if (this.detailLog) logger.info(`匹配数据${checked.length}条，删除数据${deleted.matched}条。`);
    } catch {
      if (this.detailLog) logger.info(`待清理数据数为0，无需清理。`);
    }
  }
};

// src/core/Processer.ts
var Processer = class {
  static {
    __name(this, "Processer");
  }
  textOutput = false;
  imageOutput = false;
  queue;
  fetchAPI;
  responseHandler;
  renderer;
  dataPersistence;
  processHandling;
  withdrawTips;
  running = false;
  runningCount = 0;
  constructor(_config, _queue) {
    this.queue = _queue;
    this.fetchAPI = FetchAPI.getInstance();
    this.responseHandler = ResponseHandler.getInstance();
    this.renderer = Renderer.getInstance();
    this.dataPersistence = DataPersistence.getInstance();
    this.textOutput = _config.outputContent.includes("以文本形式发送（数量受限）");
    this.imageOutput = _config.outputContent.includes("以图片方式发送");
    this.processHandling = _config.processHandling;
    this.withdrawTips = _config.withdrawTips;
  }
  async push(_task) {
    try {
      this.queue.enQueue(_task);
      const ready = _task.session.sendQueued([import_koishi3.h.quote(_task.session.messageId), "命令成功加入队列。"]);
      if (this.withdrawTips) _task.replyId = (await ready)[0];
      this.running = !this.queue.isEmpty();
      while (this.running && this.runningCount < this.processHandling) {
        const handling = this.queue.next();
        if (handling === null) return;
        this.runningCount++;
        const msgId = await this.taskLine(handling);
        this.runningCount--;
        const finished = this.queue.deQueue(msgId);
        const sess = finished.session;
        if (this.withdrawTips) sess.bot.deleteMessage(sess.channelId, finished.replyId);
        this.running = !this.queue.isEmpty();
        if (this.queue.getSize() === this.runningCount) break;
        else if (this.queue.getSize() < this.runningCount) throw new Error("意外的状态！");
      }
    } catch (e) {
      const sess = _task.session;
      if (e instanceof TipsError) {
        sess.sendQueued([import_koishi3.h.quote(sess.messageId), e.message]);
      } else {
        sess.sendQueued([import_koishi3.h.quote(sess.messageId), "发生意外错误！"]);
        logger.error(e.message);
      }
      if (this.withdrawTips) sess.bot.deleteMessage(sess.channelId, _task.replyId);
      try {
        this.queue.deQueue(sess.messageId, true);
      } catch {
        logger.error("引发异常，异常发生时本次任务已经出队。");
      }
    }
  }
  copyQueue() {
    return Array.from(this.queue.getQueue());
  }
  async taskLine(_task) {
    const data = await this.dataPersistence.withdraw(_task);
    if (data !== null) {
      data.map((e) => {
        if (e !== null && e !== "") _task.session.send(e);
      });
      return _task.session.messageId;
    }
    const resp = await this.fetchAPI.fetchMap[_task.type](_task);
    const [tMode, iMode] = await this.responseHandler.build(_task, ...resp);
    if (this.textOutput) {
      _task.session.send(tMode);
    }
    let bs64;
    if (this.imageOutput) {
      const imgMsg = await this.renderer.render(_task, iMode);
      _task.session.send(imgMsg);
      bs64 = imgMsg.slice(32).slice(0, -3);
    }
    await this.dataPersistence.record(_task, tMode, bs64);
    return _task.session.messageId;
  }
};

// src/core/Registry.ts
var Registry = class _Registry {
  static {
    __name(this, "Registry");
  }
  registry = /* @__PURE__ */ new Map();
  config;
  static Instance;
  constructor() {
  }
  static getInstance() {
    if (!_Registry.Instance) {
      _Registry.Instance = new _Registry();
    }
    return _Registry.Instance;
  }
  async init(_config) {
    this.config = _config;
  }
  register_or_get(_groupId) {
    if (!_groupId) throw new Error("此会话频道ID不存在！");
    if (this.registry.has(_groupId)) {
      return this.registry.get(_groupId);
    } else {
      const groupQueue = new Queue(this.config);
      const list = {
        groupProcesser: new Processer(this.config, groupQueue)
      };
      this.registry.set(_groupId, list);
      return list;
    }
  }
};

// src/core/Initialization.ts
var Initialization = class _Initialization {
  static {
    __name(this, "Initialization");
  }
  registry;
  fetchAPI;
  responseHandler;
  dataPersistence;
  renderer;
  static Instance;
  constructor() {
    this.registry = Registry.getInstance();
    this.fetchAPI = FetchAPI.getInstance();
    this.responseHandler = ResponseHandler.getInstance();
    this.dataPersistence = DataPersistence.getInstance();
    this.renderer = Renderer.getInstance();
  }
  static getInstance() {
    if (!_Initialization.Instance) {
      _Initialization.Instance = new _Initialization();
    }
    return _Initialization.Instance;
  }
  // 数据库创建、资源文件载入、
  async globalInit(_http, _config) {
    await Promise.all([
      this.registry.init(_config),
      this.fetchAPI.init(_http, _config),
      this.responseHandler.init(_http, _config),
      this.dataPersistence.init(_config),
      this.renderer.init(_config)
    ]);
    logger.success("初始化成功！");
  }
  // 群组进程器创建、注册
  async commandInit() {
    await Promise.all([]);
  }
  async destroy() {
  }
};

// src/core/commands/VN.ts
function apply(ctx, main) {
  main.subcommand(".vn <keyword:text>", "查询作品").option("refresh", "-r", { fallback: false }).alias("vndb.v", "vn").action(async ({ session, options }, keyword) => {
    const task = {
      type: "vn" /* VN */,
      value: keyword,
      activated: false,
      session,
      options
    };
    const group = Registry.getInstance().register_or_get(session.channelId);
    group.groupProcesser.push(task);
  });
}
__name(apply, "apply");

// src/core/commands/Character.ts
function apply2(ctx, main) {
  main.subcommand(".character <keyword:text>", "查询角色").option("refresh", "-r", { fallback: false }).alias("vndb.c", "character").action(async ({ session, options }, keyword) => {
    const task = {
      type: "character" /* Character */,
      value: keyword,
      activated: false,
      session,
      options
    };
    const group = Registry.getInstance().register_or_get(session.channelId);
    group.groupProcesser.push(task);
  });
}
__name(apply2, "apply");

// src/core/commands/Producer.ts
function apply3(ctx, main) {
  main.subcommand(".producer <keyword:text>", "查询作者/厂商").option("refresh", "-r", { fallback: false }).alias("vndb.p", "producer").action(async ({ session, options }, keyword) => {
    const task = {
      type: "producer" /* Producer */,
      value: keyword,
      activated: false,
      session,
      options
    };
    const group = Registry.getInstance().register_or_get(session.channelId);
    group.groupProcesser.push(task);
  });
}
__name(apply3, "apply");

// src/core/commands/ID.ts
function apply4(ctx, main) {
  main.subcommand(".id <keyword:string>", "查询ID").option("refresh", "-r", { fallback: false }).alias("vndb.i", "id").action(async ({ session, options }, keyword) => {
    const task = {
      type: "id" /* ID */,
      value: keyword,
      activated: false,
      session,
      options
    };
    const group = Registry.getInstance().register_or_get(session.channelId);
    group.groupProcesser.push(task);
  });
}
__name(apply4, "apply");

// src/core/commands/Event.ts
function apply5(ctx, main) {
  main.subcommand(".event [date: string]", "查询今天历史发布、角色生日").option("refresh", "-r", { fallback: false }).alias("vndb.e", "event").action(async ({ session, options }, date) => {
    let formatedDate;
    const now = /* @__PURE__ */ new Date();
    const year = now.getFullYear();
    if (date) {
      const cut = date.split("-");
      if (cut.length === 2) {
        try {
          formatedDate = `${year}-${turnValidDate(cut)}`;
        } catch {
          return "日期错误！";
        }
      } else {
        return "日期格式错误！应为MM-DD格式。";
      }
    } else {
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const cut = [month, day];
      formatedDate = `${year}-${turnValidDate(cut)}`;
    }
    const task = {
      type: "event" /* Event */,
      value: formatedDate,
      activated: false,
      session,
      options
    };
    const group = Registry.getInstance().register_or_get(session.channelId);
    group.groupProcesser.push(task);
  });
}
__name(apply5, "apply");
function turnValidDate(_number) {
  const n1 = Number(_number[0]);
  const n2 = Number(_number[1]);
  if (isNaN(n1) || isNaN(n2) || !Number.isInteger(n1 + n2)) {
    throw Error;
  } else {
    return `${_number[0].padStart(2, "0")}-${_number[1].padStart(2, "0")}`;
  }
}
__name(turnValidDate, "turnValidDate");

// src/core/commands/Sundry.ts
function apply6(ctx, main) {
  main.subcommand(".queue", "查看当前群聊的任务队列").alias("vndb.q", "queue").action(async ({ session }) => {
    const group = Registry.getInstance().register_or_get(session.channelId);
    const queue = group.groupProcesser.copyQueue();
    const running = queue.filter((e) => e.activated);
    return `当前群聊有${queue.length}个任务。有${running.length}个正在运行。正在执行${buildRunning(running)}...`;
  });
}
__name(apply6, "apply");
function buildRunning(_run) {
  return _run.map((e) => `「${e.type}-${e.value}」`);
}
__name(buildRunning, "buildRunning");

// src/core/commands/Index.ts
function apply7(ctx) {
  const main = ctx.command("vndb");
  apply(ctx, main);
  apply2(ctx, main);
  apply3(ctx, main);
  apply4(ctx, main);
  apply5(ctx, main);
  apply6(ctx, main);
}
__name(apply7, "apply");

// src/index.ts
var name = "pyura-vndb";
var logger;
var http;
var pptr;
var db;
var dataDir;
var dbName = "vndb";
var Config = import_koishi4.Schema.intersect(
  [
    import_koishi4.Schema.object({
      retryCount: import_koishi4.Schema.number().min(1).max(10).default(3).description("请求服务器时最大重连次数"),
      withdrawTips: import_koishi4.Schema.boolean().default(false).description("当本次任务发送成功后撤回提示消息"),
      adminsId: import_koishi4.Schema.array(String).description("管理员ID列表"),
      detailLog: import_koishi4.Schema.boolean().default(true).description("在控制台输出更详细的日志信息")
    }).description("全局配置"),
    import_koishi4.Schema.object({
      processHandling: import_koishi4.Schema.number().min(3).max(10).default(5).description("各群组并发处理数"),
      outputContent: import_koishi4.Schema.array(import_koishi4.Schema.union(["以图片方式发送", "以文本形式发送（数量受限）"])).role("checkbox").default(["以图片方式发送"]).description("发送形式选项（至少选一个）"),
      backgroundPath: import_koishi4.Schema.path().experimental().description("为生成的图片设置自定义的长背景图路径（jpg格式）"),
      fontPath: import_koishi4.Schema.path().experimental().description("为生成的图片设置自定义的字体路径（ttf格式）"),
      isMerge: import_koishi4.Schema.boolean().default(true).description("合并发送文字结果的多个内容")
    }).description("搜索通用配置"),
    import_koishi4.Schema.object({
      characterOptions: import_koishi4.Schema.array(import_koishi4.Schema.union(["a-血型", "b-身高/体重", "c-性别（不剧透）", "d-真实性别（含剧透）", "e-三围", "f-罩杯", "g-简介（未翻译）"])).role("checkbox").description("人物信息额外配置，无数据时不发送")
    }).description("vndb.character指令配置"),
    import_koishi4.Schema.object({
      maxImageNumber: import_koishi4.Schema.number().min(3).max(100).default(10).description("以图片发送时显示的最多代表作品数（数字越大渲染时间越久）")
    }).description("vndb.producer指令配置"),
    import_koishi4.Schema.object({
      lowestRating: import_koishi4.Schema.number().min(60).max(95).default(75).description("仅展示rating不低于此值的作品及其角色")
    }).description("vndb.event指令配置"),
    import_koishi4.Schema.object({
      dataStorage: import_koishi4.Schema.number().min(0).default(3).description("数据库和本地缓存清理时间（0表示永不自动清理，配置更新仍会立刻清空以更新）")
    }).description("缓存配置")
  ]
);
var inject = {
  required: ["http", "database", "puppeteer"]
};
function apply8(ctx) {
  ctx.on("ready", async () => {
    ctx.model.extend(dbName, {
      id: "unsigned",
      date: "date",
      type: "string",
      keyword: "string"
    }, {
      primary: "id",
      autoInc: true
    });
    logger = ctx.logger(name);
    http = ctx.http;
    pptr = ctx.puppeteer;
    db = ctx.database;
    dataDir = import_path5.default.join(ctx.baseDir, "data", name);
    await Initialization.getInstance().globalInit(ctx.http, ctx.config);
  });
  ctx.on("dispose", async () => {
  });
  apply7(ctx);
}
__name(apply8, "apply");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Config,
  apply,
  dataDir,
  db,
  dbName,
  http,
  inject,
  logger,
  name,
  pptr
});
