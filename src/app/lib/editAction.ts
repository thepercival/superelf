import { Identifiable } from 'ngx-sport';
import { S11FormationPlace } from './formation/place';
import { PoolUser } from './pool/user';

export class EditAction extends Identifiable{

    constructor(protected poolUser: PoolUser, protected formationPlace: S11FormationPlace) {
        super();
    }

    getPoolUser(): PoolUser {
        return this.poolUser;
    }

    getFormationPlace(): S11FormationPlace {
        return this.formationPlace;
    }
}
