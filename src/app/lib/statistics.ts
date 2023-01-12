import { AgainstResult, FootballLine } from 'ngx-sport';
import { Sheet } from './sheet';
import { JsonStatistics } from './statistics/json';

export class Statistics {
    protected gameStartDate: Date;

    public constructor(protected json: JsonStatistics) {
        this.gameStartDate = new Date(json.gameStart);
    }

    public getResult(): AgainstResult {
        return this.json.result;
    }

    public getBeginMinute(): number {
        return this.json.beginMinute;
    }

    public getEndMinute(): number {
        return this.json.endMinute;
    }

    public isStarting(): boolean {
        return this.json.beginMinute === 0;
    }

    public isSubstitute(): boolean {
        return this.json.beginMinute > 0;
    }

    public hasAppeared(): boolean {
        return this.isStarting() || this.isSubstitute();
    }

    public isSubstituted(): boolean {
        return this.json.endMinute > 0;
    }

    public getNrOfFieldGoals(): number {
        return this.json.nrOfFieldGoals;
    }

    public getNrOfAssists(): number {
        return this.json.nrOfAssists;
    }

    public getNrOfPenalties(): number {
        return this.json.nrOfPenalties;
    }

    public getNrOfOwnGoals(): number {
        return this.json.nrOfOwnGoals;
    }

    public hasCleanSheet(): boolean {
        return this.json.sheet === Sheet.Clean;
    }

    public hasSpottySheet(): boolean {
        return this.json.sheet === Sheet.Spotty;
    }

    // public getSpottySheet(): Sheet {
    //     return this.json.spottySheet;
    // }

    // public getSpottySheet23(): string {
    //     return this.json.spottySheet.toString();
    // }

    public getJson(): JsonStatistics {
        return this.json;
    }

    public getNrOfYellowCards(): number {
        return this.json.nrOfYellowCards;
    }

    public gotDirectRedCard(): boolean {
        return this.json.directRedCard;
    }

    public getPlayerLine(): FootballLine {
        return this.json.playerLine;
    }

    public getGameStartDate(): Date {
        return this.gameStartDate;
    }
}
