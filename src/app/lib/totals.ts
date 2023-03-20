import { FootballLine } from "ngx-sport";
import { BadgeCategory } from "./achievement/badge/category";
import { FootballCard, FootballGoal, FootballResult, FootballSheet } from "./score";
import { LineScorePointsMap } from "./score/points";

// unable to determine line, class is of no use
export class Totals {
    public constructor(
        protected nrOfWins = 0,
        protected nrOfDraws = 0,
        protected nrOfTimesStarted = 0,
        protected nrOfTimesSubstituted = 0,
        protected nrOfTimesSubstitute = 0,
        protected nrOfTimesNotAppeared = 0,
        protected nrOfFieldGoals = 0,
        protected nrOfAssists = 0,
        protected nrOfPenalties = 0,
        protected nrOfOwnGoals = 0,
        protected nrOfCleanSheets = 0,
        protected nrOfSpottySheets = 0,
        protected nrOfYellowCards = 0,
        protected nrOfRedCards = 0/*,
        protected updatedAt: Date|undefined = undefined*/
    ) {
    }

    getNrOfWins(): number {
        return this.nrOfWins;
    }

    getNrOfDraws(): number {
        return this.nrOfDraws;
    }

    getNrOfTimesStarted(): number {
        return this.nrOfTimesStarted;
    }
   
    getNrOfTimesSubstituted(): number {
        return this.nrOfTimesSubstituted;
    }

    getNrOfTimesSubstitute(): number {
        return this.nrOfTimesSubstitute;
    }

    getNrOfTimesNotAppeared(): number {
        return this.nrOfTimesNotAppeared;
    }

    getNrOfFieldGoals(): number {
        return this.nrOfFieldGoals;
    }

    getNrOfAssists(): number {
        return this.nrOfAssists;
    }

    getNrOfPenalties(): number {
        return this.nrOfPenalties;
    }

    getNrOfOwnGoals(): number {
        return this.nrOfOwnGoals;
    }

    getNrOfCleanSheets(): number {
        return this.nrOfCleanSheets;
    }

    getNrOfSpottySheets(): number {
        return this.nrOfSpottySheets;
    }

    getNrOfYellowCards(): number {
        return this.nrOfYellowCards;
    }

    getNrOfRedCards(): number {
        return this.nrOfRedCards;
    }

    public getPoints(line: FootballLine, points: LineScorePointsMap, badgeCategory: BadgeCategory|undefined): number
    {
        let results = this.getNrOfWins() * points.get({ line, score: FootballResult.Win });
        results += this.getNrOfDraws() * points.get({ line, score: FootballResult.Draw });

        let goals = this.getNrOfFieldGoals() * points.get({ line, score: FootballGoal.Normal });
        goals += this.getNrOfPenalties() * points.get({ line, score: FootballGoal.Penalty });
        goals += this.getNrOfOwnGoals() * points.get({ line, score: FootballGoal.Own });
    
        const assists = this.getNrOfAssists() * points.get({ line, score: FootballGoal.Assist });

        let sheets = this.getNrOfCleanSheets() * points.get({ line, score: FootballSheet.Clean });
        sheets += this.getNrOfSpottySheets() * points.get({ line, score: FootballSheet.Spotty });

        let cards = this.getNrOfYellowCards() * points.get({ line, score: FootballCard.Yellow });
        cards += this.getNrOfRedCards() * points.get({ line, score: FootballCard.Red });

        switch (badgeCategory) {
            case BadgeCategory.Result:
                return results;
            case BadgeCategory.Goal:
                return goals;
            case BadgeCategory.Assist:
                return assists;
            case BadgeCategory.Sheet:
                return sheets;
            case BadgeCategory.Card:
                return cards;
        }
        return results + goals + assists + sheets + cards;
    }

    public add(totals: Totals): Totals
    {
        return new Totals(
            this.getNrOfWins() + totals.getNrOfWins(),
            this.getNrOfDraws() + totals.getNrOfDraws(),
            this.getNrOfTimesStarted() + totals.getNrOfTimesStarted(),
            this.getNrOfTimesSubstituted() + totals.getNrOfTimesSubstituted(),
            this.getNrOfTimesSubstitute() + totals.getNrOfTimesSubstitute(),
            this.getNrOfTimesNotAppeared() + totals.getNrOfTimesNotAppeared(),
            this.getNrOfFieldGoals() + totals.getNrOfFieldGoals(),
            this.getNrOfAssists() + totals.getNrOfAssists(),
            this.getNrOfPenalties() + totals.getNrOfPenalties(),
            this.getNrOfOwnGoals() + totals.getNrOfOwnGoals(),
            this.getNrOfCleanSheets() + totals.getNrOfCleanSheets(),
            this.getNrOfSpottySheets() + totals.getNrOfSpottySheets(),
            this.getNrOfYellowCards() + totals.getNrOfYellowCards(),
            this.getNrOfRedCards() + totals.getNrOfRedCards()
        );
    }

}
