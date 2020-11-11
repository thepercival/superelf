import { Component, Input } from '@angular/core';
import { MyNavigation } from '../../shared/commonmodule/navigation';

@Component({
  selector: 'app-user-title',
  templateUrl: './title.component.html'
})
export class UserTitleComponent {

  @Input() title: string = '';
  @Input() icon: string | undefined;

  constructor(private myNavigation: MyNavigation) {
  }

  navigateBack() {
    this.myNavigation.back();
  }
}

