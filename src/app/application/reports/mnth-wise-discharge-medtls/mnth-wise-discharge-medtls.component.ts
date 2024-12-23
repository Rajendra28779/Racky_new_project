import { Component, OnInit } from '@angular/core';
import { MnthWiseDischargeMeService } from '../../Services/mnth-wise-discharge-me.service';
import { HeaderService } from '../../header.service';
import { Router } from '@angular/router';
import { ClaimRaiseServiceService } from '../../Services/claim-raise-service.service';
import Swal from 'sweetalert2';
import { TableUtil } from '../../util/TableUtil';
import jsPDF from 'jspdf';
import { CurrencyPipe, DatePipe } from '@angular/common';
import autoTable from 'jspdf-autotable';
import { environment } from 'src/environments/environment';
import { JwtService } from 'src/app/services/jwt.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-mnth-wise-discharge-medtls',
  templateUrl: './mnth-wise-discharge-medtls.component.html',
  styleUrls: ['./mnth-wise-discharge-medtls.component.scss']
})
export class MnthWiseDischargeMedtlsComponent implements OnInit {
  packagenamedata: any
  showPegi: boolean;
  txtsearchDate: any;
  listData: any = [];
  pageElement: any;
  currentPage: any;
  user: any;
  gramwisedata: any = [];
  record: any;
  sum: number;
  sum1: number;
  sum2: number;
  blockId: any;
  districtId: any;
  blockName: any;
  stateName: any;
  distName: any;
  hospitalName: any;
  formDate: any;
  toDate: any;
  searchName: any;
  public serachdata: any = [];
  packageName: any;
  serchtype: any;
  dischargeData: boolean;
  stat: any;
  dist: any;
  hospitalCode: any;
  monthWisePackageData: any = [];
  userId: any;
  showhide: any;
  cpdRemark: any;
  snaRemark: any;
  constructor(private mnthWiseDischargeMeService: MnthWiseDischargeMeService, public headerService: HeaderService,private sessionService: SessionStorageService,
    private route: Router, private LoginServ: ClaimRaiseServiceService, private jwtService: JwtService) { }

  ngOnInit(): void {
    this.serchtype = localStorage.getItem('serchtype');
    this.stat = localStorage.getItem('stat');
    this.dist = localStorage.getItem('dist');
    this.hospitalCode = localStorage.getItem('hospitalCode');
    this.stateName = localStorage.getItem('stateName');
    this.distName = localStorage.getItem('distName');
    this.hospitalName = localStorage.getItem('hospitalName');
    this.formDate = localStorage.getItem('formDate');
    this.toDate = localStorage.getItem('toDate');
    this.searchName = localStorage.getItem('searchName');
    this.showhide = localStorage.getItem('showhide');
    this.Inclusionofsearchingforpackagedetails();
    if (this.serchtype == 1) {
      this.dischargeData = true;
    }
    this.search();

  }
  getPackageName(event: any) {
    for (let i = 0; i < this.serachdata.length; i++) {
      if (this.serachdata[i].id == event) {
        this.packageName = this.serachdata[i].procedurecode;
        this.LoginServ.getdatapackgaename(this.packageName).subscribe(data => {
          this.packagenamedata = data;
          console.log(this.packagenamedata);
        });
      }
    }
  }

  Inclusionofsearchingforpackagedetails() {
    this.LoginServ.getsearcdetails().subscribe(data => {
      this.serachdata = data;
      console.log(data);

    });
  }
  packageCodedata: any;
  search() {
    // this.user = JSON.parse(sessionStorage.getItem("user"));
    this.user = this.sessionService.decryptSessionData("user");
    this.userId = this.user.userId;
    let Package = this.packageName;
    this.packageCodedata = $('#Package').val();
    let packageName = $('#PackageName').val();
    let userId = this.user.userId;
    if (Package == undefined) {
      Package = '';
    }
    if (packageName == null || packageName == undefined || packageName == '') {
      packageName = '';
    }
    this.mnthWiseDischargeMeService.monthWiseDetailData(userId, this.formDate, this.toDate, this.stat, this.dist, this.hospitalCode, this.serchtype, Package,
      packageName).subscribe(
        (result) => {
          console.log(result);
          this.gramwisedata = [];
          this.gramwisedata = result;
          this.record = this.gramwisedata.length;
          if (this.record > 0) {
            this.currentPage = 1;
            this.pageElement = 100;
            this.showPegi = true;
          }
          else {
            this.showPegi = false;
          }
        },
        (error) => console.log(error)
      )
  }

  reset() {
    window.location.reload();
  }

  report: any = [];
  snaPendingClaimList: any = {
    slNo: "",
    urn: "",
    invoiceNo: "",
    stateName: "",
    districtName: "",
    hospitalName: "",
    hospitalcode: "",
    hospitaldistrcitname: "",
    patientName: "",
    packageCategCode: "",
    procedureName: "",
    packageName: "",
    isPreAuth: "",
    actualDateAdmission: "",
    dateOfAdmission: "",
    totalPackageCost: "",
    blockedAmt: "",
    surgicalType: "",
    varificationMode: "",
    packageSubCatg: "",
    packageCode: ""
  };

  heading = [['Sl No.', 'URN', 'Invoice No.', 'State Name', 'District Name', 'Hospital Name', 'Hospital Code', 'Hospital District Name', 'Patient Name', 'Package Header', 'Procedure Name',
    'Package Code', 'Package Name,','IS Pre Auth ', 'Actual Date of Admission', 'Date of Blocking', 'Total Package Cost',
    'Blocked Amount', 'Surgical Type', 'Verification Mode']];

  statename: any = "ALL";
  districtName: any = "ALL";
  // hospitalName: any = "ALL";

  downloadReport(type) {
    if (this.gramwisedata == null || this.gramwisedata.length == 0) {
      this.swal("Info", "No Record Found", "info");
      return;
    }
    this.report = [];
    let item: any;
    for (var i = 0; i < this.gramwisedata.length; i++) {
      item = this.gramwisedata[i];
      this.snaPendingClaimList = [];
      this.snaPendingClaimList.slNo = i + 1;
      this.snaPendingClaimList.urn = item.urn;
      this.snaPendingClaimList.invoiceNo = item.invoiceNo;
      this.snaPendingClaimList.stateName = item.stateName;
      this.snaPendingClaimList.districtName = item.districtName;
      this.snaPendingClaimList.hospitalName = item.hospitalName;
      this.snaPendingClaimList.hospitalcode = item.hospitalCode;
      this.snaPendingClaimList.hospitaldistrcitname = item.hospitaldistrictname;
      this.snaPendingClaimList.patientName = item.patientName;
      this.snaPendingClaimList.packageCategCode = item.packageSubCatg + '(' + item.packageName + ')';
      this.snaPendingClaimList.procedureName = item.procedureName;
      this.snaPendingClaimList.packageCode = item.packageCode;
      this.snaPendingClaimList.packageName = item.packageName;
      this.snaPendingClaimList.isPreAuth = item.isPreAuth;
      this.snaPendingClaimList.actualDateAdmission = this.convertDate1(item.actualDateAdmission);
      this.snaPendingClaimList.dateOfAdmission = this.convertDate4(item.dateOfAdmission);
      this.snaPendingClaimList.totalPackageCost = this.convertCurrency4(item.totalPackageCost);
      this.snaPendingClaimList.blockedAmt = this.convertCurrency3(item.blockedAmt);
      this.snaPendingClaimList.surgicalType = item.surgicalType;
      this.snaPendingClaimList.varificationMode = item.varificationMode;
      this.report.push(this.snaPendingClaimList);
      console.log(this.report);
    }

    if (type == 1) {
      let filter = [];
      filter.push([['From Date :-', this.formDate]]);
      filter.push([['To Date:-', this.toDate]]);
      filter.push([['State Name:-', this.stateName]]);
      filter.push([['District Name:-', this.distName]]);
      filter.push([['Hospital Name :-', this.hospitalName]]);
      filter.push([['Search By:-', this.searchName]]);
      filter.push([['Search For Record:-', this.showhide]]);
      TableUtil.exportListToExcelWithFilter(this.report, "Download Discharge and Admission Dump List", this.heading, filter);
    } 
  }



  report1: any = [];
  snaPendingClaimList1: any = {
    slNo: "",
    urn: "",
    invoiceNo: "",
    hosstateName: "",
    hospitalName: "",
    hospitalCode: "",
    hosdistrictName: "",
    patientName: "",
    patientNo: "",
    gender: "",
    age: "",
    familyHeader: "",
    varyfyName: "",
    pStateName: "",
    pDistName: "",
    pBlockName: "",
    pPanchytName: "",
    pVilName: "",
    mortality: "",
    actualDateAdmission: "",
    actualDateDischarge: "",
    packageCategCode: "",
    procedureName: "",
    packageName: "",
    cpdApprovedAmt: "",
    snaApprovedAmt: "",
    hospitalClaimAmt: "",
    claimid: "",
    cpdRemark: "",
    snaRemark: ""
  };

  heading1 = [['Sl No.', 'URN', 'Claim No.', 'Invoice No.', 'Hospital State Name', 'Hospital District Name', 'Hospital Name', 'Hospital Code', 'Patient Name', 'Patient No.', 'Gender', 'Age', 'Family Header',
    'Verifier Name ', 'State Name', 'District Name', 'Block Name', 'Panchayat Name', 'Village Name', 'Mortality', 'Actual Admission', 'Actual Discharge',
    'Package Catgory Code', 'Procedure Name', 'CPD Remark', 'SNA Remark', 'CPD Approved Amount', 'SNA Approved Amount', 'Claimed Amount']];

  downloadList() {
    if (this.gramwisedata == null || this.gramwisedata.length == 0) {
      this.swal("Info", "No Record Found", "info");
      return;
    }
    this.report1 = [];
    let item: any;
    for (var i = 0; i < this.gramwisedata.length; i++) {
      item = this.gramwisedata[i];
      this.snaPendingClaimList1 = [];
      this.snaPendingClaimList1.slNo = i + 1;
      this.snaPendingClaimList1.urn = item.urn;
      this.snaPendingClaimList1.claimid = item.claimid;
      this.snaPendingClaimList1.invoiceNo = item.invoiceNo;
      this.snaPendingClaimList1.hosstateName = item.hosstateName;
      this.snaPendingClaimList1.hosdistrictName = item.hosdistrictName;
      this.snaPendingClaimList1.hospitalName = item.hospitalName;
      this.snaPendingClaimList1.hospitalCode = item.hospitalCode;
      // this.snaPendingClaimList1.hospitaldistrictname = item.hospitaldistrictname;
      this.snaPendingClaimList1.patientName = item.patientName;
      this.snaPendingClaimList1.patientNo = item.patientNo;
      this.snaPendingClaimList1.gender = item.gender;
      this.snaPendingClaimList1.age = item.age;
      this.snaPendingClaimList1.familyHeader = item.familyHeader;
      this.snaPendingClaimList1.varyfyName = item.varyfyName;
      this.snaPendingClaimList1.pStateName = item.pStateName;
      this.snaPendingClaimList1.pDistName = item.pDistName;
      this.snaPendingClaimList1.pBlockName = item.pBlockName;
      this.snaPendingClaimList1.pPanchytName = item.pPanchytName;
      this.snaPendingClaimList1.pVilName = item.pVilName;
      this.snaPendingClaimList1.mortality = item.mortality;
      this.snaPendingClaimList1.actualDateAdmission = this.convertDate1(item.actualDateAdmission);
      this.snaPendingClaimList1.actualDateDischarge = this.convertDate2(item.actualDateDischarge);
      this.snaPendingClaimList1.packageCategCode = item.packageCategCode;
      this.snaPendingClaimList1.procedureName = item.procedureName + '(' + item.packageName + ')';
      this.snaPendingClaimList1.cpdRemark = item.cpdRemark;
      this.snaPendingClaimList1.snaRemark = item.snaRemark
      this.snaPendingClaimList1.cpdApprovedAmt = this.convertCurrency(item.cpdApprovedAmt);
      this.snaPendingClaimList1.snaApprovedAmt = this.convertCurrency1(item.snaApprovedAmt);
      this.snaPendingClaimList1.hospitalClaimAmt = this.convertCurrency2(item.hospitalClaimAmt);
      this.report1.push(this.snaPendingClaimList1);
      console.log(this.report1);
    }
    let filter = [];
    filter.push([['From Date :-', this.formDate]]);
    filter.push([['To Date:-', this.toDate]]);
    filter.push([['State Name:-', this.stateName]]);
    filter.push([['District Name:-', this.distName]]);
    filter.push([['Hospital Name :-', this.hospitalName]]);
    filter.push([['Search By:-', this.searchName]]);
    filter.push([['Search For Name:-', this.showhide]]);
    TableUtil.exportListToExcelWithFilter(this.report1, "Download Discharge and Admission Dump List", this.heading1, filter);
  }

  details(transactionId: any, txnpackagedetailid: any) {
    localStorage.setItem("txnid", transactionId);
    localStorage.setItem("pkgid", txnpackagedetailid);
    this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/downloadadmissiondumpdata'); });
  }

  details1(claim: any, urn: any, authorizedCode: any, hospitalCode: any, transactionId: any) {
    let trnsId = transactionId;
    let clmId = claim;
    if (clmId != null || clmId != undefined) {
      let state = {
        Urn: urn
      }
      localStorage.setItem("claimid", claim);
      localStorage.setItem("trackingdetails", JSON.stringify(state));
      localStorage.setItem("token", this.jwtService.getJwtToken());
      this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/trackingdetails'); });
    }
  }

  convertDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy hh:mm:ss a');
    return date;
  }
  convertDate1(actualDateAdmission) {
    var datePipe = new DatePipe("en-US");
    actualDateAdmission = datePipe.transform(actualDateAdmission, 'dd-MMM-yyyy');
    return actualDateAdmission;
  }

  convertDate2(actualDateDischarge) {
    var datePipe = new DatePipe("en-US");
    actualDateDischarge = datePipe.transform(actualDateDischarge, 'dd-MMM-yyyy');
    return actualDateDischarge;
  }

  convertDate4(dateOfAdmission) {
    var datePipe = new DatePipe("en-US");
    dateOfAdmission = datePipe.transform(dateOfAdmission, 'dd-MMM-yyyy');
    return dateOfAdmission;
  }

  convertCurrency(cpdApprovedAmt: any) {
    var formatter = new CurrencyPipe('en-US');
    cpdApprovedAmt = formatter.transform(cpdApprovedAmt, '', '');
    return cpdApprovedAmt;
  }

  convertCurrency1(snaApprovedAmt: any) {
    var formatter = new CurrencyPipe('en-US');
    snaApprovedAmt = formatter.transform(snaApprovedAmt, '', '');
    return snaApprovedAmt;
  }
  convertCurrency2(hospitalClaimAmt: any) {
    var formatter = new CurrencyPipe('en-US');
    hospitalClaimAmt = formatter.transform(hospitalClaimAmt, '', '');
    return hospitalClaimAmt;
  }

  convertCurrency4(totalPackageCost: any) {
    var formatter = new CurrencyPipe('en-US');
    totalPackageCost = formatter.transform(totalPackageCost, '', '');
    return totalPackageCost;
  }
  convertCurrency3(blockedAmt: any) {
    var formatter = new CurrencyPipe('en-US');
    blockedAmt = formatter.transform(blockedAmt, '', '');
    return blockedAmt;
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
  viewData(item: any) {
    this.cpdRemark = item;
  }
  viewData1(item: any) {
    this.snaRemark = item;
  }
}
