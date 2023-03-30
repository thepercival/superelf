import { Injectable } from '@angular/core';
import { CompetitionMapper } from 'ngx-sport';
import { Badge } from './badge';
import { JsonBadge } from './badge/json';
import { Trophy } from './trophy';
import { JsonTrophy } from './trophy/json';
;

@Injectable({
    providedIn: 'root'
})
export class AchievementMapper {
    constructor(private competitinMapper: CompetitionMapper) { }

    toObject(json: JsonBadge|JsonTrophy): Badge|Trophy {
        if( 'category' in json ) {
            let competition = undefined;
            if( json.competition !== undefined) {
                competition = this.competitinMapper.toObject(json.competition);
            }
            return new Badge(json.category, json.scopeDescription, json.poolId, json.poolUser, new Date(json.created));
        }
        const competition = this.competitinMapper.toObject(json.competition);
        return new Trophy(json.poolUser, competition, new Date(json.created));
    }
}


