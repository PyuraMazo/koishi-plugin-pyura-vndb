import { Session } from "koishi";

import { CommandType } from "./Grand";
import { Processer } from "../Processer";

export interface GroupRegistry {
    groupProcesser: Processer
}


export interface Config {
    retryCount: number,
    withdrawTips: boolean,
    adminsId: string[],
    detailLog: boolean,

    processHandling: number,
    outputContent: string[],
    isMerge: boolean,
    backgroundPath: string,
    fontPath: string;

    characterOptions: string[],

    maxImageNumber: number,

    lowestRating: number,

    dataStorage: number,
}


export interface TaskUnit {
    type: CommandType,
    value: string,
    activated: boolean,
    session: Session,
    replyId?: string
}

export interface TaskResult {
    success: boolean,
    keyword: string,
    errorMsg?: string
}


export interface VNResponse {
    id: string,
    rating: number,
    released: string,
    alttitle: string,
    title: string,
    image: {
        url: string
    },
    average?: number,
    length_minutes?: number,
    platforms?: string[],
    aliases?: string[],
    developers?: {
        id: string
        original: string,
        name: string
    }[],
    titles?: {
        lang: string,
        title: string,
        official: boolean
    }[]
}


export interface CharacterResponse {
    id: string,
    name: string,
    original: string,
    birthday: number[],
    image: {
        url: string
    },
    vns: {
        alttitle: string,
        title: string,
        id: string,
        rating?: number
    }[],
    aliases?: string[],
    sex?: string[],
    waist?: number,
    hips?: number,
    bust?: number,
    blood_type?: string,
    weight?: number,
    height?: number,
    cup?: string,
    description?: string,
}


export interface ProducerResponse {
    id?: string,
    name?: string,
    original?: string,
    aliases?: string[],
    lang?: string,
    type?: string,
    description?: string
}


export interface RenderedArgument {
    title: string,
    items: RenderedItem[] | RenderedColumn[],
    bgImage: string,
    font: string
}

export interface RenderedItem {
    subtitle: string,
    image: string,
    text: string
}

export interface RenderedColumn {
    columnInfo: string
    vns: RenderedItem[]
}
    