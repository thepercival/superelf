import { Component, OnInit, input, ChangeDetectionStrategy } from '@angular/core';
import { Team } from 'ngx-sport';
import { ImageRepository } from '../../lib/image/repository';

@Component({
  selector: "app-team-name",
  templateUrl: "./name.component.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ["./name.component.scss"],
})
export class TeamNameComponent implements OnInit {
  readonly team = input.required<Team>();
  readonly fullName = input<boolean>(false);
  readonly underline = input<boolean>(false);
  readonly reverse = input<boolean>(false);

  constructor(public imageRepository: ImageRepository) {}

  ngOnInit() {}

  getName(team: Team): string {
    return this.fullName() ? team.getName() : team.getAbbreviation() ?? "";
  }

  getImageUrl(team: Team): string {
    return this.imageRepository.getTeamUrl(team);
  }
}
