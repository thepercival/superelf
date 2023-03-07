import { Identifiable, JsonCompetition } from 'ngx-sport';
import { Replacement } from './editAction/replacement';
import { Substitution } from './editAction/substitution';
import { Transfer } from './editAction/transfer';
import { JsonPoolUser } from './pool/user/json';

export class Achievement extends Identifiable{

    constructor(
        public poolUser: JsonPoolUser, 
        public competition: JsonCompetition,
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

export class TransferPeriodActionList {
    constructor(
        public replacements: Replacement[] = [],
        public transfers: Transfer[] = [],
        public substitutions: Substitution[] = []
    ){}

    hasDoubleTransfer(): boolean {
        return this.transfers.some((transfer: Transfer): boolean => {
            return this.transfers.some((nextTransfer: Transfer): boolean => {
                return transfer !== nextTransfer 
                && transfer.getCreatedDate().getTime() === nextTransfer.getCreatedDate().getTime()
            });
        });
    }
}
