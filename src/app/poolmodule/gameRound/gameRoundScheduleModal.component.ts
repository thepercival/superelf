import { Component, Input, OnInit, input, model, ChangeDetectionStrategy } from '@angular/core';
import { sortGamesUpcomingFirst } from '../../lib/gameRound/gamesSorter';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AgainstGame, Competition, GameState, Structure, VoetbalRange } from 'ngx-sport';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { GameRound } from '../../lib/gameRound';
import { CompetitionConfig } from '../../lib/competitionConfig';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { AgainstGamesTableSimpleComponent } from '../game/source/againstGamesTable/againstgames-table-simple.component';
import { Observable } from 'rxjs';
import { StructureRepository } from '../../lib/ngx-sport/structure/repository';
import { SourceAgainstGamesGetter } from '../../lib/gameRound/sourceAgainstGamesGetter';
import { GameRepository } from '../../lib/ngx-sport/game/repository';

@Component({
    selector: 'app-modal-gameround-schedule',
    templateUrl: './gameRoundScheduleModal.component.html',
    styleUrls: ['./gameRoundScheduleModal.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [FaIconComponent,AgainstGamesTableSimpleComponent]
})
export class GameRoundScheduleModalComponent implements OnInit {
   
    @Input() competitionConfig!: CompetitionConfig;
    @Input() gameRound!: GameRound;
    
    public sourceAgainstGamesGetter: SourceAgainstGamesGetter;
    public sourceAgainstGames = model.required<AgainstGame[]>();
    public processing = model<boolean>(true);
    faSpinner = faSpinner;


    constructor(
        public activeModal: NgbActiveModal, 
        public structureRepository: StructureRepository,
        gameRepository: GameRepository,
        private fb: UntypedFormBuilder) {
       
        this.sourceAgainstGamesGetter = new SourceAgainstGamesGetter(
                gameRepository
            );

    }

    ngOnInit() {
      this.setSourceGameRoundGames(this.competitionConfig, this.gameRound);

        
       
    }

    getSourceStructure(competition: Competition): Observable<Structure> {
        // if (this.sourceStructure !== undefined) {
        //   return of(this.sourceStructure);
        // }
        return this.structureRepository.getObject(competition);
    }

    private setSourceGameRoundGames(
        competitionConfig: CompetitionConfig,
        gameRound: GameRound
      ): void {
        this.processing.set(true);
    
        this.getSourceStructure(competitionConfig.getSourceCompetition()).subscribe(
          {
            next: (sourceStructure: Structure) => {
              const poule = sourceStructure
                .getSingleCategory()
                .getRootRound()
                .getFirstPoule();
    
              this.sourceAgainstGamesGetter
                .getGameRoundGames(poule, gameRound)
                .subscribe({
                  next: (games: AgainstGame[]) => {
                    sortGamesUpcomingFirst(games);
                    this.sourceAgainstGames.set(games);
                  },
                  complete: () => {
                    this.processing.set(false);
                  },
                });
            },
          }
        );
      }
}
