import { AgainstResult, FootballLine } from 'ngx-sport';
import { BadgeCategory } from './achievement/badge/category';
import { FootballCard, FootballGoal, FootballResult, FootballSheet } from './score';
import { LineScorePointsMap } from './score/points';
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

    public getPoints(line: FootballLine, points: LineScorePointsMap, badgeCategory: BadgeCategory|undefined): number
    {
        let result = 0;
        if( this.getResult() === AgainstResult.Win ) {
            result = points.get({ line, score: FootballResult.Win });
        } else if( this.getResult() === AgainstResult.Draw ) {
            result = points.get({ line, score: FootballResult.Draw });
        }
        
        let goals = this.getNrOfFieldGoals() * points.get({ line, score: FootballGoal.Normal });
        goals += this.getNrOfPenalties() * points.get({ line, score: FootballGoal.Penalty });
        goals += this.getNrOfOwnGoals() * points.get({ line, score: FootballGoal.Own });

        const assists = this.getNrOfAssists() * points.get({ line, score: FootballGoal.Assist });

        let sheet = 0;
        if( this.hasCleanSheet() ) {
            sheet += points.get({ line, score: FootballSheet.Clean });
        }
        if( this.hasSpottySheet() ) {
            sheet += points.get({ line, score: FootballSheet.Spotty });
        }

        let cards = this.getNrOfYellowCards() * points.get({ line, score: FootballCard.Yellow });
        if( this.gotDirectRedCard() ) {
            cards += points.get({ line, score: FootballCard.Red });
        }
       
        switch (badgeCategory) {
            case BadgeCategory.Result:
                return result;
            case BadgeCategory.Goal:
                return goals;
            case BadgeCategory.Assist:
                return assists;
            case BadgeCategory.Sheet:
                return sheet;
            case BadgeCategory.Card:
                return cards;
        }
        return result + goals + assists + sheet + cards;
    }
}
