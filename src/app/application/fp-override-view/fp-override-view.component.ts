import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../header.service';
import { FpOverridecodeService } from '../Services/fp-overridecode.service';
import Swal from 'sweetalert2';
import { TableUtil } from '../util/TableUtil';
import { DatePipe } from '@angular/common';
import { ReferalService } from '../Services/referal.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-fp-override-view',
  templateUrl: './fp-override-view.component.html',
  styleUrls: ['./fp-override-view.component.scss']
})
export class FpOverrideViewComponent implements OnInit {

  months: any;
  year: number;
  txtsearchData: any;
  fpOverrideList: any;
  currentPage: any;
  showPegi: boolean;
  record: any;
  pageElement: any;
  user: any;
  hospitalList: any;
  report: any[];
  override: any = {
    Slno: '',
    patientName: '',
    urn: '',
    description: '',
    hospitalCode: '',
    hospitalName: '',
    useFor: '',
    noOfDays: '',
    overrideCode: '',
    approveStatus: '',
    requestedDate: '',
    approveDate: '',
    remarks: ''
  };
  heading = [
    [
      'Sl No.',
      'Patient Name',
      'URN',
      'Description',
      'Hospital Code',
      'Hospital Name',
      'Use For',
      'No. Of Days',
      'Override Code',
      'Approve Status',
      'Requested Date',
      'Approved Date',
      'Remarks'
    ],
  ]
  constructor(public headerService: HeaderService,
    private fpOverridecodeService: FpOverridecodeService,
    public datepipe: DatePipe,
    private referalService: ReferalService,
    private sessionService: SessionStorageService
    ) { }

  ngOnInit(): void {
    this.headerService.setTitle('View FP Override Code');
    this.user = this.sessionService.decryptSessionData("user");
    this.currentPage = 1;
    this.pageElement = 10;
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
    let month: any = date.getMonth();
    if (month == -1) {
      this.months = 'Dec';
      this.year = year - 1;
    } else {
      this.months = this.getMonthFrom(month);
      this.year = year;
    }
    var frstDay = date1 + '-' + this.months + '-' + this.year;
    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr("placeholder", "From Date *");
    $('input[name="toDate"]').attr("placeholder", "To Date *");
    this.overrideRequestData();
    this.gethospitallist();
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
  getDate(date) {
    let year = date.getFullYear();
    let date1 = date.getDate();
    let months = date.getMonth();
    let month = this.getMonthFrom(months);
    var frstDay = date1 + '-' + month + '-' + year;
    return frstDay;
  }

  overrideRequestData() {
    let userId = this.user.userId;
    let fromDate = $('#date1').val();
    let toDate = $('#date2').val();
    let aprvStatus = $('#aprvStatus').val();
    let action = 'B';
    let hospitalCode = $('#hospitalCode').val();
    if (Date.parse(fromDate) > Date.parse(toDate)) {
      this.swal('', ' From Date should be less To Date', 'error');
      return;
    }
    this.fpOverridecodeService.getOverrideCode(userId, fromDate, toDate, action, aprvStatus, hospitalCode).subscribe((data: any) => {
      this.fpOverrideList = data
      for (var i = 0; i < this.fpOverrideList.length; i++) {
        var overrideList = this.fpOverrideList[i]
        if (overrideList.approveStatus == 'Y') {
          overrideList.approveStatus = 'Approve';
        }
        if (overrideList.approveStatus == 'R') {
          overrideList.approveStatus = 'Reject';
        }
      }
      this.record = this.fpOverrideList.length;
      if (this.record > 0) {
        this.showPegi = true;
      }
      else {
        this.showPegi = false
      }
    })
  }
  resetField() {
    window.location.reload();
  }
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  }
  downloadList() {
    this.report = [];
    let overrideCode: any;
    for (var i = 0; i < this.fpOverrideList.length; i++) {
      overrideCode = this.fpOverrideList[i];
      this.override = []
      this.override.Slno = i + 1;
      this.override.patientName = overrideCode.patientName;
      this.override.urn = overrideCode.urn;
      this.override.description = overrideCode.description;
      this.override.hospitalCode = overrideCode.hospitalCode;
      this.override.hospitalName = overrideCode.hospitalName;
      this.override.useFor = overrideCode.generatedThrough;
      this.override.noOfDays = overrideCode.noOfDays;
      this.override.overrideCode = overrideCode.fpOverrideCode;
      this.override.approveStatus = overrideCode.approveStatus;
      this.override.requestedDate = this.datepipe.transform(overrideCode.requestedDate, 'dd-MMM-yy');
      this.override.approveDate = this.datepipe.transform(overrideCode.approveDate, 'dd-MMM-yy');
      this.override.remarks = overrideCode.remarks;
      if (this.override.remarks == null) {
        this.override.remarks = "N/A"
      }
      this.report.push(this.override)
    }
    TableUtil.exportListToExcel(
      this.report, 'FP Override Code', this.heading
    );
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  gethospitallist() {
    this.referalService.gethospitallist(this.user.userId).subscribe((data: any) => {
      this.hospitalList = data;
    })
  }
}
