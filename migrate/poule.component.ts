import { Component, OnInit, input } from '@angular/core';
import { Poule, Place, StructureNameService } from 'ngx-sport';
import { AuthService } from '../src/app/lib/auth/auth.service';
import { NgIf } from '@angular/common';

import { CSSService } from '../src/app/shared/commonmodule/cssservice';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: "app-pouleranking",
  standalone: true,
  imports: [NgIf,FontAwesomeModule],
  templateUrl: "./poule.component.html",
  styleUrls: ["./poule.component.scss"],
})
export class PouleRankingComponent implements OnInit {
  // public rankingItems: RankedRoundItem[] = [];
  readonly poule = input<Poule>();
  // @Input() placeLocationMap: PlaceLocationMap | undefined;
  readonly header = input<boolean>();
  // public placeLocationMap: PlaceLocationMap;
  public structureNameService: StructureNameService | undefined;
  public showDifferenceDetail = false;
  public processing = true;

  constructor(public authService: AuthService, public cssService: CSSService) {}

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
