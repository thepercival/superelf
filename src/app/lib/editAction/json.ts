import { FootballLine, JsonPerson } from 'ngx-sport';


export interface JsonTransferAction {
    id: number;
    personIn: JsonPerson;
    lineNumber: FootballLine;
    placeNumber: number;
}