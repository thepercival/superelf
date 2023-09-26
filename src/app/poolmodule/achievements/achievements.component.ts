import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Badge } from '../../lib/achievement/badge';
import { AchievementRepository } from '../../lib/achievement/repository';
import { Trophy } from '../../lib/achievement/trophy';
import { Pool } from '../../lib/pool';
import { PoolRepository } from '../../lib/pool/repository';
import { PoolUser } from '../../lib/pool/user';
import { PoolUserRepository } from '../../lib/pool/user/repository';
import { S11Storage } from '../../lib/storage';
import { GlobalEventsManager } from '../../shared/commonmodule/eventmanager';
import { MyNavigation } from '../../shared/commonmodule/navigation';
import { PoolComponent } from '../../shared/poolmodule/component';
import { NavBarItem } from '../../shared/poolmodule/poolNavBar/items';
import { UnviewedAchievementsModalComponent } from './unviewed-modal.component';
import { LeagueName } from '../../lib/leagueName';
import { Competition } from 'ngx-sport';

@Component({
  selector: 'app-pool-achievements',
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.scss']
})
export class AchievementsComponent extends PoolComponent implements OnInit {
  public achievementListItems: AchievementListItem[]|undefined;
  public processing = true;
  public leagueName!: LeagueName;
  
  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    globalEventsManager: GlobalEventsManager,
    private modalService: NgbModal,
    private poolUserRepository: PoolUserRepository,
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
      this.setLeagueName(pool.getCompetitions());

      this.achievementRepository.getPoolCollection(pool.getCollection()).subscribe({
        next: (achievements: (Trophy|Badge)[]) => {
          this.achievementListItems = this.mapToAchievementListItems(achievements);
          this.processing = false;
        },
      });

      this.poolUserRepository.getObjectFromSession(pool).subscribe({
        next: ((poolUser: PoolUser) => {
          this.poolUserFromSession = poolUser;
          this.achievementRepository.getUnviewedObjects(poolUser.getPool()).subscribe({
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

  get WorldCupLeagueName(): LeagueName { return LeagueName.WorldCup; }
  get Achievements(): NavBarItem { return NavBarItem.Achievements }

  setLeagueName(competitions: Competition[]): void {
    const hasWorldCup = competitions.some((competition: Competition): boolean => {
      return competition.getLeague().getName() === LeagueName.WorldCup;
    });
    this.leagueName = hasWorldCup ? LeagueName.WorldCup : LeagueName.Competition;
  }
  
  private mapToAchievementListItems(achievements: (Badge|Trophy)[]): AchievementListItem[] {
    const map = new Map<string|number, AchievementListItem>();
    achievements.forEach((achievement: Badge|Trophy) => {
      let item = map.get(achievement.poolUser.user.id);
      if( item === undefined) {
        item = {
          name: achievement.poolUser.user.name ?? '',
          nrOfTrophies: achievement instanceof Trophy ? 1: 0,
          nrOfBadges: achievement instanceof Badge ? 1: 0
        };
        map.set(achievement.poolUser.user.id, item);        
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
        return (item1.nrOfTrophies < item2.nrOfTrophies ? 1 : -1);
      }
      if( item1.nrOfBadges !== item2.nrOfBadges) {
        return (item1.nrOfBadges < item2.nrOfBadges ? 1 : -1);
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
