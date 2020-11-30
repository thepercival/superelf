import { Pool } from '../pool';
import { ScoreUnit } from '../scoreUnit';

export class PoolScoreUnit {
    constructor(protected pool: Pool, protected base: ScoreUnit, protected points: number) {
        this.pool.getScoreUnits().push(this);
    }

    public getPool(): Pool {
        return this.pool;
    }

    public getBase(): ScoreUnit {
        return this.base;
    }

    public getNumber(): number {
        return this.base.getNumber();
    }

    public getPoints(): number {
        return this.points;
    }
}