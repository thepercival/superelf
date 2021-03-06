import { Competition } from 'ngx-sport';
import { PoolCompetitor } from './competitor';
import { Pool } from '../pool';
import { User } from '../user';
import { Formation } from '../formation';

export class PoolUser {
    private id: number = 0;
    private admin: boolean = false;
    protected competitors: PoolCompetitor[] = [];
    protected nrOfAssembled: number = 0;
    protected nrOfTransferedWithTeam: number = 0;
    protected assembleFormation: Formation | undefined;
    protected transferFormation: Formation | undefined;

    constructor(protected pool: Pool, protected user: User) {
    }

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
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

    getNrOfAssembled(): number {
        return this.nrOfAssembled;;
    }

    setNrOfAssembled(nrOfAssembled: number) {
        this.nrOfAssembled = nrOfAssembled;
    }

    getNrOfTransferedWithTeam(): number {
        return this.nrOfTransferedWithTeam;
    }

    setNrOfTransferedWithTeam(nrOfTransfered: number) {
        this.nrOfTransferedWithTeam = nrOfTransfered;
    }

    getAssembleFormation(): Formation | undefined {
        return this.assembleFormation;
    }

    setAssembleFormation(formation: Formation | undefined) {
        return this.assembleFormation = formation;
    }

    getTransferFormation(): Formation | undefined {
        return this.transferFormation;
    }

    setTransferFormation(formation: Formation | undefined) {
        return this.transferFormation = formation;
    }
}