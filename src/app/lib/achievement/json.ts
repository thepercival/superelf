import { JsonPoolUser } from '../pool/user/json';

export interface JsonAchievement {
    poolUser: JsonPoolUser,
    poolId: number | undefined;
    rank: number,
    created: string
}

