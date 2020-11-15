import { JsonPerson } from 'ngx-sport';

export interface JsonScoutedPerson {
    id: number;
    person: JsonPerson;
    nrOfStars: number;
}