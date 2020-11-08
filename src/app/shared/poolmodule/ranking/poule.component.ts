import { Component, Input, OnInit } from '@angular/core';
import { NameService, Poule, RankedRoundItem, RankingService, PlaceLocationMap, Place } from 'ngx-sport';
import { AuthService } from '../../../lib/auth/auth.service';
import { PoolCompetitor } from '../../../lib/pool/competitor';

import { CSSService } from '../../commonmodule/cssservice';

@Component({
  selector: 'app-pouleranking',
  templateUrl: './poule.component.html',
  styleUrls: ['./poule.component.scss']
})
export class PouleRankingComponent implements OnInit {
  public rankingItems: RankedRoundItem[];
  @Input() poule: Poule;
  @Input() placeLocationMap: PlaceLocationMap;
  @Input() header: boolean;
  // public placeLocationMap: PlaceLocationMap;
  public nameService: NameService;
  public showDifferenceDetail = false;
  public processing = true;

  constructor(
    public authService: AuthService,
    public cssService: CSSService) {
  }

  ngOnInit() {
    this.processing = true;
    // this. = new (this.pool.getCompetitors());
    // this.nameService = new NameService(this.placeLocationMap);
    // this.favorites = this.favRepository.getObject(this.pool);
    // const ranking = new RankingService(this.poule.getRound(), this.pool.getCompetition().getRuleSet());
    // this.rankingItems = ranking.getItemsForPoule(this.poule);
    this.processing = false;
  }

  useSubScore() {
    return this.poule.getRound().getNumber().getValidSportScoreConfigs().some(sportScoreConfig => {
      return sportScoreConfig.useSubScore();
    });
  }

  isCurrentUser(place: Place): boolean {
    if (!this.authService.isLoggedIn()) {
      return false;
    }
    const poolCompetitor = <PoolCompetitor>this.placeLocationMap.getCompetitor(place);
    return poolCompetitor?.getUser() === this.authService.getUser();

  }
}
