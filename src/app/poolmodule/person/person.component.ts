import { Component, Input, OnInit } from '@angular/core';
import { Person, Team } from 'ngx-sport';

import { CSSService } from '../../shared/commonmodule/cssservice';

@Component({
  selector: 'app-person-test',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})
export class PersonComponent implements OnInit {
  @Input() person: Person | undefined;
  @Input() team: Team | undefined;
  public processing = true;
  public teamImageUrl: string | undefined;
  public teamName: string = '';
  public personImageUrl: string | undefined;

  constructor(
    public cssService: CSSService) {
  }

  ngOnInit() {
    if (this.team) {
      this.teamName = this.team?.getName();
      this.teamImageUrl = this.team.getImageUrl();
    }
    this.personImageUrl = this.person?.getImageUrl();
    this.processing = false;
  }
}
