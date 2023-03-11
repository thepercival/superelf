import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgainstGame, AgainstGamePlace, AgainstSide, AgainstSportRoundRankingCalculator, Competition, CompetitionSport, Competitor, CompetitorBase, GameState, Poule, SportRoundRankingItem, StartLocationMap, Structure, Team, TeamCompetitor } from 'ngx-sport';
import { Observable } from 'rxjs';
import { Achievement } from '../../lib/achievement';
import { Badge } from '../../lib/achievement/badge';
import { AchievementRepository } from '../../lib/achievement/repository';
import { Trophy } from '../../lib/achievement/trophy';
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
import { JsonPoolUser } from '../../lib/pool/user/json';
import { PoolUserRepository } from '../../lib/pool/user/repository';
import { S11Storage } from '../../lib/storage';
import { CSSService } from '../../shared/commonmodule/cssservice';
import { GlobalEventsManager } from '../../shared/commonmodule/eventmanager';
import { MyNavigation } from '../../shared/commonmodule/navigation';
import { PoolComponent } from '../../shared/poolmodule/component';
import { NavBarItem } from '../../shared/poolmodule/poolNavBar/items';
import { UnviewedAchievementsModalComponent } from './unviewed-modal.component';

@Component({
  selector: 'app-pool-achievements',
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.scss']
})
export class AchievementsComponent extends PoolComponent implements OnInit {
  // public gameRounds: GameRound[] = [];
  // public currentGameRound: GameRound | undefined;
  // public sourceGameRoundGames: AgainstGame[] = [];
  // public currentSourceGame: AgainstGame | undefined;
  // private startLocationMap!: StartLocationMap;
  // form: UntypedFormGroup;
  public achievementListItems: AchievementListItem[]|undefined;
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
    private modalService: NgbModal,
    private poolUserRepository: PoolUserRepository,
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

      this.achievementRepository.getPoolCollection(pool.getCollection()).subscribe({
        next: (achievements: (Trophy|Badge)[]) => {
          this.achievementListItems = this.mapToAchievementListItems(achievements);
          this.processing = false;
        },
      });

      this.poolUserRepository.getObjectFromSession(pool).subscribe({
        next: ((poolUser: PoolUser) => {
          this.achievementRepository.getUnviewedObjects(poolUser).subscribe({
            next: (achievements: (Trophy|Badge)[]) => {
              if( achievements.length > 0 ) {
                this.achievementRepository.removeUnviewedObjects(poolUser).subscribe({});
                this.openUnviewedModal(achievements);                
                this.s11Storage.setLatest(pool, new Date(), false);
              }
            },
          });
        }),
        error: (e: string) => {
          this.setAlert('danger', e); this.processing = false;
        },
        complete: () => this.processing = false
      });
    });
  }

  get Achievements(): NavBarItem { return NavBarItem.Achievements }

  private mapToAchievementListItems(achievements: (Badge|Trophy)[]): AchievementListItem[] {
    const map = new Map<string|number, AchievementListItem>();
    achievements.forEach((achievement: Badge|Trophy) => {
      let item = map.get(achievement.poolUser.id);
      if( item === undefined) {
        item = {
          name: achievement.poolUser.user.name ?? '',
          nrOfTrophies: achievement instanceof Trophy ? 1: 0,
          nrOfBadges: achievement instanceof Badge ? 1: 0
        };
        map.set(achievement.poolUser.id, item);        
      } else {
        item.nrOfTrophies += achievement instanceof Trophy ? 1: 0;
        item.nrOfBadges += achievement instanceof Badge ? 1: 0;
      }
    })

    const list: AchievementListItem[] = [];
    for (const [propertyKey, propertyValue] of map.entries()) {
      list.push(propertyValue);
    }

    list.sort((item1: AchievementListItem, item2: AchievementListItem) => {
      if( item1.nrOfTrophies !== item2.nrOfTrophies) {
        return (item1.nrOfTrophies > item2.nrOfTrophies ? 1 : -1);
      }
      if( item1.nrOfBadges !== item2.nrOfBadges) {
        return (item1.nrOfBadges > item2.nrOfBadges ? 1 : -1);
      }
      return (item1.name > item2.name ? 1 : -1);
    });
    return list;
  }

  openUnviewedModal(achievements: (Trophy|Badge)[]) {
    const modalRef = this.modalService.open(UnviewedAchievementsModalComponent, { backdrop: 'static'});
    modalRef.componentInstance.achievements = achievements;
    modalRef.result.then((result) => {
      
    }, (reason) => {
      
    });
  }
 

  navigateBack() {
    this.myNavigation.back();
  }
}

interface AchievementListItem {
  name: string,
  nrOfTrophies: number,
  nrOfBadges: number
}
