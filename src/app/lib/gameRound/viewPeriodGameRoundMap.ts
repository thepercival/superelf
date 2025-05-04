import { GameRound } from "../gameRound";
import { ViewPeriod } from "../periods/viewPeriod";

export class ViewPeriodGameRoundMap extends Map<number, GameRound> {
    constructor(
        public readonly viewPeriod: ViewPeriod,
        gameRounds: Map<number, GameRound>
    ){
        super(gameRounds);
    }
}