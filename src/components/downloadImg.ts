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
        return await Promise.all(
        this.tasks.map(async (item, index) => {
            if (item === "unknown") return "unknown";
            
            try {
            const source = await this.ctx.http.get(item, { responseType: 'arraybuffer' });
            const file = path.join(this.storagePath, `${index}.png`);
            
            await fs.promises.writeFile(file, Buffer.from(source));
            return file; 
            } catch (err) {
            console.log(`链接 ${item} 保存失败`);
            throw err; 
            }
        })
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
