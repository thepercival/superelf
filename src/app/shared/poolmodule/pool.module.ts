import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
  faSync, faCogs, faFilter, faInfoCircle, faListUl, faPencilAlt, faCalendarAlt, faMedal, faSpinner,
  faLevelUpAlt, faMinus, faPlus, faDoorClosed
} from '@fortawesome/free-solid-svg-icons';
import { EndRankingComponent } from './ranking/end.component';
import { PouleRankingComponent } from './ranking/poule.component';
import { TitleComponent } from './title/title.component';
import { NgbNavModule, NgbAlertModule, NgbPopoverModule, NgbDatepickerModule, NgbTimepickerModule, NgbCollapseModule, NgbModalModule, NgbButtonsModule, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { CommonSharedModule } from '../commonmodule/common.module';
import { NameModalComponent } from './namemodal/namemodal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RankingRulesComponent } from './rankingrules/rankingrules.component';
import { facStructure, facReferee, facScoreboard } from './icons';
import { FavoritesRepository } from '../../lib/favorites/repository';

@NgModule({
  declarations: [
    NameModalComponent,
    EndRankingComponent,
    PouleRankingComponent,
    TitleComponent,
    RankingRulesComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    CommonSharedModule,
    RouterModule,
    NgbDatepickerModule, NgbTimepickerModule, NgbAlertModule, NgbPopoverModule, NgbCollapseModule, NgbModalModule, NgbButtonsModule,
    NgbNavModule
  ],
  providers: [
    FavoritesRepository,
  ],
  exports: [
    NameModalComponent,
    EndRankingComponent,
    PouleRankingComponent,
    TitleComponent,
    RankingRulesComponent,
    NgbTimepickerModule, NgbAlertModule, NgbPopoverModule, NgbCollapseModule, NgbModalModule, NgbButtonsModule,
    NgbNavModule
  ]
})
export class PoolSharedModule {
  constructor(library: FaIconLibrary, modalConfig: NgbModalConfig) {
    library.addIcons(faSync, faCogs, faFilter, faInfoCircle, faListUl, faPencilAlt, faCalendarAlt,
      faMedal, faSpinner, faLevelUpAlt, faMinus, faDoorClosed, faPlus,
      facStructure, facReferee, facScoreboard);
    modalConfig.centered = true;
    modalConfig.scrollable = true;
    modalConfig.size = 'lg';
  }
}
