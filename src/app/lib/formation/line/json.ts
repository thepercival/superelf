import { JsonS11Player } from '../../player/json';
import { JsonS11FormationPlace } from '../place/json';

export interface JsonS11FormationLine {
    number: number;
    places: JsonS11FormationPlace[];
    // substitutionAppearances: Map<number, boolean>;    
}