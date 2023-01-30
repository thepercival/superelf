import { EditAction } from '../editAction';
import { S11FormationPlace } from '../formation/place';
import { PoolUser } from '../pool/user';


export class Substitution extends EditAction {

    constructor(poolUser: PoolUser, place: S11FormationPlace) {
        super(poolUser, place);
        poolUser.getSubstitutions().push(this);
    }
}
