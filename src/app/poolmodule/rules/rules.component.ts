import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FootballLine, Formation } from 'ngx-sport';
import { SuperElfNameService } from '../../lib/nameservice';
import { Pool } from '../../lib/pool';

import { PoolRepository } from '../../lib/pool/repository';
import { PoolComponent } from '../../shared/poolmodule/component';
import { CompetitionConfigRepository } from '../../lib/competitionConfig/repository';
import { CSSService } from '../../shared/commonmodule/cssservice';
import { FootballScore } from '../../lib/score';
import { GlobalEventsManager } from '../../shared/commonmodule/eventmanager';

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
        this.processing = false;
      }
    });
  }

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
    return [FootballScore.WinResult, FootballScore.DrawResult, FootballScore.PenaltyGoal,
    FootballScore.OwnGoal, FootballScore.YellowCard, FootballScore.RedCard].map((score: FootballScore): PointsItem => {
      return {
        name: this.nameService.getScoreName(score), points: this.pool.getCompetitionConfig().getScorePoints(score)
      }
    });
  }

  getLinePointsItems(line: FootballLine): PointsItem[] {
    const scores = [FootballScore.Goal, FootballScore.Assist];
    if (line === FootballLine.GoalKeeper || line === FootballLine.Defense) {
      scores.push(FootballScore.CleanSheet);
      scores.push(FootballScore.SpottySheet);
    }
    return scores.map((score: FootballScore): PointsItem => {
      return {
        name: this.nameService.getScoreName(score), points: this.pool.getCompetitionConfig().getLineScorePoints({ line, score })
      }
    });
  }
}

interface PointsItem {
  name: string;
  points: number;
}


