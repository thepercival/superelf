import { Injectable } from '@angular/core';
import { Association, PersonMapper } from 'ngx-sport';
import { ScoreUnit } from '../scoreUnit';
import { ScoutedPerson } from '../scoutedPerson';
import { JsonScoutedPerson } from './json';

@Injectable()
export class ScoutedPersonMapper {
    constructor(protected personMapper: PersonMapper) { }

    toObject(json: JsonScoutedPerson, association: Association): ScoutedPerson {
        return new ScoutedPerson(this.personMapper.toObject(json.person, association, undefined), json.nrOfStars);
    }

    toJson(scoreUnit: ScoreUnit): number {
        return scoreUnit.getNumber();
    }
}


