import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { HeaderService } from '../header.service';
import { CpdNamewiseCountReportService } from '../Services/cpd-namewise-count-report.service';
import { TableUtil } from '../util/TableUtil';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { DatePipe } from '@angular/common';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-cpd-namewsise-count-report',
  templateUrl: './cpd-namewsise-count-report.component.html',
  styleUrls: ['./cpd-namewsise-count-report.component.scss']
})
export class CpdNamewsiseCountReportComponent implements OnInit {
  txtsearchDate: any;
  list: any = [];
  showPegi: any;
  pageElement: any;
  currentPage: any;
  user: any;
  dataa: any = [];
  datalength: any;
  record: any;
  totalApproveCount: any;
  totalApproveCount1: any;
  totalApproveCount2: any;
  totalApproveCount3: any;
  //  totalApproveCount4:any;
  constructor(
    private cpdnamewiseservice: CpdNamewiseCountReportService,
    public headerService: HeaderService,private sessionService: SessionStorageService,
    public route: Router) { }

  ngOnInit(): void {
    this.headerService.setTitle('CPD Name Wise Count Report');
    // this.user = JSON.parse(sessionStorage.getItem('user'));
    this.user = this.sessionService.decryptSessionData("user");
    $('.selectpicker').selectpicker();

    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      // endDate: '0d',
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
    // var firstDay = new Date(date.getFullYear(), date.getMonth()-1, 1);
    // let day = moment(new Date(firstDay.substr(0, 16)));
    // let frstDay=firstDay.format('DD-MMM-YYYY');
    // var frstDay = firstDay.getDate()+"-"+(firstDay.getMonth()+1)+"-"+firstDay.getFullYear();
    let year = date.getFullYear();
    let date1 = '01';
    let date2 = date.getDate();
    let month: any = date.getMonth();
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
    var secoundDay = date2 + "-" + month + "-" + year;
    //Date input placeholder
    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr("placeholder", "From Date *");

    //  $('input[name="toDate"]').val(secoundDay);
    $('input[name="toDate"]').attr("placeholder", "To Date *");


    this.search();

  }
  fdate: any
  tdate: any
  username: any;
  timespan: any;

  search() {

    let formdate = $('#datepicker1').val();
    this.fdate = formdate
    let todate = $('#datepicker2').val();
    this.tdate = todate
    this.username = this.user.fullName
    this.timespan = new Date()
    this.cpdnamewiseservice.getCpdcountList(formdate, todate).subscribe((data: any) => {
      this.dataa = data;

      let sum = 0;
      let sum1 = 0;
      let sum2 = 0;

      let sum3 = 0;
      for (let i = 0; i < this.dataa.length; i += 1) {
        sum += parseInt(this.dataa[i].APPROVE);
        sum1 += parseInt(this.dataa[i].REJECT);
        sum2 += parseInt(this.dataa[i].QUERY);

        sum3 += parseInt(this.dataa[i].CLAIM);
      }
      this.totalApproveCount = sum;
      this.totalApproveCount1 = sum1;
      this.totalApproveCount2 = sum2;

      this.totalApproveCount3 = sum3;


      // let sum4 = 0;


      this.record = this.dataa.length;
      if (this.record > 0) {
        this.currentPage = 1;
        this.pageElement = 10;
        this.showPegi = true;
      } else {
        this.showPegi = false;
      }
    });

  }

  pageItemChange() {

    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;

  }


  resetField() {
    window.location.reload();
  }
  Details(claim: any) {
    localStorage.setItem("userid", claim.ACTIONBY);
    let state = {
      fullname: claim.FULL_NAME,
      userId: claim.ACTIONBY,
      formdate: this.fdate,
      todate: this.tdate,

    }
    localStorage.setItem("Details", JSON.stringify(state));
    // let navigationExtras: NavigationExtras = {
    //   state: {
    //     userId: claim.ACTIONBY,
    //       formdate: this.fdate,
    //       todate: this.tdate,
    //   }
    // };

    this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/application/cpdnamewisedetails'); });
    // this.route.navigate(['/application/cpdnamewisedetails'], navigationExtras);
  }



  report: any = [];
  sno: any = {
    Slno: '',
    CPDname: '',
    Approve: '',
    Reject: '',
    Query: '',
    TotalSettlement: '',



  };
  heading = [
    [
      'Sl#',
      'CPD Name',
      'Approve',
      'Reject',
      'Query',
      'TotalSettlement',


    ],
  ];
  downloadReport(type) {
    this.report = [];
    let claim: any;

    for (var i = 0; i < this.dataa.length; i++) {
      claim = this.dataa[i];
      this.sno = [];
      this.sno.Slno = i + 1;
      this.sno.CPDname = claim.FULL_NAME;
      this.sno.Approve = claim.APPROVE;
      this.sno.Reject = claim.REJECT;
      this.sno.Query = claim.QUERY;
      this.sno.TotalSettlement = claim.CLAIM;
      this.report.push(this.sno);
    }
    this.sno = [];
    this.sno.CPDname = "TOTAL";
    this.sno.Approve = this.totalApproveCount;
    this.sno.Reject = this.totalApproveCount1;
    this.sno.Query = this.totalApproveCount2;
    this.sno.TotalSettlement = this.totalApproveCount3;
    this.report.push(this.sno);
    if (type == 'xcl') {
      let filter = [];

      filter.push([['Actual Date of Discharge from :- ', this.fdate]]);
      filter.push([['Actual Date of Discharge to:- ', this.tdate]]);
      //filter.push([['Created By:- ',this.username]]);
      //filter.push([['Date & Time:- ',this.convertStringToDate1(this.timespan)]]);

      TableUtil.exportListToExcelWithFilter(
        this.report,
        'CPD Name Wise Count  Report',
        this.heading, filter
      );
    }
    else if (type == 'pdf') {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }

      var doc = new jsPDF('l', 'mm', [360, 260]);
      doc.text("CPD Name Wise Count  Report", 5, 10);
      doc.setFontSize(12);
      doc.text('Actual Date of Discharge :- ' + this.fdate + ' To ' + this.tdate, 5, 20);
      doc.text('Created By:- ' + this.username, 5, 30);
      doc.text('Date & Time:- ' + this.convertStringToDate1(this.timespan), 5, 40);
      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.Slno;
        pdf[1] = clm.CPDname;
        pdf[2] = clm.Approve;
        pdf[3] = clm.Reject;
        pdf[4] = clm.Query;
        pdf[5] = clm.TotalSettlement;




        rows.push(pdf);
      }
      autoTable(doc, {
        head: this.heading,
        body: rows,
        theme: 'grid',
        startY: 50,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 60 },
          2: { cellWidth: 60 },
          3: { cellWidth: 60 },
          4: { cellWidth: 60 },
          5: { cellWidth: 60 },


        }
      });
      doc.save('Bsky_CPD_Name_Wise_Count_Report.pdf');
    }
  }
  convertStringToDate1(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy HH:mm:ss');
    return date;
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
}
