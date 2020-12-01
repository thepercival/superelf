
import { CompetitionPerson } from '../competitionPerson';
import { GameRound } from '../gameRound';
import { PersonStats } from './mapper';

export class GameRoundStats {
    protected id: number = 0;

    constructor(protected competitionPerson: CompetitionPerson, protected gameRoundNumber: number, protected stats: PersonStats) {
        competitionPerson.getGameRoundStats().push(this);
    }

    public getCompetitionPerson(): CompetitionPerson {
        return this.competitionPerson;
    }

    public getGameRoundNumber(): number {
        return this.gameRoundNumber;
    }

    public getStats(): PersonStats {
        return this.stats;
    }
}