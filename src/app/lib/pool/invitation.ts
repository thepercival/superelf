import { Pool } from '../pool';

export class PoolInvitation {
    protected id: number;

    constructor(private pool: Pool, private emailaddress: string) {
    }

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    getEmailaddress(): string {
        return this.emailaddress;
    }

    getPool(): Pool {
        return this.pool;
    }
}
