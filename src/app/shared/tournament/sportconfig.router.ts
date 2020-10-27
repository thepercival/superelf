import { SportConfigTabOrder } from './sportconfigtaborder';
import { RoundNumber, Game } from 'ngx-sport';
import { Tournament } from '../../lib/pool';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class SportConfigRouter {
    private adminUrl = '/admin';

    constructor(
        private router: Router
    ) {
    }

    navigate(tournament: Tournament, tabOrder?: SportConfigTabOrder, roundNumber?: RoundNumber) {
        let url = this.adminUrl + '/sportconfig';
        let params: any[] = [tournament.getId()];
        const competition = tournament.getCompetition();
        if (competition.hasMultipleSportConfigs()) {
            params.push(roundNumber.getNumber());
        } else {
            const sportConfig = competition.getFirstSportConfig();
            params.push(sportConfig.getId());
            params.push(tabOrder ? tabOrder : SportConfigTabOrder.Fields);
            if (tabOrder === SportConfigTabOrder.Score) {
                params.push(roundNumber.getNumber());
            }
        }
        this.router.navigate([url].concat(params));
    }
}