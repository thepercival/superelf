import { Component, Input, OnInit } from '@angular/core';
import { Person, Player } from 'ngx-sport';
import { ImageRepository } from '../../lib/image/repository';
import { OneTeamSimultaneous } from '../../lib/oneTeamSimultaneousService';

import { CSSService } from '../../shared/commonmodule/cssservice';

@Component({
  selector: 'app-person-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class PersonComponent implements OnInit {
  @Input() person!: Person;
  // @Input() team: Team | undefined;
  public processing = true;
  // public teamImageUrl: string | undefined;
  // public teamName: string = '';
  // public personImageUrl: string | undefined;

  public oneTeamSimultaneous = new OneTeamSimultaneous();
  public player: Player | undefined;

  constructor(
    public imageRepository: ImageRepository,
    public cssService: CSSService) {
  }

  ngOnInit() {
    // if (this.team) {
    //   this.teamName = this.team?.getName();
    //   this.teamImageUrl = this.team.getImageUrl();
    // }
    // this.personImageUrl = this.person?.getImageUrl();
    this.player = this.oneTeamSimultaneous.getCurrentPlayer(this.person);
    this.processing = false;
  }

  getTeamImageUrl(player: Player): string {
    return this.imageRepository.getTeamUrl(player.getTeam());
  }

  getPlayerImageUrl(player: Player): string {
    return this.imageRepository.getPlayerUrl(player);
  }
}
