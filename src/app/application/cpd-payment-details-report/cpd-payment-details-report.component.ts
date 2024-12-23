import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { JwtService } from 'src/app/services/jwt.service';
import { CpdPaymentReportService } from '../Services/cpd-payment-report.service';
import { TableUtil } from '../util/TableUtil';
import Swal from 'sweetalert2';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-cpd-payment-details-report',
  templateUrl: './cpd-payment-details-report.component.html',
  styleUrls: ['./cpd-payment-details-report.component.scss']
})
export class CpdPaymentDetailsReportComponent implements OnInit {
  claimlist: any;
  countclaimlist: any
  user: any
  type: any
  type2: any
  Year: any
  Month: any
  Hospitalcode: any
  Statecode: any
  Districtcode: any
  Flag: any
  user1: any
  show: any = false;
  case: any;
  userid: any;
  user3: any;
  name: any;
  cpdname: any;
  txtsearchDate: any;
  pageElement: any;
  currentPage: any;
  showPegi: boolean;
  username: any;
  timespan: any;
  constructor(private route: Router,
    private jwtService: JwtService,
    private cpdpaymentservice: CpdPaymentReportService,private sessionService: SessionStorageService,
  ) { }

  ngOnInit(): void {
    // this.user3 = JSON.parse(sessionStorage.getItem('user'));
    this.user3 = this.sessionService.decryptSessionData("user");
    this.user = localStorage.getItem('Cpduserid');
    this.type = localStorage.getItem('Cpdactiontype');
    this.Year = localStorage.getItem('Cpdyear');
    this.Month = localStorage.getItem('Cpdmonth');
    this.Hospitalcode = localStorage.getItem('Hospital');
    this.Statecode = localStorage.getItem('State');
    this.Districtcode = localStorage.getItem('District');
    this.Flag = localStorage.getItem('searchby');
    this.cpdname = localStorage.getItem('cpdname');

    if (this.type == 1) {
      this.case = "Approve"
    } else if (this.type == 2) {
      this.case = "Rejected"
    } else if (this.type == 3) {
      this.case = "Settlement"
    } else {
      this.case = "Dishonour"
    }

    if (this.type == 4) {
      this.show = true
    } else {
      this.show = false
    }

    this.username = this.user3.fullName
    this.timespan = new Date()
    this.cpdpaymentservice.cpdpaymentdetails(this.user, this.type, this.Year, this.Month, this.Hospitalcode, this.Statecode, this.Districtcode, this.Flag).subscribe((data: any) => {
      this.claimlist = data;
      console.log(this.claimlist);
      this.countclaimlist = this.claimlist.length;
      if (this.countclaimlist > 0) {
        this.currentPage = 1;
        this.pageElement = 50;
        this.showPegi = true;
      } else {
        this.showPegi = false;
      }
    });
  }
  pageItemChange() {

    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
    console.log(this.pageElement);

  }
  report: any = [];
  sno: any = {
    Slno: '',
    URN: '',
    ClaimNo: '',
    Invoiceno: '',
    Patientname: '',
    Packagename: '',
    ClaimAmount: '',
    ApprovedAmount: '',
    Actionon: '',
    ActualDateofAdmission: '',
    ActualDateofDischarge: '',
    DishonourDate: '',
    Previousalloteddate: ',',
    createdOn:'',
    cpdalloteddate:',',
    // Previousallotedcpd: ',',
  };
  heading = [
    [
      'Sl#',
      'Claim No',
      'Invoice No',
      'URN',
      'Patient Name',
      'Package Name',
      'Actual Date of Admission',
      'Actual Date of Discharge',
      'Action On',
      'Claim Submitted Date',
      'Claim Amount',
      ' Approved Amount',
    ],
  ];
  heading1 = [
    [
      'Sl#',
      'Claim No',
      'Invoice No',
      'URN',
      'Patient Name',
      'Package Name',
      'Actual Date of Admission',
      'Actual Date of Discharge',
      'Action On',
      'Claim Submitted Date',
      'Claim Amount',
      'Alloted Date',
      'Dishonour Date'

      // 'Previous Assigned CPD',
    ],
  ];
  downloadReport(type) {
    this.report = [];
    let claim: any;
    for (var i = 0; i < this.claimlist.length; i++) {
      claim = this.claimlist[i];
      console.log(claim);
      this.sno = [];
      this.sno.Slno = i + 1;
      this.sno.ClaimNo = claim.claimno;
      this.sno.Invoiceno = claim.invoiceno;
      this.sno.URN = claim.urn;
      this.sno.Patientname = claim.patientname;
      this.sno.Packagename = claim.packagename;
      this.sno.ActualDateofAdmission = this.convertStringToDate(claim.actualdateofadmission);
      this.sno.ActualDateOfDischarge = this.convertStringToDate(claim.actualdateofdischarge);
      // this.sno.Actionon = this.convertStringToDate(claim.actionon);
      this.sno.createdOn = claim.createdOn;
      this.sno.ClaimAmount = this.convertCurrency(claim.currenttotalamount);
      if (this.show) {
        // this.sno.Previousalloteddate = this.convertStringToDate(claim.alloteddate);
        this.sno.cpdalloteddate = this.convertStringToDate(claim.previuousAllotedDate);
        this.sno.DishonourDate = this.convertStringToDate(claim.dishonourdate);
        // this.sno.Previousallotedcpd = claim.previousassignedcpd;
      }
      else {
        this.sno.ApprovedAmount = this.convertCurrency(claim.approvedamount);
        this.sno.Actionon = this.convertStringToDate(claim.actionon);
      }
      this.report.push(this.sno);
      console.log(this.report);
      console.log(this.sno);
    }

    if (type == 'xcl') {
      let filter = [];
      filter.push([['CPD Name :- ', this.cpdname]]);
      filter.push([['Case Type:- ', this.case]]);
      if (this.show) {
        TableUtil.exportListToExcelWithFilter(
          this.report,

          'CPD Payment Details',
          this.heading1, filter
        );
      } else {
        TableUtil.exportListToExcelWithFilter(
          this.report,

          'CPD Payment Details',
          this.heading, filter
        );
      }

    }
    else if (type == 'pdf') {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('l', 'mm', [400, 260]);
      doc.text("CPD Payment Details Report", 160, 10);
      doc.setFontSize(12);
      doc.text('CPD Name :- ' + this.cpdname, 10, 20);
      doc.text('Case Type :- ' + this.case, 280, 20);
      doc.text('Generated By :- ' + this.username, 10, 30);
      doc.text('Generated On :' + this.convertDate(this.timespan), 280, 30);
      var rows = [];
      if (this.show) {
        for (var i = 0; i < this.report.length; i++) {
          var clm = this.report[i];
          var pdf = [];
          pdf[0] = clm.Slno;
          pdf[1] = clm.ClaimNo;
          pdf[2] = clm.Invoiceno;
          pdf[3] = clm.URN;
          pdf[4] = clm.Patientname;
          pdf[5] = clm.Packagename;
          pdf[6] = clm.ActualDateofAdmission;
          pdf[7] = clm.ActualDateOfDischarge;
          // pdf[8] = clm.Actionon;
          pdf[8] = clm.createdOn;
          pdf[9] = clm.ClaimAmount;
          pdf[10] = clm.cpdalloteddate;
          pdf[11] = clm.DishonourDate;

          // pdf[12] = clm.Previousallotedcpd;

          rows.push(pdf);
        }
        autoTable(doc, {
          head: this.heading1,
          body: rows,
          theme: 'grid',
          startY: 40,
          headStyles: {
            fillColor: [26, 99, 54]
          },
          columnStyles: {
            0: { cellWidth: 20 },
            // 1: { cellWidth: 30 },
            // 2: { cellWidth: 30 },
            // 3: { cellWidth: 30 },
            // 4: { cellWidth: 30 },
            // 5: { cellWidth: 30 },
            // 6: { cellWidth: 30 },
            // 7: { cellWidth: 30 },
            // 8: { cellWidth: 30 },
            // 9: { cellWidth: 30 },
            // 10: { cellWidth: 30 },
            // 11: { cellWidth: 30 },
            // 12: { cellWidth: 30 },
          }
        });

      } else {
        for (var i = 0; i < this.report.length; i++) {
          var clm = this.report[i];
          var pdf = [];
          pdf[0] = clm.Slno;
          pdf[1] = clm.ClaimNo;
          pdf[2] = clm.Invoiceno;
          pdf[3] = clm.URN;
          pdf[4] = clm.Patientname;
          pdf[5] = clm.Packagename;
          pdf[6] = clm.ActualDateofAdmission;
          pdf[7] = clm.ActualDateOfDischarge;
          pdf[8] = clm.Actionon;
          pdf[9]=clm.createdOn;
          pdf[10] = clm.ClaimAmount;
          pdf[11] = clm.ApprovedAmount;
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
            0: { cellWidth: 20 },
            // 1: { cellWidth: 30 },
            // 2: { cellWidth: 30 },
            // 3: { cellWidth: 30 },
            // 4: { cellWidth: 30 },
            // 5: { cellWidth: 30 },
            // 6: { cellWidth: 30 },
            // 7: { cellWidth: 30 },
            // 8: { cellWidth: 30 },
            // 9: { cellWidth: 30 },
            // 10: { cellWidth: 30 },

          }
        });

      }
      let j = doc.getNumberOfPages();
      doc.save('CPD_Paid_Claim_Details_Report.pdf');
    }
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  convertDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy, h:mm:ss a');
    return date;
  }
  convertStringToDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy');
    return date;
  }
  // convertStringToDate1(createdOn){
  //   var datePipe = new DatePipe("en-US");
  //   createdOn = datePipe.transform(createdOn, 'dd-MMM-yyyy, h:mm:ss a');
  //   return createdOn;

  // }
  convertCurrency(amount: any) {
    var formatter = new CurrencyPipe('en-US');
    amount = formatter.transform(amount, '', '');
    return amount;
  }
}
