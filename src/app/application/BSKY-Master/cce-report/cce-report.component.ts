import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../header.service';
import { Router, NavigationExtras } from '@angular/router';
import { CallCenterExecutiveService } from '../../Services/call-center-executive.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import Swal from 'sweetalert2';
import { FormControl, FormGroup } from '@angular/forms';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { TableUtil } from '../../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;
@Component({
  selector: 'app-cce-report',
  templateUrl: './cce-report.component.html',
  styleUrls: ['./cce-report.component.scss']
})
export class CceReportComponent implements OnInit {
  cceReport: any;
  txtsearchDate: any;
  showPegi: any;
  pageElement: any;
  currentPage: any;
  hospitalList: any;
  districtList: any;
  stateList: any;
  months: string;
  year: number;
  selectedItems: any = [];
  cceOutboundData: any;
  record: any;
  user: any;
  fromDate: any;
  toDate: any;
  countfloate: number;
  action: string;
  hospitalCode: string;
  userId: string;
  CceDetails: any;
  CceDetailsList: any[];
  constructor(private route: Router, public headerService: HeaderService,
    private callCenterExecutiveService: CallCenterExecutiveService,
    private snoService: SnocreateserviceService,
    private sessionService: SessionStorageService) { }

  group = new FormGroup({
    action: new FormControl(''),
    fromDate: new FormControl(''),
    toDate: new FormControl(''),
    stateName: new FormControl(''),
    districtName: new FormControl(''),
    hospitalName: new FormControl(''),
    totalCompleted: new FormControl(''),
    totalConnectedCall: new FormControl(''),
    totalNotConnectedCall: new FormControl(''),
    totalNoCall: new FormControl(''),
    totalCount: new FormControl(''),
  });
  ngOnInit(): void {
    this.currentPage = 1;
    this.pageElement = 10;
    this.headerService.setTitle('Cce Out Bound Call Report');
    this.user = this.sessionService.decryptSessionData("user");
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
    this.outBoundData();
    this.getStateList();
    this.cceReportList();
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
  getStateList() {
    this.snoService.getStateList().subscribe(
      (response) => {
        this.stateList = response;
      },
      (error) => console.log(error)
    )
  }
  OnChangeState(id) {
    $("#districtId").val("");
    this.selectedItems = [];
    localStorage.setItem("stateCode", id);
    this.snoService.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = response;
      },
      (error) => console.log(error)
    )
  }
  OnChangeDistrict(id) {
    this.selectedItems = [];
    var stateCode = localStorage.getItem("stateCode");
    this.snoService.getHospitalbyDistrictId(id, stateCode).subscribe(
      (response) => {
        this.hospitalList = response;
      },
      (error) => console.log(error)
    )
  }
  outBoundData() {
    let userId = this.user.userId;
    let fromDate = $('#date1').val();
    let toDate = $('#date2').val();
    let action = 'A';
    let cceId = 0
    let hospitalCode = $('#hospital').val();
    let queryStatus = ''
    this.callCenterExecutiveService.getCceOutBound(action, userId, fromDate, toDate, cceId, hospitalCode, 0, 0, queryStatus, null, null).subscribe((data: any) => {
      this.cceOutboundData = data;
      this.record = this.cceOutboundData.length;
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
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  }
  downloadReport1() { }

  cceReportList() {
    let action = 'A';
    let fromDate = $('#date1').val();
    let toDate = $('#date2').val();
    let userId = this.user.userId;
    let hospitalCode = $('#hospital').val();
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.userId = userId;
    this.hospitalCode = hospitalCode;
    if (Date.parse(fromDate) > Date.parse(toDate)) {
      this.swal('', ' From Date should be less To Date', 'error');
      return;
    }
    this.callCenterExecutiveService.getCceReport(action, userId, fromDate, toDate, hospitalCode).subscribe((data: any) => {
      this.cceReport = data;
      this.countfloate = this.cceReport.length;
      if (this.countfloate > 0) {
        this.showPegi = true;
      } else {
        this.showPegi = false;
      }
    });
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  GetCountDetails() {
    let navigationExtras: NavigationExtras = {
      state: {
        fdate: this.fromDate,
        tdate: this.toDate,
        userid: this.userId,
        hcode: this.hospitalCode
      }
    };
    this.route.navigate(['/application/cceReportTotalConnected'], navigationExtras);
  }
  report: any = [];
  ccereportList: any = {
    slNo: "",
    totalCount: "",
    totalConnectedCall: "",
    totalNotConnectedCall: "",
    totalNoCall: ""
  };
  heading = [['Sl No.', 'Total Count', 'Total Connected', 'Total Not Connected', 'Total No Call']];
  downloadReport(type: any) {
    this.report = [];
    let item: any;
    for (var i = 0; i < this.cceReport.length; i++) {
      item = this.cceReport[i];
      this.ccereportList = [];
      this.ccereportList.slNo = i + 1;
      this.ccereportList.totalCount = item.totalCount;
      this.ccereportList.totalConnectedCall = item.totalConnectedCall;
      this.ccereportList.totalNotConnectedCall = item.totalNotConnectedCall;
      this.ccereportList.totalNoCall = item.totalNoCall;
      this.report.push(this.ccereportList);
    }
    if (type == 'excel') {
      TableUtil.exportListToExcel(this.report, "Cce Report", this.heading);
    } else if (type == 'pdf') {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('l', 'mm', [360, 260]);
      doc.text("Cce Report", 14, 20);
      doc.setFontSize(8);
      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.slNo;
        pdf[1] = clm.totalCount;
        pdf[2] = clm.totalConnectedCall;
        pdf[3] = clm.totalNotConnectedCall;
        pdf[4] = clm.totalNoCall;
        rows.push(pdf);
      }
      autoTable(doc, {
        head: this.heading,
        body: rows,
        theme: 'grid',
        startY: 25,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 30 },
          2: { cellWidth: 30 },
          3: { cellWidth: 25 },
          4: { cellWidth: 30 },
          5: { cellWidth: 25 },
        }
      });
      doc.save('Bsky_Hospital Cce Report.pdf');

    }
  }
}
