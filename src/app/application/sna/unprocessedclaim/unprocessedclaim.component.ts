import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { SnoCLaimDetailsService } from '../../Services/sno-claim-details.service';
import { UnprocessedclaimService } from '../../Services/unprocessedclaim.service';
import { TableUtil } from '../../util/TableUtil';
import autoTable from 'jspdf-autotable';
import { HospitalPackageMappingService } from '../../Services/hospital-package-mapping.service';
import { WardMasterService } from '../../Services/ward-master.service';
import { DynamicreportService } from '../../Services/dynamicreport.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { PackageDetailsMasterService } from '../../Services/package-details-master.service';
import { ClaimRaiseServiceService } from '../../Services/claim-raise-service.service';
declare let $: any;

@Component({
  selector: 'app-unprocessedclaim',
  templateUrl: './unprocessedclaim.component.html',
  styleUrls: ['./unprocessedclaim.component.scss'],
})
export class UnprocessedclaimComponent implements OnInit {
  childmessage: any;
  user: any;
  txtsearchDate: any;
  statelist: Array<any> = [];
  stateCode: any;
  userId: any;
  distList: Array<any> = [];
  distCode: any;
  hospitalList: Array<any> = [];
  snoclaimlist: any = [];
  record: any;
  showPegi: boolean;
  currentPage: any;
  pageElement: any;
  totalClaimCount: any;
  dataRequest: any;
  stateId: any = '';
  fromDate: any;
  toDate: any;
  stateCode1: any;
  distCode1: any;
  hospitalCode: any;
  currentPagenNum: any;
  month: any;
  year: any;
  unprocessedclaimlist: any = [];
  responseData: any;
  description: any;
  packageHeaderItem: any = [];
  procedure: any = '';
  package: any = '';
  implant: any = '';
  highend: any = '';
  ward: any = '';
  schemeidvalue: any = 1;
  schemeName: any
  keyword: string = 'packageheadername';
  keyword1: string = 'procedureDescription';
  keyword2: string = 'wardname';
  trigger:any=0;
  @ViewChild('auto') auto;
  @ViewChild('auto1') auto1;
  @ViewChild('auto2') auto2;
  constructor(
    public headerService: HeaderService,
    public snoService: SnoCLaimDetailsService,
    public route: Router,
    public unprocessed: UnprocessedclaimService,
    private hospitalService: HospitalPackageMappingService,
    private wardService: WardMasterService,
    private service: DynamicreportService,
    private sessionService: SessionStorageService,
    private encryptionService: EncryptionService, public packageDetailsMasterService: PackageDetailsMasterService, private LoginServ: ClaimRaiseServiceService
  ) { }

  ngOnInit(): void {
    // dynamic title
    this.user = this.sessionService.decryptSessionData("user");
    this.dataRequest = this.sessionService.decryptSessionData('requestData');
    this.currentPagenNum =this.sessionService.decryptSessionData('currentPageNum');
    this.headerService.setTitle('Unprocessed Claim');
    // localStorage.removeItem("click");
    // localStorage.removeItem("click1");
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
    this.getSchemeData();
    this.getStateList();
    this.getPackageHeader();
    this.getWard();
    this.getTriggerList();
    this.currentPage = 1;
    this.pageElement = 20;
    var compnent = this;
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
    var date = new Date();
    let year = date.getFullYear();
    let date1 = '01';
    let months: any = date.getMonth() - 1;
    if (months == -1) {
      this.month = 'Dec';
      this.year = year - 1;
    } else {
      this.month = this.getMonthFrom(months);
      this.year = year;
    }
    var frstDay = date1 + '-' + this.month + '-' + this.year;
    // let month = this.getMonthFrom(months);
    // var frstDay = date1 + '-' + month + '-' + year;

    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr('placeholder', 'From Date *');

    $('input[name="toDate"]').attr('placeholder', 'To Date *');

    if (
      this.dataRequest == null ||
      this.dataRequest == undefined ||
      this.dataRequest == ''
    ) {
      // this.getSnoClaimDetails();
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
      this.implant = this.dataRequest.implant;
      this.highend = this.dataRequest.highend;
      this.trigger = this.dataRequest.trigger;
    }
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
  // getResponseFromUtil(parentData: any) {
  //   this.childmessage = parentData;
  // }

  getSnoClaimDetails() {
    let userId = this.user.userId;
    // let flag = 'REAPRV';
    this.fromDate = $('#datepicker7').val();
    this.toDate = $('#datepicker8').val();
    this.stateCode1 = this.stateId;
    this.distCode1 = this.distId;
    this.hospitalCode = this.hospitalId;
    this.mortality = this.mortality;
    let schemeid = this.schemeidvalue;
    let schemecategoryid = this.schemecategoryidvalue;
    if (schemecategoryid == null || schemecategoryid == undefined || schemecategoryid == '') {
      schemecategoryid = "";
    } else {
      schemecategoryid = schemecategoryid;
    }
    if (Date.parse(this.fromDate) > Date.parse(this.toDate)) {
      this.swal('', 'From Date should be less than To Date', 'error');
      return;
    }
    let requestData = {
      userId: userId,
      fromDate: new Date(this.fromDate),
      toDate: new Date(this.toDate),
      stateCode: this.stateCode1,
      distCode: this.distCode1,
      hospitalCode: this.hospitalCode,
      mortality: this.mortality,
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
    this.sessionService.encryptSessionData('requestData',requestData);
    this.unprocessed.getUnProcessedClaimList(requestData).subscribe(
      (response) => {
        this.record = this.unprocessedclaimlist.length;
        this.responseData = response;
        if (this.responseData.status == 'success') {
          this.unprocessedclaimlist = this.responseData.data;
          this.totalClaimCount = this.unprocessedclaimlist.length;
          this.record = this.unprocessedclaimlist.length;
          if (this.record > 0) {
            this.showPegi = true;
          } else {
            this.showPegi = false;
          }
          this.traverseToRequiredPage();
        } else {
          this.swal('', 'Something went wrong.', 'error');
        }
      },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      }
    );
  }
  onAction(id: any, urn: any) {
    let state = {
      transactionId: id,
      URN: urn,
      // packageCode: packageCode,
    };
    localStorage.setItem('actionData', JSON.stringify(state));
    this.sessionService.encryptSessionData('currentPageNum', this.currentPage);
    this.route.navigate(['/application/unProcessedClaimList/action']);
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
  distId: any = '';
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
      });
  }
  resetField() {
    sessionStorage.removeItem('requestData');
    window.location.reload();
    // $('#statecode1').val('');
    // $('#distcode1').val('');
    // $('#hospitalcode').val('');
  }
  traverseToRequiredPage() {
    if (this.currentPagenNum != null && this.currentPagenNum != undefined) {
      // if (this.currentPagenNum != null || this.currentPagenNum != undefined || this.currentPagenNum != "") {
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
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
  report: any = [];
  sno: any = {
    Slno: '',
    URN: '',
    claimNo: '',
    InvoiceNo: '',
    PatientName: '',
    phone: '',
    HospitalName: '',
    // HospitalCode: "",
    PackageID: '',
    actualdateofadmission: '',
    actualdateofdischage: '',
    ClaimRaisedOn: '',
    HospitalClaimAmount: '',
    CPDMortality: '',
    HospitalMortality: '',
  };
  heading = [
    [
      'Sl#',
      'URN',
      'Claim No',
      'Patient Name',
      'Phone No',
      'Hospital Details',
      'Invoice No',
      'Package ID',
      'ActualdateOfAdmission',
      'ActualdateOfDischage',
      'Claim Raised On',
      'Hospital Claim Amount (₹)',
      'CPD Mortality',
      'Hospital Mortality',
    ],
  ];

  downloadReport(item: any) {
    this.report = [];
    let claim: any;
    for (var i = 0; i < this.unprocessedclaimlist.length; i++) {
      claim = this.unprocessedclaimlist[i];
      this.sno = [];
      this.sno.Slno = i + 1;
      this.sno.URN = claim.urn;
      this.sno.claimNo = claim.claimNo;
      this.sno.PatientName = claim.patientName;
      this.sno.phone = claim.phone;
      this.sno.HospitalName =
        claim.hospitalName + ' (' + claim.hospitalcode + ')';
      this.sno.InvoiceNo = claim.invoiceNumber;
      this.sno.PackageID = claim.packageCode;
      this.sno.actualdateofadmission = claim.actualdateofaddmission;
      this.sno.actualdateofdischage = claim.actualdateofdischarge;
      this.sno.ClaimRaisedOn = this.convertDate(claim.createdOn);
      this.sno.HospitalClaimAmount = this.convertCurrency(
        claim.currentTotalAmount
      );
      if (claim.cpdMortality == 'Y') {
        this.sno.CPDMortality = 'Yes';
      } else if (claim.cpdMortality == 'N') {
        this.sno.CPDMortality = 'No';
      } else {
        this.sno.CPDMortality = 'N/A';
      }
      if (claim.hosMortality == 'Y') {
        this.sno.HospitalMortality = 'Yes';
      } else if (claim.hosMortality == 'N') {
        this.sno.HospitalMortality = 'No';
      } else {
        this.sno.HospitalMortality = 'N/A';
      }
      this.report.push(this.sno);
    }
    if (this.report.length == 0) {
      this.swal('Info', 'No record found', 'info');
      return;
    }
    if (item == 1) {
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
      if (this.description == null || this.description == undefined || this.description == '') {
        this.description = '';
      }
      let filter = [];
      filter.push([['Actual Date of Discharge From', this.fromDate]]);
      filter.push([['Actual Date of Discharge To', this.toDate]]);
      filter.push([['State Name', stateName]]);
      filter.push([['District Name', districtName]]);
      filter.push([['Hospital Name', hospitalName]]);
      filter.push([['Mortality', this.findMortality1(this.mortality)]]);
      filter.push([['Description', this.description]]);
      filter.push([['Authentication Mode', this.findAuth(this.authMode)]]);
      TableUtil.exportListToExcelWithFilter(this.report, 'Unprocessed List', this.heading, filter);
    } else if (item == 2) {
      const doc = new jsPDF('l', 'mm', [320, 210]);
      doc.setFontSize(12);
      doc.text('Actual Date of Discharge From:' + this.fromDate, 10, 10);
      doc.text('Actual Date of Discharge To:' + this.toDate, 150, 10);
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
      doc.text("Unprocessed Claim list", 110, 70);
      let pdfRpt = [];
      for (var x = 0; x < this.report.length; x++) {
        var flt = this.report[x];
        var pdf = [];
        pdf[0] = flt.Slno;
        pdf[1] = flt.URN;
        pdf[2] = flt.claimNo;
        pdf[3] = flt.PatientName;
        pdf[4] = flt.phone;
        pdf[5] = flt.HospitalName;
        pdf[6] = flt.InvoiceNo;
        pdf[7] = flt.PackageID;
        pdf[8] = flt.actualdateofadmission;
        pdf[9] = flt.actualdateofdischage;
        pdf[10] = flt.ClaimRaisedOn;
        pdf[11] = flt.HospitalClaimAmount;
        pdf[12] = flt.CPDMortality;
        pdf[13] = flt.HospitalMortality;
        pdfRpt.push(pdf);
      }
      autoTable(doc, {
        head: this.heading,
        body: pdfRpt,
        theme: 'grid',
        startY: 80,
        styles: {
          overflow: 'linebreak',
          halign: 'center',
          valign: 'middle',
          fontSize: 8,
          cellPadding: 1,
          lineWidth: 0.1,
          lineColor: 0,
          textColor: 20,
        },
        bodyStyles: {
          overflow: 'linebreak',
          cellWidth: 'wrap',
          lineWidth: 0.1,
          lineColor: 0,
          textColor: 20,
        },
        headStyles: {
          overflow: 'linebreak',
          cellWidth: 'wrap',
          lineWidth: 0.1,
          lineColor: 0,
          textColor: [255, 255, 255],
          fillColor: [26, 99, 54],
        },

        // headStyles: {
        //   fillColor: [26, 99, 54]
        // },
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
          13: { cellWidth: 15 },
        },
      });
      doc.save('Unprocessed_Claim_List' + '.pdf');
    }
  }
  // GetDate(str) {
  //   var arr = str.split('-');
  //   var months = [
  //     'jan',
  //     'feb',
  //     'mar',
  //     'apr',
  //     'may',
  //     'jun',
  //     'jul',
  //     'aug',
  //     'sep',
  //     'oct',
  //     'nov',
  //     'dec',
  //   ];

  //   var month = months.indexOf(arr[1].toLowerCase());
  //   return new Date(parseInt(arr[2]), month, parseInt(arr[0]));
  // }
  //convert string to date
  // convertStringToDate(date) {
  //   var datePipe = new DatePipe('en-US');
  //   date = datePipe.transform(date, 'dd-MMM-yyyy');
  //   return date;
  // }
  //convert timestamp to date
  convertDate(date) {
    var datePipe = new DatePipe('en-US');
    date = datePipe.transform(date, 'dd-MMM-yyyy, h:mm:ss a');
    return date;
  }
  //convert number to currency
  convertCurrency(amount: any) {
    var formatter = new CurrencyPipe('en-US');
    amount = formatter.transform(amount, '', '');
    return amount;
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
      if (
        this.dataRequest.procedure != null ||
        this.dataRequest.procedure != undefined ||
        this.dataRequest.procedure != ''
      ) {
        this.procedure = this.dataRequest.procedure;
        this.getPackageName(this.procedure);
      } else {
        this.getSnoClaimDetails();
      }
    })
  }
  wardList: any = [];
  getWard() {
    this.wardService.getallWardCategorydata().subscribe((data: any) => {
      this.wardList = data;
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
        this.packageResponseData = response;
        if (this.packageResponseData.status == 'success') {
          let data = JSON.parse(this.packageResponseData.data);
          this.packageList = data.packageArray;
          if (
            this.dataRequest == null ||
            this.dataRequest == undefined ||
            this.dataRequest == ''
          ) {

          } else {
            if (
              this.dataRequest.package != null ||
              this.dataRequest.package != undefined ||
              this.dataRequest.package != ''
            ) {
              this.package = this.dataRequest.package;
              this.getSnoClaimDetails();
            }
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
  onChangemamdetrigger(trigger){
    this.trigger = trigger;
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
  claimDetails: any=[];
  gethistoryclaimno(claimno:any){
    this.claimDetails=[]
    this.snoService.getclaimnodetails(claimno).subscribe(
      (data: any) => {
        let resData = data;
        if (resData.status == 'success') {
          let details = JSON.parse(resData.details);
          this.claimDetails = details;
        }else{
          this.swal('error','Something Went Wrong','error')
          this.claimDetails=[]
        }
      }
    )
  }
  triggerList: any = [];
  getTriggerList() {
    this.service.findAllActiveTrigger().subscribe((data: any) => {
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
        //  this.getClaimDetails();
        this.getSchemeDetails();
        // this.getStateList();
        // this.getPackageHeader();
        // this.getWard();
        // this.onSearch();
        // this.getTriggerList();

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
