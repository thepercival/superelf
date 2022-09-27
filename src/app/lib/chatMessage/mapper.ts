import { Injectable } from '@angular/core';
import { ChatMessage } from '../chatMessage';
import { PoolUser } from '../pool/user';
import { JsonChatMessage } from './json';

@Injectable({
    providedIn: 'root'
})
export class ChatMessageMapper {
    constructor() { }

    toObject(json: JsonChatMessage, poolUsers: PoolUser[]): ChatMessage {
        const poolUser = poolUsers.find((poolUser: PoolUser): boolean => poolUser.getUser().getId() === json.user.id);
        if (poolUser === undefined) {
            throw new Error('unknown pooluser');
        }
        return new ChatMessage(poolUser.getUser(), new Date(json.date), json.message);
    }


}


