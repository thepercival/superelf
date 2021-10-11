import { FootballLine, Identifiable, Season, Sport } from "ngx-sport";

export class Points extends Identifiable {
    constructor(
        protected season: Season,
        protected resultWin: number,
        protected resultDraw: number,
        protected fieldGoalGoalkeeper: number,
        protected fieldGoalDefender: number,
        protected fieldGoalMidfielder: number,
        protected fieldGoalForward: number,
        protected assistGoalkeeper: number,
        protected assistDefender: number,
        protected assistMidfielder: number,
        protected assistForward: number,
        protected penalty: number,
        protected ownGoal: number,
        protected cleanSheetGoalkeeper: number,
        protected cleanSheetDefender: number,
        protected spottySheetGoalkeeper: number,
        protected spottySheetDefender: number,
        protected cardYellow: number,
        protected cardRed: number
    ) {
        super();
    }

    public getResultWin(): number {
        return this.resultWin;
    }

    public getResultDraw(): number {
        return this.resultDraw;
    }

    public getFieldGoalGoalkeeper(): number {
        return this.fieldGoalGoalkeeper;
    }

    public getFieldGoalDefender(): number {
        return this.fieldGoalDefender;
    }

    public getFieldGoalMidfielder(): number {
        return this.fieldGoalMidfielder;
    }

    public getFieldGoalForward(): number {
        return this.fieldGoalForward;
    }

    public getFieldGoal(line: FootballLine): number {
        switch (line) {
            case FootballLine.GoalKepeer:
                return this.getFieldGoalGoalkeeper();
            case FootballLine.Defense:
                return this.getFieldGoalDefender();
            case FootballLine.Midfield:
                return this.getFieldGoalMidfielder();
            case FootballLine.Forward:
                return this.getFieldGoalForward();
        }
        throw new Error('line is incorrect ');
    }

    public getAssistGoalkeeper(): number {
        return this.assistGoalkeeper;
    }

    public getAssistDefender(): number {
        return this.assistDefender;
    }

    public getAssistMidfielder(): number {
        return this.assistMidfielder;
    }

    public getAssistForward(): number {
        return this.assistForward;
    }

    public getAssist(line: FootballLine): number {
        switch (line) {
            case FootballLine.GoalKepeer:
                return this.getAssistGoalkeeper();
            case FootballLine.Defense:
                return this.getAssistDefender();
            case FootballLine.Midfield:
                return this.getAssistMidfielder();
            case FootballLine.Forward:
                return this.getAssistForward();
        }
        throw new Error('line is incorrect ');
    }

    public getPenalty(): number {
        return this.penalty;
    }

    public getOwnGoal(): number {
        return this.ownGoal;
    }

    public getCleanSheetGoalkeeper(): number {
        return this.cleanSheetGoalkeeper;
    }

    public getCleanSheetDefender(): number {
        return this.cleanSheetDefender;
    }

    public getCleanSheet(line: FootballLine): number {
        if (line === FootballLine.GoalKepeer) {
            return this.getCleanSheetGoalkeeper();
        } else if (line === FootballLine.Defense) {
            return this.getCleanSheetDefender();
        }
        throw new Error('line is incorrect ');
    }

    public getSpottySheetGoalkeeper(): number {
        return this.spottySheetGoalkeeper;
    }

    public getSpottySheetDefender(): number {
        return this.spottySheetDefender;
    }

    public getSpottySheet(line: FootballLine): number {
        if (line === FootballLine.GoalKepeer) {
            return this.getSpottySheetGoalkeeper();
        } else if (line === FootballLine.Defense) {
            return this.getSpottySheetDefender();
        }
        throw new Error('line is incorrect ');
    }

    public getCardYellow(): number {
        return this.cardYellow;
    }

    public getCardRed(): number {
        return this.cardRed;
    }

    public getSeason(): Season {
        return this.season;
    }
}