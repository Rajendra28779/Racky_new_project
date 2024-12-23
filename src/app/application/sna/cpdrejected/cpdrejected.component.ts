import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
declare let $: any;
import Swal from 'sweetalert2';
import { CpdrejectedserviceService } from '../../Services/cpdrejectedservice.service';
import { HeaderService } from '../../header.service';
import { TableUtil } from '../../util/TableUtil';
import { HospitalPackageMappingService } from '../../Services/hospital-package-mapping.service';
import { WardMasterService } from '../../Services/ward-master.service';
import { SnoCLaimDetailsService } from '../../Services/sno-claim-details.service';
import { DynamicreportService } from '../../Services/dynamicreport.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { PackageDetailsMasterService } from '../../Services/package-details-master.service';
import { ClaimRaiseServiceService } from '../../Services/claim-raise-service.service';

@Component({
  selector: 'app-cpdrejected',
  templateUrl: './cpdrejected.component.html',
  styleUrls: ['./cpdrejected.component.scss']
})
export class CpdrejectedComponent implements OnInit {
  record: any;
  rejectlist: any = [];
  user: any;
  stateCode: any;
  distCode: any;
  statelist: any = [];
  distList: any = [];
  hospitalList: any = [];
  Id: any;
  pageElement: any;
  currentPage: any;
  showPegi: boolean;
  txtsearchDate: any;
  isValidDate: boolean;
  fromDate: any;
  stateData: any = [];
  description: any;
  stateId: any = "";
  distId: any = "";
  hospitalId: any = "";
  dataRequest: any;
  currentPagenNum: any;
  month: any;
  year: any;
  packageHeaderItem: any = [];
  procedure: any = '';
  package: any = '';
  implant: any = '';
  highend: any = '';
  ward: any = '';
  keyword: string = 'packageheadername';
  keyword1: string = 'procedureDescription';
  keyword2: string = 'wardname';
  schemeidvalue: any
  schemeName: any
  @ViewChild('auto') auto;
  @ViewChild('auto1') auto1;
  @ViewChild('auto2') auto2;
  constructor(private cpdService: CpdrejectedserviceService, public route: Router, public headerService: HeaderService, private hospitalService: HospitalPackageMappingService,
    private wardService: WardMasterService,
    public snoService: SnoCLaimDetailsService,
    private service: DynamicreportService, private sessionService: SessionStorageService,
    private encryptionService: EncryptionService, public packageDetailsMasterService: PackageDetailsMasterService, private LoginServ: ClaimRaiseServiceService
  ) {
    this.headerService.setTitle('CPD Rejected');
  }

  ngOnInit() {
    this.currentPage = 1;
    this.pageElement = 20;
    this.user = this.sessionService.decryptSessionData("user");
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
    this.dataRequest = this.sessionService.decryptSessionData('requestData');
    this.currentPagenNum = this.sessionService.decryptSessionData("currentPageNum");
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
    var date = new Date();

    let year = date.getFullYear();
    let date1 = '01';
    // let months: any = date.getMonth() - 1;
    // if (months == -1) {
    //   this.month = 'Dec';
    //   this.year = year - 1;
    // } else {
    //   this.month = this.getMonthFrom(months);
    //   this.year = year;
    // }
    let months: any = date.getMonth();
    this.month = this.getMonthFrom(months);
    this.year = year;
    var frstDay = date1 + '-' + this.month + '-' + this.year;
    // let month = this.getMonthFrom(months);
    // var frstDay = date1 + "-" + month + "-" + year;
    //Date input placeholder
    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr("placeholder", "From Date *");
    // $('input[name="toDate"]').val('');
    $('input[name="toDate"]').attr("placeholder", "To Date *");
    // this.getcpdrejectedlist();
    this.getPackageHeader();
    this.getWard();
    this.getStateList();
    this.getTriggerList();
    if (
      this.dataRequest == null ||
      this.dataRequest == undefined ||
      this.dataRequest == ''
    ) {
      // this.getSnoClaimDetails();
    } else {
      let date = new Date(this.dataRequest.fromDate);
      let fromDate = this.getDates(date);
      $('input[name="fromDate"]').val(fromDate);
      let date1 = new Date(this.dataRequest.toDate);
      let toDate = this.getDates(date1);
      $('input[name="toDate"]').val(toDate);
      this.mortality = this.dataRequest.mortality;
      this.description = this.dataRequest.description;
      this.authMode = this.dataRequest.authMode;
      this.authMode = this.dataRequest.authMode;
      this.implant = this.dataRequest.implant;
      this.highend = this.dataRequest.highend;
      this.trigger = this.dataRequest.trigger;
    }
  }
  getDates(date) {
    let year = date.getFullYear();
    let date1 = date.getDate();
    if (date1.toString().length === 1) {
      date1 = '0' + date1;
    }
    let months = date.getMonth();
    let month = this.getMonthFrom(months);
    var frstDay = date1 + '-' + month + '-' + year;
    return frstDay;
  }
  getMonthFrom(month) {
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
    return month;
  }
  getcpdrejectedlist() {
    this.Id = this.user.userId;
    let flag = 'REJCT';
    let fromDate = $('#datepicker1').val();
    let toDate = $('#datepicker2').val();
    let stateCode1 = this.stateId;
    let distCode1 = this.distId;
    let hospitalCode = this.hospitalId;
    let mortality = this.mortality;
    let description = this.description;
    if (Date.parse(fromDate) > Date.parse(toDate)) {
      this.swal('Info', 'From Date should be less than To Date', 'info');
      return;
    }
    let schemeid = this.schemeidvalue;
    let schemecategoryid = this.schemecategoryidvalue;
    if (schemecategoryid == null || schemecategoryid == undefined || schemecategoryid == '') {
      schemecategoryid = "";
    } else {
      schemecategoryid = schemecategoryid;
    }
    let requestData = {
      userId: this.Id,
      flag: flag,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      stateCode: stateCode1,
      distCode: distCode1,
      hospitalCode: hospitalCode,
      mortality: mortality,
      cpdFlag: '',
      description: this.description,
      authMode: this.authMode,
      procedure: this.procedure,
      packages: this.package,
      implant: this.implant,
      highend: this.highend,
      ward: this.ward,
      trigger: this.trigger,
      schemeid: schemeid,
      schemecategoryid: schemecategoryid,
    };
    this.sessionService.encryptSessionData('requestData', requestData);
    this.cpdService.getcpdrejectedlist(requestData).subscribe(data => {
      this.rejectlist = data;
      this.record = this.rejectlist.length;
      this.traverseToRequiredPage();
      if (this.record > 0) {
        this.showPegi = true;
      }
      else {
        this.showPegi = false;
      }
    });
  }
  getDate(event: any) {
    this.fromDate = event.target.value;
  }

  validateDates(toDate: any) {
    this.isValidDate = true;
    if (new Date(this.fromDate) > new Date(toDate.target.value)) {
      this.swal("Info", "From date should be less then To date", 'info');
      this.rejectlist = { isError: true, errorMessage: 'End date should be grater then start date.' };
      this.isValidDate = false;
    }
    return this.isValidDate;
  }

  // Onsearch(){
  //   const URNNO = $('#txtsearchDate').val();
  //   if(URNNO == ""){
  //     this.swal('', 'Please Enter URN Number', 'info');
  //     this.getcpdrejectedlist();
  //   }
  //     this.rejectlist=this.rejectlist.filter((data)=>{
  //       return data.urn.match(URNNO);
  //     })
  // }
  getStateList() {
    this.cpdService.getStateList().subscribe((data) => {
      this.stateData = data;
      this.stateData.sort((a, b) => a.stateName.localeCompare(b.stateName));
      for (let j = 0; j < this.stateData.length; j++) {
        if (this.stateData[j].stateCode == '21') {
          this.statelist.push(this.stateData[j]);
        }
      }
      for (let i = 0; i < this.stateData.length; i++) {
        if (this.stateData[i].stateCode != '21') {
          this.statelist.push(this.stateData[i]);
        }
      }
      if (
        this.dataRequest == null ||
        this.dataRequest == undefined ||
        this.dataRequest == ""
      ) {
        this.getcpdrejectedlist();
      } else {
        if (
          this.dataRequest.stateCode != null ||
          this.dataRequest.stateCode != undefined ||
          this.dataRequest.stateCode != ""
        ) {
          this.stateId = this.dataRequest.stateCode;
          this.getDistrict(this.stateId);
        } else {
          this.getcpdrejectedlist();
        }
      }
    })
  }
  getDistrict(code) {
    this.stateCode = code;
    this.Id = this.user.userId;
    this.cpdService.getDistrictListByState(this.Id, this.stateCode).subscribe((data) => {
      this.distList = data;
      this.distList.sort((a, b) => a.DISTRICTNAME.localeCompare(b.DISTRICTNAME));
      if (
        this.dataRequest == null ||
        this.dataRequest == undefined ||
        this.dataRequest == ""
      ) {
        this.getcpdrejectedlist();
      } else {
        if (
          this.dataRequest.distCode != null ||
          this.dataRequest.distCode != undefined ||
          this.dataRequest.distCode != ""
        ) {
          this.distId = this.dataRequest.distCode;
          this.getHospital(this.distId);
        } else {
          this.getcpdrejectedlist();
        }
      }
      console.log(data)
    })
  }
  getHospital(code) {
    this.distCode = code;
    this.Id = this.user.userId;
    this.cpdService.getHospitalByDist(this.Id, this.stateCode, this.distCode).subscribe((data) => {
      this.hospitalList = data;
      if (
        this.dataRequest == null ||
        this.dataRequest == undefined ||
        this.dataRequest == ""
      ) {
        this.getcpdrejectedlist();
      } else {
        if (
          this.dataRequest.hospitalCode != null ||
          this.dataRequest.hospitalCode != undefined ||
          this.dataRequest.hospitalCode != ""
        ) {
          this.hospitalId = this.dataRequest.hospitalCode;
          this.getcpdrejectedlist();
        } else {
          this.getcpdrejectedlist();
        }
      }
      console.log(data);
    })
  }
  onaction(id: any, urn: any, packageCode: any, txnpackagedetailid: any) {
    let state = {
      transactionId: id,
      URN: urn,
      packageCode: packageCode,
      txnpackagedetailid: txnpackagedetailid,
    }
    localStorage.setItem("actionData", JSON.stringify(state));
    this.sessionService.encryptSessionData("currentPageNum", this.currentPage);
    this.route.navigate(['/application/cpdrejectedaction/action']);
  }
  resetField() {
    sessionStorage.removeItem('requestData');
    window.location.reload()
  }
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
    console.log(this.pageElement);
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  traverseToRequiredPage() {
    if (this.currentPagenNum != null && this.currentPagenNum != undefined) {
      this.currentPage = this.currentPagenNum;
      sessionStorage.removeItem("currentPageNum");
    } else {
      this.currentPage = 1;
    }
  }
  mortality: any = '';
  onChangemortality(data) {
    this.mortality = data;
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
  report: any = [];
  sno: any = {
    Slno: "",
    URN: "",
    claimNo: "",
    PatientName: "",
    phone: "",
    HospitalName: "",
    InvoiceNo: "",
    PackageID: "",
    ActualDateofAdmission: "",
    ActualDateofDischarge: "",
    HospitalClaimAmount: "",
    CPDMortality: "",
    HospitalMortality: ""
  };
  heading = [['Sl#', 'URN', 'Claim No', 'Patient Name', 'Phone No', 'Hospital Details', 'Invoice No', 'Package ID', 'Actual Date of Admission', 'Actual Date of Discharge', 'Hospital Claim Amount (₹)', 'CPD Mortality', 'Hospital Mortality']];
  downloadReport() {
    this.report = [];
    let claim: any;
    for (var i = 0; i < this.rejectlist.length; i++) {
      claim = this.rejectlist[i];
      console.log(claim);
      this.sno = [];
      this.sno.Slno = i + 1;
      this.sno.URN = claim.urn;
      this.sno.claimNo = claim.claimNo;
      this.sno.PatientName = claim.patientName;
      this.sno.phone = claim.phone;
      this.sno.HospitalName = claim.hospitalName + '(' + claim.hospital + ')';
      this.sno.InvoiceNo = claim.invoiceno;
      this.sno.PackageID = claim.packageCode;
      this.sno.ActualDateofAdmission = claim.actualDateOfAdmission;
      this.sno.ActualDateofDischarge = claim.actualDateOfDischarge;
      this.sno.HospitalClaimAmount = this.convertCurrency(claim.currenttotalamount);
      if (claim.mortality == 'Y') {
        this.sno.CPDMortality = "Yes";
      }
      else if (claim.mortality == 'N') {
        this.sno.CPDMortality = "No";
      }
      else {
        this.sno.CPDMortality = "N/A";
      }
      if (claim.hospitalMortality == 'Y') {
        this.sno.HospitalMortality = "Yes";
      }
      else if (claim.hospitalMortality == 'N') {
        this.sno.HospitalMortality = "No";
      }
      else {
        this.sno.HospitalMortality = "N/A";
      }
      this.report.push(this.sno);
    }
    let fromDate = $('#datepicker1').val();
    let toDate = $('#datepicker2').val();
    let stateName = 'All', districtName = 'All', hospitalName = 'All';
    for (var i = 0; i < this.statelist.length; i++) {
      if (this.stateCode == this.statelist[i].stateCode) {
        stateName = this.statelist[i].stateName;
      }
    }
    for (var i = 0; i < this.distList.length; i++) {
      if (this.distCode == this.distList[i].DISTRICTCODE) {
        districtName = this.distList[i].DISTRICTNAME;
      }
    }
    for (var i = 0; i < this.hospitalList.length; i++) {
      if (this.hospitalId == this.hospitalList[i].HOSPITALCODE) {
        hospitalName = this.hospitalList[i].HOSPITALNAME;
      }
    }
    if (this.description == null || this.description == undefined || this.description == '') {
      this.description = '';
    }
    let filter = [];
    filter.push([['Scheme Name', "GJAY"]]);
    filter.push([['Scheme Category Name', this.schemecategoryName]]);
    filter.push([['Actual Date of Discharge From', fromDate]]);
    filter.push([['Actual Date of Discharge To', toDate]]);
    filter.push([['State Name', stateName]]);
    filter.push([['District Name', districtName]]);
    filter.push([['Hospital Name', hospitalName]]);
    filter.push([['Mortality', this.findMortality1(this.mortality)]]);
    filter.push([['Description', this.description]]);
    filter.push([['Authentication Mode', this.findAuth(this.authMode)]]);
    TableUtil.exportListToExcelWithFilter(this.report, 'CPD Rejected List', this.heading, filter);
  }
  GetDate(str) {
    var arr = str.split("-");
    var months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    var month = months.indexOf(arr[1].toLowerCase());
    return new Date(parseInt(arr[2]), month, parseInt(arr[0]));
  }
  //convert string to date
  convertStringToDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy');
    return date;
  }
  //convert timestamp to date
  convertDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy, h:mm:ss a');
    return date;
  }
  //convert number to currency
  convertCurrency(amount: any) {
    var formatter = new CurrencyPipe('en-US');
    amount = formatter.transform(amount, '', '');
    return amount;
  }
  downloadPdf() {
    if (this.rejectlist.length == 0) {
      this.swal('info', 'No record found', 'info');
      return;
    } else {
      var doc = new jsPDF('l', 'mm', [320, 255]);
      doc.setFontSize(12);
      let fromDate = $('#datepicker1').val();
      let toDate = $('#datepicker2').val();
      doc.text('Scheme Name:' + "GJAY", 10, 5);
      if (this.schemecategoryName == undefined || this.schemecategoryName == null || this.schemecategoryName == '') {
        doc.text('Scheme Category Name:' + "All", 150, 5);
      } else {
        doc.text('Scheme Category Name:' + this.schemecategoryName, 150, 5);
      }
      doc.text('Actual Date of Discharge From:' + fromDate, 10, 10);
      doc.text('Actual Date of Discharge To:' + toDate, 150, 10);
      doc.text('Mortality:' + this.findMortality1(this.mortality), 10, 20);
      let stateName = 'All', districtName = 'All', hospitalName = 'All';
      for (var i = 0; i < this.statelist.length; i++) {
        if (this.stateCode == this.statelist[i].stateCode) {
          stateName = this.statelist[i].stateName;
        }
      }
      for (var i = 0; i < this.distList.length; i++) {
        if (this.distCode == this.distList[i].DISTRICTCODE) {
          districtName = this.distList[i].DISTRICTNAME;
        }
      }
      for (var i = 0; i < this.hospitalList.length; i++) {
        if (this.hospitalId == this.hospitalList[i].HOSPITALCODE) {
          hospitalName = this.hospitalList[i].HOSPITALNAME;
        }
      }
      if (this.description == null || this.description == undefined || this.description == '') {
        this.description = '';
      }
      doc.text('State Name:' + stateName, 60, 20);
      doc.text('District Name:' + districtName, 150, 20);
      doc.text('Hospital Name:' + hospitalName, 10, 30);
      doc.text('Description:' + this.description, 10, 40);
      doc.text('Authentication Mode:' + this.findAuth(this.authMode), 10, 50);
      doc.text("Generated On: " + this.convertDate(new Date()), 10, 60);
      doc.text("Generated By: " + this.user.fullName, 150, 60);
      doc.text("CPD Rejected List", 110, 70);
      var col = [['Sl#', 'URN', 'Claim No', 'Patient Name', 'Phone No', 'Hospital Details', 'Invoice No', 'Package ID', 'Actual Date of Admission', 'Actual Date of Discharge', 'Hospital Claim Amount (₹)', 'CPD Mortality', 'Hospital Mortality']];
      var rows = [];
      var claim: any;
      for (var i = 0; i < this.rejectlist.length; i++) {
        claim = this.rejectlist[i];
        var temp = [(i + 1), claim.urn, claim.claimNo, claim.patientName, claim.phone, claim.hospitalName + '(' + claim.hospital + ')', claim.invoiceno, claim.packageCode, claim.actualDateOfAdmission, claim.actualDateOfDischarge, this.convertCurrency(claim.currenttotalamount),
        this.findMortality(claim.mortality), this.findMortality(claim.hospitalMortality)];
        rows.push(temp);
      }
      autoTable(doc, {
        head: col,
        body: rows,
        theme: 'grid',
        startY: 80,
        styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
        bodyStyles: { overflow: 'linebreak', cellWidth: 'wrap', lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: { overflow: 'linebreak', cellWidth: 'wrap', lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 25 },
          2: { cellWidth: 25 },
          3: { cellWidth: 25 },
          4: { cellWidth: 25 },
          5: { cellWidth: 40 },
          6: { cellWidth: 20 },
          7: { cellWidth: 20 },
          8: { cellWidth: 20 },
          9: { cellWidth: 20 },
          10: { cellWidth: 25 },
          11: { cellWidth: 15 },
          12: { cellWidth: 15 },

        },
      });
      doc.save('CPD Rejected List.pdf');
    }

  }
  findMortality(value: any) {
    if (value == 'Y') {
      value = "Yes";
    }
    else if (value == 'N') {
      value = "No";
    }
    else {
      value = "N/A";
    }
    return value;
  }
  findMortality1(value: any) {
    if (value == 'Y') {
      value = "Yes";
    }
    else if (value == 'N') {
      value = "No";
    }
    else {
      value = "All";
    }
    return value;
  }
  authMode: any = '';
  onChangeAuthMode(event) {
    this.authMode = event.target.value;
  }
  findAuth(value: any) {
    if (value == '1') {
      value = "POS";
    }
    else if (value == '2') {
      value = "IRIS";
    }
    else if (value == '3') {
      value = "OTP";
    }
    else if (value == '4') {
      value = "Override";
    }
    else {
      value = "All";
    }
    return value;
  }
  getPackageHeader() {
    this.hospitalService.getallPackageHeaders().subscribe((data: any) => {
      this.packageHeaderItem = data;
      console.log(this.packageHeaderItem)
      if (this.dataRequest) {
        this.procedure = this.dataRequest.procedure;
        if (this.schemeidvalue != null && this.schemeidvalue != '' && this.schemeidvalue != undefined) {
          this.getPackageSchemeName(this.procedure);
        } else {
          this.getPackageName(this.procedure);
        }
        // if (
        //   this.dataRequest.procedure != null ||
        //   this.dataRequest.procedure != undefined ||
        //   this.dataRequest.procedure != ''
        // ) {
        //   this.procedure = this.dataRequest.procedure;
        //   this.getPackageName(this.procedure);
        // } else {
        //   this.getcpdrejectedlist();
      }
    })
  }
  wardList: any = [];
  getWard() {
    this.wardService.getallWardCategorydata().subscribe((data: any) => {
      this.wardList = data;
      console.log(this.wardList)
      if (
        this.dataRequest.ward != null ||
        this.dataRequest.ward != undefined ||
        this.dataRequest.ward != ''
      ) {
        this.ward = this.dataRequest.ward;
      }
    })
  }
  packageResponseData: any;
  packageList: any = [];
  getPackageName(data) {
    this.auto1.clear();
    let procedureCode = data;
    this.snoService.getPackageName(procedureCode).subscribe(
      (response) => {
        console.log(response);
        this.packageResponseData = response;
        if (this.packageResponseData.status == 'success') {
          let data = JSON.parse(this.packageResponseData.data);
          this.packageList = data.packageArray;

          if (
            this.dataRequest.packages != null ||
            this.dataRequest.packages != undefined ||
            this.dataRequest.packages != ''
          ) {
            this.package = this.dataRequest.packages;
            // this.getcpdrejectedlist();
          }
          console.log(data);

        } else {
          this.swal('Error', 'Something went wrong.', 'error');
        }
      },
      (error) => {
        console.log(error);
        this.swal('Error', 'Something went wrong.', 'error');
      }
    );
  }
  onChangePackage(code) {
    this.package = code;
  }
  onChangeImplant(id) {
    this.implant = id;
  }
  onChangeHighend(id) {
    this.highend = id;
  }
  onChangeWard(wardName) {
    this.ward = wardName
  }

  selectEvent(item) {
    this.procedure = item.packageheadercode;
    this.getPackageName(this.procedure);
  }

  clearEvent() {
    this.procedure = '';
    this.getPackageName(this.procedure);
  }

  selectEvent1(item) {
    this.package = item.procedureCode;
  }

  clearEvent1() {
    this.package = '';
  }

  selectEvent2(item) {
    this.ward = item.wardname;
  }

  clearEvent2() {
    this.ward = '';
  }
  claimDetails: any = [];
  gethistoryclaimno(claimno: any) {
    this.claimDetails = []
    this.snoService.getclaimnodetails(claimno).subscribe(
      (data: any) => {
        let resData = data;
        if (resData.status == 'success') {
          let details = JSON.parse(resData.details);
          this.claimDetails = details;
        } else {
          this.swal('error', 'Something Went Wrong', 'error')
          this.claimDetails = []
        }
      }
    )
  }
  trigger: any = 0;
  onChangemamdetrigger(trigger) {
    this.trigger = trigger;
  }
  triggerList: any = [];
  getTriggerList() {
    this.service.findAllActiveTrigger().subscribe((data: any) => {
      console.log(data);
      this.triggerList = data;
    })
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
    }else{
      this.schemecategoryidvalue = '';
      this.schemecategoryName = "All";
    }
    if (this.schemecategoryidvalue == null || this.schemecategoryidvalue == undefined || this.schemecategoryidvalue == '' || this.schemecategoryidvalue == "") {
      this.InclusionofsearchingforschemePackageData();
    } else {
      this.InclusionofsearchingforschemePackageData();
    }
  }
  //for procedure for Selected Scheme Data
  packageschemename: any = [];
  text: any;
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
        this.packageHeaderItem = [];
        for (let i = 0; i < this.packageschemename.length; i++) {
          let packageheadername = this.packageschemename[i].packageheader;
          this.text = this.packageschemename[i].packageheader;
          const matches = this.text.match(/\((.*)\)/);
          let packageheadercode = matches ? matches[1] : '';
          let data = {
            packageheadername: packageheadername,
            packageheadercode: packageheadercode
          }
          this.packageHeaderItem.push(data);
        }
      } else {
        this.swal('', 'Something went wrong.', 'error');
      }

    });
  }

  packagenamescheme: any = [];
  getPackageSchemeName(procedurecode: any) {
    this.auto1.clear();
    this.package = '';
    this.packageList = [];
    let schemeid = this.schemeidvalue;
    let schemecategoryid = this.schemecategoryidvalue;
    if (schemecategoryid == null || schemecategoryid == undefined || schemecategoryid == '') {
      schemecategoryid = "";
    } else {
      schemecategoryid = schemecategoryid;
    }
    this.LoginServ.getPackageProcedurecodeSchemeWise(schemeid, schemecategoryid, procedurecode).subscribe(data => {
      if (data != null || data != '') {
        this.packagenamescheme = data;
        for (let i = 0; i < this.packagenamescheme.length; i++) {
          let procedureDescription = this.packagenamescheme[i].packagename;
          this.text = this.packagenamescheme[i].packagename;
          const matches = this.text.match(/\((.*)\)/);
          let procedureCode = matches ? matches[1] : '';
          let data = {
            procedureDescription: procedureDescription,
            procedureCode: procedureCode
          }
          this.packageList.push(data);
        }
        if (this.dataRequest) {
          this.package = this.dataRequest.packages;
        }
      } else {
        this.swal('', 'Something went wrong.', 'error');
      }
    });
  }
}



