import { Period } from 'ngx-sport';
import { Pool } from '../pool';

export class PoolPeriod extends Period {
    static readonly CreateAndJoin = 1;
    static readonly ChoosePlayers = 2;
    static readonly Transfer = 4;

    constructor(protected pool: Pool, protected type: number, startDateTime: Date, endDateTime: Date) {
        super(startDateTime, endDateTime);
        this.setPool(pool);
    }

    public getPool(): Pool {
        return this.pool;
    }

    protected setPool(pool: Pool) {
        pool.getPeriods().push(this);
        this.pool = pool;
    }

    public getType(): number {
        return this.type;
    }
}