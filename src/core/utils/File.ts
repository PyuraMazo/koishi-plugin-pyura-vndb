import fs from 'fs/promises'

import { TipsError } from "../api/Errors";


// 初始化校验全部资源存在，此处无需检查
export class File {
    static async readBuffer(_path: string) {
        if (!await File.checkExist(_path)) throw new Error(`尝试读取不存在的文件！（${_path}）`);

        try {
            return await fs.readFile(_path);
        } catch {
            throw new TipsError('文件读取失败！');
        }
    }

    static async readText(_path: string) {
        if (!await File.checkExist(_path)) throw new Error(`尝试读取不存在的文件！（${_path}）`);

        try {
            return await fs.readFile(_path, { encoding: 'utf-8' });
        } catch {
            throw new TipsError('文件读取失败！');
        }
    }

    static async readBase64(_path: string) {
        if (!await File.checkExist(_path)) throw new Error(`尝试读取不存在的文件！（${_path}）`);

        try {
            return await fs.readFile(_path, { encoding: 'base64' });
        } catch {
            throw new TipsError('文件读取失败！');
        }
    }

    static async writeText(_path: string, _text: string) {
        try {
            await fs.writeFile(_path, _text, { encoding: 'utf-8' });
        } catch {
            throw new Error(`写入文件失败！（${_path}）`)
        }
    }

    static async writeBuffer(_path: string, _buffer: Buffer) {
        try {
            await fs.writeFile(_path, _buffer);
        } catch {
            throw new Error(`写入文件失败！（${_path}）`)
        }
    }

    static async storeBase64Image(_path: string, _base64: string) {
        await File.writeBuffer(_path, Buffer.from(_base64, 'base64'));
    }

    static async checkExist(_path: string) {
        try {
            await fs.access(_path);
            return true;
        } catch {
            return false;
        }
    }

    static async deleteFile(_path: string) {
        try {
            await fs.unlink(_path)
        } catch {
            throw new Error(`删除文件错误！（${_path}）`);
        }
    }

    static async removeAll(_path: string) {
        try {
            await fs.rm(_path, {
                recursive: true,
                force: true
            });
        } catch {
            throw new Error(`清空文件夹错误！（${_path}）`);
        }
    }

    static async mkdir(_path: string) {
        try {
            if (!await File.checkExist(_path)) {
                await fs.mkdir(_path, { recursive: true });
            }
        } catch {
            throw new Error(`创建文件夹错误！（${_path}）`);
        }
    }
}


export default File;