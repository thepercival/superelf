import { JsonIdentifiable } from 'ngx-sport';
import { JsonUser } from '../user/mapper';

export interface JsonChatMessage extends JsonIdentifiable {

    user: JsonUser,
    date: string,
    message: string
}

