import { Period } from 'ngx-sport';
import { PoolViewPeriodRound } from './view/round';

export class PoolViewPeriod extends Period {
    protected rounds: PoolViewPeriodRound[] = [];
    constructor(startDateTime: Date, endDateTime: Date) {
        super(startDateTime, endDateTime);
    }

    getRounds(): PoolViewPeriodRound[] {
        return this.rounds;
    }
}