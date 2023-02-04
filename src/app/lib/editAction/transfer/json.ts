import { JsonPlayer } from 'ngx-sport';
import {  JsonTransferAction } from '../json';

export interface JsonTransfer extends JsonTransferAction{
    playerIn: JsonPlayer;
    playerOut: JsonPlayer;
}