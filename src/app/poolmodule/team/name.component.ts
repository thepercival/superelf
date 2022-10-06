import { Component, Input, OnInit } from '@angular/core';
import { Team } from 'ngx-sport';
import { ImageRepository } from '../../lib/image/repository';

@Component({
  selector: 'app-team-name',
  templateUrl: './name.component.html',
  styleUrls: ['./name.component.scss']
})
export class TeamNameComponent implements OnInit {
  @Input() team: Team | undefined;
  @Input() fullName: boolean = false;
  @Input() reverse: boolean = false;

  constructor(
    public imageRepository: ImageRepository
  ) {

  }

  ngOnInit() {

  }

  getName(team: Team): string {
    return this.fullName ? team.getName() : team.getAbbreviation() ?? '';
  }

  getImageUrl(team: Team): string {
    return this.imageRepository.getTeamUrl(team);
  }
}
