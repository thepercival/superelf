import { JsonPeriod } from 'ngx-sport';
import { JsonPoolViewPeriod } from '../view/json';

export interface JsonPoolTransferPeriod extends JsonPeriod {
    viewPeriod: JsonPoolViewPeriod;
    maxNrOfTransfers: number;
}