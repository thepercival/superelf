import { Identifiable } from 'ngx-sport';
import { JsonPoolUser } from './pool/user/json';

export class Achievement extends Identifiable{

    constructor(
        public poolUser: JsonPoolUser, 
        protected rank: number,
        protected created: Date) {
        super();
    }

    getRank(): number {
        return this.rank;
    }

    getCreated(): Date {
        return this.created;
    }
}
