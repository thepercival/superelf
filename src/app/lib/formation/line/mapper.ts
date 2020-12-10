import { Injectable } from '@angular/core';
import { Association, PersonMapper } from 'ngx-sport';
import { Formation } from '../../formation';
import { ViewPeriod } from '../../period/view';
import { ViewPeriodPersonMapper } from '../../period/view/person/mapper';
import { PoolUserViewPeriodPersonMapper } from '../../pool/user/viewPeriodPerson/mapper';
import { FormationLine } from '../line';
import { JsonFormationLine } from './json';


@Injectable()
export class FormationLineMapper {
    constructor(
        protected viewPeriodPersonMapper: ViewPeriodPersonMapper,
        protected poolUserViewPeriodPersonMapper: PoolUserViewPeriodPersonMapper) { }

    toObject(json: JsonFormationLine, formation: Formation, viewPeriod: ViewPeriod): FormationLine {
        const formationLine = new FormationLine(formation, json.number, json.maxNrOfPersons);
        json.viewPeriodPersons.forEach(jsonViewPeriodPerson => {
            const viewPeriodPerson = this.viewPeriodPersonMapper.toObject(jsonViewPeriodPerson, viewPeriod)
            formationLine.getViewPeriodPersons().push(viewPeriodPerson);
        });
        if (json.substitute) {
            formationLine.setSubstitute(this.poolUserViewPeriodPersonMapper.toObject(json.substitute, formation.getPoolUser(), viewPeriod));
        }
        return formationLine;
    }

    toJson(formationLine: FormationLine): JsonFormationLine {
        const substitute = formationLine.getSubstitute();
        return {
            number: formationLine.getNumber(),
            viewPeriodPersons: formationLine.getViewPeriodPersons().map(person => this.viewPeriodPersonMapper.toJson(person)),
            maxNrOfPersons: formationLine.getMaxNrOfPersons(),
            substitute: substitute ? this.poolUserViewPeriodPersonMapper.toJson(substitute) : undefined
        };
    }
}


