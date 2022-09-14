import { AgainstResult, FootballLine } from "ngx-sport";
import { CompetitionConfig } from "../competitionConfig";
import { FootballScore } from "../score";
import { Statistics } from "../statistics";

export class PointsCalculator {
    constructor(protected competitionConfig: CompetitionConfig) {
    }

    public getPoints(line: FootballLine, statistics: Statistics): number {
        let total = this.getResultPoints(statistics);
        total += this.getGoalPoints(line, statistics);
        total += this.getSheetPoints(line, statistics);
        total += this.getCardPoints(statistics);
        return total;
    }

    public getResultPoints(statistics: Statistics): number {
        const result = statistics.getResult();
        if (result === AgainstResult.Win) {
            return this.competitionConfig.getScorePoints(FootballScore.WinResult);
        } else if (result === AgainstResult.Draw) {
            return this.competitionConfig.getScorePoints(FootballScore.DrawResult);
        }
        return 0;
    }

    public getGoalPoints(line: FootballLine, statistics: Statistics): number {
        const fieldGoalPoints = this.competitionConfig.getLineScorePoints({ line, score: FootballScore.Goal });
        const assistPoints = this.competitionConfig.getLineScorePoints({ line, score: FootballScore.Assist });
        const penaltyGoalPoints = this.competitionConfig.getScorePoints(FootballScore.PenaltyGoal);
        const ownGoalPoints = this.competitionConfig.getScorePoints(FootballScore.OwnGoal);

        let total = statistics.getNrOfFieldGoals() * fieldGoalPoints;
        total += statistics.getNrOfAssists() * assistPoints;
        total += statistics.getNrOfPenalties() * penaltyGoalPoints;
        total += statistics.getNrOfOwnGoals() * ownGoalPoints;
        return total;
    }


    protected getAssistPoints(line: FootballLine, statistics: Statistics): number {
        const assistPoints = this.competitionConfig.getLineScorePoints({ line, score: FootballScore.Assist });
        return statistics.getNrOfAssists() * assistPoints;
    }

    public getSheetPoints(line: FootballLine, statistics: Statistics): number {
        if (line !== FootballLine.GoalKeeper && line !== FootballLine.Defense) {
            return 0;
        }
        return this.getCleanSheetPoints(line, statistics)
            + this.getSpottySheetPoints(line, statistics);
    }

    public getCleanSheetPoints(line: FootballLine, statistics: Statistics): number {
        const points = this.competitionConfig.getLineScorePoints({ line, score: FootballScore.CleanSheet });
        return statistics.hasCleanSheet() ? points : 0;
    }

    public getSpottySheetPoints(line: FootballLine, statistics: Statistics): number {
        const points = this.competitionConfig.getLineScorePoints({ line, score: FootballScore.SpottySheet });
        return statistics.hasSpottySheet() ? points : 0;
    }

    public getCardPoints(statistics: Statistics): number {
        const yellowCardPoints = this.competitionConfig.getScorePoints(FootballScore.YellowCard);
        const redCardPoints = this.competitionConfig.getScorePoints(FootballScore.RedCard);
        let total = statistics.getNrOfYellowCards() * yellowCardPoints;
        total += statistics.gotDirectRedCard() ? redCardPoints : 0;
        return total;
    }
}
