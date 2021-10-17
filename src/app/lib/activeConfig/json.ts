import { JsonFormation } from "ngx-sport";

export interface JsonActiveConfig {
    createAndJoinStart: string;
    createAndJoinEnd: string;
    availableFormations: JsonFormation[];
    sourceCompetitions: JsonCompetitionShell[];
}

export interface JsonCompetitionShell {
    id: string | number;
    name: string;
}
