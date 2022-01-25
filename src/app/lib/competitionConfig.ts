import { Competition, Formation, Identifiable, Season } from 'ngx-sport';
import { AssemblePeriod } from './period/assemble';
import { TransferPeriod } from './period/transfer';
import { ViewPeriod } from './period/view';
import { Points } from './points';

export class CompetitionConfig extends Identifiable {

    constructor(
        protected sourceCompetition: Competition,
        protected points: Points,
        protected createAndJoinPeriod: ViewPeriod,
        protected assamblePeriod: AssemblePeriod,
        protected transferPeriod: TransferPeriod
    ) {
        super();
    }

    public getSeason(): Season {
        return this.getSourceCompetition().getSeason();
    }

    public getSourceCompetition(): Competition {
        return this.sourceCompetition;
    }

    public getPoints(): Points {
        return this.points;
    }

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