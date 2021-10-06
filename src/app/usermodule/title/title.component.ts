import { Component, Input } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { MyNavigation } from '../../shared/commonmodule/navigation';

@Component({
  selector: 'app-user-title',
  templateUrl: './title.component.html'
})
export class UserTitleComponent {

  @Input() title: string = '';
  @Input() icon: IconName | undefined;

  constructor(private myNavigation: MyNavigation) {
  }

  navigateBack() {
    this.myNavigation.back();
  }
}

