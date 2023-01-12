import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Round, Competitor, StructureEditor, QualifyTarget, PlaceRanges, Place, StructureNameService, StartLocation, SingleQualifyRule, MultipleQualifyRule, AgainstGame, Poule, GameState, StartLocationMap, AgainstSide } from 'ngx-sport';
import { AgainstPoule } from '../../lib/againstPoule';
import { PoolCompetitor } from '../../lib/pool/competitor';
import { PoolUser } from '../../lib/pool/user';
import { CSSService } from '../../shared/commonmodule/cssservice';

@Component({
  selector: 'app-superelf-cup-round',
  templateUrl: './round.component.html',
  styleUrls: ['./round.component.scss']
})
export class PoolCupRoundComponent implements OnInit {
  @Input() round!: Round;
  @Input() structureNameService!: StructureNameService;
  @Input() poolUser: PoolUser | undefined;
  @Output() navigateToPoule = new EventEmitter<Poule>();

  popoverPlace: Place | undefined;
  public hasCompetitors: boolean = false;


  constructor(public cssService: CSSService) {

  }

  get Finished(): GameState { return GameState.Finished };
  get Home(): AgainstSide { return AgainstSide.Home };
  get Away(): AgainstSide { return AgainstSide.Away };
  
  ngOnInit() {
    this.hasCompetitors = this.allPlacesHaveCompetitors();
  }

  allPlacesHaveCompetitors(): boolean {
    this.structureNameService.getStartLocationMap()

    return this.round.getPlaces().every((place: Place): boolean => {
      const startLocation = place.getStartLocation();
      if (startLocation === undefined) {
        return false;
      }
      return this.getCompetitor(startLocation) !== undefined;
    });
  }

  isCurrentUser(poule: Poule, side: AgainstSide): boolean {
    this.structureNameService.getStartLocationMap()

    const startLocation = this.getSidePlace(poule, side).getStartLocation();
    if (startLocation === undefined) {
      return false;
    }
    const poolCompetitor = <PoolCompetitor>this.getCompetitor(startLocation);

    return poolCompetitor && poolCompetitor.getPoolUser() === this.poolUser;
  }

  getNrOfPoulesChildren(round: Round): number {
    let nrOfChildPoules = 0;
    round.getQualifyGroups().forEach(qualifyGroup => {
      nrOfChildPoules += qualifyGroup.getChildRound().getPoules().length;
    });
    return nrOfChildPoules;
  }


  getCompetitorName(poule: Poule, side: AgainstSide): string {
    const againstPoule = this.getAgainstPoule(poule, side);
    if (againstPoule === undefined) {
      return '';
    }    
    const competitor = againstPoule.getCompetitor(side);
    if (competitor === undefined) {
      return '';
    }
    return competitor.getName(); 
  }

  // getCompetitor(startLocation: StartLocation): Competitor | undefined {
  //   return this.structureNameService.getStartLocationMap()?.getCompetitor(startLocation);
  // }

  get AbsoluteMinPlacesPerPoule(): number {
    return PlaceRanges.MinNrOfPlacesPerPoule;
  }  

  setPopoverPlace(place: Place) {
    this.popoverPlace = place;
  }

  getSidePlace(poule: Poule, side: AgainstSide): Place {
    return side === AgainstSide.Home ? poule.getPlace(1) : poule.getPlace(2);
  }

  getPreviousPouleName(poule: Poule, side: AgainstSide): string {
    const place = this.getSidePlace(poule, side);
    const previousPlace = this.getPreviousPlace(place);
    return previousPlace ? this.structureNameService.getPouleName(previousPlace.getPoule(), false) : '?'
  }

  protected getPreviousPlace(place: Place): Place | undefined {
    let fromQualifyRule: SingleQualifyRule | MultipleQualifyRule | undefined;
    try {
      fromQualifyRule = place.getRound().getParentQualifyGroup()?.getRule(place);
    } catch (e) { }
    if (fromQualifyRule === undefined) {
      return undefined;
    }
    if (fromQualifyRule instanceof MultipleQualifyRule) {
      return undefined;
    }
    // SingleQualifyRule
    return fromQualifyRule.getFromPlace(place);
  }

  getGameRoundNumbers(round: Round): string {
    return round.getPoule(1).getAgainstGames().map((game: AgainstGame): number => game.getGameRoundNumber()).join(', ');
  }

  emitNavigateToPoule(poule: Poule): void {
    if(this.hasCompetitors) {
      this.navigateToPoule.emit(poule);
    }
  }
  
  getCompetitor(startLocation: StartLocation): Competitor | undefined {
    return this.structureNameService.getStartLocationMap()?.getCompetitor(startLocation);
  }

  getScore(poule: Poule, side: AgainstSide): string {
    if (poule.getGamesState() === GameState.Created) {
      return '';
    }
    const againstPoule = this.getAgainstPoule(poule, side);
    if (againstPoule === undefined) {
      return '';
    }    
    return againstPoule.getScore(side);
  }

  hasQualified(poule: Poule, side: AgainstSide): boolean {
    if ( poule.getPlaces().length == 1 ) {
      return true;
    }
    const againstPoule = this.getAgainstPoule(poule, side);
    if (againstPoule === undefined) {
      return false;
    }    
    return againstPoule.hasQualified(side);
  }

  getAgainstPoule(poule: Poule, side: AgainstSide): AgainstPoule|undefined {
    const startLocationMap = this.structureNameService.getStartLocationMap();
    if (startLocationMap === undefined) {
      return undefined;
    }
    return new AgainstPoule(poule, startLocationMap);
  }

  showScore(poule: Poule): boolean {
    return poule.getGamesState() === GameState.InProgress || poule.getGamesState() === GameState.Finished;
  }
}
