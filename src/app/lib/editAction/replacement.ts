import { FootballLine, Person, Player } from 'ngx-sport';
import { EditAction } from '../editAction';
import { S11FormationPlace } from '../formation/place';


import { PoolUser } from '../pool/user';

export class Replacement extends EditAction {
    constructor(poolUser: PoolUser, lineNumberOut: FootballLine, placeNumberOut: number, protected playerIn: Player) {
        super(poolUser, lineNumberOut, placeNumberOut);
        poolUser.getReplacements().push(this);
    }

    public getPlayerIn(): Player {
        return this.playerIn;
    }

    public getPersonIn(): Person {
        return this.getPlayerIn().getPerson();
    }
}
