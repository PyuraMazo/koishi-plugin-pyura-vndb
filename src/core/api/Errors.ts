
export class TipsError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class FileReadError extends TipsError {
    constructor() {
        super('文件读取失败！');
    }
}

export class ImageDownloadError extends TipsError {
    constructor() {
        super('图片下载失败！改用错误图片。');
    }
}

export default TipsError; 