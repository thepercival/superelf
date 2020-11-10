import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../lib/auth/auth.service';
import { AuthComponent } from '../component';

@Component({
  selector: 'app-validate',
  templateUrl: './validate.component.html',
  styleUrls: ['./validate.component.css']
})
export class ValidateComponent extends AuthComponent implements OnInit {
  protected emailaddress: string | undefined;
  protected key: string | undefined;
  public validated = false;

  constructor(
    protected route: ActivatedRoute,
    private router: Router,
    authService: AuthService,
  ) {
    super(authService);
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.emailaddress = params['emailaddress'];
      this.key = params['key'];
    });
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/', 'warning', 'je bent al ingelogd']);
    }
    this.validate();
  }

  isLoggedIn() {
    return;
  }

  validate(): boolean {
    this.setAlert('info', 'je emailadres wordt gevalideerd');
    if (this.emailaddress === undefined || this.key === undefined) {
      return false;
    }
    this.authService.validate(this.emailaddress, this.key)
      .subscribe(
            /* happy path */(validated) => {
          this.validated = validated;
          this.setAlert('success', 'je emailadres is gevalideerd en je bent meteen ingelogd');
        },
            /* error path */ e => { this.setAlert('danger', 'het valideren is niet gelukt: ' + e); this.processing = false; },
            /* onComplete */() => this.processing = false
      );
    return false;
  }
}
