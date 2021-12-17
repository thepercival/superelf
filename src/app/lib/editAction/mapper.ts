import { Injectable } from '@angular/core';
import { Association, PersonMapper } from 'ngx-sport';
import { PoolUser } from '../pool/user';
import { Substitution } from './substitution';
import { JsonSubstitution } from './substitution/json';
import { Transfer } from './transfer';

import { JsonTransfer } from './transfer/json';

@Injectable({
    providedIn: 'root'
})
export class EditActionMapper {
    constructor(
        protected personMapper: PersonMapper) { }

    toTransfer(json: JsonTransfer, poolUser: PoolUser, association: Association): Transfer {
        const personOut = this.personMapper.toObject(json.personOut, association);
        const personIn = this.personMapper.toObject(json.personIn, association);
        const transfer = new Transfer(poolUser, personOut, personIn);
        transfer.setOutWithTeam(json.outWithTeam);
        return transfer;
    }

    toSubstitution(json: JsonSubstitution, poolUser: PoolUser, association: Association): Substitution {
        const personOut = this.personMapper.toObject(json.personOut, association);
        const personIn = this.personMapper.toObject(json.personIn, association);
        const substitution = new Substitution(poolUser, personOut, personIn);
        return substitution;
    }

    // toJson(poolUser: PoolUser): JsonPoolUser {
    //     return {
    //         id: poolUser.getId(),
    //         user: this.userMapper.toJson(poolUser.getUser()),
    //         admin: poolUser.getAdmin(),
    //         competitors: poolUser.getCompetitors().map(competitor => this.poolCompetitorMapper.toJson(competitor)),
    //     };
    // }
}


