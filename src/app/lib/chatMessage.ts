import { Identifiable } from 'ngx-sport';
import { User } from './user';

export class ChatMessage extends Identifiable {

    constructor(
        protected user: User,
        protected date: Date,
        protected text: string
    ) {
        super();
    }

    public getUser(): User {
        return this.user;
    }

    public getDate(): Date {
        return this.date;
    }

    public getText(): string {
        return this.text;
    }
}

