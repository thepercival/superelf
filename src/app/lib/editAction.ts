import { FootballLine, Identifiable } from 'ngx-sport';
import { PoolUser } from './pool/user';

export class EditAction extends Identifiable{

    constructor(
        protected poolUser: PoolUser, 
        protected lineNumberOut: FootballLine,
        protected placeNumberOut: number) {
        super();
    }

    getPoolUser(): PoolUser {
        return this.poolUser;
    }

    getLineNumberOut(): FootballLine {
        return this.lineNumberOut;
    }

    getPlaceNumberOut(): FootballLine {
        return this.placeNumberOut;
    }
}
