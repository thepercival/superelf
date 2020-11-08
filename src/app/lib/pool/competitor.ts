import { Competition, Competitor, CompetitorBase } from 'ngx-sport';
import { User } from '../user';
import { PoolUser } from './user';

export class PoolCompetitor extends CompetitorBase implements Competitor {
    constructor(private poolUser: PoolUser, competition: Competition, pouleNr: number, placeNr: number) {
        super(competition, pouleNr, placeNr);
        this.poolUser.getCompetitors().push(this);
    }

    getName(): string {
        return this.poolUser.getName();
    }

    getPoolUser(): PoolUser {
        return this.poolUser;
    }

    getUser(): User {
        return this.poolUser.getUser();
    }
}
