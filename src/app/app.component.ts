import { Component } from '@angular/core';

import { MyNavigation } from './shared/commonmodule/navigation';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NavComponent } from "./shared/layoutmodule/nav/nav.component";
import { FooterComponent } from "./shared/layoutmodule/footer/footer.component";

@Component({
  standalone: true,
  imports: [NavComponent, FooterComponent, RouterOutlet],
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "SuperElf";

  constructor(protected myNavigation: MyNavigation) {}
}
