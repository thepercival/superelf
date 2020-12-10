
import { GameRound } from '../../../gameRound';
import { GameRoundScore } from '../../../gameRound/score';
import { ViewPeriodPerson } from '../person';

export class ViewPeriodPersonGameRoundScore extends GameRoundScore {
    protected id: number = 0;

    constructor(protected viewPeriodPerson: ViewPeriodPerson, protected gameRound: GameRound, protected stats: Map<number, number | boolean>) {
        super(gameRound);
        viewPeriodPerson.getGameRoundScores().push(this);
    }

    public getViewPeriodPerson(): ViewPeriodPerson {
        return this.viewPeriodPerson;
    }

    public getGameRound(): GameRound {
        return this.gameRound;
    }

    public getStats(): Map<number, number | boolean> {
        return this.stats;
    }
}