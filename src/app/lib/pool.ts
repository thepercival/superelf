import { Association, Competition, Period, PlaceRange, Season } from 'ngx-sport';

import { PoolCollection } from './pool/collection';
import { AssemblePeriod } from './period/assemble';
import { TransferPeriod } from './period/transfer';
import { ViewPeriod } from './period/view';
import { Points } from './points';

export class Pool {
    protected id: number = 0;
    protected competitions: Competition[] = [];

    static readonly PlaceRanges: PlaceRange[] = [
        { min: 1, max: 1, placesPerPoule: { min: 2, max: 40 } }
    ];

    constructor(protected collection: PoolCollection, protected sourceCompetition: Competition,
        protected points: Points,
        protected createAndJoinPeriod: ViewPeriod, protected assemblePeriod: AssemblePeriod,
        protected transferPeriod: TransferPeriod) {
    }

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    getCollection(): PoolCollection {
        return this.collection;
    }

    getSeason(): Season {
        return this.sourceCompetition.getSeason();
    }

    // setRoles(roles: Role[]): void {
    //     this.roles = roles;
    // }

    getName(): string {
        return this.getCollection().getName();
    }

    getCompetitions(): Competition[] {
        return this.competitions;
    }

    getCompetition(leagueNr?: number): Competition | undefined {
        const leagueName = this.getCollection().getLeagueName(leagueNr);
        return this.getCompetitions().find(competition => competition.getLeague().getName() === leagueName);
    }

    getSourceCompetition(): Competition {
        return this.sourceCompetition;
    }

    getAssociation(): Association | undefined {
        return this.getCompetition()?.getLeague().getAssociation();
    }

    getPoints(): Points {
        return this.points;
    }

    getAssemblePeriod(): AssemblePeriod {
        return this.assemblePeriod;
    }

    getAssembleViewPeriod(): ViewPeriod {
        return this.assemblePeriod.getViewPeriod();
    }

    getTransferPeriod(): TransferPeriod {
        return this.transferPeriod;
    }

    // getScoreUnits(formationLineDef?: number): PoolScoreUnit[] {
    //     if (formationLineDef === undefined) {
    //         return this.scoreUnits;
    //     }
    //     return this.scoreUnits.filter(scoreUnit => scoreUnit.getBase().getLineDef() === formationLineDef);
    // }

    // getCompetitors(competition?: Competition): PoolCompetitor[] {
    //     if (competition === undefined) {
    //         return this.competitors;
    //     }
    //     return this.competitors.filter(competitor => competitor.getCompetition() === competition);
    // }

    // getCompetitorNames(competition?: Competition): string[] {
    //     return this.getCompetitors(competition).map(competitor => competitor.getName());
    // }

    getCreateAndJoinPeriod(): ViewPeriod {
        return this.createAndJoinPeriod;
    }

    isInCreateAndJoinPeriod(): boolean {
        return this.getCreateAndJoinPeriod().isIn();
    }

    isInEditPeriod(): boolean {
        return this.getCreateAndJoinPeriod().isIn() || this.getAssemblePeriod().isIn() || this.getTransferPeriod().isIn();
    }

    isInAssembleOrTransferPeriod(): boolean {
        return this.getAssemblePeriod().isIn() || this.getTransferPeriod().isIn();
    }

    assemblePeriodNotStarted(date?: Date): boolean {
        const checkDate = date ? date : new Date();
        return checkDate < this.getAssemblePeriod().getStartDateTime();
    }

    transferPeriodNotStarted(date?: Date): boolean {
        const checkDate = date ? date : new Date();
        return checkDate < this.getTransferPeriod().getStartDateTime();
    }
}
