import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SportCustom } from 'ngx-sport';
import { JsonFormationShell } from '../../lib/activeConfig/json';
import { ActiveConfigRepository } from '../../lib/activeConfig/repository';
import { SuperElfNameService } from '../../lib/nameservice';
import { Pool } from '../../lib/pool';
import { ActiveConfig } from '../../lib/pool/activeConfig';

import { PoolRepository } from '../../lib/pool/repository';
import { PoolScoreUnit } from '../../lib/pool/scoreUnit';
import { PoolComponent } from '../../shared/poolmodule/component';

@Component({
  selector: 'app-pool-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent extends PoolComponent implements OnInit {
  nameService: SuperElfNameService;
  availableFormations: JsonFormationShell[] | undefined;
  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    protected activeConfigRepository: ActiveConfigRepository
  ) {
    super(route, router, poolRepository);
    this.nameService = new SuperElfNameService();
  }

  ngOnInit() {
    super.parentNgOnInit().subscribe((pool: Pool) => {
      this.pool = pool;
      this.activeConfigRepository.getObject()
        .subscribe(
        /* happy path */(config: ActiveConfig) => this.availableFormations = config.getAvailableFormations()
        );
      this.processing = false;
    });
  }

  getFormationNames(): string | undefined {
    return this.availableFormations?.map((formation: JsonFormationShell) => formation.name).join(", ");
  }

  getLineDefs(): number[] {
    return [
      SportCustom.Football_Line_All,
      SportCustom.Football_Line_GoalKepeer,
      SportCustom.Football_Line_Defense,
      SportCustom.Football_Line_Midfield,
      SportCustom.Football_Line_Forward];
  }

  getPoolScoreUnits(formationLineDef: number): PoolScoreUnit[] {
    if (!this.pool) {
      return [];
    }
    return this.pool.getScoreUnits(formationLineDef);
  }
}
