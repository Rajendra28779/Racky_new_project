import { Component, OnInit } from '@angular/core';
import { PaidClaimReportService } from '../application/Services/paid-claim-report.service';
import { HeaderService } from '../application/header.service';
import { TableUtil } from '../application/util/TableUtil';
import Swal from 'sweetalert2';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { SessionStorageService } from '../services/session-storage.service';

@Component({
  selector: 'app-hospitalwisesummarryinnerpage',
  templateUrl: './hospitalwisesummarryinnerpage.component.html',
  styleUrls: ['./hospitalwisesummarryinnerpage.component.scss']
})
export class HospitalwisesummarryinnerpageComponent implements OnInit {
  user: any;
  result: any = [];
  record: any;
  innerpage: any = [];
  getdata: any = [];
  totalsum: any;
  Fromdate: any;
  Todate: any;
  searchtyp: any;
  userId: any;
  txtsearchDate: any;
  constructor(public paidclaimService: PaidClaimReportService, public headerService: HeaderService,
    private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle('Discharge and Claim Summary Details');
    this.user = this.sessionService.decryptSessionData("user");
    this.Fromdate = localStorage.getItem("Fromdate");
    this.Todate = localStorage.getItem("Todate");
    this.searchtyp = localStorage.getItem("searchtyp");
    this.userId = localStorage.getItem("userId");
    this.paidclaimService.gethospitaldetailsinnerpage(this.Fromdate, this.Todate, this.searchtyp, this.userId).subscribe((response: any) => {
      this.innerpage = response;
      this.getdata = this.innerpage.data;
      this.record = this.getdata.length;
      console.log(this.innerpage)
      if (this.record > 0) {
        let sum = 0;
        for (let i = 0; i < this.getdata.length; i++) {
          sum += parseInt(this.getdata[i].totalamountclaimed);
          console.log(sum)
          this.totalsum = sum;
          localStorage.removeItem("Fromdate");
          localStorage.removeItem("Todate");
          localStorage.removeItem("searchtyp");
          localStorage.removeItem("userId");
        }
      } else {
        this.totalsum = 0;
      }
    }
    );
  }
  report: any = [];
  sno: any = {
    SlNO: "",
    ClaimNumber: "",
    CaseNumber: "",
    URN: "",
    Patientname: "",
    PackageCode: "",
    packageName: "",
    Totalamountclaimed: "",
    paymentFreezeStatus: "",
    ActualDateofDischarge: "",
    ActualDateofadmission: "",
  };
  heading = [['Sl no.', 'Claim Number', 'Case Number', 'URN', 'Patient Name', 'Package Code', 'Package Name', 'Totalamount Claimed', 'paymentFreeze Status', 'Actual Date Of Discharge', 'Actual Date Of admission']];
  downloadReport(type: any) {
    this.report = [];
    if (type == 'excel') {
      let claim: any;
      for (var i = 0; i < this.getdata.length; i++) {
        claim = this.getdata[i];
        this.sno = [];
        this.sno.SlNO = i + 1;
        this.sno.ClaimNumber = claim.claim_no;
        this.sno.CaseNumber = claim.caseno;
        this.sno.URN = claim.urn;
        this.sno.Patientname = claim.patientname;
        this.sno.PackageCode = claim.packagecode;
        this.sno.packageName = claim.packagename;
        this.sno.Totalamountclaimed = this.convertCurrency(claim.totalamountclaimed);
        this.sno.paymentFreezeStatus = claim.paymentfreezestatus;
        this.sno.ActualDateofDischarge = this.DateConveter(claim.actualDateOfDischarge);
        this.sno.ActualDateofadmission = this.DateConveter(claim.actualDateOfAdmission);
        this.report.push(this.sno);
      }
      this.sno = [];
      this.sno.ClaimNumber = "TOTAL"
      this.sno.CaseNumber = "";
      this.sno.URN = "";
      this.sno.Patientname = "";
      this.sno.PackageCode = "";
      this.sno.packageName = "";
      this.sno.Totalamountclaimed = this.convertCurrency(this.totalsum);
      this.sno.paymentFreezeStatus = "";
      this.sno.ActualDateofDischarge = "";
      this.sno.ActualDateofadmission = "";
      // this.sno.totalsum = this.convertCurrency(this.totalsum);
      this.report.push(this.sno);

      let filter1 = [];
      filter1.push([['Hospital Name:-', this.user.fullName]]);
      if (this.searchtyp == "1") {
        filter1.push([['Search Type:-', 'Freezed']]);
      } else if (this.searchtyp == "2") {
        filter1.push([['Search Type:-', 'Paid']]);
      } else if (this.searchtyp == "3") {
        filter1.push([['Search Type:-', 'SNA Rejected']]);
      }
      filter1.push([['Actual Date of Discharge From:-', this.Fromdate]]);
      filter1.push([['To:-', this.Todate]]);
      TableUtil.exportListToExcelWithFilterforhospitals(this.report, "Discharge and Claim Summary Details", this.heading, filter1);
    }
    else if (type == 'pdf') {
      if (this.getdata.length == 0) {
        this.swal('', 'No Data Found', 'info');
        return;
      }
      let SlNo = 1;
      this.getdata.forEach(element => {
        let rowData = [];
        rowData.push(SlNo);
        rowData.push(element.claim_no);
        rowData.push(element.caseno);
        rowData.push(element.urn);
        rowData.push(element.patientname);
        rowData.push(element.packagecode);
        rowData.push(element.packagename);
        rowData.push(this.convertCurrency(element.totalamountclaimed));
        rowData.push(element.paymentfreezestatus);
        rowData.push(this.DateConveter(element.actualDateOfDischarge));
        rowData.push(this.DateConveter(element.actualDateOfAdmission));
        this.report.push(rowData);
        SlNo++;
      });
      this.report.push(["TOTAL", "", "", "", "", "", "", this.convertCurrency(this.totalsum), "", "", ""]);
      let doc = new jsPDF('l', 'mm', [238, 270]);
      doc.setFontSize(10);
      doc.text('Hospital Name :-' + this.user.fullName, 5, 5);
      doc.text('Actual Date of Discharge From:-' + this.Fromdate, 5, 10);
      doc.text('To:-' + this.Todate, 5, 15);
      if (this.searchtyp == "1") {
        doc.text('Search Type:-' + 'Freezed', 5, 20);
      } else if (this.searchtyp == "2") {
        doc.text('Search Type:-' + 'Paid', 5, 20);
      } else if (this.searchtyp == "3") {
        doc.text('Search Type:-' + 'SNA Rejected', 5, 20);
      }
      doc.text('Document Generate Date :-' + new Date().toLocaleString(), 5, 25);
      doc.text('Discharge and Claim Summary Details', 100, 27);
      doc.setLineWidth(0.7);
      doc.line(100, 28, 150, 28);
      autoTable(doc, {
        head: this.heading, body: this.report, startY: 28, theme: 'grid',
        styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
        bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: 18 },
          2: { cellWidth: 30 },
          3: { cellWidth: 20 },
          4: { cellWidth: 18 },
          5: { cellWidth: 18 },
          6: { cellWidth: 18 },
          7: { cellWidth: 18 },
          8: { cellWidth: 30 },
          9: { cellWidth: 18 },
          10: { cellWidth: 18 },
        }
      })
      doc.save('Discharge_and_Claim_Summary_Details.pdf');
    }
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  convertCurrency(amount: any) {
    var formatter = new CurrencyPipe('en-US');
    amount = formatter.transform(amount, '', '');
    return amount;
  }
  DateConveter(Date: any) {
    var formatter = new DatePipe('en-US');
    Date = formatter.transform(Date, 'dd-MM-yyyy');
    return Date;
  }
}