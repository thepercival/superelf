import { JsonPeriod } from 'ngx-sport';
import { JsonPoolViewPeriod } from '../view/json';

export interface JsonPoolAssemblePeriod extends JsonPeriod {
    viewPeriod: JsonPoolViewPeriod;
}