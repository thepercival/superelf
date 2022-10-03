import { FootballLine } from "ngx-sport";
import { CompetitionConfig } from "../competitionConfig";
import { FootballCard, FootballGoal, FootballResult, FootballScore, FootballSheet } from "../score";
import { JsonTotals } from "./json";

export class TotalsCalculator {

    constructor(protected competitionConfig: CompetitionConfig) {
    }

    public getResultPoints(jsonTotals: JsonTotals): number {
        const resultWinPoints = this.competitionConfig.getScorePoints(FootballResult.Win);
        const resultDrawPoints = this.competitionConfig.getScorePoints(FootballResult.Draw);
        return (jsonTotals.nrOfWins * resultWinPoints) + (jsonTotals.nrOfDraws * resultDrawPoints);
    }

    public getGoalPoints(line: FootballLine, jsonTotals: JsonTotals): number {
        const fieldGoalPoints = this.competitionConfig.getLineScorePoints({ line, score: FootballGoal.Normal });
        const assistPoints = this.competitionConfig.getLineScorePoints({ line, score: FootballGoal.Assist });
        const penaltyGoalPoints = this.competitionConfig.getScorePoints(FootballGoal.Penalty);
        const ownGoalPoints = this.competitionConfig.getScorePoints(FootballGoal.Own);

        let total = (jsonTotals.nrOfFieldGoals * fieldGoalPoints) + (jsonTotals.nrOfAssists * assistPoints);
        total += (jsonTotals.nrOfPenalties * penaltyGoalPoints) + (jsonTotals.nrOfOwnGoals * ownGoalPoints);
        return total;
    }


    public getAssistPoints(line: FootballLine, jsonTotals: JsonTotals): number {
        const assistPoints = this.competitionConfig.getLineScorePoints({ line, score: FootballGoal.Assist });
        return jsonTotals.nrOfAssists * assistPoints;
    }

    public getSheetPoints(line: FootballLine.GoalKeeper | FootballLine.Defense, jsonTotals: JsonTotals): number {
        return this.getCleanSheetPoints(line, jsonTotals) + this.getSpottySheetPoints(line, jsonTotals);
    }

    public getCleanSheetPoints(line: FootballLine.GoalKeeper | FootballLine.Defense, jsonTotals: JsonTotals): number {
        const points = this.competitionConfig.getLineScorePoints({ line, score: FootballSheet.Clean });
        return jsonTotals.nrOfCleanSheets * points;
    }

    public getSpottySheetPoints(line: FootballLine.GoalKeeper | FootballLine.Defense, jsonTotals: JsonTotals): number {
        const points = this.competitionConfig.getLineScorePoints({ line, score: FootballSheet.Spotty });
        return jsonTotals.nrOfSpottySheets * points;
    }

    public getCardPoints(jsonTotals: JsonTotals): number {
        const yellowCardPoints = this.competitionConfig.getScorePoints(FootballCard.Yellow);
        const redCardPoints = this.competitionConfig.getScorePoints(FootballCard.Red);
        return (jsonTotals.nrOfYellowCards * yellowCardPoints) + (jsonTotals.nrOfRedCards * redCardPoints);
    }
}
