import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Badge } from '../../lib/achievement/badge';
import { AchievementRepository } from '../../lib/achievement/repository';
import { Trophy } from '../../lib/achievement/trophy';
import { Pool } from '../../lib/pool';
import { PoolRepository } from '../../lib/pool/repository';
import { PoolUser } from '../../lib/pool/user';
import { S11Storage } from '../../lib/storage';
import { GlobalEventsManager } from '../../shared/commonmodule/eventmanager';
import { MyNavigation } from '../../shared/commonmodule/navigation';
import { PoolComponent } from '../../shared/poolmodule/component';
import { NavBarItem } from '../../shared/poolmodule/poolNavBar/items';

@Component({
  selector: 'app-pool-pooluser-achievements',
  templateUrl: './pooluser-achievements.component.html',
  styleUrls: ['./achievements-achievements.component.scss']
})
export class PoolUserAchievementsComponent extends PoolComponent implements OnInit {
  // public gameRounds: GameRound[] = [];
  // public currentGameRound: GameRound | undefined;
  // public sourceGameRoundGames: AgainstGame[] = [];
  // public currentSourceGame: AgainstGame | undefined;
  // private startLocationMap!: StartLocationMap;
  // form: UntypedFormGroup;
  public unviewedAchievements: (Trophy|Badge)[]|undefined;
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
    private myNavigation: MyNavigation,
    private achievementRepository: AchievementRepository,
    private s11Storage: S11Storage
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
  get Achievements(): NavBarItem { return NavBarItem.Achievements }

  private setUnviewedAchievements(poolUser: PoolUser): void {
      
    
    
  }

  navigateBack() {
    this.myNavigation.back();
  }
}
