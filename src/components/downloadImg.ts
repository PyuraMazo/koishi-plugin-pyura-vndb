import { Context } from 'koishi'
import path from 'path';
import  fs  from "fs";

export class DownloadImg{
    storagePath: string = path.join(__dirname, 'tempImgs');
    ctx: Context;
    tasks: string[];

    constructor(_ctx: Context, _urls: string[]){
        this.ctx = _ctx;
        this.tasks = _urls;
    }

    async download(): Promise<string[]> {
        return Promise.allSettled(
        this.tasks.map(async (item, index) => {
            let retry = 0;
            while (retry <= this.ctx.config.retryCount){
            try {
                retry++;
                if (item === "unknown") return "unknown";
                const source = await this.ctx.http.get(item, { responseType: 'arraybuffer' });
                const file = path.join(this.storagePath, `${index}.png`);
                await fs.promises.writeFile(file, Buffer.from(source));
                return file;
            } catch (err) {
                if (this.ctx.config.debug) {
                    console.log(`第${retry}次下载图片：${item}失败`)
                }
            }
            }
            if (this.ctx.config.debug) console.log(`图片链接 ${item} 保存失败`);
            return "error";
        })
        ).then(results => 
        results.map(r => r.status === 'fulfilled' ? r.value : path.join(this.storagePath, `error.png`))
        );
    }

    async clean() {
        await Promise.allSettled(
            this.tasks.map(async item => {
                const file = path.join(this.storagePath, this.tasks.indexOf(item) + ".png");
                if (fs.existsSync(file)) {
                    fs.unlink(file, () => {})
                }
            })
        )
    }
}

export default DownloadImg;
