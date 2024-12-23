import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../application/header.service';
import { SnoCLaimDetailsService } from '../application/Services/sno-claim-details.service';
import { Router } from '@angular/router';
import { HospitalPackageMappingService } from '../application/Services/hospital-package-mapping.service';
import { SnocreateserviceService } from '../application/Services/snocreateservice.service';
import { TableUtil } from '../application/util/TableUtil';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import { formatDate } from '@angular/common';
import autoTable from 'jspdf-autotable';
import { JwtService } from '../services/jwt.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-snarejectiondetails',
  templateUrl: './snarejectiondetails.component.html',
  styleUrls: ['./snarejectiondetails.component.scss']
})
export class SnarejectiondetailsComponent implements OnInit {
  snarejecteddetails: any;
  snaactiondetails: any
  showPegi: boolean;
  txtsearchDate: any;
  pageElement: any;
  currentPage: any;
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
  remarkwsedetails: any;
  snanames: any;
  snaaction: any;
  action: any;
  detailshidesnaaction: boolean = false;
  detailshidesnarejection: boolean = false;
  fromdatesnaction: any;
  todatesnaction: any;
  statenamesnaction: any;
  districtnamesnaaction: any;
  hospitalnamesnaaction: any;
  hospitalcodedatasnaaction: any;
  hospitalnamedatasnaction: any;
  totaldischargesnaction: any;
  claimsubmittedsnaction: any;
  claimnotsubmittedsnaction: any;
  snaactionsnaction: any;
  snaactionpercentagesnaction: any;
  remarkwsedetailssnaction: any;
  snanamessnaction: any;
  actionsnaction: any;
  snaactionpercentage: any;
  constructor(public headerService: HeaderService,
    public snoService: SnoCLaimDetailsService,
    public route: Router,
    private jwtService: JwtService,
    private hospitalService: HospitalPackageMappingService,
    private snoServices: SnocreateserviceService) { }
  ngOnInit(): void {
    this.headerService.setTitle('SNA Remark Wise Details');
    this.currentPage = 1;
    this.pageElement = 100;
    this.snaactiondetails = JSON.parse(localStorage.getItem("snaction"));
    this.snarejecteddetails = JSON.parse(localStorage.getItem("snarejection"));
    if (this.snaactiondetails != null || this.snaactiondetails != undefined) {
      if (this.snaactiondetails.action == "SNA") {
        this.fromdatesnaction = this.snaactiondetails.fromdate;
        this.todatesnaction = this.snaactiondetails.todate;
        this.statenamesnaction = this.snaactiondetails.statename != undefined ? this.snaactiondetails.statename : "All";
        this.districtnamesnaaction = this.snaactiondetails.districtname != undefined ? this.snaactiondetails.districtname : "All";
        this.hospitalnamesnaaction = this.snaactiondetails.hospitalnamesna != undefined ? this.snaactiondetails.hospitalnamesna : "All";
        this.hospitalcodedatasnaaction = this.snaactiondetails.hospitalcode;
        this.hospitalnamedatasnaction = this.snaactiondetails.hospitalname;
        this.totaldischargesnaction = this.snaactiondetails.totaldischarge;
        this.claimsubmittedsnaction = this.snaactiondetails.claimsubmitted;
        this.claimnotsubmittedsnaction = this.snaactiondetails.claimnotsubmitted;
        this.snaactionsnaction = this.snaactiondetails.snaaction;
        this.snaactionpercentagesnaction = this.snaactiondetails.snaactionpercentage;
        this.remarkwsedetailssnaction = this.snaactiondetails.remarkwisedetails;
        this.snanamessnaction = this.snaactiondetails.snaName;
        this.actionsnaction = this.snaactiondetails.action;
        this.getSnaremarkwisedetails();
      }
    }

    if (this.snarejecteddetails != null || this.snarejecteddetails != undefined) {
      if (this.snarejecteddetails.action == "Admin") {
        // this.snarejecteddetails = JSON.parse(localStorage.getItem("snarejection"));
        this.fromdate = this.snarejecteddetails.fromdate;
        this.todate = this.snarejecteddetails.todate;
        this.statename = this.snarejecteddetails.statename != undefined ? this.snarejecteddetails.statename : "All";
        this.districtname = this.snarejecteddetails.districtname != undefined ? this.snarejecteddetails.districtname : "All";
        this.hospitalname = this.snarejecteddetails.hospitalnamesna != undefined ? this.snarejecteddetails.hospitalnamesna : "All";
        this.hospitalcodedata = this.snarejecteddetails.hospitalcode;
        this.hospitalnamedata = this.snarejecteddetails.hospitalname;
        this.totaldischarge = this.snarejecteddetails.totaldischarge;
        this.claimsubmitted = this.snarejecteddetails.claimsubmitted;
        this.claimnotsubmitted = this.snarejecteddetails.claimnotsubmitted;
        this.rejectedbysna = this.snarejecteddetails.snarejected;
        this.percentageofrejection = this.snarejecteddetails.snarejectionpercentage;
        this.remarkwsedetails = this.snarejecteddetails.remarkwisedetails;
        this.snanames = this.snarejecteddetails.snaName;
        this.action = this.snarejecteddetails.action;
        this.getSnaremarkwisedetails();
      }
    }
  }
  record: any;
  length: any;
  remarkdeetails: any = [];
  getSnaremarkwisedetails() {
    if (this.snaactiondetails != null || this.snaactiondetails != undefined) {
      if (this.snaactiondetails.action == "SNA") {
        this.snoService.getActionremarkdetails(this.snaactiondetails.snaid, this.snaactiondetails.fromdate
          , this.snaactiondetails.todate, this.snaactiondetails.hospitalcode, this.snaactiondetails.stateode, this.snaactiondetails.distcode)
          .subscribe((data: any) => {
            console.log(data);
            this.record = data;
            this.remarkdeetails = this.record;
            this.length = this.remarkdeetails.length;
            if (this.length > 0) {
              this.showPegi = true;
              this.detailshidesnaaction = true;
            } else {
              this.showPegi = false;
            }
            localStorage.removeItem("snaction");
          }
          );
      }
    }
    if (this.snarejecteddetails != null || this.snarejecteddetails != undefined) {
      if (this.snarejecteddetails.action == "Admin") {
        this.snoService.getremarkdetails(this.snarejecteddetails.snaid, this.snarejecteddetails.fromdate
          , this.snarejecteddetails.todate, this.snarejecteddetails.hospitalcode, this.snarejecteddetails.stateode, this.snarejecteddetails.distcode)
          .subscribe((data: any) => {
            console.log(data);
            this.record = data;
            this.remarkdeetails = this.record;
            this.length = this.remarkdeetails.length;
            if (this.length > 0) {
              this.showPegi = true;
              this.detailshidesnarejection = true;
            } else {
              this.showPegi = false;
            }
            localStorage.removeItem("snarejection");
          }
          );
      }
    }
  }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
  report: any = [];
  sno: any = {
    slno: "",
    Remarkname: "",
    remarkcount: "",
  };
  heading = [['Sl#', 'Remark', 'Remark Details']];
  downloadReport(type: any) {
    this.report = [];
    if (type == 'excel') {
      let claim: any;
      for (var i = 0; i < this.remarkdeetails.length; i++) {
        claim = this.remarkdeetails[i];
        this.sno = [];
        this.sno.slno = i + 1;
        this.sno.Remarkname = claim.remarkname;
        this.sno.remarkcount = claim.remarkcount;
        this.report.push(this.sno);
      }
      if (this.snarejecteddetails != null || this.snarejecteddetails != undefined) {
        if (this.snarejecteddetails.action == "Admin") {
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
          filter.push([['Percentage of Rejection', this.percentageofrejection + '%']]);
          filter.push([['Remark Wise Details', this.remarkwsedetails]]);
          TableUtil.exportListToExcelWithFilter(this.report, 'SNA Remark Wise Details', this.heading, filter);
          this.report = [];
        }
      }
      if (this.snaactiondetails != null || this.snaactiondetails != undefined) {
        if (this.snaactiondetails.action == "SNA") {
          let filter = [];
          filter.push([['Actual Date of Discharge From', this.fromdatesnaction]]);
          filter.push([['Actual Date of Discharge To', this.todatesnaction]]);
          filter.push([['State Name', this.statenamesnaction]]);
          filter.push([['District Name', this.districtnamesnaaction]]);
          filter.push([['Hospital Name', this.hospitalnamesnaaction]]);
          filter.push([['SNA Doctor Name', this.snanamessnaction]]);
          filter.push([['Hospitaldetails', this.hospitalnamedatasnaction + '(' + this.hospitalcodedatasnaaction + ')']]);
          filter.push([['Total Discharge', this.totaldischargesnaction]]);
          filter.push([['Claim Submitted', this.claimsubmittedsnaction]]);
          filter.push([['Claim Not Submitted', this.claimnotsubmittedsnaction]]);
          filter.push([['SNA Action', this.snaactionsnaction]]);
          filter.push([['Percentage of Action', this.snaactionpercentagesnaction + '%']]);
          filter.push([['Remark Wise Details', this.remarkwsedetailssnaction]]);
          TableUtil.exportListToExcelWithFilter(this.report, 'SNA Remark Wise Details', this.heading, filter);
          this.report = [];
        }
      }
    }
  }
  reportpdf: any = [];
  snos: any = {
    slno: "",
    Remarkname: "",
    remarkcount: "",
  };
  heading1 = [['Sl#', 'Remark', 'Remark Details']];
  downloadReportpdf(type: any) {
    if (this.remarkdeetails.length == 0) {
      this.swal('', 'No Data Found', 'info');
      return;
    }
    let SlNo = 1;
    this.remarkdeetails.forEach(element => {
      let rowData = [];
      rowData.push(SlNo);
      rowData.push(element.remarkname);
      rowData.push(element.remarkcount);
      this.reportpdf.push(rowData);
      SlNo++;
    });
    let doc = new jsPDF('l', 'mm', [250, 270]);
    if (this.snarejecteddetails != null || this.snarejecteddetails != undefined) {
      if (this.snarejecteddetails.action == "Admin") {
        doc.setFontSize(10);
        doc.text('Actual Date of Discharge From :-' + this.fromdate, 5, 10);
        doc.text('Actual Date of Discharge To :-' + this.todate, 5, 15);
        doc.text('State Name :-' + this.statename, 5, 20);
        doc.text('District Name :-' + this.districtname, 5, 25);
        doc.text('Hospital Name :-' + this.hospitalname, 5, 30);
        doc.text('SNA Doctor Name :-' + this.snanames, 5, 35);
        doc.text('Total Discharge :-' + this.totaldischarge, 5, 40);
        doc.text('Claim Submitted :-' + this.claimsubmitted, 5, 45);
        doc.text('Claim Not Submitted :-' + this.claimnotsubmitted, 5, 50);
        doc.text('Rejected By SNA :-' + this.rejectedbysna, 5, 55);
        doc.text('Percentage of Rejection :-' + this.percentageofrejection, 5, 60);
        doc.text('Remark Wise Details :-' + this.remarkwsedetails, 5, 65);
        doc.text('Hospital Details :-' + this.hospitalnamedata + '(' + this.hospitalcodedata + ')', 5, 70);
        doc.text('Document Generate Date :-' + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en').toString(), 5, 75);
      }
    }
    if (this.snaactiondetails != null || this.snaactiondetails != undefined) {
      if (this.snaactiondetails.action == "SNA") {
        doc.setFontSize(10);
        doc.text('Actual Date of Discharge From :-' + this.fromdatesnaction, 5, 10);
        doc.text('Actual Date of Discharge To :-' + this.todatesnaction, 5, 15);
        doc.text('State Name :-' + this.statenamesnaction, 5, 20);
        doc.text('District Name :-' + this.districtnamesnaaction, 5, 25);
        doc.text('Hospital Name :-' + this.hospitalnamesnaaction, 5, 30);
        doc.text('SNA Doctor Name :-' + this.snanamessnaction, 5, 35);
        doc.text('Total Discharge :-' + this.totaldischargesnaction, 5, 40);
        doc.text('Claim Submitted :-' + this.claimsubmittedsnaction, 5, 45);
        doc.text('Claim Not Submitted :-' + this.claimnotsubmittedsnaction, 5, 50);
        doc.text('SNA Action :-' + this.snaactionsnaction, 5, 55);
        doc.text('Percentage of Action :-' + this.snaactionpercentagesnaction, 5, 60);
        doc.text('Remark Wise Details :-' + this.remarkwsedetailssnaction, 5, 65);
        doc.text('Hospital Details :-' + this.hospitalnamedatasnaction + '(' + this.hospitalcodedatasnaaction + ')', 5, 70);
        doc.text('Document Generate Date :-' + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en').toString(), 5, 75);
      }
    }
    doc.setLineWidth(0.7);
    autoTable(doc, {
      head: this.heading1, body: this.reportpdf, startY: 77, theme: 'grid',
      styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
      bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
      headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
      columnStyles: {
        0: { cellWidth: 30 },
      }
    })
    doc.save('SNA Remark Wise Details.pdf');
    this.reportpdf = [];
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  getremarkdetails(remarkid: any, remarkname: any) {
    if (this.snarejecteddetails != null || this.snarejecteddetails != undefined) {
      if (this.snarejecteddetails.action == "Admin") {
        let state = {
          fromdateremarks: this.fromdate,
          todateremarks: this.todate,
          statenameremarks: this.statename,
          districtnameremarks: this.districtname,
          hospitalnameremarks: this.hospitalname,
          hospitalcoderemarks: this.hospitalcodedata,
          hospitalnamedataremarks: this.hospitalnamedata,
          totaldischargeremarks: this.totaldischarge,
          claimsubmittedremarks: this.claimsubmitted,
          claimnotsubmittedremarks: this.claimnotsubmitted,
          rejectedbysnaremarks: this.rejectedbysna,
          percentageofrejectionremarks: this.percentageofrejection,
          remarkwsedetailsremarks: this.remarkwsedetails,
          snanamesremarks: this.snanames,
          remarkid: remarkid,
          hospitalcodeforremark: this.hospitalcodedata,
          statecode: this.snarejecteddetails.stateode,
          distcode: this.snarejecteddetails.distcode,
          hospitalcode: this.snarejecteddetails.hospitalcode,
          remarkname: remarkname,
          snauserid: this.snarejecteddetails.snaid,
          action: "Admin"
        }
        localStorage.setItem("countdetails", JSON.stringify(state));
        localStorage.setItem("token", this.jwtService.getJwtToken());
        this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/SNARemarkcountdetails'); });
      }
    }
    if (this.snaactiondetails != null || this.snaactiondetails != undefined) {
      if (this.snaactiondetails.action == "SNA") {
        let state = {
          fromdateremarks: this.fromdatesnaction,
          todateremarks: this.todatesnaction,
          statenameremarks: this.statenamesnaction,
          districtnameremarks: this.districtnamesnaaction,
          hospitalnameremarks: this.hospitalnamesnaaction,
          hospitalcoderemarks: this.hospitalcodedatasnaaction,
          hospitalnamedataremarks: this.hospitalnamedatasnaction,
          totaldischargeremarks: this.totaldischargesnaction,
          claimsubmittedremarks: this.claimsubmittedsnaction,
          claimnotsubmittedremarks: this.claimnotsubmittedsnaction,
          rejectedbysnaremarks: this.snaactionsnaction,
          percentageofrejectionremarks: this.snaactionpercentagesnaction,
          remarkwsedetailsremarks: this.remarkwsedetailssnaction,
          snanamesremarks: this.snanamessnaction,
          remarkid: remarkid,
          hospitalcodeforremark: this.hospitalcodedatasnaaction,
          statecode: this.snaactiondetails.stateode,
          distcode: this.snaactiondetails.distcode,
          hospitalcode: this.snaactiondetails.hospitalcode,
          remarkname: remarkname,
          snauserid: this.snaactiondetails.snaid,
          action: "SNA"
        }
        localStorage.setItem("countdetails", JSON.stringify(state));
        localStorage.setItem("token", this.jwtService.getJwtToken());
        this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/SNARemarkcountdetails'); });
      }
    }
  }
}
