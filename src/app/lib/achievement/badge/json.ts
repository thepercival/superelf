import { JsonCompetition } from 'ngx-sport';
import { JsonAchievement } from '../json';
import { BadgeCategory } from './category';

export interface JsonBadge extends JsonAchievement {
    category: BadgeCategory,
    competition: JsonCompetition|undefined
}

