import { Injectable } from '@angular/core';

import { Sponsor } from '../sponsor';
import { Tournament } from '../pool';

/**
 * Created by coen on 10-10-17.
 */
@Injectable()
export class SponsorMapper {
    constructor() { }

    toObject(json: JsonSponsor, tournament: Tournament, sponsor?: Sponsor): Sponsor {
        if (sponsor === undefined) {
            sponsor = new Sponsor(tournament, json.name);
        }
        sponsor.setId(json.id);
        sponsor.setUrl(json.url);
        sponsor.setLogoUrl(json.logoUrl);
        sponsor.setScreenNr(json.screenNr);
        return sponsor;
    }

    toJson(sponsor: Sponsor): JsonSponsor {
        return {
            id: sponsor.getId(),
            name: sponsor.getName(),
            url: sponsor.getUrl(),
            logoUrl: sponsor.getLogoUrl(),
            screenNr: sponsor.getScreenNr()
        };
    }
}

export interface JsonSponsor {
    id?: number;
    name: string;
    url?: string;
    logoUrl?: string;
    screenNr?: number;
}
