import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AgainstGame, AgainstGamePlace, AgainstSide, AgainstSportRoundRankingCalculator, Competition, CompetitionSport, Competitor, CompetitorBase, GameState, Poule, SportRoundRankingItem, StartLocationMap, Structure, Team, TeamCompetitor } from 'ngx-sport';
import { Observable } from 'rxjs';
import { ChatMessage } from '../../lib/chatMessage';
import { ChatMessageRepository } from '../../lib/chatMessage/repository';
import { DateFormatter } from '../../lib/dateFormatter';
import { ImageRepository } from '../../lib/image/repository';
import { LeagueName } from '../../lib/leagueName';
import { SuperElfNameService } from '../../lib/nameservice';
import { GameRepository } from '../../lib/ngx-sport/game/repository';
import { PlayerRepository } from '../../lib/ngx-sport/player/repository';
import { StructureRepository } from '../../lib/ngx-sport/structure/repository';
import { Pool } from '../../lib/pool';
import { PoolRepository } from '../../lib/pool/repository';
import { PoolUser } from '../../lib/pool/user';
import { PoolUserRepository } from '../../lib/pool/user/repository';
import { CSSService } from '../../shared/commonmodule/cssservice';
import { GlobalEventsManager } from '../../shared/commonmodule/eventmanager';
import { MyNavigation } from '../../shared/commonmodule/navigation';
import { PoolComponent } from '../../shared/poolmodule/component';

@Component({
  selector: 'app-pool-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class PoolChatComponent extends PoolComponent implements OnInit {
  // public gameRounds: GameRound[] = [];
  // public currentGameRound: GameRound | undefined;
  // public sourceGameRoundGames: AgainstGame[] = [];
  // public currentSourceGame: AgainstGame | undefined;
  // private startLocationMap!: StartLocationMap;
  form: UntypedFormGroup;

  public processing = true;
  public leagueName!: LeagueName;
  public poolPoule: Poule | undefined;
  public processingMessage = false;
  public chatMessages: ChatMessage[] | undefined;
  // public processingPoolUsers = true;
  // public processingGames = true;
  public poolUsers!: PoolUser[];
  // private sourceStructure!: Structure;
  public sportRankingItems!: SportRoundRankingItem[];

  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    globalEventsManager: GlobalEventsManager,
    private structureRepository: StructureRepository,
    private poolUserRepository: PoolUserRepository,
    private chatMessageRepository: ChatMessageRepository,
    public nameService: SuperElfNameService,
    private dateFormatter: DateFormatter,
    public imageRepository: ImageRepository,
    public cssService: CSSService,
    private myNavigation: MyNavigation,
    fb: UntypedFormBuilder) {
    super(route, router, poolRepository, globalEventsManager);
    this.form = fb.group({
      message: '',
    });
  }

  ngOnInit() {
    super.parentNgOnInit().subscribe((pool: Pool) => {
      this.setPool(pool);

      this.poolUserRepository.getObjects(pool).subscribe((poolUsers: PoolUser[]) => {
        this.poolUsers = poolUsers;

        this.route.params.subscribe((params: Params) => {
          this.leagueName = params.leagueName;

          // begin met het ophalen van de wedstrijden van de poolcompetitie 
          const competition = this.pool.getCompetition(this.leagueName);
          if (competition === undefined) {
            this.processing = false;
            throw Error('competition not found');
          }

          this.structureRepository.getObject(competition).subscribe({
            next: (structure: Structure) => {

              const round = structure.getSingleCategory().getRootRound();
              const poule = round.getFirstPoule();
              this.poolPoule = poule;

              // this.poolStartLocationMap = new StartLocationMap(poolCompetitors);
              // const gameRoundNumbers: number[] = poule.getAgainstGames().map((game: AgainstGame) => game.getGameRoundNumber());
              // const currentGameRoundNumber = this.getCurrentSourceGameRoundNumber(poule);

              const competitionSport = this.pool.getCompetitionSport(this.leagueName);
              const rankingCalculator = new AgainstSportRoundRankingCalculator(competitionSport, [GameState.Finished]);
              this.sportRankingItems = rankingCalculator.getItemsForPoule(poule);

              this.chatMessageRepository.getObjects(poule, pool).subscribe({
                next: (chatMessages: ChatMessage[]) => {
                  this.chatMessages = chatMessages;
                  this.processing = false;
                }
              });

              // this.initCurrentGameRound(competitionConfig, currentViewPeriod);
            },
            error: (e: string) => { this.setAlert('danger', e); this.processing = false; }
          });
        });
      });
    });
  }

  get HomeSide(): AgainstSide { return AgainstSide.Home; }
  get AwaySide(): AgainstSide { return AgainstSide.Away; }

  get CupOrSuperCup(): boolean { return this.leagueName === LeagueName.Cup || this.leagueName === LeagueName.SuperCup; }

  getMessageDate(date: Date): string {
    return this.dateFormatter.toString(date, this.dateFormatter.niceDateTime()) + ' uur';
  }

  sendMessage(poule: Poule): void {
    this.processingMessage = true;
    const message = this.form.controls.message.value;
    this.chatMessageRepository.createObject(message, poule, this.pool).subscribe({
      next: (chatMessage: ChatMessage) => {
        this.chatMessages?.unshift(chatMessage);
        this.form.controls.message.reset();
        this.processingMessage = false;
      },
      error: (e: string) => { this.setAlert('danger', e); this.processingMessage = false; }
    });
  }


  // getSourceStructure(competition: Competition): Observable<Structure> {
  //   // if (this.sourceStructure !== undefined) {
  //   //   return of(this.sourceStructure);
  //   // }
  //   return this.structureRepository.getObject(competition);
  // }

  // getDefaultGame(games: AgainstGame[]): AgainstGame {
  //   let game = games.find((game: AgainstGame) => game.getState() === GameState.Created);
  //   if (game !== undefined) {
  //     return game;
  //   }
  //   game = games.reverse()[0];
  //   if (game !== undefined) {
  //     return game;
  //   }
  //   throw new Error('no games could be found');
  // }

  // getGameRoundByNumber(gameRoundNumber: number): GameRound {
  //   const gameRound = this.gameRounds.find((gameRound: GameRound) => gameRound.getNumber() === gameRoundNumber);

  //   if (gameRound !== undefined) {
  //     return gameRound;
  //   }
  //   throw new Error('gameRound could not be found for number "' + gameRoundNumber + '"');
  // }

  // updateGameRound(gameRound: GameRound | undefined, gameId?: number | undefined): void {
  //   console.log(123);
  //   if (gameRound === undefined) {
  //     return;
  //   }

  //   this.processingGames = true;

  //   this.currentGameRound = gameRound;
  //   const poule = this.sourceStructure.getSingleCategory().getRootRound().getFirstPoule();

  //   if (gameRound.hasAgainstGames()) {
  //     this.updateSourceGame(this.getDefaultGame(gameRound.getAgainstGames()))
  //     this.processing = false;
  //     this.processingGames = false;
  //     return;
  //   }


  // }

  // updateSourceGame(sourceGame: AgainstGame): void {
  //   this.currentSourceGame = sourceGame;
  // }

  // isTeamCompetitor(sideCompetitor: Competitor | undefined): boolean {
  //   return sideCompetitor instanceof TeamCompetitor;
  // }

  // isCompetitor(sideCompetitor: Competitor | undefined): boolean {
  //   return sideCompetitor instanceof CompetitorBase;
  // }

  // getFormationPlaces(sourceGame: AgainstGame, side: AgainstSide, poolUser: PoolUser): S11FormationPlace[] {
  //   const editPeriod = this.getCurrentEditPeriod(poolUser.getPool());
  //   const formation = editPeriod ? poolUser.getFormation(editPeriod) : undefined;
  //   const team = this.getTeam(sourceGame.getSidePlaces(side));
  //   if (formation === undefined || team === undefined) {
  //     return [];
  //   }
  //   return formation.getPlaces().filter((formationPlace: S11FormationPlace): boolean => {
  //     return formationPlace.getPlayer()?.getPlayer(team) !== undefined;
  //   });
  // }
  // getPlace(sourceGame: AgainstGame, side: AgainstSide, poolUser: PoolUser): S11Player | undefined {
  //   const editPeriod = this.getCurrentEditPeriod(poolUser.getPool());
  //   const formation = editPeriod ? poolUser.getFormation(editPeriod) : undefined;
  //   const team = this.getTeam(sourceGame.getSidePlaces(side));
  //   return team ? formation?.getPlayer(team, sourceGame.getStartDateTime()) : undefined;
  // }

  // getPlayer(sourceGame: AgainstGame, side: AgainstSide, poolUser: PoolUser): S11Player | undefined {
  //   const editPeriod = this.getCurrentEditPeriod(poolUser.getPool());
  //   const formation = editPeriod ? poolUser.getFormation(editPeriod) : undefined;
  //   const team = this.getTeam(sourceGame.getSidePlaces(side));
  //   return team ? formation?.getPlayer(team, sourceGame.getStartDateTime()) : undefined;
  // }

  // protected getTeam(sideGamePlaces: AgainstGamePlace[]): Team | undefined {
  //   const teams = sideGamePlaces.map((againstGamePlace: AgainstGamePlace): Team | undefined => {
  //     const startLocation = againstGamePlace.getPlace().getStartLocation();
  //     if (startLocation === undefined) {
  //       return undefined;
  //     }
  //     const competitor = <TeamCompetitor>this.startLocationMap.getCompetitor(startLocation);
  //     return competitor?.getTeam();
  //   });
  //   return teams.find((team: Team | undefined): boolean => team !== undefined);
  // }

  navigateBack() {
    this.myNavigation.back();
  }
}
