import { Competition, Competitor, CompetitorBase, StartLocation } from 'ngx-sport';
import { User } from '../user';
import { PoolUser } from './user';

export class PoolCompetitor extends CompetitorBase implements Competitor {
    constructor(private poolUser: PoolUser, competition: Competition, startLocation: StartLocation) {
        // const startLocation = new StartLocation(pouleNr, placeNr);
        super(competition, startLocation);
        this.poolUser.getCompetitors().push(this);
    }

    getName(): string {
        const name = this.poolUser.getName();
        return name ? name : '';
    }

    getPoolUser(): PoolUser {
        return this.poolUser;
    }

    getUser(): User {
        return this.poolUser.getUser();
    }
}
