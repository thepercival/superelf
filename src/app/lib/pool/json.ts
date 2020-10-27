import { JsonCompetition } from 'ngx-sport';
import { JsonPoolCompetitor } from '../competitor/json';

export interface JsonPool {
    id?: number;
    competition: JsonCompetition;
    public: boolean;
    competitors: JsonPoolCompetitor[];
}