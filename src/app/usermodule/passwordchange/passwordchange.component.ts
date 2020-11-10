import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../lib/auth/auth.service';
import { IAlert } from '../../shared/commonmodule/alert';
import { User } from '../../lib/user';
import { PasswordValidation } from '../password-validation';
import { AuthComponent } from '../component';

@Component({
  selector: 'app-passwordchange',
  templateUrl: './passwordchange.component.html',
  styleUrls: ['./passwordchange.component.css']
})
export class PasswordchangeComponent extends AuthComponent implements OnInit {
  passwordChanged = false;
  form: FormGroup;

  validations: any = {
    minlengthcode: 100000,
    maxlengthcode: 999999,
    minlengthpassword: User.MIN_LENGTH_PASSWORD,
    maxlengthpassword: User.MAX_LENGTH_PASSWORD
  };
  private emailaddress: string | undefined;

  constructor(
    private route: ActivatedRoute,
    authService: AuthService,
    fb: FormBuilder
  ) {
    super(authService);
    this.form = fb.group({
      code: ['', Validators.compose([
        Validators.required,
        Validators.min(this.validations.minlengthcode),
        Validators.max(this.validations.maxlengthcode)
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(this.validations.minlengthpassword),
        Validators.maxLength(this.validations.maxlengthpassword)
      ])],
      passwordRepeat: ['', Validators.compose([
        Validators.required,
        Validators.minLength(this.validations.minlengthpassword),
        Validators.maxLength(this.validations.maxlengthpassword)
      ])],
    }, {
      validator: PasswordValidation.MatchPassword // your validation method
    });
  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const emailaddress = params.get('emailaddress');
      this.emailaddress = emailaddress !== null ? emailaddress : undefined;
    });
    this.processing = false;
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  changePassword(): boolean {
    this.processing = true;
    this.setAlert('info', 'het wachtwoord wordt gewijzigd');

    const code = this.form.controls.code.value;
    const password = this.form.controls.password.value;

    if (!this.emailaddress) {
      return false;
    }
    // this.activationmessage = undefined;
    this.authService.passwordChange(this.emailaddress, password, code)
      .subscribe(
            /* happy path */ p => {
          this.passwordChanged = true;
          this.resetAlert();
        },
            /* error path */ e => {
          this.setAlert('danger', 'het wijzigen van het wachtwoord is niet gelukt: ' + e);
          this.processing = false;
        },
            /* onComplete */() => this.processing = false
      );
    return false;
  }
}
