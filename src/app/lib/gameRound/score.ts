
import { GameRound } from '../gameRound';

export class GameRoundScore {
    protected id: number = 0;
    protected total: number = 0;
    protected points: Map<number, number> = new Map();

    constructor(protected gameRound: GameRound) {
    }

    public getGameRound(): GameRound {
        return this.gameRound;
    }

    public getTotal(): number {
        return this.total;
    }

    public setTotal(total: number) {
        this.total = total;
    }

    public getPoints(): Map<number, number> {
        return this.points;
    }

    public setPoints(points: Map<number, number>) {
        this.points = points;
    }
}