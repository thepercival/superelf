import { Injectable } from '@angular/core';
import { Competition } from 'ngx-sport';
import { S11Formation } from '../formation';
import { ViewPeriod } from '../period/view';
import { PoolUser } from '../pool/user';
import { JsonS11Formation } from './json';
import { S11FormationLine } from './line';
import { JsonS11FormationLine } from './line/json';
import { S11FormationLineMapper } from './line/mapper';

@Injectable({
    providedIn: 'root'
})
export class S11FormationMapper {
    constructor(protected lineMapper: S11FormationLineMapper) { }

    toObject(json: JsonS11Formation, poolUser: PoolUser, viewPeriod: ViewPeriod): S11Formation {
        const formation = new S11Formation(poolUser, viewPeriod);
        formation.setId(json.id);
        const competition = poolUser.getPool().getCompetitionConfig().getSourceCompetition();
        json.lines.forEach((jsonLine: JsonS11FormationLine) => this.lineMapper.toObject(jsonLine, formation, competition, viewPeriod));
        return formation;
    }

    toJson(formation: S11Formation): JsonS11Formation {
        return {
            id: formation.getId(),
            lines: formation.getLines().map((line: S11FormationLine) => this.lineMapper.toJson(line))
        };
    }
}


