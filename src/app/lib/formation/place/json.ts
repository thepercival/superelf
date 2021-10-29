import { JsonIdentifiable } from 'ngx-sport';
import { JsonS11Player } from '../../player/json';

export interface JsonS11FormationPlace extends JsonIdentifiable {
    number: number;
    penaltyPoints: number;
    player: JsonS11Player | undefined;
}