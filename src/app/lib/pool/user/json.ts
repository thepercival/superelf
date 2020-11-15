import { JsonPoolCompetitor } from '../competitor/json';
import { JsonUser } from '../../user/mapper';
import { JsonFormation } from '../../formation/json';

export interface JsonPoolUser {
    id: number;
    user: JsonUser;
    admin: boolean;
    competitors: JsonPoolCompetitor[];
    assembleFormation?: JsonFormation;
    transferFormation?: JsonFormation;
}