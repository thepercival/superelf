import { Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../lib/auth/auth.service';
import { User } from '../../lib/user';
import { PasswordValidation } from '../password-validation';
import { AuthComponent } from '../component';
import { GlobalEventsManager } from '../../shared/commonmodule/eventmanager';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { UserTitleComponent } from '../title/title.component';
import { faEnvelope, faKey, faUserCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  standalone: true,
  selector: "app-register",
  imports: [NgbAlertModule, UserTitleComponent, FontAwesomeModule, ReactiveFormsModule],
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent extends AuthComponent implements OnInit {
  registered = false;
  form: UntypedFormGroup;
  public faUserCircle = faUserCircle;
  public faKey = faKey;
  public faEnvelope = faEnvelope;

  validations: UserValidations = {
    minlengthemailaddress: User.MIN_LENGTH_EMAIL,
    maxlengthemailaddress: User.MAX_LENGTH_EMAIL,
    minlengthname: User.MIN_LENGTH_NAME,
    maxlengthname: User.MAX_LENGTH_NAME,
    minlengthpassword: User.MIN_LENGTH_PASSWORD,
    maxlengthpassword: User.MAX_LENGTH_PASSWORD,
  };

  constructor(
    authService: AuthService,
    eventsManager: GlobalEventsManager,
    fb: UntypedFormBuilder
  ) {
    super(authService, eventsManager);
    this.form = fb.group(
      {
        emailaddress: [
          "",
          Validators.compose([
            Validators.required,
            Validators.minLength(this.validations.minlengthemailaddress),
            Validators.maxLength(this.validations.maxlengthemailaddress),
          ]),
        ],
        name: [
          "",
          Validators.compose([
            Validators.required,
            Validators.minLength(this.validations.minlengthname),
            Validators.maxLength(this.validations.maxlengthname),
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
        passwordRepeat: [
          "",
          Validators.compose([
            Validators.required,
            Validators.minLength(this.validations.minlengthpassword),
            Validators.maxLength(this.validations.maxlengthpassword),
          ]),
        ],
      },
      {
        validator: PasswordValidation.MatchPassword, // your validation method
      }
    );
  }

  ngOnInit() {
    this.processing.set(false);
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  register(): boolean {
    this.registered = false;
    this.processing.set(true);
    this.setAlert("info", "je wordt geregistreerd");

    // this.activationmessage = undefined;
    this.authService
      .register(
        this.form.controls.emailaddress.value,
        this.form.controls.name.value,
        this.form.controls.password.value
      )
      .subscribe({
        next: () => {
          this.registered = true;
          this.resetAlert();
        },
        error: (e) => {
          this.setAlert("danger", "het registreren is niet gelukt: " + e);
          this.processing.set(false);
        },
        complete: () => this.processing.set(false),
      });
    return false;
  }
}

export interface UserValidations {
  minlengthemailaddress: number;
  maxlengthemailaddress: number;
  minlengthname: number;
  maxlengthname: number;
  minlengthpassword: number;
  maxlengthpassword: number;
}
