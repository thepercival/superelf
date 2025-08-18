import { Component, input } from '@angular/core';


import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MarketValuePipe } from "../../market-value.pipe";

@Component({
  standalone: true,
  imports: [FontAwesomeModule, MarketValuePipe],
  selector: "se-marketvalue",
  templateUrl: "./marketvalue.component.html",
})
export class MarketValueComponent {
  readonly marketValue = input.required<number>();

  constructor() {}

  get ClassName(): string {
    const size =
      this.marketValue() < 1000000
        ? MarketValueSize.Small
        : this.marketValue() < 5000000
        ? MarketValueSize.Medium
        : MarketValueSize.Large;
    return "bg-marketvalue-" + size;
  }
}


enum MarketValueSize {
  Small = 'sm',
  Medium = 'md',
  Large = 'lg'
}

