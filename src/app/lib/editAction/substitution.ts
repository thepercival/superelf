import { FootballLine } from 'ngx-sport';
import { EditAction } from '../editAction';
import { PoolUser } from '../pool/user';


export class Substitution extends EditAction {

    constructor(poolUser: PoolUser, lineNumberOut: FootballLine, placeNumberOut: number, createdDate: Date) {
        super(poolUser, lineNumberOut, placeNumberOut,createdDate);
        poolUser.getSubstitutions().push(this);
    }
}
