import { Injectable } from '@angular/core';

import { User } from '../user';

@Injectable({
    providedIn: 'root'
})
export class UserMapper {
    protected static users: UserMap = {};
    constructor() { }

    toObject(json: JsonUser): User {
        let user = UserMapper.users[json.id];
        if (user === undefined) {
            user = new User(json.id);
            UserMapper.users[user.getId()] = user;
        }
        if (json.emailaddress !== undefined) {
            user.setEmailaddress(json.emailaddress);
        }

        if (json.name !== undefined) {
            user.setName(json.name);
        }
        return user;
    }

    toJson(user: User): JsonUser {
        return {
            id: user.getId(),
            emailaddress: user.getEmailaddress(),
            name: user.getName()
        };
    }
}

export interface JsonUser {
    id: number;
    emailaddress?: string;
    name?: string;
}

interface UserMap {
    [key: number]: User;
}
