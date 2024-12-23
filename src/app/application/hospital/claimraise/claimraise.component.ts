import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ClaimRaiseServiceService } from 'src/app/application/Services/claim-raise-service.service';
import { HeaderService } from '../../header.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TableUtil } from '../../util/TableUtil';
import autoTable from "jspdf-autotable";
import { jsPDF } from 'jspdf';
import "jspdf-autotable";
import { CurrencyPipe, formatDate } from '@angular/common';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { PackageDetailsMasterService } from '../../Services/package-details-master.service';
import { CreatecpdserviceService } from '../../Services/createcpdservice.service';
import { EncrypyDecrpyService } from 'src/app/services/form-services/encrypy-decrpy.service';
import { environment } from 'src/environments/environment';
declare let $: any;

@Component({
  selector: 'app-claimraise',
  templateUrl: './claimraise.component.html',
  styleUrls: ['./claimraise.component.scss']
})
export class ClaimraiseComponent implements OnInit {
  panelOptionState = false;
  datemodelFrom: any;
  datemodelTo: any;
  record: any;
  AddForm: FormGroup;
  currentPage: any;
  pageElement: any;
  claimlist: any = [];
  public serachdata: any = [];
  public empData: Object;
  public temp: Object = false;
  showPegi: boolean;
  user: any;
  txtsearchDate: any
  check: boolean = false;
  packageName: any;
  packageId: any;
  datepicker4: any;
  packagenamedata: any
  query: boolean = false;
  packgaeNAme: any;
  currentPagenNum: any;
  doc: any
  Packagecode: any;
  packageCodedata: any
  preauthdocs: any
  claimdocs: any
  schemeidvalue: any
  schemeName: any
  packageheadecode: any
  userName: string;
  constructor(private LoginServ: ClaimRaiseServiceService, public router: Router, private headerService: HeaderService, public fb: FormBuilder, private sessionService: SessionStorageService
    , private encryptionService: EncryptionService, public packageDetailsMasterService: PackageDetailsMasterService, private logser: CreatecpdserviceService,
    public encDec: EncrypyDecrpyService
  ) { }
  ngOnInit() {
    this.currentPagenNum = JSON.parse(localStorage.getItem("currentPageNum"));
    this.headerService.setTitle('Claims to Raise ');
    this.currentPage = 1;
    this.pageElement = 50;
    this.getSchemeData();
    // this.Inclusionofsearchingforpackagedetails();
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
  Onsearch() {
    const URNNO = $('#txtsearchDate').val();
    if (URNNO == "") {
      this.getClaimDetails();
    }
    this.claimlist = this.claimlist.filter((data) => {
      return data.urn.match(URNNO);
    })
  }
  getRestdata() {
    window.location.reload();
  }
  fromDate: any
  toDate: any
  caseno: any
  getClaimDetails() {
    this.user = this.sessionService.decryptSessionData("user");
    var hospitalCode = this.user.userName;
    this.fromDate = $('#datepicker4').val();
    this.toDate = $('#datepicker3').val();
    let Package = this.packageheadecode;
    this.packageCodedata = $('#PackageName').val();
    var URN = $('#URNnumber').val();
    this.caseno = $('#case').val();
    let schemeid = this.schemeidvalue;
    let schemecategoryid = this.schemecategoryidvalue;
    if (schemecategoryid == null || schemecategoryid == undefined || schemecategoryid == '') {
      schemecategoryid = "";
    } else {
      schemecategoryid = schemecategoryid;
    } if (Package == undefined || Package == null || Package == '') {
      Package = '';
    } if (URN == undefined || URN == null || URN == '') {
      URN = '';
    }
    if (this.caseno == null || this.caseno == undefined || this.caseno == '') {
      this.caseno = '';
    }
    if (this.packageCodedata == null || this.packageCodedata == undefined || this.packageCodedata == '') {
      this.packageCodedata = '';
    } else {
      const packagecodematches = this.packageCodedata.match(/\((.*)\)/);
      this.packageCodedata = packagecodematches ? packagecodematches[1] : '';
    }
    if (Date.parse(this.fromDate) > Date.parse(this.toDate)) {
      this.swal('', 'Actual Date of Discharge From  should be Less Than To.', 'error');
      return;
    }
    this.LoginServ.getClaimList(hospitalCode, this.fromDate, this.toDate, Package, this.packageCodedata, URN, this.caseno, schemeid, schemecategoryid).subscribe(data => {
      if (data != null || data != '') {
        this.claimlist = data;
      } else {
        this.swal('', 'No Data Found', 'info');
      }
      this.record = this.claimlist.length;
      if (this.record > 0) {
        this.showPegi = true;
      }
      else {
        this.showPegi = false;
      }
    }
      ,
      (error) => {
        this.swal('', 'Something went wrong.', 'error');
      }
    );
  }
  eligibility: any;
  onclaim(transactiondetailsid: any, urn: any, authorizedcode: any, hospitalcode: any, preauthdocs: any, claimdocs: any) {
    this.preauthdocs = preauthdocs;
    this.claimdocs = claimdocs;
    let state = {
      Action: transactiondetailsid,
      URN: urn,
      Authroziedcode: authorizedcode,
      Hospitalcode: hospitalcode
    }

    this.LoginServ.checkhospitaleligiblityforclaimraise(hospitalcode).subscribe({
      next: (response: any) => {
        if (response.status === 'success') {
          if (response.eligibility !== undefined) {
            this.eligibility = response.eligibility;
            console.log('Eligibility:', this.eligibility);
            if (this.eligibility === '0' || this.eligibility === 0) {
              localStorage.setItem("actionDataforclaim", JSON.stringify(state));
              localStorage.setItem("currentPageNum", JSON.stringify(this.currentPage));
              this.router.navigate(['/application/claimraise/Action']);
            } else if (this.eligibility === '1' || this.eligibility === 1) {
              let text = `Hospital Required to update below details for claim raise process.
1. Hospital City
2. Pin code
3. Distance from DHH (in KM)
4. Complete address with Landmark.`
              Swal.fire({
                title: '',
                text: text,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes',
              }).then((result) => {
                if (result.isConfirmed) {
                  this.logser.currentMessage.subscribe(data => {
                    let user = this.sessionService.decryptSessionData("user");
                    this.userName = user.userName;
                    let groupId = user.groupId;
                    if (groupId == 3) {
                      console.log('cpd');
                      // this.router.navigateByUrl('/application/cpdprofile');
                    } else if (groupId == 5) {
                      console.log('hospital');
                      this.openHospital();
                      // this.router.navigateByUrl('/application/hospitalprofile');
                    } else {
                      console.log('others');
                      // this.router.navigateByUrl('/application/userprofile');
                    }
                  });
                }
              }
              )
            }
          } else {
            console.log('Eligibility:', this.eligibility);
          }
        } else {
          this.swal('', 'Something went wrong.', 'error');
          this.eligibility = null;
        }
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
  }
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
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
          this.packagenamedata = data;
        });
      }
    }
  }



  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  traverseToRequiredPage() {
    if (this.currentPagenNum != null && this.currentPagenNum != undefined && JSON.parse(localStorage.getItem("status")) == "true") {
      this.currentPage = this.currentPagenNum;
      localStorage.setItem("status", JSON.stringify("false"));
      localStorage.removeItem("currentPageNum");
      $('.modal-backdrop').remove();
    } else {
      this.currentPage = 1;
    }
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
    ClaimRaisedBy: "",
    DaysLeft: "",
    Amount: "",
  };
  heading = [['Sl#', 'URN', 'Patient Name', 'Case Number', 'Invoice Number', 'Package Code', 'Package Name', 'Admission Date', 'Actual Date Of Admission', 'Discharge Date', 'Actual Date Of Discharge', 'Claim Raised By', 'Days Left', 'Amount']];

  downloadReport(type: any) {
    this.report = [];
    if (type == 'excel') {
      let claim: any;
      for (var i = 0; i < this.claimlist.length; i++) {
        claim = this.claimlist[i];
        this.sno = [];
        this.sno.Slno = i + 1;
        this.sno.URN = claim.urn;
        this.sno.PatientName = claim.patientName;
        this.sno.caseno = claim.caseno;
        this.sno.InvoiceNumber = claim.invoiceno;
        this.sno.PackageCode = claim.packageCode;
        this.sno.packageName = claim.packageName;
        this.sno.AdmissionDate = claim.dateofadmission;
        this.sno.ActualDateOfAdmission = claim.actualdateofadmission;
        this.sno.DischargeDate = claim.dateOfDischarge;
        this.sno.ActualDateOfDischarge = claim.actualdateofdischarge;
        this.sno.ClaimRaisedBy = claim.claimRaiseby;
        this.sno.DaysLeft = claim.remainingDateString;
        this.sno.Amount = '₹' + claim.currentTotalAmount;
        this.report.push(this.sno);
      }
      let valuedate: any;
      let todate: any;
      valuedate = this.fromDate;
      todate = this.toDate;
      if (valuedate == undefined || valuedate == null || valuedate == '') {
        valuedate = $('#datepicker4').val();
      }
      if (todate == undefined || todate == null || todate == '') {
        todate = $('#datepicker3').val();
      }
      let filter1 = [];
      filter1.push([['Scheme Name:-', this.schemeName]]);
      if (this.schemecategoryidvalue == null || this.schemecategoryidvalue == undefined || this.schemecategoryidvalue == '') {
        filter1.push([['Scheme Category Name:-', "All"]]);
      } else {
        filter1.push([['Scheme Category Name:-', this.schemecategoryName]]);
      }
      filter1.push([['Actual Date of Discharge From:-', valuedate]]);
      filter1.push([['To:-', todate]]);
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
      TableUtil.exportListToExcelWithFilterforhospitals(this.report, "Claims to Raise List", this.heading, filter1);
    } else if (type == 'pdf') {
      if (this.claimlist.length == 0) {
        this.swal('', 'No Data Found', 'info');
        return;
      }
      let valuedate: any;
      let todate: any;
      valuedate = this.fromDate;
      todate = this.toDate;
      if (valuedate == undefined || valuedate == null || valuedate == '') {
        valuedate = $('#datepicker4').val();
      }
      if (todate == undefined || todate == null || todate == '') {
        todate = $('#datepicker3').val();
      }
      let SlNo = 1;
      this.claimlist.forEach(element => {
        let rowData = [];
        rowData.push(SlNo++);
        rowData.push(element.urn);
        rowData.push(element.patientName);
        rowData.push(element.caseno);
        rowData.push(element.invoiceno);
        rowData.push(element.packageCode);
        rowData.push(element.packageName);
        rowData.push(element.dateofadmission);
        rowData.push(element.actualdateofadmission);
        rowData.push(element.dateOfDischarge);
        rowData.push(element.actualdateofdischarge);
        rowData.push(element.claimRaiseby);
        rowData.push(element.remainingDateString);
        rowData.push(element.currentTotalAmount);
        this.report.push(rowData);
      });
      let doc = new jsPDF('l', 'mm', [238, 270]);
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
      doc.text('Document Generate Date :-' + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en').toString(), 5, 50);
      doc.text('Claims to Raise', 100, 52);
      doc.setLineWidth(0.7);
      doc.line(100, 53, 124, 53);
      autoTable(doc, {
        head: this.heading, body: this.report, startY: 55, theme: 'grid',
        styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
        bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
        columnStyles: {
          0: { cellWidth: 8 },
          1: { cellWidth: 20 },
          2: { cellWidth: 20 },
          3: { cellWidth: 30 },
          4: { cellWidth: 13 },
          5: { cellWidth: 13 },
          6: { cellWidth: 15 },
          7: { cellWidth: 15 },
          8: { cellWidth: 15 },
          9: { cellWidth: 18 },
          10: { cellWidth: 15 },
          11: { cellWidth: 18 },
          12: { cellWidth: 18 },
          13: { cellWidth: 18 },

        }
      })
      doc.save('Claims_to_Raise_List.pdf');
    }
  }
  convertCurrency(amount: any) {
    var formatter = new CurrencyPipe('en-US');
    amount = formatter.transform(amount, '', '');
    return amount;
  }

  keyFunc1(e) {
    if (e.value[0] == "@") {
      $('#case').val('');
    } else if (e.value[0] == "(") {
      $('#case').val('')
    }
    else if (e.value[0] == ")") {
      $('#case').val('')
    }
    else if (e.value[0] == ' ') {
      $('#case').val('')
    }
    else if (e.value[0] == "-") {
      $('#case').val('')
    }
    else if (e.value[0] == "_") {
      $('#case').val('')
    }
    else if (e.value[0] == ".") {
      $('#case').val('')
    }
    else if (e.value[0] == "!") {
      $('#case').val('')
    }
    else if (e.value[0] == "#") {
      $('#case').val('')
    }
    else if (e.value[0] == "$") {
      $('#case').val('')
    }
    else if (e.value[0] == "^") {
      $('#case').val('')
    }
    else if (e.value[0] == "&") {
      $('#case').val('')
    }
    else if (e.value[0] == "*") {
      $('#case').val('')
    }
    else if (e.value[0] == "=") {
      $('#case').val('')
    }
    else if (e.value[0] == "+") {
      $('#case').val('')
    }
    else if (e.value[0] == "+") {
      $('#case').val('')
    }
    else if (e.value[0] == "?") {
      $('#case').val('')
    }
    else if (e.value[0] == ":") {
      $('#case').val('')
    }
    else if (e.value[0] == ";") {
      $('#case').val('')
    }
    else if (e.value[0] == "'") {
      $('#case').val('')
    }
    else if (e.value[0] == '"') {
      $('#case').val('')
    }
    else if (e.value[0] == "}") {
      $('#case').val('')
    }
    else if (e.value[0] == "{") {
      $('#case').val('')
    }
    else if (e.value[0] == "]") {
      $('#case').val('')
    }
    else if (e.value[0] == "[") {
      $('#case').val('')
    }
    else if (e.value[0] == "|") {
      $('#case').val('')
    }
    else if (e.value[0] == "\\") {
      $('#case').val('')
    }
    else if (e.value[0] == "%") {
      $('#case').val('')
    }
    else if (e.value[0] == ",") {
      $('#case').val('')
    }
  }
  showPreDoc1(text) {
    alert(text)
    $('#preAuthDocId').text(text);
    $('#showMoreId6').empty()
    $('#showMoreId7').append('<div style="cursor: pointer; color: #1d89c9">Show Less</div>');
  }
  hidePreDoc1(text) {
    if (text.length > 30) {
      $('#preAuthDocId').text(text.substring(0, 30) + '...');
      $('#showMoreId7').empty()
      $('#showMoreId6').empty();
      $('#showMoreId6').append('<span style="cursor: pointer; color: #1d89c9">Show More</span>');
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
        this.getClaimDetails();
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
        this.InclusionofsearchingforschemePackageData();
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

  openHospital() {
    this.user = this.sessionService.decryptSessionData("user");
    this.user.sidebar = 0;
    let user = JSON.stringify(this.user);
    user = this.encDec.encText(user);
    let token = this.sessionService.decryptSessionData("auth_token");
    token = this.encDec.encText(token);
    let sessionId = sessionStorage.getItem("sessionId");
    sessionId = this.encDec.encText(sessionId);

    // user = user.replace("=","");
    // token = token.replace("=","");
    if (user.endsWith("=")) {
      user = user.substring(0, user.indexOf("="));
    }
    if (token.endsWith("=")) {
      token = token.substring(0, token.indexOf("="));
    }
    if (sessionId.endsWith("=")) {
      sessionId = sessionId.substring(0, sessionId.indexOf("="));
    }

    // window.location.href = environment.hospitalEmpanelmentUrl + user + '/' + token + '/' + sessionId;
    window.open(environment.hospitalEmpanelmentUrl + user + '/' + token + '/' + sessionId);

  }
}


