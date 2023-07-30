import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FootballLine, Formation } from 'ngx-sport';
import { SuperElfNameService } from '../../lib/nameservice';
import { Pool } from '../../lib/pool';

import { PoolRepository } from '../../lib/pool/repository';
import { PoolComponent } from '../../shared/poolmodule/component';
import { CompetitionConfigRepository } from '../../lib/competitionConfig/repository';
import { CSSService } from '../../shared/commonmodule/cssservice';
import { FootballCard, FootballGoal, FootballResult, FootballScore, FootballScoreLine, FootballSheet } from '../../lib/score';
import { GlobalEventsManager } from '../../shared/commonmodule/eventmanager';
import { NavBarItem } from '../../shared/poolmodule/poolNavBar/items';
import { PoolUser } from '../../lib/pool/user';
import { PoolUserRepository } from '../../lib/pool/user/repository';

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
    globalEventsManager: GlobalEventsManager,
    protected cssService: CSSService,
    protected poolUserRepository: PoolUserRepository,
    protected competitionConfigRepository: CompetitionConfigRepository,
    public nameService: SuperElfNameService
  ) {
    super(route, router, poolRepository, globalEventsManager);
  }

  ngOnInit() {
    super.parentNgOnInit().subscribe({
      next: (pool: Pool) => {
        this.setPool(pool);
        this.competitionConfigRepository.getAvailableFormations(pool.getCompetitionConfig())
          .subscribe(
            (formations: Formation[]) => this.availableFormations = formations
          );
        this.poolUserRepository.getObjectFromSession(pool).subscribe({
          next: ((poolUser: PoolUser) => {
            this.poolUserFromSession = poolUser;
          })
        });
        this.processing = false;
      }
    });
  }

  get Rules(): NavBarItem { return NavBarItem.Rules }

  getFormationNames(): string | undefined {
    return this.availableFormations?.map((formation: Formation) => {
      return formation.getName();
    }).join(", ");
  }

  // get points(): Points {
  //   return this.pool.getCompetitionConfig().getPoints();
  // }


  getPossibleLines(): FootballLine[] {
    const lines = [];
    for (const [propertyKey, propertyValue] of Object.entries(FootballLine)) {
      if ((typeof propertyValue === 'string')) {
        continue;
      }
      lines.push(propertyValue);
    }
    return lines;
  }

  getLineClass(footballLine: FootballLine, prefix?: string): string {
    return this.cssService.getLine(footballLine, prefix ? prefix + '-' : prefix);
  }

  getPointsItems(): PointsItem[] {
    const scorePointsMap = this.pool.getCompetitionConfig().getScorePointsMap();
    return scorePointsMap.getScorePoints().map((score: FootballScore): PointsItem => {
      return {
        name: this.nameService.getScoreName(score), points: scorePointsMap.get(score)
      }
    });
  }

  getLinePointsItems(line: FootballLine): PointsItem[] {
    const scores: FootballScoreLine[] = [FootballGoal.Normal, FootballGoal.Assist];
    if (line === FootballLine.GoalKeeper || line === FootballLine.Defense) {
      scores.push(FootballSheet.Clean);
      scores.push(FootballSheet.Spotty);
    }
    const scorePointsMap = this.pool.getCompetitionConfig().getScorePointsMap();
    return scores.map((score: FootballScoreLine): PointsItem => {
      return {
        name: this.nameService.getScoreName(score), points: scorePointsMap.getLine({ line, score })
      }
    });
  }
}

interface PointsItem {
  name: string;
  points: number;
}


