import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
  faSync, faCogs, faFilter, faInfoCircle, faListUl, faPencilAlt, faCalendarAlt, faMedal, faSpinner,
  faMinus, faPlus, faRectangleXmark, faFutbol, faCircle, faHandshakeAngle
} from '@fortawesome/free-solid-svg-icons';
import { EndRankingComponent } from './ranking/end.component';
import { NgbNavModule, NgbAlertModule, NgbPopoverModule, NgbDatepickerModule, NgbTimepickerModule, NgbCollapseModule, NgbModalModule, NgbModalConfig, NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
import { CommonSharedModule } from '../commonmodule/common.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RankingRulesComponent } from './rankingrules/rankingrules.component';
import { facCard, facCleanSheet, facCornerFlag, facCrown, facCup, facPenalty, facPlate, facScoreboard, facSpottySheet, facStructure, facSuperCup, facTrophy, facWorldCup } from './icons';
import { SuperElfIconComponent } from './icon/icon.component';
import { PoolNavBarComponent } from './poolNavBar/poolNavBar.component';
import { PoolCompetitionsNavBarComponent } from './competitionsNavBar/competitionsNavBar.component';
import { SuperElfBadgeIconComponent } from './icon/badge.component';
import { SuperElfTrophyIconComponent } from './icon/trophy.component';
import { WorldCupNavBarComponent } from './poolNavBar/worldcupNavBar.component';

// @NgModule({
//     imports: [
//         CommonModule,
//         FontAwesomeModule,
//         ReactiveFormsModule,
//         CommonSharedModule,
//         RouterModule,
//         NgbDatepickerModule, NgbTimepickerModule, NgbAlertModule, NgbPopoverModule, NgbCollapseModule, NgbModalModule,
//         NgbNavModule,
//         EndRankingComponent,
//         RankingRulesComponent,
//         SuperElfIconComponent,
//         SuperElfBadgeIconComponent,
//         SuperElfTrophyIconComponent,
//         PoolNavBarComponent,
//         WorldCupNavBarComponent,
//         PoolCompetitionsNavBarComponent,
//     ],
//     providers: [],
//     exports: [
//         EndRankingComponent,
//         RankingRulesComponent,
//         NgbTimepickerModule, NgbAlertModule, NgbPopoverModule, NgbCollapseModule, NgbModalModule,
//         NgbNavModule,
//         SuperElfIconComponent,
//         SuperElfBadgeIconComponent,
//         SuperElfTrophyIconComponent,
//         PoolNavBarComponent,
//         WorldCupNavBarComponent,
//         PoolCompetitionsNavBarComponent
//     ]
// })
// export class PoolSharedModule {
//   constructor(library: FaIconLibrary, modalConfig: NgbModalConfig, alertConfig: NgbAlertConfig) {
//     library.addIcons(faSync, faCogs, faFilter, faInfoCircle, faListUl, faPencilAlt, faCalendarAlt,
//       faMedal, faSpinner, faMinus, faPlus, faRectangleXmark, faFutbol,
//       facCup, facStructure, facSuperCup, facTrophy, facPlate, facWorldCup, facCleanSheet,
//       facCrown, facSpottySheet, facCard, facPenalty, facScoreboard, faCircle, faHandshakeAngle, facCornerFlag, facCleanSheet);
//     modalConfig.centered = true;
//     modalConfig.scrollable = true;
//     modalConfig.size = 'lg';
//     alertConfig.dismissible = false;
//   }
// }
