import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

import { PoolRepository } from '../../lib/pool/repository';
import { PoolComponent } from '../../shared/poolmodule/component';
import { NameService, PersonMap, TeamMap, FootballLine } from 'ngx-sport';
import { PlayerRepository } from '../../lib/ngx-sport/player/repository';
import { NgbAlertModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ScoutedPlayerRepository } from '../../lib/scoutedPlayer/repository';
import { Pool } from '../../lib/pool';
import { PoolUserRepository } from '../../lib/pool/user/repository';
import { PoolUser } from '../../lib/pool/user';
import { FormationRepository } from '../../lib/formation/repository';
import { S11Player } from '../../lib/player';
import { OneTeamSimultaneous } from '../../lib/oneTeamSimultaneousService';
import { S11FormationPlace } from '../../lib/formation/place';
import { GlobalEventsManager } from '../../shared/commonmodule/eventmanager';
import { S11Formation } from '../../lib/formation';
import { StatisticsGetter } from '../../lib/statistics/getter';
import { NavBarItem } from '../../shared/poolmodule/poolNavBar/items';
import { PoolNavBarComponent } from '../../shared/poolmodule/poolNavBar/poolNavBar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormationLineAssembleComponent } from './line/assemble.component';

@Component({
  selector: "app-pool-assemble",
  standalone: true,
  imports: [
    PoolNavBarComponent,
    NgbAlertModule,
    FontAwesomeModule,
    FormationLineAssembleComponent,
  ],
  templateUrl: "./assemble.component.html",
  styleUrls: ["./assemble.component.scss"],
})
export class FormationAssembleComponent
  extends PoolComponent
  implements OnInit
{
  assembleFormation: S11Formation | undefined;
  nameService = new NameService();
  teamPersonMap = new PersonMap();
  selectedPlace: S11FormationPlace | undefined;
  selectedSearchLine: FootballLine | undefined;
  selectedTeamMap: TeamMap = new TeamMap();
  public oneTeamSimultaneous = new OneTeamSimultaneous();
  public statisticsGetter = new StatisticsGetter();

  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    globalEventsManager: GlobalEventsManager,
    protected playerRepository: PlayerRepository,
    protected scoutedPlayerRepository: ScoutedPlayerRepository,
    protected poolUserRepository: PoolUserRepository,
    protected formationRepository: FormationRepository,
    fb: UntypedFormBuilder,
    private modalService: NgbModal
  ) {
    super(route, router, poolRepository, globalEventsManager);
  }

  ngOnInit() {
    super.parentNgOnInit().subscribe({
      next: (pool: Pool) => {
        this.setPool(pool);
        this.poolUserRepository.getObjectFromSession(pool).subscribe({
          next: (poolUser: PoolUser) => {
            this.poolUserFromSession = poolUser;
            this.formationRepository
              .getObject(poolUser, pool.getAssembleViewPeriod())
              .subscribe({
                next: (formation: S11Formation) =>
                  (this.assembleFormation = formation),
                error: (e: string) => {
                  this.setAlert("danger", e);
                  this.processing = false;
                  this.router.navigate([
                    "/pool/formation/choose",
                    pool.getId(),
                  ]);
                },
                complete: () => (this.processing = false),
              });
          },
          error: (e: string) => {
            this.setAlert("danger", e);
            this.processing = false;
          },
          complete: () => (this.processing = false),
        });
      },
      error: (e) => {
        this.setAlert("danger", e);
        this.processing = false;
      },
    });
  }

  get MyTeam(): NavBarItem {
    return NavBarItem.MyTeam;
  }

  editPlace(pool: Pool, place: S11FormationPlace) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        line: place.getFormationLine().getNumber(),
        teamId: this.getTeamId(place),
      },
    };
    this.router.navigate(
      ["/pool/formation/place/edit/", pool.getId(), place.getId()],
      navigationExtras
    );
  }

  getTeamId(place: S11FormationPlace): number | undefined {
    return place.getPlayer()?.getLine() ?? undefined;
  }

  linkToPlayer(pool: Pool, s11Player: S11Player): void {
    this.router.navigate(
      ["/pool/player/", pool.getId(), s11Player.getId(), 0] /*, {
      state: { s11Player, "pool": this.pool, currentGameRound: undefined }
    }*/
    );
  }
}
