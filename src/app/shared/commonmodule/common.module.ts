import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';

import { EscapeHtmlPipe } from './escapehtmlpipe';
import { FocusDirective } from './focus';
import { TitleComponent } from './title/title.component';

@NgModule({
  declarations: [
    EscapeHtmlPipe,
    FocusDirective,
    TitleComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  exports: [
    EscapeHtmlPipe,
    FocusDirective,
    TitleComponent
  ]
})

export class CommonSharedModule {
  constructor(library: FaIconLibrary/*, modalConfig: NgbModalConfig,*/) {
    library.addIcons(faUsers);
    /*modalConfig.centered = true;
    modalConfig.scrollable = true;
    modalConfig.size = 'lg';*/
  }
}
