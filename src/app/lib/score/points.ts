import { FootballCard, FootballGoal, FootballLineScore, FootballResult, FootballScore } from "../score";


export interface ScorePoints{
    score: FootballScore;
    points: number;
}

export interface LineScorePoints extends FootballLineScore {
    points: number;
}

export class ScorePointsMap {
    private map: Map<string, number>;
    private lineMap: Map<string, number>;

    constructor(points: ScorePoints[], linePoints: LineScorePoints[]) {
        this.map = new Map(
            points.map((scorePoints: ScorePoints) => {
                return [this.getUniqueIndex(scorePoints.score), scorePoints.points];
            }),
        );
        this.lineMap = new Map(
            linePoints.map((lineScorePoints: LineScorePoints) => {
                return [this.getUniqueLineIndex(lineScorePoints), lineScorePoints.points];
            }),
        );
    }

    getUniqueIndex(score: FootballScore): string {
        return score;
    }

    getUniqueLineIndex(lineScore: FootballLineScore): string {
        return lineScore.line + '-' + lineScore.score;
    }

    public getScorePoints(): FootballScore[] {
        const scores: FootballScore[] = [];
        this.map.forEach((value: number, key: string) => {
            scores.push(<FootballScore>key);
        });
        return scores;
    }

    public get(score: FootballScore): number {
        const index = this.getUniqueIndex(score);
        const retVal = this.map.get(index);
        if (retVal === undefined) {
            throw new Error('scorePoints "' + index + '" not found');
        }
        return retVal;
    }

    public getLine(lineScore: FootballLineScore): number {
        const index = this.getUniqueLineIndex(lineScore);
        const retVal = this.lineMap.get(index);
        if (retVal === undefined) {
            throw new Error('lineScore "' + index + '" not found');
        }
        return retVal;
    }
}