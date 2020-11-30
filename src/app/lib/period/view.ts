import { Period } from 'ngx-sport';
import { GameRound } from '../gameRound';

export class ViewPeriod extends Period {
    protected gameRounds: GameRound[] = [];
    constructor(startDateTime: Date, endDateTime: Date) {
        super(startDateTime, endDateTime);
    }

    getGameRounds(): GameRound[] {
        return this.gameRounds;
    }
}