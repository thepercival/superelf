import { Identifiable } from 'ngx-sport';
import { JsonPoolUser } from './pool/user/json';

export class Achievement extends Identifiable{

    constructor(
        public poolUser: JsonPoolUser, 
        protected created: Date) {
        super();
    }

    getCreated(): Date {
        return this.created;
    }
}
