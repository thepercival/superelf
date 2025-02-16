import { enableProdMode, provideExperimentalZonelessChangeDetection } from '@angular/core';
// import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
// import { AuthService } from './app/lib/auth/auth.service';
// import { AuthUserGuardService } from './app/lib/auth/guard/userguard.service';
// import { PoolShellRepository } from './app/lib/pool/shell/repository';
// import { UserMapper } from './app/lib/user/mapper';
// import { MyNavigation } from './app/shared/commonmodule/navigation';
// import { GlobalEventsManager } from './app/shared/commonmodule/eventmanager';
// import { StartSessionService } from './app/shared/commonmodule/startSessionService';
// import { WorldCupPreviousService } from './app/shared/commonmodule/worldCupPreviousService';
// import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
// import { withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';
// import { RoutingModule } from './app/app-routing.module';
// import { ReactiveFormsModule } from '@angular/forms';
// import { CommonSharedModule } from './app/shared/commonmodule/common.module';
// import { ServiceWorkerModule } from '@angular/service-worker';
// import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
// import { LayoutSharedModule } from './app/shared/layoutmodule/layout.module';
import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { AuthService } from './app/lib/auth/auth.service';
import { AuthUserGuardService } from './app/lib/auth/guard/userguard.service';
import { PoolShellRepository } from './app/lib/pool/shell/repository';
import { UserMapper } from './app/lib/user/mapper';
import { MyNavigation } from './app/shared/commonmodule/navigation';
import { GlobalEventsManager } from './app/shared/commonmodule/eventmanager';
import { StartSessionService } from './app/shared/commonmodule/startSessionService';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { WorldCupPreviousService } from './app/shared/commonmodule/worldCupPreviousService';
import { provideRouter, Router, RouterOutlet } from '@angular/router';
import { routes } from './app/app.routes';

if (environment.production) {
  enableProdMode();
}

// document.addEventListener('DOMContentLoaded', () => {
//   bootstrapApplication(AppComponent, {
//     providers: [
//       importProvidersFrom(
//         BrowserModule,
//         RoutingModule,
//         ReactiveFormsModule,
//         CommonSharedModule,
//         ServiceWorkerModule.register("/ngsw-worker.js", {
//           enabled: environment.production,
//         }),
//         FontAwesomeModule,
//         LayoutSharedModule
//       ),
//       AuthService,
//       AuthUserGuardService,
//       PoolShellRepository,
//       UserMapper,
//       MyNavigation,
//       GlobalEventsManager,
//       StartSessionService,
//       WorldCupPreviousService,
//       provideHttpClient(withInterceptorsFromDi()),
//     ],
//   }).catch((err) => console.log(err));
// });

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideExperimentalZonelessChangeDetection(),
    RouterOutlet,
    Router,
    AuthService,
    AuthUserGuardService,
    PoolShellRepository,
    UserMapper,
    MyNavigation,
    GlobalEventsManager,
    StartSessionService,
    WorldCupPreviousService,
    provideHttpClient(withInterceptorsFromDi()),
  ],
}).catch((e) => console.error(e));
