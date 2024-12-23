import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { PendingService } from '../../pending.service';
import { ClaimRaiseServiceService } from '../../Services/claim-raise-service.service';
import autoTable from "jspdf-autotable";
import { jsPDF } from 'jspdf';
import { TableUtil } from '../../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { PackageDetailsMasterService } from '../../Services/package-details-master.service';
import { EncryptionService } from 'src/app/services/encryption.service';
declare let $: any;


@Component({
  selector: 'app-pendingclaim',
  templateUrl: './pendingclaim.component.html',
  styleUrls: ['./pendingclaim.component.scss']
})
export class PendingclaimComponent implements OnInit {
  user: any;
  Rejetedlist: any = [];
  record: any;
  showPegi: boolean;
  pageElement: any;
  currentPage: any;
  public serachdata: any = [];
  packageName: any;
  packageId: any;
  packagependingdata: any
  snareport: boolean = false;
  txtsearchDate: any
  packgaeNAme: any;
  packagecode: any;
  schemeidvalue: any
  schemeName: any
  packageheadecode: any
  schemecategoryName: any;
  constructor(public headerService: HeaderService, private pendingService: PendingService, private LoginServ: ClaimRaiseServiceService, public router: Router, private sessionService: SessionStorageService, private encryptionService: EncryptionService, public packageDetailsMasterService: PackageDetailsMasterService) { }

  ngOnInit(): void {
    this.headerService.setTitle('Non Uploading Initial Document');
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
  }
  fromDate: any
  toDate: any
  OnGetClaimList() {
    this.user = this.sessionService.decryptSessionData("user");
    var hospitalcoderejected = this.user.userName;
    this.fromDate = $('#datepickerforreject').val();
    this.toDate = $('#datepickerfortoreject').val();
    let Package = this.packageheadecode;
    this.packagecode = $('#PackageName').val();
    let schemeid = this.schemeidvalue;
    let schemecategoryid = this.schemecategoryidvalue;
    if (schemecategoryid == null || schemecategoryid == undefined || schemecategoryid == '') {
      schemecategoryid = "";
    } else {
      schemecategoryid = schemecategoryid;
    }
    let URN = $('#actionType').val();
    if (Package == undefined || Package == '' || Package == null) {
      Package = "";
    }
    if (this.packagecode == undefined || this.packagecode == '' || this.packagecode == null) {
      this.packagecode = "";
    } else {
      const packagecodematches = this.packagecode.match(/\((.*)\)/);
      this.packagecode = packagecodematches ? packagecodematches[1] : '';
      console.log(this.packagecode);
    }
    if (URN == "" || URN == undefined || URN == null) {
      URN = "";
    }
    if (Date.parse(this.fromDate) > Date.parse(this.toDate)) {
      this.swal('', 'Discharge Date From should be Less Than Discharge Date To', 'error');
      return;
    }
    this.pendingService.getRejetctedlist(hospitalcoderejected, this.fromDate, this.toDate, Package, this.packagecode, URN, schemeid, schemecategoryid).subscribe(data => {
      this.Rejetedlist = data;
      if (this.Rejetedlist.length == 0) {
        this.snareport = true;
      }
      this.record = this.Rejetedlist.length;
      if (this.record > 0) {
        this.showPegi = true;
        this.snareport = false;
      }
      else {
        this.showPegi = false;
        this.snareport = true;
      }
    },
      (error) => {
        this.swal('', 'Something went wrong.', 'error');
      });
  }
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItems")).value;
  }
  Onsearch() {
    const URNNO = $('#txtsearchDate').val();
    if (URNNO == "") {
      this.swal('', 'Please Enter URN Number', 'info');
      this.OnGetClaimList();
    }
    this.Rejetedlist = this.Rejetedlist.filter((data) => {
      return data.urn.match(URNNO);
    })
  }
  Inclusionofsearchingforpackagedetails() {
    this.LoginServ.getsearcdetails().subscribe(data => {
      this.serachdata = data;
    });
  }
  getPackageName(event: any) {
    for (let i = 0; i < this.serachdata.length; i++) {
      if (this.serachdata[i].id == event) {
        this.packageName = this.serachdata[i].procedurecode;
        this.LoginServ.getdatapackgaename(this.packageName).subscribe(data => {
          this.packagependingdata = data;
        });
      }
    }
  }
  restedata() {
    window.location.reload();
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  onclaim(transactiondetailsid: any, urn: any, authorizedcode: any, hospitalcode: any, claimraisedBy: any) {
    let state = {
      Action: transactiondetailsid,
      URN: urn,
      Authroziedcode: authorizedcode,
      Hospitalcode: hospitalcode,
      claimraisedBy: claimraisedBy,
    }
    localStorage.setItem("actionDataforpending", JSON.stringify(state));
    this.router.navigate(['/application/RejectedClaim/Action']);
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
  report: any = [];
  sno: any = {
    Slno: "",
    URN: "",
    PatientName: "",
    caseno: "",
    InvoiceNumber: "",
    PackageCode: "",
    packageName: "",
    AdmissionDate: "",
    ActualDateOfAdmission: "",
    DischargeDate: "",
    ActualDateOfDischarge: "",
    LastDateOfRaiseClaim: "",
    Amount: "",
  };
  heading = [['Sl#', 'URN', 'Patient Name', 'Case Number', 'Invoice Number', 'Package Code', 'Package Name', 'Admision Date', 'Actual Date Of Admision', 'Discharge Date', 'Actual Date Of Discharge', 'Last Date Of Raise Claim', 'Amount']];
  downloadReport(type: any) {
    this.report = [];
    if (type == 'excel') {
      this.report = [];
      let claim: any;
      for (var i = 0; i < this.Rejetedlist.length; i++) {
        claim = this.Rejetedlist[i];
        this.sno = [];
        this.sno.Slno = i + 1;
        this.sno.URN = claim.urn;
        this.sno.PatientName = claim.patientname;
        this.sno.caseno = claim.caseno;
        this.sno.InvoiceNumber = claim.invoiceno;
        this.sno.PackageCode = claim.packagecode;
        this.sno.packageName = claim.packagename;
        this.sno.AdmissionDate = claim.dateofadmission;
        this.sno.ActualDateOfAdmission = claim.actualdateofadmission;
        this.sno.DischargeDate = claim.dateofdischarge;
        this.sno.ActualDateOfDischarge = claim.actualdateofdischarge;
        this.sno.LastDateOfRaiseClaim = claim.claim_raised_by;
        this.sno.Amount = "₹" + claim.currenttotalamount;
        this.report.push(this.sno);
      }
      let valuedate: any;
      let todate: any;
      valuedate = this.fromDate;
      todate = this.toDate;
      if (valuedate == undefined || valuedate == null || valuedate == '') {
        valuedate = $('#datepickerforreject').val();
      }
      if (todate == undefined || todate == null || todate == '') {
        todate = $('#datepickerfortoreject').val();
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
      if (this.packagecode == null || this.packagecode == undefined || this.packagecode == '') {
        filter1.push([['Package Name:-', "All"]]);
      } else {
        filter1.push([['Package Name:-', this.packagecode]]);
      }
      let URN = $('#actionType').val();
      if (URN == undefined || URN == null || URN == '') {
        filter1.push([['URN:-', "ALL"]]);
      } else {
        filter1.push([['To:-', URN]]);
      }
      TableUtil.exportListToExcelWithFilterforhospitals(this.report, "Non Uploading Initial Document", this.heading, filter1);
    } else if (type == 'pdf') {
      let SlNo = 1;
      if (this.Rejetedlist.length == 0) {
        this.swal('', 'No Records Found', 'info');
        return;
      }
      let valuedate: any;
      let todate: any;
      valuedate = this.fromDate;
      todate = this.toDate;
      if (valuedate == undefined || valuedate == null || valuedate == '') {
        valuedate = $('#datepickerforreject').val();
      }
      if (todate == undefined || todate == null || todate == '') {
        todate = $('#datepickerfortoreject').val();
      }
      this.Rejetedlist.forEach(element => {
        let rowData = [];
        rowData.push(SlNo++);
        rowData.push(element.urn);
        rowData.push(element.patientname);
        rowData.push(element.caseno);
        rowData.push(element.invoiceno);
        rowData.push(element.packagecode);
        rowData.push(element.packagename);
        rowData.push(element.dateofadmission);
        rowData.push(element.actualdateofadmission);
        rowData.push(element.dateofdischarge);
        rowData.push(element.actualdateofdischarge);
        rowData.push(element.claim_raised_by);
        rowData.push(element.currenttotalamount);
        this.report.push(rowData);
      });
      let doc = new jsPDF('l', 'mm', [240, 272]);
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
        doc.text('Package Category:-' + "All", 5, 30);
      } else {
        doc.text('Package Category:-' + this.packageheadecode, 5, 30);
      }
      let URN = $('#actionType').val();
      if (URN == undefined || URN == null || URN == '') {
        doc.text('URN:-' + "All", 5, 35);
      } else {
        doc.text('URN:-' + URN, 5, 35);
      }
      doc.text('Document Generate Date : ' + new Date().toLocaleString(), 5, 40);;
      doc.text('Non Uploading Initial Document', 100, 42);
      doc.line(100, 43, 150, 43);
      autoTable(doc, {
        head: this.heading, body: this.report, startY: 45, theme: 'grid',
        styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
        bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 20 },
          2: { cellWidth: 30 },
          3: { cellWidth: 20 },
          4: { cellWidth: 20 },
          5: { cellWidth: 30 },
          6: { cellWidth: 20 },
          7: { cellWidth: 20 },
          8: { cellWidth: 20 },
          9: { cellWidth: 20 },
        }
      })
      doc.save('Non_Uploading_Initial_Document.pdf');
    }
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
        this.OnGetClaimList();
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
