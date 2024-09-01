import { Competition } from 'ngx-sport';
import { Achievement } from '../achievement';
import { JsonPoolUser } from '../pool/user/json';

export class Trophy extends Achievement {
    public seasonShortName: string;

    constructor(
        poolUser: JsonPoolUser, 
        public readonly poolId: number|undefined,
        protected competition: Competition,
        created: Date) {
        super(poolUser, created);
        this.seasonShortName = competition.getSeason().getStartDateTime().getFullYear().toString().substring(2, 4)
            + '/' + competition.getSeason().getEndDateTime().getFullYear().toString().substring(2, 4);
    }

    getCompetition(): Competition {
        return this.competition;
    }

    
}
