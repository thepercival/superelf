import { JsonPlayer } from 'ngx-sport';
import { JsonTransferAction } from '../json';

export interface JsonReplacement extends JsonTransferAction{
    playerIn: JsonPlayer; 
    playerOut: JsonPlayer;   
}