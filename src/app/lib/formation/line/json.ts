import { JsonPerson } from 'ngx-sport';

export interface JsonFormationLine {
    number: number;
    persons: JsonPerson[];
    substitute: JsonPerson;
    maxNrOfPersons: number
}