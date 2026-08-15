import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgainstGame, AgainstSide, Structure } from 'ngx-sport';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { GameRound } from '../../lib/gameRound';
import { CompetitionConfig } from '../../lib/competitionConfig';
import { GameRoundGetter } from '../../lib/gameRound/gameRoundGetter';
import { GameRoundRepository } from '../../lib/gameRound/repository';
import { SourceAgainstGamesGetter } from '../../lib/gameRound/sourceAgainstGamesGetter';
import { GameRepository } from '../../lib/ngx-sport/game/repository';
import { AgainstGameMissingPlayer } from '../../lib/ngx-sport/game/football';
import { StructureRepository } from '../../lib/ngx-sport/structure/repository';
import { S11Player } from '../../lib/player';
import { ViewPeriod } from '../../lib/periods/viewPeriod';
import { StatisticsGetter } from '../../lib/statistics/getter';
import { StatisticsRepository } from '../../lib/statistics/repository';
import { TeamFinder } from '../../lib/teamFinder';
import { PlayerStateGame, PlayerStateModalComponent } from './playerstate.modal.component';

@Injectable({ providedIn: 'root' })
export class PlayerStateModalService {
  private readonly gameRoundGetter: GameRoundGetter;
  private readonly sourceGamesGetter: SourceAgainstGamesGetter;

  constructor(
    gameRoundRepository: GameRoundRepository,
    private readonly structureRepository: StructureRepository,
    private readonly gameRepository: GameRepository,
    private readonly statisticsRepository: StatisticsRepository,
    private readonly modalService: NgbModal
  ) {
    this.gameRoundGetter = new GameRoundGetter(gameRoundRepository);
    this.sourceGamesGetter = new SourceAgainstGamesGetter(gameRepository);
  }

  open(
    s11Player: S11Player,
    competitionConfig: CompetitionConfig,
    viewPeriod: ViewPeriod,
    gameRoundNumber: number
  ): Observable<void> {
    const statisticsGetter = new StatisticsGetter();
    return forkJoin({
      structure: this.structureRepository.getObject(competitionConfig.getSourceCompetition()),
      gameRounds: this.gameRoundGetter.getGameRounds(competitionConfig, viewPeriod),
      statistics: this.statisticsRepository.getPlayerObjects(s11Player, statisticsGetter)
    }).pipe(
      switchMap(({ structure, gameRounds }) => this.getStateGames(
        structure,
        gameRounds,
        gameRoundNumber,
        s11Player,
        competitionConfig,
        statisticsGetter
      )),
      map((games: PlayerStateGame[]) => {
        const modalRef = this.modalService.open(PlayerStateModalComponent, { scrollable: true });
        modalRef.componentInstance.s11Player = s11Player;
        modalRef.componentInstance.scorePointsMap = competitionConfig.getScorePointsMap();
        modalRef.componentInstance.gameRoundNumber = gameRoundNumber;
        modalRef.componentInstance.games = games;
      })
    );
  }

  private getStateGames(
    structure: Structure,
    gameRounds: GameRound[],
    gameRoundNumber: number,
    s11Player: S11Player,
    competitionConfig: CompetitionConfig,
    statisticsGetter: StatisticsGetter
  ): Observable<PlayerStateGame[]> {
    const selectedIndex = gameRounds.findIndex((gameRound) => gameRound.number === gameRoundNumber);
    if (selectedIndex < 0) {
      throw new Error(`speelronde ${gameRoundNumber} is niet gevonden`);
    }
    const selectedGameRounds = gameRounds.slice(
      Math.max(0, selectedIndex - 2),
      selectedIndex + 3
    );
    const poule = structure.getSingleCategory().getRootRound().getFirstPoule();
    const teamFinder = new TeamFinder(
      competitionConfig.getSourceCompetition().getTeamCompetitors()
    );

    return forkJoin(selectedGameRounds.map((gameRound) =>
      this.sourceGamesGetter.getGameRoundGames(poule, gameRound).pipe(
        map((games) => ({
          gameRound,
          game: this.findGame(games, s11Player, teamFinder)
        }))
      )
    )).pipe(
      switchMap((roundGames) => {
        const games = roundGames.filter(
          (roundGame): roundGame is { gameRound: GameRound; game: AgainstGame } =>
            roundGame.game !== undefined
        );
        if (games.length === 0) {
          return of([]);
        }
        return forkJoin(games.map(({ gameRound, game }) =>
          this.gameRepository.getSourceObjectMissingPlayers(game).pipe(
            map((missingPlayers: AgainstGameMissingPlayer[]): PlayerStateGame => {
              const statistics = statisticsGetter.getStatistics(s11Player, gameRound.number);
              return {
                gameRound,
                game,
                missingPlayer: this.findMissingPlayer(missingPlayers, s11Player),
                statistics,
                hasAppeared: statistics?.hasAppeared() ?? false
              };
            })
          )
        ));
      }),
      map((games) => games.sort((gameA, gameB) =>
        gameA.game.getStartDateTime().getTime() - gameB.game.getStartDateTime().getTime()
      ))
    );
  }

  private findGame(
    games: AgainstGame[],
    s11Player: S11Player,
    teamFinder: TeamFinder
  ): AgainstGame | undefined {
    return games.find((game) => {
      const homeTeam = teamFinder.findTeam(game, AgainstSide.Home);
      if (homeTeam && s11Player.getPlayer(homeTeam, game.getStartDateTime())) {
        return true;
      }
      const awayTeam = teamFinder.findTeam(game, AgainstSide.Away);
      return awayTeam !== undefined &&
        s11Player.getPlayer(awayTeam, game.getStartDateTime()) !== undefined;
    });
  }

  private findMissingPlayer(
    missingPlayers: AgainstGameMissingPlayer[],
    s11Player: S11Player
  ): AgainstGameMissingPlayer | undefined {
    const personId = s11Player.getPerson().getId();
    return missingPlayers.find(
      (missingPlayer) => missingPlayer.player.getPerson().getId() === personId
    );
  }
}