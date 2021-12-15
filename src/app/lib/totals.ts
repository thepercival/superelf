import { FootballLine } from "ngx-sport";
import { ViewPeriod } from "./period/view";
import { S11Player } from "./player";

// unable to determine line, class is of no use
export class Totals {
    public constructor(
        protected player: S11Player,
        protected wins: number,
        protected draws: number,
        protected played: number,
        protected fieldGoals: number,
        protected assists: number,
        protected penalties: number,
        protected ownGoals: number,
        protected cleanSheets: number,
        protected spottySheet: number,
        protected yellowCards: number,
        protected directRedCards: boolean,
        protected line: FootballLine
    ) {
    }

    getPlayer(): S11Player {
        return this.player;
    }

    getViewPeriod(): ViewPeriod {
        return this.player.getViewPeriod();;
    }

    // getWins(): number {
    //     return this.wins;
    // }

    // getDraws(): number {
    //     return this.draws;
    // }

    // getPlayed(): number {
    //     return this.played;
    // }

    // getWins(): number {
    //     return this.fieldGoals;
    // }

    // getWins(): number {
    //     return this.penalties;
    // }

    // getWins(): number {
    //     return this.ownGoals;
    // }

    // getWins(): number {
    //     return this.cleanSheets;
    // }

    // getWins(): number {
    //     return this.spottySheet;
    // }

    // getWins(): number {
    //     return this.yellowCards;
    // }

    // getWins(): number {
    //     return this.directRedCards;
    // }

    // getWins(): number {
    //     return this.yellowCards;
    // }
}
