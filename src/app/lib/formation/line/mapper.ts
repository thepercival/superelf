import { Injectable } from '@angular/core';
import { Formation } from '../../formation';
import { ViewPeriod } from '../../period/view';
import { JsonS11Player } from '../../player/json';
import { S11PlayerMapper } from '../../player/mapper';
import { FormationLine } from '../line';
import { JsonFormationLine } from './json';


@Injectable()
export class FormationLineMapper {
    constructor(protected playerMapper: S11PlayerMapper) { }

    toObject(json: JsonFormationLine, formation: Formation, viewPeriod: ViewPeriod): FormationLine {
        const formationLine = new FormationLine(formation, json.number, json.maxNrOfPersons);
        json.players.forEach((jsonPlayer: JsonS11Player) => {
            formationLine.getPlayers().push(this.playerMapper.toObject(jsonPlayer, viewPeriod));
        });
        if (json.substitute) {
            formationLine.setSubstitute(this.playerMapper.toObject(json.substitute, viewPeriod));
        }
        return formationLine;
    }

    toJson(formationLine: FormationLine): JsonFormationLine {
        const substitute = formationLine.getSubstitute();
        return {
            number: formationLine.getNumber(),
            players: formationLine.getPlayers().map(person => this.playerMapper.toJson(person)),
            maxNrOfPersons: formationLine.getMaxNrOfPersons(),
            substitute: substitute ? this.playerMapper.toJson(substitute) : undefined,
            substitutions: formationLine.getSubstitutions()
        };
    }
}


