import { PoolCompetitor } from './competitor';
import { Pool } from '../pool';
import { User } from '../user';
import { S11Formation } from '../formation';
import { Identifiable } from 'ngx-sport';
import { AssemblePeriod } from '../period/assemble';
import { TransferPeriod } from '../period/transfer';
import { LeagueName } from '../leagueName';

export class PoolUser extends Identifiable {
    private admin: boolean = false;
    protected competitors: PoolCompetitor[] = [];
    protected nrOfAssembled: number = 0;
    protected nrOfTransferedWithTeam: number = 0;
    protected assembleFormation: S11Formation | undefined;
    protected transferFormation: S11Formation | undefined;

    constructor(protected pool: Pool, protected user: User) {
        super();
        this.pool.getUsers().push(this);
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
        return this.nrOfAssembled;;
    }

    setNrOfAssembled(nrOfAssembled: number) {
        this.nrOfAssembled = nrOfAssembled;
    }

    // getNrOfTransferedWithTeam(): number {
    //     return this.nrOfTransferedWithTeam;
    // }

    // setNrOfTransferedWithTeam(nrOfTransfered: number) {
    //     this.nrOfTransferedWithTeam = nrOfTransfered;
    // }

    getAssembleFormation(): S11Formation | undefined {
        return this.assembleFormation;
    }

    setAssembleFormation(formation: S11Formation | undefined) {
        return this.assembleFormation = formation;
    }

    getTransferFormation(): S11Formation | undefined {
        return this.transferFormation;
    }

    setTransferFormation(formation: S11Formation | undefined) {
        return this.transferFormation = formation;
    }

    getFormation(editPeriod: AssemblePeriod | TransferPeriod): S11Formation | undefined {
        if (editPeriod instanceof AssemblePeriod) {
            return this.assembleFormation;
        } else if (editPeriod instanceof TransferPeriod) {
            return this.transferFormation;
        }
        return undefined;
    }
}