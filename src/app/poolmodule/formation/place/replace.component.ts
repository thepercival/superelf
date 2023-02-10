import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { concatMap } from 'rxjs/operators';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FootballLine, Team, Person, Player, Formation, PlayerMapper } from 'ngx-sport';
import { CompetitionConfigRepository } from '../../../lib/competitionConfig/repository';
import { FootballFormationChecker } from '../../../lib/formation/footballChecker';
import { S11FormationPlace } from '../../../lib/formation/place';
import { FormationRepository } from '../../../lib/formation/repository';
import { OneTeamSimultaneous } from '../../../lib/oneTeamSimultaneousService';
import { S11Player } from '../../../lib/player';
import { Pool } from '../../../lib/pool';
import { PoolRepository } from '../../../lib/pool/repository';
import { PoolUser } from '../../../lib/pool/user';
import { PoolUserRepository } from '../../../lib/pool/user/repository';
import { ScoutedPlayer } from '../../../lib/scoutedPlayer';
import { GlobalEventsManager } from '../../../shared/commonmodule/eventmanager';
import { MyNavigation } from '../../../shared/commonmodule/navigation';
import { PoolComponent } from '../../../shared/poolmodule/component';
import { ChoosePlayersFilter } from '../../player/choose.component';
import { JsonReplacement } from '../../../lib/editAction/replacement/json';
import { S11FormationCalculator } from '../../../lib/formation/calculator';
import { ViewPeriodType } from '../../../lib/period/view/json';

@Component({
  selector: 'app-pool-place-replace',
  templateUrl: './replace.component.html',
  styleUrls: ['./replace.component.scss']
})
export class FormationPlaceReplaceComponent extends PoolComponent implements OnInit {
  poolUser!: PoolUser;
  scoutingList: ScoutingList = { scoutedPlayers: []/*, mappedPersons: new PersonMap()*/ };
  public form: UntypedFormGroup;
  public oneTeamSimultaneous = new OneTeamSimultaneous();
  public choosePlayersFilter: ChoosePlayersFilter;
  public place!: S11FormationPlace;
  public alreadyChosenPersons: Person[] = [];
  public alreadyChosenTeams: Team[] = [];
  public selectableTeam: Team | undefined;
  public selectableLines!: FootballLine[];
  public formationChecker: FootballFormationChecker|undefined;

  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    globalEventsManager: GlobalEventsManager,
    protected poolUserRepository: PoolUserRepository,
    private location: Location,
    private formationRepository: FormationRepository,
    protected competitionConfigRepository: CompetitionConfigRepository,
    private playerMapper: PlayerMapper,
    public myNavigation: MyNavigation,
    private modalService: NgbModal,
    fb: UntypedFormBuilder
  ) {
    super(route, router, poolRepository, globalEventsManager);
    this.form = fb.group({
      showAll: false
    });

    const state = this.router.getCurrentNavigation()?.extras.state ?? undefined;
    this.choosePlayersFilter = state ? state.playerFilter : { line: undefined, team: undefined };
  }


  ngOnInit() {
    super.parentNgOnInit().subscribe((pool: Pool) => {
      this.setPool(pool);      

      this.competitionConfigRepository.getAvailableFormations(pool.getCompetitionConfig()).pipe(
        concatMap((formations: Formation[]) => {
          this.formationChecker = new FootballFormationChecker(formations);
          return this.poolUserRepository.getObjectFromSession(pool);
        })
      )
      .subscribe({
        next: (poolUser: PoolUser) => {
          this.poolUser = poolUser;
          this.route.params.subscribe(params => {
            if (params.placeId !== undefined) {
              this.initPlace(+params.placeId);;
            }
          });
        },
        error: (e) => {
          this.setAlert('danger', e); this.processing = false;
        },
        complete: () => this.processing = false
      });     
    });
  }

  private initPlace(placeId: number) {
    this.place = this.getPlaceById(placeId);
    this.initPlayerChoose();
  }

  initPlayerChoose() {
    this.alreadyChosenPersons = [];
    this.selectableTeam = this.getTeamDescendingStart(this.place.getPlayer());
    if( this.selectableTeam ) {
      this.choosePlayersFilter.team = this.selectableTeam;
    } else {
      this.setAlert('danger', 'kan geen team voor speler vinden');
    }
    const formationLine = this.place.getFormationLine();
    const formationChecker = this.formationChecker;
    if( formationChecker ) {
      const addableLines = formationChecker.addableLines(formationLine.getFormation().convertToBase(), formationLine.getNumber());      
      this.selectableLines = addableLines;
      // this.route.queryParams.subscribe(params => {
      //   if (params.line !== undefined) {
          this.choosePlayersFilter.line = this.place.getLine();
      //   }
      // ?});
    }
    
  }

  getTeamDescendingStart(s11Player: S11Player|undefined): Team|undefined {
    // console.log(s11Player);
    return this.getPlayerDescendingStart(s11Player)?.getTeam();
  }

  getPlayerDescendingStart(s11Player: S11Player|undefined): Player|undefined {
    if( s11Player === undefined) {
      return undefined;
    }
    return s11Player.getPlayersDescendingStart().shift();
  }

  getPlaceById(placeId: number): S11FormationPlace {
    const formation = this.poolUser.getAssembleFormation();

    const place = formation?.getPlaces().find((place: S11FormationPlace): boolean => {
      return place.getId() === placeId;
    });
    if (place === undefined) {
      throw Error('de opstellings-plaats kan niet gevonden worden');
    }
    return place;
  }

  getTeamById(teamId: number): Team | undefined {
    const teamCompetitors = this.pool.getSourceCompetition().getTeamCompetitors();
    return teamCompetitors.map(teamCompetitor => teamCompetitor.getTeam()).find((team: Team): boolean => {
      return team.getId() === teamId;
    });
  }


  replace(playerIn: Player, placeOut: S11FormationPlace) {
    const s11Player = placeOut.getPlayer();
    if( s11Player === undefined) {
      throw new Error('player out can not be empty');
    }
    const playerOut = s11Player.getPlayersDescendingStart().shift();
    if( playerOut === undefined) {
      throw new Error('player out can not be empty');
    }
    this.processing = true;    
    const jsonReplacement: JsonReplacement = {
      id: 0,
      lineNumberOut: this.place.getLine(),
      placeNumberOut: this.place.getNumber(),
      playerIn: this.playerMapper.toJson(playerIn),
      playerOut: this.playerMapper.toJson(playerOut),
      createdDate: (new Date()).toISOString()
    }
    const transferPeriod = this.poolUser.getPool().getCompetitionConfig().getTransferPeriod();
    
    this.formationRepository.replace(jsonReplacement, this.poolUser).subscribe({
      next: () => {
        if( !(new S11FormationCalculator()).areAllPlacesWithoutTeamReplaced(this.poolUser) ) {
          this.router.navigate(['/pool/formation/replacements', this.pool.getId()]);
        } else if( this.poolUser.getTransfers().length < transferPeriod.getMaxNrOfTransfers()) {
          this.router.navigate(['/pool/formation/transfers', this.pool.getId()]);
        } else {
          this.router.navigate(['/pool/formation/substitutions', this.pool.getId()]);
        }
      },
      error: (e: string) => {
        this.setAlert('danger', e);
        this.processing = false
      },
      complete: () => this.processing = false
    });
  }

  get TransferViewPeriod(): ViewPeriodType { return ViewPeriodType.Transfer; }
  
  updateShowAll() {
    this.updateState(this.choosePlayersFilter);
  }

  updateState(choosePlayersFilter: ChoosePlayersFilter) {
    this.choosePlayersFilter = choosePlayersFilter;

    let params = new HttpParams();
    if (choosePlayersFilter.line) {
      params = params.set('line', choosePlayersFilter.line);
    }
    if (choosePlayersFilter.team) {
      params = params.set('teamId', choosePlayersFilter.team.getId());
    }
    params = params.set('showAll', this.form.controls.showAll.value);

    this.location.replaceState(
      location.pathname,
      params.toString(),
      undefined
    );
  }

  linkToPlayer(s11Player: S11Player): void {
    this.router.navigate(['/pool/player/', this.pool.getId(), s11Player.getId(), 0]/*, {
      state: { s11Player, "pool": this.pool, currentGameRound: undefined }
    }*/);
  }

  toggleShowAll() {

  }
}

interface ScoutingList {
  scoutedPlayers: ScoutedPlayer[];
}