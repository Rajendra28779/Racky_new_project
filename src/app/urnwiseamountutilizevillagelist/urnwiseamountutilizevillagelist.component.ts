import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../application/header.service';
import { SnocreateserviceService } from '../application/Services/snocreateservice.service';
import { CpdPaymentReportService } from '../application/Services/cpd-payment-report.service';
import { Router } from '@angular/router';
import { JwtService } from '../services/jwt.service';
import Swal from 'sweetalert2';
import { TableUtil } from '../application/util/TableUtil';
import { CurrencyPipe, formatDate } from '@angular/common';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SessionStorageService } from '../services/session-storage.service';

@Component({
  selector: 'app-urnwiseamountutilizevillagelist',
  templateUrl: './urnwiseamountutilizevillagelist.component.html',
  styleUrls: ['./urnwiseamountutilizevillagelist.component.scss']
})
export class UrnwiseamountutilizevillagelistComponent implements OnInit {
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
  villagedata: any;
  gpname: any;
  gpid: any;
  footer1: any;
  footer2: any;
  footer3: any;
  constructor(public headerService: HeaderService,
    private snoService: SnocreateserviceService,
    private cpdpaymentservice: CpdPaymentReportService,
    private route: Router,
    private jwtService: JwtService, private sessionService: SessionStorageService
    ) { }

  ngOnInit(): void {
    this.villagedata = JSON.parse(localStorage.getItem("villagelist"));
    this.user = this.sessionService.decryptSessionData("user");
    this.currentPage = 1;
    this.pageElement = 50;
    this.ActualDateofDischargeFrom = this.villagedata.ActualDateofDischargeFrom
    this.ActualDateofDischargeTo = this.villagedata.ActualDateofDischargeTo
    this.stateCode = this.villagedata.stateCode
    this.stateName = this.villagedata.stateName
    this.districtCode = this.villagedata.districtCode
    this.districtName = this.villagedata.districtName
    this.blockcode = this.villagedata.blockcode
    this.blockname = this.villagedata.blockname
    this.gpname = this.villagedata.gpname
    this.gpid = this.villagedata.gpid
    this.getVIllageData();
  }
  getUrnlistdatavillage: any = [];
  record: any;
  getVIllageData() {
    let Districtcode = this.districtCode;
    let Blockcode = this.blockcode;
    let FromDate = this.ActualDateofDischargeFrom;
    let gpid = this.gpid;
    let Todate = this.ActualDateofDischargeTo;
    this.cpdpaymentservice.getVillageData(Districtcode, Blockcode, FromDate, gpid, Todate, this.user.userId).subscribe((data: any) => {
      if (data.status = 'success') {
        this.getUrnlistdatavillage = data.details;
        let sum1 = 0;
        let sum2 = 0;
        let sum3 = 0;
        for (let i = 0; i < this.getUrnlistdatavillage.length; i += 1) {
          sum1 += parseInt(this.getUrnlistdatavillage[i].numberofmember);
          sum2 += parseInt(this.getUrnlistdatavillage[i].packagename);
          sum3 += parseInt(this.getUrnlistdatavillage[i].totalamount);
        }
        this.footer1 = sum1;
        this.footer2 = sum2;
        this.footer3 = this.convertCurrency(sum3);
        this.record = this.getUrnlistdatavillage.length;
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
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
    console.log(this.pageElement);
  }
  report: any = [];
  sno: any = {
    Slno: "",
    nameofVillage: "",
    urnno: "",
    nameofthehof: "",
    mobileno: "",
    noofmemeber: "",
    noofpackage: "",
    amount: "",
  };
  heading = [['Sl#', 'Beneficiary Village Name', 'URN', 'Name of the HOF', 'Mobile No', 'No of Member', 'No of Package', 'Amount']];
  downloadReportExcel() {
    this.report = [];
    let claim: any;
    for (var i = 0; i < this.getUrnlistdatavillage.length; i++) {
      claim = this.getUrnlistdatavillage[i];
      this.sno = [];
      this.sno.Slno = i + 1;
      this.sno.nameofVillage = claim.villagename;
      this.sno.urnno = claim.urn;
      this.sno.nameofthehof = claim.nameofhof;
      this.sno.mobileno = claim.mobileno;
      this.sno.noofmemeber = claim.numberofmember;
      this.sno.noofpackage = claim.packagename;
      this.sno.amount = this.convertCurrency(claim.totalamount);
      this.report.push(this.sno);
    }
    this.sno = [];
    this.sno.Slno = '';
    this.sno.mobileno = "Total";
    this.sno.noofmemeber = this.footer1;
    this.sno.noofpackage = this.footer2;
    this.sno.amount = this.footer3;
    this.report.push(this.sno);
    let filter = [];
    filter.push([['Actual Date of Discharge From: :- ', this.ActualDateofDischargeFrom]]);
    filter.push([['Actual Date of Discharge To :- ', this.ActualDateofDischargeTo]]);
    filter.push([['State Name :- ', "ODISHA"]]);
    filter.push([['Beneficiary District Name :- ', this.districtName]]);
    filter.push([['Beneficiary Block Name :- ', this.blockname]]);
    filter.push([['Beneficiary Gp Name :- ', this.gpname]]);
    TableUtil.exportListToExcelWithFilterforadmin(this.report, "URN Wise Amount Utilized Report", this.heading, filter);
  }
  downloadReportpdf() {
    this.report = [];
    if (this.getUrnlistdatavillage.length == 0) {
      this.swal('', 'No Data Found', 'info');
      return;
    }
    let SlNo = 1;
    this.getUrnlistdatavillage.forEach(element => {
      let rowData = [];
      rowData.push(SlNo++);
      rowData.push(element.gpname);
      rowData.push(element.urn);
      rowData.push(element.nameofhof);
      rowData.push(element.mobileno);
      rowData.push(element.numberofmember);
      rowData.push(element.packagename);
      rowData.push(this.convertCurrency(element.totalamount));
      this.report.push(rowData);
    });
    if (this.getUrnlistdatavillage.length > 0) {
      let rowData = [];
      rowData.push("");
      rowData.push("");
      rowData.push("");
      rowData.push("");
      rowData.push("Total");
      rowData.push(this.footer1);
      rowData.push(this.footer2);
      rowData.push(this.footer3);
      this.report.push(rowData);
      let doc = new jsPDF('l', 'mm', [238, 270]);
      doc.setFontSize(10);
      doc.text('Authority Name :-' + this.user.fullName, 5, 5);
      doc.text('Actual Date of Discharge From:-' + this.ActualDateofDischargeFrom, 5, 10);
      doc.text('Actual Date of Discharge To:-' + this.ActualDateofDischargeTo, 5, 15);
      doc.text('State Name:-' + "ODISHA", 5, 20);
      doc.text('Beneficiary District Name:-' + this.districtName, 5, 25);
      doc.text('Beneficiary Block Name:-' + this.blockname, 5, 30);
      doc.text('Beneficiary Gp Name:-' + this.gpname, 5, 35);
      doc.text('Document Generate Date :-' + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en').toString(), 5, 40);
      doc.text('URN Wise Amount Utilized Village Report ', 100, 45);
      doc.setLineWidth(0.7);
      doc.line(100, 47, 165, 47);
      autoTable(doc, {
        head: this.heading, body: this.report, startY: 48, theme: 'grid',
        styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
        bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
        columnStyles: {
          0: { cellWidth: 8 },
          1: { cellWidth: 25 },
          2: { cellWidth: 23 },
          3: { cellWidth: 28 },
          4: { cellWidth: 28 },
          5: { cellWidth: 28 },
          6: { cellWidth: 24 },
          7: { cellWidth: 24 },
        }
      })
      doc.save('URN_Wise_Amount_Utilized_Report.pdf');
    } else {
      this.swal('Info', 'No Data Found!', 'info');
    }
  }
  //convert number to currency
  convertCurrency(amount: any) {
    var formatter = new CurrencyPipe('en-US');
    amount = formatter.transform(amount, '', '');
    return amount;
  }
}
