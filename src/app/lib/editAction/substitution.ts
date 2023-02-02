import { FootballLine } from 'ngx-sport';
import { EditAction } from '../editAction';
import { PoolUser } from '../pool/user';


export class Substitution extends EditAction {

    constructor(poolUser: PoolUser, lineNumberOut: FootballLine, placeNumberOut: number) {
        super(poolUser, lineNumberOut, placeNumberOut);
        poolUser.getSubstitutions().push(this);
    }
}
