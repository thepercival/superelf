import { Injectable } from '@angular/core';

import { Tournament } from '../../pool';
import { TournamentInvitation } from '../invitation';

/**
 * Created by coen on 10-10-17.
 */
@Injectable()
export class TournamentInvitationMapper {
    constructor() { }

    toObject(json: JsonTournamentInvitation, tournament: Tournament): TournamentInvitation {
        const invitation = new TournamentInvitation(tournament, json.emailaddress, json.roles);
        invitation.setId(json.id);
        return invitation;
    }

    toJson(invitation: TournamentInvitation): JsonTournamentInvitation {
        return {
            id: invitation.getId(),
            emailaddress: invitation.getEmailaddress(),
            roles: invitation.getRoles()
        };
    }
}

export interface JsonTournamentInvitation {
    id?: number;
    emailaddress: string;
    roles: number;
}
