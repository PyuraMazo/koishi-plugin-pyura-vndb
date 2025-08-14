import path  from "path";

export class VnTodayHtml{
    content_1: string = "";
    content_2: string = "";
    subtitle_1: string;
    subtitle_2: string;

    build(): string{
        return `
        <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    @font-face {
                        font-family: "all";
                        src: url("${path.join(__dirname, "fonts/simhei.ttf")}");
                    }
                    @font-face {
                        font-family: "CN";
                        src: url("${path.join(__dirname, "fonts/GeTeShiZiTi-1.ttf")}");
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
                        background-image: url("${path.join(__dirname, "elements/bg.png")}");
                        background-repeat: no-repeat;
                        background-size: cover;
                    }
                    .title {
                        font-family: "CN";
                        font-size: 50px;
                        color:blue;
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
                <div class="content">
                <div class="subtitle" id="vn">${this.subtitle_1}</div>
                ${this.content_1}
                <div class="subtitle" id="cha">${this.subtitle_2}</div>
                ${this.content_2}
                </div>
            </body>
            </html>
        `
    }

    insertSubtitle_1(text: string){
        this.subtitle_1 = text;
    }

    insertSubtitle_2(text: string){
        this.subtitle_2 = text;
    }

    insertBlock_1(info: VnTodayInfo_1){
        this.content_1 += `
        <div class="block">
        <div class="img" style='background-image: url("${info.img}");'></div>
        <div class="text">
        ${info.title}<br>
        发售日：<br>${info.date}<br>
        厂商：<br>${info.producer}</div></div>
        `
    }

    insertBlock_2(info: VnTodayInfo_2){
        this.content_2 += `
        <div class="block">
        <div class="img" style='background-image: url("${info.img}");'></div>
        <div class="text">
        ${info.name}<br>
        登场作品：<br>《${info.game}》</div></div>
        `
    }
}


export interface VnTodayInfo_1{
    img: string,
    date: string,
    title: string,
    producer: string;
}

export interface VnTodayInfo_2{
    img: string,
    name: string,
    game: string;
}