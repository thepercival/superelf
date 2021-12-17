import { Injectable } from '@angular/core';
import { Competition } from 'ngx-sport';
import { GameRoundMapper } from '../../gameRound/mapper';
import { ViewPeriod } from '../view';
import { JsonViewPeriod } from './json';

@Injectable({
    providedIn: 'root'
})
export class ViewPeriodMapper {
    constructor(protected gameRoundMapper: GameRoundMapper) { }

    toObject(json: JsonViewPeriod, sourceCompetition: Competition): ViewPeriod {
        const viewPeriod = new ViewPeriod(sourceCompetition, new Date(json.start), new Date(json.end));
        viewPeriod.setId(json.id);
        json.gameRounds.forEach(jsonGameRound => this.gameRoundMapper.toObject(jsonGameRound, viewPeriod));
        return viewPeriod;
    }
}


