import { FootballLine } from 'ngx-sport';
import { TransferPeriodAction } from '../editAction';
import { PoolUser } from '../pool/user';


export class Substitution extends TransferPeriodAction {

    constructor(poolUser: PoolUser, lineNumberOut: FootballLine, placeNumberOut: number, createdDate: Date) {
        super(poolUser, lineNumberOut, placeNumberOut,createdDate);
        poolUser.getTransferPeriodActionList().substitutions.push(this);
    }
}
