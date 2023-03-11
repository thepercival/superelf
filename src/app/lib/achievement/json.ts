import { JsonPoolUser } from '../pool/user/json';

export interface JsonAchievement {
    poolUser: JsonPoolUser,
    rank: number,
    created: string
}

