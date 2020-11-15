import { JsonPeriod } from 'ngx-sport';
import { JsonPoolViewPeriod } from '../view/json';

export interface JsonPoolEditPeriod extends JsonPeriod {
    viewPeriod: JsonPoolViewPeriod;
}