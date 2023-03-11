import { Competition } from 'ngx-sport';
import { Achievement } from '../achievement';

import { JsonPoolUser } from '../pool/user/json';
import { BadgeCategory } from './badge/category';

export class Badge extends Achievement {
    constructor(
        private category: BadgeCategory, 
        poolUser: JsonPoolUser, 
        protected competition: Competition|undefined,
        rank: number,
        created: Date) {
        super(poolUser, rank, created);
    }

    getCompetition(): Competition|undefined {
        return this.competition;
    }

    public getCategory(): BadgeCategory {
        return this.category;
    }
}
