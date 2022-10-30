import { Component, Input, OnInit } from '@angular/core';
import { AgainstSide, AgainstSportRoundRankingCalculator, GameState, Poule, SportRoundRankingItem, StartLocationMap } from 'ngx-sport';
import { AgainstPoule } from '../../lib/againstPoule';
import { PoolCompetitor } from '../../lib/pool/competitor';

@Component({
  selector: 'app-poule-title',
  templateUrl: './title.component.html'
})
export class PouleTitleComponent implements OnInit {
  @Input() poule!: Poule;
  @Input() poolCompetitors!: PoolCompetitor[];
  
  public homeCompetitor: PoolCompetitor | undefined;
  public awayCompetitor: PoolCompetitor | undefined;

  constructor() {    
  }

  ngOnInit() {
    const homeStartLocation = this.poule.getPlace(1).getStartLocation();
        if (homeStartLocation) {
          this.homeCompetitor =this.poolCompetitors.find((competitor: PoolCompetitor) => competitor.getStartLocation().equals(homeStartLocation));
        }
        const awayStartLocation = this.poule.getPlace(2).getStartLocation();
        if (awayStartLocation) {
          this.awayCompetitor = this.poolCompetitors.find((competitor: PoolCompetitor) => competitor.getStartLocation().equals(awayStartLocation));
        }
  }
  

  getScore(homeCompetitor: PoolCompetitor, awayCompetitor: PoolCompetitor): string {
    if (this.poule.getGamesState() === GameState.Created) {
      return ' - ';
    }
    const startLocationMap = new StartLocationMap([homeCompetitor, awayCompetitor]);
    const againstPoule = new AgainstPoule(this.poule, startLocationMap);
    return againstPoule.getScore(AgainstSide.Home) + ' - ' + againstPoule.getScore(AgainstSide.Away)
  }  
}

