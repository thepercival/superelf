import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { APIRepository } from '../repository';
import { Player, Team } from 'ngx-sport';


@Injectable()
export class ImageRepository extends APIRepository {

    constructor() {
        super();
    }

    getTeamUrl(team: Team): string {
        return super.getApiUrl() + 'images/teams/' + team.getId() + '.png';
    }

    getPlayerUrl(player: Player): string {
        return super.getApiUrl() + 'images/players/' + player.getId() + '.png';
    }
}
