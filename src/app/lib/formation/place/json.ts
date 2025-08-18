import { JsonIdentifiable } from 'ngx-sport';
import { JsonS11Player } from '../../player/json';
import { JsonTotals } from '../../totals/json';

export interface JsonS11FormationPlace extends JsonIdentifiable {
    number: number;
    penaltyPoints: number;
    player: JsonS11Player | undefined;
    totals: JsonTotals;
    marketValue: number;
}