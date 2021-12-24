import { FootballLine, FormationLine, Identifiable, Person } from 'ngx-sport';
import { ViewPeriod } from './period/view';
import { JsonPlayerTotals } from './player/totals/json';
import { Statistics } from './statistics';

export class S11Player extends Identifiable {
    // static readonly Sheet_Spotty_Threshold = 4;

    // static readonly Result = 1;
    // static readonly Goals_Field = 2;
    // static readonly Goals_Penalty = 4;
    // static readonly Goals_Own = 8;
    // static readonly Assists = 16;
    // static readonly Sheet_Clean = 32;
    // static readonly Sheet_Spotty = 64;
    // static readonly Cards_Yellow = 128;
    // static readonly Card_Red = 256;
    // static readonly Lineup = 512;
    // static readonly Substituted = 1024;
    // static readonly Substitute = 2048;
    // static readonly Line = 4096;

    // protected total: number = 0;
    protected statistics: StatisticsMap | undefined;
    // protected gameRoundScores: PlayerGameRoundScore[] = [];    

    constructor(
        protected viewPeriod: ViewPeriod,
        protected person: Person,
        protected totals: JsonPlayerTotals,
        protected totalPoints: number) {
        super();
    }

    public getViewPeriod(): ViewPeriod {
        return this.viewPeriod;
    }

    public getPerson(): Person {
        return this.person;
    }



    // public setTotal(total: number) {
    //     this.total = total;
    // }

    // public getPoints(): Map<number, number> {
    //     return this.points;
    // }

    // public setPoints(points: Map<number, number>) {
    //     this.points = points;
    // }

    public getLine(): FootballLine {
        const player = this.getPerson().getPlayers()[0];
        if (player === undefined) {
            throw new Error('s11player should always have a line');
        }
        return player.getLine();
    }

    public hasStatistics(): boolean {
        return this.statistics !== undefined;
    }

    public getGameStatistics(gameRound: number): Statistics | undefined {
        return this.statistics?.get(gameRound) ?? undefined;
    }

    // public setStatistics(gameRound: number, statistics: Statistics) {
    //     this.statistics.set(gameRound, statistics);
    // }

    public setStatistics(statisticsMap: StatisticsMap) {
        return this.statistics = statisticsMap;
    }

    public getTotals(): JsonPlayerTotals {
        return this.totals;
    }

    public getTotalPoints(): number {
        return this.totalPoints;
    }
}

export class StatisticsMap extends Map<number, Statistics> { }