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

  
  get Achievements(): NavBarItem { return NavBarItem.Achievements }
  get Competition(): LeagueName { return LeagueName.Competition; }
  get Cup(): LeagueName { return LeagueName.Cup; }
  get SuperCup(): LeagueName { return LeagueName.SuperCup; }
  get WorldCup(): LeagueName { return LeagueName.WorldCup; }

  setLeagueName(competitions: Competition[]): void {
    const hasWorldCup = false /*competitions.some((competition: Competition): boolean => {
      return competition.getLeague().getName() === LeagueName.WorldCup;
    })*/;
    this.leagueName = hasWorldCup ? LeagueName.WorldCup : LeagueName.Competition;
  }
  
  private mapToAchievementListItems(achievements: (Badge|Trophy)[]): AchievementListItem[] {
    const map = new Map<string|number, AchievementListItem>();
    achievements.forEach((achievement: Badge|Trophy) => {
      let item = map.get(achievement.poolUser.user.id);
      if( item === undefined) {
        item = {
          name: achievement.poolUser.user.name ?? '',
          leagueNrOfTrophies: new Map(            ),
          nrOfBadges: 0
        };
        item.leagueNrOfTrophies.set(LeagueName.Competition, 0);
        item.leagueNrOfTrophies.set(LeagueName.Cup, 0);
        item.leagueNrOfTrophies.set(LeagueName.SuperCup, 0);
        map.set(achievement.poolUser.user.id, item);        
      } 
      if (achievement instanceof Trophy ) {
        const leagueName = achievement.getCompetition().getLeague().getName();
        const nrOfTropthies = item.leagueNrOfTrophies.get(leagueName);
        if (nrOfTropthies !== undefined) {
          item.leagueNrOfTrophies.set(leagueName, nrOfTropthies + 1);
        }
      }
      else {        
        item.nrOfBadges += achievement instanceof Badge ? 1: 0;
      }
    })

    const list: AchievementListItem[] = [];
    for (const [propertyKey, propertyValue] of map.entries()) {
      list.push(propertyValue);
    }

    list.sort((item1: AchievementListItem, item2: AchievementListItem) => {
      const nrOfCompetitionTrohies1 = item1.leagueNrOfTrophies.get(LeagueName.Competition) ?? 0;
      const nrOfCompetitionTrohies2 = item2.leagueNrOfTrophies.get(LeagueName.Competition) ?? 0;
      if (nrOfCompetitionTrohies1 !== nrOfCompetitionTrohies2) {
        return nrOfCompetitionTrohies1 < nrOfCompetitionTrohies2 ? 1 : -1;
      }
      const nrOfCupTrohies1 = item1.leagueNrOfTrophies.get(LeagueName.Cup) ?? 0;
      const nrOfCupTrohies2 = item2.leagueNrOfTrophies.get(LeagueName.Cup) ?? 0;
      if (nrOfCupTrohies1 !== nrOfCupTrohies2) {
        return nrOfCupTrohies1 < nrOfCupTrohies2 ? 1 : -1;
      }
      const nrOfSuperCupTrohies1 = item1.leagueNrOfTrophies.get(LeagueName.SuperCup) ?? 0;
      const nrOfSuperCupTrohies2 = item2.leagueNrOfTrophies.get(LeagueName.SuperCup) ?? 0;
      if (nrOfSuperCupTrohies1 !== nrOfSuperCupTrohies2) {
        return nrOfSuperCupTrohies1 < nrOfSuperCupTrohies2 ? 1 : -1;
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
  leagueNrOfTrophies: Map<string, number>;
  nrOfBadges: number
}
