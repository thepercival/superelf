import { Injectable } from '@angular/core';
import { Association, PersonMapper, PlayerMapper } from 'ngx-sport';
import { TransferPeriodActionList } from '../editAction';
import { S11Formation } from '../formation';
import { S11FormationPlace } from '../formation/place';
import { JsonTransferPeriod } from '../periods/transferPeriod/json';
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

    toReplacement(
        json: JsonReplacement, 
        poolUser: PoolUser,
        association: Association): Replacement 
    {
        const jsonPersonIn = json.playerIn.person;
        if( jsonPersonIn === undefined) {
            throw new Error('person can not be empty');
        }
        const jsonPersonOut = json.playerOut.person;
        if( jsonPersonOut === undefined) {
            throw new Error('person can not be empty');
        }
        const personIn = this.personMapper.toObject(jsonPersonIn, association);
        const playerIn = this.playerMapper.toObject(json.playerIn, association, personIn);
        const personOut = this.personMapper.toObject(jsonPersonOut, association);
        const playerOut = this.playerMapper.toObject(json.playerOut, association, personOut);
        const replacement = new Replacement(poolUser, json.lineNumberOut, json.placeNumberOut, playerIn, playerOut, new Date(json.createdDate));
        replacement.setId(json.id);
        return replacement;
    }

    toTransfer(json: JsonTransfer, poolUser: PoolUser, association: Association): Transfer {        
        const jsonPersonIn = json.playerIn.person;
        if( jsonPersonIn === undefined) {
            throw new Error('person can not be empty');
        }
        const jsonPersonOut = json.playerOut.person;
        if( jsonPersonOut === undefined) {
            throw new Error('person can not be empty');
        }
        const personIn = this.personMapper.toObject(jsonPersonIn, association);
        const playerIn = this.playerMapper.toObject(json.playerIn, association, personIn);
        const personOut = this.personMapper.toObject(jsonPersonOut, association);
        const playerOut = this.playerMapper.toObject(json.playerOut, association, personOut);
        const transfer = new Transfer(poolUser, json.lineNumberOut, json.placeNumberOut, playerIn, playerOut, new Date(json.createdDate));
        transfer.setId(json.id);
        return transfer;
    }

    toSubstitution(json: JsonSubstitution, poolUser: PoolUser): Substitution {
        const substitution = new Substitution(poolUser, json.lineNumberOut, json.placeNumberOut, new Date(json.createdDate));
        substitution.setId(json.id);
        return substitution;
    }

    // private getPlace(formation: S11Formation, json: JsonTransferAction): S11FormationPlace {
    //     const line = formation.getLine(json.lineNumber);
    //     return line.getPlace(json.placeNumber);
    // }

    toJsonTransfer(transfer: Transfer): JsonTransfer {
        return {
            id: transfer.getId(),
            lineNumberOut: transfer.getLineNumberOut(),
            placeNumberOut: transfer.getPlaceNumberOut(),
            playerIn: this.playerMapper.toJson(transfer.getPlayerIn()),
            playerOut: this.playerMapper.toJson(transfer.getPlayerOut()),
            createdDate: transfer.getCreatedDate().toISOString()
        };
    }
}


