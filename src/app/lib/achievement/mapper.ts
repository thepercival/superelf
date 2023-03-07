import { Injectable } from '@angular/core';
import { ChatMessage } from '../chatMessage';
import { PoolUser } from '../pool/user';import { Badge } from './badge';
import { JsonBadge } from './badge/json';
import { Trophy } from './trophy';
import { JsonTrophy } from './trophy/json';
;

@Injectable({
    providedIn: 'root'
})
export class AchievementMapper {
    constructor() { }

    toObject(json: JsonBadge|JsonTrophy): Badge|Trophy {
        if( 'category' in json ) {
            return new Badge(json.category, json.poolUser, json.competition, json.rank, new Date(json.created));
        }
        return new Trophy(json.poolUser, json.competition, json.rank, new Date(json.created));
    }
}


