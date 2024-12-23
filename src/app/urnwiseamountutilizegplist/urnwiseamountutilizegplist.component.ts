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
import { environment } from 'src/environments/environment';
import { SessionStorageService } from '../services/session-storage.service';

@Component({
  selector: 'app-urnwiseamountutilizegplist',
  templateUrl: './urnwiseamountutilizegplist.component.html',
  styleUrls: ['./urnwiseamountutilizegplist.component.scss']
})
export class UrnwiseamountutilizegplistComponent implements OnInit {
  gplist: any;
  user: any;
  currentPage: any;
  pageElement: any;
  ActualDateofDischargeFrom: any;
  ActualDateofDischargeTo: any;
  stateCode: any;
  stateName: any;
  districtCode: any;
  districtName: any;
  blockcode: any;
  blockname: any;
  txtsearchDate: any;
  showPegi: boolean;
  footer1: any;
  footer2: any;
  footer3: any;
  footer4: any;
  constructor(public headerService: HeaderService,
    private snoService: SnocreateserviceService,
    private cpdpaymentservice: CpdPaymentReportService,
    private route: Router,
    private jwtService: JwtService,  private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.gplist = JSON.parse(localStorage.getItem("gplist"));
    this.user = this.sessionService.decryptSessionData("user");
    this.currentPage = 1;
    this.pageElement = 50;
    this.ActualDateofDischargeFrom = this.gplist.ActualDateofDischargeFrom
    this.ActualDateofDischargeTo = this.gplist.ActualDateofDischargeTo
    this.stateCode = this.gplist.stateCode
    this.stateName = this.gplist.stateName
    this.districtCode = this.gplist.districtCode
    this.districtName = this.gplist.districtName
    this.blockcode = this.gplist.blockcode
    this.blockname = this.gplist.blockname
    this.getGplistData();
  }
  getUrnlistdatagp: any = [];
  record: any;
  getGplistData() {
    let Districtcode = this.districtCode;
    let Blockcode = this.blockcode;
    let FromDate = this.ActualDateofDischargeFrom;
    let Todate = this.ActualDateofDischargeTo;
    this.cpdpaymentservice.getGpDetailsList(Districtcode, Blockcode, FromDate, Todate, this.user.userId).subscribe((data: any) => {
      if (data.status = 'success') {
        this.getUrnlistdatagp = data.details;
        let sum1 = 0;
        let sum2 = 0;
        let sum3 = 0;
        let sum4 = 0;
        for (let i = 0; i < this.getUrnlistdatagp.length; i += 1) {
          sum1 += parseInt(this.getUrnlistdatagp[i].urn);
          sum2 += parseInt(this.getUrnlistdatagp[i].numberofmember);
          sum3 += parseInt(this.getUrnlistdatagp[i].packagename);
          sum4 += parseInt(this.getUrnlistdatagp[i].totalamount);
        }
        this.footer1 = sum1;
        this.footer2 = sum2;
        this.footer3 = sum3;
        this.footer4 = this.convertCurrency(sum4);
        this.record = this.getUrnlistdatagp.length;
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
    nameofGp: "",
    urnno: "",
    nameofthehof: "",
    mobileno: "",
    noofmemeber: "",
    noofpackage: "",
    amount: "",
  };
  heading = [['Sl#', 'Beneficiary GP Name', 'No. Of URN', 'No of Member', 'No of Package', 'Amount']];
  downloadReportExcel() {
    this.report = [];
    let claim: any;
    for (var i = 0; i < this.getUrnlistdatagp.length; i++) {
      claim = this.getUrnlistdatagp[i];
      this.sno = [];
      this.sno.Slno = i + 1;
      this.sno.nameofGp = claim.gpname;
      this.sno.urnno = claim.urn;
      this.sno.noofmemeber = claim.numberofmember;
      this.sno.noofpackage = claim.packagename;
      this.sno.amount = this.convertCurrency(claim.totalamount);
      this.report.push(this.sno);
    }
    this.sno = [];
    this.sno.Slno = '';
    this.sno.nameofGp = "Total";
    this.sno.urnno = this.footer1;
    this.sno.noofmemeber = this.footer2;
    this.sno.noofpackage = this.footer3;
    this.sno.amount = this.footer4;
    this.report.push(this.sno);
    let filter = [];
    filter.push([['Actual Date of Discharge From: :- ', this.ActualDateofDischargeFrom]]);
    filter.push([['Actual Date of Discharge To :- ', this.ActualDateofDischargeTo]]);
    filter.push([['State Name :- ', "ODISHA"]]);
    filter.push([['Beneficiary District Name :- ', this.districtName]]);
    filter.push([['Beneficiary Block Name :- ', this.blockname]]);
    TableUtil.exportListToExcelWithFilterforadmin(this.report, "URN Wise Amount Utilized Report", this.heading, filter);
  }
  downloadReportpdf() {
    this.report = [];
    if (this.getUrnlistdatagp.length == 0) {
      this.swal('', 'No Data Found', 'info');
      return;
    }
    let SlNo = 1;
    this.getUrnlistdatagp.forEach(element => {
      let rowData = [];
      rowData.push(SlNo++);
      rowData.push(element.gpname);
      rowData.push(element.urn);
      rowData.push(element.numberofmember);
      rowData.push(element.packagename);
      rowData.push(this.convertCurrency(element.totalamount));
      this.report.push(rowData);
    });
    if (this.getUrnlistdatagp.length > 0) {
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
      doc.text('Beneficiary Block Name:-' + this.blockname, 5, 30);
      doc.text('Document Generate Date :-' + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en').toString(), 5, 35);
      doc.text('URN Wise Amount Utilized Gp Report ', 100, 37);
      doc.setLineWidth(0.7);
      doc.line(100, 38, 158, 38);
      autoTable(doc, {
        head: this.heading, body: this.report, startY: 40, theme: 'grid',
        styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
        bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 40 },
          2: { cellWidth: 40 },
          3: { cellWidth: 40 },
          4: { cellWidth: 40 },
          5: { cellWidth: 40 },
        }
      })
      doc.save('URN_Wise_Amount_Utilized_Report.pdf');
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
  view(gpname, gpid) {
    let state = {
      ActualDateofDischargeFrom: this.ActualDateofDischargeFrom,
      ActualDateofDischargeTo: this.ActualDateofDischargeTo,
      stateCode: 21,
      stateName: this.stateName,
      districtCode: this.districtCode,
      districtName: this.districtName,
      blockcode: this.blockcode,
      blockname: this.blockname,
      gpname: gpname,
      gpid: gpid,
    }
    console.log(state);
    localStorage.setItem("villagelist", JSON.stringify(state));
    localStorage.setItem("token", this.jwtService.getJwtToken())
    this.route.navigate([]).then(result => {
      window.open(environment.routingUrl + '/UrnwiseamounntUtilizevillagereport');
    });
  }
  //convert number to currency
  convertCurrency(amount: any) {
    var formatter = new CurrencyPipe('en-US');
    amount = formatter.transform(amount, '', '');
    return amount;
  }
}
