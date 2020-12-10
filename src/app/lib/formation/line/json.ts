import { JsonViewPeriodPerson } from '../../period/view/person/json';
import { JsonPoolUserViewPeriodPerson } from '../../pool/user/viewPeriodPerson/json';

export interface JsonFormationLine {
    number: number;
    viewPeriodPersons: JsonViewPeriodPerson[];
    substitute?: JsonPoolUserViewPeriodPerson;
    maxNrOfPersons: number
}