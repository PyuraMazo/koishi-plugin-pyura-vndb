export const CommandFields = {
    'vn': 'id,average,rating,released,length_minutes,platforms,aliases,developers{id,original,name},titles{lang,title,official},image{url},alttitle,title',
    'character': 'id,name,aliases,sex,birthday,waist,hips,bust,blood_type,weight,height,cup,original,image{url},vns{id,alttitle,title}',
    'producer': 'id,name,original,aliases,lang,type',
    'short_vn': 'id,alttitle,title,released,rating,image{url}',
    'short_character': 'id,name,aliases,birthday,original,image{url},vns{id,alttitle,title}'
}

export enum CommandType {
    VN = 'vn',
    Character = 'character',
    Producer = 'producer',
    ID = 'id',
    Event = 'event'
}

export const Id2Command = {
    'v': CommandType.VN,
    'c': CommandType.Character,
    'p': CommandType.Producer
}

export const TemplateMap = {
    'vn': 0,
    'character': 0,
    'producer': 1,
    'event': 1
}


export enum InfoType {
    INFO,
    SUCCESS,
    ERROR,
    WARN
}

export const LangDic = {
    'ja': '日文',
    'en': '英文',
    'zh-Hans': '简中',
    'zh-Hant': '繁中'
}
export const GenderDic = {
    'm': '男性',
    'f': '女性',
    'b': '双性',
    'n': '无性'
}
export const TypeDic = {
    'co': '公司',
    'in': '个人',
    'ng': '业余团体'
}

export const WeekDate = ['日','月','火','水','木','金','土']
