import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service';
import Swal from 'sweetalert2';
import { HeaderService } from '../header.service';
import { OngoingTreatmentReportServiceService } from '../Services/ongoing-treatment-report-service.service';
import { TableUtil } from '../util/TableUtil';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-ongoing-treatment-report',
  templateUrl: './ongoing-treatment-report.component.html',
  styleUrls: ['./ongoing-treatment-report.component.scss']
})
export class OngoingTreatmentReportComponent implements OnInit {
  snareportList: any = [];
  childmessage: any;
  showPegi: boolean;
  record: any;
  currentPage: any;
  pageElement: any;
  urn: any = '';
  user: any;
  userId: any;
  user1: any;
  totalClaimCount: any;
  List: any = [];
  constructor(public headerService: HeaderService,
    private sessionService: SessionStorageService,
    public route: Router,
    public ongoingtreatmentReportservice: OngoingTreatmentReportServiceService) { }

  ngOnInit(): void {
    this.headerService.setTitle('Ongoing Treatment Report');
    this.user = this.sessionService.decryptSessionData("user");
    this.currentPage = 1;
    this.pageElement = 20;
    this.showPegi = false;
    this.timespan = new Date()
  }
  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }

  geturnwisereport() {
    if (this.urn == undefined || this.urn == null || this.urn == '') {
      this.swal('', 'Please enter URN Number.', 'error');
      return;
    }
    let requestData = {
      userId: this.user.userName,
      urn: this.urn,
    };
    this.sessionService.encryptSessionData('requestData', requestData);
    this.ongoingtreatmentReportservice.getUrnList(requestData).subscribe(
      (data) => {
        this.List = data;
        this.totalClaimCount = this.List.length;
        this.record = this.List.length;
        if (this.record > 0) {
          this.showPegi = true;
        } else {
          this.showPegi = false;
          this.swal('', 'No record found.', 'error');
        }
      },
      (error) => {
        this.swal('', 'Something went wrong.', 'error');
      }
    );
  }
  ResetField() {
    sessionStorage.removeItem('requestData');
    window.location.reload();
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
  timespan: any;
  report: any = [];
  sno: any = {
    Slno: '',
    Hospitalname: '',
    Patientname: '',
    URN: '',
    Invoiceno: '',
    ActualDateofAdmission: '',
    Packagecode: '',
    Packagename: '',
    Procedurename: ''
  };
  heading = [
    [
      'Sl#',
      'Hospital Name',
      'Patient Name',
      'URN',
      'Invoice Number',
      'Actual Date Of Admission ',
      'Package Code',
      'Package Name',
      'Procedure Name'
    ],
  ];

  downloadReport(type) {
    this.report = [];
    let claim: any;
    for (var i = 0; i < this.List.length; i++) {
      claim = this.List[i];
      this.sno = [];
      this.sno.Slno = i + 1;
      this.sno.Hospitalname = claim.hospitalname + " (" + claim.hospitalCode + ")";
      this.sno.Patientname = claim.patientname;
      this.sno.URN = claim.urn;
      this.sno.Invoiceno = claim.invoiceno;
      this.sno.ActualDateofAdmission = claim.actualDateOfAdmission;
      this.sno.Packagecode = claim.packagecode;
      this.sno.Packagename = claim.packagename;
      this.sno.Procedurename = claim.procedurename;
      this.report.push(this.sno);
    }
    if (type == 'xcl') {
      let filter = [];
      filter.push([['URN Number:- ', this.urn]]);
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'Ongoing Treatment URN Wise Report',
        this.heading, filter
      );
    }
    else if (type == 'pdf') {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('l', 'mm', [360, 260]);
      doc.text('URN Number : ' + this.urn, 10, 10);
      doc.text('Generated  By :' + this.user.fullName, 10, 20);
      doc.text('Generated On :' + this.convertStringToDate1(this.timespan), 240, 20);
      doc.text("Ongoing Treatment Hospital Wise Report", 160, 30);
      doc.setFontSize(12);
      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.Slno;
        pdf[1] = clm.Hospitalname;
        pdf[2] = clm.Patientname;
        pdf[3] = clm.URN;
        pdf[4] = clm.Invoiceno;
        pdf[5] = clm.ActualDateofAdmission;
        pdf[6] = clm.Packagecode;
        pdf[7] = clm.Packagename;
        pdf[8] = clm.Procedurename;
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
          1: { cellWidth: 53 },
          2: { cellWidth: 53 },
          3: { cellWidth: 53 },
          4: { cellWidth: 53 },
          5: { cellWidth: 53 },
          6: { cellWidth: 53 },
          7: { cellWidth: 53 },
          8: { cellWidth: 53 },
        }
      });
      doc.save('Bsky_Ongoing Treatment Hospital Wise Report.pdf');
    }
  }
  convertStringToDate1(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy HH:mm:ss');
    return date;
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
}
