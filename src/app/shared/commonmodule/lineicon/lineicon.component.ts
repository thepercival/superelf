import { Component, input } from '@angular/core';
import { FootballLine } from 'ngx-sport';
import { SuperElfNameService } from '../../../lib/nameservice';
import { CSSService } from '../cssservice';

@Component({
  selector: 'app-lineicon',
  standalone: true,
  imports: [],
  styleUrls: ['./lineicon.component.scss'],
  templateUrl: './lineicon.component.html'
})
export class LineIconComponent {

  readonly line = input.required<FootballLine>();
  readonly abbreviate = input<boolean>(true);

  constructor(private nameService: SuperElfNameService, public cssService: CSSService) {
  }

  getName(): string {
    const lineName = this.nameService.getLineName(this.line());
    return this.abbreviate() ? lineName.substring(0, 1) : lineName;
  }
}