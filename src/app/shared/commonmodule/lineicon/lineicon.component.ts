import { Component, Input } from '@angular/core';
import { FootballLine } from 'ngx-sport';
import { SuperElfNameService } from '../../../lib/nameservice';

@Component({
  selector: 'app-lineicon',
  templateUrl: './lineicon.component.html'
})
export class LineIconComponent {

  @Input() line!: FootballLine;
  @Input() abbreviate: boolean = true;

  constructor(private nameService: SuperElfNameService) {
  }

  getName(): string {
    const lineName = this.nameService.getLineName(this.line);
    return this.abbreviate ? lineName.substr(0, 1) : lineName;
  }

  getClass(): string {
    return 'line-' + this.line;
  }
}