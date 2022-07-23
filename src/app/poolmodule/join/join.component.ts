import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AuthService } from '../../lib/auth/auth.service';
import { Pool } from '../../lib/pool';

import { PoolRepository } from '../../lib/pool/repository';
import { GlobalEventsManager } from '../../shared/commonmodule/eventmanager';
import { StartSessionService } from '../../shared/commonmodule/startSessionService';
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
    protected authService: AuthService,
    private startSessionService: StartSessionService,
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    globalEventsManager: GlobalEventsManager
  ) {
    super(route, router, poolRepository, globalEventsManager);
  }

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.route.params.subscribe(params => {
        this.startSessionService.setJoinAction(params['id'], params['key']);;
      });
      this.processing = false;
    } else {
      super.parentNgOnInit().subscribe({
        next: (pool: Pool) => {
          this.setPool(pool);
          this.join(pool);
        },
        error: (e) => {
          this.setAlert('danger', e); this.processing = false;
        }
      });
    }
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
