import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../lib/auth/auth.service';
import { AuthComponent } from '../component';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent extends AuthComponent implements OnInit {

  constructor(private router: Router, authService: AuthService) {
    super(authService);
  }

  ngOnInit() {
    // reset login status
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
