import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormationLineDef } from 'ngx-sport';
import { SuperElfNameService } from '../../lib/nameservice';

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
  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository
  ) {
    super(route, router, poolRepository);
    this.nameService = new SuperElfNameService();
  }

  ngOnInit() {
    super.myNgOnInit(() => {
      this.processing = false;
    });
  }

  getFormationNames(): string {
    return this.pool.getFormations().map(formation => formation.getName()).join(", ");
  }

  getLineDefs(): number[] {
    return [FormationLineDef.All, FormationLineDef.Goalkeeper, FormationLineDef.Defense, FormationLineDef.Midfield, FormationLineDef.Forward];
  }

  getPoolScoreUnits(formationLineDef: number): PoolScoreUnit[] {
    console.log(formationLineDef, this.pool.getScoreUnits(formationLineDef));
    return this.pool.getScoreUnits(formationLineDef);
  }
}
