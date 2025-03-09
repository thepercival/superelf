import { JsonPeriod } from 'ngx-sport';
import { JsonViewPeriod } from '../viewPeriod/json';

export interface JsonTransferPeriod extends JsonPeriod {
    viewPeriod: JsonViewPeriod;
    maxNrOfTransfers: number;
}