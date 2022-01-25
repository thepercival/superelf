import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';

import { EscapeHtmlPipe } from './escapehtmlpipe';
import { FocusDirective } from './focus';
import { LineIconComponent } from './lineicon/lineicon.component';
import { TitleComponent } from './title/title.component';
import { ViewPortManager } from './viewPortManager';

@NgModule({
  declarations: [
    EscapeHtmlPipe,
    FocusDirective,
    TitleComponent,
    LineIconComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  exports: [
    EscapeHtmlPipe,
    FocusDirective,
    TitleComponent,
    LineIconComponent
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
