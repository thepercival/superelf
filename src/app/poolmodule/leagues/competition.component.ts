import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PoolRepository } from '../../lib/pool/repository';
import { PoolComponent } from '../../shared/poolmodule/component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { PoolUser } from '../../lib/pool/user';
import { PoolUserRepository } from '../../lib/pool/user/repository';
import { Pool } from '../../lib/pool';
import { CompetitionSport, CompetitorMap, GamePlaceStrategy, JsonPlanningConfig, Place, PlanningEditMode, Poule, Round, RoundNumber, SelfReferee, StructureEditor } from 'ngx-sport';
import { PoolCollection } from '../../lib/pool/collection';
import { PoolCompetitor } from '../../lib/pool/competitor';


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
  public competitorMap!: CompetitorMap;

  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    protected structureEditor: StructureEditor,
    protected poolUserRepository: PoolUserRepository,
    private modalService: NgbModal
  ) {
    super(route, router, poolRepository);

  }

  ngOnInit() {
    super.parentNgOnInit().subscribe({
      next: (pool: Pool) => {
        this.pool = pool;
        if (pool.getAssemblePeriod().isIn()) {
          this.setAlert('info', 'vanaf de start tot ' + this.nrOfDaysToRemoveAfterAssemblePeriod + ' dagen erna zijn deelnemers te vewijderen');
        }
        this.poolUserRepository.getObjects(pool).subscribe({
          next: (poolUsers: PoolUser[]) => {
            this.poolUsers = poolUsers;
            const competition = this.pool.getCompetition(PoolCollection.League_Default);
            if (competition === undefined) {
              throw Error('competitionSport not found');
            }

            // -----------  JE TOONT VOOR EEN BEPAALDE VIEWPERIODE -------------- //
            // DE GAMEROUNDS ZIJN DAN DE WEDSTRIJDEN EN DE POOLUSERS MET HUN PUNTEN PER GAMEROUND ZIJN DAN DE GAMEROUND-SCORE
            const poolCompetitors = this.pool.getCompetitors(PoolCollection.League_Default);
            const structure = this.structureEditor.create(competition, [poolCompetitors.length])
            const round = structure.getRootRound();
            this.poule = round.getFirstPoule(); // ?? GET FROM BACKEND ?? this.pool.getCompetition(PoolCollection.League_Default).get;
            this.competitionSport = this.pool.getCompetitionSport(PoolCollection.League_Default);
            this.competitorMap = new CompetitorMap(poolCompetitors);

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
