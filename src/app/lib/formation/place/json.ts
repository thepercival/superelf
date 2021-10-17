import { JsonS11Player } from '../../player/json';

export interface JsonS11FormationPlace {
    number: number;
    penaltyPoints: number;
    player: JsonS11Player | undefined;
}