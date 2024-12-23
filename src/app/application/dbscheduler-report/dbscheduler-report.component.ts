import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { HeaderService } from '../header.service';
import { SchedularserviceService } from '../Services/schedularservice.service'
import { TableUtil } from './../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-dbscheduler-report',
  templateUrl: './dbscheduler-report.component.html',
  styleUrls: ['./dbscheduler-report.component.scss']
})
export class DBSchedulerReportComponent implements OnInit {
  user: any;
  schedularlist: any = []
  txtsearchDate: any;
  currentPage: any;
  pageElement: any;
  showPegi: any = false;
  record: any = 0;
  list: any = [];
  formdate: any;
  todate: any;
  proc: any;
  selectedYear: any;
  years: any = [];
  Months: any;
  Months1: string;
  sum: any;

  constructor(public headerService: HeaderService, public route: Router, public schedularserv: SchedularserviceService,private sessionService: SessionStorageService
    ) { }

  ngOnInit(): void {
    this.headerService.setTitle('DB Scheduler Report');
    this.user = this.sessionService.decryptSessionData("user");

    // $('.selectpicker').selectpicker();
    // $('.datepicker').datetimepicker({
    //   format: 'DD-MMM-YYYY',
    //   maxDate: new Date(),
    //   daysOfWeekDisabled: ['', 7],
    // });
    // $('.timepicker').datetimepicker({
    //   format: 'LT',
    //   daysOfWeekDisabled: ['', 7],
    // });
    // $('.datetimepicker').datetimepicker({
    //   format: 'DD-MMM-YYYY LT',
    //   daysOfWeekDisabled: ['', 7],
    // });
    // var date = new Date();
    // let year = date.getFullYear();
    // let date1 = '01';
    // let month:any = date.getMonth();

    this.selectedYear = new Date().getFullYear();
    for (let year = this.selectedYear; year >= 2010; year--) {
      this.years.push(year);
    }
    let month: any = new Date().getMonth();
    if (month == 0) {
      this.Months = 'Jan';
      this.Months1 = 'January';
    } else if (month == 1) {
      this.Months = 'Feb';
      this.Months1 = 'February';
    } else if (month == 2) {
      this.Months = 'Mar';
      this.Months1 = 'March';
    } else if (month == 3) {
      this.Months = 'Apr';
      this.Months1 = 'April';
    } else if (month == 4) {
      this.Months = 'May';
      this.Months1 = 'May';
    } else if (month == 5) {
      this.Months = 'Jun';
      this.Months1 = 'June';
    } else if (month == 6) {
      this.Months = 'Jul';
      this.Months1 = 'July';
    } else if (month == 7) {
      this.Months = 'Aug';
      this.Months1 = 'August';
    } else if (month == 8) {
      this.Months = 'Sep';
      this.Months1 = 'September';
    } else if (month == 9) {
      this.Months = 'Oct';
      this.Months1 = 'October';
    } else if (month == 10) {
      this.Months = 'Nov';
      this.Months1 = 'November';
    } else if (month == 11) {
      this.Months = 'Dec';
      this.Months1 = 'December';
    }
    // var frstDay = date1+"-"+month+"-"+year;

    // $('input[name="fromDate"]').val(frstDay);
    // $('input[name="fromDate"]').attr("placeholder","From Date *");
    // $('input[name="toDate"]').attr("placeholder","To Date *");

    this.getschedularlist();
  }

  getschedularlist() {
    this.schedularserv.getschedularlist().subscribe((data: any) => {
      this.schedularlist = data;
    },
      (error) => console.log(error)
    );
  }

  month(mon: any) {
    if (mon == 'Jan') {
      this.Months1 = 'January';
    } else if (mon == 'Feb') {
      this.Months1 = 'February';
    } else if (mon == 'Mar') {
      this.Months1 = 'March';
    } else if (mon == 'Apr') {
      this.Months1 = 'April';
    } else if (mon == 'May') {
      this.Months1 = 'May';
    } else if (mon == 'Jun') {
      this.Months1 = 'June';
    } else if (mon == 'Jul') {
      this.Months1 = 'July';
    } else if (mon == 'Aug') {
      this.Months1 = 'August';
    } else if (mon == 'Sep') {
      this.Months1 = 'September';
    } else if (mon == 'Oct') {
      this.Months = 'Oct';
      this.Months1 = 'October';
    } else if (mon == 'Nov') {
      this.Months = 'Nov';
      this.Months1 = 'November';
    } else if (mon == 'Dec') {
      this.Months1 = 'December';
    }
    return this.Months1
  }

  search() {
    this.proc = $('#schedular').val();
    this.formdate = $('#formdate').val();
    this.todate = $('#todate').val();

    if (this.proc == null || this.proc == "" || this.proc == undefined) {
      this.swal("Warning", "Please Fill Schedular Name", 'info');
      return;
    }
    if (this.formdate == null || this.formdate == "" || this.formdate == undefined) {
      this.swal("Warning", "Please Fill Year", 'info');
      return;
    }
    if (this.todate == null || this.todate == "" || this.todate == undefined) {
      this.swal("Warning", "Please Fill Month", 'info');
      return;
    }
    // if (Date.parse(this.formdate) > Date.parse(this.todate)) {
    //   this.swal('Warning', ' From Date should be less Than To Date', 'error');
    //   return;
    // }

    this.schedularserv.getschedularreportlist(this.proc, this.formdate, this.todate).subscribe((data: any) => {
      this.list = data;
      this.record = this.list.length
      if (this.record > 0) {
        let sum = 0;
        for (let i = 0; i < this.list.length; i++) {
          sum += parseInt(this.list[i].recordprocessed);
        }
        this.sum = sum;
        this.pageElement = 100;
        this.currentPage = 1;
        this.showPegi = true;
      } else {
        this.showPegi = false;
      }
    },
      (error) => console.log(error)
    );

  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }

  ResetField() {
    window.location.reload();
    // this.route.navigate(['/application/dbschedulerreport']);
  }

  report: any = [];
  sno: any = {
    Slno: "",
    date: "",
    // proc: "",
    stdate: "",
    enddate: "",
    total: "",
  };
  heading = [['Sl#', 'Date', 'Start Date', 'End Date', 'Total Record Processed']];
  downloadReport(no: any) {
    if (this.record == 0) {
      this.swal("Info", "No Record Found", "info");
      return;
    }
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy = this.user.fullName;
    let procid;
    let procname;
    let schedularname;
    for (let i = 0; i < this.schedularlist.length; i++) {
      if (this.schedularlist[i].procedurename == this.proc) {
        procid = this.schedularlist[i].id;
        procname = this.schedularlist[i].procedurename;
        schedularname = this.schedularlist[i].schedularname;
      }
    }

    this.report = [];
    let sna: any;
    for (var i = 0; i < this.list.length; i++) {
      sna = this.list[i];
      this.sno = [];
      this.sno.Slno = i + 1;
      this.sno.date = this.convertDate1(sna.starttime);
      // this.sno.proc=sna.procedurename;
      this.sno.stdate = this.convertDate(sna.starttime);
      this.sno.enddate = this.convertDate(sna.endtime);
      this.sno.total = sna.recordprocessed;
      this.report.push(this.sno);
    }
    this.sno = [];
    this.sno.date = "Total"
    this.sno.total = this.sum
    this.report.push(this.sno);
    if (no == 1) {
      let filter = [];
      filter.push([['Year', this.formdate]]);
      filter.push([['Month', this.month(this.todate)]]);
      filter.push([['Schedular Name', schedularname]]);
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'DB Schedular Report',
        this.heading, filter
      );
    } else {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('p', 'mm', [297, 210]);
      doc.setFontSize(22);
      // doc.text(" ", 5, 5);
      doc.text("DB Schedular Report", 70, 15);
      doc.line(70, 17, 145, 17)
      doc.setFontSize(12);
      doc.text('Year :- ' + this.formdate, 15, 25);
      doc.text('Month :- ' + this.month(this.todate), 60, 25);
      doc.text('GeneratedBy :- ' + generatedBy, 15, 41);
      doc.text('Schedular Name :- ' + schedularname, 15, 33);
      doc.text('GeneratedOn :- ' + generatedOn, 120, 25);

      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.Slno;
        pdf[1] = clm.date;
        // pdf[2] = clm.proc;
        pdf[2] = clm.stdate;
        pdf[3] = clm.enddate;
        pdf[4] = clm.total;
        rows.push(pdf);
      }
      autoTable(doc, {
        head: this.heading,
        body: rows,
        theme: 'grid',
        startY: 45,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },
          // 1: {cellWidth: 30},
          // 2: {cellWidth: 100},
          // 3: {cellWidth: 50},
          4: { cellWidth: 50 },
          // 5: {cellWidth: 25},

        }
      });
      // alert("hi");
      doc.save('DB Schedular Report');
    }
  }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;

  }
  convertDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, ' hh:mm:ss a');
    return date;
  }
  convertDate1(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy');
    return date;
  }

  details(date: any) {
    let procid;
    let procname;
    let schedularname;
    for (let i = 0; i < this.schedularlist.length; i++) {
      if (this.schedularlist[i].procedurename == this.proc) {
        procid = this.schedularlist[i].id;
        procname = this.schedularlist[i].procedurename;
        schedularname = this.schedularlist[i].schedularname;
      }
    }
    let dates = date;
    localStorage.setItem("procdate", dates)
    localStorage.setItem("procid", procid)
    localStorage.setItem("procname", procname)
    localStorage.setItem("schedularname", schedularname)
    this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/dbschedulerdetailsreport'); });
  }




}
