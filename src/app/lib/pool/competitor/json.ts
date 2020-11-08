import { JsonCompetitor } from 'ngx-sport';
import { JsonUser } from '../../user/mapper';

export interface JsonPoolCompetitor extends JsonCompetitor {
    competitionId: string | number;
}