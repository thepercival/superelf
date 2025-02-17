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
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SuperElfIconComponent } from '../../shared/poolmodule/icon/icon.component';
import { PouleTitleComponent } from '../poule/title.component';
import { PoolNavBarComponent } from '../../shared/poolmodule/poolNavBar/poolNavBar.component';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { facSuperCup } from '../../shared/poolmodule/icons';
import { faListOl, faSpinner, faPaperPlane, faUserCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: "app-pool-chat",
  standalone: true,
  imports: [
    FontAwesomeModule,
    SuperElfIconComponent,
    PouleTitleComponent,
    PoolNavBarComponent,
    NgIf,
    NgTemplateOutlet
  ],
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.scss"],
})
export class PoolChatComponent extends PoolComponent implements OnInit {
  // public gameRounds: GameRound[] = [];
  // public currentGameRound: GameRound | undefined;
  // public sourceGameRoundGames: AgainstGame[] = [];
  // public currentSourceGame: AgainstGame | undefined;
  // private startLocationMap!: StartLocationMap;
  form: UntypedFormGroup;

  public leagueName!: LeagueName;
  public poolPoule: Poule | undefined;
  public processingMessage = false;
  public chatMessages: ChatMessage[] | undefined;
  // public processingPoolUsers = true;
  // public processingGames = true;
  public poolUsers!: PoolUser[];
  // private sourceStructure!: Structure;
  public sportRankingItems!: SportRoundRankingItem[];
  public facSuperCup = facSuperCup;
  public faListOl = faListOl;
  public faSpinner = faSpinner;
  public faPaperPlane = faPaperPlane;
  public faUserCircle = faUserCircle;

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
    fb: UntypedFormBuilder
  ) {
    super(route, router, poolRepository, globalEventsManager);
    this.form = fb.group({
      message: "",
    });
  }

  ngOnInit() {
    super.parentNgOnInit().subscribe((pool: Pool) => {
      this.setPool(pool);

      this.poolUserRepository
        .getObjects(pool)
        .subscribe((poolUsers: PoolUser[]) => {
          this.poolUsers = poolUsers;

          this.route.params.subscribe((params: Params) => {
            this.leagueName = params.leagueName;

            // begin met het ophalen van de wedstrijden van de poolcompetitie
            const competition = pool.getCompetition(this.leagueName);
            if (competition === undefined) {
              this.processing.set(false);
              throw Error("competition not found");
            }

            this.structureRepository.getObject(competition).subscribe({
              next: (structure: Structure) => {
                const round = structure.getSingleCategory().getRootRound();
                const poule: Poule =
                  this.structureRepository.getPouleFromPouleId(
                    round,
                    +params.pouleId
                  );
                this.poolPoule = poule;

                // this.poolStartLocationMap = new StartLocationMap(poolCompetitors);
                // const gameRoundNumbers: number[] = poule.getAgainstGames().map((game: AgainstGame) => game.getGameRoundNumber());
                // const currentGameRoundNumber = this.getCurrentSourceGameRoundNumber(poule);

                const competitionSport = pool.getCompetitionSport(
                  this.leagueName
                );
                const rankingCalculator =
                  new AgainstSportRoundRankingCalculator(competitionSport, [
                    GameState.Finished,
                  ]);
                this.sportRankingItems =
                  rankingCalculator.getItemsForPoule(poule);

                this.chatMessageRepository.getObjects(poule, pool).subscribe({
                  next: (chatMessages: ChatMessage[]) => {
                    this.chatMessages = chatMessages;
                    this.processing.set(false);
                  },
                });

                // this.initCurrentGameRound(competitionConfig, currentViewPeriod);
              },
              error: (e: string) => {
                this.setAlert("danger", e);
                this.processing.set(false);
              },
            });
          });
        });
    });
  }

  get HomeSide(): AgainstSide {
    return AgainstSide.Home;
  }
  get AwaySide(): AgainstSide {
    return AgainstSide.Away;
  }

  get CupOrSuperCup(): boolean {
    return (
      this.leagueName === LeagueName.Cup ||
      this.leagueName === LeagueName.SuperCup
    );
  }

  getMessageDate(date: Date): string {
    return (
      this.dateFormatter.toString(date, this.dateFormatter.niceDateTime()) +
      " uur"
    );
  }

  sendMessage(pool: Pool, poule: Poule): void {
    this.processingMessage = true;
    const message = this.form.controls.message.value;
    this.chatMessageRepository.createObject(message, poule, pool).subscribe({
      next: (chatMessage: ChatMessage) => {
        this.chatMessages?.unshift(chatMessage);
        this.form.controls.message.reset();
        this.processingMessage = false;
      },
      error: (e: string) => {
        this.setAlert("danger", e);
        this.processingMessage = false;
      },
    });
  }

  linkToPoolUser(poolUser: PoolUser): void {
    this.router.navigate([
      "/pool/user",
      poolUser.getPool().getId(),
      poolUser.getId(),
      0,
    ]);
  }

  navigateBack() {
    this.myNavigation.back();
  }
}
