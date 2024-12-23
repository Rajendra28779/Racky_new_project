import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HrApprovalService } from 'src/app/application/Services/hr-approval-service';
import { HeaderService } from 'src/app/application/header.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import Swal from 'sweetalert2';
declare let $: any;

@Component({
  selector: 'app-cpd-empanel-request-list',
  templateUrl: './cpd-empanel-request-list.component.html',
  styleUrls: ['./cpd-empanel-request-list.component.scss'],
})
export class CpdEmpanelRequestListComponent implements OnInit {
  pageElement: number;
  selectedIndex: number;
  cpdFreshApplication: any = [];
  txtsearchDate: any;
  cpdName: any;
  mobile: any;
  showPegi: any = false;
  size: any;
  user: any;
  months: any;
  year: any;
  months2: any;
  frstDay: any;
  secoundDay: any;
  constructor(
    public headerService: HeaderService,
    private sessionService: SessionStorageService,
    private hrApprovalService: HrApprovalService,
    public route: Router
  ) {}

  ngOnInit(): void {
    this.headerService.setTitle('CPD Registration Approval');
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
    this.user = this.sessionService.decryptSessionData('user');
    localStorage.removeItem('actionData');
    this.pageElement = 20;
    this.selectedIndex = 1;
    $('.selectpicker').selectpicker();
    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      maxDate: new Date(),
      daysOfWeekDisabled: ['', 7],
    });
    $('.timepicker').datetimepicker({
      format: 'LT',
      daysOfWeekDisabled: ['', 7],
    });
    $('.datetimepicker').datetimepicker({
      format: 'DD-MMM-YYYY LT',
      daysOfWeekDisabled: ['', 7],
    });
    var date = new Date();
    let year = date.getFullYear();
    let date1 = '01';
    let month: any = date.getMonth() - 1;
    if (month == -1) {
      this.months = 'Dec';
      this.year = year - 1;
    } else {
      this.months = this.getMonthFrom(month);
      this.year = year;
    }
    let date2 = date.getDate();
    this.months2 = this.getMonthFrom(date.getMonth());
    this.frstDay = date1 + '-' + this.months + '-' + this.year;
    this.secoundDay = date2 + '-' + this.months2 + '-' + year;
    $('input[name="fromDate"]').val(this.frstDay);
    $('input[name="fromDate"]').attr('placeholder', 'From Date *');
    $('input[name="toDate"]').attr('placeholder', 'To Date *');
    this.onClickSearch();
  }
  getMonthFrom(month) {
    if (month == 0) {
      month = 'Jan';
    } else if (month == 1) {
      month = 'Feb';
    } else if (month == 2) {
      month = 'Mar';
    } else if (month == 3) {
      month = 'Apr';
    } else if (month == 4) {
      month = 'May';
    } else if (month == 5) {
      month = 'Jun';
    } else if (month == 6) {
      month = 'Jul';
    } else if (month == 7) {
      month = 'Aug';
    } else if (month == 8) {
      month = 'Sep';
    } else if (month == 9) {
      month = 'Oct';
    } else if (month == 10) {
      month = 'Nov';
    } else if (month == 11) {
      month = 'Dec';
    }
    return month;
  }
  pageItemChange() {}
  fromDate: any;
  toDate: any;
  responseData: any;
  onClickSearch() {
    this.fromDate = $('#datepicker1').val();
    this.toDate = $('#datepicker2').val();
    let cpdName = $('#cpdName').val();
    let mobile = $('#mobile').val();
    if (Date.parse(this.fromDate) > Date.parse(this.toDate)) {
      this.swal('Info', ' From Date should be less than To Date', 'info');
      return;
    }
    let requestData = {
      fromDate: new Date(this.fromDate),
      toDate: new Date(this.toDate),
      cpdName: cpdName,
      mobile: mobile,
      status: 0,
    };
    this.hrApprovalService.getFreshApplication(requestData).subscribe(
      (response) => {
        this.responseData = response;
        if (this.responseData.status == 'success') {
          this.cpdFreshApplication = JSON.parse(this.responseData.data);
          console.log(this.cpdFreshApplication);
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
  resetField() {
    window.location.reload();
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  onAction(data) {
    localStorage.setItem('actionData', data.userId);
    this.route.navigate(['/application/cpdempaneldetails']);
  }
  getPreview(data){
    localStorage.setItem('actionData', data.userId);
    this.route.navigate(['/application/cpdempanelpreview']);
  }
}
