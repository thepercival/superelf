import { Component, OnInit } from '@angular/core';
import { StartSessionService } from '../../shared/commonmodule/startSessionService';

@Component({
  selector: 'app-pool-prenew',
  templateUrl: './prenew.component.html',
  styleUrls: ['./prenew.component.scss']
})
export class PreNewComponent implements OnInit {

  constructor(private startSessionService: StartSessionService) {
    this.startSessionService.setCreateAction();
  }

  ngOnInit() {
    // this.route.queryParams.subscribe(params => {
    //   if (params.type !== undefined && params.message !== undefined) {
    //     this.alert = { type: params['type'], message: params['message'] };
    //   }
    // });
    // this.ngOnInitMyShells();
  }
}
