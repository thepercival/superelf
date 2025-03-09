import { Injectable } from '@angular/core';
import { Competition } from 'ngx-sport';
import { CompetitionConfig } from '../../competitionConfig';
import { GameRoundMapper } from '../../gameRound/mapper';
import { ViewPeriod } from '../viewPeriod';
import { JsonViewPeriod } from './json';

@Injectable({
    providedIn: 'root'
})
export class ViewPeriodMapper {
    constructor(protected gameRoundMapper: GameRoundMapper) { }

    toObject(json: JsonViewPeriod): ViewPeriod {
        const viewPeriod = new ViewPeriod(new Date(json.start), new Date(json.end));
        viewPeriod.setId(json.id);
        json.gameRounds.forEach(jsonGameRound => this.gameRoundMapper.toObject(jsonGameRound, viewPeriod));
        return viewPeriod;
    }
}


