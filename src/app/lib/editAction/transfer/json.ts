import { JsonEditAction } from '../json';


export interface JsonTransfer extends JsonEditAction {
    outWithTeam: boolean;
}