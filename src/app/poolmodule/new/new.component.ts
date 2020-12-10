import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { IAlert } from '../../shared/commonmodule/alert';
import { Pool } from '../../lib/pool';
import { PoolRepository } from '../../lib/pool/repository';
import { JsonPool } from '../../lib/pool/json';
import { PoolCollection } from '../../lib/pool/collection';
import { ActiveConfigRepository } from '../../lib/activeConfig/repository';
import { JsonActiveConfig, JsonCompetitionShell } from '../../lib/activeConfig/json';
import { ActiveConfig } from '../../lib/pool/activeConfig';
import { CompetitionRepository } from '../../lib/ngx-sport/competition/repository';
import { Competition } from 'ngx-sport';


@Component({
  selector: 'app-pool-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {
  form: FormGroup;
  processing = true;
  alert: IAlert | undefined;
  validations: any = {
    minlengthname: PoolCollection.MIN_LENGTH_NAME,
    maxlengthname: PoolCollection.MAX_LENGTH_NAME,
  };
  activeConfig: ActiveConfig | undefined;
  activeSourceCompetitionShell: JsonCompetitionShell | undefined;

  constructor(
    private router: Router,
    private activeConfigRepository: ActiveConfigRepository,
    private poolRepository: PoolRepository,
    private competitionRepository: CompetitionRepository,
    fb: FormBuilder
  ) {
    this.form = fb.group({
      name: ['', Validators.compose([
        Validators.required,
        Validators.minLength(this.validations.minlengthname),
        Validators.maxLength(this.validations.maxlengthname)
      ])]
    });
  }

  ngOnInit() {
    this.activeConfigRepository.getObject()
      .subscribe(
        /* happy path */(config: ActiveConfig) => {
          this.activeConfig = config;
          if (!this.inCreateAndJoinPeriod()) {
            const period = this.activeConfig.getCreateAndJoinPeriod();
            this.setAlert('danger', 'het opzetten van een pool kan alleen van ' + period.getStartDateTime().toLocaleString() + ' tot ' + period.getEndDateTime().toLocaleString());
          }
          else if (this.activeConfig.getCompetitions().length !== 1) {
            this.setAlert('danger', 'het aantal actieve broncompetities moet altijd 1 zijn');
          } else {
            this.activeSourceCompetitionShell = this.activeConfig.getCompetitions().pop();
          }

        },
        /* error path */(e: string) => { this.setAlert('danger', e); this.processing = false; },
        /* onComplete */() => this.processing = false
      );
  }

  protected inCreateAndJoinPeriod(): boolean {
    const now = new Date();
    return this.activeConfig ? this.activeConfig.getCreateAndJoinPeriod().isIn(now) : false;
  }

  create(): boolean {

    this.processing = true;
    this.setAlert('info', 'de pool wordt aangemaakt');

    const name = this.form.controls.name.value;

    if (!this.activeSourceCompetitionShell) {
      return false;
    }

    this.competitionRepository.getObject(this.activeSourceCompetitionShell.id)
      .subscribe(
          /* happy path */(sourceCompetition: Competition) => {
          this.poolRepository.createObject(name, sourceCompetition)
            .subscribe(
              /* happy path */(pool: Pool) => {
                this.router.navigate(['/pool', pool.getId()]);
              },
              /* error path */ e => { this.setAlert('danger', 'de pool kon niet worden aangemaakt: ' + e); this.processing = false; },
            );
        }
      );
    return false;
  }

  protected setAlert(type: string, message: string) {
    this.alert = { 'type': type, 'message': message };
  }

  protected resetAlert(): void {
    this.alert = undefined;
  }
}
