import { AgainstGame, CompetitorMap, Person, Player, Team, TeamCompetitor, TeamMap } from "ngx-sport";
import { GameRound } from "../gameRound";

export class GamePicker {

    constructor(protected gameRound: GameRound) {
    }

    public getGame(person: Person): AgainstGame | undefined {
        const players = person.getPlayers();
        const teamMap = this.getTeamMap(players);
        const teamCompetitors = this.getTeamCompetitors(teamMap);
        const competitorMap = new CompetitorMap(teamCompetitors);

        return this.gameRound.getAgainstGames().find((againstGame: AgainstGame): boolean => {
            return players.some((player: Player): boolean => {
                if (!player.isIn(againstGame.getStartDateTime())) {
                    return false;
                }
                return againstGame.hasCompetitor(competitorMap);
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
        const teamCompetitors = this.gameRound.getViewPeriod().getSourceCompetition().getTeamCompetitors();
        return teamCompetitors.filter((teamCompetitor: TeamCompetitor): boolean => {
            return teamMap.has(+teamCompetitor.getTeam().getId());
        });
    }
}