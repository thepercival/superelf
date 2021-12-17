import { Injectable } from '@angular/core';
import { ViewPeriod } from '../period/view';
import { S11PlayerMapper } from '../player/mapper';
import { ScoreUnit } from '../scoreUnit';
import { ScoutedPlayer } from '../scoutedPlayer';
import { JsonScoutedPlayer } from './json';

@Injectable({
    providedIn: 'root'
})
export class ScoutedPlayerMapper {
    constructor(protected s11PlayerMapper: S11PlayerMapper) { }

    toObject(json: JsonScoutedPlayer, viewPeriod: ViewPeriod): ScoutedPlayer {
        const scoutedPlayer = new ScoutedPlayer(this.s11PlayerMapper.toObject(json.s11Player, viewPeriod), json.nrOfStars);
        scoutedPlayer.setId(json.id);
        return scoutedPlayer;
    }

    toJson(scoreUnit: ScoreUnit): number {
        return scoreUnit.getNumber();
    }
}


