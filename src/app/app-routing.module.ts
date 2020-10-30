import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  // { path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
  { path: 'pooladmin', loadChildren: () => import('./pooladminmodule/pooladmin.module').then(m => m.PoolAdminModule) },
  { path: 'pool', loadChildren: () => import('./poolmodule/pool.module').then(m => m.PoolModule) },
  // { path: ':id', redirectTo: '/public/:id', pathMatch: 'full' },
  /*{ path: '', redirectTo: '/home', pathMatch: 'full' },*/
  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled'/*, anchorScrolling: 'enabled', preloadingStrategy: PreloadAllModules*/
  })],
  exports: [RouterModule]
})
export class RoutingModule { }

