import { Component, OnInit, input } from '@angular/core';
import { Player } from 'ngx-sport';
import { ImageRepository } from '../../lib/image/repository';
import { LineIconComponent } from '../../shared/commonmodule/lineicon/lineicon.component';
import { TeamNameComponent } from '../team/name.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-player-basics',
  standalone: true,
  imports: [NgIf,LineIconComponent,TeamNameComponent,FontAwesomeModule],
  templateUrl: './basics.component.html',
  styleUrls: ['./basics.component.scss']
})
export class PlayerBasicsComponent implements OnInit {
  readonly player = input<Player>();
  // @Input() pool!: Pool;
  readonly points = input<number>();

  constructor(
    public imageRepository: ImageRepository) {
  }

  ngOnInit() {

  }

  //OnChanges player, points

  getTeamImageUrl(player: Player): string {
    return this.imageRepository.getTeamUrl(player.getTeam());
  }

  getPlayerImageUrl(player: Player): string {
    return this.imageRepository.getPlayerUrl(player);
  }
}
