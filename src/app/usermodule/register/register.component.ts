import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../lib/auth/auth.service';
import { User } from '../../lib/user';
import { PasswordValidation } from '../password-validation';
import { AuthComponent } from '../component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent extends AuthComponent implements OnInit {
  registered = false;
  form: FormGroup;

  validations: UserValidations = {
    minlengthemailaddress: User.MIN_LENGTH_EMAIL,
    maxlengthemailaddress: User.MAX_LENGTH_EMAIL,
    minlengthname: User.MIN_LENGTH_NAME,
    maxlengthname: User.MAX_LENGTH_NAME,
    minlengthpassword: User.MIN_LENGTH_PASSWORD,
    maxlengthpassword: User.MAX_LENGTH_PASSWORD
  };

  constructor(
    authService: AuthService,
    fb: FormBuilder
  ) {
    super(authService);
    this.form = fb.group({
      emailaddress: ['', Validators.compose([
        Validators.required,
        Validators.minLength(this.validations.minlengthemailaddress),
        Validators.maxLength(this.validations.maxlengthemailaddress)
      ])],
      name: ['', Validators.compose([
        Validators.required,
        Validators.minLength(this.validations.minlengthname),
        Validators.maxLength(this.validations.maxlengthname)
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
    this.processing = false;
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  register(): boolean {
    this.registered = false;
    this.processing = true;
    this.setAlert('info', 'je wordt geregistreerd');

    // this.activationmessage = undefined;
    this.authService.register(
      this.form.controls.emailaddress.value,
      this.form.controls.name.value,
      this.form.controls.password.value
    )
      .subscribe(
            /* happy path */() => {
          this.registered = true;
          this.resetAlert();
        },
            /* error path */ e => { this.setAlert('danger', 'het registreren is niet gelukt: ' + e); this.processing = false; },
            /* onComplete */() => this.processing = false
      );
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
