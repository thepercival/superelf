import { Association, Competition, Formation, PlaceRange, Season } from 'ngx-sport';

import { PoolCollection } from './pool/collection';
import { PoolPeriod } from './pool/period';
import { PoolScoreUnit } from './pool/scoreUnit';
import { PoolUser } from './pool/user';
import { User } from './user';

export class Pool {
    protected id: number = 0;
    protected competitions: Competition[] = [];
    protected periods: PoolPeriod[] = [];
    protected scoreUnits: PoolScoreUnit[] = [];
    protected users: PoolUser[] = [];
    protected formations: Formation[] = [];

    static readonly PlaceRanges: PlaceRange[] = [
        { min: 1, max: 1, placesPerPoule: { min: 2, max: 40 } }
    ];

    constructor(protected collection: PoolCollection, protected sourceCompetition: Competition, protected season: Season) {
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
        return this.season;
    }

    setSeason(season: Season): void {
        this.season = season;
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

    getPeriods(periodType?: number): PoolPeriod[] {
        if (periodType === undefined) {
            return this.periods;
        }
        return this.periods.filter(poolPeriod => (poolPeriod.getType() & periodType) === poolPeriod.getType());
    }

    protected getPeriod(periodType: number): PoolPeriod | undefined {
        return this.periods.find(poolPeriod => poolPeriod.getType() === periodType);
    }

    getChoosePlayersPeriod(): PoolPeriod | undefined {
        return this.getPeriod(PoolPeriod.ChoosePlayers);
    }

    getTransferPeriod(): PoolPeriod | undefined {
        return this.getPeriod(PoolPeriod.Transfer);
    }

    getScoreUnits(formationLineDef?: number): PoolScoreUnit[] {
        if (formationLineDef === undefined) {
            return this.scoreUnits;
        }
        return this.scoreUnits.filter(scoreUnit => scoreUnit.getBase().getLineDef() === formationLineDef);
    }

    getUsers(): PoolUser[] {
        return this.users;
    }

    // getCompetitors(competition?: Competition): PoolCompetitor[] {
    //     if (competition === undefined) {
    //         return this.competitors;
    //     }
    //     return this.competitors.filter(competitor => competitor.getCompetition() === competition);
    // }

    getUser(user: User): PoolUser | undefined {
        return this.users.find(poolUser => poolUser.getUser() === user);
    }

    // getCompetitorNames(competition?: Competition): string[] {
    //     return this.getCompetitors(competition).map(competitor => competitor.getName());
    // }

    inPeriod(periodType: number, date?: Date): boolean {
        const checkDate = date ? date : new Date();
        return this.getPeriods(periodType).some(period => period.isIn(checkDate));
    }

    beforePeriod(periodType: number, date?: Date): boolean {
        const checkDate = date ? date : new Date();
        return this.getPeriods(periodType).some(period => checkDate.getTime() < period.getStartDateTime().getTime());
    }

    afterPeriod(periodType: number, date?: Date): boolean {
        const checkDate = date ? date : new Date();
        return this.getPeriods(periodType).some(period => checkDate.getTime() > period.getEndDateTime().getTime());
    }

    inCreateAndJoinPeriod(date?: Date): boolean {
        return this.inPeriod(PoolPeriod.CreateAndJoin, date);
    }

    inChoosePlayersPeriod(date?: Date): boolean {
        return this.inPeriod(PoolPeriod.ChoosePlayers, date);
    }

    inTransferPeriod(date?: Date): boolean {
        return this.inPeriod(PoolPeriod.Transfer, date);
    }

    inEditPeriod(): boolean {
        return this.inCreateAndJoinPeriod() || this.inChoosePlayersPeriod() || this.inTransferPeriod();
    }

    beforeTransferPeriod(date?: Date): boolean {
        return this.beforePeriod(PoolPeriod.Transfer, date);
    }

    afterCreateAndJoinPeriod(date?: Date): boolean {
        return this.afterPeriod(PoolPeriod.CreateAndJoin, date);
    }

    getFormations(): Formation[] {
        return this.formations;
    }
}
