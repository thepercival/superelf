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
  selector: 'app-pool-trophies',
  templateUrl: './trophies.component.html',
  styleUrls: ['./trophies.component.scss']
})
export class TrophiesComponent extends PoolComponent implements OnInit {
  // public gameRounds: GameRound[] = [];
  // public currentGameRound: GameRound | undefined;
  // public sourceGameRoundGames: AgainstGame[] = [];
  // public currentSourceGame: AgainstGame | undefined;
  // private startLocationMap!: StartLocationMap;
  // form: UntypedFormGroup;

  public processing = true;
  // public leagueName!: LeagueName;
  // public poolPoule: Poule | undefined;
  // public processingMessage = false;
  // public chatMessages: ChatMessage[] | undefined;
  // public processingPoolUsers = true;
  // public processingGames = true;
  // public poolUsers!: PoolUser[];
  // private sourceStructure!: Structure;
  // public sportRankingItems!: SportRoundRankingItem[];

  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    globalEventsManager: GlobalEventsManager,
    // private structureRepository: StructureRepository,
    // private poolUserRepository: PoolUserRepository,
    // private chatMessageRepository: ChatMessageRepository,
    // public nameService: SuperElfNameService,
    // private dateFormatter: DateFormatter,
    // public imageRepository: ImageRepository,
    // public cssService: CSSService,
    private myNavigation: MyNavigation
    ) {
    super(route, router, poolRepository, globalEventsManager);
    // this.form = fb.group({
    //   message: '',
    // });
  }

  ngOnInit() {
    super.parentNgOnInit().subscribe((pool: Pool) => {
      this.setPool(pool);
      this.processing = false;
      // this.poolUserRepository.getObjects(pool).subscribe((poolUsers: PoolUser[]) => {
      //   this.poolUsers = poolUsers;

      //   this.route.params.subscribe((params: Params) => {
      //     this.leagueName = params.leagueName;

      //     // begin met het ophalen van de wedstrijden van de poolcompetitie 
      //     const competition = this.pool.getCompetition(this.leagueName);
      //     if (competition === undefined) {
      //       this.processing = false;
      //       throw Error('competition not found');
      //     }

      //     this.structureRepository.getObject(competition).subscribe({
      //       next: (structure: Structure) => {

      //         const round = structure.getSingleCategory().getRootRound();
      //         const poule = round.getFirstPoule();
      //         this.poolPoule = poule;

      //         // this.poolStartLocationMap = new StartLocationMap(poolCompetitors);
      //         // const gameRoundNumbers: number[] = poule.getAgainstGames().map((game: AgainstGame) => game.getGameRoundNumber());
      //         // const currentGameRoundNumber = this.getCurrentSourceGameRoundNumber(poule);

      //         const competitionSport = this.pool.getCompetitionSport(this.leagueName);
      //         const rankingCalculator = new AgainstSportRoundRankingCalculator(competitionSport, [GameState.Finished]);
      //         this.sportRankingItems = rankingCalculator.getItemsForPoule(poule);

      //         this.chatMessageRepository.getObjects(poule, pool).subscribe({
      //           next: (chatMessages: ChatMessage[]) => {
      //             this.chatMessages = chatMessages;
      //             this.processing = false;
      //           }
      //         });

      //         // this.initCurrentGameRound(competitionConfig, currentViewPeriod);
      //       },
      //       error: (e: string) => { this.setAlert('danger', e); this.processing = false; }
      //     });
      //   });
      // });
    });
  }


  navigateBack() {
    this.myNavigation.back();
  }
}
