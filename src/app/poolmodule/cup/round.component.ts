import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Round, Competitor, StructureEditor, QualifyTarget, PlaceRanges, Place, StructureNameService, StartLocation, SingleQualifyRule, MultipleQualifyRule, AgainstGame, Poule } from 'ngx-sport';
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

  isCurrentUser(place: Place): boolean {
    this.structureNameService.getStartLocationMap()

    const startLocation = place.getStartLocation();
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


  getCompetitorName(place: Place): string {
    const startLocation = place.getStartLocation();
    if (startLocation === undefined) {
      return '';
    }
    const competitor = this.getCompetitor(startLocation);
    if (competitor === undefined) {
      return '';
    }
    return competitor.getName();
  }

  getCompetitor(startLocation: StartLocation): Competitor | undefined {
    return this.structureNameService.getStartLocationMap()?.getCompetitor(startLocation);
  }

  get AbsoluteMinPlacesPerPoule(): number {
    return PlaceRanges.MinNrOfPlacesPerPoule;
  }

  setPopoverPlace(place: Place) {
    this.popoverPlace = place;
  }

  getPreviousPouleName(place: Place): string {
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
    this.navigateToPoule.emit(poule);
  }

}
