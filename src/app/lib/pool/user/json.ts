import { JsonPoolCompetitor } from '../competitor/json';
import { JsonUser } from '../../user/mapper';
import { JsonSubstitution } from '../../editAction/substitution/json';
import { JsonTransfer } from '../../editAction/transfer/json';
import { JsonS11Formation } from '../../formation/json';

export interface JsonPoolUser {
    id: number;
    user: JsonUser;
    admin: boolean;
    competitors: JsonPoolCompetitor[];
    nrOfAssembled?: number;
    nrOfTransfersWithTeam?: number;
    transfers?: JsonTransfer[];
    substitutions?: JsonSubstitution[];
    assembleFormation?: JsonS11Formation;
    transferFormation?: JsonS11Formation;
}