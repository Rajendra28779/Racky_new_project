import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderService } from 'src/app/application/header.service';
import { CpdPaymentReportService } from 'src/app/application/Services/cpd-payment-report.service';
import { SnocreateserviceService } from 'src/app/application/Services/snocreateservice.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cpd-post-payment-view',
  templateUrl: './cpd-post-payment-view.component.html',
  styleUrls: ['./cpd-post-payment-view.component.scss'],
})
export class CpdPostPaymentViewComponent implements OnInit {
  date: any;
  txtsearchDate: any;
  yearList: any = [];
  year: any;
  paymentList: any = [];
  keywordCPD: any = 'fullName';
  show:boolean = false;
  @ViewChild('auto') auto;
  user:any;
  constructor(
    public headerService: HeaderService,
    private userService: SnocreateserviceService,
    private snoCreateService: SnocreateserviceService,
    private sessionService: SessionStorageService,
    private paymentReportService: CpdPaymentReportService
  ) {}

  ngOnInit(): void {
    this.headerService.setTitle('CPD Post Payment View');
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
    this.user = this.sessionService.decryptSessionData('user');
    if(this.user.groupId == 1){
      this.show = true;
    }else{
      this.cpduserid = this.user.userId;
      this.show = false;
    }
    this.date = new Date();
    this.year = this.date.getFullYear();
    this.getYear();
    this.getCPDList();
  }

  getYear() {
    this.userService.getYears().subscribe(
      (data) => {
        this.yearList = data;
        console.log(data);
      },
      (error) => console.log(error)
    );
  }
  responseData: any;
  selectedYear:any;
  onClickSearch() {
    this.selectedYear = $('#year').val();
    if(this.show == true){
      if (this.cpduserid == '' || this.cpduserid == null || this.cpduserid == undefined) {
        this.swal('Info', 'Please Select CPD Doctor Name', 'info');
        return;
      }
    }
    this.paymentReportService
      .cpdPostPaymentUpdationView(this.cpduserid, this.selectedYear)
      .subscribe(
        (response) => {
          this.responseData = response;
          console.log(this.responseData);
          if (this.responseData.status == 'success') {
            let details = JSON.parse(this.responseData.details);
            this.paymentList = details.paymentListArray;
          } else {
            this.swal('Error', 'Something went wrong.', 'error');
          }
        },
        (error) => {
          console.log(error);
          this.swal('Error', 'Something went wrong.', 'error');
        }
      );
  }

  resetField() {}
  cpdList: any = [];
  getCPDList() {
    this.snoCreateService.getCPDList().subscribe((response) => {
      this.cpdList = response;
      console.log(this.cpdList);
    });
  }
  // cpdId:any="";
  cpdname: any = 'All';
  cpduserid: any = '';

  selectCPDEvent(item) {
    // this.cpdId = item.bskyUserId;
    this.cpdname = item.fullName;
    this.cpduserid = item.userid;
  }

  clearCPDEvent() {
    // this.cpdId ='';
    this.cpdname = 'All';
    this.cpduserid = '';
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
}
