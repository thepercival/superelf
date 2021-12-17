import { Injectable } from '@angular/core';
import { S11Formation } from '../../formation';
import { ViewPeriod } from '../../period/view';
import { S11PlayerMapper } from '../../player/mapper';
import { S11FormationLine } from '../line';
import { JsonS11FormationPlace } from '../place/json';
import { FormationPlaceMapper } from '../place/mapper';
import { JsonS11FormationLine } from './json';

@Injectable({
    providedIn: 'root'
})
export class S11FormationLineMapper {
    constructor(protected placeMapper: FormationPlaceMapper, protected playerMapper: S11PlayerMapper) { }

    toObject(json: JsonS11FormationLine, formation: S11Formation, viewPeriod: ViewPeriod): S11FormationLine {
        const formationLine = new S11FormationLine(formation, json.number);
        json.places.forEach((jsonPlace: JsonS11FormationPlace) => {
            this.placeMapper.toObject(jsonPlace, formationLine, viewPeriod);
        });
        return formationLine;
    }

    toJson(formationLine: S11FormationLine): JsonS11FormationLine {
        const substitute = formationLine.getSubstitute();
        return {
            number: formationLine.getNumber(),
            places: formationLine.getPlaces().map(place => this.placeMapper.toJson(place))/*,
            substitute: substitute ? this.playerMapper.toJson(substitute) : undefined,
            substitutions: formationLine.getSubstitutions()*/
        };
    }
}


