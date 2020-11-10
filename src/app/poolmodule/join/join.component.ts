import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { IAlert } from '../../shared/commonmodule/alert';
import { PoolRepository } from '../../lib/pool/repository';
import { PoolCollection } from '../../lib/pool/collection';
import { PoolComponent } from '../../shared/poolmodule/component';


@Component({
  selector: 'app-pool-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss']
})
export class JoinComponent extends PoolComponent implements OnInit {
  key: string;
  joined: boolean = false;

  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
  ) {
    super(route, router, poolRepository);
  }

  ngOnInit() {
    super.parentNgOnInit(() => {
      this.join();
    });
  }

  protected join() {
    this.route.params.subscribe(params => {
      this.key = params['key'];
    });
    this.poolRepository.join(this.pool, this.key)
      .subscribe(
          /* happy path */() => {
          this.joined = true;
          this.setAlert('success', 'je bent nu ingeschreven');
        },
        /* error path */(e: string) => {
          this.setAlert('danger', e); this.processing = false;
        },
        /* onComplete */() => { this.processing = false }
      );
  }
}
