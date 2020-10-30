import { JsonCompetitor } from 'ngx-sport';
import { JsonUser } from '../user/mapper';

export interface JsonPoolCompetitor extends JsonCompetitor {
    admin: boolean;
    user: JsonUser;
    supercup: boolean;
}