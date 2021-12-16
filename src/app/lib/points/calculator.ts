import { AgainstResult, FootballLine } from "ngx-sport";
import { Points } from "../points";
import { Statistics } from "../statistics";

export class PointsCalculator {
    constructor() {
    }

    public getPoints(line: FootballLine, statistics: Statistics, points: Points): number {
        let total = this.getResultPoints(statistics, points);
        total += this.getGoalPoints(line, statistics, points);
        total += this.getAssistPoints(line, statistics, points);
        total += this.getSheetPoints(line, statistics, points);
        total += this.getCardPoints(statistics, points);
        return total;
    }

    public getResultPoints(statistics: Statistics, points: Points): number {
        const result = statistics.getResult();
        if (result === AgainstResult.Win) {
            return points.getResultWin();
        } else if (result === AgainstResult.Draw) {
            return points.getResultDraw();
        }
        return 0;
    }

    public getGoalPoints(line: FootballLine, statistics: Statistics, points: Points): number {
        let total = statistics.getNrOfFieldGoals() * points.getFieldGoal(line);
        total += statistics.getNrOfAssists() * points.getAssist(line);
        total += statistics.getNrOfPenalties() * points.getPenalty();
        total += statistics.getNrOfOwnGoals() * points.getOwnGoal();
        return total;
    }


    public getAssistPoints(line: FootballLine, statistics: Statistics, points: Points): number {
        return statistics.getNrOfAssists() * points.getAssist(line);
    }

    public getSheetPoints(line: FootballLine, statistics: Statistics, points: Points): number {
        return this.getCleanSheetPoints(line, statistics, points)
            + this.getSpottySheetPoints(line, statistics, points);
    }

    public getCleanSheetPoints(line: FootballLine, statistics: Statistics, points: Points): number {
        return statistics.hasCleanSheet() ? points.getCleanSheet(line) : 0;
    }

    public getSpottySheetPoints(line: FootballLine, statistics: Statistics, points: Points): number {
        return statistics.hasSpottySheet() ? points.getSpottySheet(line) : 0;
    }

    public getCardPoints(statistics: Statistics, points: Points): number {
        let total = statistics.getNrOfYellowCards() * points.getCardYellow();
        console.log(total, statistics.getNrOfYellowCards(), points.getCardYellow());
        total += statistics.gotDirectRedCard() ? points.getCardRed() : 0;
        return total;
    }
}
