import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

import { AuthService } from '../auth.service';

@Injectable()
export class AuthUserGuardService  {

  constructor(private router: Router, private authService: AuthService) { }

  canActivate() {
    if (this.authService.isLoggedIn()) {
      // logged in so return true
      return true;
    }
    const navigationExtras: NavigationExtras = {
      queryParams: { type: 'warning', message: 'je bent niet ingelogd en teruggestuurd naar de homepagina' }
    };
    this.router.navigate(['/'], navigationExtras);
    return false;
  }

}
