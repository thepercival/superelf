import { Injectable } from '@angular/core';
import { Association, PersonMapper } from 'ngx-sport';
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
        protected personMapper: PersonMapper) { }

    toReplacement(json: JsonReplacement, poolUser: PoolUser, association: Association): Replacement {
        const assembleFormation = poolUser.getAssembleFormation();
        if( assembleFormation === undefined ) {
            throw new Error('assembleFormation not found');
        }
        const formationPlace = this.getPlace(assembleFormation, json);
        const personIn = this.personMapper.toObject(json.personIn, association);
        return new Replacement(poolUser, formationPlace, personIn);
    }

    toTransfer(json: JsonReplacement, poolUser: PoolUser, association: Association): Transfer {
        const assembleFormation = poolUser.getAssembleFormation();
        if( assembleFormation === undefined ) {
            throw new Error('assembleFormation not found');
        }
        const formationPlace = this.getPlace(assembleFormation, json);
        const personIn = this.personMapper.toObject(json.personIn, association);
        return new Transfer(poolUser, formationPlace, personIn);
    }

    toSubstitution(json: JsonReplacement, poolUser: PoolUser): Substitution {
        const assembleFormation = poolUser.getAssembleFormation();
        if( assembleFormation === undefined ) {
            throw new Error('assembleFormation not found');
        }
        const formationPlace = this.getPlace(assembleFormation, json);
        return new Substitution(poolUser, formationPlace);
    }

    private getPlace(formation: S11Formation, json: JsonTransferAction): S11FormationPlace {
        const line = formation.getLine(json.lineNumber);
        return line.getPlace(json.placeNumber);
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


