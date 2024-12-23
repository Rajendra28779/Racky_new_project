import { Component, OnInit } from '@angular/core';
import { TrackingTransistServiceService } from '../application/Services/tracking-transist-service.service';
import { SnoCLaimDetailsService } from '../application/Services/sno-claim-details.service';
import { JwtService } from '../services/jwt.service';
import { Router } from '@angular/router';
import { CpdPaymentReportService } from '../application/Services/cpd-payment-report.service';
import Swal from 'sweetalert2';
import { TableUtil } from '../application/util/TableUtil';
import jsPDF from 'jspdf';
import { DatePipe, formatDate } from '@angular/common';
import autoTable from 'jspdf-autotable';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from '../services/session-storage.service';

@Component({
  selector: 'app-mortalitydetails',
  templateUrl: './mortalitydetails.component.html',
  styleUrls: ['./mortalitydetails.component.scss']
})
export class MortalitydetailsComponent implements OnInit {
  user: any;
  data: any;
  txtsearchDate: any;
  Districtdropdown: any;
  districtCodeList: any;
  fromdate: any;
  hospitalCodeList: any;
  hospitalNameList: any;
  hospitalnamedropdown: any;
  stateCodeList: any;
  stateNamedropdown: any;
  todate: any;
  showPegi: boolean;
  currentPage: any;
  pageElement: any;
  constructor(private trackingtransistReport: TrackingTransistServiceService,
    public snoservice: SnoCLaimDetailsService,
    private jwtService: JwtService,
    private route: Router, private cpdpaymentservice: CpdPaymentReportService, private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.user = this.sessionService.decryptSessionData("user");
    this.data = JSON.parse(localStorage.getItem("mortalitydetils"));
    this.currentPage = 1;
    this.pageElement = 200;
    this.Districtdropdown = this.data.Districtdropdown;
    this.districtCodeList = this.data.districtCodeList;
    this.fromdate = this.data.fromdate;
    this.hospitalCodeList = this.data.hospitalCodeList;
    this.hospitalNameList = this.data.hospitalNameList;
    this.hospitalnamedropdown = this.data.hospitalnamedropdown;
    this.stateCodeList = this.data.stateCodeList;
    this.stateNamedropdown = this.data.stateNamedropdown;
    this.todate = this.data.todate;
    this.getdetials();
  }
  report: any = [];
  sno: any = {
    Slno: "",
    statename: "",
    districtname: "",
    hospitalcode: "",
    hospitalname: "",
    urn: "",
    patientname: "",
    age: "",
    actualdateofadmission: "",
    actualdateofdischrge: "",
    packagename: "",
    packagecode: "",
    mortality: "",
  };
  heading = [['Sl#', 'State Name', 'District Name', 'Hospital Details', 'URN', 'Patient Name', 'Age', 'Actual Date Of Admission',
    'Actual Date Of Discharge', 'Package Name', 'Package Code', 'Mortality']];
  downloadReport(type: any) {
    this.report = [];
    if (type == 'excel') {
      let claim: any;
      for (var i = 0; i < this.detailsdata.length; i++) {
        claim = this.detailsdata[i];
        this.sno = [];
        this.sno.Slno = i + 1;
        this.sno.statename = claim.stateName;
        this.sno.districtname = claim.districtName;
        this.sno.hospitalname = claim.hospitalName + '(' + claim.hospitalCode + ')';
        this.sno.urn = claim.urn;
        this.sno.patientname = claim.patientname;
        this.sno.age = claim.age;
        this.sno.actualdateofadmission = this.dateconvert(claim.actualdateofAdmission);
        this.sno.actualdateofdischrge = this.dateconvert(claim.actualdateofDischarge);
        this.sno.packagename = claim.packagename;
        this.sno.packagecode = claim.packagecode;
        this.sno.mortality = claim.moratlity;
        this.report.push(this.sno);
      }
      let filter = [];
      filter.push([['Actual Date of Discharge From: :- ', this.fromdate]]);
      filter.push([['Todate :- ', this.todate]]);
      filter.push([['State Name :- ', this.stateNamedropdown]]);
      filter.push([['District Name :- ', this.Districtdropdown]]);
      filter.push([['Hospital Details :- ', this.hospitalnamedropdown]]);
      TableUtil.exportListToExcelWithFilterforadmin(this.report, "Mortality Report Details", this.heading, filter);
    } else if (type == 'pdf') {
      if (this.detailsdata.length == 0) {
        this.swal('', 'No Data Found', 'info');
        return;
      }
      let SlNo = 1;
      this.detailsdata.forEach(element => {
        let rowData = [];
        rowData.push(SlNo++);
        rowData.push(element.stateName);
        rowData.push(element.districtName);
        rowData.push(element.hospitalName + '(' + element.hospitalCode + ')');
        rowData.push(element.urn);
        rowData.push(element.patientname);
        rowData.push(element.age);
        rowData.push(this.dateconvert(element.actualdateofAdmission));
        rowData.push(this.dateconvert(element.actualdateofDischarge));
        rowData.push(element.packagename);
        rowData.push(element.packagecode);
        rowData.push(element.moratlity);
        this.report.push(rowData);
      });
      let doc = new jsPDF('l', 'mm', [238, 270]);
      doc.setFontSize(10);
      doc.text('Authority Name :-' + this.user.fullName, 5, 5);
      doc.text('Actual Date of Discharge From:-' + this.fromdate, 5, 10);
      doc.text('To:-' + this.todate, 5, 15);
      doc.text('State Name:-' + this.stateNamedropdown, 5, 20);
      doc.text('District Name:-' + this.Districtdropdown, 5, 25);
      doc.text('Hospital Details:-' + this.hospitalnamedropdown, 5, 30);
      doc.text('Document Generate Date :-' + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en').toString(), 5, 35);
      doc.text('Moratality Report Details', 100, 36);
      doc.setLineWidth(0.7);
      doc.line(100, 37, 140, 37);
      autoTable(doc, {
        head: this.heading, body: this.report, startY: 38, theme: 'grid',
        styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
        bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 20 },
          2: { cellWidth: 20 },
          3: { cellWidth: 40 },
          4: { cellWidth: 20 },
          5: { cellWidth: 20 },
          6: { cellWidth: 10 },
          7: { cellWidth: 20 },
          8: { cellWidth: 20 },
          9: { cellWidth: 20 },
          10: { cellWidth: 30 },
          11: { cellWidth: 20 },
        }
      })
      doc.save('Mortality_Report_Details.pdf');
    }
  }
  detailsdata: any = [];
  record: any;
  getdetials() {
    this.cpdpaymentservice.getmoratlitydeta(this.user.userId, this.fromdate, this.todate, this.stateCodeList, this.districtCodeList, this.hospitalCodeList).subscribe((data: any) => {
      if (data.status = 'success') {
        this.detailsdata = data.details;
        console.log(this.detailsdata);
        this.record = this.detailsdata.length;
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
  dateconvert(date: any) {
    var datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'dd-MMM-yyyy');
  }

  TrackingDetails(claim) {
    localStorage.setItem("claimno", claim.claimno)
    localStorage.setItem("caseno", claim.caseno)
    localStorage.setItem("hopitalclmcaseno", claim.hospitlcaseno);
    if(this.user.groupId ==6){
      localStorage.setItem("hidedocs","hidedocs");
    }
    let state = {
      txnid: claim.transactiondetailsid,
      authcode: claim.authorizedcode,
      hospitalcode: claim.hospitalcode,
      urn: claim.urn
    }
    console.log(state);
    localStorage.setItem("history", JSON.stringify(state));
    localStorage.setItem("token", this.jwtService.getJwtToken())
    this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/dischargelistHistoryHospital'); });
  }
}
