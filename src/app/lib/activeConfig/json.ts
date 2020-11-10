import { JsonPeriod } from 'ngx-sport';

export interface JsonActiveConfig {
    createAndJoinStart: string;
    createAndJoinEnd: string;
    joinAndChoosePlayersStart: string;
    joinAndChoosePlayersEnd: string;
    sourceCompetitions: JsonCompetitionShell[];
}

export interface JsonCompetitionShell {
    id: string | number;
    name: string;
}