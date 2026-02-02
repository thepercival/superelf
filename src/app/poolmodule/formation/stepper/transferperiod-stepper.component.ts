import { Component, input, OnInit } from '@angular/core';
import { faArrowsRotate, faExchangeAlt, faRightLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TransferPeriodAction } from './transferPeriodAction';

@Component({
  selector: 'app-transferperiod-stepper',
  standalone: true,
  imports: [
    FontAwesomeModule
],
  templateUrl: './transferperiod-stepper.component.html',
  styleUrls: ['./transferperiod-stepper.component.scss']
})
export class TransferPeriodStepperComponent implements OnInit {

  readonly activeAction = input<TransferPeriodAction>();  

  faExchangeAlt = faExchangeAlt;
  faRightLeft = faRightLeft;
  faArrowsRotate = faArrowsRotate;

  constructor(
  ) {
  }

  ngOnInit() {
    
  }

  getActiveClass(action: TransferPeriodAction): string {
    return this.activeAction() === action ? 'completed' : '';
  }

  get TransferPeriodActionReplace(): TransferPeriodAction {
    return TransferPeriodAction.Replace;
  }

  get TransferPeriodActionTransfer(): TransferPeriodAction {
    return TransferPeriodAction.Transfer;
  }

  get TransferPeriodActionSubstitute(): TransferPeriodAction {
    return TransferPeriodAction.Substitute;
  }
}

  
