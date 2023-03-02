import { FootballLine, Identifiable } from 'ngx-sport';
import { Replacement } from './editAction/replacement';
import { Substitution } from './editAction/substitution';
import { Transfer } from './editAction/transfer';
import { PoolUser } from './pool/user';

export class TransferPeriodAction extends Identifiable{

    constructor(
        protected poolUser: PoolUser, 
        protected lineNumberOut: FootballLine,
        protected placeNumberOut: number,
        protected createdDate: Date) {
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

    public getCreatedDate(): Date {
        return this.createdDate;
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
