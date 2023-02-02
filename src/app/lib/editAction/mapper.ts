import { Injectable } from '@angular/core';
import { Association, PersonMapper, PlayerMapper } from 'ngx-sport';
import { S11Formation } from '../formation';
import { S11FormationPlace } from '../formation/place';
import { JsonTransferPeriod } from '../period/transfer/json';
import { PoolUser } from '../pool/user';
import { JsonTransferAction } from './json';
import { Replacement } from './replacement';
import { JsonReplacement } from './replacement/json';
import { Substitution } from './substitution';
import { JsonSubstitution } from './substitution/json';
import { Transfer } from './transfer';

import { JsonTransfer } from './transfer/json';

@Injectable({
    providedIn: 'root'
})
export class EditActionMapper {
    constructor(
        protected personMapper: PersonMapper,
        protected playerMapper: PlayerMapper,
        ) { }

    toReplacement(json: JsonReplacement, poolUser: PoolUser, association: Association): Replacement {
        const assembleFormation = poolUser.getAssembleFormation();
        if( assembleFormation === undefined ) {
            throw new Error('assembleFormation not found');
        }
        const jsonPersonIn = json.playerIn.person;
        if( jsonPersonIn === undefined) {
            throw new Error('person can not be empty');
        }
        const personIn = this.personMapper.toObject(jsonPersonIn, association);
        const playerIn = this.playerMapper.toObject(json.playerIn, association, personIn);
        return new Replacement(poolUser, json.lineNumberOut, json.placeNumberOut, playerIn);
    }

    toTransfer(json: JsonTransfer, poolUser: PoolUser, association: Association): Transfer {
        const assembleFormation = poolUser.getAssembleFormation();
        if( assembleFormation === undefined ) {
            throw new Error('assembleFormation not found');
        }
        const jsonPersonIn = json.playerIn.person;
        if( jsonPersonIn === undefined) {
            throw new Error('person can not be empty');
        }
        const personIn = this.personMapper.toObject(jsonPersonIn, association);
        const playerIn = this.playerMapper.toObject(json.playerIn, association, personIn);
        return new Transfer(poolUser, json.lineNumberOut, json.placeNumberOut, personIn);
    }

    toSubstitution(json: JsonSubstitution, poolUser: PoolUser): Substitution {
        const assembleFormation = poolUser.getAssembleFormation();
        if( assembleFormation === undefined ) {
            throw new Error('assembleFormation not found');
        }
        return new Substitution(poolUser, json.lineNumberOut, json.placeNumberOut);
    }

    // private getPlace(formation: S11Formation, json: JsonTransferAction): S11FormationPlace {
    //     const line = formation.getLine(json.lineNumber);
    //     return line.getPlace(json.placeNumber);
    // }

    // toJson(poolUser: PoolUser): JsonPoolUser {
    //     return {
    //         id: poolUser.getId(),
    //         user: this.userMapper.toJson(poolUser.getUser()),
    //         admin: poolUser.getAdmin(),
    //         competitors: poolUser.getCompetitors().map(competitor => this.poolCompetitorMapper.toJson(competitor)),
    //     };
    // }
}


