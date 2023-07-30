import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { IAlert } from '../../shared/commonmodule/alert';
import { Pool } from '../../lib/pool';
import { PoolRepository } from '../../lib/pool/repository';
import { PoolCollection } from '../../lib/pool/collection';
import { CompetitionRepository } from '../../lib/ngx-sport/competition/repository';
import { Competition } from 'ngx-sport';
import { CompetitionConfigRepository } from '../../lib/competitionConfig/repository';
import { CompetitionConfig } from '../../lib/competitionConfig';


@Component({
  selector: 'app-pool-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {
  public form: UntypedFormGroup;
  public processing = true;
  public alert: IAlert | undefined;
  public validations: any = {
    minlengthname: PoolCollection.MIN_LENGTH_NAME,
    maxlengthname: PoolCollection.MAX_LENGTH_NAME,
  };
  public competitionConfig: CompetitionConfig | undefined;
  // activeSourceCompetitionShell: JsonCompetitionShell | undefined;

  constructor(
    private router: Router,
    private competitionConfigRepository: CompetitionConfigRepository,
    private poolRepository: PoolRepository,
    private competitionRepository: CompetitionRepository,
    fb: UntypedFormBuilder
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
    this.competitionConfigRepository.getActiveObjects().subscribe({
      next: (competitionConfigs: CompetitionConfig[]) => {
        const competitionConfig = competitionConfigs.pop();
        if (competitionConfig === undefined) {
          this.setAlert('danger', 'er is geen actieve inschrijfperiode');
        } else if (!competitionConfig.getCreateAndJoinPeriod().isIn()) {
          const period = competitionConfig.getCreateAndJoinPeriod();
          this.setAlert('danger', 'het organiseren van een pool kan alleen van ' + period.getStartDateTime().toLocaleString() + ' tot ' + period.getEndDateTime().toLocaleString());
        } else {
          this.setAlert('info', 'wanneer je dezelfde naam gebruikt voor meerdere seizoenen, dan wordt er ook een alltime-ranking bijgehouden');
        }
        this.competitionConfig = competitionConfig;
      },
      error: (e) => {
        this.setAlert('danger', e); this.processing = false;
      },
      complete: () => this.processing = false
    });
  }

  create(competitionConfig: CompetitionConfig): boolean {

    this.processing = true;
    this.setAlert('info', 'de pool wordt aangemaakt');

    const name = this.form.controls.name.value;


    this.poolRepository.createObject(name, competitionConfig).subscribe({
      next: (pool: Pool) => {
        this.router.navigate(['/pool/invite', pool.getId()]);
      },
      error: (e) => {
        this.setAlert('danger', 'de pool kon niet worden aangemaakt: ' + e); this.processing = false;
      }
    });
    return false;
  }

  protected setAlert(type: string, message: string) {
    this.alert = { 'type': type, 'message': message };
  }

  protected resetAlert(): void {
    this.alert = undefined;
  }
}
