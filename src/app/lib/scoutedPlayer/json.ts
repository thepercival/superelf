import { JsonIdentifiable } from 'ngx-sport';
import { JsonS11Player } from '../player/json';

export interface JsonScoutedPlayer extends JsonIdentifiable {
    s11Player: JsonS11Player;
    nrOfStars: number;
}