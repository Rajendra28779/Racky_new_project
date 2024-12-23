import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../header.service';
import { RationCardSchedularReportService } from '../Services/ration-card-schedular-report.service';
import { TableUtil } from '../util/TableUtil';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-ration-card-schedular-report',
  templateUrl: './ration-card-schedular-report.component.html',
  styleUrls: ['./ration-card-schedular-report.component.scss']
})
export class RationCardSchedularReportComponent implements OnInit {
  stickyear: any;
  years: any[] = [];
  Months: any;
  data: any;
  showPegi: boolean;
  user: any;
  selectedYear: any;
  record: any;
  txtsearchDate: any;

  constructor(
    public route: Router,
    public fb: FormBuilder,
    private rationcardservice: RationCardSchedularReportService,
    public headerService: HeaderService,private sessionService: SessionStorageService,

  ) { }

  ngOnInit(): void {
    this.headerService.setTitle('Ration Card Schedular Report');
    // this.user = JSON.parse(sessionStorage.getItem("user"));
    this.user = this.sessionService.decryptSessionData("user");
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


    this.getList()
  }
  Month: any;
  MON(mpn: any) {
    if (this.Months == 'JAN') {
      this.Month = 'JANUARY';
    } else if (this.Months == 'FEB') {
      this.Month = 'FEBRUARY';
    } else if (this.Months == 'MAR') {
      this.Month = 'MARCH';
    } else if (this.Months == 'APR') {
      this.Month = 'APRIL';
    } else if (this.Months = 'MAY') {
      this.Month == 'MAY';
    } else if (this.Months = 'JUN') {
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
    } else if (this.Months = 'DEC') {
      this.Month = 'DECEMBER';
    }
    return this.Month;
  }
  mon: any;
  year: any;
  username: any;
  timespan: any;
  getList() {
    this.timespan = new Date()
    this.username = this.user.fullName
    this.rationcardservice.getrationcardDetails(this.stickyear, this.Months).subscribe((data: any) => {
      this.data = data;
      this.record = this.data.length;
      if (this.record > 0) {
        this.showPegi = true;
      }
      else {
        this.showPegi = false;
      }

    });
  }
  getReset() {
    window.location.reload();
  }


  report: any = [];
  sno: any = {
    Slno: '',
    ID: '',
    SERVICESTATUS: '',

    STARTDATE: '',
    ENDDATE: '',
    RECORDSFETCHED: '',
    RECORDSINSERTED: '',
    RECORDSUPDATED: '',
    RECORDSFAILED: '',
    CREATEDBY: '',

    CREATEDON: ''

  };
  heading = [
    [
      'Sl#',
      'ID',
      'SERVICE STATUS',

      'START DATE',
      'END DATE',
      'RECORDS FETCHED',
      ' RECORDS INSERTED',
      ' RECORDS UPDATED',
      '  RECORDS FAILED',
      ' CREATED BY',
      'CREATED ON',

    ],
  ];
  downloadReport(type) {
    this.report = [];
    let claim: any;
    for (var i = 0; i < this.data.length; i++) {
      claim = this.data[i];
      this.sno = [];
      this.sno.Slno = i + 1;
      this.sno.ID = claim.id;
      this.sno.SERVICESTATUS = claim.service_STATUS;
      this.sno.STARTDATE = this.convertStringToDate1(claim.start_DATE);
      this.sno.ENDDATE = this.convertStringToDate1(claim.end_DATE);
      this.sno.RECORDSFETCHED = claim.records_FETCHED;
      this.sno.RECORDSINSERTED = claim.records_INSERTED;
      this.sno.RECORDSUPDATED = claim.records_UPDATED;
      this.sno.RECORDSFAILED = claim.records_FAILED;
      this.sno.CREATEDBY = claim.created_BY;
      this.sno.CREATEDON = this.convertStringToDate1(claim.created_ON);
      this.report.push(this.sno);
    }

    if (type == 'xcl') {
      let filter = [];


      filter.push([['Year :- ', this.stickyear]]);


      filter.push([['Month:- ', this.MON(this.Months)]]);



      TableUtil.exportListToExcelWithFilter(
        this.report,
        'Ration Card Schedular Report',
        this.heading, filter
      );
    }
    else if (type == 'pdf') {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('l', 'mm', [360, 260]);



      doc.text('Year : ' + this.stickyear, 10, 10);

      doc.text('Month :' + this.MON(this.Months), 130, 10);

      doc.text('Generated  By :' + this.username, 10, 20);
      doc.text('Generated On :' + this.convertStringToDate1(this.timespan), 240, 20);
      doc.text("Ration Card Schedular Report", 160, 30);
      doc.setFontSize(12);
      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.Slno;
        pdf[1] = clm.ID;
        pdf[2] = clm.SERVICESTATUS;
        pdf[3] = clm.STARTDATE;
        pdf[4] = clm.ENDDATE;
        pdf[5] = clm.RECORDSFETCHED;
        pdf[6] = clm.RECORDSINSERTED;
        pdf[7] = clm.RECORDSUPDATED;
        pdf[8] = clm.RECORDSFAILED;
        pdf[9] = clm.CREATEDBY;
        pdf[10] = clm.CREATEDON;
        rows.push(pdf);
      }
      autoTable(doc, {
        head: this.heading,
        body: rows,
        theme: 'grid',
        startY: 40,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 20 },
          2: { cellWidth: 40 },
          3: { cellWidth: 20 },
          4: { cellWidth: 20 },
          5: { cellWidth: 20 },
          6: { cellWidth: 20 },
          7: { cellWidth: 20 },
          8: { cellWidth: 20 },
          9: { cellWidth: 20 },

        }
      });
      doc.save('Bsky_Ration Card Schedular Report.pdf');
    }
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  convertStringToDate1(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy HH:mm:ss');
    return date;
  }
  details(DATES: any, event: any, service: any) {
    // var userid;
    // localStorage.setItem("User1", userid)

    localStorage.setItem("Actiondate", DATES)
    localStorage.setItem("Actiontype", event)
    localStorage.setItem("type", service)


    this.route.navigate([]).then(result => { window.open(environment.routingUrl + 'rationcardscgedulardetailsreport'); });
  }
}
