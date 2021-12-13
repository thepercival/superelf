import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pool } from '../../lib/pool';

import { PoolRepository } from '../../lib/pool/repository';
import { PoolComponent } from '../../shared/poolmodule/component';


@Component({
  selector: 'app-pool-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss']
})
export class JoinComponent extends PoolComponent implements OnInit {
  key: string | undefined;
  joined: boolean = false;

  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
  ) {
    super(route, router, poolRepository);
  }

  ngOnInit() {
    super.parentNgOnInit().subscribe({
      next: (pool: Pool) => {
        this.pool = pool;
        this.join(pool);
      },
      error: (e) => {
        this.setAlert('danger', e); this.processing = false;
      }
    });
  }

  protected join(pool: Pool) {
    this.route.params.subscribe(params => {
      this.key = params['key'];
    });
    if (!this.key) {
      this.processing = false;
      return;
    }
    this.poolRepository.join(pool, this.key).subscribe({
      next: () => {
        this.joined = true;
        this.setAlert('success', 'je bent nu ingeschreven');
      },
      error: (e) => {
        this.setAlert('danger', e); this.processing = false;
      },
      complete: () => this.processing = false
    });
  }
}
