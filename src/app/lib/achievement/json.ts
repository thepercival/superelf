import { JsonCompetition } from 'ngx-sport';
import { JsonPoolUser } from '../pool/user/json';

export interface JsonAchievement {

    poolUser: JsonPoolUser,
    competition: JsonCompetition,
    rank: number,
    created: string
}

