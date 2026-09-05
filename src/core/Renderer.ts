import path from "path"
import ejs from "ejs"

import { pptr } from "..";
import { File } from "./utils/File";
import { RenderedArgument, TaskUnit, Config } from "./api/Types";
import { CommandType, Id2Command, TemplateMap } from "./api/Grand";


export class Renderer {

    private resourcesDir = path.resolve(__dirname, 'resources')
    private compiledTemplate: ejs.TemplateFunction[] = [];

    private imageOutput = false;

    private static Instance: Renderer;

    private constructor() { }

    static getInstance(): Renderer {
        if (!Renderer.Instance) {
            Renderer.Instance = new Renderer();
        }
        return Renderer.Instance;
    }

    async init(_config: Config) {
        this.imageOutput = _config.outputContent.includes('以图片方式发送');
        if(!this.imageOutput) return;

        if (this.compiledTemplate.length < 2) {
            this.compiledTemplate = [];
            const i1 = File.readText(path.join(this.resourcesDir, 'template', 'template0.html'));
            const i2 = File.readText(path.join(this.resourcesDir, 'template', 'template1.html'));
            const data = await Promise.all([i1, i2]);
            data.forEach(e => { this.compiledTemplate.push(ejs.compile(e)) });
        }
    }

    async render(_task: TaskUnit, _data: RenderedArgument) {
        const html = _task.type === CommandType.ID 
        ? this.compiledTemplate[TemplateMap[Id2Command[_task.value[0]]]](_data) 
        : this.compiledTemplate[TemplateMap[_task.type]](_data);
        return await pptr.render(html);
    }
}



export default Renderer;