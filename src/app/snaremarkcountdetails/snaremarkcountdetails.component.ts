import { Component, OnInit } from '@angular/core';
import { SnoCLaimDetailsService } from '../application/Services/sno-claim-details.service';
import { Router } from '@angular/router';
import { JwtService } from '../services/jwt.service';
import { HospitalPackageMappingService } from '../application/Services/hospital-package-mapping.service';
import { SnocreateserviceService } from '../application/Services/snocreateservice.service';
import { HeaderService } from '../application/header.service';
import { TableUtil } from '../application/util/TableUtil';
import Swal from 'sweetalert2';
import { DatePipe, formatDate } from '@angular/common';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-snaremarkcountdetails',
  templateUrl: './snaremarkcountdetails.component.html',
  styleUrls: ['./snaremarkcountdetails.component.scss']
})
export class SnaremarkcountdetailsComponent implements OnInit {
  currentPage: any;
  pageElement: any;
  countremarkdetails: any;
  fromdate: any;
  todate: any;
  statename: any;
  districtname: any;
  hospitalname: any;
  hospitalcodedata: any;
  hospitalnamedata: any;
  totaldischarge: any;
  claimsubmitted: any;
  claimnotsubmitted: any;
  rejectedbysna: any;
  percentageofrejection: any;
  snanames: any;
  remarkid: any;
  hospitalcodeforremark: any;
  statecode: any;
  districtcode: any;
  hospitalcode: any;
  remarkname: any;
  userid: any;
  showPegi: boolean;
  txtsearchDate: any
  remarkwsedetailsdata: any;
  action: any
  constructor(public snoService: SnoCLaimDetailsService,
    public route: Router,
    private jwtService: JwtService,
    private hospitalService: HospitalPackageMappingService,
    private snoServices: SnocreateserviceService,
    public headerService: HeaderService) {
  }
  ngOnInit(): void {
    this.headerService.setTitle('SNA Remark Wise Details');
    this.currentPage = 1;
    this.pageElement = 100;
    this.countremarkdetails = JSON.parse(localStorage.getItem("countdetails"));
    this.fromdate = this.countremarkdetails.fromdateremarks;
    this.todate = this.countremarkdetails.todateremarks;
    this.statename = this.countremarkdetails.statenameremarks;
    this.districtname = this.countremarkdetails.districtnameremarks;
    this.hospitalname = this.countremarkdetails.hospitalnameremarks;
    this.hospitalcodedata = this.countremarkdetails.hospitalcoderemarks;
    this.hospitalnamedata = this.countremarkdetails.hospitalnamedataremarks;
    this.totaldischarge = this.countremarkdetails.totaldischargeremarks;
    this.claimsubmitted = this.countremarkdetails.claimsubmittedremarks;
    this.claimnotsubmitted = this.countremarkdetails.claimnotsubmittedremarks;
    this.rejectedbysna = this.countremarkdetails.rejectedbysnaremarks;
    this.percentageofrejection = this.countremarkdetails.percentageofrejectionremarks;
    this.remarkwsedetailsdata = this.countremarkdetails.remarkwsedetailsremarks;
    this.snanames = this.countremarkdetails.snanamesremarks;
    this.remarkid = this.countremarkdetails.remarkid;
    this.hospitalcodeforremark = this.countremarkdetails.hospitalcodeforremark;
    this.statecode = this.countremarkdetails.statecode;
    this.districtcode = this.countremarkdetails.distcode;
    this.hospitalcode = this.countremarkdetails.hospitalcode;
    this.remarkname = this.countremarkdetails.remarkname;
    this.userid = this.countremarkdetails.snauserid;
    this.action = this.countremarkdetails.action;
    this.getcountremarkdetails();
  }
  record: any
  length: any;
  remarkwsedetails: any = [];
  getcountremarkdetails() {
    if (this.action == "SNA") {
      this.snoService.getcountremarkforsnactiondetails(this.userid, this.fromdate, this.todate, this.statecode, this.districtcode
        , this.hospitalcode, this.remarkid, this.hospitalcodeforremark).subscribe((data: any) => {
          this.record = data;
          this.remarkwsedetails = this.record;
          this.length = this.remarkwsedetails.length;
          if (this.length > 0) {
            this.showPegi = true;
          }
          else {
            this.showPegi = false;
          }
          localStorage.removeItem("countdetails");
        })
    }
    if (this.action == "Admin") {
      this.snoService.getcountremarkdetails(this.userid, this.fromdate, this.todate, this.statecode, this.districtcode
        , this.hospitalcode, this.remarkid, this.hospitalcodeforremark).subscribe((data: any) => {
          this.record = data;
          this.remarkwsedetails = this.record;
          this.length = this.remarkwsedetails.length;
          if (this.length > 0) {
            this.showPegi = true;
          }
          else {
            this.showPegi = false;
          }
          localStorage.removeItem("countdetails");
        })
    }
  }
  report: any = [];
  sno: any = {
    slno: "",
    claimno: "",
    urn: "",
    patientname: "",
    hospitaldetails: "",
    actualdateofadmission: "",
    actuladaateofdischarge: "",
  };
  heading = [['Sl#', 'Claim No', 'URN', 'Patient Name', 'Hospital Details', 'Actual Date of Admission', 'Actual Date of Discharge']];
  downloadReport(type: any) {
    this.report = [];
    if (type == 'excel') {
      let claim: any;
      for (var i = 0; i < this.remarkwsedetails.length; i++) {
        claim = this.remarkwsedetails[i];
        this.sno = [];
        this.sno.slno = i + 1;
        this.sno.claimno = claim.claimno;
        this.sno.urn = claim.urn;
        this.sno.patientname = claim.patientname;
        this.sno.hospitaldetails = claim.hospitalname + '(' + claim.hospitalcode + ')';
        this.sno.actualdateofadmission = this.Dateconvert(claim.actualdateofadmission);
        this.sno.actuladaateofdischarge = this.Dateconvert(claim.actualdateofdischarge);
        this.report.push(this.sno);
      }
      let filter = [];
      filter.push([['Actual Date of Discharge From', this.fromdate]]);
      filter.push([['Actual Date of Discharge To', this.todate]]);
      filter.push([['State Name', this.statename]]);
      filter.push([['District Name', this.districtname]]);
      filter.push([['Hospital Name', this.hospitalname]]);
      filter.push([['SNA Doctor Name', this.snanames]]);
      filter.push([['Hospitaldetails', this.hospitalnamedata + '(' + this.hospitalcodedata + ')']]);
      filter.push([['Total Discharge', this.totaldischarge]]);
      filter.push([['Claim Submitted', this.claimsubmitted]]);
      filter.push([['Claim Not Submitted', this.claimnotsubmitted]]);
      filter.push([['Rejected By SNA', this.rejectedbysna]]);
      filter.push([['Percentage of Rejection', this.percentageofrejection]]);
      filter.push([['Remark Name', this.remarkname]]);
      TableUtil.exportListToExcelWithFilter(this.report, 'SNA Remark Wise Count Details', this.heading, filter);
      this.report = [];
    }
  }
  report1: any = [];
  sno1: any = {
    slno: "",
    claimno: "",
    urn: "",
    patientname: "",
    hospitaldetails: "",
    actualdateofadmission: "",
    actuladaateofdischarge: "",
  };
  heading1 = [['Sl#', 'Claim No', 'URN', 'Patient Name', 'Hospital Details', 'Actual Date of Admission', 'Actual Date of Discharge']];
  downloadReportpdf(type: any) {
    if (type == 'pdf') {
      if (this.remarkwsedetails.length == 0) {
        this.swal('', 'No Data Found', 'info');
        return;
      }
    }
    let SlNo = 1;
    this.remarkwsedetails.forEach(element => {
      let rowData = [];
      rowData.push(SlNo);
      rowData.push(element.claimno);
      rowData.push(element.urn);
      rowData.push(element.patientname);
      rowData.push(element.hospitalname + '(' + element.hospitalcode + ')');
      rowData.push(this.Dateconvert(element.actualdateofadmission));
      rowData.push(this.Dateconvert(element.actualdateofdischarge));
      this.report1.push(rowData);
      SlNo++;
    }
    );
    let doc = new jsPDF('l', 'mm', [250, 270]);
    doc.setFontSize(10);
    doc.text('Actual Date of Discharge From :-' + this.fromdate, 5, 15);
    doc.text('Actual Date of Discharge To :-' + this.todate, 5, 20);
    doc.text('State Name :-' + this.statename, 5, 25);
    doc.text('District Name :-' + this.districtname, 5, 30);
    doc.text('Hospital Name :-' + this.hospitalname, 5, 35);
    doc.text('SNA Doctor Name :-' + this.snanames, 5, 40);
    doc.text('Total Discharge :-' + this.totaldischarge, 5, 45);
    doc.text('Claim Submitted :-' + this.claimsubmitted, 5, 50);
    doc.text('Claim Not Submitted :-' + this.claimnotsubmitted, 5, 55);
    doc.text('Rejected By SNA :-' + this.rejectedbysna + '%', 5, 60);
    doc.text('Percentage of Rejection :-' + this.percentageofrejection, 5, 65);
    doc.text('Remark Name :-' + this.remarkname, 5, 70);
    doc.text('Document Generate Date :-' + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en').toString(), 5, 75);
    doc.setLineWidth(0.7);
    autoTable(doc, {
      head: this.heading, body: this.report1, startY: 77, theme: 'grid',
      styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
      bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
      headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
      columnStyles: {
        0: { cellWidth: 30 },
      }
    })
    doc.save('SNA Remark Wise Count Details.pdf');
    this.report1 = [];
  }
  getcountDetails(urn: any, transactionid: any, claimid: any, hospitalcode: any, actualdateofadmission: any) {
    localStorage.setItem("urn", urn)
    localStorage.setItem("transactionId", transactionid)
    localStorage.setItem("hospitalCode", hospitalcode);
    localStorage.setItem("claimId", claimid);
    localStorage.setItem("actualDateAdmission", actualdateofadmission);
    this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/urnwiseactionreportsdetails'); });
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  Dateconvert(date) {
    var datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'dd-MMM-yyyy');
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
}
