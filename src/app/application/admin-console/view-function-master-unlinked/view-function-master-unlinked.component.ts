import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import Swal from 'sweetalert2';
import { FunctionmasterserviceService } from '../../Services/functionmasterservice.service';
import { HeaderService } from '../../header.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-view-function-master-unlinked',
  templateUrl: './view-function-master-unlinked.component.html',
  styleUrls: ['./view-function-master-unlinked.component.scss'],
})
export class ViewFunctionMasterUnlinkedComponent implements OnInit {
  childmessage: any;
  user: any;
  dataa: any;
  countfunctionmaster: any;

  constructor(
    private route: Router,
    public headerService: HeaderService,
    public fnmservice: FunctionmasterserviceService,
    private sessionService: SessionStorageService
  ) {}

  functionmaster: any;
  txtsearchDate: any;
  pageElement: any;
  currentPage: any;
  showPegi: any;

  ngOnInit() {
    this.headerService.setTitle('View-Unlinked-Function-Master');
    this.user = this.sessionService.decryptSessionData('user');
    this.getUnlinkedFunctionMasterList();
    this.currentPage = 1;
    this.pageElement = 20;
    this.showPegi = true;
  }

  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }

  getUnlinkedFunctionMasterList() {
    this.fnmservice.getUnlinkedFunctionMasterList().subscribe((data) => {
      this.functionmaster = data;
      this.countfunctionmaster = this.functionmaster.length;
    });
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }

  delete(item: any) {
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Save it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.fnmservice
          .removeUnlinkedFunctionMaster(this.user.userId, item)
          .subscribe((data) => {
            this.dataa = data;
            if (this.dataa.status == 'Success') {
              this.swal('Success', this.dataa.message, 'success');
              this.getUnlinkedFunctionMasterList();
            } else if (this.dataa.status == 'Failed') {
              this.swal('Error', this.dataa.message, 'error');
            }
          });
      }
    });
  }

  editFunctionMaster(item: any) {
    let navigationExtras: NavigationExtras = {
      state: {
        user: item,
      },
    };
    this.route.navigate(
      ['application/unlinkedfunctionmaster'],
      navigationExtras
    );
  }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

  pageItemChange() {
    this.pageElement = (<HTMLInputElement>(
      document.getElementById('pageItem')
    )).value;
  }
}
