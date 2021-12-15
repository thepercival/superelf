import { Component, Input, OnInit } from '@angular/core';
import { AgainstGame, Team } from 'ngx-sport';
import { ImageRepository } from '../../lib/image/repository';

@Component({
  selector: 'app-againstgame-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss']
})
export class AgainstGameTitleComponent implements OnInit {
  @Input() againstGame!: AgainstGame;

  constructor(

  ) {

  }

  ngOnInit() {

  }

  // getName(team: Team): string {
  //   return this.fullName ? team.getName() : team.getAbbreviation() ?? '';
  // }

  // getImageUrl(team: Team): string {
  //   return this.imageRepository.getTeamUrl(team);
  // }
}
