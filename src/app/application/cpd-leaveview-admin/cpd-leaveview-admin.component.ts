import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { data } from 'jquery';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { HeaderService } from '../header.service';
import { CpdLeaveAdminServiceService } from '../Services/cpd-leave-admin-service.service';
import { CpdleaveService } from '../Services/cpdleave.service';
import { TableUtil } from '../util/TableUtil';
import jsPDF from 'jspdf';
declare let $: any;
import autoTable from 'jspdf-autotable';
import { SessionStorageService } from 'src/app/services/session-storage.service';


@Component({
  selector: 'app-cpd-leaveview-admin',
  templateUrl: './cpd-leaveview-admin.component.html',
  styleUrls: ['./cpd-leaveview-admin.component.scss']
})
export class CpdLeaveviewAdminComponent implements OnInit {
  @ViewChild('auto') auto;
  @ViewChild('autocopy') autocopy;

  isvisible: boolean
  txtsearchDate: any;
  cpdleavehistory: any;
  countcpdleave: any;
  userId: any;
  currentPage: any;
  pageElement: any;
  showPegi: boolean;
  childmessage: any;
  leaveId: any;
  record: any;
  bskyUserId: any = '';
  SearchForm: FormGroup;
  public cpdList: any = [];
  keyword: any = 'fullName';
  fullName: any;

  todate: any;
  fDate: any;
  tDate: any;


  getFullSnaName: any;
  toDate: any;
  fromDate: any;
  today: any;

  constructor(private route: Router, private cpdLeaveAdminServiceService: CpdLeaveAdminServiceService, public headerService: HeaderService, private sessionService: SessionStorageService,
    private activeroute: ActivatedRoute) { }

  ngOnInit(): void {
    this.headerService.setTitle("CPD Leave History");
    let date = new Date();
    // this.today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    this.today =date.getMilliseconds();
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

    // this.SearchForm = new FormGroup({
    //   'bskyUserId': new FormControl(''),
    //   'formdate': new FormControl(''),
    //   'todate': new FormControl(''),
    // });

    this.currentPage = 1;
    this.pageElement = 50;
    this.getCpdName();
    this.search();
    // this.getcpdleavehistorydetail();
  }

  getCpdName() {
    let nameHos = $('#bskyUserId').val();
    this.cpdLeaveAdminServiceService.getCpdNameList().subscribe(
      (response) => {
        this.cpdList = response;
        for (var i = 0; i < this.cpdList.length; i++) {
          var h = this.cpdList[i];
          h.fullName = h.fullName + '(' + h.userName + ')';
        }

      },
      (error) => console.log(error)
    )
  }
  search() {
    // var formdate = $('#formdate').val().toString();
    var formdate = $('#formdate').val();
    if (formdate == null || formdate == "" || formdate == undefined) {
      $("#formdate").focus();
      this.swal('', ' Please Choose From Date', 'error');
      return;
    }
    // var todate = $('#todate').val().toString();
    var todate = $('#todate').val();
    if (Date.parse(todate) > Date.parse(todate)) {
      this.swal('', 'From date should be less than To date', 'error');
      return;
    }
    var bskyUserId = this.bskyUserId;
    this.userId = this.sessionService.decryptSessionData("user");
    this.fromDate = formdate;
    this.toDate = todate;
    this.cpdLeaveAdminServiceService.getAllFilterData(bskyUserId, this.fromDate, this.toDate).subscribe(data => {
      this.cpdleavehistory = data;
      console.log(data);

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

  getcpdleavehistorydetail() {
    this.userId = this.sessionService.decryptSessionData("user");
    this.cpdLeaveAdminServiceService.getAllcpdhistory(this.userId.userId).subscribe(data => {
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

  deleteRecord(v: any) {
    Swal.fire({
      title: 'Are you sure want to cancel leave?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cpdLeaveAdminServiceService.deleteLeaveAdmin(v.leaveId).subscribe(
          (resp: any) => {
            if (resp == 1) {
              Swal.fire(
                'Cancelled!',
                'Leave has been cancelled.',
                'success'
              )
            }
            this.search();
            // this.auto.clear();

          },
          (err: any) => {
          }
        )
      }
    })
  }
  selectEvent(item) {
    this.bskyUserId = item.bskyUserId;
    this.fullName = item.fullName;
    this.getFullCPDName = this.fullName;

  }
  onReset1() {
    this.bskyUserId = "";

  }
  Reset() {
    window.location.reload();
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
    fullname: ""
  };

  heading = [['Sl No.', 'CPD Name', 'FromDate', 'ToDate', 'Applied date', 'No of Days', 'Status', 'Applied By']];

  getFullCPDName: any = "All";

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
      this.cpdLeaveList.fullname = item.createdby.fullname;

      this.report.push(this.cpdLeaveList);
    }
    if (type == 1) {
      let filter = [];
      filter.push([['From Date :-', this.fromDate]]);
      filter.push([['To Date :-', this.toDate]]);
      filter.push([['CPD Name :-', this.getFullCPDName]]);
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
      doc.text("CPD Name :-" + this.getFullCPDName, 35, 25);
      doc.text("Leave Request From:-" + this.fromDate, 175, 25);
      doc.text("Leave Request To :-" + this.toDate, 35, 33);
      doc.text("Generated On: " + this.convertDate(new Date()), 175, 33);
      doc.text("Generated By: " + this.sessionService.decryptSessionData("user").fullName, 35, 41);
      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.slNo;
        pdf[1] = clm.fullName;
        pdf[2] = this.convertDate1(clm.sformdate);
        pdf[3] = this.convertDate2(clm.stodate);
        pdf[4] = this.convertDate3(clm.screateon);
        pdf[5] = clm.noofdays;
        pdf[6] = clm.status;
        pdf[7] = clm.fullname;
        rows.push(pdf);
      }
      autoTable(doc, {
        head: this.heading,
        body: rows,
        theme: 'grid',
        startY: 50,
        headStyles: {
          fillColor: [26, 99, 54]
          // fillColor:[30,99,54]
        },
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: 45 },
          2: { cellWidth: 35 },
          3: { cellWidth: 38 },
          4: { cellWidth: 38 },
          5: { cellWidth: 28 },
          6: { cellWidth: 32 },
          7: { cellWidth: 50 },
          8: { cellWidth: 35 }
        }
      });
      doc.save('CPD Leave History List.pdf');
    }
  }


  swal(title: any, text: any, icon: any): void {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  // getResponseFromUtil(parentData: any) {
  //   this.childmessage = parentData;
  // }
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
    stodate = datePipe.transform(stodate, 'dd-MMM-yyyy ');
    return stodate;
  }
  convertDate3(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy');
    return date;
  }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

}
