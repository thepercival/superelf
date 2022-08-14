import { FootballLine } from "ngx-sport";
import { CompetitionConfig } from "../../competitionConfig";
import { FootballScore } from "../../score";
import { JsonPlayerTotals } from "./json";

export class PlayerTotalsCalculator {

    constructor(protected competitionConfig: CompetitionConfig) {
    }

    public getResultPoints(jsonTotals: JsonPlayerTotals): number {
        const resultWinPoints = this.competitionConfig.getScorePoints(FootballScore.WinResult);
        const resultDrawPoints = this.competitionConfig.getScorePoints(FootballScore.DrawResult);
        return (jsonTotals.nrOfWins * resultWinPoints) + (jsonTotals.nrOfDraws * resultDrawPoints);
    }

    public getGoalPoints(line: FootballLine, jsonTotals: JsonPlayerTotals): number {
        const fieldGoalPoints = this.competitionConfig.getLineScorePoints({ line, score: FootballScore.Goal });
        const assistPoints = this.competitionConfig.getLineScorePoints({ line, score: FootballScore.Assist });
        const penaltyGoalPoints = this.competitionConfig.getScorePoints(FootballScore.PenaltyGoal);
        const ownGoalPoints = this.competitionConfig.getScorePoints(FootballScore.OwnGoal);

        let total = (jsonTotals.nrOfFieldGoals * fieldGoalPoints) + (jsonTotals.nrOfAssists * assistPoints);
        total += (jsonTotals.nrOfPenalties * penaltyGoalPoints) + (jsonTotals.nrOfOwnGoals * ownGoalPoints);
        return total;
    }


    public getAssistPoints(line: FootballLine, jsonTotals: JsonPlayerTotals): number {
        const assistPoints = this.competitionConfig.getLineScorePoints({ line, score: FootballScore.Assist });
        return jsonTotals.nrOfAssists * assistPoints;
    }

    public getSheetPoints(line: FootballLine.GoalKeeper | FootballLine.Defense, jsonTotals: JsonPlayerTotals): number {
        return this.getCleanSheetPoints(line, jsonTotals) + this.getSpottySheetPoints(line, jsonTotals);
    }

    public getCleanSheetPoints(line: FootballLine.GoalKeeper | FootballLine.Defense, jsonTotals: JsonPlayerTotals): number {
        const points = this.competitionConfig.getLineScorePoints({ line, score: FootballScore.CleanSheet });
        return jsonTotals.nrOfCleanSheets * points;
    }

    public getSpottySheetPoints(line: FootballLine.GoalKeeper | FootballLine.Defense, jsonTotals: JsonPlayerTotals): number {
        const points = this.competitionConfig.getLineScorePoints({ line, score: FootballScore.SpottySheet });
        return jsonTotals.nrOfSpottySheets * points;
    }

    public getCardPoints(jsonTotals: JsonPlayerTotals): number {
        const yellowCardPoints = this.competitionConfig.getScorePoints(FootballScore.YellowCard);
        const redCardPoints = this.competitionConfig.getScorePoints(FootballScore.RedCard);
        return (jsonTotals.nrOfYellowCards * yellowCardPoints) + (jsonTotals.nrOfRedCards * redCardPoints);
    }
}
