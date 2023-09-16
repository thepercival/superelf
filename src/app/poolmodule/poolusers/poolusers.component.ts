import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PoolRepository } from '../../lib/pool/repository';
import { PoolComponent } from '../../shared/poolmodule/component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { PoolUser } from '../../lib/pool/user';
import { PoolUserRepository } from '../../lib/pool/user/repository';
import { Pool } from '../../lib/pool';
import { PoolUserRemoveModalComponent } from './removemodal.component';
import { Period } from 'ngx-sport';
import { GlobalEventsManager } from '../../shared/commonmodule/eventmanager';
import { NavBarItem } from '../../shared/poolmodule/poolNavBar/items';


@Component({
  selector: 'app-pool-users',
  templateUrl: './poolusers.component.html',
  styleUrls: ['./poolusers.component.scss']
})
export class PoolUsersComponent extends PoolComponent implements OnInit {

  poolUsers: PoolUser[] = [];
  
  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    globalEventsManager: GlobalEventsManager,
    protected poolUserRepository: PoolUserRepository,
    private modalService: NgbModal
  ) {
    super(route, router, poolRepository, globalEventsManager);

  }

  ngOnInit() {
    super.parentNgOnInit().subscribe({
      next: (pool: Pool) => {
        this.setPool(pool);
        this.poolUserRepository.getObjects(pool).subscribe({
          next: (poolUsers: PoolUser[]) => this.poolUsers = poolUsers,
          error: (e: string) => { this.setAlert('danger', e); this.processing = false; },
          complete: () => this.processing = false
        });

        this.poolUserRepository.getObjectFromSession(pool).subscribe({
          next: ((poolUser: PoolUser) => {
            this.poolUserFromSession = poolUser;
          }),
          error: (e: string) => {
            this.setAlert('danger', e); this.processing = false;
          },
          complete: () => this.processing = false
        });

      },
      error: (e) => {
        this.setAlert('danger', e); this.processing = false;
      }
    });
  }

  get PoolUsers(): NavBarItem { return NavBarItem.PoolUsers; }

  // openRemoveApprovalModal(poolUser: PoolUser) {
  //   const modalRef = this.modalService.open(PoolUserRemoveModalComponent);
  //   modalRef.componentInstance.entittyName = 'deelnemer';
  //   modalRef.componentInstance.name = poolUser.getName();
  //   modalRef.result.then((result) => {
  //     this.remove(poolUser);
  //   }, (reason) => {
  //   });
  // }

  // remove(poolUser: PoolUser) {
  //   this.processing = true;
  //   this.poolUserRepository.removeObject(poolUser).subscribe(
  //     {
  //       next: () => this.setAlert('success', 'deelnemer ' + poolUser.getName() + 'verwijderd'),
  //       error: (e) => { this.setAlert('danger', e); this.processing = false; },
  //       complete: () => this.processing = false
  //     }
  //   );
  // }
}
