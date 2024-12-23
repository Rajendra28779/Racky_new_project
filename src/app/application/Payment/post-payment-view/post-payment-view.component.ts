import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderService } from '../../header.service';
import { SnoCLaimDetailsService } from '../../Services/sno-claim-details.service';
import { SnamasterserviceService } from '../../Services/snamasterservice.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import Swal from 'sweetalert2';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { CurrencyPipe, DatePipe, formatDate } from '@angular/common';
import { TableUtil } from '../../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { PackageDetailsMasterService } from '../../Services/package-details-master.service';
declare let $: any;

@Component({
  selector: 'app-post-payment-view',
  templateUrl: './post-payment-view.component.html',
  styleUrls: ['./post-payment-view.component.scss']
})
export class PostPaymentViewComponent implements OnInit {
  data: any
  snoUserId: any
  stateId: any = '';
  districtId: any = '';
  hospitalId: any = [];
  fromDate: any
  toDate: any
  hospital: any = '';
  stateList: any;
  placeHolder = "Select Hospital";
  statelist: Array<any> = [];
  stateData: any = [];
  districtList: any = [];
  user: any;
  hospitalList: any = [];
  stateCode: any;
  distCode: any;
  userId: any;
  months: any;
  year: any;
  months2: any;
  frstDay: string;
  secoundDay: string;
  public snoList: any = [];
  keyword: any = 'fullName';
  selectedItems: any = [];
  paymentList: any = [];
  showPegi: boolean;
  pageElement: any;
  currentPage: any;
  txtsearchDate: any;
  // dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  dropdownSettings: IDropdownSettings = {};
  hospObj: any;
  hospList: any = [];
  showStar: boolean = true;
  disabled: boolean = false;
  selectedValue: "";
  state: any = "";
  dis: any = "";
  statename: any = "ALL";
  districtName: any = "ALL";
  constructor(public headerService: HeaderService,
    public snoService: SnoCLaimDetailsService,
    private snamasterService: SnamasterserviceService,
    private snoConfigService: SnocreateserviceService,
    public router: Router, private sessionService: SessionStorageService,
    private encryptionService: EncryptionService, public packageDetailsMasterService: PackageDetailsMasterService) { }
  ngOnInit(): void {
    this.getSchemeData();
    this.headerService.setTitle('Post Payment View');
    this.user = this.sessionService.decryptSessionData("user");
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
    this.months2 = this.getMonthFrom(date.getMonth());
    this.frstDay = date1 + '-' + this.months + '-' + this.year;
    this.secoundDay = date2 + '-' + this.months2 + '-' + year;
    $('input[name="fromDate"]').val(this.frstDay);
    $('input[name="fromDate"]').attr('placeholder', 'From Date *');
    $('input[name="toDate"]').attr('placeholder', 'To Date *');
    this.currentPage = 1;
    this.pageElement = 20;
    if (this.user.groupId != 4) {
      this.getSNOList();
    } else {
      this.snoList = [{
        fullName: this.user.fullName
      }]
      this.selectedValue = this.snoList[0];
      this.disabled = true;
      this.snoUserId = this.user.userId;
      this.getStateList();
      this.getPostPaymentView();
    }
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'hospitalCode',
      textField: 'hospitalName',
      itemsShowLimit: 5,
      allowSearchFilter: true,
      selectAllText: 'Select All',
      unSelectAllText: "Un-Select All",
    };
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
  getStateList() {
    this.snamasterService.getStateList(this.snoUserId).subscribe(
      (response) => {
        this.stateList = response;
      },
      (error) => console.log(error)
    )
  }
  responseData: any;
  getSNOList() {
    let userid = this.user.userId;
    this.snoConfigService.getSNOListByExecutive(userid).subscribe(
      (response) => {
        this.responseData = response;
        if (this.responseData.status == 'success') {
          this.snoList = JSON.parse(this.responseData.data);
        } else {
          this.swal('', 'Something went wrong.', 'error');
        }
      },
      (error) => console.log(error)
    );
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  onDeSelectAll(list) {
    this.hospList = [];
  }
  onItemDeSelect(item) {
    for (var i = 0; i < this.hospList.length; i++) {
      if (item.hospitalCode == this.hospList[i].hospitalCode) {
        var index = this.hospList.indexOf(this.hospList[i]);
        if (index !== -1) {
          this.hospList.splice(index, 1);
        }
      }
    }
  }
  onSelectAll(list) {
    for (var x = 0; x < list.length; x++) {
      let item = list[x];
      this.hospObj = {
        stateCode: "",
        stateName: "",
        districtCode: "",
        districtName: "",
        hospitalCode: "",
        hospitalName: ""
      }
      this.hospObj.stateCode = this.stateId;
      for (var i = 0; i < this.stateList.length; i++) {
        if (this.hospObj.stateCode == this.stateList[i].stateCode) {
          this.hospObj.stateName = this.stateList[i].stateName;
        }
      }
      this.hospObj.districtCode = this.districtId;
      for (var i = 0; i < this.districtList.length; i++) {
        if (this.hospObj.districtCode == this.districtList[i].districtcode) {
          this.hospObj.districtName = this.districtList[i].districtname;
        }
      }
      this.hospObj.hospitalCode = item.hospitalCode;
      for (var i = 0; i < this.hospitalList.length; i++) {
        if (this.hospObj.hospitalCode == this.hospitalList[i].hospitalCode) {
          this.hospObj.hospitalName = this.hospitalList[i].hospitalName;
        }
      }
      var stat: boolean = false;
      for (const i of this.hospList) {
        if (i.hospitalCode == this.hospObj.hospitalCode) {
          stat = true;
        }
      }
      if (stat == false) {
        this.hospList.push(this.hospObj);
      }
    }
  }
  OnChangeState(id) {
    $('#districtId').val('');
    $('#hospital').val('');
    this.districtId = '';
    this.hospital = '';
    this.hospitalList = [];
    this.hospList = [];
    this.selectedItems = [];
    localStorage.setItem("stateCode", id);
    this.snamasterService.getDistrictListByStateId(this.snoUserId, id).subscribe(
      (response) => {
        this.districtList = response;
      },
      (error) => console.log(error)
    )
  }
  clearEvent() {
    this.snoUserId = '';
    this.getStateList();
    $("#statecode1").val("");
    $("#distcode1").val("");
    this.selectedItems = [];
  }
  selectEvent(item) {
    this.snoUserId = item.snaUserId;
    this.getStateList();
  }
  OnChangeDistrict(id) {
    this.hospital = '';
    $('#hospital').val('');
    this.selectedItems = [];
    this.hospitalList = [];
    this.hospList = [];
    var stateCode = localStorage.getItem("stateCode");
    this.snamasterService.getHospitalbyDistrictId(this.snoUserId, id, stateCode).subscribe(
      (response) => {
        this.hospitalList = response;
      },
      (error) => console.log(error)
    )
  }
  onItemSelect(item) {
    this.hospObj = {
      stateCode: "",
      stateName: "",
      districtCode: "",
      districtName: "",
      hospitalCode: "",
      hospitalName: ""
    }
    this.hospObj.stateCode = this.stateId;
    for (var i = 0; i < this.stateList.length; i++) {
      if (this.hospObj.stateCode == this.stateList[i].stateCode) {
        this.hospObj.stateName = this.stateList[i].stateName;
      }
    }
    this.hospObj.districtCode = this.districtId;
    for (var i = 0; i < this.districtList.length; i++) {
      if (this.hospObj.districtCode == this.districtList[i].districtcode) {
        this.hospObj.districtName = this.districtList[i].districtname;
      }
    }
    this.hospObj.hospitalCode = item.hospitalCode;
    for (var i = 0; i < this.hospitalList.length; i++) {
      if (this.hospObj.hospitalCode == this.hospitalList[i].hospitalCode) {
        this.hospObj.hospitalName = this.hospitalList[i].hospitalName;
      }
    }

    var stat: boolean = false;
    for (const i of this.hospList) {
      if (i.hospitalCode == this.hospObj.hospitalCode) {
        stat = true;
      }
    }
    if (stat == false) {
      this.hospList.push(this.hospObj);
    }
  }
  record: any;
  hospcodearr: any
  Data: any;
  postpaymentview: any = [];
  Searchtype: any
  getPostPaymentView() {
    this.hospcodearr = []
    for (var i = 0; i < this.hospList.length; i++) {
      this.hospcodearr.push(parseInt(this.hospList[i].hospitalCode))
    }
    this.fromDate = $('#datepicker1').val();
    this.toDate = $('#datepicker2').val();
    this.Searchtype = $('#search').val();
    if (Date.parse(this.fromDate) > Date.parse(this.toDate)) {
      this.swal('', 'From Date should be less than To Date', 'error');
      return;
    }
    if (this.snoUserId == '' || this.snoUserId == null || this.snoUserId == undefined) {
      this.swal('', 'Please Select SNA Doctor Name', 'info');
      return;
    }
    let requestData = {
      userId: this.snoUserId,
      fromDate: new Date(this.fromDate),
      toDate: new Date(this.toDate),
      stateCode: this.stateId,
      distCode: this.districtId,
      hospitalCodeArr: this.hospcodearr,
      searchtype: this.Searchtype,
    };
    this.snoService.getPostpayemtview(requestData).subscribe((response: any) => {
      this.Data = response;
      if (this.Data.status == 'success') {
        this.postpaymentview = this.Data.data;
        this.record = this.postpaymentview.length;
        if (this.record > 0) {
          this.showPegi = true;
        } else {
          this.showPegi = false;
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
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
  resetField() {
    window.location.reload();
  }
  report: any = [];
  sno: any = {
    SlNo: "",
    URN: "",
    ClaimNo: "",
    PatientName: "",
    HospitalDetails: "",
    InvoiceNo: "",
    PackageID: "",
    ActualDateofAdmission: "",
    ActualDateofDischarge: "",
    HospitalClaimAmount: "",
    CPDApprovedAmount: "",
    SNAApprovedAmount: "",
    CPDMortality: "",
    HospitalMortality: "",
    CPDClaimStatus: "",
    CPDRemarks: "",
    SNAClaimStatus: "",
    SNARemarks: "",
  };
  heading = [['Sl#', 'URN', 'Claim No.', 'Patient Name', 'Hospital Details',
    'Invoice No.', 'Package ID', 'Actual Date of Admission',
    'Actual Date of Discharge', 'Hospital Claim Amount',
    'CPD Approved Amount', 'SNA Approved Amount', 'CPD Mortality',
    'Hospital Mortality', 'CPD Claim Status', 'CPD Remarks', 'SNA Claim Status', 'SNA Remarks']];
  downloadReport(type: any) {
    this.report = [];
    if (type == 'excel') {
      let claim: any;
      for (var i = 0; i < this.postpaymentview.length; i++) {
        claim = this.postpaymentview[i];
        this.sno = [];
        this.sno.SlNo = i + 1;
        this.sno.URN = claim.urn != null ? claim.urn : "N/A";
        this.sno.ClaimNo = claim.claimNo != null ? claim.claimNo : "N/A";
        this.sno.PatientName = claim.patientName != null ? claim.patientName : "N/A";
        this.sno.HospitalDetails = claim.hospitalName + '(' + claim.hospitalCode + ')';
        this.sno.InvoiceNo = claim.invoiceNumber != null ? claim.invoiceNumber : "N/A";
        this.sno.PackageID = claim.packageName != null ? claim.packageName : "N/A";
        this.sno.ActualDateofAdmission = this.convertdatetostring(claim.actualDateOfAdmission);
        this.sno.ActualDateofDischarge = this.convertdatetostring(claim.actualDateOfDischarge);
        this.sno.HospitalClaimAmount = this.convertCurrency(claim.currentTotalAmount);
        this.sno.CPDApprovedAmount = this.convertCurrency(claim.cpdApprovedAmount);
        this.sno.SNAApprovedAmount = this.convertCurrency(claim.snaApprovedAmount);
        if (claim.mortality == 'Y') {
          this.sno.CPDMortality = 'Yes';
        } else if (claim.mortality == 'N') {
          this.sno.CPDMortality = 'No';
        } else {
          this.sno.CPDMortality = 'N/A';
        }
        if (claim.hospitalMortality == 'Y') {
          this.sno.HospitalMortality = 'Yes';
        } else if (claim.hospitalMortality == 'N') {
          this.sno.HospitalMortality = 'No';
        } else {
          this.sno.HospitalMortality = 'N/A';
        }
        this.sno.CPDClaimStatus = claim.cpdClaimStatus != null ? claim.cpdClaimStatus : "N/A";
        this.sno.CPDRemarks = claim.cpdRemarks != null ? claim.cpdRemarks : "N/A";
        this.sno.SNAClaimStatus = claim.snaClaimStatus != null ? claim.snaClaimStatus : "N/A";
        this.sno.SNARemarks = claim.snaRemarks != null ? claim.snaRemarks : "N/A";
        this.report.push(this.sno);
      }
      let filter1 = [];
      filter1.push([['Actual Date of Discharge From:-', this.fromDate]]);
      filter1.push([['Actual Date of Discharge To:-', this.toDate]]);
      filter1.push([['SNA Doctor Name:-', this.user.fullName]]);
      if (this.hospObj != null && this.hospObj != undefined && this.hospObj != '') {
        filter1.push([['State Name:-', this.hospObj.stateName]]);
      } else {
        filter1.push([['State Name:-', 'ALL']]);
      }
      if (this.hospObj != null && this.hospObj != undefined && this.hospObj != '') {
        filter1.push([['District Name:-', this.hospObj.districtName]]);
      } else {
        filter1.push([['District Name:-', 'ALL']]);
      }
      if (this.hospObj != null && this.hospObj != undefined && this.hospObj != '') {
        filter1.push([['Hospital Name:-', this.hospObj.hospitalName]]);
      } else {
        filter1.push([['Hospital Name:-', 'ALL']]);
      }
      if (this.Searchtype == 1) {
        filter1.push([['Search Type:-', 'Normal']]);
      } else {
        filter1.push([['Search Type:-', '1.0 Block Data']]);
      }
      if (this.schemecategoryidvalue === '1') {
        filter1.push([['Scheme Category Name:-', 'NFSA/SFSS']]);
      } else if (this.schemecategoryidvalue === '2') {
        filter1.push([['Scheme Category Name:-', 'GJAY-1']]);
      } else {
        filter1.push([['Scheme Category Name:-', 'All']]);
      }
      TableUtil.exportListToExcelWithFilterforadmin(this.report, "Post Payment View", this.heading, filter1);
    }
    else if (type == 'pdf') {
      if (this.postpaymentview.length == 0) {
        this.swal('', 'No Data Found', 'info');
        return;
      }
      let SlNo = 1;
      this.postpaymentview.forEach(element => {
        let rowData = [];
        rowData.push(SlNo);
        rowData.push(element.urn != null ? element.urn : "N/A");
        rowData.push(element.claimNo != null ? element.claimNo : "N/A");
        rowData.push(element.patientName != null ? element.patientName : "N/A");
        rowData.push(element.hospitalName + '(' + element.hospitalCode + ')');
        rowData.push(element.invoiceNumber != null ? element.invoiceNumber : "N/A");
        rowData.push(element.packageName != null ? element.packageName : "N/A");
        rowData.push(this.convertdatetostring(element.actualDateOfAdmission));
        rowData.push(this.convertdatetostring(element.actualDateOfDischarge));
        rowData.push(this.convertCurrency(element.currentTotalAmount));
        rowData.push(this.convertCurrency(element.cpdApprovedAmount));
        rowData.push(this.convertCurrency(element.snaApprovedAmount));
        if (element.mortality == 'Y') {
          rowData.push('Yes');
        } else if (element.mortality == 'N') {
          rowData.push('No');
        } else {
          rowData.push('N/A');
        }
        if (element.hospitalMortality == 'Y') {
          rowData.push('Yes');
        } else if (element.hospitalMortality == 'N') {
          rowData.push('No');
        } else {
          rowData.push('N/A');
        }
        rowData.push(element.cpdClaimStatus != null ? element.cpdClaimStatus : "N/A");
        rowData.push(element.cpdRemarks != null ? element.cpdRemarks : "N/A");
        rowData.push(element.snaClaimStatus != null ? element.snaClaimStatus : "N/A");
        rowData.push(element.snaRemarks != null ? element.snaRemarks : "N/A");
        this.report.push(rowData);
        SlNo++;
      })
      let doc = new jsPDF('l', 'mm', [400, 260]);
      doc.setFontSize(12);
      doc.text('Authority Name :-' + this.user.fullName, 5, 5);
      doc.text('Actual Date of Discharge From:-' + this.fromDate, 5, 10);
      doc.text('Actual Date of Discharge To:-' + this.toDate, 5, 15);
      doc.text('SNA Doctor Name :-' + this.user.fullName, 5, 20);
      if (this.hospObj != null && this.hospObj != undefined && this.hospObj != '') {
        doc.text('State Name:-' + this.hospObj.stateName, 5, 25);
      } else {
        doc.text('State Name:-' + 'ALL', 5, 25);
      }
      if (this.hospObj != null && this.hospObj != undefined && this.hospObj != '') {
        doc.text('District Name:-' + this.hospObj.districtName, 5, 30);
      } else {
        doc.text('District Name:-' + 'ALL', 5, 30);
      }
      if (this.hospObj != null && this.hospObj != undefined && this.hospObj != '') {
        doc.text('Hospital Name:-' + this.hospObj.hospitalName, 5, 35);
      } else {
        doc.text('Hospital Name:-' + 'ALL', 5, 35);
      }
      if (this.Searchtype == 1) {
        doc.text('Search Type:-' + 'Normal', 5, 40);
      } else {
        doc.text('Search Type:-' + '1.0 Block Data', 5, 40);
      }
      if (this.schemecategoryidvalue === '1') {
        doc.text('Scheme Category Name:-' + 'NFSA/SFSS', 5, 55);
      } else if (this.schemecategoryidvalue === '2') {
        doc.text('Scheme Category Name:-' + 'GJAY-1', 5, 55);
      } else {
        doc.text('Scheme Category Name:-' + 'ALL', 5, 55);
      }
      doc.text('Document Generate Date :-' + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en').toString(), 5, 45);
      doc.text('Post Payment List', 152, 50);
      doc.setLineWidth(0.7);
      autoTable(doc, {
        head: this.heading, body: this.report, startY: 52, theme: 'grid',
        styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
        bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: 20 },
          2: { cellWidth: 20 },
          3: { cellWidth: 20 },
          4: { cellWidth: 20 },
          5: { cellWidth: 20 },
          6: { cellWidth: 20 },
          7: { cellWidth: 20 },
          8: { cellWidth: 20 },
          9: { cellWidth: 20 },
          10: { cellWidth: 20 },
          11: { cellWidth: 20 },
          12: { cellWidth: 20 },
          13: { cellWidth: 20 },
          14: { cellWidth: 20 },
          15: { cellWidth: 20 },
          16: { cellWidth: 20 },
          17: { cellWidth: 20 },
        }
      })
      doc.save('Post_Payment_view.pdf');
    }
  }
  convertdatetostring(date: any) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy');
    return date;
  }
  convertCurrency(amount: any) {
    var formatter = new CurrencyPipe('en-US');
    amount = formatter.transform(amount, '', '');
    return amount;
  }
  dtls: any;
  viewDescription(descriptinDtls) {
    this.dtls = descriptinDtls;
    $('#appealDisposal').show();
  }
  modalClose() {
    $('#appealDisposal').hide();
  }
  ///scheme
  scheme: any = [];
  schemeidvalue: any = 1;
  schemeName: any = ''
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
}


