import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../lib/auth/auth.service';
import { Pool } from '../../lib/pool';

import { PoolRepository } from '../../lib/pool/repository';
import { GlobalEventsManager } from '../../shared/commonmodule/eventmanager';
import { StartSessionService } from '../../shared/commonmodule/startSessionService';
import { PoolComponent } from '../../shared/poolmodule/component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { faEnvelope, faSpinner, faUserCircle, faSignInAlt } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: "app-pool-join",
  standalone: true,
  imports: [FontAwesomeModule, NgbAlertModule, RouterModule],
  templateUrl: "./join.component.html",
  styleUrls: ["./join.component.scss"],
})
export class JoinComponent extends PoolComponent implements OnInit {
  key: string | undefined;
  joined: boolean = false;

  public faEnvelope = faEnvelope;
  public faSpinner = faSpinner;
  public faUserCircle = faUserCircle;
  public faSignInAlt = faSignInAlt;

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
      this.route.params.subscribe((params) => {
        this.startSessionService.setJoinAction(params["id"], params["key"]);
      });
      this.processing.set(false);
    } else {
      super.parentNgOnInit().subscribe({
        next: (pool: Pool) => {
          this.setPool(pool);
          this.join(pool);
        },
        error: (e) => {
          this.setAlert("danger", e);
          this.processing.set(false);
        },
      });
    }
  }

  protected join(pool: Pool) {
    this.route.params.subscribe((params) => {
      this.key = params["key"];
    });
    if (!this.key) {
      this.processing.set(false);
      return;
    }
    this.poolRepository.join(pool, this.key).subscribe({
      next: () => {
        this.joined = true;
        this.setAlert("success", "je bent nu ingeschreven");
      },
      error: (e) => {
        this.setAlert("danger", e);
        this.processing.set(false);
      },
      complete: () => this.processing.set(false),
    });
  }
}
