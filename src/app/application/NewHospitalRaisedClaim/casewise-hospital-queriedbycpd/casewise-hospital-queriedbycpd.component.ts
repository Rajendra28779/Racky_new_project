import { Component, OnInit } from '@angular/core';
import { ClaimRaiseServiceService } from '../../Services/claim-raise-service.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { QueryByCpdService } from '../../Services/query-by-cpd.service';
import { HeaderService } from '../../header.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { PackageDetailsMasterService } from '../../Services/package-details-master.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import Swal from 'sweetalert2';
import { TableUtil } from '../../util/TableUtil';
import jsPDF from 'jspdf';
import { formatDate } from '@angular/common';
import autoTable from 'jspdf-autotable';
declare let $: any;

@Component({
  selector: 'app-casewise-hospital-queriedbycpd',
  templateUrl: './casewise-hospital-queriedbycpd.component.html',
  styleUrls: ['./casewise-hospital-queriedbycpd.component.scss']
})
export class CasewiseHospitalQueriedbycpdComponent implements OnInit {
  panelOptionState = false;
  datemodelFrom: any;
  datemodelTo: any;
  public empData: Object;
  public temp: Object = false;
  record: any;
  currentPage: any;
  pageElement: any;
  showPegi: boolean;
  user: any;
  public serachdata: any = [];
  Pegi: boolean = false;
  packgaeNAme: any;
  description: any;
  remarkdata: any;
  currentPagenNum: any;
  txtsearchDate: any
  schemeidvalue: any = '1'
  schemeName: any


  constructor(public router: Router, private http: HttpClient, private queryByCpdService: QueryByCpdService,
    private headerService: HeaderService, private sessionService: SessionStorageService, public packageDetailsMasterService: PackageDetailsMasterService, private encryptionService: EncryptionService) { }
  ngOnInit(): void {
    this.headerService.setTitle('Case Queried by CPD');
    this.currentPagenNum = JSON.parse(localStorage.getItem("currentPageNumber"));
    this.getSchemeData();
    this.currentPage = 1;
    this.pageElement = 50;
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
    this.traverseToRequiredPage();
    this.getcasewiseClaimDetails();
  }
  report: any = [];
  sno: any = {
    Slno: "",
    URN: "",
    caseno: "",
    PatientName: "",
    AdmissionDate: "",
    cpdquerydate: "",
    remarks: "",
    Amount: "",
  };
  heading = [['Sl#', 'URN', 'Case Number', 'Patient Name', 'Date of Admission', 'Cpd Query Date', 'Remarks', 'Amount']];
  downloadReport(type: any) {
    this.report = [];
    if (type == 'excel') {
      let claim: any;
      for (var i = 0; i < this.newquerylist.length; i++) {
        claim = this.newquerylist[i];
        this.sno = [];
        this.sno.Slno = i + 1;
        this.sno.URN = claim.urn;
        this.sno.caseno = claim.caseno;
        this.sno.PatientName = claim.patientName;
        this.sno.AdmissionDate = claim.dateofadmission;
        this.sno.cpdquerydate = claim.cpdquerydate;
        this.sno.remarks = claim.remarks;
        this.sno.Amount = '₹' + claim.totalamountclaimed;
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
      filter1.push([['URN:-', $('#URNnum').val() != '' ? $('#URNnum').val() : "All"]]);
      filter1.push([['Case Number:-', $('#caseno').val() != '' ? $('#caseno').val() : "All"]]);
      TableUtil.exportListToExcelWithFilterforhospitals(this.report, "CaseWise Queried by CPD", this.heading, filter1);
    } else if (type == 'pdf') {
      if (this.newquerylist.length == 0) {
        this.swal('', 'No Data Found', 'info');
        return;
      }
      let SlNo = 1;
      this.newquerylist.forEach(element => {
        let rowData = [];
        rowData.push(SlNo++);
        rowData.push(element.urn);
        rowData.push(element.caseno);
        rowData.push(element.patientName);
        rowData.push(element.dateofadmission);
        rowData.push(element.cpdquerydate);
        rowData.push(element.remarks);
        rowData.push(element.totalamountclaimed);
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
      if ($('#URNnum').val() != null || $('#URNnum').val() != undefined || $('#URNnum').val() != '') {
        doc.text('URN:-' + $('#URNnum').val(), 5, 30);
      } else {
        doc.text('URN:-' + "All", 5, 30);
      }
      if ($('#caseno').val() != null || $('#caseno').val() != undefined || $('#caseno').val() != '') {
        doc.text('Case Number:-' + $('#caseno').val(), 5, 35);
      } else {
        doc.text('Case Number:-' + "All", 5, 35);
      }
      doc.text('Document Generate Date :-' + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en').toString(), 5, 40);
      doc.text('CaseWise Queried by CPD', 100, 42);
      doc.setLineWidth(0.7);
      doc.line(100, 43, 142, 43);
      autoTable(doc, {
        head: this.heading, body: this.report, startY: 45, theme: 'grid',
        styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
        bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 30 },
          2: { cellWidth: 30 },
          3: { cellWidth: 30 },
          4: { cellWidth: 30 },
          5: { cellWidth: 30 },
          6: { cellWidth: 30 },
          7: { cellWidth: 30 },
        }
      })
      doc.save('CaseWise_Queried_by_CPD.pdf');
    }
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
      console.log(this.schemeList);
    },
      (error) => {
        this.swal('', 'Something went wrong.', 'error');
      });
  }
  schemecategoryidvalue: any;
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
      console.log(this.scheme);
    },
      (error) => {
        this.swal('', 'Something went wrong.', 'error');
      });
  }
  fromDate: any;
  toDate: any;
  newquerylist: any = [];

  getcasewiseClaimDetails() {
    this.user = this.sessionService.decryptSessionData("user");
    var hospitalCode = this.user.userName;
    this.fromDate = $('#datepickerforquerycpd').val();
    this.toDate = $('#datepickerfortocpd').val();
    let urn = $('#URNnum').val();
    let caseno = $('#caseno').val();
    let schemeid = this.schemeidvalue;
    let schemecategoryid = this.schemecategoryidvalue;
    if (schemecategoryid == null || schemecategoryid == undefined || schemecategoryid == '') {
      schemecategoryid = "";
    } else {
      schemecategoryid = schemecategoryid;
    }
    if (urn == undefined || urn == null || urn == '') {
      urn = "";
    }
    if (caseno == undefined || caseno == null || caseno == '') {
      caseno = "";
    }
    if (Date.parse(this.fromDate) > Date.parse(this.toDate)) {
      this.swal('', 'Discharge Date From should be Less Than Discharge Date To', 'error');
      return;
    }
    this.queryByCpdService.getcasewiseQuerytohospital(hospitalCode, this.fromDate, this.toDate, urn, caseno, schemeid, schemecategoryid).subscribe(
      (response: any) => {
        if (response && response.status === 200 && response.data) {
          // Assign response data to newclaimlist
          this.newquerylist = response.data;
          // Update record count
          this.record = this.newquerylist.length;
          // Show pagination only if there are records
          this.showPegi = this.record > 0;
          if (!this.showPegi) {
            this.showPegi = false;
          } else {
            this.showPegi = true;
          }
        } else {
          // Handle case where status is not 200 or no data is returned
          this.newquerylist = [];
          this.showPegi = false;
        }
      },
      (error: any) => {
        // Handle error
        this.swal('', 'Something went wrong.', 'error');
      }
    );
  }


  resetdata() {
    window.location.reload();

  }

  onclaim(caseid: any) {
    let state = {
      caseid: caseid,
    }
    localStorage.setItem("actionDataforcpd", JSON.stringify(state));
    localStorage.setItem("currentPageNumber", JSON.stringify(this.currentPage));
    this.router.navigate(['/application/CasewiseQueriedbycpdsubmit']);
  }

  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  }

  traverseToRequiredPage() {
    if (this.currentPagenNum != null && this.currentPagenNum != undefined && JSON.parse(localStorage.getItem("status")) == "true") {
      this.currentPage = this.currentPagenNum;
      localStorage.setItem("status", JSON.stringify("false"));
    } else {
      this.currentPage = 1;
    }
  }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
}
