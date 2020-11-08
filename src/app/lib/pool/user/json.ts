import { JsonCompetitor } from 'ngx-sport';
import { JsonPoolCompetitor } from '../competitor/json';
import { JsonUser } from '../../user/mapper';

export interface JsonPoolUser {
    id?: number;
    user: JsonUser;
    admin: boolean;
    competitors: JsonPoolCompetitor[];
}