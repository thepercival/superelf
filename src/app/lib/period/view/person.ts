import { Person } from 'ngx-sport';
import { ViewPeriod } from '../view';
import { ViewPeriodPersonGameRoundScore } from './person/gameRoundScore';

export class ViewPeriodPerson {
    static readonly Sheet_Spotty_Threshold = 4;

    static readonly Result = 1;
    static readonly Goals_Field = 2;
    static readonly Goals_Penalty = 4;
    static readonly Goals_Own = 8;
    static readonly Assists = 16;
    static readonly Sheet_Clean = 32;
    static readonly Sheet_Spotty = 64;
    static readonly Cards_Yellow = 128;
    static readonly Card_Red = 256;
    static readonly Lineup = 512;
    static readonly Substituted = 1024;
    static readonly Substitute = 2048;
    static readonly Line = 4096;

    protected id: number = 0;
    protected total: number = 0;
    protected points: Map<number, number> = new Map();
    protected gameRoundScores: ViewPeriodPersonGameRoundScore[] = [];

    constructor(protected viewPeriod: ViewPeriod, protected person: Person) {

    }

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    public getViewPeriod(): ViewPeriod {
        return this.viewPeriod;
    }

    public getPerson(): Person {
        return this.person;
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

    public getGameRoundScores(): ViewPeriodPersonGameRoundScore[] {
        return this.gameRoundScores;
    }
}