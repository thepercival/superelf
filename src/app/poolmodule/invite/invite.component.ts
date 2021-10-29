import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { IAlert } from '../../shared/commonmodule/alert';
import { PoolRepository } from '../../lib/pool/repository';
import { PoolCollection } from '../../lib/pool/collection';
import { PoolComponent } from '../../shared/poolmodule/component';
import { Pool } from '../../lib/pool';


@Component({
  selector: 'app-pool-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})
export class InviteComponent extends PoolComponent implements OnInit {
  form: FormGroup;
  validations: any = {
    minlengthname: PoolCollection.MIN_LENGTH_NAME,
    maxlengthname: PoolCollection.MAX_LENGTH_NAME,
  };

  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    fb: FormBuilder
  ) {
    super(route, router, poolRepository);
    this.form = fb.group({
      url: [{ value: '', disabled: true }, Validators.compose([
      ])],
    });
  }

  ngOnInit() {
    super.parentNgOnInit().subscribe((pool: Pool) => {
      this.pool = pool;
      this.setAlert('info', 'gebruik de link om mensen uit te nodigen');
      this.initUrl(pool);
    }, /* error path */(e: string) => { this.setAlert('danger', e); this.processing = false; });
  }

  initUrl(pool: Pool) {
    this.poolRepository.getJoinUrl(pool)
      .subscribe(
          /* happy path */(joinUrl: string) => {
          this.form.controls.url.setValue(joinUrl);
          this.form.controls.url.disable();

        },
        /* error path */(e: string) => {
          this.setAlert('danger', e); this.processing = false;
        },
        /* onComplete */() => { this.processing = false }
      );
  }

  showCopiedToClipboard() {
    this.setAlert('success', 'de link is gekopieerd naar het klembord');
  }
}
