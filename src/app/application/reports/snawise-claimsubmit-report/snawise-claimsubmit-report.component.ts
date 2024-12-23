import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderService } from '../../header.service';

import { SnocreateserviceService } from '../../Services/snocreateservice.service';
declare let $: any;
import Swal from 'sweetalert2';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { TableUtil } from '../../util/TableUtil';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SnawiseClaimsubmitreportServiceService } from '../../Services/snawise-claimsubmitreport-service.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-snawise-claimsubmit-report',
  templateUrl: './snawise-claimsubmit-report.component.html',
  styleUrls: ['./snawise-claimsubmit-report.component.scss']
})
export class SnawiseClaimsubmitReportComponent implements OnInit {

  @ViewChild('auto') auto;
  @ViewChild('autocopy') autocopy;

  public snaDoctorList: any = [];
  getAllYears: any[] = [];
  showdropdown: boolean;
  snadoctor: any = "";
  keyword: any = 'fullName';
  txtsearchDate: any;
  record: any = 0;
  showPegi: boolean;
  user: any;
  selectedYear: any;
  stickyear: any;
  name: any = "";
  userId: any;
  currentPage: any;
  pageElement: any;
  safullName: any = "--";
  snaDetails: any = [];
  sum: any = 0;
  sum1: any = 0;
  sum2: any = 0;
  sum3: any = 0;
  sum4: any = 0;
  getHospitalName: string;
  sum5: any = 0;
  yearsget: any;
  name1: any = "--";

  constructor(private snawiseClaimsubmitreportServiceService: SnawiseClaimsubmitreportServiceService, public headerService: HeaderService,
    private sessionService: SessionStorageService,private snoService: SnocreateserviceService, public fb: FormBuilder) { }
  form: FormGroup;
  ngOnInit(): void {
    this.SearchMethod();
    this.headerService.setTitle('SNA Wise Discharge and Claim Report');
    // this.user = JSON.parse(sessionStorage.getItem("user"));
    this.user = this.sessionService.decryptSessionData("user");
    this.userId = this.user.userId;
    this.form = this.fb.group({
      year: new FormControl(''),
      snadoctor: new FormControl('')
    })
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
    this.selectedYear = new Date().getFullYear();
    for (let year = this.selectedYear; year >= 2015; year--) {
      this.getAllYears.push(year);
    }
    this.getSNAList();
    if (this.user.groupId != 4) {
      this.showdropdown = true
    } else {
      this.showdropdown = false
    }
  }

  getSNAList() {
    this.snoService.getSNODetails().subscribe(
      (response) => {
        this.snaDoctorList = response;
        if (this.user.groupId == 4) {
          let data = this.snaDoctorList;
          for (let i = 0; i <= this.snaDoctorList.length; i++) {
            if (data[i].userId == this.userId) {
              this.name = data[i].userId;
              this.snaDoctorList = [];
              this.snaDoctorList.push(data[i]);
              break;
            }
          }
        } else {
          this.name = "";
        }
      },
      (error) => console.log(error)
    )
  }
  selectEvent(item) {
    this.snadoctor = item.userId;
    this.safullName = item.fullName;
    this.userId = item.userId.userId;
  }

  convertCurrency(dischargeAmt: any) {
    var formatter = new CurrencyPipe('en-US');
    dischargeAmt = formatter.transform(dischargeAmt, '', '');
    return dischargeAmt;
  }
  convertCurrency1(clmSubmitAmt: any) {
    var formatter = new CurrencyPipe('en-US');
    clmSubmitAmt = formatter.transform(clmSubmitAmt, '', '');
    return clmSubmitAmt;
  }
  convertCurrency2(paidAmount: any) {
    var formatter = new CurrencyPipe('en-US');
    paidAmount = formatter.transform(paidAmount, '', '');
    return paidAmount;
  }

  Reset() {
    window.location.reload();
    this.SearchMethod();
  }
  SearchMethod() {
    let year = $('#year').val();
    this.yearsget = year;
    this.snawiseClaimsubmitreportServiceService.searchSnaClaimList(year, this.snadoctor).subscribe(
      (result: any) => {
        this.snaDetails = result;
        this.record = this.snaDetails.length;
        if (this.record > 0) {

          let sum = 0;
          let sum1 = 0;
          let sum2 = 0;
          let sum3 = 0;
          let sum4 = 0;
          let sum5 = 0;
          for (let i = 0; i < this.snaDetails.length; i++) {
            sum += parseInt(this.snaDetails[i].totalDischarge);
            sum1 += parseInt(this.snaDetails[i].dischargeAmt);
            sum2 += parseInt(this.snaDetails[i].clmSubmitted);
            sum3 += parseInt(this.snaDetails[i].clmSubmitAmt);
            sum4 += parseInt(this.snaDetails[i].totalPaid);
            sum5 += parseInt(this.snaDetails[i].paidAmount);
          }
          this.sum = sum;
          this.sum1 = sum1;
          this.sum2 = sum2;
          this.sum3 = sum3;
          this.sum4 = sum4;
          this.sum5 = sum5;
          this.currentPage = 1;
          this.pageElement = 100;
          this.showPegi = true;

        }
        else {
          this.showPegi = false;
        }
      }, (err: any) => {
      }
    )
  }
  report: any = [];
  snaPendingClaimList: any = {
    slNo: "",
    monthName: "",
    totalDischarge: "",
    dischargeAmt: "",
    clmSubmitted: "",
    clmSubmitAmt: "",
    totalPaid: "",
    paidAmount: "",
  };

  heading = [['Sl No.', 'Month Name', 'Total Discharge', 'Discharge Amount', 'Claim Submitted', 'Claim Submitted Amount', 'Total Paid', 'Paid Amount']];
  downloadReport(type) {
    if (this.snaDetails == null || this.snaDetails.length == 0) {
      this.swal("Info", "No Record Found", "info");
      return;
    }
    this.report = [];
    let item: any;
    for (var i = 0; i < this.snaDetails.length; i++) {
      item = this.snaDetails[i];
      this.snaPendingClaimList = [];
      this.snaPendingClaimList.slNo = i + 1;
      this.snaPendingClaimList.monthName = item.monthName;
      this.snaPendingClaimList.totalDischarge = item.totalDischarge;
      this.snaPendingClaimList.dischargeAmt = this.convertCurrency(item.dischargeAmt);
      this.snaPendingClaimList.clmSubmitted = item.clmSubmitted;
      this.snaPendingClaimList.clmSubmitAmt = this.convertCurrency1(item.clmSubmitAmt);
      this.snaPendingClaimList.totalPaid = item.totalPaid;
      this.snaPendingClaimList.paidAmount = this.convertCurrency2(item.paidAmount);
      this.report.push(this.snaPendingClaimList);
    }
    this.snaPendingClaimList = [];
    this.snaPendingClaimList.monthName = "Total";
    this.snaPendingClaimList.totalDischarge = this.sum;
    this.snaPendingClaimList.dischargeAmt = this.convertCurrency(this.sum1);
    this.snaPendingClaimList.clmSubmitted = this.sum2;
    this.snaPendingClaimList.clmSubmitAmt = this.convertCurrency1(this.sum3);
    this.snaPendingClaimList.totalPaid = this.sum4;
    this.snaPendingClaimList.paidAmount = this.convertCurrency2(this.sum5);
    this.report.push(this.snaPendingClaimList);
    if (type == 1) {
      let filter = [];
      if (this.user.groupId == 4) {
        this.name1 = this.sessionService.decryptSessionData("user").fullName
        filter.push([['SNA Name :-', this.name1]]);
      } else {
        filter.push([['SNA Name :-', this.safullName]]);
      }
      filter.push([['Year:-', this.yearsget]]);
      TableUtil.exportListToExcelWithFilter(this.report, "SNA Wise Discharge and Claim Report", this.heading, filter);
    } else if (type == 2) {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('p', 'mm', [320, 260]);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text("SNA Wise Discharge and Claim Report", 90, 10);
      doc.setFontSize(12);
      if (this.user.groupId == 4) {
        this.name1 = this.sessionService.decryptSessionData("user").fullName
        doc.text("SNA Name :-" + this.name1, 15, 25);
      } else {
        doc.text("SNA Name :-" + this.safullName, 15, 25);
      }
      doc.text("Year:-" + this.yearsget, 120, 25);
      doc.text("Generated On: " + this.convertDate(new Date()), 120, 33);
      doc.text("Generated By: " + this.sessionService.decryptSessionData("user").fullName, 15, 33);
      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.slNo;
        pdf[1] = clm.monthName;
        pdf[2] = clm.totalDischarge;
        pdf[3] = clm.dischargeAmt;
        pdf[4] = clm.clmSubmitted;
        pdf[5] = clm.clmSubmitAmt;
        pdf[6] = clm.totalPaid;
        pdf[7] = clm.paidAmount;
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
          2: { cellWidth: 30 },
          3: { cellWidth: 35 },
          4: { cellWidth: 30 },
          5: { cellWidth: 50 },
          6: { cellWidth: 40 },
          7: { cellWidth: 30 }
        }
      });
      doc.save('Bsky_SNA Wise Discharge and Claim Report.pdf');
    }
  }

  onReset1() {
    this.selectedYear = new Date().getFullYear();
    this.snadoctor = "";
    this.safullName = "";
    this.auto.clear();
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  convertDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy hh:mm:ss a');
    return date;
  }
}
