import { AgainstGame, Competition, Player, StartLocationMap, Team, TeamCompetitor, TeamMap } from "ngx-sport";
import { GameRound } from "../gameRound";
import { S11Player } from "../player";

export class GamePicker {

    constructor(protected sourceCompetition: Competition, protected gameRound: GameRound) {
    }

    public getGame(s11Player: S11Player): AgainstGame | undefined {
        const players = s11Player.getPlayers();
        const teamMap = this.getTeamMap(players);
        const teamCompetitors = this.getTeamCompetitors(teamMap);
        const startLocationMap = new StartLocationMap(teamCompetitors);

        return this.gameRound.getAgainstGames().find((againstGame: AgainstGame): boolean => {
            return players.some((player: Player): boolean => {
                if (!player.isIn(againstGame.getStartDateTime())) {
                    return false;
                }
                return againstGame.hasCompetitor(startLocationMap);
            });
        });
    }

    protected getTeamMap(players: Player[]): TeamMap {
        const map = new TeamMap();
        players.map((player: Player): Team => player.getTeam())
            .forEach((team: Team) => map.set(+team.getId(), team));
        return map;
    }

    protected getTeamCompetitors(teamMap: TeamMap): TeamCompetitor[] {
        const teamCompetitors = this.sourceCompetition.getTeamCompetitors();
        return teamCompetitors.filter((teamCompetitor: TeamCompetitor): boolean => {
            return teamMap.has(+teamCompetitor.getTeam().getId());
        });
    }
}