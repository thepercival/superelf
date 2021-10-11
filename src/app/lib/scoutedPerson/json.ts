import { JsonIdentifiable, JsonPerson } from 'ngx-sport';

export interface JsonScoutedPerson extends JsonIdentifiable {
    person: JsonPerson;
    nrOfStars: number;
}