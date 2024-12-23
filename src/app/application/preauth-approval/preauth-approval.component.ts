import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../header.service';
import { SnoCLaimDetailsService } from '../Services/sno-claim-details.service';
import Swal from 'sweetalert2';
import { PreauthService } from '../Services/preauth.service';
import { FormGroup, FormControl } from '@angular/forms';
import { approvedetails } from 'src/app/services/api-config';
import { Router } from '@angular/router';
import { parse } from 'path';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { PackageDetailsMasterService } from '../Services/package-details-master.service';
declare let $: any;

@Component({
  selector: 'app-preauth-approval',
  templateUrl: './preauth-approval.component.html',
  styleUrls: ['./preauth-approval.component.scss']
})
export class PreauthApprovalComponent implements OnInit {
  snoclaimlist: any;
  user: any;
  txtsearchDate: any;
  isDisplayed: boolean = false;
  userId: any;
  preauth: any;
  preauthList: any;
  record: any;
  selected: any[];
  preauthData: any;
  group: FormGroup;
  snaremarks: any;
  item: string;
  preAuthId: any;
  pageElement: any;
  showPegi: boolean;
  currentPage: number;
  appAmt: any;
  approvedamount: any;
  statelist: Array<any> = [];
  stateData: any = [];
  distList: any;
  distCode: any;
  hospitalList: any;
  stateCode: any;
  maxChars = 500;
  HighlightRow: Number;
  allremarks: any;
  check: boolean = false;
  isQuery: boolean = false;
  isReject: boolean = false;
  isInvestigate: boolean = false;
  isRevert: boolean = false;
  isApproved: boolean = false;
  actionRemarkId: string;
  preauthCount: any;
  preauthListCount: any;
  totalCount: any;
  completePer: number = 0;
  pendingPer: number = 0;
  totalCost: any;
  remk: any;
  keyword = 'remarks';
  preauthCountData: any;
  totalCountP: any;
  totalCountC: any;
  txnpackagedetailid: number;
  hedList: any;
  hed: any;
  impList: any;
  implant: any;
  totalOthers: any;

  constructor(
    public headerService: HeaderService,
    public snoService: SnoCLaimDetailsService,
    public preauthService: PreauthService,
    public route: Router, private sessionService: SessionStorageService,
    private encryptionService: EncryptionService, public packageDetailsMasterService: PackageDetailsMasterService
  ) {
  }

  ngOnInit(): void {
    this.getSchemeData();
    this.headerService.setTitle('Preauth');
    this.user = this.sessionService.decryptSessionData("user");
    localStorage.removeItem('preauthData');
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
      format: 'DD-MM-YYYY LT',
      daysOfWeekDisabled: ['', 7],
    });
    var date = new Date();

    let year = date.getFullYear();
    let date1 = '01';
    let month: any = date.getMonth() - 1;
    if (month == -1) {
      month = 11;
      year = year - 1;
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
    var frstDay = date1 + '-' + month + '-' + year;
    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr('placeholder', 'From Date *');

    $('input[name="toDate"]').attr('placeholder', 'To Date *');
    this.getStateList();
    this.getPreAuthorizationList();
    this.getPreAuthorizationCount();
    this.getRemarks();
    this.group = new FormGroup({
      group: new FormControl(''),
      approvedamount: new FormControl(''),
      snaremarks: new FormControl(''),
      userId: new FormControl(''),
      action: new FormControl(''),
      remk: new FormControl(''),
      remark: new FormControl('')
    });
  }

  showHide() {
    this.isDisplayed = !this.isDisplayed;
  }

  status1(item, id) {
    this.selected = [];
    var list = this.preauthList;
    var l = list.filter((opt: any) => opt.statusFlag).map((opt: any) => opt);
    for (var j = 0; j < l.length; j++) {
      this.selected.push(l[j])
    }
    this.txnpackagedetailid = id;
    this.getImplantList();
    this.getHedList();
  }
  statusSubmit(urn, id) {
    let state = {
      urnNo: urn,
      txnPckgDetailId: id,
    };
    localStorage.setItem('preauthData', JSON.stringify(state));
    this.route.navigate(['/application/preauthdetails']);
  }
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
    });
  }

  OnChangeState(event) {
    this.stateCode = event.target.value;
    this.userId = this.user.userId;
    this.snoService
      .getDistrictListByState(this.userId, this.stateCode)
      .subscribe((data) => {
        this.distList = data;
        this.distList.sort((a, b) =>
          a.DISTRICTNAME.localeCompare(b.DISTRICTNAME)
        );
      });
  }

  OnChangeDist(event) {
    this.distCode = event.target.value;
    this.userId = this.user.userId;
    this.snoService
      .getHospitalByDist(this.userId, this.stateCode, this.distCode)
      .subscribe((data) => {
        this.hospitalList = data;
      });
  }

  keyPress(event: KeyboardEvent) {
    const pattern = /^[A-Za-z0-9.,-_ \\s]+$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }

  getPreAuthorizationList() {
    let userId = this.user.userId;
    let flag = $('#status').val();
    let fromDate = $('#formdate').val();
    let distCode1 = $('#dist').val();
    let hospitalCode = $('#hospital').val();
    let toDate = $('#todate').val();
    let stateCode1 = $('#state').val();
    let TXNPACKAGEDETAILID = $('#TXNPACKAGEDETAILID').val();
    let schemeid = this.schemeidvalue;
    let schemecategoryid = this.schemecategoryidvalue;
    if (schemecategoryid == null || schemecategoryid == undefined || schemecategoryid == '') {
      schemecategoryid = "";
    } else {
      schemecategoryid = schemecategoryid;
    }
    if (Date.parse(fromDate) > Date.parse(toDate)) {
      this.swal('', ' From Date should be less To Date', 'error');
      return;
    }
    let requestData = {
      userId: userId,
      fromDate: fromDate,
      toDate: toDate,
      stateCode1: stateCode1,
      distCode1: distCode1,
      hospitalCode: hospitalCode,
      flag: flag,
      action: "A",
      TXNPACKAGEDETAILID: TXNPACKAGEDETAILID,
      schemeid: schemeid,
      schemecategoryid: schemecategoryid
    };
    console.log(requestData);
    console.log("okkkkk");
    this.preauthService.getPreAuthorizationList(requestData).subscribe(
      (data) => {
        this.preauth = data;
        if (this.preauth.status == 'success') {
          this.preauthList = this.preauth.data;
          if (this.preauthList.length) {
            this.currentPage = 1;
            this.pageElement = 50;
            this.showPegi = true;
          } else {
            this.showPegi = false;
          }
        } else {
          this.swal('', 'Something went wrong.', 'error');
        }
      },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      }
    );
    this.getPreAuthorizationCount();
  }

  getPreAuthorizationCount() {
    let userId = this.user.userId;
    let flag = $('#status').val();
    let fromDate = $('#formdate').val();
    let distCode1 = $('#dist').val();
    let hospitalCode = $('#hospital').val();
    let toDate = $('#todate').val();
    let stateCode1 = $('#state').val();
    let TXNPACKAGEDETAILID = $('#TXNPACKAGEDETAILID').val();
    let schemeid = this.schemeidvalue;
    let schemecategoryid = this.schemecategoryidvalue;
    if (schemecategoryid == null || schemecategoryid == undefined || schemecategoryid == '') {
      schemecategoryid = "";
    } else {
      schemecategoryid = schemecategoryid;
    }
    if (Date.parse(fromDate) > Date.parse(toDate)) {
      this.swal('', ' From Date should be less To Date', 'error');
      return;
    }
    let requestData = {
      userId: userId,
      fromDate: fromDate,
      toDate: toDate,
      stateCode1: stateCode1,
      distCode1: distCode1,
      hospitalCode: hospitalCode,
      flag: flag,
      action: "C",
      TXNPACKAGEDETAILID: TXNPACKAGEDETAILID,
      schemeid: schemeid,
      schemecategoryid: schemecategoryid
    };

    this.preauthService.getPreAuthorizationList(requestData).subscribe(
      (data) => {
        this.preauthListCount = data;
        if (this.preauthListCount.status == 'success') {
          this.preauthCount = this.preauthListCount.data;
          this.preauthCountData = this.preauthCount[0]
          this.totalCount = this.preauthCountData.fresh + this.preauthCountData.querycomplied + this.preauthCountData.query + this.preauthCountData.approve + this.preauthCountData.reject + this.preauthCountData.autoapprove + this.preauthCountData.autoreject + this.preauthCountData.expired + this.preauthCountData.cancelled;
          this.totalCountP = this.preauthCountData.fresh + this.preauthCountData.querycomplied;
          this.totalCountC = this.preauthCountData.approve + this.preauthCountData.reject + this.preauthCountData.autoapprove + this.preauthCountData.query + this.preauthCountData.autoreject + this.preauthCountData.expired + this.preauthCountData.cancelled;
          this.totalOthers = this.preauthCountData.autoapprove + this.preauthCountData.autoreject + this.preauthCountData.expired + this.preauthCountData.cancelled;
          this.pendingPer = ((this.totalCountP) / this.totalCount) * 100
          this.completePer = ((this.totalCountC) / this.totalCount) * 100
          if (this.preauthCount.length) {
            this.currentPage = 1;
            this.pageElement = 10;
            this.showPegi = true;
          } else {
            this.showPegi = false;
          }
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

  getHedList() {
    let userId = this.user.userId;
    let flag = $('#status').val();
    let fromDate = $('#formdate').val();
    let distCode1 = $('#dist').val();
    let hospitalCode = $('#hospital').val();
    let toDate = $('#todate').val();
    let stateCode1 = $('#state').val();
    let TXNPACKAGEDETAILID = this.txnpackagedetailid;
    let schemeid = this.schemeidvalue;
    let schemecategoryid = this.schemecategoryidvalue;
    if (schemecategoryid == null || schemecategoryid == undefined || schemecategoryid == '') {
      schemecategoryid = "";
    } else {
      schemecategoryid = schemecategoryid;
    }
    if (Date.parse(fromDate) > Date.parse(toDate)) {
      this.swal('', ' From Date should be less To Date', 'error');
      return;
    }
    let requestData = {
      userId: "",
      fromDate: "",
      toDate: "",
      stateCode1: stateCode1,
      distCode1: distCode1,
      hospitalCode: hospitalCode,
      flag: flag,
      action: "D",
      txnPackageDetailId: TXNPACKAGEDETAILID,
      schemeid: schemeid,
      schemecategoryid: schemecategoryid
    };
    this.preauthService.getPreAuthorizationList(requestData).subscribe(
      (data) => {
        this.hedList = data;
        if (this.hedList.status == 'success') {
          this.hed = this.hedList.data;
        }
      },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      }
    );
  }

  getImplantList() {
    let userId = this.user.userId;
    let flag = $('#status').val();
    let fromDate = $('#formdate').val();
    let distCode1 = $('#dist').val();
    let hospitalCode = $('#hospital').val();
    let toDate = $('#todate').val();
    let stateCode1 = $('#state').val();
    let TXNPACKAGEDETAILID = this.txnpackagedetailid;
    let schemeid = this.schemeidvalue;
    let schemecategoryid = this.schemecategoryidvalue;
    if (schemecategoryid == null || schemecategoryid == undefined || schemecategoryid == '') {
      schemecategoryid = "";
    } else {
      schemecategoryid = schemecategoryid;
    }
    if (Date.parse(fromDate) > Date.parse(toDate)) {
      this.swal('', ' From Date should be less To Date', 'error');
      return;
    }
    let requestData = {
      userId: "",
      fromDate: "",
      toDate: "",
      stateCode1: stateCode1,
      distCode1: distCode1,
      hospitalCode: hospitalCode,
      flag: flag,
      action: "E",
      txnPackageDetailId: TXNPACKAGEDETAILID,
      schemeid: schemeid,
      schemecategoryid: schemecategoryid
    };
    this.preauthService.getPreAuthorizationList(requestData).subscribe(
      (data) => {
        this.impList = data;
        if (this.impList.status == 'success') {
          this.implant = this.impList.data;
        }
      },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      }
    );
  }

  getRemarks() {
    this.snoService.getRemarks().subscribe((data: any) => {
      this.allremarks = data;
    },
      (error) => {
        console.log(error);
      }
    );
  }

  clearEvent() {
    this.actionRemarkId = '';
  }

  getId(item) {
    let id = item.id;
    this.actionRemarkId = id;
    if (id == 1) {
      this.isQuery = true;
      this.isReject = true;
      this.isInvestigate = true;
      this.isRevert = true;
      this.isApproved = false;
      $('#amount').prop('disabled', false);
    } else if (id == 58) {
      this.isQuery = true;
      this.isApproved = true;
      this.isInvestigate = true;
      this.isRevert = true;
      this.isReject = false;
      $('#amount').val(0);
      $('#amount').prop('disabled', true);
    } else {
      this.isApproved = false;
      this.isQuery = false;
      this.isReject = false;
      this.isInvestigate = false;
      this.isRevert = false;
      $('#amount').prop('disabled', false);
    }
  }

  OnChangeRemark(item) {
    this.remk = item.remarks;
  }

  submitDetails(event: any) {
    if (event === 1) {
      this.item = 'Approve';
    }
    if (event === 2) {
      this.item = 'Reject';
    }
    if (event === 3) {
      this.item = 'Query';
    }
    if (event === 4) {
      this.item = 'Query';
    }

    this.selected = [];
    var list = this.preauthList;
    var l = list.filter((opt: any) => opt.statusFlag).map((opt: any) => opt);
    for (var j = 0; j < l.length; j++) {
      if (this.item === 'Query') {
        if (l[j].querycount === 2) {
          this.swal('', 'Query limit exceed', 'error');
          return;
        }
      }
      this.selected.push(l[j]);
      if (this.item === 'Approve') {
        if (parseInt(l[j].approvedamount) > parseInt(l[j].amount)) {
          this.swal('', 'Approved amount should not be greater than amount', 'error');
          return;
        }
      }
    }

    if (this.item === 'Approve') {
      let approvedamount = this.group.value.approvedamount;
      if (this.remk != 'REJECTED') {
        if (approvedamount == null || approvedamount == 0 || approvedamount == "" || approvedamount == undefined) {
          $("#approvedamount").focus();
          this.swal('', 'Approved amount should not be left blank', 'error');
          return;
        }
      }
      if (this.remk == 'REJECTED') {
        this.group.value.approvedamount == 0;
      }
    }

    this.group.value.snaremarks = this.remk
    if (this.item === 'Reject' || this.item === 'Query') {
      let snaremarks = this.group.value.snaremarks;
      if (snaremarks == null || snaremarks == "" || snaremarks == undefined) {
        $("#snaremarks").focus();
        this.swal('', 'Remark should not be left blank', 'error');
        return;
      }
    }

    Swal.fire({
      title: 'Are You Sure To ' + this.item + '  ?',
      text: "",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes ' + this.item + ' It !!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.group.value.group = this.selected;
        this.group.value.userId = this.user.userId
        this.group.value.action = event
        if (this.group.value.snaremarks == 'OTHERS-PLEASE SPECIFY') {
          this.group.value.snaremarks = this.group.value.remark;
          this.selected[0].snaremarks = this.group.value.snaremarks;
        }
        this.preauthService.updatePreAuthorizationList(this.group.value).subscribe((data: any) => {
          if (data.status == "Success") {
            this.swal("Success", data.message, "success");
            this.getPreAuthorizationList();
            this.reset();
          } else if (data.status == "Failed") {
            this.swal("Error", data.message, "error");
          }
        })
      }
    })
  }

  download(pdfName, hCode, dateOfAdm) {
    let img = this.preauthService.downloadFileBySNA(pdfName, hCode, dateOfAdm);
    window.open(img, '_blank');
  }

  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  }

  numericOnly(event) {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }

  reset() {
    window.location.reload();
  }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
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


