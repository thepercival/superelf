import { FootballLine, Person } from 'ngx-sport';
import { EditAction } from '../editAction';

import { PoolUser } from '../pool/user';

export class Transfer extends EditAction {
    constructor(poolUser: PoolUser, lineNumberOut: FootballLine, placeNumberOut: number, protected personIn: Person) {
        super(poolUser, lineNumberOut, placeNumberOut);
        poolUser.getTransfers().push(this);
    }

    public getPersonIn(): Person {
        return this.personIn;
    }
}
