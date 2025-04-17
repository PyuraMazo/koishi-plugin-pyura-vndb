export interface argSet {
    argSourceArr: string[];
    argChsArr: string[];
    argConnSymbol: string;

    kindKey2Value: number[];
    kindkey2Arr: number[];
}


export class HandleOutput {
    // 把数组内容依次拼接
    outputWholeArr (_arr: string[], _conn: string): string {
        return _arr.join(_conn);
    }

    // 更完整的标题
    outputMoreLangTitles (_singleObj: object): string {
        let str = "";
        _singleObj["titles"].forEach(v => {
            if (v["lang"] === "en") {
                str += `英文标题（${v["official"] ? "官方" : "非官方"}）：${v["title"]}\n`
            } else if (v["lang"] === "ja") {
                str += `日语标题（${v["official"] ? "官方" : "非官方"}）：${v["title"]}\n`
            } else if (v["lang"] === "zh-Hans" || v["lang"] === "zh-Hant") {
                str += `中文标题（${v["official"] ? "官方" : "非官方"}）：${v["title"]}\n`
            }
        })
        return str;
    }

    // 简单的标题
    outputlessLangTitles (_singleObj: object): string {
        let str = "";
        _singleObj["titles"].forEach(v => {
            if (v["lang"] === "ja") {
                str += `日语标题（${v["official"] ? "官方" : "非官方"}）：${v["title"]}\n`
            } else if (v["lang"] === "zh-Hans" || v["lang"] === "zh-Hant") {
                str += `中文标题（${v["official"] ? "官方" : "非官方"}）：${v["title"]}\n`
            }
        })
        return str;
    }

    outputObjProperties(_innerObj: object, _properties: string[], _chsMatch: string[]): string {
        let str = "";
        _properties.forEach((v, i, arr) => {
            str += `${_chsMatch[i]}：${String(_innerObj[v])}`;
            if (i !== arr.length - 1) {
                str += '\n';
            }
        })
        return str;
    }

    // 一张封面图的url
    ouputCoverImg (_singleObj: object): string {
        try { 
            return `<img src="${_singleObj["image"]["url"]}"/>`
        } catch {
            return "---图片链接失效！\n"
        }
        
    }

    // 出版商名+id
    outputProducersInfo (_singleObj: object): string {
        let str = "出版商（id）：";
        _singleObj["developers"].forEach(v => {
            str += v["original"] || `${v["name"]}` ;
            str += `（${String(v["id"])}）\n`;
        })
        return str;
    }

    outputVnVnDevstatus(_singleObj: object): string {
        const num = _singleObj["devstatus"];
        if (num === 0) {
            return "已完成\n";
        } else if (num === 1) {
            return "制作中\n";
        } else if (num === 2) {
            return "已取消\n";
        }
    }

    outputProducerName (_singleObj: object): string {
        let str = "名称：";
        str += _singleObj["original"] || `${_singleObj["name"]}\n`;
        return str;
    }

    outputProducerType(_singleObj: object): string {
        const type = _singleObj["type"];
        if (type === "co") {
            return "正式公司\n";
        } else if (type === "in") {
            return "个人\n";
        } else if (type === "ng") {
            return "业余组织\n";
        }
    }

    outputCharacterGenderMatch(_gender: string): string {
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

    outputCharacterGenderMore(_singleObj: object): string {
        if (!_singleObj["gender"]) {
            return "性别：无数据\n";
        }
        return `表面性别：${this.outputCharacterGenderMatch(_singleObj["gender"][0])}\n真实性别：${this.outputCharacterGenderMatch(_singleObj["gender"][1])}\n`;
    }

    outputCharacterGenderLess(_singleObj: object): string {
        if (!_singleObj["gender"]) {
            return "性别：无数据\n";
        }
        return `性别：${this.outputCharacterGenderMatch(_singleObj["gender"][0])}\n`;
    }

    outputCharacterVns (_singleObj: object): string {
        let temp = [];
        _singleObj["vns"].forEach(v => {
            temp.push(v["alttitle"]);
        })
        return `出场游戏：${temp.join("---")}\n`;
    }

    outputCharacterBWH (_singleObj: object): string | null {
        let temp = [];
        let isNone = 0;
        ["bust","waist","hips"].forEach(v => {
            if (!_singleObj[v]) {
                isNone++;
            }
            temp.push(String(_singleObj[v]));
        })
        if (isNone === 3) {
            return;
        }

        return `三围：${temp.join("-")}\n`;
    }

}

export default HandleOutput;