import { JsonPerson } from 'ngx-sport';


export interface JsonEditAction {
    id: number;
    personOut: JsonPerson;
    personIn: JsonPerson;
}