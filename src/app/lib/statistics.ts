import { FootballLine } from 'ngx-sport';
import { GameRound } from './gameRound';
import { S11Player } from './player';
import { JsonStatistics } from './statistics/json';

export class Statistics {
    public constructor(
        protected json: JsonStatistics) {
    }

    public getResult(): number {
        return this.json.result;
    }

    public getBeginMinute(): number {
        return this.json.beginMinute;
    }

    public isStarting(): boolean {
        return this.getBeginMinute() === 0;
    }

    public getEndMinute(): number {
        return this.json.endMinute;
    }

    public isSubstituted(): boolean {
        return this.getEndMinute() > 0;
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
        return this.json.cleanSheet;
    }

    public hasSpottySheet(): boolean {
        return this.json.spottySheet;
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
}
