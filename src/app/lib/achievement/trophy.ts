
import { Competition, JsonCompetition } from 'ngx-sport';
import { Achievement } from '../achievement';
import { JsonPoolUser } from '../pool/user/json';

export class Trophy extends Achievement {
    constructor(
        poolUser: JsonPoolUser, 
        protected competition: Competition,
        rank: number,
        created: Date) {
        super(poolUser, rank, created);
    }

    getCompetition(): Competition {
        return this.competition;
    }
}
