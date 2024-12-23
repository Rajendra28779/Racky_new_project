import { Component, OnInit } from '@angular/core';
import { ClaimRaiseServiceService } from '../../Services/claim-raise-service.service';
import { HeaderService } from '../../header.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { Router } from '@angular/router';
import { PackageDetailsMasterService } from '../../Services/package-details-master.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import Swal from 'sweetalert2';
import { TableUtil } from '../../util/TableUtil';
import jsPDF from 'jspdf';
import { formatDate } from '@angular/common';
import autoTable from 'jspdf-autotable';
declare let $: any;

@Component({
  selector: 'app-newfreshraisclaimed',
  templateUrl: './newfreshraisclaimed.component.html',
  styleUrls: ['./newfreshraisclaimed.component.scss']
})
export class NewfreshraisclaimedComponent implements OnInit {
  schemeidvalue: any
  schemeName: any
  currentPage: any;
  pageElement: any;
  currentPagenNum: any;
  newclaimlist: any = [];
  showPegi: boolean;
  txtsearchDate: any;
  user: any;
  hospitalCode: any;
  fromDate: any;
  toDate: any;
  urn: any;
  caseNo: any;
  schemeId: any;
  schemeCategoryId: any;
  record: any;
  constructor(private LoginServ: ClaimRaiseServiceService, public router: Router, private headerService: HeaderService,
    private sessionService: SessionStorageService, private encryptionService: EncryptionService, public packageDetailsMasterService: PackageDetailsMasterService) { }

  ngOnInit(): void {
    this.headerService.setTitle('Casewise Hospital Claimraise');
    this.currentPage = 1;
    this.pageElement = 50;
    this.getSchemeData();
    $('.selectpicker').selectpicker();
    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      maxDate: new Date(),
      daysOfWeekDisabled: ['', 7],
    });
    $('.timepicker').datetimepicker({
      format: 'LT',
      daysOfWeekDisabled: ['', 7],
    });
    $('.datetimepicker').datetimepicker({
      format: 'DD-MMM-YYYY LT',
      daysOfWeekDisabled: ['', 7],
    });
    let month: any
    var date = new Date();
    let year = date.getFullYear();
    let date1 = '01';
    if (date.getMonth() == 0) {
      year = year - 1;
      month = 11;
    } else {
      month = date.getMonth() - 1;
    }
    if (month == 0) {
      month = 'Jan';
    } else if (month == 1) {
      month = 'Feb';
    } else if (month == 2) {
      month = 'Mar';
    } else if (month == 3) {
      month = 'Apr';
    } else if (month == 4) {
      month = 'May';
    } else if (month == 5) {
      month = 'Jun';
    } else if (month == 6) {
      month = 'Jul';
    } else if (month == 7) {
      month = 'Aug';
    } else if (month == 8) {
      month = 'Sep';
    } else if (month == 9) {
      month = 'Oct';
    } else if (month == 10) {
      month = 'Nov';
    } else if (month == 11) {
      month = 'Dec';
    }
    var frstDay = date1 + "-" + month + "-" + year;
    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr("placeholder", "From Date *");
    $('input[name="toDate"]').attr("placeholder", "To Date *");
    this.getnewClaimDetails();
  }

  getnewClaimDetails() {
    this.user = this.sessionService.decryptSessionData("user");
    this.hospitalCode = this.user.userName;
    this.fromDate = $('#datepicker4').val();
    this.toDate = $('#datepicker3').val();
    this.urn = $('#URNnumber').val() || '';
    this.caseNo = $('#case').val() || '';
    this.schemeId = this.schemeidvalue || '1';
    this.schemeCategoryId = this.schemecategoryidvalue || '';

   

    // Validation for Case Number format
    if (this.caseNo && !this.caseNo.startsWith("CASE")) {
      this.swal('', 'Provide Valid Case Number must start with "CASE".', 'error');
      return;
    }

    // Validation for date range
    if (Date.parse(this.fromDate) > Date.parse(this.toDate)) {
      this.swal('', 'Actual Date of Discharge From should be less than Actual Date of Discharge To.', 'error');
      return;
    }
    this.LoginServ.getnewClaimList(this.hospitalCode, this.fromDate, this.toDate, this.urn, this.caseNo, this.schemeId, this.schemeCategoryId)
      .subscribe({
        next: (response: any) => {
          if (response && response.status === 200 && response.data) {
            this.newclaimlist = response.data;
            this.record = this.newclaimlist.length;
            this.showPegi = this.record > 0;
          } else {
            this.newclaimlist = [];
            this.swal('', 'No Data Found', 'info');
            this.showPegi = false;
          }
        },
        error: () => {
          this.swal('', 'Something went wrong.', 'error');
        }
      });

  }

  getRestdata() {
    window.location.reload();
  }


  ///scheme
  scheme: any = [];
  getSchemeData() {
    let data = {
      action: 'A',
      schemeId: 1,
      schemeCategoryId: '',
    };
    let encData = this.encryptionService.encryptRequest(data);
    this.packageDetailsMasterService.getSchemeDetails(encData).subscribe((res: any) => {
      let resData = this.encryptionService.getDecryptedData(res);
      if (resData.status == 'success') {
        this.scheme = resData.data;
        for (let i = 0; i < this.scheme.length; i++) {
          this.schemeidvalue = this.scheme[i].schemeId;
          this.schemeName = this.scheme[i].schemeName;
        }
        this.getSchemeDetails();
      } else {
        this.swal('', 'Something went wrong.', 'error');

      }
    },
      (error) => {
        this.swal('', 'Something went wrong.', 'error');
      });
  }

  schemeList: any = [];
  getSchemeDetails() {
    let data = {
      action: 'B',
      schemeId: 1,
      schemeCategoryId: '',
    };
    let encData = this.encryptionService.encryptRequest(data);
    this.packageDetailsMasterService.getSchemeDetails(encData).subscribe((res: any) => {
      let resData = this.encryptionService.getDecryptedData(res);
      if (resData.status == 'success') {
        this.schemeList = resData.data;
      } else {
        this.swal('', 'Something went wrong.', 'error');

      }
    },
      (error) => {
        this.swal('', 'Something went wrong.', 'error');
      });
  }

  schemecategoryidvalue: any
  schemecategoryName: any;
  getschemacategoryid(event: any) {
    if (event != null && event != undefined && event != '' && event != "") {
      for (let i = 0; i < this.schemeList.length; i++) {
        if (event == this.schemeList[i].schemeCategoryId)
          this.schemecategoryidvalue = this.schemeList[i].schemeCategoryId;
        this.schemecategoryName = this.schemeList[i].categoryName;
      }
    } else {
      this.schemecategoryidvalue = '';
      this.schemecategoryName = "All"
    }
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  keyFunc1(e) {
    const invalidChars = new Set(["@", "(", ")", " ", "-", "_", ".", "!", "#", "$", "^", "&", "*", "=", "+", "?", ":", ";", "'", '"', "}", "{", "]", "[", "|", "\\", "%", ","]);
    if (invalidChars.has(e.value[0])) {
      $('#case').val('');
    }
  }

  // traverseToRequiredPage() {
  //   if (this.currentPagenNum != null && this.currentPagenNum != undefined && JSON.parse(localStorage.getItem("status")) == "true") {
  //     this.currentPage = this.currentPagenNum;
  //     localStorage.setItem("status", JSON.stringify("false"));
  //     localStorage.removeItem("currentPageNum");
  //     $('.modal-backdrop').remove();
  //   } else {
  //     this.currentPage = 1;
  //   }
  // }
  report: any = [];
  sno: any = {
    Slno: "",
    URN: "",
    PatientName: "",
    caseno: "",
    InvoiceNumber: "",
    AdmissionDate: "",
    ClaimRaisedBy: "",
    Amount: "",
  };
  heading = [['Sl#','URN','Case Number', 'Patient Name', 'Date of Admission', 'Claim Raised By', 'Amount']];
  downloadReport(type: any) {
    this.report = [];
    if (type == 'excel') {
      let claim: any;
      for (var i = 0; i < this.newclaimlist.length; i++) {
        claim = this.newclaimlist[i];
        this.sno = [];
        this.sno.Slno = i + 1;
        this.sno.URN = claim.urn;
        this.sno.caseno = claim.caseno;
        this.sno.PatientName = claim.patientName;
        this.sno.AdmissionDate = claim.dateofadmission;
        this.sno.ClaimRaisedBy = claim.claimraisedby;
        this.sno.Amount = '₹' + claim.currenttotalamount;
        this.report.push(this.sno);
      }
      let filter1 = [];
      filter1.push([['Scheme Name:-', this.schemeName]]);
      if (this.schemecategoryidvalue == null || this.schemecategoryidvalue == undefined || this.schemecategoryidvalue == '') {
        filter1.push([['Scheme Category Name:-', "All"]]);
      } else {
        filter1.push([['Scheme Category Name:-', this.schemecategoryName]]);
      }
      filter1.push([['Actual Date of Discharge From:-', this.fromDate]]);
      filter1.push([['Actual Date of Discharge To:-', this.toDate]]);
      filter1.push([['URN:-', this.urn != '' ? this.urn : "All"]]);
      filter1.push([['Case Number:-', this.caseNo != '' ? this.caseNo : "All"]]);
      TableUtil.exportListToExcelWithFilterforhospitals(this.report, "New Fresh Raise Claimed", this.heading, filter1);
    } else if (type == 'pdf') {
      if (this.newclaimlist.length == 0) {
        this.swal('', 'No Data Found', 'info');
        return;
      }
      let SlNo = 1;
      this.newclaimlist.forEach(element => {
        let rowData = [];
        rowData.push(SlNo++);
        rowData.push(element.urn);
        rowData.push(element.caseno);
        rowData.push(element.patientName);
        rowData.push(element.dateofadmission);
        rowData.push(element.claimraisedby);
        rowData.push(element.currenttotalamount);
        this.report.push(rowData);
      });
      let doc = new jsPDF('l', 'mm', [238, 270]);
      doc.setFontSize(10);
      doc.text('Hospital Name :-' + this.user.fullName, 5, 5);
      doc.text('Scheme Name:-' + this.schemeName, 5, 10);
      if (this.schemecategoryidvalue == null || this.schemecategoryidvalue == undefined || this.schemecategoryidvalue == '') {
        doc.text('Scheme Category Name:-' + "All", 5, 15);
      } else {
        doc.text('Scheme Category Name:-' + this.schemecategoryidvalue, 5, 15);
      }
      doc.text('Actual Date of Discharge From:-' + this.fromDate, 5, 20);
      doc.text('Actual Date of Discharge To:-' + this.toDate, 5, 25);
      if (this.urn != null || this.urn != undefined || this.urn != '') {
        doc.text('URN:-' + this.urn, 5, 30);
      } else {
        doc.text('URN:-' + "All", 5, 30);
      }
      if (this.caseNo != null || this.caseNo != undefined || this.caseNo != '') {
        doc.text('Case Number:-' + this.caseNo, 5, 35);
      } else {
        doc.text('Case Number:-' + "All", 5, 35);
      }
      doc.text('Document Generate Date :-' + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en').toString(), 5, 40);
      doc.text('New Fresh Raise Claimed', 100, 42);
      doc.setLineWidth(0.7);
      doc.line(100, 43, 142, 43);
      autoTable(doc, {
        head: this.heading, body: this.report, startY: 45, theme: 'grid',
        styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
        bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 35 },
          2: { cellWidth: 45 },
          3: { cellWidth: 40 },
          4: { cellWidth: 40 },
          5: { cellWidth: 40 },
          6: { cellWidth: 30 },
        }
      })
      doc.save('New_Fresh_Raise_Claimed.pdf');
    }
  }

  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

  onAction(caseid: any) {
    let state = {
      caseid: caseid,
    }
    localStorage.setItem("caseid", JSON.stringify(state));
    this.router.navigate(['/application/casewiseHospitalclaimSubmit']);
  }
}
