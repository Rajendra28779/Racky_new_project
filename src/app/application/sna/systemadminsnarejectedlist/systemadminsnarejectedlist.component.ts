import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../header.service';
import { SnoCLaimDetailsService } from '../../Services/sno-claim-details.service';
import { Router } from '@angular/router';
import { TableUtil } from '../../util/TableUtil';
import { CurrencyPipe, DatePipe } from '@angular/common';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';
import autoTable from 'jspdf-autotable';
import { SystemadminsnaadminService } from '../../Services/systemadminsnaadmin.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { PackageDetailsMasterService } from '../../Services/package-details-master.service';
import { ClaimRaiseServiceService } from '../../Services/claim-raise-service.service';
declare let $: any;

@Component({
  selector: 'app-systemadminsnarejectedlist',
  templateUrl: './systemadminsnarejectedlist.component.html',
  styleUrls: ['./systemadminsnarejectedlist.component.scss']
})
export class SystemadminsnarejectedlistComponent implements OnInit {
  snoclaimlist: any = [];
  showPegi: boolean;
  record: any;
  pageElement: number;
  totalClaimCount: any;
  dataRequest: any;
  distId: any = '';
  stateId: any = '';
  statusCPD: any = 0;
  amountFlag: any = 0;
  description: any;
  months: any;
  year: any;
  totalCpdAPrv: boolean = false;
  snaAPrv: boolean = false;
  isPercent: boolean = false;
  snaQry: boolean = false;
  pageIn: number;
  pageEnd: number;
  size: number;
  pgElement: any;
  pgList: any = [];
  selectedIndex: number
  user: any;
  statelist: Array<any> = [];
  stateCode: any;
  userId: any;
  distList: Array<any> = [];
  distCode: any;
  hospitalList: Array<any> = [];
  txtsearchDate: any;
  frstDay: string;
  secoundDay: string;
  months2: any;
  responseData: any;
  flag: any;
  fromDate: any;
  toDate: any;
  stateCode1: any;
  distCode1: any;
  hospitalCode: any;
  schemeidvalue: any = 1
  schemeName: any
  constructor(
    public headerService: HeaderService,
    public snoService: SnoCLaimDetailsService,
    public route: Router,
    private systemadminsnaadminService: SystemadminsnaadminService,
    private sessionService: SessionStorageService,
    private encryptionService: EncryptionService, public packageDetailsMasterService: PackageDetailsMasterService, private LoginServ: ClaimRaiseServiceService
  ) { }
  ngOnInit(): void {
    this.getSchemeData();
    this.headerService.setTitle('Sytem Admin SNA Rejected List');
    localStorage.removeItem('reconsider');
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
    this.user = this.sessionService.decryptSessionData("user");
    this.dataRequest = this.sessionService.decryptSessionData('requestData');
    this.pageElement = 20;
    this.selectedIndex = 1;
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
    let month: any = date.getMonth() - 1;
    if (month == -1) {
      this.months = 'Dec';
      this.year = year - 1;
    } else {
      this.months = this.getMonthFrom(month);
      this.year = year;
    }
    let date2 = date.getDate();
    this.months2 = this.getMonthFrom(date.getMonth())
    this.frstDay = date1 + '-' + this.months + '-' + this.year;
    this.secoundDay = date2 + "-" + this.months2 + "-" + year;
    $('input[name="fromDate"]').val(this.frstDay);
    $('input[name="fromDate"]').attr('placeholder', 'From Date *');
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
      this.statusCPD = this.dataRequest.cpdFlag;
      this.mortality = this.dataRequest.mortality;
      this.amountFlag = this.dataRequest.amountFlag;
      this.description = this.dataRequest.description;
      this.authMode = this.dataRequest.authMode;
    }
    this.getStateList();
  }
  getDate(date) {
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
  stateData: any = [];
  getStateList() {
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
        this.onSearch();
      } else {
        if (
          this.dataRequest.stateCode != null ||
          this.dataRequest.stateCode != undefined ||
          this.dataRequest.stateCode != ''
        ) {
          this.stateId = this.dataRequest.stateCode;
          this.getDistrict(this.stateId);
        } else {
          this.onSearch();
        }
      }
    });
  }
  getDistrict(code) {
    this.stateCode = code;
    this.userId = this.user.userId;
    this.snoService
      .getDistrictListByState(this.userId, this.stateCode)
      .subscribe((data: any) => {
        this.distList = data;
        this.distList.sort((a, b) =>
          a.DISTRICTNAME.localeCompare(b.DISTRICTNAME)
        );
        if (
          this.dataRequest == null ||
          this.dataRequest == undefined ||
          this.dataRequest == ''
        ) {
          this.onSearch();
        } else {
          if (
            this.dataRequest.distCode != null ||
            this.dataRequest.distCode != undefined ||
            this.dataRequest.distCode != ''
          ) {
            this.distId = this.dataRequest.distCode;
            this.getHospital(this.distId);
          } else {
            this.onSearch();
          }
        }
      });
  }
  hospitalId: any = '';
  getHospital(code) {
    this.distCode = code;
    this.userId = this.user.userId;
    this.snoService
      .getHospitalByDist(this.userId, this.stateCode, this.distCode)
      .subscribe((data: any) => {
        this.hospitalList = data;
        if (
          this.dataRequest == null ||
          this.dataRequest == undefined ||
          this.dataRequest == ''
        ) {
          this.onSearch();
        } else {
          if (
            this.dataRequest.hospitalCode != null ||
            this.dataRequest.hospitalCode != undefined ||
            this.dataRequest.hospitalCode != ''
          ) {
            this.hospitalId = this.dataRequest.hospitalCode;
            this.onSearch();
          } else {
            this.onSearch();
          }
        }
      });
  }
  onSearch() {
    let dataRequest = this.sessionService.decryptSessionData('requestData');
    this.pageElement = dataRequest ? parseInt(dataRequest.pageElement) : 20;
    $('#pageItem').val(this.pageElement);
    this.pageIn = dataRequest ? dataRequest.pageIn : 1;
    this.pageEnd = dataRequest ? dataRequest.pageEnd : this.pageElement;
    this.selectedIndex = dataRequest ? dataRequest.selectedIndex : 1;
    this.getsytemadminsnarejectedlist();
  }
  cpdFlag: any = 0;
  onChangeFlag(event) {
    this.cpdFlag = event.target.value;
  }
  mortality: any = '';
  onChangemortality(data) {
    this.mortality = data;
  }
  authMode: any = '';
  onChangeAuthMode(event) {
    this.authMode = event.target.value;
  }
  onChangeAmountFlag(event) {
    this.amountFlag = event.target.value;
  }
  onClickSearch() {
    this.pageElement = 20;
    $('#pageItem').val(this.pageElement);
    this.pageIn = 1;
    this.pageEnd = this.pageElement;
    this.selectedIndex = 1;
    this.getsytemadminsnarejectedlist();
  }
  resetField() {
    sessionStorage.removeItem('requestData');
    window.location.reload();
  }
  report: any = [];
  sno: any = {
    Slno: "",
    caseno: "",
    URN: "",
    claimNo: "",
    PatientName: "",
    phone: "",
    HospitalName: "",
    invoiceNo: "",
    PackageID: "",
    ActualDateofAdmission: "",
    ActualDateofDischarge: "",
    claimraisedby: "",
    HospitalClaimAmount: "",
    CPDApprovedAmount: "",
    CPDMortality: "",
    HospitalMortality: ""
  };
  heading = [["Sl No", "Case N0.", "URN", "Claim No", "Patient Name", "Hospital Details", "Invoice No", "Actual Date of Admission", "Actual Date of Discharge", "Claim Upload Date", "Hospital Claim Amount (₹)", "Hospital Mortality"]];
  downloadReport() {
    this.report = [];
    let claim: any;
    for (var i = 0; i < this.snoclaimlist.length; i++) {
      claim = this.snoclaimlist[i];
      this.sno = [];
      this.sno.Slno = (i + 1).toString();
      this.sno.caseno = claim.caseNo;
      this.sno.URN = claim.urn;
      this.sno.claimNo = claim.claimNo;
      this.sno.PatientName = claim.patientName;
      this.sno.HospitalName = claim.hospitalName + '(' + claim.hospitalCode + ')';
      this.sno.invoiceNo = claim.invoiceNumber;
      this.sno.ActualDateofAdmission = this.convertStringToDate(claim.actualDateOfAdmission);
      this.sno.ActualDateofDischarge = this.convertStringToDate(claim.actualDateOfDischarge);
      this.sno.claimraisedby = this.convertStringToDate(claim.claimraisedby);
      this.sno.HospitalClaimAmount = this.convertCurrency(claim.currentTotalAmount);
      this.sno.HospitalMortality = this.findMortality(claim.hospitalMortality);
      this.report.push(this.sno);
    }
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
      if (this.hospitalCode == this.hospitalList[i].HOSPITALCODE) {
        hospitalName = this.hospitalList[i].HOSPITALNAME;
      }
    }
    let filter = [];
    filter.push([['Scheme Name', "GJAY"]]);
    filter.push([['Scheme Category Name', this.schemecategoryName]]);
    filter.push([['Actual Date of Discharge From', this.fromDate]]);
    filter.push([['To', this.toDate]]);
    filter.push([['State Name', stateName]]);
    filter.push([['District Name', districtName]]);
    filter.push([['Hospital Name', hospitalName]]);
    filter.push([['Mortality', this.findMortality1(this.mortality)]]);
    filter.push([['Authentication Mode', this.findAuth(this.authMode)]]);
    TableUtil.exportListToExcelWithFilter(this.report, 'System Admin SNA Rejected', this.heading, filter);
  }
  // GetDate(str) {
  //   var arr = str.split("-");
  //   var months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  //   var month = months.indexOf(arr[1].toLowerCase());
  //   return new Date(parseInt(arr[2]), month, parseInt(arr[0]));
  // }
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
    if (this.snoclaimlist.length == 0) {
      this.swal('Info', 'No record found', 'info');
      return;
    }
    else {
      var doc = new jsPDF('l', 'mm', [330, 280]);
      doc.setFontSize(12);
      doc.text('Scheme Name:' + "GJAY", 10, 5);
      if (this.schemecategoryName == undefined || this.schemecategoryName == null || this.schemecategoryName == '') {
        doc.text('Scheme Category Name:' + "All", 150, 5);
      } else {
        doc.text('Scheme Category Name:' + this.schemecategoryName, 150, 5);
      }
      doc.text('Actual Date of Discharge From:' + this.fromDate, 10, 10);
      doc.text('To:' + this.toDate, 150, 10);
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
        if (this.hospitalCode == this.hospitalList[i].HOSPITALCODE) {
          hospitalName = this.hospitalList[i].HOSPITALNAME;
        }
      }
      doc.text('State Name:' + stateName, 60, 20);
      doc.text('District Name:' + districtName, 150, 20);
      doc.text('Hospital Name:' + hospitalName, 10, 30);
      doc.text('Authentication Mode:' + this.findAuth(this.authMode), 10, 40);
      doc.text("Generated On: " + this.convertDate(new Date()), 10, 50);
      doc.text("Generated By: " + this.user.fullName, 10, 60);
      var col = [["Sl#", "Case No.", "URN", "Claim No", "Patient Name", "Hospital Details", "Invoice No", "Actual Date of Admission", "Actual Date of Discharge", "Claim Upload Date", "Hospital Claim Amount (₹)", "Hospital Mortality"]];
      var rows = [];
      var claim: any;
      for (var i = 0; i < this.snoclaimlist.length; i++) {
        claim = this.snoclaimlist[i];
        var temp = [(i + 1), claim.caseNo, claim.urn, claim.claimNo, claim.patientName, claim.hospitalName + '(' + claim.hospitalCode + ')', claim.invoiceNumber, this.convertStringToDate(claim.actualDateOfAdmission), this.convertStringToDate(claim.actualDateOfDischarge), this.convertStringToDate(claim.claimraisedby), this.convertCurrency(claim.currentTotalAmount),
        this.findMortality(claim.hospitalMortality)];
        rows.push(temp);
      }
      autoTable(doc, {
        head: col,
        body: rows,
        theme: 'grid',
        startY: 66,
        styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
        bodyStyles: { overflow: 'linebreak', cellWidth: 'wrap', lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: { overflow: 'linebreak', cellWidth: 'wrap', lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 30 },
          2: { cellWidth: 25 },
          3: { cellWidth: 40 },
          4: { cellWidth: 25 },
          5: { cellWidth: 30 },
          6: { cellWidth: 30 },
          7: { cellWidth: 20 },
          8: { cellWidth: 20 },
          9: { cellWidth: 20 },
          10: { cellWidth: 25 },
        },
      });
      doc.save('System_Admin_SNA_Rejected.pdf');
    }
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
  // CPDStatus(val: any) {
  //   let status = '';
  //   if (val == '0') {
  //     status = 'CPD Approved';
  //   }
  //   else if (val == '1') {
  //     status = 'Auto Approved';
  //   }
  //   return status;
  // }
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
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  getsytemadminsnarejectedlist() {
    let userId = this.user.userId;
    this.flag = 'APRV';
    this.fromDate = $('#datepicker1').val();
    this.toDate = $('#datepicker2').val();
    this.stateCode1 = this.stateId;
    this.distCode1 = this.distId;
    this.hospitalCode = this.hospitalId;
    this.mortality = this.mortality
    if (Date.parse(this.fromDate) > Date.parse(this.toDate)) {
      this.swal('Info', ' From Date should be less than To Date', 'info');
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
      cpdFlag: this.statusCPD,
      mortality: this.mortality,
      authMode: this.authMode,
      pageIn: this.pageIn,
      pageEnd: this.pageEnd,
      selectedIndex: this.selectedIndex,
      pageElement: this.pageElement,
      schemeid: schemeid,
      schemecategoryid: schemecategoryid,
    };
    sessionStorage.removeItem('requestData');
    this.sessionService.encryptSessionData('requestData', requestData);
    this.systemadminsnaadminService.getdetails(requestData).subscribe(
      (response) => {
        this.responseData = response;
        if (this.responseData.status == 'success') {
          this.size = this.responseData.size;
          this.snoclaimlist = this.responseData.data;
          this.totalClaimCount = this.size;
          this.record = this.snoclaimlist.length;
          if (this.record > 0) {
            this.showPegi = true;
          } else {
            this.swal('Info', 'No Data Found!!', 'info');
            this.showPegi = false;
          }
          if (this.statusCPD != '1') {
            this.totalCpdAPrv = true;
            this.snaAPrv = true;
            this.isPercent = true;
            this.snaQry = true;
          } else {
            this.totalCpdAPrv = false;
            this.snaAPrv = false;
            this.isPercent = false;
            this.snaQry = false;
          }
          let count = Math.ceil(this.size / this.pageElement);
          this.pgList = [];
          for (var i = 0; i < count; i++) {
            this.pgElement = {
              id: "",
              init: "",
              end: "",
            }
            this.pgElement.id = i + 1;
            this.pgElement.init = (this.pgElement.id * this.pageElement) - this.pageElement + 1;
            this.pgElement.end = this.pgElement.id * this.pageElement;
            this.pgList.push(this.pgElement);
          }
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
  onAction(id: any, urn: any, packageCode: any, txnpackagedetailid: any) {
    let state = {
      transactionId: id,
      URN: urn,
      packageCode: packageCode,
    };
    localStorage.setItem('actionData', JSON.stringify(state));
    this.route.navigate(['/application/systemadminrejectaction']);
  }
  paginate(element) {
    this.selectedIndex = element.id;
    this.pageIn = element.init;
    this.pageEnd = element.end;
    this.getsytemadminsnarejectedlist();
  }

  prev() {
    this.selectedIndex = this.selectedIndex - 1;
    this.pageIn = this.pageIn - this.pageElement;
    this.pageEnd = this.pageEnd - this.pageElement;
    this.getsytemadminsnarejectedlist();
  }

  next() {
    this.selectedIndex = this.selectedIndex + 1;
    this.pageIn = +this.pageIn + +this.pageElement;
    this.pageEnd = +this.pageEnd + +this.pageElement;
    this.getsytemadminsnarejectedlist();
  }
  pageItemChange() {
    this.pageElement = $('#pageItem').val();
    this.pageIn = 1;
    this.pageEnd = this.pageElement;
    this.selectedIndex = 1;
    this.getsytemadminsnarejectedlist();
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

