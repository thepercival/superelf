import { GameRound } from "../gameRound";
import { ViewPeriod } from "../periods/viewPeriod";

export class GameRoundMap extends Map<number, GameRound> {
    constructor(public viewPeriod: ViewPeriod){
        super();
    }
}