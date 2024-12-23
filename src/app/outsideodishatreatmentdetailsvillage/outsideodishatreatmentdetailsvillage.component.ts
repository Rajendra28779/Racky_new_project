import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../application/header.service';
import { SnocreateserviceService } from '../application/Services/snocreateservice.service';
import { CpdPaymentReportService } from '../application/Services/cpd-payment-report.service';
import { Router } from '@angular/router';
import { JwtService } from '../services/jwt.service';
import Swal from 'sweetalert2';
import { TableUtil } from '../application/util/TableUtil';
import jsPDF from 'jspdf';
import { CurrencyPipe, formatDate } from '@angular/common';
import autoTable from 'jspdf-autotable';
import { SessionStorageService } from '../services/session-storage.service';

@Component({
  selector: 'app-outsideodishatreatmentdetailsvillage',
  templateUrl: './outsideodishatreatmentdetailsvillage.component.html',
  styleUrls: ['./outsideodishatreatmentdetailsvillage.component.scss']
})
export class OutsideodishatreatmentdetailsvillageComponent implements OnInit {
  outsidebgp: any;
  user: any;
  currentPage: any;
  pageElement: any;
  ActualDateofDischargeFrom: any;
  ActualDateofDischargeTo: any;
  districtCode: any;
  districtName: any;
  blockcode: any;
  blockname: any;
  showPegi: boolean;
  txtsearchDate: any;
  gpname: any;
  gpid: any;
  footer1: any;
  constructor(public headerService: HeaderService,
    private snoService: SnocreateserviceService,
    private cpdpaymentservice: CpdPaymentReportService,
    private route: Router,
    private jwtService: JwtService, private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.outsidebgp = JSON.parse(localStorage.getItem("outsidegp"));
    this.user = this.sessionService.decryptSessionData("user");
    this.currentPage = 1;
    this.pageElement = 50;
    this.ActualDateofDischargeFrom = this.outsidebgp.ActualDateofDischargeFrom;
    this.ActualDateofDischargeTo = this.outsidebgp.ActualDateofDischargeTo;
    this.districtCode = this.outsidebgp.districtCode;
    this.districtName = this.outsidebgp.districtName;
    this.blockcode = this.outsidebgp.blockcode;
    this.blockname = this.outsidebgp.blockname;
    this.gpname = this.outsidebgp.gpname;
    this.gpid = this.outsidebgp.gpid;
    this.getoutsideVillageData();
  }
  getOutlistdataVillage: any = [];
  record: any;
  getoutsideVillageData() {
    let Districtcode = this.districtCode;
    let blockcode = this.blockcode;
    let FromDate = this.ActualDateofDischargeFrom;
    let Todate = this.ActualDateofDischargeTo;
    let gpcode = this.gpid;
    this.cpdpaymentservice.getOutsidevillagedetaisl(Districtcode, blockcode, FromDate, Todate, this.user.userId, gpcode).subscribe((data: any) => {
      if (data.status = 'success') {
        this.getOutlistdataVillage = data.details;
        let sum1 = 0;
        for (let i = 0; i < this.getOutlistdataVillage.length; i += 1) {
          sum1 += parseInt(this.getOutlistdataVillage[i].amount);
        }
        this.footer1 = this.convertCurrency(sum1);
        this.record = this.getOutlistdataVillage.length;
        if (this.record > 0) {
          this.showPegi = true;
        } else {
          this.showPegi = false;
        }
      } else if (data.status = 'fails') {
        this.swal('', 'Something went wrong. ', 'error');
      }
    }, (error) => {
      console.log(error);
      this.swal('', 'Something went wrong.', 'error');
    })
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
    nameofvillage: "",
    urnno: "",
    nameofthepatient: "",
    hospitalname: "",
    hospitalcode: "",
    amount: "",
  };
  heading = [['Sl#', 'Beneficiary Village Name', 'URN', 'Patient Name', 'Hospital Name', 'Hospital Code', 'Treatment Amount']];
  downloadReportExcel() {
    this.report = [];
    let claim: any;
    for (var i = 0; i < this.getOutlistdataVillage.length; i++) {
      claim = this.getOutlistdataVillage[i];
      this.sno = [];
      this.sno.Slno = i + 1;
      this.sno.nameofvillage = claim.villagename;
      this.sno.urnno = claim.urn;
      this.sno.nameofthepatient = claim.patientname;
      this.sno.hospitalname = claim.hospitalname;
      this.sno.hospitalcode = claim.hospitalcode;
      this.sno.amount = claim.amount;
      this.report.push(this.sno);
    }
    this.sno = [];
    this.sno.Slno = '';
    this.sno.hospitalcode = "Total";
    this.sno.amount = this.footer1;
    this.report.push(this.sno);
    let filter = [];
    filter.push([['Actual Date of Discharge From: :- ', this.ActualDateofDischargeFrom]]);
    filter.push([['Actual Date of Discharge To :- ', this.ActualDateofDischargeTo]]);
    filter.push([['State Name :- ', "ODISHA"]]);
    filter.push([['Beneficiary District Name :- ', this.districtName]]);
    filter.push([['Beneficiary Block Name :- ', this.blockname]]);
    filter.push([['Beneficiary Panchayat Name :- ', this.gpname]]);
    TableUtil.exportListToExcelWithFilterforadmin(this.report, "Patient Treated Outside Odisha Report For Village", this.heading, filter);
  }
  downloadReportpdf() {
    this.report = [];
    if (this.getOutlistdataVillage.length == 0) {
      this.swal('', 'No Data Found', 'info');
      return;
    }
    let SlNo = 1;
    this.getOutlistdataVillage.forEach(element => {
      let rowData = [];
      rowData.push(SlNo++);
      rowData.push(element.villagename);
      rowData.push(element.urn);
      rowData.push(element.patientname);
      rowData.push(element.hospitalname);
      rowData.push(element.hospitalcode);
      rowData.push(element.amount);
      this.report.push(rowData);
    });
    if (this.getOutlistdataVillage.length > 0) {
      let rowData = [];
      rowData.push("");
      rowData.push("");
      rowData.push("");
      rowData.push("");
      rowData.push("");
      rowData.push("Total");
      rowData.push(this.footer1);
      this.report.push(rowData);
      let doc = new jsPDF('l', 'mm', [238, 270]);
      doc.setFontSize(10);
      doc.text('Authority Name :-' + this.user.fullName, 5, 5);
      doc.text('Actual Date of Discharge From:-' + this.ActualDateofDischargeFrom, 5, 10);
      doc.text('Actual Date of Discharge To:-' + this.ActualDateofDischargeTo, 5, 15);
      doc.text('State Name:-' + "ODISHA", 5, 20);
      doc.text('Beneficiary District Name:-' + this.districtName, 5, 25);
      doc.text('Beneficiary Block Name:-' + this.blockname, 5, 30);
      doc.text('Beneficiary Panchayat Name:-' + this.gpname, 5, 35);
      doc.text('Document Generate Date :-' + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en').toString(), 5, 40);
      doc.text('Patient Treated Outside Odisha Report For Village', 100, 41);
      doc.setLineWidth(0.7);
      doc.line(100, 42, 180, 42);
      autoTable(doc, {
        head: this.heading, body: this.report, startY: 45, theme: 'grid',
        styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
        bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
        columnStyles: {
          0: { cellWidth: 8 },
          1: { cellWidth: 25 },
          2: { cellWidth: 23 },
          3: { cellWidth: 28 },
          4: { cellWidth: 48 },
          5: { cellWidth: 28 },
          6: { cellWidth: 24 },
          7: { cellWidth: 34 },
        }
      })
      doc.save('Patient_Treated_Outside_Odisha_Report_For_Village.pdf');
    } else {
      this.swal('Info', 'No Data Found!', 'info');
    }
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
    console.log(this.pageElement);
  }
  //convert number to currency
  convertCurrency(amount: any) {
    var formatter = new CurrencyPipe('en-US');
    amount = formatter.transform(amount, '', '');
    return amount;
  }
}
