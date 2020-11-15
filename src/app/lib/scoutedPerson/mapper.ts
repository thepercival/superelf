import { Injectable } from '@angular/core';
import { Association, PersonMapper } from 'ngx-sport';
import { ScoreUnit } from '../scoreUnit';
import { ScoutedPerson } from '../scoutedPerson';
import { JsonScoutedPerson } from './json';

@Injectable()
export class ScoutedPersonMapper {
    constructor(protected personMapper: PersonMapper) { }

    toObject(json: JsonScoutedPerson, association: Association): ScoutedPerson {
        const scoutedPerson = new ScoutedPerson(this.personMapper.toObject(json.person, association, undefined), json.nrOfStars);
        scoutedPerson.setId(json.id);
        return scoutedPerson;
    }

    toJson(scoreUnit: ScoreUnit): number {
        return scoreUnit.getNumber();
    }
}


