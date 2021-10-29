import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IconName } from '@fortawesome/fontawesome-svg-core';

import { MyNavigation } from '../../commonmodule/navigation';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html'
})
export class TitleComponent {
  @Input() iconName: IconName | undefined;
  @Input() center: boolean = false;
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

