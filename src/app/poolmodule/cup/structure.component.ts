import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PoolRepository } from '../../lib/pool/repository';
import { PoolComponent } from '../../shared/poolmodule/component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { PoolUser } from '../../lib/pool/user';
import { PoolUserRepository } from '../../lib/pool/user/repository';
import { Pool } from '../../lib/pool';
import { CompetitionSport, Poule, StartLocationMap, Structure, StructureEditor, StructureNameService } from 'ngx-sport';
import { LeagueName } from '../../lib/leagueName';
import { GlobalEventsManager } from '../../shared/commonmodule/eventmanager';
import { StructureRepository } from '../../lib/ngx-sport/structure/repository';
import { GameRound } from '../../lib/gameRound';
import { CurrentGameRoundNumbers, GameRoundRepository } from '../../lib/gameRound/repository';
import { CompetitionConfig } from '../../lib/competitionConfig';
import { ViewPeriod } from '../../lib/period/view';
import { AuthService } from '../../lib/auth/auth.service';
import { MyNavigation } from '../../shared/commonmodule/navigation';


@Component({
  selector: 'app-pool-cup',
  templateUrl: './structure.component.html',
  styleUrls: ['./structure.component.scss']
})
export class PoolCupComponent extends PoolComponent implements OnInit {

  poolUsers: PoolUser[] = [];
  private nrOfDaysToRemoveAfterAssemblePeriod = 6;

  public poule!: Poule;
  public competitionSport!: CompetitionSport;
  public startLocationMap!: StartLocationMap;
  protected structureNameService!: StructureNameService;
  public currentGameRound: GameRound | undefined;
  public gameRounds: GameRound[] = [];
  public leagueName = LeagueName.Cup


  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    globalEventsManager: GlobalEventsManager,
    protected structureEditor: StructureEditor,
    protected poolUserRepository: PoolUserRepository,
    protected structureRepository: StructureRepository,
    protected authService: AuthService,
    private gameRoundRepository: GameRoundRepository,
    private modalService: NgbModal,
    private myNavigation: MyNavigation) {
    super(route, router, poolRepository, globalEventsManager);

  }

  ngOnInit() {
    super.parentNgOnInit().subscribe({
      next: (pool: Pool) => {
        this.setPool(pool);
        if (pool.getAssemblePeriod().isIn()) {
          this.setAlert('info', 'vanaf de start tot ' + this.nrOfDaysToRemoveAfterAssemblePeriod + ' dagen erna zijn deelnemers te vewijderen');
        }
        const competitionConfig = this.pool.getCompetitionConfig();
        const currentViewPeriod = competitionConfig.getViewPeriodByDate(new Date());
        if (currentViewPeriod === undefined) {
          return;
        }
        this.gameRounds = this.pool.getAssembleViewPeriod().getGameRounds();
        this.poolUserRepository.getObjects(pool).subscribe({
          next: (poolUsers: PoolUser[]) => {
            this.poolUsers = poolUsers;

            const user = this.authService.getUser();
            this.poolUser = poolUsers.find((poolUser: PoolUser) => poolUser.getUser() === user);

            const competition = this.pool.getCompetition(this.leagueName);
            if (competition === undefined) {
              this.processing = false;
              throw Error('competitionSport not found');
            }

            this.structureRepository.getObject(competition).subscribe({
              next: (structure: Structure) => {

                // -----------  JE TOONT VOOR EEN BEPAALDE VIEWPERIODE -------------- //
                // DE GAMEROUNDS ZIJN DAN DE WEDSTRIJDEN EN DE POOLUSERS MET HUN PUNTEN PER GAMEROUND ZIJN DAN DE GAMEROUND-SCORE
                const poolCompetitors = this.pool.getCompetitors(this.leagueName);
                const round = structure.getSingleCategory().getRootRound();
                this.poule = round.getFirstPoule(); // ?? GET FROM BACKEND ?? this.pool.getCompetition(PoolCollection.League_Default).get;
                this.competitionSport = this.pool.getCompetitionSport(this.leagueName);
                this.startLocationMap = new StartLocationMap(poolCompetitors);
                this.structureNameService = new StructureNameService(this.startLocationMap);

                // gameRoundScores voor competitors of poolCompetitions
                // getGAMES!!

                this.initCurrentGameRound(competitionConfig, currentViewPeriod);
              },
              error: (e: string) => { this.setAlert('danger', e); this.processing = false; }
            });
          },
          error: (e: string) => { this.setAlert('danger', e); this.processing = false; }
        });
      },
      error: (e) => {
        this.setAlert('danger', e); this.processing = false;
      }
    });
  }

  initCurrentGameRound(competitionConfig: CompetitionConfig, viewPeriod: ViewPeriod): void {
    this.gameRoundRepository.getCurrentNumbers(competitionConfig, viewPeriod).subscribe({
      next: (currentGameRoundNumbers: CurrentGameRoundNumbers) => {
        let currentGameRound;
        if (currentGameRoundNumbers.lastFinishedOrInPorgress) {
          currentGameRound = viewPeriod.getGameRound(currentGameRoundNumbers.lastFinishedOrInPorgress);
        }
        this.currentGameRound = currentGameRound;
        if (this.currentGameRound !== undefined) {
          while (this.currentGameRound !== this.gameRounds[0]) {
            const gameRound = this.gameRounds.shift();
            if (gameRound !== undefined) {
              this.gameRounds.push(gameRound);
            }
          }
        }
        this.updateGameRound(currentGameRound);
      },
      error: (e: string) => { this.setAlert('danger', e); this.processing = false; },
      complete: () => this.processing = false
    });
  }

  updateGameRound(gameRound: GameRound | undefined): void {
    this.currentGameRound = gameRound;
  }

  navigateBack() {
    this.myNavigation.back();
  }

  navigateToPoule(poule: Poule): void {
    this.router.navigate(['/pool/poule', this.pool.getId(), this.leagueName, poule.getId()]);
  }
}
