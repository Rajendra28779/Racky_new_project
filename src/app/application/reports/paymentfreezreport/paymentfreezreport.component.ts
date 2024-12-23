import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderService } from '../../header.service';
import { PendingClaimSnaReportServiceService } from '../../Services/pending-claim-sna-report-service.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import Swal from 'sweetalert2';
import { PaymentFreezreportService } from '../../Services/payment-freezreport.service';
import { TableUtil } from '../../util/TableUtil';
import jsPDF from 'jspdf';
declare let $: any;
import autoTable from 'jspdf-autotable';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-paymentfreezreport',
  templateUrl: './paymentfreezreport.component.html',
  styleUrls: ['./paymentfreezreport.component.scss']
})
export class PaymentfreezreportComponent implements OnInit {
  public snaDoctorList: any = [];
  public taggedList: any = [];
  Months: any;
  searchdata: any;
  user: any;
  userId: any;
  txtsearchDate: any;
  searchdatalength: any;
  currentPage: any;
  pageElement: any;
  showPegi: boolean;
  data: any;
  name: any = "";
  snadoctor: any = "";
  keyword: any = 'fullName';
  keyword1: any = 'hospitalName';
  showdropdown: boolean;
  authTaggingId: any;
  username: any;
  hospitalCode: string = "";
  id: any;
  fullname: any;
  item1: any;
  item: any;
  record: any = 0;
  snaDetails: any = [];
  deleteDetails: any;
  status: any;
  hospitalName: any;
  safullName: any;
  fromdate: any;
  todate: any;


  constructor(private snoService: SnocreateserviceService, private pendingclaimsnareprtservice: PendingClaimSnaReportServiceService,
    private route: Router, public headerService: HeaderService, private paymentFreezreportService: PaymentFreezreportService,private sessionService: SessionStorageService,) { }

  ngOnInit(): void {
    this.currentPage = 1;
    this.pageElement = 10;
    this.headerService.setTitle("Payment Freez Report");
    // this.user = JSON.parse(sessionStorage.getItem("user"));
    this.user = this.sessionService.decryptSessionData("user");
    this.userId = this.user.userId;
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
              this.ongotHospitalCode(data[i]);
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

  ongotHospitalCode(item) {
    var id = item.userId;
    let name1 = id;
    this.taggedList = [];
    let list = [];
    this.pendingclaimsnareprtservice.getHospitalTageed(name1).subscribe(
      (response) => {
        list = response;
        for (var i = 0; i < list.length; i++) {
          var h = list[i];
          h.hospitalName = h.hospitalName + ' (' + h.hospitalCode + ')';
          this.taggedList.push(h);
        }
      },
      (error) => console.log(error)
    )
    if (this.user.groupId == 4) {
      this.SearchMethod();
    }
  }
  getHospitalName: any = "--";

  selectEvent1(item) {
    this.hospitalCode = item.hospitalCode;
    this.getHospitalName = item.hospitalName;
  }
  selectEvent(item) {
    this.snadoctor = item.userId;
    this.safullName = item.fullName;
    this.userId = item.userId.userId;
  }

  onReset1() {
    this.hospitalCode = "";
  }

  SearchMethod() {
    let userId = this.user.userId;
    let fromDate = $('#fromDate').val();
    let toDate = $('#toDate').val();
    if (fromDate == null || fromDate == "" || fromDate == undefined) {
      this.swal("Info", "Please Select Actual Date of Discharge From", 'info');
      return;
    }
    if (toDate == null || toDate == "" || toDate == undefined) {
      this.swal("Info", "Please Select Actual Date of Discharge To", 'info');
      return;
    }
    if (Date.parse(fromDate) > Date.parse(toDate)) {
      this.swal('Info', ' From Date should be less than To Date', 'info');
      return;
    }
    let a = this.snadoctor;
    if (this.user.groupId != 4) {
      if (a == null || a == "" || a == undefined) {
        $("#snadoctor").focus();
        this.swal("Info", "Please select SNA  ", 'info');
        return;
      }
    } else {
      this.snadoctor = this.name
    }
    this.fromdate = fromDate;
    this.todate = toDate;
    this.paymentFreezreportService.searchReportList(userId, this.fromdate, this.todate, this.snadoctor, this.hospitalCode).subscribe(
      (result: any) => {
        this.snaDetails = result;
        this.record = this.snaDetails.length;
        if (this.record > 0) {
          this.showPegi = true;
          this.currentPage = 1;
          this.pageElement = 50;
        }
        else {
          this.showPegi = false;
        }
      }, (err: any) => {
        console.log(err);
      }
    )
  }

  getReset() {
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  report: any = [];
  snaPendingClaimList: any = {
    slNo: "",
    hospitalName: "",
    hospitalCode: "",
    totalClaimed: "",
    totlAmountClaimed: "",
    totalFrezzed: "",
    totalFreezAmount: "",
    totalPostPaymntUpdation: "",
    totalPostPaymntUpdationAmt: ""
  };

  heading = [['Sl No.', 'Hospital Name', 'Total No. of Claim', 'Total Claimed Amount', ' Total No. of  Freez', 'Total Freezed Amount', 'No. of Post Payment Updation',
    'Total Post Payment Updation Amount']];

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
      this.snaPendingClaimList.hospitalName = item.hospitalName + '(' + item.hospitalCode + ')';
      this.snaPendingClaimList.totalClaimed = item.totalClaimed;
      this.snaPendingClaimList.totlAmountClaimed = this.convertCurrency1(item.totlAmountClaimed);
      this.snaPendingClaimList.totalFrezzed = item.totalFrezzed;
      this.snaPendingClaimList.totalFreezAmount = this.convertCurrency2(item.totalFreezAmount);
      this.snaPendingClaimList.totalPostPaymntUpdation = item.totalPostPaymntUpdation;
      this.snaPendingClaimList.totalPostPaymntUpdationAmt = this.convertCurrency3(item.totalPostPaymntUpdationAmt);
      this.report.push(this.snaPendingClaimList);
    }
    if (type == 1) {
      let filter = [];
      filter.push([['Actual Date of Discharge From:-', this.fromdate]]);
      filter.push([['Actual Date of Discharge To:-', this.todate]]);
      if (this.user.groupId == 4) {
        filter.push([['SNA Name :-', this.sessionService.decryptSessionData("user").fullName]]);
      }
      filter.push([['SNA Name :-', this.safullName]]);
      filter.push([['Hospital Name:-', this.getHospitalName]]);
      TableUtil.exportListToExcelWithFilter(this.report, " Payment Freez Report", this.heading, filter);
    }
    else if (type == 2) {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('p', 'mm', [360, 280]);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text("Payment Freez Report", 110, 10);
      doc.setFontSize(13);
      doc.text("Actual Date Of Discharge From:-" + this.fromdate, 25, 33);
      doc.text("Actual Date Of Discharge To:-" + this.todate, 125, 33);
      if (this.user.groupId == 4) {
        doc.text("SNA Name:-" + this.sessionService.decryptSessionData("user").fullName, 25, 42);
      }
      else {
        doc.text("SNA Name:-" + this.safullName, 25, 42);
      }
      doc.text("Hospital Name:-" + this.getHospitalName, 135, 42);
      doc.text("Generated On:-" + this.convertDate(new Date()), 25, 51);
      doc.text("Generated By:-" + this.sessionService.decryptSessionData("user").fullName, 135, 51);
      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.slNo;
        pdf[1] = clm.hospitalName;
        pdf[2] = clm.totalClaimed;
        pdf[3] = clm.totlAmountClaimed;
        pdf[4] = clm.totalFrezzed;
        pdf[5] = clm.totalFreezAmount;
        pdf[6] = clm.totalPostPaymntUpdation;
        pdf[7] = clm.totalPostPaymntUpdationAmt;
        rows.push(pdf);
      }
      autoTable(doc, {
        head: this.heading,
        body: rows,
        theme: 'grid',
        startY: 60,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: 40 },
          2: { cellWidth: 30 },
          3: { cellWidth: 30 },
          4: { cellWidth: 25 },
          5: { cellWidth: 35 },
          6: { cellWidth: 25 },
          7: { cellWidth: 35 }
        }
      });
      doc.save('GJAY_Payment Freez Report.pdf');

    }

  }
  convertDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy hh:mm:ss a');
    return date;
  }
  convertCurrency3(totalPostPaymntUpdationAmt: any) {
    var formatter = new CurrencyPipe('en-US');
    totalPostPaymntUpdationAmt = formatter.transform(totalPostPaymntUpdationAmt, '', '');
    return totalPostPaymntUpdationAmt;
  }
  convertCurrency2(totalFreezAmount: any) {
    var formatter = new CurrencyPipe('en-US');
    totalFreezAmount = formatter.transform(totalFreezAmount, '', '');
    return totalFreezAmount;
  }
  convertCurrency1(totlAmountClaimed: any) {
    var formatter = new CurrencyPipe('en-US');
    totlAmountClaimed = formatter.transform(totlAmountClaimed, '', '');
    return totlAmountClaimed;
  }
}
