import { Person } from 'ngx-sport';
import { EditAction } from '../editAction';
import { S11FormationPlace } from '../formation/place';


import { PoolUser } from '../pool/user';

export class Replacement extends EditAction {
    constructor(poolUser: PoolUser, place: S11FormationPlace, protected personIn: Person) {
        super(poolUser, place);
        poolUser.getReplacements().push(this);
    }

    public getPersonIn(): Person {
        return this.personIn;
    }
}
