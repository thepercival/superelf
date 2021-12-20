import { Component, Input, OnInit } from '@angular/core';
import { Player } from 'ngx-sport';
import { ImageRepository } from '../../lib/image/repository';

@Component({
  selector: 'app-player-basics',
  templateUrl: './basics.component.html',
  styleUrls: ['./basics.component.scss']
})
export class PlayerBasicsComponent implements OnInit {
  @Input() player: Player | undefined;
  // @Input() pool!: Pool;
  @Input() points: number | undefined;

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
