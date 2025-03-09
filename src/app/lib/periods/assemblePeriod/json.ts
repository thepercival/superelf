import { JsonPeriod } from 'ngx-sport';
import { JsonViewPeriod } from '../viewPeriod/json';

export interface JsonAssemblePeriod extends JsonPeriod {
    viewPeriod: JsonViewPeriod;
}