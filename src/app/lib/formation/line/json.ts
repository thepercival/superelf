import { JsonS11Player } from '../../player/json';

export interface JsonFormationLine {
    number: number;
    players: JsonS11Player[];
    substitute?: JsonS11Player;
    substitutions: Map<number, boolean>;
    maxNrOfPersons: number
}