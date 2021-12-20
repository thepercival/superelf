import { FootballLine } from "ngx-sport";
import { Points } from "../../points";
import { JsonPlayerTotals } from "./json";

export class PlayerTotalsCalculator {
    constructor() {
    }

    public getResultPoints(jsonTotals: JsonPlayerTotals, points: Points): number {
        return jsonTotals.nrOfWins * points.getResultWin() + jsonTotals.nrOfWins * points.getResultDraw();
    }

    public getGoalPoints(line: FootballLine, jsonTotals: JsonPlayerTotals, points: Points): number {
        let total = jsonTotals.nrOfFieldGoals * points.getFieldGoal(line);
        total += jsonTotals.nrOfAssists * points.getAssist(line);
        total += jsonTotals.nrOfPenalties * points.getPenalty();
        total += jsonTotals.nrOfOwnGoals * points.getOwnGoal();
        return total;
    }


    public getAssistPoints(line: FootballLine, jsonTotals: JsonPlayerTotals, points: Points): number {
        return jsonTotals.nrOfAssists * points.getAssist(line);
    }

    public getSheetPoints(line: FootballLine, jsonTotals: JsonPlayerTotals, points: Points): number {
        if (line !== FootballLine.GoalKepeer && line !== FootballLine.Defense) {
            return 0;
        }
        return this.getCleanSheetPoints(line, jsonTotals, points)
            + this.getSpottySheetPoints(line, jsonTotals, points);
    }

    public getCleanSheetPoints(line: FootballLine, jsonTotals: JsonPlayerTotals, points: Points): number {
        return jsonTotals.nrOfCleanSheets * points.getCleanSheet(line);
    }

    public getSpottySheetPoints(line: FootballLine, jsonTotals: JsonPlayerTotals, points: Points): number {
        return jsonTotals.nrOfSpottySheets * points.getSpottySheet(line);
    }

    public getCardPoints(jsonTotals: JsonPlayerTotals, points: Points): number {
        return jsonTotals.nrOfYellowCards * points.getCardYellow() + jsonTotals.nrOfRedCards * points.getCardRed();
    }
}
