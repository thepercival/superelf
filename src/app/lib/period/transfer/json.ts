import { JsonPeriod } from 'ngx-sport';
import { JsonViewPeriod } from '../view/json';

export interface JsonTransferPeriod extends JsonPeriod {
    viewPeriod: JsonViewPeriod;
    maxNrOfTransfers: number;
}