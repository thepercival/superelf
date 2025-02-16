import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../lib/auth/auth.service';
import { GlobalEventsManager } from '../../shared/commonmodule/eventmanager';
import { StartSessionService } from '../../shared/commonmodule/startSessionService';
import { AuthComponent } from '../component';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { UserTitleComponent } from '../title/title.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  standalone: true,
  imports: [NgbAlertModule, UserTitleComponent, FontAwesomeModule],
  selector: "app-validate",
  templateUrl: "./validate.component.html",
  styleUrls: ["./validate.component.css"],
})
export class ValidateComponent extends AuthComponent implements OnInit {
  faUserCirlce = faUserCircle;  
  protected emailaddress: string | undefined;
  protected key: string | undefined;
  public validated = false;

  constructor(
    @Inject("route") protected route: ActivatedRoute,
    @Inject("router") private router: Router,
    private startSessionService: StartSessionService,
    authService: AuthService,
    eventsManager: GlobalEventsManager
  ) {
    super(authService, eventsManager);
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.emailaddress = params["emailaddress"];
      this.key = params["key"];
    });
    if (this.authService.isLoggedIn()) {
      this.router.navigate(["/", "warning", "je bent al ingelogd"]);
    }
    this.validate();
  }

  isLoggedIn() {
    return;
  }

  validate(): boolean {
    this.setAlert("info", "je emailadres wordt gevalideerd");
    if (this.emailaddress === undefined || this.key === undefined) {
      return false;
    }
    this.authService.validate(this.emailaddress, this.key).subscribe({
      next: (validated: boolean) => {
        this.validated = validated;
        this.startSessionService.navigate();
      },
      error: (e) => {
        this.setAlert("danger", "het valideren is niet gelukt: " + e);
        this.processing.set(false);
      },
      complete: () => (this.processing.set(false)),
    });
    return false;
  }
}
