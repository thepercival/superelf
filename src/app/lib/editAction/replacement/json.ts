import { JsonPerson } from 'ngx-sport';
import {  JsonTransferAction } from '../json';

export interface JsonReplacement extends JsonTransferAction{
    personIn: JsonPerson;
}