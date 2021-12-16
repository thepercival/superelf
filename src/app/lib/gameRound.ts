import { ViewPeriod } from './period/view';

export class GameRound {
    protected againstGames: AgainstGame[];

    constructor(protected viewPeriod: ViewPeriod, protected number: number) {
        viewPeriod.getGameRounds().push(this);
    }

    public getNumber(): number {
        return this.number;
    }

    public getViewPeriod(): ViewPeriod {
        return this.viewPeriod;
    }
}