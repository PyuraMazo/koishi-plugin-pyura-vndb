import path  from "path";

export class VnTodayHtml{
    date: string;
    week: string;
    content_1: string = "";
    content_2: string = "";
    subtitle_1: string;
    subtitle_2: string;

    constructor() {
        this.getDate();
    }

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
                    @font-face {
                        font-family: "CN_1";
                        src: url("${path.join(__dirname, "fonts/Hangyaku-L3oaG.ttf")}");
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
        登场作品：<br>${info.game}</div></div>
        `
    }

    insertLegendBlock_1(info: VnTodayInfo_1, rating: number){
        this.content_1 += `
        <div class="legend_block">
        <div class="img" style='background-image: url("${info.img}");'></div>
        <div class="text">
        ${info.title}<br>
        发售日：<br>${info.date}<br>
        厂商：<br>${info.producer}<br>
        ★评分：${rating}</div></div>
        `
    }

    getDate() {
        const now = new Date();
        const year = String(now.getFullYear());
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const week = now.getDay();
        const weekArr = ["日","月","火","水","木","金","土"];
        this.date = `${year}年${month}月${day}日`;
        this.week = weekArr[week] + "曜日";
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