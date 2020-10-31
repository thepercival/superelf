import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
  faAngleDoubleDown,
  faPlusCircle,
  faSave,
  faSearch,
  faSpinner,
  faUserCircle,
  faUserFriends,
  faUserShield,
} from '@fortawesome/free-solid-svg-icons';

import { environment } from '../environments/environment';
import { RoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './lib/auth/auth.service';
import { AuthguardService } from './lib/auth/authguard.service';
import { MyNavigation } from './shared/commonmodule/navigation';
import { CommonSharedModule } from './shared/commonmodule/common.module';
import { HomeComponent } from './home/home.component';
import { HomeShellComponent } from './home/shell.component';
import { CompetitorMapper } from './lib/competitor/mapper';
import { PoolShellRepository } from './lib/pool/shell/repository';
import { UserMapper } from './lib/user/mapper';
import { LayoutSharedModule } from './shared/layoutmodule/layout.module';
import { facSoccerField, facFavicon } from './lib/icons';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HomeShellComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RoutingModule,
    CommonSharedModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    FontAwesomeModule,
    LayoutSharedModule
  ],
  providers: [
    AuthService,
    AuthguardService,
    PoolShellRepository,
    CompetitorMapper,
    UserMapper,
    MyNavigation
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faPlusCircle, faSpinner, faSearch, faAngleDoubleDown
      , faUserShield, faUserFriends, faSave, faUserCircle,
      facSoccerField, facFavicon
    );
  }
}