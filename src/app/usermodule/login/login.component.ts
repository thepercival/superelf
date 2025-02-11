import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../lib/auth/auth.service';
import { User } from '../../lib/user';
import { AuthComponent } from '../component';
import { GlobalEventsManager } from '../../shared/commonmodule/eventmanager';
import { StartSessionService } from '../../shared/commonmodule/startSessionService';
import { NgIf } from '@angular/common';
import { UserTitleComponent } from '../title/title.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  standalone: true,
  selector: "app-login",
  imports: [NgIf, UserTitleComponent, FontAwesomeModule, NgbAlertModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent extends AuthComponent implements OnInit {
  registered = false;
  form: UntypedFormGroup;

  validations: any = {
    minlengthemailaddress: User.MIN_LENGTH_EMAIL,
    maxlengthemailaddress: User.MAX_LENGTH_EMAIL,
    minlengthpassword: User.MIN_LENGTH_PASSWORD,
    maxlengthpassword: User.MAX_LENGTH_PASSWORD,
  };

  constructor(
    protected route: ActivatedRoute,
    private startSessionService: StartSessionService,
    authService: AuthService,
    eventsManager: GlobalEventsManager,
    fb: UntypedFormBuilder
  ) {
    super(authService, eventsManager);
    this.form = fb.group({
      emailaddress: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(this.validations.minlengthemailaddress),
          Validators.maxLength(this.validations.maxlengthemailaddress),
        ]),
      ],
      password: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(this.validations.minlengthpassword),
          Validators.maxLength(this.validations.maxlengthpassword),
        ]),
      ],
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
    if (this.isLoggedIn()) {
      this.setAlert("danger", "je bent al ingelogd");
    }
    this.processing = false;
  }

  protected setAlert(type: string, message: string) {
    this.alert = { type: type, message: message };
  }

  protected resetAlert() {
    this.alert = undefined;
  }

  login(): boolean {
    this.processing = true;
    this.setAlert("info", "je wordt ingelogd");

    const emailaddress = this.form.controls.emailaddress.value;
    const password = this.form.controls.password.value;

    this.authService.login(emailaddress, password).subscribe({
      next: (p: boolean) => {
        this.startSessionService.navigate();
      },
      error: (e) => {
        this.setAlert("danger", e);
        this.processing = false;
      },
      complete: () => (this.processing = false),
    });
    return false;
  }

  get control() {
    return this.form.controls;
  }

  isValid(control: AbstractControl): boolean {
    return control.value !== undefined && control.valid;
  }

  isInvalid(control: AbstractControl): boolean {
    return control.value !== undefined && control.invalid;
  }
}
