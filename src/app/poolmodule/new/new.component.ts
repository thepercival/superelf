import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { IAlert } from '../../shared/commonmodule/alert';
import { Pool } from '../../lib/pool';
import { PoolRepository } from '../../lib/pool/repository';
import { JsonPool } from '../../lib/pool/json';
import { PoolCollection } from '../../lib/pool/collection';


@Component({
  selector: 'app-pool-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {
  form: FormGroup;
  processing = true;
  alert: IAlert;
  validations: any = {
    minlengthname: PoolCollection.MIN_LENGTH_NAME,
    maxlengthname: PoolCollection.MAX_LENGTH_NAME,
  };
  message: string;

  constructor(
    private router: Router,
    private poolRepository: PoolRepository,
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
    this.processing = false;
  }

  create(): boolean {

    this.processing = true;
    this.setAlert('info', 'de pool wordt aangemaakt');

    const name = this.form.controls.name.value;

    const jsonPool: JsonPool = {
      collection: { association: { name } },
      season: {
        name: 'dummy',
        startDateTime: (new Date()).toISOString(),
        endDateTime: (new Date()).toISOString(),
      },
      competitions: [],
      users: []
    };

    this.poolRepository.createObject(jsonPool)
      .subscribe(
        /* happy path */(pool: Pool) => {
          this.router.navigate(['/pooladmin', pool.getId()]);
        },
        /* error path */ e => { this.setAlert('danger', 'de pool kon niet worden aangemaakt: ' + e); this.processing = false; },
        /* onComplete */() => { this.processing = false; }
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
