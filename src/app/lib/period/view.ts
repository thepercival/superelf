import { Competition, Period } from 'ngx-sport';
import { GameRound } from '../gameRound';

export class ViewPeriod extends Period {
    protected id: number = 0;
    protected gameRounds: GameRound[] = [];
    constructor(protected sourceCompetition: Competition, startDateTime: Date, endDateTime: Date) {
        super(startDateTime, endDateTime);
    }

    getId(): number {
        return this.id;
    }

    setId(id: number) {
        this.id = id;
    }

    getGameRounds(): GameRound[] {
        return this.gameRounds;
    }

    getGameRound(number: number): GameRound {
        const gameRound = this.gameRounds.find(gameRound => gameRound.getNumber() === number);
        if (gameRound === undefined) {
            throw new Error('gameRound could not be found for number "' + number + '"');
        }
        return gameRound;
    }

    getSourceCompetition(): Competition {
        return this.sourceCompetition;
    }
}