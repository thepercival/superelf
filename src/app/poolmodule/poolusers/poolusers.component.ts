import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PoolRepository } from '../../lib/pool/repository';
import { PoolComponent } from '../../shared/poolmodule/component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { PoolUserRemoveApprovalModalComponent } from './removeapprovalmodal.component';
import { PoolUser } from '../../lib/pool/user';
import { PoolUserRepository } from '../../lib/pool/user/repository';
import { Pool } from '../../lib/pool';


@Component({
  selector: 'app-pool-users',
  templateUrl: './poolusers.component.html',
  styleUrls: ['./poolusers.component.scss']
})
export class PoolUsersComponent extends PoolComponent implements OnInit {

  constructor(
    route: ActivatedRoute,
    router: Router,
    poolRepository: PoolRepository,
    protected poolUserRepository: PoolUserRepository,
    private modalService: NgbModal
  ) {
    super(route, router, poolRepository);

  }

  ngOnInit() {
    super.parentNgOnInit().subscribe((pool: Pool) => {
      this.pool = pool;
      this.processing = false;
    });
  }

  openRemoveApprovalModal(poolUser: PoolUser) {
    const modalRef = this.modalService.open(PoolUserRemoveApprovalModalComponent);
    modalRef.componentInstance.poolUser = poolUser;
    modalRef.result.then((result) => {
      this.remove(poolUser);
    }, (reason) => {
    });
  }

  remove(poolUser: PoolUser) {
    this.processing = true;
    this.poolUserRepository.removeObject(poolUser)
      .subscribe(
            /* happy path */() => this.setAlert('success', 'deelnemer ' + poolUser.getName() + 'verwijderd'),
            /* error path */ e => { this.setAlert('danger', e); this.processing = false; },
            /* on complete */() => this.processing = false
      );
  }
}
