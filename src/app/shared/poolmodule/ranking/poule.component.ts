import { Component, Input, OnInit } from '@angular/core';
import { NameService, Poule, RankedRoundItem, RankingService, PlaceLocationMap } from 'ngx-sport';

import { CSSService } from '../../commonmodule/cssservice';
import { Favorites } from '../../../lib/favorites';
import { FavoritesRepository } from '../../../lib/favorites/repository';
import { Pool } from '../../../lib/pool';

@Component({
  selector: 'app-pouleranking',
  templateUrl: './poule.component.html',
  styleUrls: ['./poule.component.scss']
})
export class PouleRankingComponent implements OnInit {
  public rankingItems: RankedRoundItem[];
  @Input() poule: Poule;
  @Input() header: boolean;
  public placeLocationMap: PlaceLocationMap;
  public nameService: NameService;
  public showDifferenceDetail = false;
  favorites: Favorites;
  public processing = true;

  constructor(
    public cssService: CSSService,
    public favRepository: FavoritesRepository) {
  }

  ngOnInit() {
    this.processing = true;
    const competition = this.poule.getCompetition().getTeamCompetitors();
    this.placeLocationMap = new PlaceLocationMap(this.pool.getCompetitors());
    this.nameService = new NameService(this.placeLocationMap);
    this.favorites = this.favRepository.getObject(this.pool);
    const ranking = new RankingService(this.poule.getRound(), this.pool.getCompetition().getRuleSet());
    this.rankingItems = ranking.getItemsForPoule(this.poule);
    this.processing = false;
  }

  useSubScore() {
    return this.poule.getRound().getNumber().getValidSportScoreConfigs().some(sportScoreConfig => {
      return sportScoreConfig.useSubScore();
    });
  }
}
