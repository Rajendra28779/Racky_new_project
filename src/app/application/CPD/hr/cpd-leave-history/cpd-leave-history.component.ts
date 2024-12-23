import { Component, OnInit } from '@angular/core';
import { CpdleaveService } from '../../../Services/cpdleave.service';
import { HeaderService } from '../../../header.service';
import { Subject } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { CurrencyPipe, DatePipe } from '@angular/common';
declare let $: any;
import Swal from 'sweetalert2';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Router } from '@angular/router';
import { TableUtil } from 'src/app/application/util/TableUtil';
import { CpdLeaveAdminServiceService } from 'src/app/application/Services/cpd-leave-admin-service.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
@Component({
  selector: 'app-cpd-leave-history',
  templateUrl: './cpd-leave-history.component.html',
  styleUrls: ['./cpd-leave-history.component.scss']
})
export class CpdLeaveHistoryComponent implements OnInit {
  isvisible: boolean
  txtsearchDate: any;
  SearchForm: FormGroup;
  cpdleavehistory: any = [];
  countcpdleave: any;
  userId: any;
  currentPage: any;
  pageElement: any;
  showPegi: boolean;
  childmessage: any;
  leaveId: any;
  record: any;
  fromdate: any;
  todate: any;

  username: any;
  public cpdList: any = [];
  bskyUserId: any;
  user: any;
  constructor(private cpdleaveservice: CpdleaveService, private headerService: HeaderService, private route: Router,
    private cpdLeaveAdminServiceService: CpdLeaveAdminServiceService,private sessionService: SessionStorageService,) { }
  ngOnInit(): void {
    this.headerService.setTitle("View Status");
    // this.userId = JSON.parse(sessionStorage.getItem("user")).userId;
    this.userId = this.sessionService.decryptSessionData("user").userId;

    $('.selectpicker').selectpicker();
    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      // endDate: '0d',
      // maxDate: new Date(),
      daysOfWeekDisabled: ['', 7],
    });
    $('.timepicker').datetimepicker({
      format: 'LT',
      daysOfWeekDisabled: ['', 7],
    });
    $('.datetimepicker').datetimepicker({
      format: 'YYYY-MM-DD LT',
      daysOfWeekDisabled: ['', 7],
    });

    this.currentPage = 1;
    this.pageElement = 50;
    this.getcpdleavehistorydetail();
    this.search();
  }

  getcpdleavehistorydetail() {
    // this.userId = JSON.parse(sessionStorage.getItem("user")).userId;
    this.userId = this.sessionService.decryptSessionData("user").userId;
    this.cpdleaveservice.getAllcpdhistory(this.userId).subscribe(data => {
      console.log(data);
      this.cpdleavehistory = data;
      this.record = this.cpdleavehistory.length;
      if (this.record > 0) {
        this.showPegi = true;
      }
      else {
        this.showPegi = false;
      }
    })
  }

  fDate: any;
  tDate: any;

  search() {
    var fromdate = $('#formdate').val().toString();
    this.fDate = fromdate;
    // this.fDate=fromdate;
    if (fromdate == null || fromdate == "" || fromdate == undefined) {
      $("#formdate").focus();
      this.swal('', ' Please Choose From Date', 'error');
      return;
    }
    var todate = $('#todate').val().toString();
    this.tDate = todate;
    if (Date.parse(fromdate) > Date.parse(todate)) {
      this.swal('', 'From date should be less than To date', 'error');
      return;
    }
    let userId = this.userId;
    this.cpdleaveservice.getAllFilterData(userId, this.fDate, this.tDate).subscribe(data => {
      console.log(data);
      // this.cpdleavehistory=[];
      this.cpdleavehistory = data;
      this.record = this.cpdleavehistory.length;
      if (this.record > 0) {
        this.currentPage = 1;
        this.pageElement = 50;
        this.showPegi = true;
      } else {
        this.showPegi = false;
      }
    });
  }

  Reset() {
    window.location.reload();
  }

  delete(v: any) {
    Swal.fire({
      title: 'Are you sure want to cancel leave?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cpdleaveservice.deleteLeave(v.leaveId).subscribe(
          (resp: any) => {
            if (resp == 1) {
              Swal.fire(
                'Cancelled!',
                'Leave has been cancelled.',
                'success'
              )
            }
            this.search();
          },
          (err: any) => {
          }
        )
      }
    })
  }
  report: any = [];
  cpdLeaveList: any = {
    slNo: "",
    fullName: "",
    sformdate: "",
    stodate: "",
    screateon: "",
    noofdays: "",
    status: "",
  };

  heading = [['Sl No.', 'CPD Name', 'FromDate', 'ToDate', 'Applied date', 'No of Days', 'Status']];


  downloadReport(type) {
    this.report = [];
    let item: any;
    for (var i = 0; i < this.cpdleavehistory.length; i++) {
      item = this.cpdleavehistory[i];
      this.cpdLeaveList = [];
      this.cpdLeaveList.slNo = i + 1;
      this.cpdLeaveList.fullName = item.cpduserId.fullName;
      this.cpdLeaveList.sformdate = item.sformdate;
      this.cpdLeaveList.stodate = item.stodate;
      this.cpdLeaveList.screateon = item.screateon;
      this.cpdLeaveList.noofdays = item.noofdays;
      // this.cpdLeaveList.status = item.status;
      if (item.status == '0') {
        this.cpdLeaveList.status = "Applied";
      } else if (item.status == '1') {
        this.cpdLeaveList.status = "Approved";
      } else if (item.status == '2') {
        this.cpdLeaveList.status = "Rejected";
      } else if (item.status == '3') {
        this.cpdLeaveList.status = "Cancelled";
      }
      this.report.push(this.cpdLeaveList);
      console.log(this.report);

    }
    if (type == 1) {
      let filter = [];
      filter.push([['From Date :-', this.fDate]]);
      filter.push([['To Date :-', this.tDate]]);
      TableUtil.exportListToExcelWithFilter(this.report, "CPD Leave History List", this.heading, filter);
    } else if (type == 2) {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('l', 'mm', [320, 260]);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text("CPD Leave History", 125, 10);
      doc.setFontSize(12);
      // doc.text("Leave Request From:-"+this.fDate, 175, 25);
      doc.text("Leave Request From:-" + this.fDate, 35, 25);
      doc.text("Leave Request To:-" + this.tDate, 175, 25);
      doc.text("Generated On: " + this.convertDate(new Date()), 175, 33);
      doc.text("Generated By: " + this.sessionService.decryptSessionData("user").fullName, 35, 33);
      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.slNo;
        pdf[1] = clm.fullName;
        // pdf[2]=clm.sformdate;
        pdf[2] = this.convertDate1(clm.sformdate);
        pdf[3] = this.convertDate2(clm.stodate);
        // pdf[4]=clm.screateon;
        pdf[4] = this.convertDate3(clm.screateon);
        pdf[5] = clm.noofdays;
        pdf[6] = clm.status;
        rows.push(pdf);
      }
      console.log(rows);
      autoTable(doc, {
        head: this.heading,
        body: rows,
        theme: 'grid',
        startY: 50,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: 50 },
          2: { cellWidth: 40 },
          3: { cellWidth: 45 },
          4: { cellWidth: 40 },
          5: { cellWidth: 35 },
          6: { cellWidth: 50 },
          7: { cellWidth: 50 },
          8: { cellWidth: 40 }
        }

      });
      doc.save('CPD Leave History List.pdf');
    }
  }
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  }
  convertDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy hh:mm:ss a');
    return date;
  }
  convertDate1(sformdate) {
    var datePipe = new DatePipe("en-US");
    sformdate = datePipe.transform(sformdate, 'dd-MMM-yyyy');
    return sformdate;
  }
  convertDate2(stodate) {
    var datePipe = new DatePipe("en-US");
    stodate = datePipe.transform(stodate, 'dd-MMM-yyyy');
    return stodate;
  }
  convertDate3(screateon) {
    var datePipe = new DatePipe("en-US");
    screateon = datePipe.transform(screateon, 'dd-MMM-yyyy');
    return screateon;
  }
  swal(title: any, text: any, icon: any): void {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  getLink1() {
    this.route.navigate(['/application/cpdleaveapply']);
  }
  getLink() {
    this.route.navigate(['/application/cpdleavehistory']);
  }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }


}
