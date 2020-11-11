import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { MyNavigation } from '../../commonmodule/navigation';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html'
})
export class TitleComponent {

  @Input() title: string = '';
  @Input() poolId: number | undefined;

  constructor(private router: Router, private myNavigation: MyNavigation) {
  }

  navigateBack() {
    if (this.poolId) {
      this.router.navigate(['/pool', this.poolId]);
    } else {
      this.myNavigation.back();
    }
  }
}

