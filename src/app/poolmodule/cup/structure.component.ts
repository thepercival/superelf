import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PoolRepository } from '../../lib/pool/repository';
import { PoolComponent } from '../../shared/poolmodule/component';

import { PoolUser } from '../../lib/pool/user';
import { PoolUserRepository } from '../../lib/pool/user/repository';
import { Pool } from '../../lib/pool';
import { CompetitionSport, Poule, StartLocationMap, Structure, StructureEditor, StructureNameService } from 'ngx-sport';
import { LeagueName } from '../../lib/leagueName';
import { GlobalEventsManager } from '../../shared/commonmodule/eventmanager';
import { StructureRepository } from '../../lib/ngx-sport/structure/repository';
import { AuthService } from '../../lib/auth/auth.service';
import { MyNavigation } from '../../shared/commonmodule/navigation';
import { NavBarItem } from '../../shared/poolmodule/poolNavBar/items';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PoolCupRoundComponent } from './round.component';
import { PoolNavBarComponent } from '../../shared/poolmodule/poolNavBar/poolNavBar.component';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: "app-pool-cup",
  standalone: true,
  imports: [
    FontAwesomeModule,
    PoolCupRoundComponent,
    PoolNavBarComponent
  ],
  templateUrl: "./structure.component.html",
  styleUrls: ["./structure.component.scss"],
})
export class PoolCupComponent extends PoolComponent implements OnInit {
  poolUsers: PoolUser[] = [];

  public poule!: Poule;
  public competitionSport!: CompetitionSport;
  public startLocationMap!: StartLocationMap;
  protected structureNameService!: StructureNameService;
  
  public leagueName = LeagueName.Cup;
  public faSpinner = faSpinner;

  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    globalEventsManager: GlobalEventsManager,
    protected structureEditor: StructureEditor,
    protected poolUserRepository: PoolUserRepository,
    protected structureRepository: StructureRepository,
    protected authService: AuthService,
    private myNavigation: MyNavigation
  ) {
    super(route, router, poolRepository, globalEventsManager);
  }

  ngOnInit() {
    super.parentNgOnInit().subscribe({
      next: (pool: Pool) => {
        this.setPool(pool);
        const currentViewPeriod = pool.getCurrentViewPeriod();
        if (currentViewPeriod === undefined) {
          return;
        }
        const user = this.authService.getUser();

        this.poolUserRepository.getObjects(pool).subscribe({
          next: (poolUsers: PoolUser[]) => {
            this.poolUsers = poolUsers;
            this.poolUserFromSession = poolUsers.find(
              (poolUser: PoolUser) => poolUser.getUser() === user
            );

            if (pool.getCompetitions().length === 0) {              
              this.setAlert('danger', 'de competities zijn nog niet vrijgegeven');
              this.processing.set(false);
              return;
            }
            const competition = pool.getCompetition(this.leagueName);
            if (competition === undefined) {
              this.setAlert('danger', 'competitionSport not found');
              this.processing.set(false);
              return;
            }

            this.structureRepository.getObject(competition).subscribe({
              next: (structure: Structure) => {
                // -----------  JE TOONT VOOR EEN BEPAALDE VIEWPERIODE -------------- //
                // DE GAMEROUNDS ZIJN DAN DE WEDSTRIJDEN EN DE POOLUSERS MET HUN PUNTEN PER GAMEROUND ZIJN DAN DE GAMEROUND-SCORE
                const poolCompetitors = Pool.getCompetitors(poolUsers,this.leagueName);
                const round = structure.getSingleCategory().getRootRound();
                this.poule = round.getFirstPoule(); // ?? GET FROM BACKEND ?? this.pool.getCompetition(PoolCollection.League_Default).get;
                this.competitionSport = pool.getCompetitionSport(
                  this.leagueName
                );
                this.startLocationMap = new StartLocationMap(poolCompetitors);
                this.structureNameService = new StructureNameService(
                  this.startLocationMap
                );
                this.processing.set(false);
              },
              error: (e: string) => {
                this.setAlert("danger", e);
                this.processing.set(false);
              },
            });
          },
          error: (e: string) => {
            this.setAlert("danger", e);
            this.processing.set(false);
          },
        });
      },
      error: (e) => {
        this.setAlert("danger", e);
        this.processing.set(false);
      },
    });
  }

  get CupStructure(): NavBarItem {
    return NavBarItem.Cup;
  }

  navigateBack() {
    this.myNavigation.back();
  }

  navigateToPoule(pool: Pool, poule: Poule): void {
    this.router.navigate([
      "/pool/poule-againstgames",
      pool.getId(),
      this.leagueName,
      poule.getId(),
    ]);
  }
}
