import { JsonIdentifiable } from 'ngx-sport';
import { JsonS11FormationLine } from './line/json';

export interface JsonS11Formation extends JsonIdentifiable {
    lines: JsonS11FormationLine[];
}