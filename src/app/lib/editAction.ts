import { Person } from 'ngx-sport';
import { PoolUser } from './pool/user';

export class EditAction {
    protected id: number = 0;

    constructor(
        protected poolUser: PoolUser,
        protected personOut: Person,
        protected personIn: Person) {
    }

    getId(): number {
        return this.id;
    }

    setId(id: number): void {
        this.id = id;
    }

    getPoolUser(): PoolUser {
        return this.poolUser;
    }

    getPersonOut(): Person {
        return this.personOut;
    }

    getPersonIn(): Person {
        return this.personIn;
    }
}
