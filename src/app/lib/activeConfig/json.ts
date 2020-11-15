
export interface JsonActiveConfig {
    createAndJoinStart: string;
    createAndJoinEnd: string;
    availableFormations: JsonFormationShell[];
    sourceCompetitions: JsonCompetitionShell[];
}

export interface JsonCompetitionShell {
    id: string | number;
    name: string;
}

export interface JsonFormationShell {
    name: string;
    lines: JsonFormationLineMap;
}

export interface JsonFormationLineMap {
    [key: number]: number;
}