import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from '../../lib/user';
import { PasswordValidation } from '../password-validation';
import { UserRepository } from '../../lib/user/repository';
import { AuthService } from '../../lib/auth/auth.service';
import { MyNavigation } from '../../shared/commonmodule/navigation';
import { AuthComponent } from '../component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent extends AuthComponent implements OnInit {
  user: User | undefined;
  form: FormGroup;

  validations: UserValidations = {
    minlengthemailaddress: User.MIN_LENGTH_EMAIL,
    maxlengthemailaddress: User.MAX_LENGTH_EMAIL
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    authService: AuthService,
    private userRepository: UserRepository,
    public myNavigation: MyNavigation,
    fb: FormBuilder
  ) {
    super(authService);
    this.form = fb.group({
      emailaddress: ['', Validators.compose([
        Validators.required,
        Validators.minLength(this.validations.minlengthemailaddress),
        Validators.maxLength(this.validations.maxlengthemailaddress)
      ])],
    }, {
      validator: PasswordValidation.MatchPassword // your validation method
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userRepository.getObject(+params['id'])
        .subscribe(
                /* happy path */(user: User) => {
            this.user = user;
            this.form.controls.emailaddress.setValue(this.user.getEmailaddress());
          },
            /* error path */ e => { this.setAlert('danger', e); this.processing = false; },
            /* onComplete */() => this.processing = false
        );
    });
  }

  save(): boolean {
    if (!this.user) {
      return false;
    }
    this.processing = true;
    const emailaddress = this.form.controls.emailaddress.value;
    this.userRepository.editObject({ id: this.user.getId(), emailaddress: emailaddress })
      .subscribe(
            /* happy path */() => {
          this.setAlert('success', 'het emailadres is opgeslagen');
          this.form.controls.emailaddress.setValue(emailaddress);
          // this.processing = false;
        },
            /* error path */ e => { this.setAlert('danger', 'het opslaan is niet gelukt: ' + e); this.processing = false; },
            /* onComplete */() => this.processing = false
      );
    return false;
  }

  remove() {
    if (!this.user) {
      return false;
    }
    this.processing = true;
    this.userRepository.removeObject(this.user.getId())
      .subscribe(
            /* happy path */() => {
          this.authService.logout();
          this.router.navigate(['']);
          // this.processing = false;
        },
            /* error path */ e => { this.setAlert('danger', 'het opslaan is niet gelukt: ' + e); this.processing = false; },
            /* onComplete */() => this.processing = false
      );
  }
}

export interface UserValidations {
  minlengthemailaddress: number;
  maxlengthemailaddress: number;
}
