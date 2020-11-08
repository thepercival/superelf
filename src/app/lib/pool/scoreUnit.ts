import { Pool } from '../pool';
import { ScoreUnit } from '../scoreUnit';

export class PoolScoreUnit {
    protected pool: Pool;

    constructor(pool: Pool, protected base: ScoreUnit, protected points: number) {
        this.setPool(pool);
    }

    public getPool(): Pool {
        return this.pool;
    }

    protected setPool(pool: Pool) {
        pool.getScoreUnits().push(this);
        this.pool = pool;
    }

    public getBase(): ScoreUnit {
        return this.base;
    }

    public getPoints(): number {
        return this.points;
    }
}