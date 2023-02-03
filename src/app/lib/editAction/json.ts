import { FootballLine, JsonIdentifiable } from 'ngx-sport';

export interface JsonTransferAction extends JsonIdentifiable {
    lineNumberOut: FootballLine;
    placeNumberOut: number;
    createdDate: string;
}