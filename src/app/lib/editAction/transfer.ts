import { Person } from 'ngx-sport';
import { EditAction } from '../editAction';
import { S11FormationPlace } from '../formation/place';


import { PoolUser } from '../pool/user';

export class Transfer extends EditAction {
    constructor(poolUser: PoolUser, place: S11FormationPlace, protected personIn: Person) {
        super(poolUser, place);
        poolUser.getTransfers().push(this);
    }

    public getPersonIn(): Person {
        return this.personIn;
    }
}
