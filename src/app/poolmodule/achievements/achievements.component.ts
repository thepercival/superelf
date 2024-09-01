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
import { Competition, Season } from 'ngx-sport';
import { UserBadgesModalComponent } from './userbadges-modal.component';
@Component({
  selector: 'app-pool-achievements',
  templateUrl: './achievements.component.html',
  styleUrls: ['./achievements.component.scss']
})
export class AchievementsComponent extends PoolComponent implements OnInit {
  public achievementListItems: AchievementListItem[] | undefined;
  public processing = true;
  public leagueName!: LeagueName;
  public goatToggle = false;
  public goatPoints: GoatPoints;

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
    this.goatPoints = {
      competitionTrophy: 15,
      cupTrophy: 8,
      supercupTrophy: 5,
      badge: 1
    }
    // this.form = fb.group({
    //   message: '',
    // });
  }

  ngOnInit() {
    super.parentNgOnInit().subscribe((pool: Pool) => {
      this.setPool(pool);
      this.setLeagueName(pool.getCompetitions());

      this.achievementRepository.getPoolCollection(pool.getCollection()).subscribe({
        next: (achievements: (Trophy | Badge)[]) => {
          achievements.sort((achievement1: Trophy | Badge, achievement2: Trophy | Badge) => {
            return achievement1.seasonShortName >= achievement2.seasonShortName ? 1 : -1;
          });
          this.achievementListItems = this.mapToAchievementListItems(achievements);
          this.processing = false;
        },
      });

      this.poolUserRepository.getObjectFromSession(pool).subscribe({
        next: ((poolUser: PoolUser) => {
          this.poolUserFromSession = poolUser;
          this.achievementRepository.getUnviewedObjects(poolUser.getPool()).subscribe({
            next: (achievements: (Trophy | Badge)[]) => {
              if (achievements.length > 0) {
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

  private mapToAchievementListItems(achievements: (Badge | Trophy)[]): AchievementListItem[] {
    const map = new Map<string | number, AchievementListItem>();
    achievements.forEach((achievement: Badge | Trophy) => {
      let item = map.get(achievement.poolUser.user.id);
      if (item === undefined) {
        item = {
          name: achievement.poolUser.user.name ?? '',
          leagueTrophies: new Map(),
          badges: [],
          isGoat: false,
          goatTotalPoints: 0
        };
        item.leagueTrophies.set(LeagueName.Competition, []);
        item.leagueTrophies.set(LeagueName.Cup, []);
        item.leagueTrophies.set(LeagueName.SuperCup, []);

        map.set(achievement.poolUser.user.id, item);
      }
      
      if (achievement instanceof Trophy) {
        const leagueName = achievement.getCompetition().getLeague().getName();
        item.goatTotalPoints += this.getLeagueGoatPoints(leagueName);

        const trophies = item.leagueTrophies.get(leagueName);
        if (trophies !== undefined) {
          trophies.push(achievement);
          item.leagueTrophies.set(leagueName, trophies);
        }
      }
      else {
        item.badges.push(achievement);
        item.goatTotalPoints++;
      }
    })

    const list: AchievementListItem[] = [];
    for (const [propertyKey, achievementListItem] of map.entries()) {
      list.push(achievementListItem);
    }

    list.sort((item1: AchievementListItem, item2: AchievementListItem) => {
      return item1.goatTotalPoints < item2.goatTotalPoints ? 1 : -1;
    });
    list[0].isGoat = true;
    return list;
  }

  getLeagueGoatPoints(leagueName: string): number {
    if (LeagueName.Competition == leagueName) {
      return this.goatPoints.competitionTrophy;
    } else if (LeagueName.Cup == leagueName) {
      return this.goatPoints.cupTrophy;
    } if (LeagueName.SuperCup == leagueName) {
      return this.goatPoints.supercupTrophy;
    }
    return 0;
  }

  openUnviewedModal(achievements: (Trophy | Badge)[]) {
    const modalRef = this.modalService.open(UnviewedAchievementsModalComponent, { backdrop: 'static' });
    modalRef.componentInstance.achievements = achievements;
    modalRef.result.then((result) => {

    }, (reason) => {

    });
  }

  openLinkNewTab(trophy: Trophy, leagueName: string) {

    const season = trophy.getCompetition().getSeason();
    if (season.getStartDateTime().getTime() < new Date('2022-01-01').getTime()) {
      // old env
      let suffix
      const oldPoolId = this.convertToOldPoolId(season.getStartDateTime());
      if( oldPoolId === undefined ) {
        return;
      }      
      if (leagueName === LeagueName.Competition) {        
        suffix = 'pool/stand/poolid/' + oldPoolId + '/';
      } else if (leagueName === LeagueName.Cup) {
        suffix = 'pool/beker/poolid/' + oldPoolId + '/';
      } else if (leagueName === LeagueName.SuperCup) {
        suffix = 'pool/supercup/poolid/' + oldPoolId + '/';
      }
      // window.open('//localhost:8000/' + suffix, '_blank');
      window.open('//old.superelf-eredivisie.nl/' + suffix, '_blank');
    } else {
      let url      
      if (leagueName === LeagueName.Competition) {
        url = 'pool/competition/' + trophy.poolId + '';
      } else if (leagueName === LeagueName.Cup) {
        url = 'pool/cup/' + trophy.poolId + '';
      } else if (leagueName === LeagueName.SuperCup) {
        url = 'pool/poule-againstgames/' + trophy.poolId + '/SuperCup/0';
      }
      window.open(url, '_blank');
    }
  }

  private convertToOldPoolId(seasonStartDateTime: Date): number|undefined {
    console.log(this.pool.getName());
    if( this.pool.getName() === 'kamp duim') {
      if (seasonStartDateTime.getFullYear() === 2014) {
        return 1;
      } else if (seasonStartDateTime.getFullYear() === 2015) {
        return 2;
      } else if (seasonStartDateTime.getFullYear() === 2016) {
        return 3;
      } else if (seasonStartDateTime.getFullYear() === 2017) {
        return 8;
      } else if (seasonStartDateTime.getFullYear() === 2018) {
        return 10;
      } else if (seasonStartDateTime.getFullYear() === 2020) {
        return 37;
      } else if (seasonStartDateTime.getFullYear() === 2021) {
        return 44;
      }
    } else if (this.pool.getName() === 'Deerns') {
      if (seasonStartDateTime.getFullYear() === 2020) {
        return 39;
      } else if (seasonStartDateTime.getFullYear() === 2021) {
        return 50;
      }
    } else if (this.pool.getName() === 'Arriva') {
      if (seasonStartDateTime.getFullYear() === 2020) {
        return 40;
      } else if (seasonStartDateTime.getFullYear() === 2021) {
        return 45;
      }
    }
    return undefined;
  }

  openUserBadgesInfoModal(achievementListItem: AchievementListItem) {
    const modalRef = this.modalService.open(UserBadgesModalComponent);
    modalRef.componentInstance.userName = achievementListItem.name;
    modalRef.componentInstance.badges = achievementListItem.badges;
    modalRef.result.then((result) => {

    }, (reason) => {

    });
  }


  toggleGoat() {
    this.goatToggle = !this.goatToggle;
  }


  navigateBack() {
    this.myNavigation.back();
  }
}

interface AchievementListItem {
  name: string
  leagueTrophies: Map<string, Trophy[]>
  badges: Badge[]
  isGoat: boolean
  goatTotalPoints: number
}

interface GoatPoints {
  competitionTrophy: number
  cupTrophy: number
  supercupTrophy: number
  badge: number
}