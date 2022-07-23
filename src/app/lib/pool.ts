import { Association, Competition, CompetitionSport, Identifiable, PlaceRange, Season } from 'ngx-sport';

import { PoolCollection } from './pool/collection';
import { AssemblePeriod } from './period/assemble';
import { TransferPeriod } from './period/transfer';
import { ViewPeriod } from './period/view';
import { PoolUser } from './pool/user';
import { CompetitionConfig } from './competitionConfig';
import { PoolCompetitor } from './pool/competitor';
import { LeagueName } from './leagueName';

export class Pool extends Identifiable {
    protected competitions: Competition[] = [];
    protected users: PoolUser[] = [];

    static readonly PlaceRanges: PlaceRange[] = [
        { min: 1, max: 1, placesPerPoule: { min: 2, max: 40 } }
    ];

    constructor(protected collection: PoolCollection, protected competitionConfig: CompetitionConfig) {
        super();
    }

    public getUsers(): PoolUser[] {
        return this.users;
    }

    public getCollection(): PoolCollection {
        return this.collection;
    }

    public getCompetitionConfig(): CompetitionConfig {
        return this.competitionConfig;
    }

    public getSourceCompetition(): Competition {
        return this.competitionConfig.getSourceCompetition();
    }

    public getSeason(): Season {
        return this.competitionConfig.getSourceCompetition().getSeason();
    }

    // setRoles(roles: Role[]): void {
    //     this.roles = roles;
    // }

    public getName(): string {
        return this.getCollection().getName();
    }

    public getCompetitions(): Competition[] {
        return this.competitions;
    }

    public getCompetition(leagueName?: LeagueName): Competition | undefined {
        // const leagueName = this.getCollection().getLeagueName(leagueNr);
        return this.getCompetitions().find(competition => competition.getLeague().getName() === leagueName);
    }

    // public getAssociation(): Association | undefined {
    //     return this.getCompetition()?.getLeague().getAssociation();
    // }

    // public getPoints(): Points {
    //     return this.getCompetitionConfig().getPoints();
    // }

    public getAssemblePeriod(): AssemblePeriod {
        return this.getCompetitionConfig().getAssemblePeriod();
    }

    public getAssembleViewPeriod(): ViewPeriod {
        return this.getCompetitionConfig().getAssemblePeriod().getViewPeriod();
    }

    public getTransferPeriod(): TransferPeriod {
        return this.getCompetitionConfig().getTransferPeriod();
    }

    // getScores(formationLineDef?: number): PoolScore[] {
    //     if (formationLineDef === undefined) {
    //         return this.scores;
    //     }
    //     return this.scores.filter(score => score.getBase().getLineDef() === formationLineDef);
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

    public getStartDateTime(): Date {
        return this.getAssemblePeriod().getViewPeriod().getStartDateTime();
    }

    public getCreateAndJoinPeriod(): ViewPeriod {
        return this.getCompetitionConfig().getCreateAndJoinPeriod();
    }

    public isInCreateAndJoinPeriod(): boolean {
        return this.getCreateAndJoinPeriod().isIn();
    }

    public isInEditPeriod(): boolean {
        return this.getCreateAndJoinPeriod().isIn() || this.getAssemblePeriod().isIn() || this.getTransferPeriod().isIn();
    }

    public isInAssembleOrTransferPeriod(): boolean {
        return this.getAssemblePeriod().isIn() || this.getTransferPeriod().isIn();
    }

    public assemblePeriodNotStarted(date?: Date): boolean {
        const checkDate = date ? date : new Date();
        return checkDate < this.getAssemblePeriod().getStartDateTime();
    }

    public transferPeriodNotStarted(date?: Date): boolean {
        const checkDate = date ? date : new Date();
        return checkDate < this.getTransferPeriod().getStartDateTime();
    }

    public getCompetitionSport(leagueName: LeagueName): CompetitionSport {
        const competition = this.getCompetition(leagueName);
        if (competition === undefined) {
            throw Error('competitionSport not found');
        }
        const competitionSport = competition.getSingleSport();
        if (competitionSport === undefined) {
            throw Error('competitionSport not found');
        }
        return competitionSport;
    }

    public getCompetitors(leagueName: LeagueName): PoolCompetitor[] {
        const poolCompetitors: PoolCompetitor[] = [];
        this.getUsers().forEach((poolUser: PoolUser) => {
            poolUser.getCompetitors().forEach((poolCompetitor: PoolCompetitor) => {
                if (poolCompetitor.getCompetition().getLeague().getName() === leagueName) {
                    poolCompetitors.push(poolCompetitor);
                }
            })
        });
        return poolCompetitors;
    }
}
