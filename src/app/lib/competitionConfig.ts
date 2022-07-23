import { Competition, Identifiable, Season } from 'ngx-sport';
import { AssemblePeriod } from './period/assemble';
import { TransferPeriod } from './period/transfer';
import { ViewPeriod } from './period/view';
import { FootballLineScore, FootballScore } from './score';
import { LineScorePoints, LineScorePointsMap, ScorePoints } from './score/points';
export class CompetitionConfig extends Identifiable {

    protected scorePointsMap: Map<FootballScore, number>;
    protected lineScorePointsMap: LineScorePointsMap;

    constructor(
        protected sourceCompetition: Competition,
        protected scorePoints: ScorePoints[],
        protected lineScorePoints: LineScorePoints[],
        protected createAndJoinPeriod: ViewPeriod,
        protected assamblePeriod: AssemblePeriod,
        protected transferPeriod: TransferPeriod
    ) {
        super();
        this.scorePointsMap = new Map(scorePoints.map((points: ScorePoints) => {
            return [points.score, points.points];
        }),
        );
        this.lineScorePointsMap = new LineScorePointsMap(this.lineScorePoints);
    }

    public getSeason(): Season {
        return this.getSourceCompetition().getSeason();
    }

    public getSourceCompetition(): Competition {
        return this.sourceCompetition;
    }

    public getAllScorePoints(): ScorePoints[] {
        return this.scorePoints;
    }

    public getScorePoints(score: FootballScore): number {
        const retVal = this.scorePointsMap.get(score);
        if (retVal === undefined) {
            throw new Error('scoreNotFound');
        }
        return retVal;
    }

    public getAllPointsForLines(): LineScorePoints[] {
        return this.lineScorePoints;
    }

    public getLineScorePoints(lineScore: FootballLineScore): number {
        return this.lineScorePointsMap.get(lineScore);
    }

    // public getPoints(score: Score | LineScore): number {
    //     if (score.hasOwnProperty('line')) {
    //         return this.lineScorePointsMap.get(score);
    //     }
    //     return this.scorePointsMap.get(score);

    // }

    public getCreateAndJoinPeriod(): ViewPeriod {
        return this.createAndJoinPeriod;
    }

    public getAssemblePeriod(): AssemblePeriod {
        return this.assamblePeriod;
    }

    public getTransferPeriod(): TransferPeriod {
        return this.transferPeriod;
    }

    public isInAssembleOrTransferPeriod(): boolean {
        return this.getAssemblePeriod().isIn() || this.getTransferPeriod().isIn();
    }

    public getViewPeriods(): ViewPeriod[] {
        return [
            this.getCreateAndJoinPeriod(),
            this.getAssemblePeriod().getViewPeriod(),
            this.getTransferPeriod().getViewPeriod()
        ];
    }

    public getViewPeriodByDate(dateTime: Date): ViewPeriod | undefined {
        return this.getViewPeriods().find((viewPeriod: ViewPeriod): boolean => {
            return viewPeriod.isIn(dateTime);
        });
    }
}

