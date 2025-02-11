import { Component, EventEmitter, OnInit, Output, input } from '@angular/core';
import { AgainstSide, GameState, Poule, StartLocationMap } from 'ngx-sport';
import { AgainstPoule } from '../../lib/againstPoule';
import { PoolCompetitor } from '../../lib/pool/competitor';
import { Router } from '@angular/router';
import { PoolUser } from '../../lib/pool/user';

@Component({
  selector: 'app-poule-title',
  templateUrl: './title.component.html'
})
export class PouleTitleComponent implements OnInit {
  readonly poule = input.required<Poule>();
  readonly poolCompetitors = input.required<PoolCompetitor[]>();
  @Output() linkToPoolUser = new EventEmitter<PoolUser>();
  
  public homeCompetitor: PoolCompetitor | undefined;
  public awayCompetitor: PoolCompetitor | undefined;

  constructor(private router: Router) {    
  }

  ngOnInit() {
    const homeStartLocation = this.poule().getPlace(1).getStartLocation();
    if (homeStartLocation) {
      this.homeCompetitor =this.poolCompetitors().find((competitor: PoolCompetitor) => competitor.getStartLocation().equals(homeStartLocation));
    }
    const awayStartLocation = this.poule().getPlace(2).getStartLocation();
    if (awayStartLocation) {
      this.awayCompetitor = this.poolCompetitors().find((competitor: PoolCompetitor) => competitor.getStartLocation().equals(awayStartLocation));
    }
  }
  

  getScore(homeCompetitor: PoolCompetitor, awayCompetitor: PoolCompetitor): string {
    const poule = this.poule();
    if (poule.getGamesState() === GameState.Created) {
      return ' - ';
    }
    const startLocationMap = new StartLocationMap([homeCompetitor, awayCompetitor]);
    const againstPoule = new AgainstPoule(poule, startLocationMap);
    return againstPoule.getScore(AgainstSide.Home) + ' - ' + againstPoule.getScore(AgainstSide.Away)
  }

  get Home(): AgainstSide { return AgainstSide.Home; }
  get Away(): AgainstSide { return AgainstSide.Away; }

  hasQualified(side: AgainstSide): boolean {
    if ( this.poule().getPlaces().length == 1 ) {
      return true;
    }
    const againstPoule = this.getAgainstPoule();
    if (againstPoule === undefined) {
      return false;
    }    
    return againstPoule.hasQualified(side);
  }

  getAgainstPoule(): AgainstPoule|undefined {
    // const startLocationMap = new this.structureNameService.getStartLocationMap();
    // if (startLocationMap === undefined) {
    //   return undefined;
    // }
    return new AgainstPoule(this.poule(), new StartLocationMap(this.poolCompetitors()));
  }

  emitLinkToPoolUser(poolUser: PoolUser): void {
    this.linkToPoolUser.emit(poolUser);
  }
}

