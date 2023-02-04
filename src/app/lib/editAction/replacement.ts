import { FootballLine, Person, Player } from 'ngx-sport';
import { EditAction } from '../editAction';


import { PoolUser } from '../pool/user';

export class Replacement extends EditAction {
    constructor(
        poolUser: PoolUser, 
        lineNumberOut: FootballLine, 
        placeNumberOut: number, 
        protected playerIn: Player,
        protected playerOut: Player,
        createdDateTime: Date) {
        super(poolUser, lineNumberOut, placeNumberOut, createdDateTime);
        poolUser.getReplacements().push(this);
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
