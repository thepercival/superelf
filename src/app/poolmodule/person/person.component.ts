import { Component, Input, OnInit } from '@angular/core';
import { Person } from 'ngx-sport';

import { CSSService } from '../../shared/commonmodule/cssservice';

@Component({
  selector: 'app-person-test',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})
export class PersonComponent implements OnInit {
  @Input() person: Person | undefined;
  public processing = true;
  public teamImageUrl: string | undefined;
  public teamName: string = '';

  constructor(
    public cssService: CSSService) {
  }

  ngOnInit() {
    const team = this.person?.getPlayer()?.getTeam();
    if (team) {
      console.log(this.person);
      this.teamName = team.getName();
    }
    this.teamImageUrl = team?.getImageUrl();
    this.processing = false;
  }
}
