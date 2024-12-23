import { CurrencyPipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { HeaderService } from '../header.service';
import { FunctionmasterserviceService } from '../Services/functionmasterservice.service';
import { SnafloatgenerationserviceService } from '../snafloatgenerationservice.service';
import { TableUtil } from '../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-snafloaterevert',
  templateUrl: './snafloaterevert.component.html',
  styleUrls: ['./snafloaterevert.component.scss']
})
export class SnafloaterevertComponent implements OnInit {
  countfloate: any;
  childmessage: any;
  txtsearchDate: any;
  showPegi: any;
  pageElement: any;
  currentPage: any;
  floate: any;
  formdate: any;
  toDate: any;
  floateno: any;
  user: any;


  constructor(private route: Router, public headerService: HeaderService, public snafloatgenerationservice: SnafloatgenerationserviceService, private sessionService: SessionStorageService) { }

  group = new FormGroup({
    fromdate: new FormControl(''),
    todate: new FormControl(''),
    floateno: new FormControl(''),

  });

  ngOnInit(): void {
    this.headerService.setTitle('Floate Revert');
    this.user = this.sessionService.decryptSessionData("user");
    this.showPegi = false;
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

    $('input[name="toDate"]').val(secoundDay);
    $('input[name="toDate"]').attr("placeholder", "To Date *");

    this.floatedetails();
  }
  reset() {
    this.ngOnInit();
    $('#Flaote').val('');
    this.floatedetails();
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  floatedetails() {
    this.formdate = $('#datepicker1').val().toString().trim();
    this.toDate = $('#datepicker2').val().toString().trim();
    if (Date.parse(this.formdate) > Date.parse(this.toDate)) {
      this.swal('', ' From Date should be less To Date', 'error');
      return;
    }
    this.snafloatgenerationservice.getsnafloaterevertdata(this.formdate, this.toDate, this.user.userId).subscribe((data: any) => {
      if (data.status = 200) {
        this.floate = data.data;
        this.countfloate = this.floate.length;
        if (this.countfloate > 0) {
          this.currentPage = 1;
          this.pageElement = 50;
          this.showPegi = true;
        } else {
          this.showPegi = false;
        }
      } else {
        this.swal('', ' SomeThing Went Wrong', 'error');
      }
    });
  }
  Details(claim: any) {
    let navigationExtras: NavigationExtras = {
      state: {
        float: claim.floateno,
        from: this.formdate,
        todate: this.toDate,
      }
    };
    this.route.navigate(['application/snafloaterevertdetails'], navigationExtras);
  }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

  report: any = [];
  sno: any = {
    Slno: "",
    floate: "",
    amount: "",
    claimcount: "",
    generateon: "",
  };
  heading = [['Sl#', 'Floate No', 'Amount', 'Generated On', 'Total Claims']];

  downloadList(no: any) {
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy = this.user.fullName;
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.floate.length; i++) {
      sna = this.floate[i];
      this.sno = [];
      this.sno.Slno = i + 1;
      this.sno.floate = sna.floateno;
      this.sno.amount = this.convertCurrency(sna.amount);
      this.sno.generateon = sna.screateon;
      this.sno.claimcount = sna.claimcount;
      this.report.push(this.sno);
    }
    if (no == 1) {
      let filter = [];
      filter.push([['Actual Date Of Discharge From', this.formdate]]);
      filter.push([['Actual Date Of Discharge To', this.toDate]]);
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'SNA Float Revert',
        this.heading, filter
      );
    } else {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('p', 'mm', [297, 210]);
      doc.setFontSize(20);
      doc.text("SNA Float Revert", 80, 15);
      doc.setFontSize(12);
      doc.text('Actual Date Of Discharge From :- ' + this.formdate, 8, 22);
      doc.text('Actual Date Of Discharge To :- ' + this.toDate, 110, 22);
      doc.text('GeneratedOn :- ' + generatedOn, 8, 29);
      doc.text('GeneratedBy :- ' + generatedBy, 110, 29);
      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.Slno;
        pdf[1] = clm.floate;
        pdf[2] = clm.amount;
        pdf[3] = clm.generateon;
        pdf[4] = clm.claimcount;
        rows.push(pdf);
      }
      autoTable(doc, {
        head: this.heading,
        body: rows,
        theme: 'grid',
        startY: 35,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },
          // 1: {cellWidth: 42},
          2: { cellWidth: 30 },
          // 3: {cellWidth: 42},
          // 4: {cellWidth: 42},

        }
      });
      doc.save('SNA Float Revert.pdf');
    }
  }

  convertCurrency(amount: any) {
    var formatter = new CurrencyPipe('en-IN');
    amount = formatter.transform(amount, '', '');
    return amount;
  }

}
