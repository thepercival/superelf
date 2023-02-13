import { PoolCompetitor } from './competitor';
import { Pool } from '../pool';
import { User } from '../user';
import { S11Formation } from '../formation';
import { Identifiable } from 'ngx-sport';
import { AssemblePeriod } from '../period/assemble';
import { TransferPeriod } from '../period/transfer';
import { LeagueName } from '../leagueName';
import { Replacement } from '../editAction/replacement';
import { Substitution } from '../editAction/substitution';
import { Transfer } from '../editAction/transfer';
import { ViewPeriod } from '../period/view';

export class PoolUser extends Identifiable {
    private admin: boolean = false;
    protected competitors: PoolCompetitor[] = [];
    protected nrOfAssembled: number = 0;
    protected nrOfTransfers: number = 0;
    protected assembleFormation: S11Formation | undefined;
    protected transferFormation: S11Formation | undefined;
    protected replacements: Replacement[] = [];
    protected transfers: Transfer[] = [];
    protected substitutions: Substitution[] = [];

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

    getAssembleFormation(): S11Formation | undefined {
        return this.assembleFormation;
    }

    setAssembleFormation(formation: S11Formation | undefined) {
        return this.assembleFormation = formation;
    }

    getReplacements(): Replacement[] {
        return this.replacements;
    }

    getTransfers(): Transfer[] {
        return this.transfers;
    }

    hasDoubleTransfer(): boolean {
        return this.transfers.some((transfer: Transfer): boolean => {
            return this.transfers.some((nextTransfer: Transfer): boolean => {
                return transfer !== nextTransfer 
                && transfer.getCreatedDate().getTime() === nextTransfer.getCreatedDate().getTime()
            });
        });
    }

    getSubstitutions(): Substitution[] {
        return this.substitutions;
    }

    getTransferFormation(): S11Formation | undefined {
        return this.transferFormation;
    }

    setTransferFormation(formation: S11Formation | undefined) {
        return this.transferFormation = formation;
    }

    getFormation(editOrViewPeriod: AssemblePeriod | TransferPeriod): S11Formation | undefined {
        if (editOrViewPeriod instanceof AssemblePeriod) {
            return this.assembleFormation;
        } else if (editOrViewPeriod instanceof TransferPeriod) {
            return this.transferFormation;
        } 
        return undefined;
    }

    getFormationFromViewPeriod(viewPeriod: ViewPeriod): S11Formation {
        let formation;
        if( this.pool.getAssembleViewPeriod() === viewPeriod ) {
            formation = this.assembleFormation;
        } else if( this.pool.getTransferViewPeriod() === viewPeriod ) {
            formation = this.transferFormation;
        }
        if( formation === undefined) {
            throw new Error('formation not found from viewPeriod');
        }
        return formation;
    }
}