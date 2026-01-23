import path from "path"

import { Logger, HTTP, h } from "koishi";

import * as Types from "./api/Types";
import * as Grands from "./api/Grand";
import { Downloader } from "./internet/Downloader";
import File from "./utils/File";

// 所有方法都是直接返回一个元组，第一个数据是文字数据，第二个是图片渲染数据
export class ResponseHandler {
    private textOutput = false;
    private imageOutput = false;
    private characterOptions: string[]
    private isMerge: boolean;
    private backgroundPath: string;
    private fontPath: string;

    private downloader: Downloader;

    private resourcesDir = path.resolve(__dirname, 'resources')
    private bgBase64 = '';
    private fontBase64 = '';

    private static Instance: ResponseHandler;

    private constructor() { }

    static getInstance(): ResponseHandler {
        if (!ResponseHandler.Instance) {
            ResponseHandler.Instance = new ResponseHandler();
        }
        return ResponseHandler.Instance;
    }

    async init(_http: HTTP, _config: Types.Config,) {
        this.downloader = Downloader.getInstance();

        this.textOutput = _config.outputContent.includes('以文本形式发送（数量受限）');
        this.imageOutput = _config.outputContent.includes('以图片方式发送');
        this.characterOptions = _config.characterOptions.map(e => e.split('-')[0]);
        this.backgroundPath = _config.backgroundPath ?? null;
        this.fontPath = _config.fontPath ?? null;
        this.isMerge = _config.isMerge;

        if (this.imageOutput) {
            if (this.bgBase64 === '') {
                const i1 = await File.readBuffer(this.backgroundPath ?? path.join(this.resourcesDir, 'image', 'bg.jpg'))
                this.bgBase64 = `data:image/jpeg;base64,${i1.toString('base64')}`
            }
            if (this.fontBase64 === '' && this.fontPath) {
                const i2 = await File.readBuffer(this.fontPath)
                this.fontBase64 = `data:font/ttf;base64,${i2.toString('base64')}`
            }
        }

        await this.downloader.init(_http, _config);
    }

    async build(_cmd: Types.TaskUnit, _resp: Types.VNResponse[] | Types.CharacterResponse[] | Types.ProducerResponse[], _extraResp?: object[]): Promise<[string, Types.RenderedArgument]> {
        const title = this.handleTitle(_cmd, _resp.length);
        let handledType: string = _cmd.type;
        if (_cmd.type === Grands.CommandType.ID) {
            handledType = Grands.Id2Command[_cmd.value[0]]
        }

        const text = [title[0]]
        const image = []
        if (handledType === Grands.CommandType.VN) {
            for (let index = 0; index < _resp.length; index++) {
                const [tData, iData] = await this.handleVN(_resp[index] as Types.VNResponse)
                text.push(tData as string);
                image.push(iData);
            }
        } else if (handledType === Grands.CommandType.Character) {
            for (let index = 0; index < _resp.length; index++) {
                const [tData, iData] = await this.handleCharacter(_resp[index] as Types.CharacterResponse)
                text.push(tData as string);
                image.push(iData);
            }
        } else if (handledType === Grands.CommandType.Producer) {
            for (let index = 0; index < _resp.length; index++) {
                const [tData, iData] = await this.handleProducer(_resp[index] as Types.ProducerResponse, _extraResp[index]['results'] as Types.VNResponse[])
                text.push(tData as string);
                image.push(iData);
            }
        } else if (handledType === Grands.CommandType.Event) {
            const [vnText, vnImage, chaText, chaImage] = [[], [], [], []];

            for (let index = 0; index < _resp.length; index++) {
                const [tData, iData] = await this.handleVN(_resp[index] as Types.VNResponse)
                vnText.push(tData as string);
                vnImage.push(iData);
            }
            image.push({
                columnInfo: _resp.length !== 0 ? '今天是这些作品的发布纪念日' : '过去的今天没有新作品发布...',
                vns: vnImage
            } as Types.RenderedColumn)
            for (let index = 0; index < _extraResp.length; index++) {
                const [tData, iData] = await this.handleCharacter(_extraResp[index] as Types.CharacterResponse)
                chaText.push(tData as string);
                chaImage.push(iData);
            }
            image.push({
                columnInfo: _extraResp.length !== 0 ? '今天是这些角色的生日' : '今天没有角色的过生日...',
                vns: chaImage
            } as Types.RenderedColumn)
            text.push(vnText.join('\n'), chaText.join('\n'));

        } else {
            throw new Error('未知的指令类型。')
        }

        return [
            this.textOutput
                ? this.isMerge ? `<message forward>${text.join('</message>')}</message>` : text.join('</message>')
                : '',
            this.imageOutput
                ? {
                    title: title[1],
                    items: image,
                    bgImage: this.bgBase64,
                    font: this.fontBase64
                }
                : null
        ]
    }


    private handleTitle(_cmd: Types.TaskUnit, _count: number) {
        let text: string = '';
        let image: string = '';

        const title = _cmd.type === Grands.CommandType.Event
            ? [`指令「${_cmd.type}」`, `「${_cmd.value}」`, `「${Grands.WeekDate[new Date(_cmd.value).getDay()]}曜日」`]
            : [`指令「${_cmd.type}」`, `关键词「${_cmd.value}」`, `结果数「${_count}」`];

        if (this.textOutput) {
            text = `${title.join('\n')}`;
        }
        if (this.imageOutput) {
            image = title.join('<br>');
        }

        return [text, image]
    }


    private async handleVN(_resp: Types.VNResponse) {
        let text: string = '';
        let image: Types.RenderedItem = null;

        const [avg, rat, rele, id] = this.simplyBuild([_resp.average, _resp.rating, _resp.released, _resp.id], ['平均分', '贝叶斯评分', '发布日期', 'VNDB ID']);
        const [plat, alia] = this.simplyBuildArray([_resp.platforms, _resp.aliases], ['支持平台', '别名']);

        const len = _resp.length_minutes ? `游玩时间：${(_resp.length_minutes / 60).toFixed(2)}H` : '';
        const dev = _resp.developers ? `厂商（VNDB ID）：${_resp.developers.map(e => `${e.original ?? e.name}（${e.id}）`).join('、')}` : '';

        const name = _resp.alttitle ?? _resp.title;

        const lang = []
        if (_resp.titles) {
            const valid = Object.keys(Grands.LangDic);
            _resp.titles.forEach(e => {
                if (valid.includes(e.lang)) lang.push(`${Grands.LangDic[e.lang]}标题（${e.official ? '' : '非'}官方）：${e.title}`);
            })
        }

        const imgUrl = _resp.image ? _resp.image.url : '';
        const imgBuffer = await this.downloader.download(imgUrl);

        if (this.textOutput) {
            const tit = lang.join('\n');

            text = [this.textImage(imgBuffer), name, id, tit, alia, dev, rele, avg, rat, len, plat].filter(e => e !== '').join('\n');
        }
        if (this.imageOutput) {
            const tit = lang.join('<br>');

            image = {
                subtitle: name,
                text: [id, tit, alia, dev, rele, avg, rat, len, plat].filter(e => e !== '').join('<br>'),
                image: `data:image/jpeg;base64,${imgBuffer.toString('base64')}`
            }
        }
        return [text, image]
    }

    private async handleCharacter(_resp: Types.CharacterResponse) {
        let text: string = '';
        let image: Types.RenderedItem = null;

        const [id] = this.simplyBuild([_resp.id], ['VNDB ID']);
        const [alia] = this.simplyBuildArray([_resp.aliases], ['别名']);

        const bir = _resp.birthday ? `生日：${_resp.birthday[0]}月${_resp.birthday[1]}日` : '';
        const vns = `出场作品（id）：${_resp.vns.map(e => `『${e.alttitle ?? e.title}』（${e.id}）`).join('、')}`;

        const blo = this.characterOptions.includes('a') && _resp.blood_type ? `血型：${_resp.blood_type}` : '';
        const wh = this.characterOptions.includes('b') && (_resp.weight || _resp.height)
            ? `身高/体重（cm/kg）：${_resp.height ?? '??'}/${_resp.weight ?? '??'}`
            : '';
        const gender_o = this.characterOptions.includes('c') && _resp.sex ? `性别：${Grands.GenderDic[_resp.sex[0]]}` : '';
        const gender_i = this.characterOptions.includes('d') && _resp.sex ? `真实性别：${Grands.GenderDic[_resp.sex[1]]}` : '';
        const bwh = this.characterOptions.includes('e') && (_resp.bust || _resp.waist || _resp.hips)
            ? `三围：${_resp.bust ?? '??'}-${_resp.waist ?? '??'}-${_resp.hips ?? '??'}`
            : '';
        const cup = this.characterOptions.includes('f') && _resp.cup ? `罩杯：${_resp.cup}` : '';
        const des = this.characterOptions.includes('g') && _resp.description ? `简介：${_resp.description}` : '';

        const imgUrl = _resp.image ? _resp.image.url : '';
        const imgBuffer = await this.downloader.download(imgUrl);

        if (this.textOutput) {
            const name = `姓名：${_resp.original ?? _resp.name}`;
            text = [this.textImage(imgBuffer), id, name, alia, bir, vns, blo, wh, gender_o, gender_i, bwh, cup, des].filter(e => e !== '').join('\n');
        }
        if (this.imageOutput) {
            const name = _resp.original ?? _resp.name;
            image = {
                subtitle: name,
                text: [id, alia, bir, vns, blo, wh, gender_o, gender_i, bwh, cup, des].filter(e => e !== '').join('<br>'),
                image: `data:image/jpeg;base64,${imgBuffer.toString('base64')}`
            }
        }
        return [text, image]
    }

    private async handleProducer(_resp: Types.ProducerResponse, _vns: Types.VNResponse[]) {
        let text: string = '';
        let image: Types.RenderedColumn = null;
        let vnsImage: Types.RenderedItem[] = [];

        const [id, name, lang, type, des] = this.simplyBuild([_resp.id, _resp.original ?? _resp.name, Grands.LangDic[_resp.lang], Grands.TypeDic[_resp.type], _resp.description]
            , ['VNDB ID', '名称', '文本语言', '类型', '简介']);
        const [alia] = this.simplyBuildArray([_resp.aliases], ['别名']);
        const tips = '代表作品：'

        const vnText = [];
        const vnImgCo = []


        for (let index = 0; index < _vns.length; index++) {
            const vns = _vns[index] as Types.VNResponse;
            const [vnTi, vnId, vnRea, vnRat] = this.simplyBuild([vns.aliases ?? vns.title, vns.released, vns.rating, vns.id],
                ['名称', 'VNDB ID', '发布日期', '贝叶斯评分']);

            vnText.push([vnTi, vnRea, vnRat, vnId])
            const imgUrl = vns.image ? vns.image.url : '';
            vnImgCo.push(this.downloader.download(imgUrl))
        }

        // 无法缓存的图片都用错误图片替代
        const vnImg = await Promise.all(vnImgCo);

        if (this.textOutput) {
            const vnsArray = []
            for (let index = 0; index < vnText.length && index < 3; index++) {
                const vn = vnText[index].filter(e => e !== '');
                vn.unshift(this.textImage(vnImg[index]));
                vnsArray.push(vn.join('\n'));
            }
            text = [id, name, alia, lang, type, des, tips, vnsArray.join('\n')].filter(v => v !== '').join('\n');
        }
        if (this.imageOutput) {
            for (let index = 0; index < vnText.length; index++) {
                vnsImage.push({
                    subtitle: '',
                    image: `data:image/jpeg;base64,${vnImg[index].toString('base64')}`,
                    text: vnText[index].filter(v => v !== '').join('<br>')
                })
            }
            image = {
                columnInfo: [id, name, alia, lang, type, des].join('<br>'),
                vns: vnsImage
            }
        }

        return [text, image]
    }


    private simplyBuild(_data: any[], _zh: string[]) {
        const res = [];
        for (let index = 0; index < _zh.length; index++) {
            res.push(_data[index] ? `${_zh[index]}：${_data[index]}` : '')
        }
        return res;
    }

    private simplyBuildArray(_data: any[][], _zh: string[], sign = '、') {
        const res = [];
        for (let index = 0; index < _zh.length; index++) {
            res.push(_data[index] && _data[index].length !== 0 ? `${_zh[index]}：${_data[index].join(sign)}` : '')
        }
        return res;
    }

    private textImage(_buffer: Buffer) {
        return h.image(_buffer, 'image/jpeg')
    }

}