import { PoolCompetitor } from './competitor';
import { Pool } from '../pool';
import { User } from '../user';
import { Identifiable } from 'ngx-sport';
import { LeagueName } from '../leagueName';
import { TransferPeriodActionList } from '../editAction';

export class PoolUser extends Identifiable {
    private admin: boolean = false;
    protected competitors: PoolCompetitor[] = [];
    protected nrOfAssembled: number = 0;
    protected nrOfTransfers: number = 0;
    protected hasAssembleFormationProp: boolean = false;
    protected hasTransferFormationProp: boolean = false;
    protected transferPeriodActionList = new TransferPeriodActionList();

    constructor(protected pool: Pool, protected user: User) {
        super();
    }

    getPool(): Pool {
        return this.pool;
    }

    getUser(): User {
        return this.user;
    }

    getName(): string | undefined {
        return this.user.getName();
    }

    getAdmin(): boolean {
        return this.admin;
    }

    setAdmin(admin: boolean) {
        this.admin = admin;;
    }

    getCompetitors(): PoolCompetitor[] {
        return this.competitors;
    }

    getCompetitor(leagueName: LeagueName): PoolCompetitor | undefined {
        return this.competitors.find((competitor: PoolCompetitor): boolean => {
            return competitor.getCompetition().getLeague().getName() === leagueName;
        });
    }

    getNrOfAssembled(): number {
        return this.nrOfAssembled;
    }

    setNrOfAssembled(nrOfAssembled: number) {
        this.nrOfAssembled = nrOfAssembled;
    }

    getNrOfTransfers(): number {
        return this.nrOfTransfers;
    }

    setNrOfTransfers(nrOfTransfers: number) {
        this.nrOfTransfers = nrOfTransfers;
    }

    hasAssembleFormation(): boolean {
        return this.hasAssembleFormationProp;
    }

    setAssembleFormation(hasAssembleFormation: boolean) {
        this.hasAssembleFormationProp = hasAssembleFormation;
    }

    getTransferPeriodActionList(): TransferPeriodActionList {
        return this.transferPeriodActionList;
    }
    
    hasTransferFormation(): boolean {
        return this.hasTransferFormationProp;
    }

    setTransferFormation(hasTransferFormation: boolean) {
        this.hasTransferFormationProp = hasTransferFormation;
    }
}