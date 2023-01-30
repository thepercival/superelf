import { JsonPoolCompetitor } from '../competitor/json';
import { JsonUser } from '../../user/mapper';
import { JsonSubstitution } from '../../editAction/substitution/json';
import { JsonTransfer } from '../../editAction/transfer/json';
import { JsonS11Formation } from '../../formation/json';
import { JsonReplacement } from '../../editAction/replacement/json';

export interface JsonPoolUser {
    id: number;
    user: JsonUser;
    admin: boolean;
    competitors: JsonPoolCompetitor[];
    nrOfAssembled?: number;
    nrOfTransfersWithTeam?: number;
    replacements?: JsonReplacement[];
    transfers?: JsonTransfer[];
    substitutions?: JsonSubstitution[];
    assembleFormation?: JsonS11Formation;
    transferFormation?: JsonS11Formation;
}