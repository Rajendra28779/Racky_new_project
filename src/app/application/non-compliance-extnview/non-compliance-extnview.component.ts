import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { HeaderService } from '../header.service';
import { PendingService } from '../pending.service';
import { TableUtil } from '../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-non-compliance-extnview',
  templateUrl: './non-compliance-extnview.component.html',
  styleUrls: ['./non-compliance-extnview.component.scss']
})
export class NonComplianceExtnviewComponent implements OnInit {
  txtsearchDate: any;
  list: any = [];
  actionId: any = "";
  user: any;
  userid: any = "";
  groupid: any;
  showPegi: any;
  pageElement: any;
  currentPage: any;
  action: any

  constructor(private pendingService: PendingService, public headerService: HeaderService, private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.user = this.sessionService.decryptSessionData("user");
    this.headerService.setTitle('Extension Of NonCompliance View');
    this.userid = this.user.userId
    this.groupid = this.user.groupId
    if (this.groupid != 1) {
      this.userid = this.user.userId;
    }
  }

  Search() {
    if (this.actionId == '' || this.actionId == null) {
      this.swal('', ' Please Select Non-Compliance Type', 'error');
      return;
    }
    this.pendingService.getNonComplianceExtensionview(this.actionId, this.userid).subscribe((data: any) => {
      this.list = data;
      this.currentPage = 1;
      this.pageElement = 50;
      this.showPegi = true;
    },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      }
    );
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
  }

  ResetField() {
    this.actionId = ""
  }

  report: any = [];
  sno: any = {
    Slno: "",
    urn: "",
    hospital: "",
    pname: "",
    doa: "",
    dod: "",
    amount: "",
    pkgid: "",
    pkgname: "",
    lastclmby: "",
    crtclmby: "",
    extendby: "",
    exton: ""
  };

  heading = [["Sl No.", "URN", "Hospital Name", "Patient Name", "Actual Date Of Admission", "Actual Date Of Discharge", "Amount(₹)", "Package ID", "Package Name", "Last Claim By", "Current Claim By", "Extended By", "Extended On"]];
  downloadList(no: any) {
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy = this.sessionService.decryptSessionData("user").fullName;
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.list.length; i++) {
      sna = this.list[i];
      this.sno = [];
      this.sno.Slno = i + 1;
      this.sno.urn = sna.urn;
      this.sno.hospital = sna.hname;
      this.sno.pname = sna.patientName;
      this.sno.doa = sna.actualDateOfAdmission;
      this.sno.dod = sna.actualDateOfDischarge;
      this.sno.amount = sna.currentTotalAmount;
      this.sno.pkgid = sna.packageCode;
      this.sno.pkgname = sna.packageName;
      this.sno.lastclmby = sna.lastclaimby;
      this.sno.crtclmby = sna.currentclaimby;
      this.sno.extendby = sna.extendedby;
      this.sno.exton = sna.extendedon;
      this.report.push(this.sno);
    }
    if (this.actionId == 1) {
      this.action = "Non-Uploading Initial Document";
    } else {
      this.action = "Non-compliance of Query SNA";
    }
    if (no == 1) {
      let filter = [];
      filter.push([['Non-Compliance Type', this.action]]);
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'Extension Of NonCompliance Report',
        this.heading, filter
      );
    } else {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('l', 'mm', [350, 210]);
      doc.setFontSize(20);
      doc.text("Extension Of NonCompliance Report", 120, 15);
      doc.setFontSize(15);
      doc.text('Non-Compliance Type :- ' + this.action, 10, 25);
      doc.text('GeneratedOn :- ' + generatedOn, 230, 33);
      doc.text('GeneratedBy :- ' + generatedBy, 10, 33);
      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.Slno;
        pdf[1] = clm.urn;
        pdf[2] = clm.hospital;
        pdf[3] = clm.pname;
        pdf[4] = clm.doa;
        pdf[5] = clm.dod;
        pdf[6] = clm.amount;
        pdf[7] = clm.pkgid;
        pdf[8] = clm.pkgname;
        pdf[9] = clm.lastclmby;
        pdf[10] = clm.crtclmby;
        pdf[11] = clm.extendby;
        pdf[12] = clm.exton;
        rows.push(pdf);
      }
      autoTable(doc, {
        head: this.heading,
        body: rows,
        theme: 'grid',
        startY: 40,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },
        }
      });
      doc.save('Extension Of NonCompliance Report.pdf');
    }
  }

  convertDate1(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy');
    return date;
  }
}
