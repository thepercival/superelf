import { Competition } from 'ngx-sport';
import { PoolCompetitor } from './competitor';
import { Pool } from '../pool';
import { User } from '../user';

export class PoolUser {
    private id: number
    private admin: boolean;
    protected competitors: PoolCompetitor[] = [];

    constructor(protected pool: Pool, protected user: User) {
        this.setPool(pool);
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

    protected setPool(pool: Pool) {
        pool.getUsers().push(this);
        this.pool = pool;
    }

    getUser(): User {
        return this.user;
    }

    getName(): string {
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

    getCompetitor(competition: Competition): PoolCompetitor {
        return this.competitors.find(competitor => competitor.getCompetition() === competition);
    }
}