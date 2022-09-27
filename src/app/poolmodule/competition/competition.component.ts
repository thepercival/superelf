import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PoolRepository } from '../../lib/pool/repository';
import { PoolComponent } from '../../shared/poolmodule/component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { PoolUser } from '../../lib/pool/user';
import { PoolUserRepository } from '../../lib/pool/user/repository';
import { Pool } from '../../lib/pool';
import { CompetitionSport, Poule, StartLocationMap, Structure, StructureEditor } from 'ngx-sport';
import { LeagueName } from '../../lib/leagueName';
import { GlobalEventsManager } from '../../shared/commonmodule/eventmanager';
import { StructureRepository } from '../../lib/ngx-sport/structure/repository';
import { GameRound } from '../../lib/gameRound';
import { CurrentGameRoundNumbers, GameRoundRepository } from '../../lib/gameRound/repository';
import { CompetitionConfig } from '../../lib/competitionConfig';
import { ViewPeriod } from '../../lib/period/view';
import { ChatMessageRepository } from '../../lib/chatMessage/repository';
import { AuthService } from '../../lib/auth/auth.service';


@Component({
  selector: 'app-pool-leagues-competition',
  templateUrl: './competition.component.html',
  styleUrls: ['./competition.component.scss']
})
export class PoolCompetitionComponent extends PoolComponent implements OnInit {

  poolUsers: PoolUser[] = [];
  private nrOfDaysToRemoveAfterAssemblePeriod = 6;

  public poule!: Poule;
  public leagueName = LeagueName.Competition;
  public competitionSport!: CompetitionSport;
  public startLocationMap!: StartLocationMap;
  public currentGameRound: GameRound | undefined;
  public gameRounds: GameRound[] = [];
  public nrOfUnreadMessages = 0;

  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    globalEventsManager: GlobalEventsManager,
    protected structureEditor: StructureEditor,
    protected poolUserRepository: PoolUserRepository,
    protected chatMessageRepository: ChatMessageRepository,
    protected structureRepository: StructureRepository,
    private gameRoundRepository: GameRoundRepository,
    private authService: AuthService,
    private modalService: NgbModal
  ) {
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
        const user = this.authService.getUser();
        this.gameRounds = this.pool.getAssembleViewPeriod().getGameRounds();
        this.poolUserRepository.getObjects(pool).subscribe({
          next: (poolUsers: PoolUser[]) => {
            this.poolUsers = poolUsers;
            this.poolUser = poolUsers.find((poolUser: PoolUser) => poolUser.getUser() === user);
            const competition = this.pool.getCompetition(this.leagueName);
            if (competition === undefined) {
              this.processing = false;
              throw Error('competitionSport not found');
            }

            this.structureRepository.getObject(competition).subscribe({
              next: (structure: Structure) => {

                const poolCompetitors = this.pool.getCompetitors(this.leagueName);
                const round = structure.getSingleCategory().getRootRound();
                this.poule = round.getFirstPoule(); // ?? GET FROM BACKEND ?? this.pool.getCompetition(PoolCollection.League_Default).get;
                this.competitionSport = this.pool.getCompetitionSport(this.leagueName);
                this.startLocationMap = new StartLocationMap(poolCompetitors);

                if (this.poolUser && this.poule) {
                  this.chatMessageRepository.getNrOfUnreadObjects(this.poule, pool).subscribe({
                    next: (nrOfUnreadMessages: number) => {
                      this.nrOfUnreadMessages = nrOfUnreadMessages;
                    }
                  });
                }

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

  navigateToChat(poolPoule: Poule): void {
    this.router.navigate(['/pool/chat', this.pool.getId(), this.leagueName, poolPoule.getId()]);
  }
}
