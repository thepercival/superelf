import { JsonCompetitor } from 'ngx-sport';

export interface JsonPoolCompetitor extends JsonCompetitor {
    competitionId: string | number;
}