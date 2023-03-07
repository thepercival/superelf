import { JsonCompetition } from 'ngx-sport';
import { Achievement } from '../achievement';

import { JsonPoolUser } from '../pool/user/json';
import { BadgeCategory } from './badge/category';

export class Badge extends Achievement {
    constructor(
        private category: BadgeCategory, 
        poolUser: JsonPoolUser, 
        competition: JsonCompetition,
        rank: number,
        created: Date) {
        super(poolUser, competition, rank, created);
    }

    public getCategory(): BadgeCategory {
        return this.category;
    }
}
