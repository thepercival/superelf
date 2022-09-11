import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AgainstGame, Player } from 'ngx-sport';
import { ImageRepository } from '../../../lib/image/repository';
import { GameRepository } from '../../../lib/ngx-sport/game/repository';
import { StructureRepository } from '../../../lib/ngx-sport/structure/repository';
import { PointsCalculator } from '../../../lib/points/calculator';
import { Pool } from '../../../lib/pool';
import { StatisticsRepository } from '../../../lib/statistics/repository';
import { CSSService } from '../../../shared/commonmodule/cssservice';
import { MyNavigation } from '../../../shared/commonmodule/navigation';

@Component({
  selector: 'app-againstgame-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class AgainstGameDetailsComponent implements OnInit {
  public againstGame!: AgainstGame;
  public pool!: Pool;
  private pointsCalculator!: PointsCalculator;
  // public currentGameRound: GameRound | undefined;

  // @Input() team: Team | undefined;
  public processing = true;
  // public processingGames = false;
  // public currentGame: AgainstGame | undefined;
  // public currentStatistics: Statistics | undefined;
  // public currentPoints: number | undefined;
  // public sourceStructure: Structure | undefined;
  // public competitorMap!: CompetitorMap;

  // public oneTeamSimultaneous = new OneTeamSimultaneous();
  // public player: Player | undefined;
  // private sliderGameRounds: (GameRound | undefined)[] = [];


  constructor(
    private statisticsRepository: StatisticsRepository,
    private structureRepository: StructureRepository,
    private gameRepository: GameRepository,
    public imageRepository: ImageRepository,
    public cssService: CSSService,
    private myNavigation: MyNavigation,
    private route: ActivatedRoute,
    private router: Router) {
    // const state = this.router.getCurrentNavigation()?.extras.state ?? undefined;
    // if (state !== undefined) {
    //   this.s11Player = state.s11Player;
    //   this.pool = state.pool;
    //   this.currentGameRound = state.currentGameRound ?? undefined;
    // }
  }

  ngOnInit() {
    // if (this.s11Player === undefined) {
    //   this.route.params.subscribe(params => {
    //     this.router.navigate(['/pool', +params['id']]);
    //   });
    //   return
    // }

    this.pointsCalculator = new PointsCalculator(this.pool.getCompetitionConfig());

    // this.competitorMap = new CompetitorMap(this.pool.getSourceCompetition().getTeamCompetitors());


    // this.initSliderGameRounds();

    // this.updateGameRound();

    // if (!this.s11Player.hasStatistics()) {
    //   this.statisticsRepository.getObjects(this.s11Player).subscribe({
    //     next: (statistics: StatisticsMap) => {
    //       this.s11Player.setStatistics(statistics);
    //     },
    //     complete: () => this.processing = false
    //   });
    // } else {
    //   this.processing = false;
    // }
  }



  getTeamImageUrl(player: Player): string {
    return this.imageRepository.getTeamUrl(player.getTeam());
  }

  getPlayerImageUrl(player: Player): string {
    return this.imageRepository.getPlayerUrl(player);
  }


  // getSourceStructure(competition: Competition): Observable<Structure> {
  //   if (this.sourceStructure !== undefined) {
  //     return of(this.sourceStructure);
  //   }
  //   return this.structureRepository.getObject(competition);
  // }



  navigateBack() {
    this.myNavigation.back();
  }
}
