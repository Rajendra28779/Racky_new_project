import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
declare let $: any;
import Swal from 'sweetalert2';
import { CurrencyPipe, DatePipe } from '@angular/common';
import jsPDF from 'jspdf';
import autoTable from "jspdf-autotable";
import { HeaderService } from '../../header.service';
import { SnoCLaimDetailsService } from '../../Services/sno-claim-details.service';
import { TableUtil } from '../../util/TableUtil';
import { HospitalPackageMappingService } from '../../Services/hospital-package-mapping.service';
import { WardMasterService } from '../../Services/ward-master.service';
import { DynamicreportService } from '../../Services/dynamicreport.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { PackageDetailsMasterService } from '../../Services/package-details-master.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { ClaimRaiseServiceService } from '../../Services/claim-raise-service.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';

@Component({
  selector: 'app-snoapproval',
  templateUrl: './snoapproval.component.html',
  styleUrls: ['./snoapproval.component.scss'],
})
export class SnoapprovalComponent implements OnInit {
  childmessage: any;
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
  schemeidvalue: any = 1;
  schemeName: any
  orderBy: any = 1;
  schemesubcategoryId: any = '';
  // isAscending = true;
  constructor(
    public headerService: HeaderService,
    public snoService: SnoCLaimDetailsService,
    public route: Router,
    private hospitalService: HospitalPackageMappingService,
    private wardService: WardMasterService,
    private service: DynamicreportService,
    private sessionService: SessionStorageService, private encryptionService: EncryptionService, public packageDetailsMasterService: PackageDetailsMasterService,
    private LoginServ: ClaimRaiseServiceService,
    private snoCreateService: SnocreateserviceService,

  ) { }
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
  newList: any = [];
  selectedIndex: number;
  packageHeaderItem: any = [];
  procedure: any = '';
  package: any = '';
  implant: any = '';
  highend: any = '';
  searchtype: any = 1;
  trigger: any = 0;
  ward: any = '';
  first: number;
  last: number;
  filter: any = '';
  totalCpdApproved: any;
  snaApproved: any;
  percent: any;
  snaQuery: any;
  keyword: string = 'packageheadername';
  keyword1: string = 'procedureDescription';
  keyword2: string = 'wardname';
  procedureName: string;
  packageName: string;
  showCount: any = false;
  cpdList: any = [];
  keywordCPD: any = 'fullName';

  @ViewChild('auto') auto;
  @ViewChild('auto1') auto1;
  @ViewChild('auto2') auto2;
  ngOnInit(): void {
    this.headerService.setTitle('CPD Approved');
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
      this.procedure = this.dataRequest.procedure;
      this.package = this.dataRequest.packages;
      this.implant = this.dataRequest.implant;
      this.highend = this.dataRequest.highend;
      this.searchtype = this.dataRequest.searchtype;
      this.ward = this.dataRequest.ward;
      this.filter = this.dataRequest.filter;
      this.trigger = this.dataRequest.trigger;
    }
    this.getSchemeData();
    this.getStateList();
    this.getPackageHeader();
    this.getWard();
    this.onSearch();
    this.getTriggerList();
    this.getCPDList();
    this.getSchemesubcategory();

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

  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }

  onAction(id: any, urn: any, packageCode: any, txnpackagedetailid: any) {
    let state = {
      transactionId: id,
      URN: urn,
      packageCode: packageCode,
      txnpackagedetailid: txnpackagedetailid,
    };
    localStorage.setItem('actionData', JSON.stringify(state));
    this.route.navigate(['/application/snoapproval/action']);
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
      if (this.dataRequest) {
        this.stateId = this.dataRequest.stateCode;
        this.getDistrict(this.stateId);
      }
      // if (
      //   this.dataRequest == null ||
      //   this.dataRequest == undefined ||
      //   this.dataRequest == ''
      // ) {
      //   this.onSearch();
      // } else {
      //   if (
      //     this.dataRequest.stateCode != null ||
      //     this.dataRequest.stateCode != undefined ||
      //     this.dataRequest.stateCode != ''
      //   ) {
      //     this.stateId = this.dataRequest.stateCode;
      //     this.getDistrict(this.stateId);
      //   } else {
      //     this.onSearch();
      //   }
      // }
    });
  }

  getDistrict(code) {
    this.stateCode = code;
    this.userId = this.user.userId;
    this.snoService.getDistrictListByState(this.userId, this.stateCode).subscribe(
      (data: any) => {
        this.distList = data;
        this.distList.sort((a, b) =>
          a.DISTRICTNAME.localeCompare(b.DISTRICTNAME)
        );
        // if (
        //   this.dataRequest == null ||
        //   this.dataRequest == undefined ||
        //   this.dataRequest == ''
        // ) {
        //   this.onSearch();
        // } else {
        //   if (
        //     this.dataRequest.distCode != null ||
        //     this.dataRequest.distCode != undefined ||
        //     this.dataRequest.distCode != ''
        //   ) {
        //     this.distId = this.dataRequest.distCode;
        //     this.getHospital(this.distId);
        //   } else {
        //     this.onSearch();
        //   }
        // }
        if (this.dataRequest) {
          this.distId = this.dataRequest.distCode;
          this.getHospital(this.distId);
        }
      }
    );
  }

  hospitalId: any = '';
  getHospital(code) {
    this.distCode = code;
    this.userId = this.user.userId;
    this.snoService.getHospitalByDist(this.userId, this.stateCode, this.distCode).subscribe(
      (data: any) => {
        this.hospitalList = data;
        // if (
        //   this.dataRequest == null ||
        //   this.dataRequest == undefined ||
        //   this.dataRequest == ''
        // ) {
        //   this.onSearch();
        // } else {
        //   if (
        //     this.dataRequest.hospitalCode != null ||
        //     this.dataRequest.hospitalCode != undefined ||
        //     this.dataRequest.hospitalCode != ''
        //   ) {
        //     this.hospitalId = this.dataRequest.hospitalCode;
        //     this.getHospital1(this.hospitalId);
        //   } else {
        //     this.onSearch();
        //   }
        // }
        this.hospitalId = this.dataRequest.hospitalCode;
      }
    );
  }
  // getHospital1(code) {
  //   this.hospitalId = code;
  //   this.onSearch();
  // }

  onSearch() {
    $('#txtsearchDate').val("");
    let dataRequest = this.sessionService.decryptSessionData('requestData');
    this.pageElement = dataRequest ? parseInt(dataRequest.pageElement) : 20;
    $('#pageItem').val(this.pageElement);
    this.pageIn = dataRequest ? dataRequest.pageIn : 1;
    this.pageEnd = dataRequest ? dataRequest.pageEnd : this.pageElement;
    this.selectedIndex = dataRequest ? dataRequest.selectedIndex : 1;
    this.getSnoClaimDetails();
  }

  onClickSearch() {
    $('#txtsearchDate').val("");
    this.pageElement = 20;
    $('#pageItem').val(this.pageElement);
    this.pageIn = 1;
    this.pageEnd = this.pageElement;
    this.selectedIndex = 1;
    this.first = 0;
    this.last = 10;
    sessionStorage.removeItem('requestData');
    this.dataRequest = null
    this.getSnoClaimDetails();
  }

  // filterSearch() {
  //   this.filter = $('#txtsearchDate').val();
  //   this.pageElement = 20;;;
  //   $('#pageItem').val(this.pageElement);
  //   this.pageIn = 1;
  //   this.pageEnd = this.pageElement;
  //   this.selectedIndex = 1;
  //   this.first = 0;
  //   this.last = 10;
  //   this.getSnoClaimDetails();
  // }

  responseData: any;
  flag: any;
  fromDate: any;
  toDate: any;
  stateCode1: any;
  distCode1: any;
  hospitalCode: any;
  cpdUserId: any;
  getSnoClaimDetails() {
    this.showCount = false;
    let userId = this.user.userId;
    this.flag = 'APRV';
    this.fromDate = $('#datepicker1').val();
    this.toDate = $('#datepicker2').val();
    this.stateCode1 = this.stateId;
    this.distCode1 = this.distId;
    this.hospitalCode = this.hospitalId;
    this.mortality = this.mortality
    this.cpdUserId = this.cpduserid;
    let schemesubcategoryid = this.schemesubcategoryId;
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
    let requestData;
    if (this.dataRequest != null) {
      requestData = this.dataRequest;
    } else {
      requestData = {
        userId: userId,
        flag: this.flag,
        fromDate: new Date(this.fromDate),
        toDate: new Date(this.toDate),
        stateCode: this.stateCode1,
        distCode: this.distCode1,
        hospitalCode: this.hospitalCode,
        cpdFlag: this.statusCPD,
        mortality: this.mortality,
        amountFlag: this.amountFlag,
        description: this.description,
        authMode: this.authMode,
        pageIn: this.pageIn,
        pageEnd: this.pageEnd,
        selectedIndex: this.selectedIndex,
        pageElement: this.pageElement,
        procedure: this.procedure,
        procedureName: this.procedureName,
        packages: this.package,
        packageName: this.packageName,
        implant: this.implant,
        highend: this.highend,
        searchtype: this.searchtype,
        ward: this.ward,
        trigger: this.trigger,
        filter: this.filter.toString().trim(),
        schemeid: schemeid,
        schemecategoryid: schemecategoryid,
        first: this.first,
        last: this.last,
        cpdUserId: this.cpdUserId,
        schemesubcategoryid: schemesubcategoryid
      };
    }
    console.log(requestData);

    sessionStorage.removeItem('requestData');
    this.sessionService.encryptSessionData('requestData', requestData);
    this.snoService.getSnoClaimList(requestData).subscribe(
      (response) => {
        this.responseData = response;
        if (this.responseData.status == 'success') {
          this.size = this.responseData.size;
          // this.filterLen = this.responseData.filterCount;
          // let total = JSON.parse(this.responseData.count);
          // this.totalCpdApproved = total.totalcpdapproved;
          // this.snaApproved = total.snaappofcpdapp;
          // this.snaQuery = total.snaqryofcpdapp;
          // this.percent = (this.snaApproved / this.totalCpdApproved) * 100;
          // this.percent = Math.round(this.percent * 10) / 10 || 0;
          this.snoclaimlist = this.responseData.data;
          console.log(this.snoclaimlist);
          this.snoclaimlist.forEach((element) => {
            if (Number(element.cpdApprovedAmount) < Number(element.currentTotalAmount))
              element.colorStatus = true;
            else
              element.colorStatus = false;
          });
          this.record = this.snoclaimlist.length;
          if (this.record > 0) {
            this.showPegi = true;
            this.totalClaimCount = this.size;
          } else {
            this.showPegi = false;
            this.totalClaimCount = 0;
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
          // this.traverseToRequiredPage();
          let count: number;
          // if (this.filterLen==null || this.filterLen==undefined) {
          count = Math.ceil(this.size / this.pageElement);
          // } else {
          //   count = Math.ceil(this.filterLen / this.pageElement);
          // }
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
          this.newList = [];
          var fst = this.first ? this.first : 0;
          var lst = this.last ? this.last : 10;
          if (this.pgList.length > 0) {
            if (lst > this.pgList[this.pgList.length - 1].id) {
              lst = this.pgList[this.pgList.length - 1].id;
            }
            for (var j = fst; j < lst; j++) {
              var elem = this.pgList[j];
              this.newList.push(elem);
            }
          }


          if (this.dataRequest != null) {
            this.first = this.dataRequest.first;
            this.last = this.dataRequest.last;
            var fst = this.first ? this.first : 0;
            var lst = this.last ? this.last : 10;
            this.newList = [];
            if (this.pgList.length > 0) {
              let length = this.pgList[this.pgList.length - 1].id;
              if (lst > length) { lst = length; }
              for (var j = fst; j < lst; j++) {
                var elem = this.pgList[j];
                this.newList.push(elem);
              }
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
  // Onsearch(){
  //   const URNNO = $('#txtsearchDate').val();
  //   if(URNNO == ""){
  //     this.swal('', 'Please Enter URN Number', 'info');
  //     this.getSnoClaimDetails();
  //   }
  //   this.snoclaimlist = this.snoclaimlist.filter((data:any)=> {
  //     // return d.title.toLocaleLowercase().indexOf(this.findTitle) !== -1 || !this.findTitle.toLocaleLowercase();
  //     return data.urn.match(URNNO);
  //   });
  // }
  // countReport(requestData) {
  //   this.snoService.getCountReport(requestData).subscribe(
  //     (response) => {
  //       this.responseData = response;
  //       if (this.responseData.status == 'success') {
  //         let data = JSON.parse(this.responseData.data);
  //         this.totalCpdApproved = data.totalcpdapproved;
  //         this.snaApproved = data.snaappofcpdapp;
  //         this.snaQuery = data.snaqryofcpdapp;
  //         this.percent = (this.snaApproved / this.totalCpdApproved) * 100;
  //         this.percent = Math.round(this.percent * 10) / 10 || 0;
  //       } else {
  //         this.swal('Error', 'Something went wrong.', 'error');
  //       }
  //     },
  //     (error) => {
  //       this.swal('Error', 'Something went wrong.', 'error');
  //     }
  //   );
  // }

  pageItemChange() {
    // this.ngOnInit();
    // this.pageElement = $('#pageItem').val();
    if (this.dataRequest != null) {
      this.dataRequest.pageIn = 1;
      this.dataRequest.pageEnd = this.pageElement;
      this.dataRequest.selectedIndex = 1;
    }
    this.pageIn = 1;
    this.pageEnd = this.pageElement;
    this.selectedIndex = 1;
    this.first = 0;
    this.last = 10;
    this.getSnoClaimDetails();
  }

  paginate(element) {
    if (this.dataRequest != null) {
      this.dataRequest.selectedIndex = element.id;
      this.dataRequest.pageIn = element.init;
      this.dataRequest.pageEnd = element.end;
    }
    this.selectedIndex = element.id;
    this.pageIn = element.init;
    this.pageEnd = element.end;
    this.getSnoClaimDetails();
  }

  prev() {
    if (this.selectedIndex == this.newList[0].id) {
      var fst = this.newList[0].id - 1;
      this.first = fst - 10;
      this.last = fst;
    }
    if (this.dataRequest != null) {
      this.dataRequest.selectedIndex = this.selectedIndex - 1;
      this.dataRequest.pageIn = this.pageIn - this.pageElement;
      this.dataRequest.pageEnd = this.pageEnd - this.pageElement;
    }
    this.selectedIndex = this.selectedIndex - 1;
    this.pageIn = this.pageIn - this.pageElement;
    this.pageEnd = this.pageEnd - this.pageElement;
    this.getSnoClaimDetails();
  }

  next() {
    if (this.selectedIndex == this.newList[this.newList.length - 1].id) {
      var lst = +this.newList[this.newList.length - 1].id;
      this.first = lst;
      this.last = lst + 10;
    }
    if (this.dataRequest != null) {
      this.dataRequest.selectedIndex = this.selectedIndex + 1;
      this.dataRequest.pageIn = +this.pageIn + +this.pageElement;
      this.dataRequest.pageEnd = +this.pageEnd + +this.pageElement;
    }
    this.selectedIndex = this.selectedIndex + 1;
    this.pageIn = +this.pageIn + +this.pageElement;
    this.pageEnd = +this.pageEnd + +this.pageElement;
    this.getSnoClaimDetails();
  }

  prevlist() {
    var fst = this.newList[0].id - 1;
    this.first = fst - 10;
    this.last = fst;
    if (this.dataRequest != null) {
      this.dataRequest.selectedIndex = fst - 10 + 1;
      this.dataRequest.pageIn = this.newList[0].init - this.pageElement * 10;
      this.dataRequest.pageEnd = this.newList[0].end - this.pageElement * 10;
    }
    this.selectedIndex = fst - 10 + 1;
    this.pageIn = this.newList[0].init - this.pageElement * 10;
    this.pageEnd = this.newList[0].end - this.pageElement * 10;
    this.getSnoClaimDetails();
  }

  nextlist() {
    var lst = +this.newList[this.newList.length - 1].id;
    this.first = lst;
    this.last = lst + 10;
    if (this.dataRequest != null) {
      this.dataRequest.selectedIndex = lst + 1;
      this.dataRequest.pageIn = +this.newList[this.newList.length - 1].init + +this.pageElement;
      this.dataRequest.pageEnd = +this.newList[this.newList.length - 1].end + +this.pageElement;
    }
    this.selectedIndex = lst + 1;
    this.pageIn = +this.newList[this.newList.length - 1].init + +this.pageElement;
    this.pageEnd = +this.newList[this.newList.length - 1].end + +this.pageElement;
    this.getSnoClaimDetails();
  }

  ResetField() {
    sessionStorage.removeItem('requestData');
    // this.getDate();
    // $('input[name="fromDate"]').val(this.frstDay);
    // $('input[name="toDate"]').val(this.secoundDay);
    // this.form.reset;
    // this.getSnoClaimDetails();
    window.location.reload();
    //  $('#statecode1').val('');
    //  $('#distcode1').val('');
    // $('#hospitalcode').val('');
    // this.mortality="";
    // this.cpdFlag="";
  }

  cpdFlag: any = 0;
  onChangeFlag(event) {
    this.cpdFlag = event.target.value;
  }

  onChangeAmountFlag(event) {
    this.amountFlag = event.target.value;
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }

  // traverseToRequiredPage() {
  //   if (this.currentPagenNum != null && this.currentPagenNum != undefined) {
  //     // if (this.currentPagenNum != null || this.currentPagenNum != undefined || this.currentPagenNum != "") {
  //     this.currentPage = this.currentPagenNum;
  //     sessionStorage.removeItem('currentPageNum');
  //   } else {
  //     this.currentPage = 1;
  //   }
  // }

  mortality: any = '';
  onChangemortality(data) {
    this.mortality = data;
  }

  // onPageBoundsCorrection(number: number) {
  //   this.currentPage = number;
  // }

  report: any = [];
  sno: any = {
    Slno: "",
    URN: "",
    claimNo: "",
    PatientName: "",
    phone: "",
    HospitalName: "",
    invoiceNo: "",
    PackageID: "",
    ActualDateofAdmission: "",
    ActualDateofDischarge: "",
    HospitalClaimAmount: "",
    CPDApprovedAmount: "",
    CPDMortality: "",
    HospitalMortality: ""
  };
  heading = [["Sl No", "URN", "Claim No", "Patient Name", "Phone No", "Hospital Details", "Invoice No", "Package ID", "Actual Date of Admission", "Actual Date of Discharge", "Hospital Claim Amount (₹)", "CPD Approved Amount (₹)", "CPD Mortality", "Hospital Mortality"]];

  downloadReport() {
    this.report = [];
    let claim: any;
    for (var i = 0; i < this.snoclaimlist.length; i++) {
      claim = this.snoclaimlist[i];
      this.sno = [];
      this.sno.Slno = (i + 1).toString();
      this.sno.URN = claim.urn;
      this.sno.claimNo = claim.claimNo;
      this.sno.PatientName = claim.patientName;
      this.sno.phone = claim.phone;
      this.sno.HospitalName = claim.hospitalName + '(' + claim.hospitalCode + ')';
      this.sno.invoiceNo = claim.invoiceNumber;
      this.sno.PackageID = claim.packageCode;
      this.sno.ActualDateofAdmission = claim.actualDateOfAdmission;
      this.sno.ActualDateofDischarge = claim.actualDateOfDischarge;
      this.sno.HospitalClaimAmount = this.convertCurrency(claim.currentTotalAmount);
      this.sno.CPDApprovedAmount = this.convertCurrency(claim.cpdApprovedAmount);
      this.sno.CPDMortality = this.Findmortality(claim.mortality);
      this.sno.HospitalMortality = this.Findmortality(claim.hospitalMortality);
      this.report.push(this.sno);
    }
    // TableUtil.exportListToExcel(this.report, "CPD Approved List", this.heading);
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
    let amountflag = 'All';
    if (this.amountFlag == '1') {
      amountflag = 'Less Approved Amount';
    }
    let filter = [];
    filter.push([['Scheme Name', "GJAY"]]);
    filter.push([['Scheme Category Name', this.schemecategoryName]]);
    filter.push([['Actual Date of Discharge From', this.fromDate]]);
    filter.push([['Actual Date of Discharge To', this.toDate]]);
    filter.push([['State Name', stateName]]);
    filter.push([['District Name', districtName]]);
    filter.push([['Hospital Name', hospitalName]]);
    filter.push([['Mortality', this.Findmortality1(this.mortality)]]);
    filter.push([['Description', this.description]]);
    filter.push([['Authentication Mode', this.findAuth(this.authMode)]]);
    filter.push([['CPD Status', this.CPDStatus(this.statusCPD)]]);
    filter.push([['Amount', amountflag]]);
    if (this.searchtype == 2) {
      filter.push([['Search Type', "1.0 Block Data"]]);
    } else {
      filter.push([['Search Type', "All"]]);
    }
    TableUtil.exportListToExcelWithFilter(this.report, 'CPD Approved List', this.heading, filter);
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
      doc.text('Actual Date of Discharge To:' + this.toDate, 150, 10);
      doc.text('Mortality:' + this.Findmortality1(this.mortality), 10, 20);
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
      let amountflag = 'All';
      if (this.amountFlag == '1') {
        amountflag = 'Less Approved Amount';
      }
      doc.text('State Name:' + stateName, 60, 20);
      doc.text('District Name:' + districtName, 150, 20);
      if (this.searchtype == 2) {
        doc.text('Search Type :' + "1.0 Block Data", 240, 20);
      } else {
        doc.text('Search Type :' + "All", 240, 20);
      }
      doc.text('Hospital Name:' + hospitalName, 10, 30);
      doc.text('Description:' + this.description, 10, 40);
      doc.text('Authentication Mode:' + this.findAuth(this.authMode), 10, 50);
      doc.text('CPD Status:' + this.CPDStatus(this.statusCPD), 60, 50);
      doc.text('Amount:' + amountflag, 150, 50);
      doc.text("Generated On: " + this.convertDate(new Date()), 10, 60);
      doc.text("Generated By: " + this.user.fullName, 150, 60);
      doc.text("CPD Approved List", 125, 70);
      var col = [["Sl#", "URN", "Claim No", "Patient Name", "Phone No", "Hospital Details", "Invoice No", "Package ID", "Actual Date of Admission", "Actual Date of Discharge", "Hospital Claim Amount (₹)", "CPD Approved Amount (₹)", "CPD Mortality", "Hospital Mortality"]];
      var rows = [];
      var claim: any;
      for (var i = 0; i < this.snoclaimlist.length; i++) {
        claim = this.snoclaimlist[i];
        var temp = [(i + 1), claim.urn, claim.claimNo, claim.patientName, claim.phone, claim.hospitalName + '(' + claim.hospitalCode + ')', claim.invoiceNumber, claim.packageCode, claim.actualDateOfAdmission, claim.actualDateOfDischarge, this.convertCurrency(claim.currentTotalAmount), this.convertCurrency(claim.cpdApprovedAmount),
        this.Findmortality(claim.mortality),
        this.Findmortality(claim.hospitalMortality)];
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
          13: { cellWidth: 15 },
        },
      });
      doc.save('CPDApprovedList.pdf');
    }
  }

  Findmortality(value: any) {
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
  Findmortality1(value: any) {
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
    } else if (value == '5') {
      value = "FACE";
    }
    else {
      value = "All";
    }
    return value;
  }
  CPDStatus(val: any) {
    let status = '';
    if (val == '0') {
      status = 'CPD Approved';
    }
    else if (val == '1') {
      status = 'Auto Approved';
    }
    return status;
  }
  getPackageHeader() {
    this.hospitalService.getallPackageHeaders().subscribe((data: any) => {
      this.packageHeaderItem = data;
      if (this.dataRequest) {
        this.procedure = this.dataRequest.procedure;
        if (this.schemeidvalue != null && this.schemeidvalue != '' && this.schemeidvalue != undefined) {
          this.getPackageSchemeName(this.procedure);
        } else {
          this.getPackageName(this.procedure);
        }
        //   if (
        //     this.dataRequest.procedure != null ||
        //     this.dataRequest.procedure != undefined ||
        //     this.dataRequest.procedure != ''
        //   ) {
        //     this.procedure = this.dataRequest.procedure;
        //     this.getPackageName(this.procedure);
        //   } else {
        //     this.onSearch();
        //   }
      }
    });
  }
  wardList: any = [];
  getWard() {
    this.wardService.getallWardCategorydata().subscribe((data: any) => {
      this.wardList = data;
      if (this.dataRequest) {
        //   if (
        //     this.dataRequest.ward != null ||
        //     this.dataRequest.ward != undefined ||
        //     this.dataRequest.ward != ''
        //   ) {
        this.ward = this.dataRequest.ward;
        //   }
      }
    });
  }
  packageResponseData: any;
  packageList: any = [];
  getPackageName(data) {
    this.packageList = [];
    this.auto1.clear();
    this.package = '';
    let procedureCode = data;
    this.snoService.getPackageName(procedureCode).subscribe(
      (response) => {
        this.packageResponseData = response;
        if (this.packageResponseData.status == 'success') {
          let data = JSON.parse(this.packageResponseData.data);
          this.packageList = data.packageArray;
          if (this.dataRequest) {
            this.package = this.dataRequest.packages;
          }
          // if (
          //   this.dataRequest == null ||
          //   this.dataRequest == undefined ||
          //   this.dataRequest == ''
          // ) {
          // } else {
          //   if (
          //     this.dataRequest.package != null ||
          //     this.dataRequest.package != undefined ||
          //     this.dataRequest.package != ''
          //   ) {
          //     this.package = this.dataRequest.packages;
          //     this.onSearch();
          //   }
          // }
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
  onChangesearchtype(searchtype) {
    this.searchtype = searchtype
  }
  onChangemamdetrigger(trigger) {
    this.trigger = trigger;
  }

  selectEvent(item) {
    if (this.dataRequest && this.dataRequest.procedure) {
      this.procedure = this.dataRequest.procedure;
    } else {
      this.procedure = item.packageheadercode;
    }
    if (this.schemeidvalue != null && this.schemeidvalue != '' && this.schemeidvalue != undefined) {
      this.getPackageSchemeName(this.procedure);
    } else {
      this.getPackageName(this.procedure);
    }
    this.procedureName = item.packageheadername;
  }

  clearEvent() {
    this.procedure = '';
    this.getPackageName(this.procedure);
    this.procedureName = '';
    this.auto1.clear();
  }

  selectEvent1(item) {
    // if (this.dataRequest && this.dataRequest.packages) {
    // this.package = this.dataRequest.packages;
    // } else {
    this.package = item.procedureCode;
    // }
    this.packageName = item.procedureDescription;
  }

  clearEvent1() {
    this.package = '';
    this.packageName = '';
  }

  selectEvent2(item) {
    if (this.dataRequest && this.dataRequest.ward) {
      this.ward = this.dataRequest.ward;
    } else {
      this.ward = item.wardname;
    }
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
  triggerList: any = [];
  getTriggerList() {
    this.service.findAllActiveTrigger().subscribe((data: any) => {
      this.triggerList = data;
    })
  }

  getCountDetails() {
    let userId = this.user.userId;
    this.flag = 'APRV';
    this.fromDate = $('#datepicker1').val();
    this.toDate = $('#datepicker2').val();
    this.stateCode1 = this.stateId;
    this.distCode1 = this.distId;
    this.hospitalCode = this.hospitalId;
    this.mortality = this.mortality;
    this.cpdUserId = this.cpduserid;
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
    let requestData;
    if (this.dataRequest != null) {
      requestData = this.dataRequest;
    } else {
      requestData = {
        userId: userId,
        flag: this.flag,
        fromDate: new Date(this.fromDate),
        toDate: new Date(this.toDate),
        stateCode: this.stateCode1,
        distCode: this.distCode1,
        hospitalCode: this.hospitalCode,
        cpdFlag: this.statusCPD,
        mortality: this.mortality,
        amountFlag: this.amountFlag,
        description: this.description,
        authMode: this.authMode,
        pageIn: this.pageIn,
        pageEnd: this.pageEnd,
        selectedIndex: this.selectedIndex,
        pageElement: this.pageElement,
        procedure: this.procedure,
        procedureName: this.procedureName,
        packages: this.package,
        packageName: this.packageName,
        implant: this.implant,
        highend: this.highend,
        searchtype: this.searchtype,
        ward: this.ward,
        trigger: this.trigger,
        filter: this.filter.toString().trim(),
        schemeid: schemeid,
        schemecategoryid: schemecategoryid,
        cpdUserId: this.cpdUserId
      };
    }
    this.sessionService.encryptSessionData('requestData', requestData);
    this.snoService.getSnoCount(requestData).subscribe(
      (response) => {
        this.responseData = response;
        if (this.responseData.status == 'success') {
          let countResponse = JSON.parse(this.responseData.count);
          this.totalCpdApproved = countResponse.totalcpdapproved;
          this.snaApproved = countResponse.snaappofcpdapp;
          this.snaQuery = countResponse.snaqryofcpdapp;
          // this.size = countResponse.total;
          this.percent = countResponse.percent;
          // this.totalClaimCount = this.size;
          this.showCount = true;
        } else {
          this.swal('Error', 'Something went wrong.', 'error');
          this.showCount = false;
        }
      },
      (error) => {
        console.log(error);
        this.swal('Error', 'Something went wrong.', 'error');
      }
    );
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
  getCPDList() {
    this.snoCreateService.getCPDList().subscribe(
      (response) => {
        this.cpdList = response;
        console.log(this.cpdList);
      })
  }
  // cpdId:any="";
  cpdname: any = "All";
  cpduserid: any = "";

  selectCPDEvent(item) {
    // this.cpdId = item.bskyUserId;
    this.cpdname = item.fullName;
    this.cpduserid = item.userid;
  }

  clearCPDEvent() {
    // this.cpdId ='';
    this.cpdname = "All";
    this.cpduserid = '';
  }

  isAscending: boolean = true;
  // changeOrderBy(type: String) {
  //   if (type == 'HospitalClaimAmount') {
  //     $('#orderBy').removeClass('bi bi-arrow-down-circle-fill');
  //     this.snoclaimlist.sort((a, b) => {
  //       const amountA = parseInt(a.currentTotalAmount);
  //       const amountB = parseInt(b.currentTotalAmount);
  //       if (this.isAscending) {
  //         return amountA - amountB;
  //       } else {
  //         return amountB - amountA;
  //       }
  //     });
  //     this.isAscending = !this.isAscending;
  //     console.log(this.isAscending);
  //     if (this.isAscending == false) {
  //       $('#orderBy').removeClass('bi-arrow-up-circle-fill').addClass('bi bi-arrow-down-circle-fill');
  //     } else if (this.isAscending == true) {
  //       $('#orderBy').removeClass('bi-arrow-down-circle-fill').addClass('bi bi-arrow-up-circle-fill');

  //     }
  //   } else if (type == 'HospitalDetails') {
  //     this.snoclaimlist.sort((a, b) => {
  //       const nameA = a.hospitalName.toUpperCase();
  //       const nameB = b.hospitalName.toUpperCase();

  //       if (this.isAscending) {
  //         if (nameA < nameB) return -1;
  //         if (nameA > nameB) return 1;
  //         return 0;
  //       } else {
  //         if (nameA > nameB) return -1;
  //         if (nameA < nameB) return 1;
  //         return 0;
  //       }
  //     });

  //     // Toggle sorting order for next click
  //     this.isAscending = !this.isAscending;
  //     if (this.isAscending == false) {
  //       $('#orderByHospitaldetails').removeClass('bi-arrow-up-circle-fill').addClass('bi bi-arrow-down-circle-fill');
  //     } else if (this.isAscending == true) {
  //       $('#orderByHospitaldetails').removeClass('bi-arrow-down-circle-fill').addClass('bi bi-arrow-up-circle-fill');
  //     }

  //   } else if (type == 'CPDApprovedAmount') {
  //     this.snoclaimlist.sort((a, b) => {
  //       const amountA = parseInt(a.cpdApprovedAmount);
  //       const amountB = parseInt(b.cpdApprovedAmount);
  //       if (this.isAscending) {
  //         return amountA - amountB;
  //       } else {
  //         return amountB - amountA;
  //       }
  //     });
  //     this.isAscending = !this.isAscending;
  //     console.log(this.isAscending);
  //     if (this.isAscending == false) {
  //       $('#orderByCpdappamount').removeClass('bi-arrow-up-circle-fill').addClass('bi bi-arrow-down-circle-fill');
  //     } else if (this.isAscending == true) {
  //       $('#orderByCpdappamount').removeClass('bi-arrow-down-circle-fill').addClass('bi bi-arrow-up-circle-fill');
  //     }
  //   } else if (type == 'PatientName') {
  //     this.snoclaimlist.sort((a, b) => {
  //       const nameA = a.patientName.toUpperCase();
  //       const nameB = b.patientName.toUpperCase();

  //       if (this.isAscending) {
  //         if (nameA < nameB) return -1;
  //         if (nameA > nameB) return 1;
  //         return 0;
  //       } else {
  //         if (nameA > nameB) return -1;
  //         if (nameA < nameB) return 1;
  //         return 0;
  //       }
  //     });

  //     // Toggle sorting order for next click
  //     this.isAscending = !this.isAscending;
  //     if (this.isAscending == false) {
  //       $('#orderByPatientName').removeClass('bi-arrow-up-circle-fill').addClass('bi bi-arrow-down-circle-fill');
  //     } else if (this.isAscending == true) {
  //       $('#orderByPatientName').removeClass('bi-arrow-down-circle-fill').addClass('bi bi-arrow-up-circle-fill');
  //     }
  //   } else if (type == 'ActualDateofDischarge') {
  //     this.snoclaimlist.sort((a, b) => {
  //       const dateA = new Date(a.actualDateOfDischarge);
  //       const dateB = new Date(b.actualDateOfDischarge);

  //       if (this.isAscending) {
  //         return dateA.getTime() - dateB.getTime();
  //       } else {
  //         return dateB.getTime() - dateA.getTime();
  //       }
  //     });

  //     // Toggle sorting order for next click
  //     this.isAscending = !this.isAscending;
  //     if (this.isAscending == false) {
  //       $('#orderByActualDateofDischarge').removeClass('bi-arrow-up-circle-fill').addClass('bi bi-arrow-down-circle-fill');
  //     } else if (this.isAscending == true) {
  //       $('#orderByActualDateofDischarge').removeClass('bi-arrow-down-circle-fill').addClass('bi bi-arrow-up-circle-fill');
  //     }
  //   }
  // }
  changeOrderBy(type: string) {
    const orderIconMap = {
      HospitalClaimAmount: '#orderBy',
      HospitalDetails: '#orderByHospitaldetails',
      CPDApprovedAmount: '#orderByCpdappamount',
      PatientName: '#orderByPatientName',
      ActualDateofDischarge: '#orderByActualDateofDischarge'
    };

    const sortingFunctionMap = {
      HospitalClaimAmount: (a, b) => parseInt(a.currentTotalAmount) - parseInt(b.currentTotalAmount),
      HospitalDetails: (a, b) => a.hospitalName.localeCompare(b.hospitalName),
      CPDApprovedAmount: (a, b) => parseInt(a.cpdApprovedAmount) - parseInt(b.cpdApprovedAmount),
      PatientName: (a, b) => a.patientName.localeCompare(b.patientName),
      ActualDateofDischarge: (a, b) => new Date(a.actualDateOfDischarge).getTime() - new Date(b.actualDateOfDischarge).getTime()
    };

    const toggleIconClass = (iconSelector: string) => {
      $(iconSelector).toggleClass('bi bi-arrow-up-circle-fill bi bi-arrow-down-circle-fill');
    };

    const sortBy = sortingFunctionMap[type];
    const iconSelector = orderIconMap[type];

    this.snoclaimlist.sort((a, b) => {
      if (this.isAscending) {
        return sortBy(a, b);
      } else {
        return sortBy(b, a);
      }
    });

    toggleIconClass(iconSelector);
    this.isAscending = !this.isAscending;
  }

  schemesubcategory: any = [];
  getSchemesubcategory() {
    this.snoService.getSchemesubcategory().subscribe((data: any) => {
      this.schemesubcategory = data;
      for (let i = 0; i < this.schemesubcategory.length; i++) {
        if (this.schemesubcategory[i].schemeid === 1 && this.schemesubcategory[i].schemecategoryid === 1) {
          this.schemesubcategory[i].subcategoryname = '(0-18)NFSA/SFSS';
        } else {
          this.schemesubcategory[i].subcategoryname = '(0-18)GJAY-1';
        }
      }
    });
  }

  getname(id) {
    this.schemesubcategoryId = id;
  }
}


