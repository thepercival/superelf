import { Component, Input } from '@angular/core';
import { FootballLine } from 'ngx-sport';
import { SuperElfNameService } from '../../../lib/nameservice';
import { CSSService } from '../cssservice';

@Component({
  selector: 'app-lineicon',
  styleUrls: ['./lineicon.component.scss'],
  templateUrl: './lineicon.component.html'
})
export class LineIconComponent {

  @Input() line!: FootballLine;
  @Input() abbreviate: boolean = true;

  constructor(private nameService: SuperElfNameService, public cssService: CSSService) {
  }

  getName(): string {
    const lineName = this.nameService.getLineName(this.line);
    return this.abbreviate ? lineName.substring(0, 1) : lineName;
  }
}