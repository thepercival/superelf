import { JsonFormationLine } from './line/json';

export interface JsonFormation {
    id: number;
    name: string;
    lines: JsonFormationLine[];
}