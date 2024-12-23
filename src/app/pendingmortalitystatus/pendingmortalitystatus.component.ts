import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../application/header.service';
import { PaymentfreezeserviceService } from '../application/Services/paymentfreezeservice.service';
import { SnoCLaimDetailsService } from '../application/Services/sno-claim-details.service';
import { JwtService } from '../services/jwt.service';
import { Router } from '@angular/router';
import { SnocreateserviceService } from '../application/Services/snocreateservice.service';
import { DatePipe, formatDate } from '@angular/common';
import { TableUtil } from '../application/util/TableUtil';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SessionStorageService } from '../services/session-storage.service';

@Component({
  selector: 'app-pendingmortalitystatus',
  templateUrl: './pendingmortalitystatus.component.html',
  styleUrls: ['./pendingmortalitystatus.component.scss']
})
export class PendingmortalitystatusComponent implements OnInit {
  user: any
  mortalityStatus: any;
  userid: any;
  fromdate: any;
  todate: any;
  statecode: any;
  districtcode: any;
  hospitalcode: any;
  mortalitydata: any;
  txtsearchDate: any;
  pageElement: any;
  currentPage: any;
  showPegi: boolean;
  statename: any;
  districtname: any;
  hospitalname: any;
  constructor(public headerService: HeaderService,
    public paymentfreezeService: PaymentfreezeserviceService,
    public snoService: SnoCLaimDetailsService,
    private jwtService: JwtService,
    public route: Router,
    private snoConfigService: SnocreateserviceService, private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.user = this.sessionService.decryptSessionData("user");
    this.mortalityStatus = JSON.parse(localStorage.getItem("moratlitypendingstatus"));
    this.userid = this.mortalityStatus.userId;
    this.fromdate = this.mortalityStatus.fromDate;
    this.todate = this.mortalityStatus.toDate;
    this.statecode = this.mortalityStatus.stateCode != undefined ? this.mortalityStatus.stateCode : '';
    this.districtcode = this.mortalityStatus.distCode != undefined ? this.mortalityStatus.distCode : '';
    this.hospitalcode = this.mortalityStatus.hospitalCode != undefined ? this.mortalityStatus.hospitalCode : '';
    this.statename = this.mortalityStatus.stateName;
    this.districtname = this.mortalityStatus.districtName;
    this.hospitalname = this.mortalityStatus.hospitalName;
    this.getmortalityStatus();
  }
  record: any;

  getmortalityStatus() {
    this.paymentfreezeService.getmortalityStatus(this.userid, this.fromdate, this.todate, this.statecode, this.districtcode, this.hospitalcode).subscribe((res) => {
      console.log(res);
      this.mortalitydata = res;
      this.record = this.mortalitydata.length;
      if (this.record > 0) {
        this.currentPage = 1;
        this.pageElement = 100;
        this.showPegi = true;
      } else {
        this.showPegi = false;
      }
      sessionStorage.removeItem(this.mortalitydata);

    }
    )
  }
  Dateconvert(date) {
    var datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'dd-MM-YYYY');
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  report: any = [];
  sno: any = {
    Slno: '',
    URN: '',
    ClaimNo: '',
    PatientName: '',
    HospitalDetails: '',
    PackageID: '',
    ActualDateofAdmission: '',
    ActualDateofDischarge: '',
    Pendingstatus: ''
  };
  heading = [
    [
      'Sl#',
      'URN',
      'Claim Number',
      'Patient Name',
      'Hospital Details',
      'Package ID',
      'Actual Date of Admission',
      'Actual Date of Discharge',
      'Pending status'
    ],
  ];
  downloadReport(type: any) {

    this.report = [];
    if (type == 'excel') {
      let claim: any;;
      for (var i = 0; i < this.mortalitydata.length; i++) {
        claim = this.mortalitydata[i];
        console.log(claim);
        this.sno = [];
        this.sno.Slno = i + 1;
        this.sno.URN = claim.urn;
        this.sno.ClaimNo = claim.claimno;
        this.sno.PatientName = claim.patientname;
        this.sno.HospitalDetails = claim.hospitalname + '(' + claim.hospitalcode + ')';
        this.sno.PackageID = claim.packagecode;
        this.sno.ActualDateofAdmission = this.Dateconvert(claim.actualdateofadmission);
        this.sno.ActualDateofDischarge = this.Dateconvert(claim.actualdateofdischarge);
        this.sno.Pendingstatus = claim.claimdesc;
        this.report.push(this.sno);
      }
      let filter1 = [];
      filter1.push([['Actual Date of Discharge From:-', this.fromdate]]);
      filter1.push([['Actual Date of Discharge To:-', this.todate]]);
      filter1.push([['State:-', this.statename]]);
      filter1.push([['District:-', this.districtname]]);
      filter1.push([['Hospital:-', this.hospitalname]]);
      TableUtil.exportListToExcelWithFilterforadmin(this.report, 'Pending Mortality Status', this.heading, filter1);
    } else if (type == 'pdf') {
      if (this.mortalitydata.length == 0) {
        this.swal('', 'No Data Found', 'info');
        return;
      }
      let claim: any;
      let SlNo = 1;
      this.mortalitydata.forEach(element => {
        let rowData = [];
        claim = element;
        rowData.push(SlNo);
        rowData.push(claim.urn);
        rowData.push(claim.claimno);
        rowData.push(claim.patientname);
        rowData.push(claim.hospitalname + '(' + claim.hospitalcode + ')');
        rowData.push(claim.packagecode);
        rowData.push(this.Dateconvert(claim.actualdateofadmission));
        rowData.push(this.Dateconvert(claim.actualdateofdischarge));
        rowData.push(claim.claimdesc);
        this.report.push(rowData);
        SlNo++;
      });
      let doc = new jsPDF('l', 'mm', [238, 270]);
      doc.setFontSize(10);
      doc.text('Actual Date of Discharge From:-' + this.fromdate, 5, 5);
      doc.text('Actual Date of Discharge to:-' + this.todate, 5, 10);
      doc.text('State:-' + this.statename, 5, 15);
      doc.text('District:-' + this.districtname, 5, 20);
      doc.text('Hospital:-' + this.hospitalname, 5, 25);
      doc.text('Document Generate Date :-' + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en').toString(), 5, 30);
      doc.text('Pending Mortality Status', 100, 32);
      doc.setLineWidth(0.7);
      autoTable(doc, {
        head: this.heading, body: this.report, startY:35, theme: 'grid',
        styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
        bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
        columnStyles: {
          0: { cellWidth:10},
          1: { cellWidth: 20 },
          2: { cellWidth: 20 },
          3: { cellWidth: 20 },
          4: { cellWidth: 30 },
          5: { cellWidth: 20 },
          6: { cellWidth: 20 },
          7: { cellWidth: 20 },
          8: { cellWidth: 30 },
        }
      })
      doc.save('Pending_Mortality_Status.pdf');
    }
  }
}

