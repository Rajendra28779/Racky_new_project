import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HeaderService } from '../../../header.service';
import { CPDActionReportServiceService } from '../../../Services/cpdaction-report-service.service';
import { SnocreateserviceService } from '../../../Services/snocreateservice.service';
import { TableUtil } from '../../../util/TableUtil';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';
import autoTable from 'jspdf-autotable';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-cpdaction-report',
  templateUrl: './cpdaction-report.component.html',
  styleUrls: ['./cpdaction-report.component.scss']
})
export class CPDActionReportComponent implements OnInit {
  public cpdList: any = [];
  user: any;

  name: any = "";
  userId: any;
  stickyear: any;
  selectedYear: any;
  years: any[] = [];
  Months: any;
  cpdId: any;
  data: any;
  showPegi: boolean;
  record: any;
  totalApproveCount: any;
  totalApproveCount1: any;
  totalApproveCount2: any;
  txtsearchDate: any;
  totalApproveCount3: any;

  totalApproveCount4: any;

  totalApproveCount5: any;

  totalApproveCount6: any;

  constructor(private cpdactionservice: CPDActionReportServiceService, private snoService: SnocreateserviceService, public fb: FormBuilder, public headerService: HeaderService,private sessionService: SessionStorageService,) { }
  form: FormGroup;
  ngOnInit(): void {
    this.headerService.setTitle('CPD Action Report');
    // this.user = JSON.parse(sessionStorage.getItem("user"));
    this.user = this.sessionService.decryptSessionData("user");
    this.userId = this.user.userId
    this.form = this.fb.group({
      cpdId: new FormControl(''),
      cpdName: new FormControl(''),
    })
    this.selectedYear = new Date().getFullYear();
    this.stickyear = this.selectedYear
    for (let year = this.selectedYear; year >= 2010; year--) {
      this.years.push(year);
    }
    let month: any = new Date().getMonth();
    if (month == 0) {
      this.Months = 'JAN';
    } else if (month == 1) {
      this.Months = 'FEB';
    } else if (month == 2) {
      this.Months = 'MAR';
    } else if (month == 3) {
      this.Months = 'APR';
    } else if (month == 4) {
      this.Months = 'MAY';
    } else if (month == 5) {
      this.Months = 'JUN';
    } else if (month == 6) {
      this.Months = 'JUL';
    } else if (month == 7) {
      this.Months = 'AUG';
    } else if (month == 8) {
      this.Months = 'SEP';
    } else if (month == 9) {
      this.Months = 'OCT';
    } else if (month == 10) {
      this.Months = 'NOV';
    } else if (month == 11) {
      this.Months = 'DEC';
    }
    this.getCPDList();

    // $('#cpdId').val("");


  }
  Month: any;
  MON() {
    if (this.Months == 'JAN') {
      this.Month = 'JANUARY';
    } else if (this.Months == 'FEB') {
      this.Month = 'FEBRUARY';
    } else if (this.Months == 'MAR') {
      this.Month = 'MARCH';
    } else if (this.Months == 'APR') {
      this.Month = 'APRIL';
    } else if (this.Months == 'MAY') {
      this.Month = 'MAY';
    } else if (this.Months == 'JUN') {
      this.Month = 'JUNE';
    } else if (this.Months == 'JUL') {
      this.Month = 'JULY';
    } else if (this.Months == 'AUG') {
      this.Month = 'AUGUST';
    } else if (this.Months == 'SEP') {
      this.Month = 'SEPTEMBER';
    } else if (this.Months == 'OCT') {
      this.Month = 'OCTOBER';
    } else if (this.Months == 'NOV') {
      this.Month = 'NOVEMBER';
    } else if (this.Months == 'DEC') {
      this.Month = 'DECEMBER';
    }

    return this.Month;
  }
  timespan: any;
  getCPDList() {

    this.snoService.getCPDList().subscribe(
      (response) => {
        this.cpdList = response;
        if (this.user.groupId == 3) {
          let data = this.cpdList
          for (let i = 0; i <= this.cpdList.length; i++) {
            if (data[i].userid.userId == this.userId) {
              this.name = data[i].userid.userId;
              this.cpdList = [];
              this.cpdList.push(data[i]);
              break;
            }
          }
        } else {
          this.name = "";
        }
      },
      (error) => console.log(error)
    )
    if (this.user.groupId == 3) {
      this.getCpdAction();
    } else {


    }

  }
  username: any;

  getCpdAction() {
    this.username = this.user.fullName;
    this.timespan = new Date();

    let Year = $('#yearId').val();
    let months = $('#monthId').val();
    var userid;
    if (this.user.groupId == 3) {
      userid = this.name;
    } else {
      userid = $('#cpdId').val();

    }
    if (Year == null || Year == "" || Year == undefined) {
      Year = this.selectedYear

    } if (months == null || months == "" || months == undefined) {
      months = this.Months

    } if (userid == null || userid == "" || userid == undefined) {
      userid = this.userId

    }
    this.cpdactionservice.getcpdaction(userid, Year, months).subscribe((data: any) => {
      this.data = data;
      let sum = 0;
      let sum1 = 0;
      let sum2 = 0;

      let sum3 = 0;

      let sum4 = 0;

      let sum5 = 0;

      let sum6 = 0;


      for (let i = 0; i < this.data.length; i += 1) {
        sum += this.data[i].approve;
        sum1 += this.data[i].reject;
        sum2 += this.data[i].query;

        sum3 += this.data[i].dishonour;

        sum4 += this.data[i].myamount;

        sum5 += this.data[i].dishonouramount;

        sum6 += this.data[i].finalamount;

      }
      this.totalApproveCount = sum;
      this.totalApproveCount1 = sum1;
      this.totalApproveCount2 = sum2;

      this.totalApproveCount3 = sum3;

      this.totalApproveCount4 = sum4;

      this.totalApproveCount5 = sum5;

      this.totalApproveCount6 = sum6;



      this.record = this.data.length;
      if (this.record > 0) {
        this.showPegi = true;
      }
      else {
        this.showPegi = false;
      }

    });
  }
  report: any = [];
  sno: any = {
    Slno: '',
    Date: '',
    TotalApproved: '',
    TotalRejected: '',
    TotalQueried: '',
    TotalDishonour: '',

    MyAmount: '',
    DishonourAmount: '',
    FinalAmountAmount: '',




  };
  heading = [
    [
      'Sl#',
      'Date',
      ' Total Approved',
      'Total Rejected',
      'Total Queried',

      'Total Dishonour',

      'My Amount(Approved+Rejected)(₹)',

      'Dishonour Amount(₹)',

      'Final Amount(₹)',


    ],
  ];

  downloadReport(type) {
    this.report = [];
    let claim: any;
    for (var i = 0; i < this.data.length; i++) {
      claim = this.data[i];
      this.sno = [];
      this.sno.Slno = i + 1;
      this.sno.Date = claim.date;
      this.sno.TotalApproved = claim.approve;
      this.sno.TotalRejected = claim.reject;
      this.sno.TotalQueried = claim.query;

      this.sno.TotalDishonour = claim.dishonour;

      this.sno.MyAmount = claim.myamount;

      this.sno.DishonourAmount = claim.dishonouramount;

      this.sno.FinalAmountAmount = claim.finalamount;





      this.report.push(this.sno);
    }
    if (type == 'xcl') {
      let filter = [];
      filter.push([['Year :- ', this.stickyear]]);
      filter.push([['Month:- ', this.MON()]]);

      TableUtil.exportListToExcelWithFilter(
        this.report,
        'CPD Payment Report',
        this.heading,
        filter
      );
    }
    else if (type == 'pdf') {

      if (this.report == null || this.report.length == 0) {
        this.swal('Info', 'No Record Found', 'info');
        return;
      }
      var doc = new jsPDF('l', 'mm', [360, 260]);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('CPD Action Report', 120, 10);
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      doc.text('Year : ' + this.stickyear, 10, 20);
      doc.text('Month :' + this.MON(), 10, 30);
      doc.text('Generated By :- ' + this.username, 10, 40);
      doc.text(
        'Generated On :' + this.convertStringToDate1(this.timespan), 10, 50);
      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.Slno;
        pdf[1] = clm.Date;
        pdf[2] = clm.TotalApproved;
        pdf[3] = clm.TotalRejected;
        pdf[4] = clm.TotalQueried;
        pdf[5] = clm.TotalDishonour;
        pdf[6] = clm.MyAmount;
        pdf[7] = clm.DishonourAmount;
        pdf[8] = clm.FinalAmountAmount;

        rows.push(pdf);
      }
      autoTable(doc, {
        head: this.heading,
        body: rows,
        theme: 'grid',
        startY: 60,
        headStyles: {
          fillColor: [26, 99, 54],
        },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 30 },
          2: { cellWidth: 30 },
          3: { cellWidth: 30 },
          4: { cellWidth: 40 },
          5: { cellWidth: 40 },
          6: { cellWidth: 50 },
          7: { cellWidth: 50 },
          8: { cellWidth: 50 },
        },
      });
      doc.save('CPD Payment Report.pdf');
    }
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  getReset() {
    // alert("hi")
    window.location.reload();

    // let Year=$('#yearId').val();
    // let months=$('#monthId').val();
    // var userid;
  }
  convertStringToDate1(date) {
    var datePipe = new DatePipe('en-US');
    date = datePipe.transform(date, 'dd-MMM-yyyy h:mm:ss a');
    return date;
  }

}
