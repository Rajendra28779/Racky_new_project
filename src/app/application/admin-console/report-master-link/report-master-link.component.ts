import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { FunctionmasterserviceService } from '../../Services/functionmasterservice.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-report-master-link',
  templateUrl: './report-master-link.component.html',
  styleUrls: ['./report-master-link.component.scss'],
})
export class ReportMasterLinkComponent implements OnInit {
  childmessage: any;
  user: any;
  dataa: any;
  countfunctionmaster: any = 0;

  constructor(
    private route: Router,
    public headerService: HeaderService,
    public fnmservice: FunctionmasterserviceService,
    private sessionService: SessionStorageService
  ) {}

  functionmaster: any = [];
  txtsearchDate: any;
  showPegi: any = false;
  pageElement: any;
  currentPage: any;

  ngOnInit(): void {
    this.headerService.setTitle('Report List');
    this.user = this.sessionService.decryptSessionData('user');
    this.getAllReportList();
    this.currentPage = 1;
    this.pageElement = 10;
  }

  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }

  getAllReportList() {
    let userId = this.user.userId;
    this.fnmservice.getallReportMasterdata(userId).subscribe(
      (data: any) => {
        if (data.length > 0) {
          this.functionmaster = data;
          this.countfunctionmaster = this.functionmaster.length;
          this.showPegi = true;
        }
        // console.log(this.functionmaster)
      },
      (error: any) => {
        this.swal('Error', 'Something went wrong', 'error');
        console.log(error);
      }
    );
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }

  pageItemChange() {
    this.pageElement = $('#pageItem').val();
  }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
}
