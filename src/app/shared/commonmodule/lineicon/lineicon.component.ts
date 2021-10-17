import { Component, Input } from '@angular/core';
import { FootballLine } from 'ngx-sport';
import { SuperElfNameService } from '../../../lib/nameservice';

@Component({
  selector: 'app-lineicon',
  templateUrl: './lineicon.component.html'
})
export class LineIconComponent {

  @Input() line!: FootballLine;

  constructor(private nameService: SuperElfNameService) {
  }

  getAbbreviation(): string {
    return this.nameService.getLineName(this.line).substr(0, 1);
  }

  getClass(): string {
    return 'line-' + this.line;
  }
}