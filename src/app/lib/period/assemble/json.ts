import { JsonPeriod } from 'ngx-sport';
import { JsonViewPeriod } from '../view/json';

export interface JsonAssemblePeriod extends JsonPeriod {
    viewPeriod: JsonViewPeriod;
}