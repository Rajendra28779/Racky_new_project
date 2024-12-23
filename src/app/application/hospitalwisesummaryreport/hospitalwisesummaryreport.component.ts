import { Component, OnInit } from '@angular/core';
import { PaidClaimReportService } from '../Services/paid-claim-report.service';
import { SnoCLaimDetailsService } from '../Services/sno-claim-details.service';
import { HeaderService } from '../header.service';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service';
import Swal from 'sweetalert2';
import { TableUtil } from '../util/TableUtil';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-hospitalwisesummaryreport',
  templateUrl: './hospitalwisesummaryreport.component.html',
  styleUrls: ['./hospitalwisesummaryreport.component.scss']
})
export class HospitalwisesummaryreportComponent implements OnInit {
  user: any;
  result: any = [];
  record: any;
  innerpage: any = [];
  getdata: any = [];
  constructor(public paidclaimService: PaidClaimReportService, public snoService: SnoCLaimDetailsService, public headerService: HeaderService,
    private jwtService: JwtService, private route: Router,private sessionService: SessionStorageService
    ) { }

  ngOnInit(): void {
    this.headerService.setTitle('Hospital wise  Payment Summary Report');
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
    let month: any
    var date = new Date();
    let year = date.getFullYear();
    let date1 = '01';
    if (date.getMonth() == 0) {
      year = year - 1;
      month = 11;
    } else {
      month = date.getMonth() - 1;
    }
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
    var frstDay = date1 + "-" + month + "-" + year;
    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr("placeholder", "From Date *");
    $('input[name="toDate"]').attr("placeholder", "To Date *");
  }
  resetField() {
    window.location.reload();
  }
  Search: any;
  days: number;
  fromDate: any;
  toDate: any;
  gethospitalsummarycount() {
    let userid = this.user.userName;
    this.fromDate = $('#datepicker4').val();
    this.toDate = $('#datepicker3').val();
    this.Search = $('#actionType').val()
    const fromDate1 = this.GetDate(this.fromDate);
    const todate1 = this.GetDate(this.toDate);
    let diffTime = Math.abs(todate1.getTime() - fromDate1.getTime());
    this.days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (this.Search == '' || this.Search == null || this.Search == undefined) {
      this.swal('', 'Please Select Search Type', 'info');
      return;
    }
    if (Date.parse(this.fromDate) > Date.parse(this.toDate)) {
      this.swal('', ' From Date should be less than To Date', 'error');
      return;
    }
    if (this.Search == '' || this.Search == null || this.Search == undefined) {
      this.swal('', 'Please Select Search Type', 'info');
      return;
    }
    this.paidclaimService.gethospitalcountresult(this.fromDate, this.toDate, this.Search, userid).subscribe((response: any) => {
      this.result = response;
    }
    );
  }
  GetDate(str) {
    var arr = str.split("-");
    var months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    var month = months.indexOf(arr[1].toLowerCase());
    return new Date(parseInt(arr[2]), month, parseInt(arr[0]));
  }

  report: any = [];
  reports: any = [];
  sno: any = {
    Slno: "",
    totalcase: "",
    totalamount: ""
  };
  heading = [['Total Case', 'Total Amount']];
  downloadReport(type: any) {
    this.report = [];
    let claim: any;
    for (var i = 0; i < this.result.length; i++) {
      claim = this.result[i];
      this.sno = [];
      this.sno.totalcase = claim.totalcase;
      this.sno.totalamount = claim.totalamount;
      this.report.push(this.sno);
    }
    if (type == 'xcl') {
      let filter = [];
      filter.push([['Actual Date of Discharge from :- ', this.fromDate]]);
      filter.push([['Actual Date of Discharge to:- ', this.toDate]]);
      if (this.Search == 3) {
        filter.push([['Search Type'+':-'+'SNA Rejected']]);
      } else if (this.Search == 2) {
        filter.push([['Search Type'+':-'+'Paid']]);
      } else if (this.Search == 1) {
        filter.push([['Search Type'+':-'+'Freezed']]);
      }
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'Hospital wise Payment Summary Report',
        this.heading, filter
      );
    } else if (type == 'pdf') {
      if (this.result.length == 0) {
        this.swal('', 'No Data Found', 'info');
        return;
      }
      let SlNo = 1;
      this.result.forEach(element => {
        let rowData = [];
        rowData.push(element.totalcase);
        rowData.push(element.totalamount);
        this.reports.push(rowData);
      });
      let doc = new jsPDF('l', 'mm', [238, 270]);
      doc.setFontSize(10);
      doc.text('Hospital Name :-' + this.user.fullName, 5, 5);
      doc.text('Actual Date of Discharge From:-' + this.fromDate, 5, 10);
      doc.text('Actual Date of DischargeTo:-' + this.toDate, 5, 15);
      if (this.Search == 3) {
        doc.text('Search Type' + ':-' + 'SNA Rejected', 5, 20);
      } else if (this.Search == 1) {
        doc.text('Search Type' + ':-' + 'Freezed', 5, 20);
      } else {
        doc.text('Search Type' + ':-' + 'Paid', 5, 20);
      }
      doc.text('Document Generate Date :-' + new Date().toLocaleString(), 5, 25);
      autoTable(doc, {
        head: this.heading, body: this.reports, startY: 28, theme: 'grid',
        styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
        bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
        columnStyles: {
          0: { cellWidth: 60},
          1: { cellWidth: 60 },
        }
      })
      doc.save('Hospital_wise_Payment_Summary_Report.pdf');
    }
    this.reports = [];
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  gtdata(item:any) {
    if(item==0){
      this.swal('', 'No Data Found', 'info');
      return;
    }
    localStorage.setItem("Fromdate",$('#datepicker4').val());
    localStorage.setItem("Todate",  $('#datepicker3').val());
    localStorage.setItem("searchtyp", $('#actionType').val());
    localStorage.setItem("userId", this.user.userName);
    localStorage.setItem("token", this.jwtService.getJwtToken())
    this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/hospitalsummarryinerpage'); });
  }
}