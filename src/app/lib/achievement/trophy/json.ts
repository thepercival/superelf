import { JsonCompetition } from 'ngx-sport';
import { JsonAchievement } from '../json';

export interface JsonTrophy extends JsonAchievement {
    competition: JsonCompetition
}

