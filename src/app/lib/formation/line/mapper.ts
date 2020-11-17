import { Injectable } from '@angular/core';
import { Association, PersonMapper } from 'ngx-sport';
import { Formation } from '../../formation';
import { FormationLine } from '../line';
import { JsonFormationLine } from './json';


@Injectable()
export class FormationLineMapper {
    constructor(protected personMapper: PersonMapper) { }

    toObject(json: JsonFormationLine, formation: Formation, association: Association): FormationLine {
        const formationLine = new FormationLine(formation, json.number, json.maxNrOfPersons);

        json.persons.forEach(jsonPerson => this.personMapper.toObject(jsonPerson, association));
        if (json.substitute) {
            formationLine.setSubstitute(this.personMapper.toObject(json.substitute, association));
        }
        return formationLine;
    }

    // toJson(formationLine: FormationLine): JsonFormationLine {
    //     return {
    //         number: formationLine.getNumber(),
    //         maxNrOfPersons: formationLine.getNrOfPersons()
    //     };
    // }
}


