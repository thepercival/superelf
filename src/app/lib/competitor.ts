import { Competition, Competitor, CompetitorBase } from 'ngx-sport';
import { Pool } from './pool';
import { User } from './user';

export class PoolCompetitor extends CompetitorBase implements Competitor {
    private admin: boolean;

    constructor(private pool: Pool, competition: Competition, private user: User, pouleNr: number, placeNr: number) {
        super(competition, pouleNr, placeNr);
        this.pool.getCompetitors().push(this);
    }

    getName(): string {
        return this.user.getName();
    }

    getAdmin(): boolean {
        return this.admin;
    }

    setAdmin(admin: boolean) {
        this.admin = admin;;
    }

    getUser(): User {
        return this.user;
    }
}
