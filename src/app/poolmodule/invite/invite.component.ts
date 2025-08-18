import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { PoolRepository } from '../../lib/pool/repository';
import { PoolCollection } from '../../lib/pool/collection';
import { PoolComponent } from '../../shared/poolmodule/component';
import { Pool } from '../../lib/pool';
import { GlobalEventsManager } from '../../shared/commonmodule/eventmanager';
import { PoolUserRepository } from '../../lib/pool/user/repository';
import { PoolUser } from '../../lib/pool/user';
import { NavBarItem } from '../../shared/poolmodule/poolNavBar/items';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PoolNavBarComponent } from '../../shared/poolmodule/poolNavBar/poolNavBar.component';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { faSpinner, faClipboardCheck, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { ClipboardModule } from 'ngx-clipboard';


@Component({
  selector: "app-pool-invite",
  standalone: true,
  imports: [
    FontAwesomeModule,
    PoolNavBarComponent,
    NgbAlertModule,
    ReactiveFormsModule,
    ClipboardModule,
  ],
  templateUrl: "./invite.component.html",
  styleUrls: ["./invite.component.scss"],
})
export class InviteComponent extends PoolComponent implements OnInit {
  form: UntypedFormGroup;
  validations: any = {
    minlengthname: PoolCollection.MIN_LENGTH_NAME,
    maxlengthname: PoolCollection.MAX_LENGTH_NAME,
  };
  public faSpinner = faSpinner;
  public faClipboardCheck = faClipboardCheck;
  public faEnvelope = faEnvelope;

  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    globalEventsManager: GlobalEventsManager,
    fb: UntypedFormBuilder,
    protected poolUserRepository: PoolUserRepository
  ) {
    super(route, router, poolRepository, globalEventsManager);
    this.form = fb.group({
      url: [{ value: "", disabled: true }, Validators.compose([])],
    });
  }

  ngOnInit() {
    super.parentNgOnInit().subscribe({
      next: (pool: Pool) => {
        this.setPool(pool);
        this.setAlert("info", "gebruik de link om mensen uit te nodigen");
        this.initUrl(pool);

        this.poolUserRepository.getObjectFromSession(pool).subscribe({
          next: (poolUser: PoolUser) => {
            this.poolUserFromSession = poolUser;
          },
          error: (e: string) => {
            this.setAlert("danger", e);
            this.processing.set(false);
          },
          complete: () => this.processing.set(false),
        });
      },
      error: (e) => {
        this.setAlert("danger", e);
        this.processing.set(false);
      },
    });
  }

  get Invite(): NavBarItem {
    return NavBarItem.Invite;
  }

  initUrl(pool: Pool) {
    this.poolRepository.getJoinUrl(pool).subscribe({
      next: (joinUrl: string) => {
        this.form.controls.url.setValue(joinUrl);
        this.form.controls.url.disable();
      },
      error: (e) => {
        this.setAlert("danger", e);
        this.processing.set(false);
      },
      complete: () => this.processing.set(false),
    });
  }

  showCopiedToClipboard() {
    this.setAlert("success", "de link is gekopieerd naar het klembord");
  }
}
