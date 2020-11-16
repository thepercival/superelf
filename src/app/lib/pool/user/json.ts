import { JsonPoolCompetitor } from '../competitor/json';
import { JsonUser } from '../../user/mapper';
import { JsonFormation } from '../../formation/json';
import { JsonSubstitution } from '../../editAction/substitution/json';
import { JsonTransfer } from '../../editAction/transfer/json';

export interface JsonPoolUser {
    id: number;
    user: JsonUser;
    admin: boolean;
    competitors: JsonPoolCompetitor[];
    nrOfAssembled?: number;
    nrOfTransfersWithTeam?: number;
    transfers?: JsonTransfer[];
    substitutions?: JsonSubstitution[];
    assembleFormation?: JsonFormation;
    transferFormation?: JsonFormation;
}