import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FootballLine, Formation } from 'ngx-sport';
import { ActiveConfigRepository } from '../../lib/activeConfig/repository';
import { SuperElfNameService } from '../../lib/nameservice';
import { Pool } from '../../lib/pool';
import { ActiveConfig } from '../../lib/activeConfig';

import { PoolRepository } from '../../lib/pool/repository';
import { SeasonScoreUnit } from '../../lib/ngx-sport/season/scoreUnit';
import { PoolComponent } from '../../shared/poolmodule/component';

@Component({
  selector: 'app-pool-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RulesComponent extends PoolComponent implements OnInit {
  availableFormations: Formation[] | undefined;
  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    public nameService: SuperElfNameService,
    protected activeConfigRepository: ActiveConfigRepository
  ) {
    super(route, router, poolRepository);
  }

  ngOnInit() {
    super.parentNgOnInit().subscribe({
      next: (pool: Pool) => {
        this.pool = pool;
        this.activeConfigRepository.getObject()
          .subscribe(
            (config: ActiveConfig) => this.availableFormations = config.getAvailableFormations()
          );
        this.processing = false;
      },
      error: (e) => {
        this.setAlert('danger', e); this.processing = false;
      }
    });
  }

  getFormationNames(): string | undefined {
    return this.availableFormations?.map((formation: Formation) => {
      return formation.getName();
    }).join(", ");
  }

  getLineDefs(): FootballLine[] {
    return [
      FootballLine.GoalKepeer,
      FootballLine.Defense,
      FootballLine.Midfield,
      FootballLine.Forward];
  }

  getPoolScoreUnits(formationLineDef: number): SeasonScoreUnit[] {
    if (!this.pool) {
      return [];
    }
    // @TODO get from repository
    return [];
    // return this.pool.getScoreUnits(formationLineDef);
  }
}
