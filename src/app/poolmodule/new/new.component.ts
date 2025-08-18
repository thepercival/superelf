import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { IAlert } from '../../shared/commonmodule/alert';
import { Pool } from '../../lib/pool';
import { PoolRepository } from '../../lib/pool/repository';
import { PoolCollection } from '../../lib/pool/collection';
import { CompetitionRepository } from '../../lib/ngx-sport/competition/repository';
import { Competition } from 'ngx-sport';
import { CompetitionConfigRepository } from '../../lib/competitionConfig/repository';
import { CompetitionConfig } from '../../lib/competitionConfig';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { TitleComponent } from '../../shared/commonmodule/title/title.component';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-pool-new',
  standalone: true,
  imports: [FontAwesomeModule,NgbAlertModule,TitleComponent, ReactiveFormsModule],
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {
  public form: UntypedFormGroup;
  public processing: WritableSignal<boolean> = signal(true);
  public alert: IAlert | undefined;
  public validations: any = {
    minlengthname: PoolCollection.MIN_LENGTH_NAME,
    maxlengthname: PoolCollection.MAX_LENGTH_NAME,
  };
  public competitionConfig: CompetitionConfig | undefined;
  public faSpinner = faSpinner;
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
        this.setAlert('danger', e); this.processing.set(false);
      },
      complete: () => this.processing.set(false)
    });
  }

  create(competitionConfig: CompetitionConfig): boolean {

    this.processing.set(true);
    this.setAlert('info', 'de pool wordt aangemaakt');

    const name = this.form.controls.name.value;


    this.poolRepository.createObject(name, competitionConfig).subscribe({
      next: (pool: Pool) => {
        this.router.navigate(['/pool/invite', pool.getId()]);
      },
      error: (e) => {
        this.setAlert('danger', 'de pool kon niet worden aangemaakt: ' + e); this.processing.set(false);
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
