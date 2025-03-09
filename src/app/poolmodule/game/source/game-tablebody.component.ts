import { Component, EventEmitter, OnInit, Output, input, model } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AgainstGame, AgainstGamePlace, AgainstSide, Competitor, CompetitorBase, GameState, NameService, SportRoundRankingItem, StartLocation, StartLocationMap, StructureNameService, Team, TeamCompetitor } from 'ngx-sport';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { DateFormatter } from '../../../lib/dateFormatter';
import { TeamNameComponent } from '../../team/name.component';
import { NgClass, NgIf, NgTemplateOutlet } from '@angular/common';
import { SuperElfNameService } from '../../../lib/nameservice';
import { LineIconComponent } from '../../../shared/commonmodule/lineicon/lineicon.component';
import { S11FormationPlace } from '../../../lib/formation/place';
import { S11Player } from '../../../lib/player';
import { Pool } from '../../../lib/pool';
import { S11FormationMap } from '../../allinonegame/allinonegame.component';
import { GameRound } from '../../../lib/gameRound';
import { PoolCompetitor } from '../../../lib/pool/competitor';
import { PoolUser } from '../../../lib/pool/user';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { S11PlayerModalComponent } from '../../player/info.modal.component';
import { SportExtensions } from '../../../lib/sportExtensions';
import { CompetitionConfig } from '../../../lib/competitionConfig';
import { ActiveGameRoundsCalculator } from '../../../lib/gameRound/activeGameRoundsCalculator';

@Component({
  selector: "tbody[s11-game-tablerow]",
  standalone: true,
  imports: [
    FontAwesomeModule,
    NgIf,
    NgClass,
    NgTemplateOutlet,
    LineIconComponent,
  ],
  templateUrl: "./game-tablebody.component.html",
  styleUrls: ["./game-tablebody.component.scss"],
})
export class GameTableRowComponent implements OnInit {
  public readonly againstGame = input.required<AgainstGame>();
  public readonly competitonConfig = input.required<CompetitionConfig>();
  public readonly gameRound = input.required<GameRound>();
  public readonly formationMap = input.required<S11FormationMap>();
  public readonly sportRankingItems = input.required<SportRoundRankingItem[]>();
  public readonly poolUsersStartLocationMap =
    input.required<StartLocationMap>();

  private teamsStartLocationMap: StartLocationMap | undefined;

  // kleurtje bij de speler wanneer deze goed scoort

  constructor(
    private modalService: NgbModal,
    public sportExtensions: SportExtensions,
    public dateFormatter: DateFormatter,
    public s11NameService: SuperElfNameService
  ) {}

  get Finished(): GameState {
    return GameState.Finished;
  }
  get HomeSide(): AgainstSide {
    return AgainstSide.Home;
  }
  get AwaySide(): AgainstSide {
    return AgainstSide.Away;
  }

  ngOnInit() {
    // this.games().slice().every((game: AgainstGame): boolean => {
    //   if( game.getState() !== GameState.Finished ) {
    //     return false;
    //   }
    //   this.games().shift()
    //   this.games().push(game);
    //   return true;
    // });
  }

  public getFormationPlaces(
    side: AgainstSide,
    sportRankingItem: SportRoundRankingItem
  ): S11FormationPlace[] {
    const poolUser = this.getPoolUser(sportRankingItem);
    if (poolUser === undefined) {
      return [];
    }
    const formation = this.formationMap().get(+poolUser.getId());
    const team = this.getTeam(this.againstGame().getSidePlaces(side));
    if (formation === undefined || team === undefined) {
      return [];
    }
    return formation
      .getPlaces()
      .filter((formationPlace: S11FormationPlace): boolean => {
        return formationPlace.getPlayer()?.getPlayer(team) !== undefined;
      });
  }

  getPoolUser(sportRankingItem: SportRoundRankingItem): PoolUser {
    // console.log(sportRankingItem, this.startLocationMap);
    const startLocation = sportRankingItem
      .getPerformance()
      .getPlace()
      .getStartLocation();
    if (startLocation === undefined) {
      throw new Error("could not find pooluser");
    }
    const competitor = <PoolCompetitor>(
      this.poolUsersStartLocationMap().getCompetitor(startLocation)
    );
    const poolUser = competitor?.getPoolUser();
    if (poolUser === undefined) {
      throw new Error("could not find pooluser");
    }
    return poolUser;
  }

  isTeamCompetitor(sideCompetitor: Competitor | undefined): boolean {
    return sideCompetitor instanceof TeamCompetitor;
  }

  isCompetitor(sideCompetitor: Competitor | undefined): boolean {
    return sideCompetitor instanceof CompetitorBase;
  }

  protected getTeam(sideGamePlaces: AgainstGamePlace[]): Team | undefined {
    const teams = sideGamePlaces.map(
      (againstGamePlace: AgainstGamePlace): Team | undefined => {
        const startLocation = againstGamePlace.getPlace().getStartLocation();
        if (startLocation === undefined) {
          return undefined;
        }
        const competitor = this.getTeamCompetitor(startLocation);
        return competitor?.getTeam();
      }
    );
    return teams.find((team: Team | undefined): boolean => team !== undefined);
  }

  private getTeamCompetitor(
    teamStartLocation: StartLocation
  ): TeamCompetitor | undefined {
    if (this.teamsStartLocationMap === undefined) {
      const teamCompetitors = this.againstGame()
        .getPoule()
        .getCompetition()
        .getTeamCompetitors();
      this.teamsStartLocationMap = new StartLocationMap(teamCompetitors);
    }
    const competitor =
      this.teamsStartLocationMap.getCompetitor(teamStartLocation);
    return this.convertToTeamCompetitor(competitor);
  }

  convertToTeamCompetitor(
    sideCompetitor: Competitor | undefined
  ): TeamCompetitor | undefined {
    if (this.isTeamCompetitor(sideCompetitor)) {
      return <TeamCompetitor>sideCompetitor;
    }
    return undefined;
  }

  // maak hier een modal van
  openPlayerModal(s11Player: S11Player): void {
    const activeModal = this.modalService.open(S11PlayerModalComponent);
    activeModal.componentInstance.s11Player = s11Player;
    activeModal.componentInstance.currentGameRound = this.gameRound();
    activeModal.result.then(
      () => {},
      (reason) => {}
    );

    // const gameRound = this.currentGameRound?.getNumber() ?? 0;
    // this.router.navigate(
    //   ["/pool/player/", pool.getId(), s11Player.getId(), gameRound] , {
    //   state: { s11Player, "pool": this.pool, currentGameRound: undefined }
    // }
    // );
  }

  getRouterLink(
    sportRankingItem: SportRoundRankingItem,
    gameRound: GameRound | undefined
  ): (string | number)[] {
    const poolUser = this.getPoolUser(sportRankingItem);
    if (poolUser == undefined) {
      throw new Error("could not find pooluser");
    }

    return [
      "/pool/user",
      poolUser.getPool().getId(),
      poolUser.getId(),
      this.gameRound().number,
    ];
  }
}
