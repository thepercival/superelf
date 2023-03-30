import { Competition } from 'ngx-sport';
import { Achievement } from '../achievement';
import { JsonPoolUser } from '../pool/user/json';

export class Trophy extends Achievement {
    constructor(
        poolUser: JsonPoolUser, 
        protected competition: Competition,
        created: Date) {
        super(poolUser, created);
    }

    getCompetition(): Competition {
        return this.competition;
    }
}
