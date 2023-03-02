import { FootballLine, Person, Player } from 'ngx-sport';
import { TransferPeriodAction } from '../editAction';

import { PoolUser } from '../pool/user';

export class Transfer extends TransferPeriodAction {
    constructor(
        poolUser: PoolUser, 
        lineNumberOut: FootballLine, 
        placeNumberOut: number, 
        protected playerIn: Player,
        protected playerOut: Player,
        createdDateTime: Date) {
        super(poolUser, lineNumberOut, placeNumberOut, createdDateTime);
        poolUser.getTransferPeriodActionList().transfers.push(this);
    }

    public getPlayerIn(): Player {
        return this.playerIn;
    }

    public getPersonIn(): Person {
        return this.getPlayerIn().getPerson();
    }

    public getPlayerOut(): Player {
        return this.playerOut;
    }

    public getPersonOut(): Person {
        return this.getPlayerOut().getPerson();
    }
}
