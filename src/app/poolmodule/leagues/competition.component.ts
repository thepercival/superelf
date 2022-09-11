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


@Component({
  selector: 'app-pool-leagues-competition',
  templateUrl: './competition.component.html',
  styleUrls: ['./competition.component.scss']
})
export class PoolCompetitionComponent extends PoolComponent implements OnInit {

  poolUsers: PoolUser[] = [];
  private nrOfDaysToRemoveAfterAssemblePeriod = 6;

  public poule!: Poule;
  public competitionSport!: CompetitionSport;
  public startLocationMap!: StartLocationMap;

  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    globalEventsManager: GlobalEventsManager,
    protected structureEditor: StructureEditor,
    protected poolUserRepository: PoolUserRepository,
    protected structureRepository: StructureRepository,
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
        this.poolUserRepository.getObjects(pool).subscribe({
          next: (poolUsers: PoolUser[]) => {
            this.poolUsers = poolUsers;
            const competition = this.pool.getCompetition(LeagueName.Competition);
            if (competition === undefined) {
              throw Error('competitionSport not found');
            }

            this.structureRepository.getObject(competition).subscribe({
              next: (structure: Structure) => {

                // -----------  JE TOONT VOOR EEN BEPAALDE VIEWPERIODE -------------- //
                // DE GAMEROUNDS ZIJN DAN DE WEDSTRIJDEN EN DE POOLUSERS MET HUN PUNTEN PER GAMEROUND ZIJN DAN DE GAMEROUND-SCORE
                const poolCompetitors = this.pool.getCompetitors(LeagueName.Competition);
                const round = structure.getSingleCategory().getRootRound();
                this.poule = round.getFirstPoule(); // ?? GET FROM BACKEND ?? this.pool.getCompetition(PoolCollection.League_Default).get;
                this.competitionSport = this.pool.getCompetitionSport(LeagueName.Competition);
                this.startLocationMap = new StartLocationMap(poolCompetitors);

                // gameRoundScores voor competitors of poolCompetitions
                // getGAMES!! 
                console.log(poolCompetitors);

              },
              error: (e: string) => { this.setAlert('danger', e); this.processing = false; },
              complete: () => this.processing = false
            });



          },
          error: (e: string) => { this.setAlert('danger', e); this.processing = false; },
          complete: () => this.processing = false
        });
      },
      error: (e) => {
        this.setAlert('danger', e); this.processing = false;
      }
    });
  }
}
