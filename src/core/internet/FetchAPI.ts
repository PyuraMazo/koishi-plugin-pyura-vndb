import { HTTP } from 'koishi'

import { CommandFields, CommandType, Id2Command } from "../api/Grand";
import { Config, TaskUnit, VNResponse, CharacterResponse, ProducerResponse } from "../api/Types";
import { TipsError } from "../api/Errors";
import { Request } from "./Request";

export class FetchAPI {
    private request: Request;
    private maxImageNumber: number;
    private lowestRating: number;

    private kana_url = "https://api.vndb.org/kana/";

    private static Instance: FetchAPI;

    private constructor() {}

    static getInstance(): FetchAPI {
        if (!FetchAPI.Instance) {
            FetchAPI.Instance = new FetchAPI();
        }
        return FetchAPI.Instance;
    }

    async init(_http: HTTP, _config: Config){
        this.request = Request.getInstance();
        this.maxImageNumber = _config.maxImageNumber;
        this.lowestRating = _config.lowestRating;

        await this.request.init(_http, _config);
    }

    async fetchVN(_task: TaskUnit): Promise<[VNResponse[], string]> {
        const url = this.kana_url + _task.type;
        const payload = this.vnPayload(_task.value);
        const res = (await this.request.post(url, payload))['results'];
        if (res.length === 0) throw new TipsError('未搜索到相关结果。');
        return [res, ''];
    }

    async fetchCharacter(_task: TaskUnit): Promise<[CharacterResponse[], string]> {
        const url = this.kana_url + _task.type;
        const payload = this.characterPayload(_task.value);
        const res = (await this.request.post(url, payload))['results'];
        if (res.length === 0) throw new TipsError('未搜索到相关结果。');
        return [res, ''];
    }

    async fetchProducer(_task: TaskUnit): Promise<[ProducerResponse[], VNResponse[][]]> {
        const url = this.kana_url + _task.type;
        const payload = this.producerPayload(_task.value);
        const proData: ProducerResponse[] = (await this.request.post(url, payload))['results'];
        if (proData.length === 0) throw new TipsError('未搜索到相关结果。');
        
        const vnUrl = this.kana_url + CommandType.VN;
        const vns: Promise<VNResponse[]>[] = []
        proData.forEach(pro => {
            const vnPayload = this.vnPayload(pro.id, true);
            vns.push(this.request.post(vnUrl, vnPayload));
        });

        return [proData, await Promise.all(vns)]
    }

    async fetchId(_task: TaskUnit): Promise<[VNResponse[] | CharacterResponse[] | ProducerResponse[], string | VNResponse[][]]> {
        const trueType = Id2Command[_task.value[0]]

        const url = this.kana_url + trueType;
        const payload = this.idPayload(_task.value);
        const res = (await this.request.post(url, payload))['results'];
        if (res.length === 0) throw new TipsError('未搜索到相关结果。');

        if (trueType === CommandType.Producer) {
            const vns: Promise<VNResponse[]>[] = [];
            const vnUrl = this.kana_url + CommandType.VN;

            res.forEach(pro => {
                const vnPayload = this.vnPayload(pro.id, true);
                vns.push(this.request.post(vnUrl, vnPayload));
            });
            return [res, await Promise.all(vns)]
        } else {
            return [res, ''];
        }
    }

    async fetchEvent(_task: TaskUnit): Promise<[VNResponse[], CharacterResponse[]]> {
        const vnUrl = this.kana_url + CommandType.VN;
        const vnPayload = this.eventVnPayload(_task.value);
        const vns = this.request.post(vnUrl, vnPayload);
        const chaUrl = this.kana_url + CommandType.Character;
        const chaPayload = this.eventCharacterPayload(_task.value);
        const chas = this.request.post(chaUrl, chaPayload);
        const [resVns, resCha] = await Promise.all([vns, chas]);
        return [resVns['results'], resCha['results']];
    }

    get fetchMap() {
        return {
            'vn': (_task: TaskUnit) => this.fetchVN(_task),
            'character': (_task: TaskUnit) => this.fetchCharacter(_task),
            'producer': (_task: TaskUnit) => this.fetchProducer(_task),
            'id': (_task: TaskUnit) => this.fetchId(_task),
            'event': (_task: TaskUnit) => this.fetchEvent(_task)
        };
    }

    private vnPayload(_value: string, _fromProducer = false) {
        if (!_fromProducer) {
            const filters = ['search', '=', _value];
            const fields = CommandFields[CommandType.VN]
            return {
                'filters': filters,
                'fields': fields
            }
        } else {
            const filters = ['developer', '=', ['id', '=', _value]];
            const fields = CommandFields['short_vn'];
            return {
                'filters': filters,
                'fields': fields,
                'sort': 'rating',
                'reverse': true,
                'results': this.maxImageNumber
            }
        }
    }

    private characterPayload(_value: string) {
        const filters = ['search', '=', _value];
        const fields = CommandFields[CommandType.Character]
        return {
            'filters': filters,
            'fields': fields
        }
    }

    private producerPayload(_value: string) {
        const filters = ['search', '=', _value];
        const fields = CommandFields[CommandType.Producer]
        return {
            'filters': filters,
            'fields': fields
        }
    }

    private idPayload(_value: string) {
        const filters = ['id', '=', _value];
        const fields = CommandFields[Id2Command[_value[0]]]
        return {
            'filters': filters,
            'fields': fields
        }
    }

    private eventVnPayload(_value: string) {
        const y_m_d = _value.split('-');
        const released = [];
        for (let i = Number(y_m_d[0]); i >= 1990; i--) {
            released.push(['released', '=', `${i}-${y_m_d[1]}-${y_m_d[2]}`]);
        }
        const filters = ['and', ['or', ...released], ['rating', '>=', this.lowestRating]];
        const fields = CommandFields['short_vn'];
        return {
            'filters': filters,
            'fields': fields,
            'sort': 'rating',
            'reverse': true
        }
    }

    private eventCharacterPayload(_value: string) {
        const ymd = _value.split('-');
        const filters = ['and', ["birthday", "=", [Number(ymd[1]), Number(ymd[2])]], ['vn', '=', ['rating', '>=', this.lowestRating]]];
        const fields = CommandFields['short_character'];
        return {
            "filters": filters,
            'fields': fields,
        }
    }
}

export default FetchAPI;