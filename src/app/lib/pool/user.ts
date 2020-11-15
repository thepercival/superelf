import { Competition } from 'ngx-sport';
import { PoolCompetitor } from './competitor';
import { Pool } from '../pool';
import { User } from '../user';
import { Formation } from '../formation';

export class PoolUser {
    private id: number = 0;
    private admin: boolean = false;
    protected competitors: PoolCompetitor[] = [];
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