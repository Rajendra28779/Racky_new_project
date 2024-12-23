import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SnoCLaimDetailsService } from '../../Services/sno-claim-details.service';
import { HeaderService } from '../../header.service';
// import { PendingService } from '../../pending.service';
import { DatePipe, CurrencyPipe } from '@angular/common';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { TableUtil } from '../../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { PackageDetailsMasterService } from '../../Services/package-details-master.service';
import { ClaimRaiseServiceService } from '../../Services/claim-raise-service.service';
declare let $: any;

@Component({
  selector: 'app-claims-on-hold',
  templateUrl: './claims-on-hold.component.html',
  styleUrls: ['./claims-on-hold.component.scss']
})
export class ClaimsOnHoldComponent implements OnInit {

  // childmessage: any;
  user: any;
  statelist: Array<any> = [];
  stateCode: any;
  userId: any;
  distList: Array<any> = [];
  distCode: any;
  hospitalList: Array<any> = [];
  txtsearchDate: any;
  months: string;
  year: number;
  snoclaimlist: any = [];
  showPegi: boolean;
  record: any;
  currentPage: any;
  pageElement: any;
  totalClaimCount: any;
  dataRequest: any;
  distId: any = '';
  stateId: any = '';
  currentPagenNum: any;
  description: any;
  responseData: any;
  flag: any;
  fromDate: any;
  toDate: any;
  stateCode1: any;
  distCode1: any;
  hospitalCode: any;
  schemeidvalue: any = 1
  schemeName: any
  constructor(private sessionService: SessionStorageService, public headerService: HeaderService, public snoService: SnoCLaimDetailsService, public route: Router,
    private encryptionService: EncryptionService, public packageDetailsMasterService: PackageDetailsMasterService, private LoginServ: ClaimRaiseServiceService
  ) { }

  ngOnInit(): void {
    this.getSchemeData();
    this.headerService.setTitle('Claims On Hold');
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
    this.user = this.sessionService.decryptSessionData("user");
    this.dataRequest = this.sessionService.decryptSessionData('requestData');
    this.currentPagenNum = this.sessionService.decryptSessionData('currentPageNum');

    this.getStateList();
    this.currentPage = 1;
    this.pageElement = 20;
    $('.selectpicker').selectpicker();

    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      // endDate: '0d',
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
    let date = new Date();
    let year = date.getFullYear();
    let date1 = '01';
    let month: any = date.getMonth() - 1;
    if (month == -1) {
      this.months = 'Dec';
      this.year = year - 1;
    } else {
      this.months = this.getMonthFrom(month);
      this.year = year;
    }
    let frstDay = date1 + '-' + this.months + '-' + this.year;

    //Date input placeholder
    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr('placeholder', 'From Date *');

    // $('input[name="toDate"]').val('');
    $('input[name="toDate"]').attr('placeholder', 'To Date *');
    if (
      this.dataRequest == null ||
      this.dataRequest == undefined ||
      this.dataRequest == ''
    ) {
    } else {
      let date = new Date(this.dataRequest.fromDate);
      let fromDate = this.getDate(date);
      $('input[name="fromDate"]').val(fromDate);
      let date1 = new Date(this.dataRequest.toDate);
      let toDate = this.getDate(date1);
      $('input[name="toDate"]').val(toDate);
      this.mortality = this.dataRequest.mortality;
      this.description = this.dataRequest.description;
      this.authMode = this.dataRequest.authMode;
    }
  }

  getDate(date) {
    let year = date.getFullYear();
    let date1 = date.getDate();
    if (date1.toString().length == 1) {
      date1 = '0' + date1;
    }
    let months = date.getMonth();
    let month = this.getMonthFrom(months);
    let frstDay = date1 + '-' + month + '-' + year;
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


  onAction(id: any, urn: any, packageCode: any) {
    let state = {
      transactionId: id,
      URN: urn,
      packageCode: packageCode,
    };
    localStorage.setItem('actionData', JSON.stringify(state));
    this.sessionService.encryptSessionData('currentPageNum', this.currentPage);
    this.route.navigate(['/application/claimsOnHold/action']);
  }

  stateData: any = [];
  getStateList() {
    this.statelist = [];
    this.snoService.getStateList().subscribe((data: any) => {
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
        this.dataRequest == ''
      ) {
        this.getSnoClaimDetails();
      } else {
        if (
          this.dataRequest.stateCode != null ||
          this.dataRequest.stateCode != undefined ||
          this.dataRequest.stateCode != ''
        ) {
          this.stateId = this.dataRequest.stateCode;
          this.getDistrict(this.stateId);
        } else {
          this.getSnoClaimDetails();
        }
      }
    });
  }

  getDistrict(code) {
    this.distList = [];
    this.stateCode = code;
    this.userId = this.user.userId;
    this.snoService.getDistrictListByState(this.userId, this.stateCode).subscribe(
      (data: any) => {
        this.distList = data;
        this.distList.sort((a, b) =>
          a.DISTRICTNAME.localeCompare(b.DISTRICTNAME)
        );
        if (
          this.dataRequest == null ||
          this.dataRequest == undefined ||
          this.dataRequest == ''
        ) {
          this.getSnoClaimDetails();
        } else {
          if (
            this.dataRequest.distCode != null ||
            this.dataRequest.distCode != undefined ||
            this.dataRequest.distCode != ''
          ) {
            this.distId = this.dataRequest.distCode;
            this.getHospital(this.distId);
          } else {
            this.getSnoClaimDetails();
          }
        }
      }
    );
  }

  hospitalId: any = '';
  getHospital(code) {
    this.hospitalList = [];
    this.distCode = code;
    this.userId = this.user.userId;
    this.snoService.getHospitalByDist(this.userId, this.stateCode, this.distCode).subscribe(
      (data: any) => {
        this.hospitalList = data;
        if (
          this.dataRequest == null ||
          this.dataRequest == undefined ||
          this.dataRequest == ''
        ) {
          this.getSnoClaimDetails();
        } else {
          if (
            this.dataRequest.hospitalCode != null ||
            this.dataRequest.hospitalCode != undefined ||
            this.dataRequest.hospitalCode != ''
          ) {
            this.hospitalId = this.dataRequest.hospitalCode;
            this.getSnoClaimDetails();
          } else {
            this.getSnoClaimDetails();
          }
        }
      }
    );
  }

  getSnoClaimDetails() {
    let userId = this.user.userId;
    this.flag = 'APRV';
    this.fromDate = $('#datepicker1').val();
    this.toDate = $('#datepicker2').val();
    this.stateCode1 = this.stateId;
    this.distCode1 = this.distId;
    this.hospitalCode = this.hospitalId;
    this.mortality = this.mortality
    if (Date.parse(this.fromDate) > Date.parse(this.toDate)) {
      this.swal('', ' From Date should be less than To Date', 'error');
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
      userId: userId,
      flag: this.flag,
      fromDate: new Date(this.fromDate),
      toDate: new Date(this.toDate),
      stateCode: this.stateCode1,
      distCode: this.distCode1,
      hospitalCode: this.hospitalCode,
      mortality: this.mortality,
      description: this.description,
      authMode: this.authMode,
      schemeid: schemeid,
      schemecategoryid: schemecategoryid,
    };
    this.sessionService.encryptSessionData('requestData', requestData);
    this.snoService.getClaimsOnHoldList(requestData).subscribe(
      (response) => {
        this.responseData = response;
        if (this.responseData.status == 'success') {
          this.snoclaimlist = this.responseData.data;
          this.totalClaimCount = this.snoclaimlist.length;
          this.record = this.snoclaimlist.length;
          if (this.record > 0) {
            this.showPegi = true;
          } else {
            this.showPegi = false;
            this.swal('Info', 'No data found', 'info');
          }
          this.traverseToRequiredPage();
        } else {
          this.swal('Error', 'Something went wrong.', 'error');
        }
      },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      }
    );
  }

  resetField() {
    sessionStorage.removeItem('requestData');
    window.location.reload();
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }

  traverseToRequiredPage() {
    if (this.currentPagenNum != null && this.currentPagenNum != undefined) {
      this.currentPage = this.currentPagenNum;
      sessionStorage.removeItem('currentPageNum');
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
    caseNo: "",
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
  heading = [
    [
      'Sl No',
      'URN',
      'Claim No',
      'Case No',
      'Patient Name',
      'Phone No',
      'Hospital Details',
      'Invoice No',
      'Package ID',
      'Actual Date of Admission',
      'Actual Date of Discharge',
      'Hospital Claim Amount (₹)',
      'CPD Mortality',
      'Hospital Mortality']];

  downloadReport() {
    this.report = [];
    let claim: any;
    for (let i = 0; i < this.snoclaimlist.length; i++) {
      claim = this.snoclaimlist[i];
      this.sno = [];
      this.sno.Slno = (i + 1).toString();
      this.sno.URN = claim.urn;
      this.sno.claimNo = claim.claimNo;
      this.sno.caseNo = claim.caseNo ? claim.caseNo : 'N/A';
      this.sno.PatientName = claim.patientName;
      this.sno.phone = claim.phone;
      this.sno.HospitalName = claim.hospitalName + ' (' + claim.hospitalCode + ')';
      this.sno.InvoiceNo = claim.invoiceNumber;
      this.sno.PackageID = claim.packageCode;
      this.sno.ActualDateofAdmission = claim.actualDateOfAdmission;
      this.sno.ActualDateofDischarge = claim.actualDateOfDischarge;
      this.sno.HospitalClaimAmount = this.convertCurrency(claim.currentTotalAmount);
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
    let stateName = 'All', districtName = 'All', hospitalName = 'All';
    for (let i = 0; i < this.statelist.length; i++) {
      if (this.stateCode == this.statelist[i].stateCode) {
        stateName = this.statelist[i].stateName;
      }
    }
    for (let i = 0; i < this.distList.length; i++) {
      if (this.distCode == this.distList[i].DISTRICTCODE) {
        districtName = this.distList[i].DISTRICTNAME;
      }
    }
    for (let i = 0; i < this.hospitalList.length; i++) {
      if (this.hospitalCode == this.hospitalList[i].HOSPITALCODE) {
        hospitalName = this.hospitalList[i].HOSPITALNAME;
      }
    }
    if (this.description == null || this.description == undefined || this.description == '') {
      this.description = '';
    }
    let filter = [];
    filter.push([['Scheme Name', "GJAY"]]);
    filter.push([['Scheme Category Name', this.schemecategoryName]]);
    filter.push([['Actual Date of Discharge From', this.fromDate]]);
    filter.push([['Actual Date of Discharge To', this.toDate]]);
    filter.push([['State Name', stateName]]);
    filter.push([['District Name', districtName]]);
    filter.push([['Hospital Name', hospitalName]]);
    filter.push([['Mortality', this.findMortality1(this.mortality)]]);
    filter.push([['Description', this.description]]);
    filter.push([['Authentication Mode', this.findAuth(this.authMode)]]);
    TableUtil.exportListToExcelWithFilter(this.report, 'Claims On Hold List', this.heading, filter);
  }

  //convert timestamp to date
  convertDate(date) {
    let datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy, h:mm:ss a');
    return date;
  }
  //convert number to currency
  convertCurrency(amount: any) {
    let formatter = new CurrencyPipe('en-US');
    amount = formatter.transform(amount, '', '');
    return amount;
  }

  downloadPdf() {
    if (this.snoclaimlist.length == 0) {
      this.swal('info', 'No record found', 'info');
      return;
    } else {
      let doc = new jsPDF('l', 'mm', [320, 260]);
      doc.setFontSize(12);
      doc.text('Scheme Name:' + "GJAY", 10, 5);
      if (this.schemecategoryName == undefined || this.schemecategoryName == null || this.schemecategoryName == '') {
        doc.text('Scheme Category Name:' + "All", 150, 5);
      } else {
        doc.text('Scheme Category Name:' + this.schemecategoryName, 150, 5);
      }
      doc.text('Actual Date of Discharge From:' + this.fromDate, 10, 10);
      doc.text('Actual Date of Discharge To:' + this.toDate, 150, 10);
      doc.text('Mortality:' + this.findMortality1(this.mortality), 10, 20);
      let stateName = 'All', districtName = 'All', hospitalName = 'All';
      for (let i = 0; i < this.statelist.length; i++) {
        if (this.stateCode == this.statelist[i].stateCode) {
          stateName = this.statelist[i].stateName;
        }
      }
      for (let i = 0; i < this.distList.length; i++) {
        if (this.distCode == this.distList[i].DISTRICTCODE) {
          districtName = this.distList[i].DISTRICTNAME;
        }
      }
      for (let i = 0; i < this.hospitalList.length; i++) {
        if (this.hospitalCode == this.hospitalList[i].HOSPITALCODE) {
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
      doc.text("Non Compliance Query By CPD List", 110, 70);
      let col = [['Sl No', 'URN', 'Claim No', 'Case No', 'Patient Name', 'Phone No', 'Hospital Details', 'Invoice No', 'Package ID', 'Actual Date of Admission', 'Actual Date of Discharge', 'Hospital Claim Amount (₹)', 'CPD Mortality', 'Hospital Mortality']];
      let rows = [];
      let claim: any;
      for (let i = 0; i < this.snoclaimlist.length; i++) {
        claim = this.snoclaimlist[i];
        let temp = [(i + 1).toString(), claim.urn, claim.claimNo, claim.caseNo ? claim.caseNo : 'N/A', claim.patientName, claim.phone, claim.hospitalName + ' (' + claim.hospitalCode + ')', claim.invoiceNumber, claim.packageCode, claim.actualDateOfAdmission, claim.actualDateOfDischarge, this.convertCurrency(claim.currentTotalAmount), this.findMortality(claim.mortality), this.findMortality(claim.hospitalMortality)];
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
        columnStyles: { 0: { cellWidth: 10 }, 1: { cellWidth: 20 }, 2: { cellWidth: 20 }, 3: { cellWidth: 20 }, 4: { cellWidth: 30 }, 5: { cellWidth: 20 }, 6: { cellWidth: 20 }, 7: { cellWidth: 30 }, 8: { cellWidth: 20 }, 9: { cellWidth: 20 }, 10: { cellWidth: 20 }, 11: { cellWidth: 20 }, 12: { cellWidth: 20 } }
      });
      doc.save('GJAY_Claims On Hold List.pdf');
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
  claimDetails: any = [];
  getHistoryClaimNo(claimno: any) {
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
        //  this.InclusionofsearchingforschemePackageData();
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
      this.schemecategoryName = "All";
    }

    // if (this.schemecategoryidvalue == null || this.schemecategoryidvalue == undefined || this.schemecategoryidvalue == '') {
    //   return;
    // } else {
    //   this.InclusionofsearchingforschemePackageData();
    // }
  }
  // //for procedure for Selected Scheme Data
  // packageschemename: any = [];
  // text: any;
  // InclusionofsearchingforschemePackageData() {
  //   let schemeid = this.schemeidvalue;
  //   let schemecategoryid = this.schemecategoryidvalue;
  //   if (schemecategoryid == null || schemecategoryid == undefined || schemecategoryid == '') {
  //     schemecategoryid = "";
  //   } else {
  //     schemecategoryid = schemecategoryid;
  //   }
  //   this.LoginServ.InclusionofsearchingforschemePackageData(schemeid, schemecategoryid).subscribe(data => {
  //     if (data != null || data != '') {
  //       this.packageschemename = data;
  //       this.packageHeaderItem = [];

  //       for (let i = 0; i < this.packageschemename.length; i++) {
  //         let packageheadername = this.packageschemename[i].packageheader;
  //         this.text = this.packageschemename[i].packageheader;
  //         const matches = this.text.match(/\((.*)\)/);
  //         let packageheadercode = matches ? matches[1] : '';
  //         let data = {
  //           packageheadername: packageheadername,
  //           packageheadercode: packageheadercode
  //         }
  //         this.packageHeaderItem.push(data);
  //       }
  //     } else {
  //       this.swal('', 'Something went wrong.', 'error');
  //     }

  //   });
  // }

  // packagenamescheme: any = [];
  // getPackageSchemeName(procedurecode: any) {
  //   this.auto1.clear();
  //   this.package = '';
  //   this.packageList = [];
  //   let schemeid = this.schemeidvalue;
  //   let schemecategoryid = this.schemecategoryidvalue;
  //   if (schemecategoryid == null || schemecategoryid == undefined || schemecategoryid == '') {
  //     schemecategoryid = "";
  //   } else {
  //     schemecategoryid = schemecategoryid;
  //   }
  //   this.LoginServ.getPackageProcedurecodeSchemeWise(schemeid, schemecategoryid, procedurecode).subscribe(data => {
  //     if (data != null || data != '') {
  //       this.packagenamescheme = data;
  //       for (let i = 0; i < this.packagenamescheme.length; i++) {
  //         let procedureDescription = this.packagenamescheme[i].packagename;
  //         this.text = this.packagenamescheme[i].packagename;
  //         const matches = this.text.match(/\((.*)\)/);
  //         let procedureCode = matches ? matches[1] : '';
  //         let data = {
  //           procedureDescription: procedureDescription,
  //           procedureCode: procedureCode
  //         }
  //         this.packageList.push(data);
  //       }
  //       if (this.dataRequest) {
  //         this.package = this.dataRequest.packages;
  //       }
  //     } else {
  //       this.swal('', 'Something went wrong.', 'error');
  //     }
  //   });
  // }
}


