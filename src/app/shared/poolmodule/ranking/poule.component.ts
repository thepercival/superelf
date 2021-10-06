import { Component, Input, OnInit } from '@angular/core';
import { NameService, Poule, Place } from 'ngx-sport';
import { TypePredicateKind } from 'typescript';
import { AuthService } from '../../../lib/auth/auth.service';
import { PoolCompetitor } from '../../../lib/pool/competitor';

import { CSSService } from '../../commonmodule/cssservice';

@Component({
  selector: 'app-pouleranking',
  templateUrl: './poule.component.html',
  styleUrls: ['./poule.component.scss']
})
export class PouleRankingComponent implements OnInit {
  // public rankingItems: RankedRoundItem[] = [];
  @Input() poule: Poule | undefined;
  // @Input() placeLocationMap: PlaceLocationMap | undefined;
  @Input() header: boolean | undefined;
  // public placeLocationMap: PlaceLocationMap;
  public nameService: NameService | undefined;
  public showDifferenceDetail = false;
  public processing = true;

  constructor(
    public authService: AuthService,
    public cssService: CSSService) {
  }

  ngOnInit() {
    this.processing = true;
    // this. = new (this.pool.getCompetitors());
    // if (this.placeLocationMap) {
    //   this.nameService = new NameService(this.placeLocationMap);
    // }

    // this.favorites = this.favRepository.getObject(this.pool);
    // const ranking = new RankingService(this.poule.getRound(), this.pool.getCompetition().getRuleSet());
    // this.rankingItems = ranking.getItemsForPoule(this.poule);
    this.processing = false;
  }

  // useSubScore(): boolean {
  //   return this.poule ? this.poule.getRound().getNumber().getValidSportScoreConfigs().some(sportScoreConfig => {
  //     return sportScoreConfig?.useSubScore();
  //   }) : false;
  // }

  isCurrentUser(place: Place): boolean {
    if (!this.authService.isLoggedIn()) {
      return false;
    }
    return false;
    // const poolCompetitor = <PoolCompetitor>this.placeLocationMap?.getCompetitor(place);
    // return poolCompetitor?.getUser() === this.authService.getUser();

  }
}
