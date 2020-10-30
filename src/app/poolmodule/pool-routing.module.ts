import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { PreNewComponent } from './prenew/prenew.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: 'prenew', component: PreNewComponent },
  { path: ':id', component: HomeComponent },
  // { path: 'ranking/:id', component: RankingComponent },
  // { path: 'competitor/players/:id', component: StructureViewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes), ReactiveFormsModule],
  exports: [RouterModule]
})
export class RoutingModule { }
