import { Injectable } from '@angular/core';
import { Association } from 'ngx-sport';
import { Formation } from '../formation';
import { PoolUser } from '../pool/user';
import { JsonFormation } from './json';
import { FormationLineMapper } from './line/mapper';

@Injectable()
export class FormationMapper {
    constructor(protected lineMapper: FormationLineMapper) { }

    toObject(json: JsonFormation, poolUser: PoolUser, association: Association): Formation {
        const formation = new Formation(poolUser, json.name);
        console.log(json);
        formation.setId(json.id);
        json.lines.forEach(jsonLine => this.lineMapper.toObject(jsonLine, formation, association));
        return formation;
    }

    // toJson(formation: Formation): JsonFormation {
    //     return {
    //         name: formation.getName(),
    //         lines: formation.getLines().map(line => this.lineMapper.toJson(line)),
    //     };
    // }
}


