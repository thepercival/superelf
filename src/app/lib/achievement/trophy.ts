
import { JsonCompetition } from 'ngx-sport';
import { Achievement } from '../achievement';
import { JsonPoolUser } from '../pool/user/json';

export class Trophy extends Achievement {
    constructor(
        poolUser: JsonPoolUser, 
        competition: JsonCompetition,
        rank: number,
        created: Date) {
        super(poolUser, competition, rank, created);
    }
}
