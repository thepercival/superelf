import { JsonPerson } from 'ngx-sport';
import {  JsonTransferAction } from '../json';

export interface JsonTransfer extends JsonTransferAction{
    personIn: JsonPerson;
}