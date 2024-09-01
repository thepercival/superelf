import { Achievement } from '../achievement';

import { JsonPoolUser } from '../pool/user/json';
import { BadgeCategory } from './badge/category';

export class Badge extends Achievement {
    constructor(
        private category: BadgeCategory, 
        public readonly poolId: number|undefined,
        public readonly poolName: string,
        public readonly seasonShortName: string,
        poolUser: JsonPoolUser,
        created: Date) {
        super(poolUser, created);
    }


    public getCategory(): BadgeCategory {
        return this.category;
    }
}
