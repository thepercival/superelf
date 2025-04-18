import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { userRoutes } from "./usermodule/user.routes";
import { poolRoutes } from "./poolmodule/pool.routes";
import { PoolListComponent } from './poollist/poollist.component';

export const routes: Routes = userRoutes.concat(poolRoutes, [
  { path: "", title: "overzicht (jouw) pools", component: HomeComponent },
  { path: 'pools', component: PoolListComponent },
  // { path: ':id', redirectTo: '/public/:id', pathMatch: 'full' },
]);

  // { path: 'user', loadChildren: () => import('../../migrate/modules/user.module').then(m => m.UserModule) },
  // // { path: 'pooladmin', loadChildren: () => import('./pooladminmodule/pooladmin.module').then(m => m.PoolAdminModule) },
  // { path: 'pool', loadChildren: () => import('../../migrate/modules/pool.module').then(m => m.PoolModule) },
  
  // /*{ path: '', redirectTo: '/home', pathMatch: 'full' },*/
  // // otherwise redirect to home
  
// routes.push({ path: "**", redirectTo: "" });
// @NgModule({
//   imports: [RouterModule.forRoot(routes, {
//     scrollPositionRestoration: 'enabled'/*, anchorScrolling: 'enabled', preloadingStrategy: PreloadAllModules*/
//   })],
//   exports: [RouterModule]
// })
// export class RoutingModule { }

