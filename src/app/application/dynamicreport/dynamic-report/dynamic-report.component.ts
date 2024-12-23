import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicreportService } from '../../Services/dynamicreport.service';
import { HeaderService } from '../../header.service';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { TableUtil } from '../../util/TableUtil';
import { formatDate } from '@angular/common';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { Alert } from 'src/app/_models/alert';
import { timeStamp } from 'console';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-dynamic-report',
  templateUrl: './dynamic-report.component.html',
  styleUrls: ['./dynamic-report.component.scss']
})
export class DynamicReportComponent implements OnInit {
  user: any
  months: string;
  year: number;
  formdate: any;
  toDate: any;
  list: any = [];
  showPegi: boolean;
  currentPage: any;
  pageElement: any;
  totalcount: any = 0;
  txtsearchDate: any;
  sum: any = 0;
  sum1: any = 0;
  flag: any = "";

  constructor(public headerService: HeaderService,
    public route: Router,
    private service: DynamicreportService,private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle("ME Trigger Report");
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
    let date = new Date();
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
    let frstDay = date1 + '-' + this.months + '-' + this.year;
    $('input[name="datepicker1"]').val(frstDay);
    $('input[name="datepicker1"]').attr("placeholder", "From Date ");
    $('input[name="datepicker2"]').attr("placeholder", "To Date ");

    this.getTriggerList();

    let currpage1 = localStorage.getItem("currpage1");
    if (currpage1 != null) {
      this.formdate = localStorage.getItem("fromdate");
      this.toDate = localStorage.getItem("todate");
      this.flag = localStorage.getItem("flag");
      $('input[name="datepicker1"]').val(this.formdate);
      $('input[name="datepicker2"]').val(this.toDate);
      this.sabmit();
    }
  }
  triggerList: any = [];
  getTriggerList() {
    this.service.findAllActiveTrigger().subscribe((data: any) => {
      this.triggerList = data;
    })
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

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

  ResetField() {
    window.location.reload();
  }

  sabmit() {
    this.formdate = $('#datepicker1').val();
    this.toDate = $('#datepicker2').val();
    // this.flag= $('#trigger').val();
    if (Date.parse(this.formdate) > Date.parse(this.toDate)) {
      this.swal('', ' From Date should be less than To Date', 'error');
      return;
    }
    if (Date.parse(this.formdate) > Date.parse(this.toDate)) {
      this.swal('', ' From Date should be less than To Date', 'error');
      return;
    }
    if (this.flag == "" || this.flag == null || this.flag == undefined) {
      this.swal('', 'Please Select Trigger Name', 'error');
      return;
    }
    this.service.getdynamicreport(this.formdate, this.toDate, this.flag).subscribe((data: any) => {
      this.list = data;
      this.totalcount = this.list.length;
      if (this.totalcount > 0) {
        let sum = 0;
        for (let item of this.list) {
          sum += parseInt(item.totalnumber);
        }
        this.sum = sum;
        this.showPegi = true
        this.currentPage = 1
        this.pageElement = 100
      } else {
        this.showPegi = false
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

  report: any = [];
  sno: any = {
    Slno: "",
    reportname: "",
    total: "",
  };
  heading = [['Sl#', 'Report Name', 'Total Number']];

  downloadList(no: any) {
    if (this.list.length == 0) {
      this.swal("Info", "No Record Found !", "info");
      return;
    }
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy = this.user.fullName;
    this.report = [];
    let sna: any;
    for (let i = 0; i < this.list.length; i++) {
      sna = this.list[i];
      this.sno = [];
      this.sno.Slno = i + 1;
      this.sno.reportname = sna.reportname
      this.sno.total = sna.totalnumber
      this.report.push(this.sno);
    }
    this.sno = [];
    this.sno.Slno = "";
    this.sno.reportname = "Total"
    this.sno.total = this.sum
    this.report.push(this.sno);


    if (no == 1) {
      let filter = [];
      filter.push([['Actual Date Of Discharge From', this.formdate]]);
      filter.push([['Actual Date Of Discharge To', this.toDate]]);
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'M and E Report',
        this.heading, filter
      );
    } else {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      let doc = new jsPDF('p', 'mm', [297, 250]);
      doc.setFontSize(20);
      doc.text("M and E Report", 90, 15);
      doc.setFontSize(12);
      doc.text('Actual Date Of Discharge From :- ' + this.formdate + ' To :- ' + this.toDate, 8, 24);
      doc.text('GeneratedOn :- ' + generatedOn, 160, 32);
      doc.text('GeneratedBy :- ' + generatedBy, 8, 32);

      let rows = [];
      for (let i = 0; i < this.report.length; i++) {
        let clm = this.report[i];
        let pdf = [];
        pdf[0] = clm.Slno;
        pdf[1] = clm.reportname;
        pdf[2] = clm.total;
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
          1: { cellWidth: 120 },

        }
      });
      doc.save('Bsky_Dynamic Report.pdf');
    }
  }

  routepage(item: any) {
    localStorage.setItem('currpage1', "1");
    localStorage.setItem('pageelement1', "40");
    localStorage.setItem("report", item.reportname);
    localStorage.setItem("fromdate", this.formdate);
    localStorage.setItem("todate", this.toDate);
    localStorage.setItem("flag", item.slno);
    this.route.navigate(['/application/mereportsubdetails']);
  }
  details(item: any, no: any) {
    if (no == 0) {
      this.swal("Info", "No Record Found", "info");
      return;
    } else {
      if (item.slno == 4) {
        let fdate = this.parseDateString(this.formdate)
        let tdate = this.parseDateString(this.toDate)
        let fyr = fdate.getMonth()
        let tyr = tdate.getMonth()
        let fmth = fdate.getMonth()
        let tmth = tdate.getMonth()
        if (fyr == tyr && fmth == tmth) {
          this.routepage(item);
        } else {
          this.swal("Info", "For 'Haemodialysis treated more than 13 times' You Have To Search for 1 Month ", "info");
          return;
        }
      } else {
        this.routepage(item);
      }
    }
  }

  parseDateString(input: string) {
    const months: { [key: string]: number } = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
    };

    const match = input.match(/(\d{2})-([a-zA-Z]{3})-(\d{4})/);

    if (match) {
      const day = parseInt(match[1], 10);
      const month = months[match[2]];
      const year = parseInt(match[3], 10);

      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        return new Date(year, month, day);
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
  calculateDateDifference(start: Date, end: Date) {
    let dateDifference = null
    if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
      const timeDifference = end.getTime() - start.getTime();
      const daysDifference = timeDifference / (1000 * 3600 * 24);
      dateDifference = Math.abs(Math.round(daysDifference + 1));
    } else {
      dateDifference = null;
    }
    return dateDifference;
  }
}
