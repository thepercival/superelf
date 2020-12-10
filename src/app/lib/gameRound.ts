import { ViewPeriod } from './period/view';

export class GameRound {

    constructor(protected viewPeriod: ViewPeriod, protected number: number) {

    }

    public getNumber(): number {
        return this.number;
    }

    public getViewPeriod(): ViewPeriod {
        return this.viewPeriod;
    }
}