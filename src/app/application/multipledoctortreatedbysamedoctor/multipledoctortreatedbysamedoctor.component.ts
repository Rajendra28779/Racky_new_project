import { Component, OnInit } from '@angular/core';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import { Router } from '@angular/router';
import { UsermanualService } from '../Services/usermanual.service';
import { HeaderService } from '../header.service';
import { TableUtil } from '../util/TableUtil';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import { DatePipe, formatDate } from '@angular/common';
import autoTable from 'jspdf-autotable';
import { JwtService } from 'src/app/services/jwt.service';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-multipledoctortreatedbysamedoctor',
  templateUrl: './multipledoctortreatedbysamedoctor.component.html',
  styleUrls: ['./multipledoctortreatedbysamedoctor.component.scss']
})
export class MultipledoctortreatedbysamedoctorComponent implements OnInit {
  data: any = [];
  txtsearchDate: any;
  currentPage: any;
  pageElement: any;
  record: any;
  showPegi: boolean;
  user: any;
  constructor(public headerService: HeaderService, private snoService: SnocreateserviceService, public router: Router, private usermanualService: UsermanualService, private jwtService: JwtService, private sessionService: SessionStorageService) { }
  ngOnInit(): void {
    this.headerService.setTitle('Multiple Surgery By Same Doctor');
    this.user = this.sessionService.decryptSessionData("user");
    this.currentPage = 1;
    this.pageElement = 50;
    this.getdata();
  }
  getdata() {
    this.usermanualService.getdetailshistorydata().subscribe((data: any) => {
      this.data = data;
      this.record = this.data.length;
      if (this.record > 0) {
        this.showPegi = true;
      } else {
        this.showPegi = false;
      }
    });
  }
  report: any = [];
  sno: any = {
    Slno: "",
    doctorname: "",
    doctorregistrationno: "",
    doctormobilenumber: "",
    sugerydate: "",
  };
  heading = [['Sl#', 'Doctor Name', 'Doctor Registration No.', 'Doctor Mobile No.', 'Surgery Date']];
  downloadReport(type: any) {
    this.report = [];
    if (type == 'excel') {
      let claim: any;
      for (var i = 0; i < this.data.length; i++) {
        claim = this.data[i];
        this.sno = [];
        this.sno.Slno = i + 1;
        this.sno.doctorname = claim.SURGERY_DOCTORNAME;
        this.sno.doctorregistrationno = claim.SURGERY_DOCTOR_REGNO;
        this.sno.doctormobilenumber = claim.surgery_doctor_mobno;
        this.sno.sugerydate = this.Dateconvert(claim.SURGERY_DATETIME);
        this.report.push(this.sno);
      }
      let filter1 = [];
      TableUtil.exportListToExcelWithFilterforhospitals(this.report, "Multiple Surgery By Same Doctor", this.heading, filter1);
    } else if (type == 'pdf') {
      if (this.data.length == 0) {
        this.swal('', 'No Data Found', 'info');
        return;
      }
      let SlNo = 1;
      this.data.forEach(element => {
        let rowData = [];
        rowData.push(SlNo++);
        rowData.push(element.SURGERY_DOCTORNAME);
        rowData.push(element.SURGERY_DOCTOR_REGNO);
        rowData.push(element.surgery_doctor_mobno);
        rowData.push(this.Dateconvert(element.SURGERY_DATETIME));
        this.report.push(rowData);
      });
      let doc = new jsPDF('l', 'mm', [238, 270]);
      doc.setFontSize(10);
      doc.text('Document Generate By :-' + this.user.fullName, 5, 10);
      doc.text('Document Generate Date :-' + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en').toString(), 5, 15);
      doc.text('Multiple Beneficiaries Treated By Same Doctor At Multiple Locations During The Same Period', 50, 20);
      doc.setLineWidth(0.7);
      autoTable(doc, {
        head: this.heading, body: this.report, startY: 22, theme: 'grid',
        styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
        bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: 30 },
          2: { cellWidth: 60 },
          3: { cellWidth: 50 },
          4: { cellWidth: 50 },
        }
      })
      doc.save('Multiple Surgery By Same Doctor.pdf');
    }
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  Dateconvert(date) {
    var datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'dd-MMM-YYYY');
  }
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
  OnDetails(item) {
    localStorage.setItem("claimno", item.CLAIM_NO)
    localStorage.setItem("caseno", item.CASENO)
    localStorage.setItem("hopitalclmcaseno", item.CLAIM_CASE_NO);
    let state = {
      txnid: item.TRANSACTIONDETAILSID,
      authcode: item.AUTHORIZEDCODE,
      hospitalcode: item.HOSPITALCODE,
      urn: item.URN
    }
    localStorage.setItem("history", JSON.stringify(state));
    localStorage.setItem("token", this.jwtService.getJwtToken())
    this.router.navigate([]).then(result => { window.open(environment.routingUrl + '/dischargelistHistoryHospital'); });
  }
  taggedhospital: any = [];
  gettaggedhospital(regno: any) {
    this.taggedhospital = [];
    if (regno != undefined && regno != null && regno != '' && regno != 'N/A') {
      this.usermanualService.gettagggedhospital(regno).subscribe((data: any) => {
        this.taggedhospital = data;
      });
    } else {
      this.taggedhospital = [];
    }
  }
  treatedhistory: any = [];
  getsurgeryhospitalname(regno: any) {
    this.treatedhistory = [];
    if (regno != undefined && regno != null && regno != '' && regno != 'N/A') {
      this.usermanualService.gettreatedHospital(regno).subscribe((data: any) => {
        this.treatedhistory = data;
      });
    } else {
      this.treatedhistory = [];
    }
  }
}
