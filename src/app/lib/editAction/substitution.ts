import { Person } from 'ngx-sport';
import { EditAction } from '../editAction';
import { PoolUser } from '../pool/user';


export class Substitution extends EditAction {

    constructor(
        poolUser: PoolUser,
        personOut: Person,
        personIn: Person) {
        super(poolUser, personOut, personIn);
    }
}
