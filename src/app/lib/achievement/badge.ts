import { Achievement } from '../achievement';

import { JsonPoolUser } from '../pool/user/json';
import { BadgeCategory } from './badge/category';

export class Badge extends Achievement {
    constructor(
        private category: BadgeCategory, 
        protected scopeDescription: string,
        protected poolId: number|undefined,
        poolUser: JsonPoolUser,         
        created: Date) {
        super(poolUser, created);
    }

    public getScopeDescription(): string {
        return this.scopeDescription;
    }

    public getPoolId(): number|undefined {
        return this.poolId;
    }

    public getCategory(): BadgeCategory {
        return this.category;
    }


}
