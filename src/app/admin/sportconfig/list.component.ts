import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  Sport,
  SportConfig,
  SportConfigService,
} from 'ngx-sport';

import { Tournament } from '../../lib/pool';
import { TournamentRepository } from '../../lib/pool/repository';
import { TranslateService } from '../../lib/translate';
import { TournamentComponent } from '../../shared/tournament/component';
import { SportConfigRepository } from '../../lib/ngx-sport/sport/config/repository';
import { StructureRepository } from '../../lib/ngx-sport/structure/repository';
import { PlanningRepository } from '../../lib/ngx-sport/planning/repository';

@Component({
  selector: 'app-tournament-sport',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class SportConfigListComponent extends TournamentComponent implements OnInit {
  sportConfigs: SportConfig[];
  translateService: TranslateService;
  hasBegun: boolean;

  validations: any = {
    'minlengthname': Sport.MIN_LENGTH_NAME,
    'maxlengthname': Sport.MAX_LENGTH_NAME
  };

  constructor(
    route: ActivatedRoute,
    router: Router,
    private sportConfigService: SportConfigService,
    tournamentRepository: TournamentRepository,
    sructureRepository: StructureRepository,
    private sportConfigRepository: SportConfigRepository,
    private planningRepository: PlanningRepository,
    private modalService: NgbModal
  ) {
    super(route, router, tournamentRepository, sructureRepository);
    this.translateService = new TranslateService();
  }

  ngOnInit() {
    super.myNgOnInit(() => this.initSports());
  }

  initSports() {
    this.createSportConfigsList();
    this.hasBegun = this.structure.getRootRound().hasBegun();
    this.processing = false;
    if (this.hasBegun) {
      this.setAlert('warning', 'er zijn al wedstrijden gespeeld, je kunt niet meer wijzigen');
    }
  }

  createSportConfigsList() {
    this.sportConfigs = this.competition.getSportConfigs();
  }

  // addSport() {
  //   this.linkToEdit(this.tournament);
  // }

  editSportConfig(sportConfig: SportConfig) {
    this.linkToEdit(this.tournament, sportConfig);
  }

  linkToEdit(tournament: Tournament, sportConfig?: SportConfig) {
    this.router.navigate(['/admin/sportconfig', tournament.getId(), sportConfig ? sportConfig.getId() : 0]);
  }

  openRemoveModal(content, sportConfig: SportConfig) {
    this.modalService.open(content).result.then((result) => {
      if (result === 'remove') {
        this.remove(sportConfig);
      }
    }, (reason) => {

    });
  }

  remove(sportConfig: SportConfig) {
    this.setAlert('info', 'de sport wordt verwijderd');
    this.processing = true;

    this.sportConfigService.remove(sportConfig, this.structure);

    this.sportConfigRepository.removeObject(sportConfig, this.tournament, this.structure)
      .subscribe(
        /* happy path */ refereeRes => {
          this.planningRepository.create(this.structure, this.tournament, 1).subscribe(
            /* happy path */ roundNumberOut => {
              this.setAlert('success', 'de sport is verwijderd');
            },
            /* error path */ e => { this.setAlert('danger', e); this.processing = false; },
            /* onComplete */() => this.processing = false
          );
        },
            /* error path */ e => { this.setAlert('danger', e); this.processing = false; },
      );
  }
}
