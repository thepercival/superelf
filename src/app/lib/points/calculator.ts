import { AgainstResult, FootballLine } from "ngx-sport";
import { CompetitionConfig } from "../competitionConfig";
import { FootballCard, FootballGoal, FootballResult, FootballScore, FootballSheet } from "../score";
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
            return this.competitionConfig.getScorePoints(FootballResult.Win);
        } else if (result === AgainstResult.Draw) {
            return this.competitionConfig.getScorePoints(FootballResult.Draw);
        }
        return 0;
    }

    public getGoalPoints(line: FootballLine, statistics: Statistics): number {
        const fieldGoalPoints = this.competitionConfig.getLineScorePoints({ line, score: FootballGoal.Normal });
        const assistPoints = this.competitionConfig.getLineScorePoints({ line, score: FootballGoal.Assist });
        const penaltyGoalPoints = this.competitionConfig.getScorePoints(FootballGoal.Penalty);
        const ownGoalPoints = this.competitionConfig.getScorePoints(FootballGoal.Own);

        let total = statistics.getNrOfFieldGoals() * fieldGoalPoints;
        total += statistics.getNrOfAssists() * assistPoints;
        total += statistics.getNrOfPenalties() * penaltyGoalPoints;
        total += statistics.getNrOfOwnGoals() * ownGoalPoints;
        return total;
    }


    protected getAssistPoints(line: FootballLine, statistics: Statistics): number {
        const assistPoints = this.competitionConfig.getLineScorePoints({ line, score: FootballGoal.Assist });
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
        const points = this.competitionConfig.getLineScorePoints({ line, score: FootballSheet.Clean });
        return statistics.hasCleanSheet() ? points : 0;
    }

    public getSpottySheetPoints(line: FootballLine, statistics: Statistics): number {
        const points = this.competitionConfig.getLineScorePoints({ line, score: FootballSheet.Spotty });
        return statistics.hasSpottySheet() ? points : 0;
    }

    public getCardPoints(statistics: Statistics): number {
        const yellowCardPoints = this.competitionConfig.getScorePoints(FootballCard.Yellow);
        const redCardPoints = this.competitionConfig.getScorePoints(FootballCard.Red);
        let total = statistics.getNrOfYellowCards() * yellowCardPoints;
        total += statistics.gotDirectRedCard() ? redCardPoints : 0;
        return total;
    }
}
