import { Injectable } from '@angular/core';

import { Pool } from '../../pool';
import { PoolInvitation } from '../invitation';

@Injectable()
export class PoolInvitationMapper {
    constructor() { }

    toObject(json: JsonPoolInvitation, pool: Pool): PoolInvitation {
        const invitation = new PoolInvitation(pool, json.emailaddress);
        invitation.setId(json.id);
        return invitation;
    }

    toJson(invitation: PoolInvitation): JsonPoolInvitation {
        return {
            id: invitation.getId(),
            emailaddress: invitation.getEmailaddress()
        };
    }
}

export interface JsonPoolInvitation {
    id?: number;
    emailaddress: string;
}
