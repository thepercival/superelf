import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
  faSync, faCogs, faFilter, faInfoCircle, faListUl, faPencilAlt, faCalendarAlt, faMedal, faSpinner,
  faMinus, faPlus
} from '@fortawesome/free-solid-svg-icons';
import { EndRankingComponent } from './ranking/end.component';
import { PouleRankingComponent } from './ranking/poule.component';
import { NgbNavModule, NgbAlertModule, NgbPopoverModule, NgbDatepickerModule, NgbTimepickerModule, NgbCollapseModule, NgbModalModule, NgbModalConfig, NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
import { CommonSharedModule } from '../commonmodule/common.module';
import { NameModalComponent } from './namemodal/namemodal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RankingRulesComponent } from './rankingrules/rankingrules.component';
import { facPineCone, facStructure, facSuperCup } from './icons';
import { SuperElfIconComponent } from './icon/icon.component';

@NgModule({
  declarations: [
    NameModalComponent,
    EndRankingComponent,
    PouleRankingComponent,
    RankingRulesComponent,
    SuperElfIconComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    CommonSharedModule,
    RouterModule,
    NgbDatepickerModule, NgbTimepickerModule, NgbAlertModule, NgbPopoverModule, NgbCollapseModule, NgbModalModule,
    NgbNavModule,
  ],
  providers: [
  ],
  exports: [
    NameModalComponent,
    EndRankingComponent,
    PouleRankingComponent,
    RankingRulesComponent,
    NgbTimepickerModule, NgbAlertModule, NgbPopoverModule, NgbCollapseModule, NgbModalModule,
    NgbNavModule,
    SuperElfIconComponent
  ]
})
export class PoolSharedModule {
  constructor(library: FaIconLibrary, modalConfig: NgbModalConfig, alertConfig: NgbAlertConfig) {
    library.addIcons(faSync, faCogs, faFilter, faInfoCircle, faListUl, faPencilAlt, faCalendarAlt,
      faMedal, faSpinner, faMinus, faPlus,
      facPineCone, facStructure, facSuperCup);
    modalConfig.centered = true;
    modalConfig.scrollable = true;
    modalConfig.size = 'lg';
    alertConfig.dismissible = false;
  }
}
