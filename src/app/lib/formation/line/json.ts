import { FootballLine } from 'ngx-sport';
import { JsonS11FormationPlace } from '../place/json';

export interface JsonS11FormationLine {
    number: FootballLine;
    places: JsonS11FormationPlace[];
    // substitutionAppearances: Map<number, boolean>;    
}