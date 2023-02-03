import { FootballLine, Person, Player } from 'ngx-sport';
import { EditAction } from '../editAction';

import { PoolUser } from '../pool/user';

export class Transfer extends EditAction {
    constructor(
        poolUser: PoolUser, 
        lineNumberOut: FootballLine, 
        placeNumberOut: number, 
        protected playerIn: Player,
        createdDateTime: Date) {
        super(poolUser, lineNumberOut, placeNumberOut, createdDateTime);
        poolUser.getTransfers().push(this);
    }

    public getPlayerIn(): Player {
        return this.playerIn;
    }

    public getPersonIn(): Person {
        return this.getPlayerIn().getPerson();
    }
}
