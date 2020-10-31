import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { MyNavigation } from '../../commonmodule/navigation';
import { Pool } from '../../../lib/pool';

@Component({
  selector: 'app-pool-title',
  templateUrl: './title.component.html'
})
export class TitleComponent {

  @Input() pool: Pool;
  @Input() admin: boolean;

  constructor(private router: Router, private myNavigation: MyNavigation) {
  }

  navigateBack() {
    if (this.admin && this.pool) {
      this.router.navigate(['/admin', this.pool.getId()]);
    } else {
      this.myNavigation.back();
    }
  }
}
