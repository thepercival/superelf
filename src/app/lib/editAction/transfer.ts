import { Person } from 'ngx-sport';
import { EditAction } from '../editAction';


import { PoolUser } from '../pool/user';

export class Transfer extends EditAction {
    protected outWithTeam: boolean = true;

    constructor(
        poolUser: PoolUser,
        personOut: Person,
        personIn: Person) {
        super(poolUser, personOut, personIn);
    }

    getOutWithTeam(): boolean {
        return this.outWithTeam;
    }

    setOutWithTeam(outWithTeam: boolean) {
        this.outWithTeam = outWithTeam;
    }
}
