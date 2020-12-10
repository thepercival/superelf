import { Injectable } from '@angular/core';
import { Association } from 'ngx-sport';
import { Formation } from '../formation';
import { ViewPeriod } from '../period/view';
import { PoolUser } from '../pool/user';
import { JsonFormation } from './json';
import { FormationLineMapper } from './line/mapper';

@Injectable()
export class FormationMapper {
    constructor(protected lineMapper: FormationLineMapper) { }

    toObject(json: JsonFormation, poolUser: PoolUser, viewPeriod: ViewPeriod): Formation {
        const formation = new Formation(poolUser, viewPeriod, json.name);
        formation.setId(json.id);
        json.lines.forEach(jsonLine => this.lineMapper.toObject(jsonLine, formation, viewPeriod));
        return formation;
    }

    toJson(formation: Formation): JsonFormation {
        return {
            id: formation.getId(),
            name: formation.getName(),
            lines: formation.getLines().map(line => this.lineMapper.toJson(line))
        };
    }
}


