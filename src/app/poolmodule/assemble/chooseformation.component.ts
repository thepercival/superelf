import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JsonFormationShell } from '../../lib/activeConfig/json';
import { pairwise } from 'rxjs/operators';
import { PoolUser } from '../../lib/pool/user';
import { Formation } from '../../lib/formation';
import { FormationRepository } from '../../lib/formation/repository';
import { IAlert } from '../../shared/commonmodule/alert';

@Component({
  selector: 'app-pool-chooseformation',
  templateUrl: './chooseformation.component.html',
  styleUrls: ['./chooseformation.component.scss']
})
export class ChooseFormationComponent implements OnInit {
  form: FormGroup;
  @Input() availableFormations: JsonFormationShell[] = [];
  @Input() poolUser!: PoolUser;
  @Output() alert = new EventEmitter<IAlert>();
  @Output() processing = new EventEmitter<boolean>();
  @Output() formation = new EventEmitter<Formation | undefined>();

  constructor(
    protected formationRepository: FormationRepository,
    fb: FormBuilder,
    private modalService: NgbModal
  ) {
    this.form = fb.group({
      formation: [undefined]
    });
  }

  ngOnInit() {
    this.onChanges();
    const formation = this.poolUser.getAssembleFormation();
    if (!formation) {
      this.form.controls.formation.setValue(undefined);
      return;
    }

    this.form.controls.formation.setValue(this.availableFormations.find(formationShell => {
      return formationShell.name === formation.getName();
    }));

  }

  onChanges(): void {
    this.form.controls.formation.valueChanges
      .pipe(pairwise())
      .subscribe(([prev, next]) => {
        if (prev === undefined && next) {
          this.addFormation(next);
        } else if (prev && next === undefined) {
          this.removeFormation();
        } else { // update
          this.editFormation(next);
        }
      },
      /* error path */(e: string) => { this.emitAlert('danger', e); });
  }

  protected emitProcessing(processing: boolean) {
    this.processing.emit(processing);
  }

  protected emitAlert(type: string, message: string) {
    this.alert.emit({ type, message });
  }

  protected addFormation(newFormationShell: JsonFormationShell) {
    this.emitProcessing(true);
    this.formationRepository.createObject(newFormationShell, this.poolUser).subscribe(
      /* happy path */(formation: Formation) => {
        this.formation.emit(formation);
      },
      /* error path */(e: string) => { this.emitAlert('danger', e); this.emitProcessing(false); },
      /* onComplete */() => this.emitProcessing(false)
    );
  }

  editFormation(newFormationShell: JsonFormationShell) {
    const formation = this.poolUser.getAssembleFormation();
    if (!formation) {
      return;
    }
    this.emitProcessing(true);
    // @TODO kijk als er linies zijn waarbij spelers wegvallen, zo ja toon popup
    this.formationRepository.editObject(newFormationShell, formation).subscribe(
      /* happy path */(newFormation: Formation) => {
        this.poolUser.setAssembleFormation(newFormation);
        this.formation.emit(newFormation);
        this.emitProcessing(false);
      },
      /* error path */(e: string) => { this.emitAlert('danger', e); this.emitProcessing(false); },
      /* onComplete */() => this.emitProcessing(false)
    );

  }

  protected removeFormation() {
    const assembleFormation = this.poolUser.getAssembleFormation();
    if (!assembleFormation) {
      return;
    }
    this.emitProcessing(true);
    this.formationRepository.removeObject(assembleFormation).subscribe(
      /* happy path */() => {
        this.poolUser.setAssembleFormation(undefined);
        this.formation.emit(undefined);
        this.emitProcessing(false)
      },
      /* error path */(e: string) => { this.emitAlert('danger', e); this.emitProcessing(false); },
      /* onComplete */() => this.emitProcessing(false)
    );
  }
}

