import { Context } from 'koishi'
import DownloadImg from "./downloadImg"
import { VnTodayHtml, VnTodayInfo_1, VnTodayInfo_2 } from "./imgHtml"


export class CreateImgVT {
    html: string;
    ctx: Context;
    downloader: DownloadImg;
    res_vn: Object[];
    res_cha: Object[];
    img_path: string[];

    constructor(_ctx: Context, _res: Object[][]) {
        this.ctx = _ctx;
        this.res_vn = _res[0];
        this.res_cha = _res[1];
    }

    async run(): Promise<string> {
        [this.res_vn, this.res_cha] = this.filterRating();

        let retry = 0;
        while(retry <= this.ctx.config.retryCount) {
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
        this.res_vn.forEach(v => {
            const info: VnTodayInfo_1 = {
                img: this.img_path[this.res_vn.indexOf(v)],
                date: v["released"],
                title: `《${v["alttitle"] || v["title"]}》`,
                producer: this.getProducer(v["developers"])
            };
            if (v["rating"] && v["rating"] >= 80) html.insertLegendBlock_1(info, v["rating"]);
            else html.insertBlock_1(info);
            i++;
        })
        this.res_cha.forEach(v => {
            const info: VnTodayInfo_2 = {
                img: this.img_path[this.res_cha.indexOf(v) + i],
                name: v["original"] || v["name"],
                game: this.vnsArr(v["vns"])
            };
            html.insertBlock_2(info);
            j++;
        })

        if (i === 0) html.insertSubtitle_1("今天没有令人记忆深刻的作品诞生...");
        else html.insertSubtitle_1("这些作品在历史上的今天发售...");
        if (j === 0 ) html.insertSubtitle_2("好像没有找到知名的角色的生日是今天...")
        else html.insertSubtitle_2("今天是这些角色的生日  你认识TA们吗  ")

        const source = html.build().replace(/\\/g, '/');
        
        try{
            const base64 = await this.ctx.puppeteer.render(source, async (page, next) => {
                await page.setViewport({ width: 600, height: 800 });


                return next(await page.$('body'));
            })
            this.downloader.clean();
            
            return base64;
        } catch (err) {
            if (this.ctx.config.debug) this.ctx.logger.warn("图片渲染失败！");
            return "";
        }
    }

    async download(){
        let urls = [];
        this.res_vn.forEach(v => {
            urls.push(v["image"]["url"] ? v["image"]["url"] : "unknown\n")
        });
        this.res_cha.forEach(v => {
            urls.push(v["image"]["url"] ? v["image"]["url"] : "unknown\n")
        });
        this.downloader = new DownloadImg(this.ctx, urls);
        this.img_path = await this.downloader.download();
    }

    getProducer(s: Object[]): string{
        const ss = [];
        s.forEach(v => {
            ss.push(v["original"] || v["name"]);
        })
        return ss.join("、");
    }

    filterRating(): Object[][] {
        let vn = [];
        let cha = [];

        this.res_vn.forEach(v => {
            if (!v["rating"] || v["rating"] < this.ctx.config.filterRating) return;
            vn.push(v);
        })
        this.res_cha.forEach(v => {
            if (!this.vnsSatisfy(v["vns"])) return;
            cha.push(v);
        })

        return [vn, cha];
    }

    vnsSatisfy(vns: Object[]): boolean {
        for (const v of vns) {
            if (v["rating"] && v["rating"] >= this.ctx.config.filterRating) return true;
        }
        return false;
    }

    vnsArr(vns: Object[]): string {
        let arr = [];
        vns.forEach( v => {
            arr.push(`《${v["alttitle"] || v["title"]}》`);
        })
        return arr.join("、");
    }
}
