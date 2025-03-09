import { Injectable } from '@angular/core';
import { Competition } from 'ngx-sport';
import { S11Formation } from '../../formation';
import { ViewPeriod } from '../../periods/viewPeriod';
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

    toObject(json: JsonS11FormationLine, formation: S11Formation, competition: Competition, viewPeriod: ViewPeriod): S11FormationLine {
        const formationLine = new S11FormationLine(formation, json.number, this.getAppearanceMap(json.substituteAppearances));
        json.places.forEach((jsonPlace: JsonS11FormationPlace) => {
            this.placeMapper.toObject(jsonPlace, formationLine, competition, viewPeriod);
        });
        return formationLine;
    }

    protected getAppearanceMap(appearances: number[]): Map<number, boolean> {
        const map = new Map();
        const stats = new Map<number, boolean>();
        for (let i = 0; i < appearances.length; i++) {
            map.set(appearances[i], true);
        }
        return map;
    }

    toJson(formationLine: S11FormationLine): JsonS11FormationLine {
        const substitute = formationLine.getSubstitute();
        return {
            number: formationLine.getNumber(),
            places: formationLine.getPlaces().map(place => this.placeMapper.toJson(place)),
            substituteAppearances: []
        };
    }
}


