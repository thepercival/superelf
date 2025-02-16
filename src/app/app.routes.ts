import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { userRoutes } from "./usermodule/user.routes";

export const routes: Routes = userRoutes.concat([
  { path: "", component: HomeComponent },
]);

  // { path: 'user', loadChildren: () => import('../../migrate/modules/user.module').then(m => m.UserModule) },
  // // { path: 'pooladmin', loadChildren: () => import('./pooladminmodule/pooladmin.module').then(m => m.PoolAdminModule) },
  // { path: 'pool', loadChildren: () => import('../../migrate/modules/pool.module').then(m => m.PoolModule) },
  // { path: 'pools', component: PoolListComponent },
  // // { path: ':id', redirectTo: '/public/:id', pathMatch: 'full' },
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

