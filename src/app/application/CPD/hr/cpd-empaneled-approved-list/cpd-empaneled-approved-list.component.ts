import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { HrApprovalService } from 'src/app/application/Services/hr-approval-service';
import { HeaderService } from 'src/app/application/header.service';
import { TableUtil } from 'src/app/application/util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import Swal from 'sweetalert2';
declare let $: any;

@Component({
  selector: 'app-cpd-empaneled-approved-list',
  templateUrl: './cpd-empaneled-approved-list.component.html',
  styleUrls: ['./cpd-empaneled-approved-list.component.scss']
})
export class CpdEmpaneledApprovedListComponent implements OnInit {
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
  constructor(public headerService: HeaderService,
    private sessionService: SessionStorageService,
    private hrApprovalService: HrApprovalService,
    public route: Router) { }

  ngOnInit(): void {
    this.headerService.setTitle('Approved Application');
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
    // this.onWhatsApp();
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
  reportExcel: any = [];
  downloadReport() {
    this.reportExcel = [];
    let claim: any;
    for (var i = 0; i < this.cpdFreshApplication.length; i++) {
      claim = this.cpdFreshApplication[i];
      this.sno = [];
      this.sno.Slno = i + 1;
      this.sno.Nameofcpd = claim.fullName;
      this.sno.Mobileno = claim.phone;
      this.sno.Emailid = claim.email;
      this.sno.Dob = claim.dob;
      this.sno.SubmissionDate = claim.dateOfSubmission;
      this.reportExcel.push(this.sno);
    }
    let filter1 = [];
    filter1.push([['Request Submission From:-', this.fromDate]]);
    filter1.push([['Request Submission To:-', this.toDate]]);
    TableUtil.exportListToExcelWithFilterforadmin(this.reportExcel, "Approved_Application List", this.heading, filter1);
  }
  report: any = [];
  sno: any = {
    Slno: "",
    Nameofcpd: "",
    Mobileno: "",
    Emailid: "",
    Dob: "",
    SubmissionDate: "",
  };
  heading = [['Sl#', 'Name of CPD	', 'Mobile No.', 'Email ID', 'DOB', 'Submission Date']];
  downloadPdf() {
    if (this.cpdFreshApplication.length == 0) {
      this.swal('', 'No Data Found', 'info');
      return;
    }
    let SlNo = 1;
    this.report = [];
    this.cpdFreshApplication.forEach(element => {
      let rowData = [];
      rowData.push(SlNo++);
      rowData.push(element.fullName);
      rowData.push(element.phone);
      rowData.push(element.email);
      rowData.push(element.dob);
      rowData.push(element.dateOfSubmission);
      this.report.push(rowData);
    });
    let doc = new jsPDF('l', 'mm', [238, 270]);
    doc.setFontSize(10);
    doc.text('Authority Name :-' + this.user.fullName, 5, 5)
    doc.text('Request Submission From :-' + this.fromDate, 5, 10)
    doc.text('Request Submission To :-' + this.toDate, 5, 15)
    doc.text('Document Generate Date :-' + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en').toString(), 5, 20);
    doc.text('Approved_Application', 100, 22);
    doc.setLineWidth(0.7);
    doc.line(100, 23, 134, 23);
    autoTable(doc, {
      head: this.heading, body: this.report, startY: 25, theme: 'grid',
      styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
      bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
      headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 30 },
        2: { cellWidth: 30 },
        3: { cellWidth: 60 },
        4: { cellWidth: 30 },
        5: { cellWidth: 30 },
      }
    })
    doc.save('Approved_Application.pdf');
  }
  pageItemChange() { }
  fromDate: any;
  toDate: any;
  responseData: any;
  onClickSearch() {
    this.fromDate = $('#datepicker1').val();
    this.toDate = $('#datepicker2').val();
    // let cpdName = $('#cpdName').val();
    // let mobile = $('#mobile').val();
    if (Date.parse(this.fromDate) > Date.parse(this.toDate)) {
      this.swal('Info', ' From Date should be less than To Date', 'info');
      return;
    }
    let requestData = {
      fromDate: new Date(this.fromDate),
      toDate: new Date(this.toDate),
      status: 5,
      // mobile: mobile,
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
    this.route.navigate(['/application/cpdempanelarrovedetails']);
  }

  onWhatsApp() {
    this.fromDate = $('#datepicker1').val();
    this.toDate = $('#datepicker2').val();
    // let cpdName = $('#cpdName').val();
    // let mobile = $('#mobile').val();
    if (Date.parse(this.fromDate) > Date.parse(this.toDate)) {
      this.swal('Info', ' From Date should be less than To Date', 'info');
      return;
    }
    let requestData = {
      fromDate: new Date(this.fromDate),
      toDate: new Date(this.toDate),
      status: 5,
      // mobile: mobile,
    };
    this.hrApprovalService.onWhatsApp().subscribe(
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
  getPreview(data) {
    localStorage.setItem('actionData', data.userId);
    this.route.navigate(['/application/cpdempanelpreview']);
  }
}
