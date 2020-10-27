import { Competitor, CompetitorBase } from 'ngx-sport';
import { Pool } from './pool';
import { User } from './user';

export class PoolCompetitor extends CompetitorBase implements Competitor {

    constructor(private pool: Pool, private user: User, pouleNr: number, placeNr: number, private admin: boolean) {
        super(pool.getCompetition(), pouleNr, placeNr);
        this.pool.getCompetitors().push(this);
    }

    getName(): string {
        return this.user.getName();
    }

    getAdmin(): boolean {
        return this.admin;
    }

    getUser(): User {
        return this.user;
    }
}
