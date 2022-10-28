import { Component, Input, OnInit } from '@angular/core';
import { AgainstSide, AgainstSportRoundRankingCalculator, GameState, Poule, SportRoundRankingItem } from 'ngx-sport';
import { PoolCompetitor } from '../../lib/pool/competitor';

@Component({
  selector: 'app-poule-title',
  templateUrl: './title.component.html'
})
export class PouleTitleComponent implements OnInit {
  @Input() poule!: Poule;
  @Input() poolCompetitors!: PoolCompetitor[];
  public sportRankingItems!: SportRoundRankingItem[];

  public homeCompetitor: PoolCompetitor | undefined;
  public awayCompetitor: PoolCompetitor | undefined;

  constructor() {
  }

  ngOnInit() {
    const competitionSport = this.poule.getCompetition().getSingleSport();
    const rankingCalculator = new AgainstSportRoundRankingCalculator(competitionSport, [GameState.Finished]);
    this.sportRankingItems = rankingCalculator.getItemsForPoule(this.poule);
    
    this.initPouleCompetitors(this.poule, this.poolCompetitors);
  }

  private initPouleCompetitors(poolPoule: Poule, poolCompetitors: PoolCompetitor[]): void {
    const homeStartLocation = poolPoule.getPlace(1).getStartLocation();
    if (homeStartLocation) {
      this.homeCompetitor = poolCompetitors.find((competitor: PoolCompetitor) => competitor.getStartLocation().equals(homeStartLocation));
    }
    const awayStartLocation = poolPoule.getPlace(2).getStartLocation();
    if (awayStartLocation) {
      this.awayCompetitor = poolCompetitors.find((competitor: PoolCompetitor) => competitor.getStartLocation().equals(awayStartLocation));
    }
  }

  getSportRankingItem(poolCompetitor: PoolCompetitor): SportRoundRankingItem | undefined {
    const placeNr = poolCompetitor.getStartLocation().getPlaceNr();
    return this.sportRankingItems.find((sportRankingItem: SportRoundRankingItem) => sportRankingItem.getPlaceLocation().getPlaceNr() === placeNr );
  }

  getRankingScore(homeCompetitor: PoolCompetitor, awayeCompetitor: PoolCompetitor): string {
    if (this.poule.getGamesState() === GameState.Created) {
      return ' - ';
    }
    return this.getSideRankingScore(this.getSportRankingItem(homeCompetitor))
      + ' - '
      + this.getSideRankingScore(this.getSportRankingItem(awayeCompetitor));
  }

  getSideRankingScore(sportRankingItem: SportRoundRankingItem | undefined): string {
    if (sportRankingItem === undefined) {
      return '';
    }
    const performance = sportRankingItem.getPerformance();
    if (performance === undefined) {
      return '';
    }
    return '' + performance.getPoints();
  }
  
}

