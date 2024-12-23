import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../application/header.service';
import { SnocreateserviceService } from '../application/Services/snocreateservice.service';
import { CpdPaymentReportService } from '../application/Services/cpd-payment-report.service';
import { Router } from '@angular/router';
import { JwtService } from '../services/jwt.service';
import Swal from 'sweetalert2';
import { TableUtil } from '../application/util/TableUtil';
import { CurrencyPipe, formatDate } from '@angular/common';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from '../services/session-storage.service';

@Component({
  selector: 'app-outsideodishatreatmentdetailsblock',
  templateUrl: './outsideodishatreatmentdetailsblock.component.html',
  styleUrls: ['./outsideodishatreatmentdetailsblock.component.scss']
})
export class OutsideodishatreatmentdetailsblockComponent implements OnInit {
  outsidedata: any;
  user: any;
  currentPage: any;
  pageElement: any;
  ActualDateofDischargeFrom: any;
  ActualDateofDischargeTo: any;
  stateName: any;
  districtCode: any;
  districtName: any;
  showPegi: boolean;
  txtsearchDate: any;
  footer1: any;
  footer2: any;
  footer3: any;
  footer4: any;
  constructor(public headerService: HeaderService,
    private snoService: SnocreateserviceService,
    private cpdpaymentservice: CpdPaymentReportService,
    private route: Router,
    private jwtService: JwtService, private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.outsidedata = JSON.parse(localStorage.getItem("outsideblock"));
    this.user = this.sessionService.decryptSessionData("user");
    this.currentPage = 1;
    this.pageElement = 50;
    this.ActualDateofDischargeFrom = this.outsidedata.ActualDateofDischargeFrom
    this.ActualDateofDischargeTo = this.outsidedata.ActualDateofDischargeTo
    this.stateName = this.outsidedata.stateName
    this.districtCode = this.outsidedata.districtCode
    this.districtName = this.outsidedata.districtName
    this.getOutsideTreatmentBlockdetails();
  }
  getOutlistdataBlock: any = [];
  record: any;
  getOutsideTreatmentBlockdetails() {
    this.getOutlistdataBlock = [];
    let Districtcode = this.districtCode;
    let FromDate = this.ActualDateofDischargeFrom;
    let Todate = this.ActualDateofDischargeTo;
    this.cpdpaymentservice.getoutsidepatienttreatementdetails(Districtcode, FromDate, Todate, this.user.userId).subscribe((data: any) => {
      if (data.status = 'success') {
        this.getOutlistdataBlock = data.details;
        let sum1 = 0;
        let sum2 = 0;
        let sum3 = 0;
        let sum4 = 0;
        for (let i = 0; i < this.getOutlistdataBlock.length; i += 1) {
          sum1 += parseInt(this.getOutlistdataBlock[i].urn);
          sum2 += parseInt(this.getOutlistdataBlock[i].noofmembers);
          sum3 += parseInt(this.getOutlistdataBlock[i].nofopackages);
          sum4 += parseInt(this.getOutlistdataBlock[i].amount);
        }
        this.footer1 = sum1;
        this.footer2 = sum2;
        this.footer3 = sum3;
        this.footer4 = this.convertCurrency(sum4);
        this.record = this.getOutlistdataBlock.length;
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
    nameofblock: "",
    urnno: "",
    nameofthepatient: "",
    hospitalname: "",
    hospitalcode: "",
    amount: "",
    nofopackages: "",
  };
  heading = [['Sl#', 'Beneficiary Block Name', 'No. Of URN', 'No. Of Member', 'No. Of Package', 'Treatment Amount']];

  downloadReportExcel() {
    this.report = [];
    let claim: any;
    for (var i = 0; i < this.getOutlistdataBlock.length; i++) {
      claim = this.getOutlistdataBlock[i];
      this.sno = [];
      this.sno.Slno = i + 1;
      this.sno.nameofblock = claim.blockname;
      this.sno.urnno = claim.urn;
      this.sno.nameofthepatient = claim.noofmembers;
      this.sno.nofopackages = claim.nofopackages;
      this.sno.amount = this.convertCurrency(claim.amount);
      this.report.push(this.sno);
    }
    this.sno = [];
    this.sno.Slno = '';
    this.sno.nameofblock = "Total";
    this.sno.urnno = this.footer1;
    this.sno.nameofthepatient = this.footer2;
    this.sno.nofopackages = this.footer3;
    this.sno.amount = this.footer4;
    this.report.push(this.sno);
    let filter = [];
    filter.push([['Actual Date of Discharge From: :- ', this.ActualDateofDischargeFrom]]);
    filter.push([['Actual Date of Discharge To :- ', this.ActualDateofDischargeTo]]);
    filter.push([['State Name :- ', "ODISHA"]]);
    filter.push([['Beneficiary District Name :- ', this.districtName]]);
    TableUtil.exportListToExcelWithFilterforadmin(this.report, "Patient Treated Outside Odisha Report For Block", this.heading, filter);
  }
  downloadReportpdf() {
    this.report = [];
    if (this.getOutlistdataBlock.length == 0) {
      this.swal('', 'No Data Found', 'info');
      return;
    }
    let SlNo = 1;
    this.getOutlistdataBlock.forEach(element => {
      let rowData = [];
      rowData.push(SlNo++);
      rowData.push(element.blockname);
      rowData.push(element.urn);
      rowData.push(element.noofmembers);
      rowData.push(element.nofopackages);
      rowData.push(this.convertCurrency(element.amount));
      this.report.push(rowData);
    });
    if (this.getOutlistdataBlock.length > 0) {
      let rowData = [];
      rowData.push("");
      rowData.push("Total");
      rowData.push(this.footer1);
      rowData.push(this.footer2);
      rowData.push(this.footer3);
      rowData.push(this.footer4);
      this.report.push(rowData);
      let doc = new jsPDF('l', 'mm', [238, 270]);
      doc.setFontSize(10);
      doc.text('Authority Name :-' + this.user.fullName, 5, 5);
      doc.text('Actual Date of Discharge From:-' + this.ActualDateofDischargeFrom, 5, 10);
      doc.text('Actual Date of Discharge To:-' + this.ActualDateofDischargeTo, 5, 15);
      doc.text('State Name:-' + "ODISHA", 5, 20);
      doc.text('Beneficiary District Name:-' + this.districtName, 5, 25);
      doc.text('Document Generate Date :-' + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en').toString(), 5, 30);
      doc.text('Patient Treated Outside Odisha Report For Block', 100, 35);
      doc.setLineWidth(0.7);
      doc.line(100, 37, 178, 37);
      autoTable(doc, {
        head: this.heading, body: this.report, startY: 38, theme: 'grid',
        styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
        bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 40 },
          2: { cellWidth: 40 },
          3: { cellWidth: 40 },
          4: { cellWidth: 40 },
        }
      })
      doc.save('Patient_Treated_Outside_Odisha_Report_For_Block.pdf');
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
  view(blockname, blockid) {
    let state = {
      ActualDateofDischargeFrom: this.ActualDateofDischargeFrom,
      ActualDateofDischargeTo: this.ActualDateofDischargeTo,
      districtCode: this.districtCode,
      districtName: this.districtName,
      blockcode: blockid,
      blockname: blockname,
    }
    console.log(state);
    localStorage.setItem("outsideblock", JSON.stringify(state));
    localStorage.setItem("token", this.jwtService.getJwtToken())
    this.route.navigate([]).then(result => {
      window.open(environment.routingUrl + '/outsideodishatreatmentdetailspanchayat');
    });
  }
  convertCurrency(amount: any) {
    var formatter = new CurrencyPipe('en-US');
    amount = formatter.transform(amount, '', '');
    return amount;
  }
}
