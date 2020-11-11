import { Component, Input, OnInit } from '@angular/core';

import { AuthService } from '../../../lib/auth/auth.service';
import { User } from '../../../lib/user';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  @Input() title: string = '';
  navbarCollapsed = true;
  user: User | undefined

  constructor(
    public authService: AuthService,
  ) {

  }

  ngOnInit() {
    this.user = this.authService.getUser();
  }
}
