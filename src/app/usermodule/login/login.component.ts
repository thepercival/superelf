import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { ActivatedRoute, RouterLink } from '@angular/router';

import { AuthService } from '../../lib/auth/auth.service';
import { User } from '../../lib/user';
import { AuthComponent } from '../component';
import { GlobalEventsManager } from '../../shared/commonmodule/eventmanager';
import { StartSessionService } from '../../shared/commonmodule/startSessionService';
import { UserTitleComponent } from '../title/title.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { faEnvelope, faKey, faSignInAlt, faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
  standalone: true,
  selector: "app-login",
  imports: [UserTitleComponent, FontAwesomeModule, NgbAlertModule,ReactiveFormsModule,RouterLink],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent extends AuthComponent implements OnInit {
  registered = false;
  form: UntypedFormGroup;

  faSignInAlt = faSignInAlt;
  faSpinner = faSpinner;
  faKey = faKey;
  faEnvelope = faEnvelope;

  constructor(
    protected route: ActivatedRoute,
    private startSessionService: StartSessionService,
    authService: AuthService,
    eventsManager: GlobalEventsManager,
    fb: UntypedFormBuilder
  ) {
    super(authService, eventsManager);
    if (this.isLoggedIn()) {
      this.authService.logout();
    }
    this.form = fb.group({
      emailaddress: new FormControl("", [
        Validators.required,
        Validators.minLength(User.MIN_LENGTH_EMAIL),
        Validators.maxLength(User.MAX_LENGTH_EMAIL),
      ]),
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(User.MIN_LENGTH_PASSWORD),
        Validators.maxLength(User.MAX_LENGTH_PASSWORD),
      ]),
    });
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  ngOnInit() {
    this.route.queryParams.subscribe((param: any) => {
      if (param.message !== undefined) {
        this.setAlert("info", param.message);
      }
    });
    this.processing.set(false);
  }

  protected setAlert(type: string, message: string) {
    this.alert = { type: type, message: message };
  }

  protected resetAlert() {
    this.alert = undefined;
  }

  login(): boolean {
    this.processing.set(true);
    this.setAlert("info", "je wordt ingelogd");

    const emailaddress = this.form.controls.emailaddress.value;
    const password = this.form.controls.password.value;

    this.authService.login(emailaddress, password).subscribe({
      next: (p: boolean) => {
        this.startSessionService.navigate();
      },
      error: (e) => {
        this.setAlert("danger", e);
        this.processing.set(false);
      },
      complete: () => (this.processing.set(false)),
    });
    return false;
  }

  get control() {
    return this.form.controls;
  }
}
