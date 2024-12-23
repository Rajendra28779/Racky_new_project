import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import Swal from 'sweetalert2';
//import { DataTablesModule } from 'angular-datatables';
import { HttpClient } from '@angular/common/http';
import { HeaderService } from '../../header.service';
import { ClaimsqueriedbySNOServive } from 'src/app/application/Services/claimsqueriedbySNO.service';
import { ClaimRaiseServiceService } from '../../Services/claim-raise-service.service';
import { data } from 'jquery';
import { TableUtil } from '../../util/TableUtil';
import autoTable from "jspdf-autotable";
import { jsPDF } from 'jspdf';
import { DatePipe } from '@angular/common';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { PackageDetailsMasterService } from '../../Services/package-details-master.service';
import { EncryptionService } from 'src/app/services/encryption.service';
declare let $: any;


@Component({
  selector: 'app-claimsqueriedbySNO',
  templateUrl: './claimsqueriedbySNO.component.html',
  styleUrls: ['./claimsqueriedbySNO.component.scss']
})
export class ClaimsqueriedbySNOComponent implements OnInit {
  panelOptionState = false;
  datemodelFrom: any;
  datemodelTo: any;
  claimlist: any = [];
  public empData: Object;
  public temp: Object = false;
  dtOptions: { pagingType: string; pageLength: number; lengthMenu: number[]; processing: boolean; };
  url: string;
  currentPage: any;
  pageElement: any;
  showPegi: boolean;
  record: any;
  user: any
  packageName: any;
  public serachdata: any = [];
  packageId: any;
  packasnodata: any;
  sport: boolean = false;
  packgaeNAme: any;
  description: any;
  txtsearchDate: any
  remarkdata: any;
  currentPagenNum: any;
  schemeidvalue: any
  schemeName: any
  packageheadecode: any
  Packagecode: any;
  packageCodedata: any
  constructor(private service: ClaimsqueriedbySNOServive, public router: Router, private http: HttpClient, private headerService
    : HeaderService, private LoginServ: ClaimRaiseServiceService, private sessionService: SessionStorageService, public packageDetailsMasterService: PackageDetailsMasterService, private encryptionService: EncryptionService) { }

  ngOnInit() {
    this.headerService.setTitle('Claims Queried by SNA');
    this.currentPagenNum = JSON.parse(localStorage.getItem("currentPageNum"));
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      lengthMenu: [5, 10, 15, 50],
      processing: true
    }
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
  }
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  }

  fromDate: any
  toDate: any
  packagecode: any
  getClaimDetailsList() {
    this.user = this.sessionService.decryptSessionData("user");
    var hospitalCode = this.user.userName;
    this.fromDate = $('#datepickerforquerysna').val();
    this.toDate = $('#datepickerfortosna').val();
    let Package = this.packageheadecode;
    this.packageCodedata = $('#PackageName').val();
    var URN = $('#URNnumberVALUE').val();
    let schemeid = this.schemeidvalue;
    let schemecategoryid = this.schemecategoryidvalue;
    if (schemecategoryid == null || schemecategoryid == undefined || schemecategoryid == '') {
      schemecategoryid = "";
    } else {
      schemecategoryid = schemecategoryid;
    }
    if (URN == undefined || URN == null || URN == '') {
      URN = "";
    }
    if (Package == undefined || Package == null || Package == '') {
      Package = "";
    }
    if (this.packageCodedata == null || this.packageCodedata == undefined || this.packageCodedata == '') {
      this.packageCodedata = '';
    } else {
      const packagecodematches = this.packageCodedata.match(/\((.*)\)/);
      this.packageCodedata = packagecodematches ? packagecodematches[1] : '';
      console.log(this.packageCodedata);
    }
    if (Date.parse(this.fromDate) > Date.parse(this.toDate)) {
      this.swal('', 'Discharge Date From should be Less Than Discharge Date To', 'error');
      return;
    }
    this.service.getClaimsList(hospitalCode, this.fromDate, this.toDate, Package, this.packageCodedata, URN, schemeid, schemecategoryid).subscribe(data => {
      this.claimlist = data;
      if (this.claimlist == null || this.claimlist == undefined || this.claimlist == '') {
        this.sport = true
      } else {
        this.record = this.claimlist.length;
        if (this.record > 0) {
          this.showPegi = true;
        }
        else {
          this.showPegi = false;
        }
      }
    },
      (error) => {
        this.swal('', 'Something went wrong.', 'error');
      });
  }
  onclaim(claimID: any) {
    let statesno = {
      claimid: claimID
    }
    localStorage.setItem("actionDataforsno", JSON.stringify(statesno));
    localStorage.setItem("currentPageNum", JSON.stringify(this.currentPage));
    this.router.navigate(['/application/claimsqueriedbySNOdetails/Action']);
  }
  // Inclusionofsearchingforpackagedetails() {
  //   this.LoginServ.getsearcdetails().subscribe(data => {
  //     this.serachdata = data;
  //   });
  // }
  // getPackageName(event: any) {
  //   for (let i = 0; i < this.serachdata.length; i++) {
  //     if (this.serachdata[i].id == event) {
  //       this.packageName = this.serachdata[i].procedurecode;
  //       this.LoginServ.getdatapackgaename(this.packageName).subscribe(data => {
  //         this.packasnodata = data;
  //       });
  //     }
  //   }
  // }
  onresetdata() {
    window.location.reload();
  }
  modalClose() {
    $("#appealDisposal").hide();
  }
  viewDescription(descriptinDtls) {
    this.description = descriptinDtls;
    $("#appealDisposal").show();
  }
  modal() {
    $("#remarkset").hide();
  }
  viewRemark(remark) {
    this.remarkdata = remark;
    $("#remarkset").show();
  }
  traverseToRequiredPage() {
    if (this.currentPagenNum != null && this.currentPagenNum != undefined && JSON.parse(localStorage.getItem("status")) == "true") {
      this.currentPage = this.currentPagenNum;
      localStorage.setItem("status", JSON.stringify("false"));
      localStorage.removeItem("currentPageNum");
    } else {
      this.currentPage = 1;
    }
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
  report: any = [];
  sno: any = {
    Slno: "",
    claim_no: "",
    URN: "",
    PatientName: "",
    caseno: "",
    InvoiceNo: "",
    PackageCode: "",
    AdmissionDate: "",
    ActualdateofAdmission: "",
    DischargeDate: "",
    ActualdateofDischarge: "",
    packageName: "",
    QueryOn: "",
    Daysleft: "",
    Description: "",
    Remark: "",
  };
  heading = [['Sl#', 'Claim No', 'URN', 'Patient Name', 'Case Number', 'Invoice Number', 'Package Code', 'Package Name', 'Admission Date', 'Actual Date Of Admission', ' Discharge Date', 'Actual Date of Discharge', 'Query On', 'Days left', 'Description', 'Remark']];
  downloadReport(type: any) {
    this.report = [];
    if (type == 'excel') {
      let claim: any;
      for (var i = 0; i < this.claimlist.length; i++) {
        claim = this.claimlist[i];
        this.sno = [];
        this.sno.Slno = i + 1;
        this.sno.claim_no = claim.claim_no;
        this.sno.URN = claim.urn;
        this.sno.PatientName = claim.patientName;
        this.sno.caseno = claim.caseno;
        this.sno.InvoiceNo = claim.invoiceno;
        this.sno.PackageCode = claim.packageCode;
        this.sno.packageName = claim.packageName;
        this.sno.AdmissionDate = claim.dateofadmission;
        this.sno.ActualdateofAdmission = claim.actualdateofadmission;
        this.sno.DischargeDate = claim.dateofdischarge;
        this.sno.ActualdateofDischarge = claim.actualdateofdischarge;
        this.sno.QueryOn = this.convertDate(claim.uPDATEON);
        this.sno.Daysleft = claim.getDaysleft;
        this.sno.Description = claim.remarksDes;
        this.sno.Remark = claim.remark;
        this.report.push(this.sno);
      }
      let valuedate: any;
      let todate: any;
      valuedate = this.fromDate;
      todate = this.toDate;
      if (valuedate == undefined || valuedate == null || valuedate == '') {
        valuedate = $('#datepickerforquerysna').val();
      }
      if (todate == undefined || todate == null || todate == '') {
        todate = $('#datepickerfortosna').val();
      }
      let filter1 = [];
      filter1.push([['Scheme Name:-', this.schemeName]]);
      if (this.schemecategoryidvalue == null || this.schemecategoryidvalue == undefined || this.schemecategoryidvalue == '') {
        filter1.push([['Scheme Category Name:-', "All"]]);
      } else {
        filter1.push([['Scheme Category Name:-', this.schemecategoryName]]);
      }
      filter1.push([['Actual Date of Discharge From:-', valuedate]]);
      filter1.push([['To Date :-', todate]]);
      if (this.packageheadecode == null || this.packageheadecode == undefined || this.packageheadecode == '') {
        filter1.push([['Package Category:-', "All"]]);
      } else {
        filter1.push([['Package Category:-', this.packageheadecode]]);
      }
      if (this.packageCodedata == null || this.packageCodedata == undefined || this.packageCodedata == '') {
        filter1.push([['Package Name:-', "All"]]);
      } else {
        filter1.push([['Package Name:-', this.packageCodedata]]);
      }
      let URN = $('#URNnumber').val();
      if (URN == undefined || URN == null || URN == '') {
        filter1.push([['URN:-', "ALL"]]);
      } else {
        filter1.push([['To:-', URN]]);
      }
      TableUtil.exportListToExcelWithFilterforhospitals(this.report, "Claims Queried by SNA", this.heading, filter1);
    } else if (type == 'pdf') {
      let SlNo = 1;
      if (this.claimlist.length == 0) {
        this.swal('', 'No Data Found', 'info');
        return;
      }
      let valuedate: any;
      let todate: any;
      let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      valuedate = this.fromDate;
      todate = this.toDate;
      if (valuedate == undefined || valuedate == null || valuedate == '') {
        valuedate = $('#datepickerforquerysna').val();
      }
      if (todate == undefined || todate == null || todate == '') {
        todate = $('#datepickerfortosna').val();
      }
      this.claimlist.forEach(element => {
        let rowData = [];
        rowData.push(SlNo++);
        rowData.push(element.claim_no);
        rowData.push(element.urn);
        rowData.push(element.patientName);
        rowData.push(element.caseno);
        rowData.push(element.invoiceno);
        rowData.push(element.packageCode);
        rowData.push(element.packageName);
        rowData.push(element.dateofadmission);
        rowData.push(element.actualdateofadmission);
        rowData.push(element.dateofdischarge);
        rowData.push(element.actualdateofdischarge);
        rowData.push(this.convertDate(element.uPDATEON));
        rowData.push(element.getDaysleft);
        rowData.push(element.remarksDes);
        rowData.push(element.remark);
        this.report.push(rowData);
      });
      let doc = new jsPDF('l', 'mm', [240, 270]);
      doc.setFontSize(10);
      doc.text('Hospital Name :-' + this.user.fullName + '(' + (this.user.userName) + ')', 5, 5);
      doc.text('Scheme Name:-' + this.schemeName, 5, 10);
      if (this.schemecategoryidvalue == null || this.schemecategoryidvalue == undefined || this.schemecategoryidvalue == '') {
        doc.text('Scheme Category Name:-' + "All", 5, 15);
      } else {
        doc.text('Scheme Category Name:-' + this.schemecategoryidvalue, 5, 15);
      }
      doc.text('Actual Date of Discharge From:-' + valuedate, 5, 20);
      doc.text('To:-' + todate, 5, 25);
      if (this.packageheadecode == null || this.packageheadecode == undefined || this.packageheadecode == '') {
        doc.text('Package Category:-' +"All", 5, 30);
      } else {
        doc.text('Package Category:-' + this.packageheadecode, 5, 30);
      }
      if (this.packageCodedata == null || this.packageCodedata == undefined || this.packageCodedata == '') {
        doc.text('Package Name:-' + "All", 5, 40);
      } else {
        doc.text('Package Name:-' + this.packageCodedata, 5, 40);
      }
      let URN = $('#URNnumber').val();
      if (URN == undefined || URN == null || URN == '') {
        doc.text('URN:-' + "All", 5, 45);
      } else {
        doc.text('URN:-' + URN, 5, 45);
      }
      doc.text('Document Generate Date : ' + new Date().toLocaleString(), 5, 50);
      doc.text('Claims Queried by SNA', 100, 56);
      doc.line(100, 57, 138, 57);
      autoTable(doc, {
        head: this.heading, body: this.report, startY: 58, theme: 'grid',
        styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
        bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
        columnStyles: {
          0: { cellWidth: 8 },
          1: { cellWidth: 15 },
          2: { cellWidth: 15 },
          3: { cellWidth: 15 },
          4: { cellWidth: 15 },
          5: { cellWidth: 15 },
          6: { cellWidth: 15 },
          7: { cellWidth: 15 },
          8: { cellWidth: 15 },
          9: { cellWidth: 15 },
          10: { cellWidth: 15 },
          11: { cellWidth: 15 },
          12: { cellWidth: 15 },
          13: { cellWidth: 15 },
          14: { cellWidth: 15 },
          15: { cellWidth: 15 },
        }
      })
      doc.save('Claims_Queried_by_SNA.pdf');
    }
  }
  convertDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy, h:mm:ss a');
    return date;
  }
  Onsearch() {
    const URNNO = $('#txtseatxtsrchDate').val();
    if (URNNO == "") {
      this.getClaimDetailsList();
    }
    this.claimlist = this.claimlist.filter((data) => {
      return data.urn.match(URNNO);
    })
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
        this.InclusionofsearchingforschemePackageData();
      } else {
        this.swal('', 'Something went wrong.', 'error');

      }
      console.log(this.schemeList);
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
    }else{
      this.schemecategoryidvalue = '';
      this.schemecategoryName = "All"
    }
    if (this.schemecategoryidvalue == null || this.schemecategoryidvalue == undefined || this.schemecategoryidvalue == '' || this.schemecategoryidvalue == "") {
      this.InclusionofsearchingforschemePackageData();
    } else {
      this.InclusionofsearchingforschemePackageData();
    }
  }

  packageschemename: any = [];
  InclusionofsearchingforschemePackageData() {
    let schemeid = this.schemeidvalue;
    let schemecategoryid = this.schemecategoryidvalue;
    if (schemecategoryid == null || schemecategoryid == undefined || schemecategoryid == '' || schemecategoryid == "") {
      schemecategoryid = "";
    } else {
      schemecategoryid = schemecategoryid;
    }
    this.LoginServ.InclusionofsearchingforschemePackageData(schemeid, schemecategoryid).subscribe(data => {
      if (data != null || data != '') {
        this.packageschemename = data;
      } else {
        this.swal('', 'Something went wrong.', 'error');
      }

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
        this.getClaimDetailsList();
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

  text: any;
  packagenamescheme: any = [];
  getPackageSchemeName(event: any) {
    let schemeid = this.schemeidvalue;
    let schemecategoryid = this.schemecategoryidvalue;
    if (schemecategoryid == null || schemecategoryid == undefined || schemecategoryid == '') {
      schemecategoryid = "";
    } else {
      schemecategoryid = schemecategoryid;
    }
    for (let i = 0; i < this.packageschemename.length; i++) {
      if (this.packageschemename[i].packageheader == event) {
        this.text = this.packageschemename[i].packageheader;
        const matches = this.text.match(/\((.*)\)/);
        this.packageheadecode = matches ? matches[1] : '';
        console.log(this.packageheadecode);
        this.LoginServ.getPackageProcedurecodeSchemeWise(schemeid, schemecategoryid, this.packageheadecode).subscribe(data => {
          if (data != null || data != '') {
            this.packagenamescheme = data;
          } else {
            this.swal('', 'Something went wrong.', 'error');
          }
        });
      }
    }
  }
}
