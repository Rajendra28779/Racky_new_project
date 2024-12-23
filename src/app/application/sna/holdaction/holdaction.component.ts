import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service';
import { CreatecpdserviceService } from '../../Services/createcpdservice.service';
import { SnoCLaimDetailsService } from '../../Services/sno-claim-details.service';
import { TreatmenthistoryperurnService } from '../../Services/treatmenthistoryperurn.service';
import { HeaderService } from '../../header.service';
import { FormGroup, FormControl } from '@angular/forms';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { DatePipe } from '@angular/common';
import { DynamicreportService } from '../../Services/dynamicreport.service';
import { ICDSharedServices } from 'src/app/services/ICDSharedServices';
import { AuthIrisFingerService } from 'src/app/services/auth-iris-finger.service';

@Component({
  selector: 'app-holdaction',
  templateUrl: './holdaction.component.html',
  styleUrls: ['./holdaction.component.scss']
})
export class HoldactionComponent implements OnInit {

  childmessage: any;
  textRemak: any;
  claimDetails: any;
  allremarks: any;
  txnId: any;
  // fileUrl: any;
  claimLog: Array<any> = [];
  pendingAt: any;
  claimStatus: any;
  user: any;
  // routeFlag: any;
  urnNo: any;
  preAuth: any;
  packageCode: any;
  maxChars = 500;
  check: boolean = false;
  isQuery: boolean = false;
  isReject: boolean = false;
  isInvestigate: boolean = false;
  // isRevert: boolean = false;
  isApproved: boolean = false;
  showsnamor: boolean = false;
  // isHold: boolean = false;
  data: any;
  // Redirection: any;
  keyword = 'remarks';
  treat: string;
  // treatment: string;
  // reconsider: string;
  trtData: any = [];
  oldTrtData: any = [];
  // wardimplmenthighenddrugs: any = [];
  highEndDrugList: any = [];
  implantDataList: any = [];
  wardDataList: any = [];
  cpdActionLog: any = [];

  highEndDrugTotalPrice: any;
  implantTotalPrice: any;
  implantTotalUnitPrice: any;
  implantTotalUnit: any;
  collapse: string = 'Collapse All';
  vitalArray: any = [];
  posdetails: any = [];
  otpdetaiils: any = [];
  irisdetails: any = [];
  facedetails: any = [];
  fingerprintdetails: any = [];
  // isApprove: boolean = true;
  // isDisch: boolean = false;
  preAuthHistory: any = [];
  // firstList: any = [];
  // selectedRemarks: any = [];
  // selected: any = [];
  // final: any = [];
  // description: string = '';

  // isApprove: boolean = true;

  ictDetailsArray: any = [];
  ictSubDetailsArray: any = [];
  cardBalanceDetails: any = [];
  documents: any = [];
  constructor(
    private jwtService: JwtService,
    public headerService: HeaderService,
    public route: Router,
    public snoService: SnoCLaimDetailsService,
    private cpdService: CreatecpdserviceService,
    private treatmenthistoryperurn: TreatmenthistoryperurnService,
    private sessionService: SessionStorageService,
    private service: DynamicreportService,
    private msgService: ICDSharedServices,
    private irisService: AuthIrisFingerService
  ) { }

  // active inactive class
  isActiveDischarge: string = "";
  isActiveBlocking: string = "active";

  toggleActive(elementName: string): void {
    if (elementName == "Blocking") {
      this.isActiveDischarge = "";
      this.isActiveBlocking = "active"
    }

    if (elementName == "Discharge") {
      this.isActiveDischarge = "active";
      this.isActiveBlocking = ""
    }
  }
  // active inactive class

  ngOnInit(): void {
    this.data = JSON.parse(localStorage.getItem('actionData'));
    this.treat = localStorage.getItem('treat');
    // this.treatment = localStorage.getItem('treatment');
    // this.reconsider = localStorage.getItem('consider');
    // let consider = localStorage.getItem('reconsider');
    // let hold = localStorage.getItem('hold');
    this.txnId = this.data.transactionId;
    // this.routeFlag = this.data.flag;
    this.urnNo = this.data.URN;
    this.packageCode = this.data.packageCode;
    // this.Redirection = this.data.Redirection;
    // dynamic title
    // if (this.routeFlag == 'APRV') {
    //   this.headerService.setTitle('CPD Approved');
    // } else if (this.routeFlag == 'REAPRV') {
    //   this.headerService.setTitle('SNA Re-Settlement');
    // } else if (this.routeFlag == 'RECON') {
    //   this.headerService.setTitle('Claim Processed');
    // } else if (this.routeFlag == 'HOLD') {
    this.headerService.setTitle('Claims On Hold');
    // }
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
    this.getRemarks();
    this.getSnoClaimDetailsById();
    this.user = this.sessionService.decryptSessionData("user");
    $('#appealDisposal').hide();
    // if (consider == 'Y') {
    //   $('#Revert').hide();
    // }

    if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
      document.getElementsByTagName("section")[0].className += " safari";
    }
    this.irisService.subsVar = this.irisService.
      invokeFirstComponentFunction.subscribe((data) => {
        this.actionFlag = data.flag;
        this.submitClaimAction();
    });
  }

  approvedAmount(event: KeyboardEvent) {
    const pattern = /^[0-9.\b]+$/;
    //var regex = new RegExp("^[A-Za-z0-9.,-\\s]+$");
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }

  multiPackList: any = [];
  multiFlag: boolean = false;
  backUpAmount: any;
  multiFlagcase: boolean = false;
  multiPackListcaseno: any = [];
  getSnoClaimDetailsById() {
    this.snoService.getMultiPackage(this.txnId).subscribe(
      (data: any) => {
        let resData = data;
        if (resData.status == 'success') {
          let details = JSON.parse(resData.details);
          this.claimDetails = details.actionData;
          let procedureName = this.claimDetails.procedureName1;
          if (procedureName.length > 30) {
            $('#procedureNameId').text(procedureName.substring(0, 30) + '...');
            $('#showMoreId').empty();
            $('#showMoreId').append('<span style="cursor: pointer; color: #1d89c9">Show More</span>');
          } else {
            $('#procedureNameId').text(procedureName);
          }
          this.claimLog = details.actionLog;
          this.cpdActionLog = details.cpdActionLog;
          this.vitalArray = details.vitalArray;
          let multiPkg = details.packageBlock;
          let multipackcasen = details.multipackagecaseno;
          this.cardBalanceDetails = details.cardBalanceArray;
          this.triggerList = details.meTrigger;
          this.ictDetailsArray = details.ictDetailsArray;
          this.ictSubDetailsArray = details.ictSubDetailsArray;
          let icdResponse = {
            ictDetailsArray: this.ictDetailsArray,
            ictSubDetailsArray: this.ictSubDetailsArray
          }
          this.msgService.setMessage(icdResponse);
          if (
            details.actionData.pendingat == 3 &&
            details.actionData.claimstatus == 1
          ) {
            this.isApproved = true;
          }
          else {
            this.isApproved = false;
          }

          if (
            details.actionData.pendingat == 3 &&
            details.actionData.claimstatus == 1
          ) {
            this.isApproved = true;
          } else {
            this.isApproved = false;
          }

          multiPkg.forEach((item) => {
            if (item.transctionId != this.txnId) {
              this.multiPackList.push(item);
            }
          });
          if (this.multiPackList.length > 0) {
            this.multiFlag = true;
          }
          //chnages multipackages data for case number
          multipackcasen.forEach((item) => {
            // if (item.transctionId != this.txnId) {
            this.multiPackListcaseno.push(item);
            // }
          });
          if (this.multiPackListcaseno.length > 0) {
            this.multiFlagcase = true;
          }
          this.preAuth = details.preAuthHist;
          if (this.preAuth.length != 0) {
            this.check = true;
          }
          this.preAuthHistory = details.preAuthLog;
          // this.claimLog.shift();
          // this.cpdService.getPreAuthHistory(this.urnNo, this.claimDetails.AUTHORIZEDCODE, this.claimDetails.HOSPITALCODE).subscribe((authData: any) => {
          //   this.preAuth = authData;
          //   if (this.preAuth.length != 0) {
          //     this.check = true;
          //   }
          // })
          // localStorage.removeItem('reconsider');
          this.getPackageDetailsInfoList();
          this.getmultipledocumentthroughcaseno();
          this.getTreatMentHistory();
          this.getOldTreatMentHistory();
          this.getTreatmentHistoryoverpackgae();
          this.getOnGoingTreatmenthistory();
          this.getCPDTrigger();
          this.getwardnextentiondetails();
          this.patienttreatmentlog();
          this.getPatientTreatmentLogThroughProcedureCode();
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
  getTreatMentHistory() {
    this.treatmenthistoryperurn.searchbyUrnSnaUser(this.urnNo, this.user.userId).subscribe(data => {
      this.trtData = data;
      if (this.trtData.length > 3) {
        document.getElementById('treatmentTable').classList.add('treatment-history-table-class', 'treatment-history-table-head-class');
      }
    },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      });
  }
  getOldTreatMentHistory() {
    let urno = this.urnNo;
    this.treatmenthistoryperurn.oldsearchbyUrnSnaUser(urno, this.user.userId).subscribe(data => {
      this.oldTrtData = data
      if (this.oldTrtData.length > 3) {
        document.getElementById('oldTreatmentTable').classList.add('treatment-history-table-class', 'treatment-history-table-head-class');
      }
    },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      });
  }
  getRemarks() {
    this.snoService.getRemarks().subscribe(
      (data1: any) => {
        let remarkData = data1;
        this.allremarks = remarkData;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  downloadAction(event: any, fileName: any, hCode: any, dateOfAdm: any) {
    let target = event.target;
    if (
      target.nodeName == 'A' ||
      target.nodeName == 'a' ||
      target.nodeName == 'IMG' ||
      target.nodeName == 'img' ||
      target.nodeName == 'I' ||
      target.nodeName == 'i' ||
      target.nodeName == 'SPAN' ||
      target.nodeName == 'span'
    ) {
      target = $(target);
      let anchor = target.parent();
      anchor = anchor.get(0);
      if (fileName != null) {
        // let img = this.snoService.downloadFile(fileName, hCode, dateOfAdm);
        // window.open(img, '_blank');
        this.snoService.downloadFiles(fileName, hCode, dateOfAdm).subscribe(
          (response: any) => {
            var result = response;
            let blob = new Blob([result], { type: result.type });
            let url = window.URL.createObjectURL(blob);
            window.open(url);
          },
          (error) => {
            console.log(error);
          }
        );
      }
    }
  }
  remarks: any;
  myGroup = new FormGroup({
    remarks: new FormControl(),
  });
  // getId(){
  //   let remarkId = $('#actionRemark').val();
  //   if(remarkId == 1){
  //     $("#Query").addClass("disable-click");
  //     // $("#Query").off('click');
  //     $("#Reject").off('click');
  //     $("#Investigate").off('click');
  //   }
  // }
  amount: any;
  claimAmout: any;
  actionRemarkId: any;
  resuestedData:any;
  submitDetails(event: any, claimId: any) {
    this.remarks = $('#remarks').val();
    // this.actionRemarkId = $('#actionRemark').val();
    this.amount = $('#amount').val();
    let userId = this.user.userId;
    this.claimAmout = Number(this.claimDetails.TOTALAMOUNTBLOCKED);
    let urnNo = this.claimDetails.URN;
    let presurgeryphoto = this.claimDetails.PRESURGERYPHOTO;
    let postsurgeryphoto = this.claimDetails.POSTSURGERYPHOTO;
    let additionaldocs = this.claimDetails.ADITIONALDOCS;
    let dischargeslip = this.claimDetails.DISCHARGESLIP;
    let investigationdocs = this.claimDetails.INVESTIGATIONDOC;
    let additionaldocs1 = this.claimDetails.ADITIONAL_DOC1;
    let additionaldocs2 = this.claimDetails.ADITIONAL_DOC2;
    let statusflag = this.claimDetails.Statusflag;
    let intrasurgery = this.claimDetails.INTRA_SURGERY_PHOTO;
    let patientpic = this.claimDetails.PATIENT_PHOTO;
    let specimenpic = this.claimDetails.SPECIMEN_REMOVAL_PHOTO;
    if (event.target.id == 'Approve') {
      this.pendingAt = 3;
      this.claimStatus = 1;
      if (Number(this.amount) == 0) {
        this.swal('Info', 'Approved amount cannot be zero', 'info');
        return;
      }
    }
    if (event.target.id == 'Query') {
      this.pendingAt = 0;
      this.claimStatus = 4;
      this.amount = "";//Changes on 29/12/2023 By Rajendra with santanu sir and gyana sir and ashok sir porpose:- issue fixing in postpayment updation
    }
    if (event.target.id == 'Reject') {
      this.pendingAt = 3;
      this.claimStatus = 2;
      this.amount = '0';
    }
    if (event.target.id == 'Investigate') {
      this.pendingAt = 4;
      this.claimStatus = 6;
      this.amount = '0';
    }
    if (event.target.id == 'Revert') {
      this.pendingAt = 1;
      this.claimStatus = 8;
      this.amount = '0';
    }
    if (event.target.id == 'Revert') {
    } else if (this.actionRemarkId == 0 || this.actionRemarkId == null || this.actionRemarkId == '' || this.actionRemarkId == undefined) {
      this.swal('', ' Please Select Remark', 'error');
      return;
    }
    let snamortality = $('#snamortalityId').val();
    if (event.target.id == 'Approve' || event.target.id == 'Reject') {
      if (snamortality == "" || snamortality == null || snamortality == undefined) {
        this.swal('', ' Please Select SNA Mortality', 'error');
        return;
      }
    }
    if (
      this.actionRemarkId == 57 ||
      event.target.id == 'Revert' ||
      event.target.id == 'Reject'
    ) {
      if (this.remarks == '' || this.remarks == null) {
        this.swal('', 'Description should not be left blank', 'error');
        return;
      }
    }
    if (this.remarks != '' && this.remarks != null) {
      const pattern = /'/;
      // let pattern = /^[A-Za-z0-9.,#%<>()-_ \\s]+$/;
      // if (!pattern.test(this.remarks)) {
      if (pattern.test(this.remarks)) {
        this.swal('', ' Special character is not allowed', 'error');
        return;
      }
    }
    if (event.target.id != 'Query') {
      if (this.amount == '' || this.amount == null) {
        this.swal('', 'Amount should not be left blank', 'error');
        // $('#amount').val(this.backUpAmount);
        return;
      }
      var gfg = $.isNumeric(this.amount);
      if (!gfg) {
        this.swal('', 'Amount should be Numeric', 'error');
        // $('#amount').val(this.backUpAmount);
        return;
      }
    }
    if (this.actionRemarkId == 1) {
      if (this.amount == 0) {
        this.swal('', 'Amount should not be zero', 'error');
        // $('#amount').val(this.backUpAmount);
        return;
      }
    }

    if (this.amount > this.claimAmout) {
      this.swal(
        '',
        ' Approved Amount should be less than claim amount',
        'error'
      );
      // $('#amount').val(this.backUpAmount);
      return;
    }
    // if (localStorage.getItem("click") != 'Y') {
    //   this.swal('', ' Please check Treatment History', 'warning');
    //   return;
    // }
    // if (localStorage.getItem("click1") != 'Y') {
    //   this.swal('', ' Please check Treatment Package History', 'warning');
    //   return;
    // }
    if (presurgeryphoto == undefined) {
      presurgeryphoto = null;
    }
    if (postsurgeryphoto == undefined) {
      postsurgeryphoto = null;
    }
    if (additionaldocs == undefined) {
      additionaldocs = null;
    }
    if (dischargeslip == undefined) {
      dischargeslip = null;
    }
    if (investigationdocs == undefined) {
      investigationdocs = null;
    }
    if (additionaldocs1 == undefined) {
      additionaldocs1 = null;
    }
    if (additionaldocs2 == undefined) {
      additionaldocs2 = null;
    }
    if (intrasurgery == undefined) {
      intrasurgery = null;
    }
    if (patientpic == undefined) {
      patientpic = null;
    }
    if (specimenpic == undefined) {
      specimenpic = null;
    }
    this.resuestedData = {
      claimId: claimId,
      userId: userId,
      amount: this.amount,
      claimAmount: this.claimAmout,
      remarks: this.remarks,
      actionRemarksId: this.actionRemarkId,
      urnNo: urnNo,
      pendingAt: this.pendingAt,
      claimStatus: this.claimStatus,
      presurgeryphoto: presurgeryphoto,
      postsurgeryphoto: postsurgeryphoto,
      additionaldocs: additionaldocs,
      dischargeslip: dischargeslip,
      investigationdocs: investigationdocs,
      additionaldoc1: additionaldocs1,
      additionaldoc2: additionaldocs2,
      statusflag: statusflag,
      intrasurgery: intrasurgery,
      patientpic: patientpic,
      specimenpic: specimenpic,
      icdFlag: 0,
      icdFinalData: [],
      snamortality: snamortality,
    };
    let sharedData = {
      claimId: claimId,
      actionType: this.claimStatus,
      claimNo:this.claimDetails?.CLAIMNO,
      flag: event.target.id
    }
    if (this.claimDetails.TOTALAMOUNTCLAIMED === this.amount && event.target.id === 'Approve') {
      Swal.fire({
        title: '',
        html: `You are Approving Full Claim Amount of <span style="color: red; font-weight: bold;">₹${this.claimDetails.TOTALAMOUNTCLAIMED}</span>! Are you sure to Approve the Full Amount or Want to Re-Verify the Document?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes,Approve it',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: '',
            text: 'Are you sure To ' + event.target.id + '?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, ' + event.target.id + ' It',
          }).then((result) => {
            if (result.isConfirmed) {
              if(this.isActionAuthAllow()){
                this.irisService.setMessage(sharedData);
              }else{
                this.submitClaimAction();
              }
            }
          });
        } else {

        }
      });
    } else {
      Swal.fire({
        title: '',
        text: 'Are you sure To ' + event.target.id + '?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, ' + event.target.id + ' It',
      }).then((result) => {
        if (result.isConfirmed) {
          if(this.isActionAuthAllow()){
            this.irisService.setMessage(sharedData);
          }else{
            this.submitClaimAction();
          }
        }
      });
    }
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  // treatmentdetails() {
  //   // localStorage.setItem("click", "Y");
  //   // localStorage.setItem('urn', this.urnNo);
  //   // localStorage.setItem('token', this.jwtService.getJwtToken());
  //   // this.route.navigate([]).then((result) => {
  //   //   window.open(environment.routingUrl + '/treatmenthistory');
  //   // });
  //   localStorage.setItem('urn', this.urnNo);
  //   localStorage.setItem('transactionDetailsId', this.txnId);
  //   localStorage.setItem('userId', this.user.userId);
  //   localStorage.setItem('token', this.jwtService.getJwtToken());
  //   this.route.navigate([]).then((result) => {
  //     window.open(environment.routingUrl + '/treatmenthistoryforsna');
  //   });
  // }
  // Oldtreatmentdetails() {
  //   localStorage.setItem('urn1', this.urnNo);
  //   localStorage.setItem('transactionDetailsId1', this.txnId);
  //   localStorage.setItem('userId1', this.user.userId);
  //   localStorage.setItem('token1', this.jwtService.getJwtToken());
  //   this.route.navigate([]).then((result) => {
  //     window.open(environment.routingUrl + '/Oldtreatmenthistoryforsna');
  //   });
  // }
  clearEvent() {
    this.actionRemarkId = '';
  }
  preAuthLogDetail(urn: any, authCode: any, hosCode: any) {
    // let authCodes = authCode.slice(2);
    localStorage.setItem('urn', urn);
    localStorage.setItem('authorizedCode', authCode);
    localStorage.setItem('hospitalCode', hosCode);
    localStorage.setItem('token', this.jwtService.getJwtToken());
    this.route.navigate([]).then((result) => {
      window.open(environment.routingUrl + '/preauthhistory');
    });
  }
  dtls: any;
  viewDescription(descriptinDtls) {
    this.dtls = descriptinDtls;
    $('#appealDisposal').show();
  }
  // packagedetails() {
  //   // localStorage.setItem("click1", "Y");
  //   let urnNo = this.urnNo;
  //   let packagecode = this.packageCode;
  //   localStorage.setItem('urn', urnNo);
  //   localStorage.setItem('packagecode', packagecode);
  //   localStorage.setItem('token', this.jwtService.getJwtToken());
  //   this.route.navigate([]).then((result) => {
  //     window.open(environment.routingUrl + '/treatmenthistorypackage');
  //   });
  // }
  modalClose() {
    $('#appealDisposal').hide();
  }
  multiPackageDetails(
    URN: any,
    authorizedcode: any,
    hospitalCodeOne: any,
    transactionDtlsID: any
  ) {
    //alert(URN+" "+authorizedcode+" "+hospitalCodeOne+" "+transactionDtlsID)
    localStorage.setItem('urn', URN);
    localStorage.setItem('authorizedCode', authorizedcode);
    localStorage.setItem('hospitalCode', hospitalCodeOne);
    localStorage.setItem('transactionID', transactionDtlsID);
    localStorage.setItem('token', this.jwtService.getJwtToken());
    this.route.navigate([]).then((result) => {
      window.open(environment.routingUrl + '/multipackageblock');
    });
  }
  getId(item) {
    let id = item.id;
    this.allremarks.forEach((remark: any) => {
      if (remark.id === id)
        if (this.textRemak) {
          this.textRemak = this.textRemak + ", " + remark.remarks;
        } else
          this.textRemak = remark.remarks;
    })
    this.actionRemarkId = id;
    if (id == 1) {
      this.isQuery = true;
      this.isReject = true;
      this.isInvestigate = true;
      // this.isHold = true;
      this.isApproved = false;
      $('#amount').prop('disabled', false);
    } else if (id == 57) {
      this.isQuery = false;
      this.isReject = true;
      this.isInvestigate = true;
      // this.isHold = true;
      this.isApproved = true;
    } else if (id == 58) {
      this.isQuery = true;
      this.isApproved = true;
      this.isInvestigate = true;
      // this.isHold = true;
      this.isReject = false;
      $('#amount').val(0);
      $('#amount').prop('disabled', true);
    } else {
      this.isQuery = false;
      this.isReject = false;
      this.isInvestigate = false;
      this.isApproved = false;
      // this.isHold = false;
      $('#amount').prop('disabled', false);
    }
  }

  keyPress(event: KeyboardEvent) {
    // const pattern = /^[A-Za-z0-9.,-_ \\s]+$/;
    // const pattern = /^[A-Za-z0-9.,#%<>()-_ \\s]+$/;
    const pattern = /'/;
    //var regex = new RegExp("^[A-Za-z0-9.,-\\s]+$");
    const inputChar = String.fromCharCode(event.charCode);
    // if (!pattern.test(inputChar)) {
    if (pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }
  // fileArray: any = [];
  // downloadAllFile(dischargeSlip, additionaldoc, additionaldoc1, additionaldoc2) {
  //   this.fileArray = [];
  //   if (dischargeSlip != null || dischargeSlip != undefined) {
  //     let jsonObj = {
  //       'f': dischargeSlip,
  //       'h': this.claimDetails.HOSPITALCODE,
  //       'd': this.claimDetails.ACTUALDATEOFADMISSION
  //     }
  //     this.fileArray.push(jsonObj);
  //   }
  //   if (additionaldoc != null || additionaldoc != undefined) {
  //     let jsonObj = {
  //       'f': additionaldoc,
  //       'h': this.claimDetails.HOSPITALCODE,
  //       'd': this.claimDetails.ACTUALDATEOFADMISSION
  //     }
  //     this.fileArray.push(jsonObj);
  //   }
  //   if (additionaldoc1 != null || additionaldoc1 != undefined) {
  //     let jsonObj = {
  //       'f': additionaldoc1,
  //       'h': this.claimDetails.HOSPITALCODE,
  //       'd': this.claimDetails.ACTUALDATEOFADMISSION
  //     }
  //     this.fileArray.push(jsonObj);
  //   }
  //   if (additionaldoc2 != null || additionaldoc2 != undefined) {
  //     let jsonObj = {
  //       'f': additionaldoc2,
  //       'h': this.claimDetails.HOSPITALCODE,
  //       'd': this.claimDetails.ACTUALDATEOFADMISSION
  //     }
  //     this.fileArray.push(jsonObj);
  //   }
  //   this.snoService.downloadAllFiles(this.fileArray).subscribe(
  //     (response: any) => {
  //       var result = response;
  //       let blob = new Blob([result], { type: result.type });
  //       let url = window.URL.createObjectURL(blob);
  //       window.open(url);
  //     },
  //     (error) => {
  //       console.log(error);
  //     }
  //   );
  // }


  files: any = [];
  viewAllDocument(dischargeSlip, additionDoc, additionalDoc1, additionalDoc2, preSurgery, postSurgery, patientPic, intraSurgery, specimenRemoval, mortalityauditreport) {
    this.files = [];
    if (dischargeSlip != null || dischargeSlip != undefined) {
      let jsonObj = {
        'f': dischargeSlip,
        'h': this.claimDetails.HOSPITALCODE,
        'd': this.claimDetails.DATEOFADMISSION
      }
      this.files.push(jsonObj);
    }
    if (additionDoc != null || additionDoc != undefined) {
      let jsonObj = {
        'f': additionDoc,
        'h': this.claimDetails.HOSPITALCODE,
        'd': this.claimDetails.DATEOFADMISSION
      }
      this.files.push(jsonObj);
    }
    if (additionalDoc1 != null || additionalDoc1 != undefined) {
      let jsonObj = {
        'f': additionalDoc1,
        'h': this.claimDetails.HOSPITALCODE,
        'd': this.claimDetails.DATEOFADMISSION
      }
      this.files.push(jsonObj);
    }
    if (additionalDoc2 != null || additionalDoc2 != undefined) {
      let jsonObj = {
        'f': additionalDoc2,
        'h': this.claimDetails.HOSPITALCODE,
        'd': this.claimDetails.DATEOFADMISSION
      }
      this.files.push(jsonObj);
    }

    if (preSurgery != null || preSurgery != undefined) {
      let jsonObj = {
        'f': preSurgery,
        'h': this.claimDetails.HOSPITALCODE,
        'd': this.claimDetails.DATEOFADMISSION
      }
      this.files.push(jsonObj);
    }

    if (postSurgery != null || postSurgery != undefined) {
      let jsonObj = {
        'f': postSurgery,
        'h': this.claimDetails.HOSPITALCODE,
        'd': this.claimDetails.DATEOFADMISSION
      }
      this.files.push(jsonObj);
    }

    if (patientPic != null || patientPic != undefined) {
      let jsonObj = {
        'f': patientPic,
        'h': this.claimDetails.HOSPITALCODE,
        'd': this.claimDetails.DATEOFADMISSION
      }
      this.files.push(jsonObj);

      if (intraSurgery != null || intraSurgery != undefined) {
        let jsonObj = {
          'f': intraSurgery,
          'h': this.claimDetails.HOSPITALCODE,
          'd': this.claimDetails.DATEOFADMISSION
        }
        this.files.push(jsonObj);
      }
    }

    if (specimenRemoval != null || specimenRemoval != undefined) {
      let jsonObj = {
        'f': specimenRemoval,
        'h': this.claimDetails.HOSPITALCODE,
        'd': this.claimDetails.DATEOFADMISSION
      }
      this.files.push(jsonObj);
    }
    if (mortalityauditreport != null || mortalityauditreport != undefined) {
      let jsonObj = {
        'f': mortalityauditreport,
        'h': this.claimDetails.HOSPITALCODE,
        'd': this.claimDetails.DATEOFADMISSION
      }
      this.files.push(jsonObj);
    }
    this.snoService.downloadAllDocuments(this.files).subscribe(data => {
      var result = data;
      let blob = new Blob([result], { type: result.type });
      let url = window.URL.createObjectURL(blob);
      window.open(url);
    });
  }
  getDetails(transactionId, claimId, claimRaiseStatus, urn, packagecode) {
    if (claimRaiseStatus == 1) {
      let trnsId = transactionId;
      let clmId = claimId;
      if (clmId != null || clmId != undefined) {
        let state = {
          Urn: urn
        }
        localStorage.setItem("claimid", clmId);
        localStorage.setItem("trackingdetails", JSON.stringify(state));
        localStorage.setItem("token", this.jwtService.getJwtToken());
        this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/trackingdetails'); });
      } else {
        localStorage.setItem("trnsId", trnsId);
        this.route.navigate(['/treatmentinfo']);
      }
    }
    if (claimRaiseStatus == 0) {
      let state = {
        txnid: transactionId,
        //  authcode:authorizedcode,
        //  hospitalcode:hospitalcode,
        urn: urn
      }
      localStorage.setItem("history", JSON.stringify(state));
      localStorage.setItem("token", this.jwtService.getJwtToken())
      this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/dischargelistHistoryHospital'); });
    }
  }
  onAction(id: any, urn: any, packageCode: any, claimStatus: any) {
    let tempActionData = localStorage.getItem('actionData');
    localStorage.removeItem("submitStatus");
    if (claimStatus == 1) {
      let state = {
        transactionId: id,
        flag: 'APRV',
        URN: urn,
        packageCode: packageCode,
      };
      // localStorage.setItem('treat', 'Y');
      localStorage.setItem('actionData', JSON.stringify(state));
      localStorage.setItem('treatmentAction', 'true');
      window.open(environment.routingUrl + '/application/snoapproval/action');
      window.onfocus = function () {
        localStorage.setItem('actionData', tempActionData);
        if (localStorage.getItem('submitStatus') == 'Y') {
          // localStorage.removeItem('submitStatus');
          window.location.reload();
        }
      }
    }
    if (claimStatus == 2) {
      let state = {
        transactionId: id,
        URN: urn,
        packageCode: packageCode
      }
      // localStorage.setItem('treat', 'Y');
      localStorage.setItem("actionData", JSON.stringify(state));
      localStorage.setItem('treatmentAction', 'true');
      window.open(environment.routingUrl + '/application/cpdrejectedaction/action');
      window.onfocus = function () {
        localStorage.setItem('actionData', tempActionData);
        if (localStorage.getItem('submitStatus') == 'Y') {
          // localStorage.removeItem('submitStatus');
          window.location.reload();
        }
      }
    }
    if (claimStatus == 3) {
      let state = {
        transactionId: id,
        URN: urn,
        packageCode: packageCode
      }
      localStorage.setItem("actionData", JSON.stringify(state));
      localStorage.setItem('treatmentAction', 'true');
      window.open(environment.routingUrl + '/application/NonComplianceQueryCPDToSNA/action');
      window.onfocus = function () {
        localStorage.setItem('actionData', tempActionData);
        if (localStorage.getItem('submitStatus') == 'Y') {
          window.location.reload();
        }
      }
    }
    if (claimStatus == 4) {
      let state = {
        transactionId: id,
        flag: 'REAPRV',
        URN: urn,
        packageCode: packageCode,
      };
      // localStorage.setItem('treat', 'Y');
      localStorage.setItem('actionData', JSON.stringify(state));
      localStorage.setItem('treatmentAction', 'true');
      window.open(environment.routingUrl + '/application/snoreapproval/action');
      window.onfocus = function () {
        localStorage.setItem('actionData', tempActionData);
        if (localStorage.getItem('submitStatus') == 'Y') {
          // localStorage.removeItem('submitStatus');
          window.location.reload();
        }
      }
    }
    if (claimStatus == 7) {
      let state = {
        transactionId: id,
        URN: urn,
        packageCode: packageCode,
      };
      localStorage.setItem('actionData', JSON.stringify(state));
      localStorage.setItem('treatmentAction', 'true');
      window.open(environment.routingUrl + '/application/unProcessedClaimList/action');
      window.onfocus = function () {
        localStorage.setItem('actionData', tempActionData);
        if (localStorage.getItem('submitStatus') == 'Y') {
          window.location.reload();
        }
      }
    }
    if (claimStatus == 9) {
      let state = {
        transactionId: id,
        flag: 'DC',
        URN: urn,
        packageCode: packageCode,
      };
      localStorage.setItem('actionData', JSON.stringify(state));
      localStorage.setItem('treatmentAction', 'true');
      window.open(environment.routingUrl + '/application/dcCompliance/action');
      window.onfocus = function () {
        localStorage.setItem('actionData', tempActionData);
        if (localStorage.getItem('submitStatus') == 'Y') {
          window.location.reload();
        }
      }
    }
  }
  getPackageDetailsInfoList() {
    let txnpackagedetailid = this.claimDetails.txnPackageDetailId;
    this.cpdService.getPackageDetailsInfoList(txnpackagedetailid).subscribe(data => {
      let result: any = data;
      if (result != null && result.statusCode == 200) {
        this.highEndDrugList = result.highEndDrugList;
        this.implantDataList = result.implantDataList;
        this.wardDataList = result.wardDataList;
        this.highEndDrugTotalPrice = result.highEndDrugTotalPrice;
        this.implantTotalPrice = result.implantTotalPrice;
        this.implantTotalUnit = result.implantTotalUnit;
        this.implantTotalUnitPrice = result.implantTotalUnitPrice;
      }
    })
  }

  collapseAll() {
    if (this.collapse == 'Collapse All') {
      this.collapse = 'Expand All';
      // $('#collapseThree').hide();
    } else if (this.collapse == 'Expand All') {
      this.collapse = 'Collapse All';
      // $('#collapseThree').show();
    }
  }

  showProcedureName() {
    $('#procedureNameId').text(this.claimDetails.procedureName1);
    $('#showMoreId').empty()
    $('#showMoreId1').append('<div style="cursor: pointer; color: #1d89c9">Show Less</div>');
  }

  hideProcedureName() {
    let procedureName = this.claimDetails.procedureName1;
    if (procedureName.length > 30) {
      $('#procedureNameId').text(procedureName.substring(0, 30) + '...');
      $('#showMoreId1').empty()
      $('#showMoreId').empty();
      $('#showMoreId').append('<span style="cursor: pointer; color: #1d89c9">Show More</span>');
    }
  }

  showPreDoc(id, text) {
    $('#preAuthDocId' + id).text(text);
    $('#showMoreId2' + id).empty()
    $('#showMoreId3' + id).append('<div style="cursor: pointer; color: #1d89c9">Show Less</div>');
  }

  hidePreDoc(id, text) {
    if (text.length > 30) {
      $('#preAuthDocId' + id).text(text.substring(0, 30) + '...');
      $('#showMoreId3' + id).empty()
      $('#showMoreId2' + id).empty();
      $('#showMoreId2' + id).append('<span style="cursor: pointer; color: #1d89c9">Show More</span>');
    }
  }

  showClaimDoc(id, text) {
    $('#claimProcessDocId' + id).text(text);
    $('#showMoreId4' + id).empty()
    $('#showMoreId5' + id).append('<div style="cursor: pointer; color: #1d89c9">Show Less</div>');
  }

  hideClaimDoc(id, text) {
    if (text.length > 30) {
      $('#claimProcessDocId' + id).text(text.substring(0, 30) + '...');
      $('#showMoreId5' + id).empty()
      $('#showMoreId4' + id).empty();
      $('#showMoreId4' + id).append('<span style="cursor: pointer; color: #1d89c9">Show More</span>');
    }
  }

  showPreDoc1(text) {
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

  showClaimDoc1(text) {
    $('#claimProcessDocId').text(text);
    $('#showMoreId8').empty()
    $('#showMoreId9').append('<div style="cursor: pointer; color: #1d89c9">Show Less</div>');
  }

  hideClaimDoc1(text) {
    if (text.length > 30) {
      $('#claimProcessDocId').text(text.substring(0, 30) + '...');
      $('#showMoreId9').empty()
      $('#showMoreId8').empty();
      $('#showMoreId8').append('<span style="cursor: pointer; color: #1d89c9">Show More</span>');
    }
  }

  // checkAmount() {
  //   let amountValue = $('#amount').val();
  //   let amount = Number(amountValue);
  //   let totalAmountClaimed = Number(this.claimDetails.TOTALAMOUNTCLAIMED);
  //   if (amount < totalAmountClaimed) {
  //     let lessAmount = totalAmountClaimed - amount;
  //     this.swal(
  //       '',
  //       'You are Entering ₹ ' + lessAmount + ' less amount than Hospital claim Amount.',
  //       'info'
  //     );
  //   }
  // }
  pkgDetailsData: any = [];
  overAllDetailsData: any = [];
  getPackageDetails(packageCode, subPackageCode, procedureCode) {
    this.snoService.getPackageDetails(packageCode, subPackageCode, procedureCode, this.claimDetails.HOSPITALCODE).subscribe(
      (data: any) => {
        let resData = data;
        if (resData.status == 'success') {
          let packgeInfo = resData.data;
          let overallInfo = resData.data1;
          this.pkgDetailsData = JSON.parse(packgeInfo);
          this.overAllDetailsData = JSON.parse(overallInfo);
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

  memberid: any
  urn: any
  hospitalcodedata: any
  getAuthenticationdetails(type: any) {
    // if (type == 1) {
    //   this.isDisch = true;
    // } else {
    //   this.isDisch = false;
    // }
    this.memberid = this.claimDetails.MEMBERID;
    this.urn = this.claimDetails.URN;
    this.hospitalcodedata = this.claimDetails.HOSPITALCODE;
    this.snoService.getauthentocationdetails(this.urn, this.memberid, type, this.hospitalcodedata, this.claimDetails.claimCaseNo).subscribe(
      (data: any) => {
        let resData = data;
        if (resData.status == 'success') {
          let details = resData.data;
          details = JSON.parse(details);
          this.posdetails = details.posdetails;
          this.otpdetaiils = details.otpdetaiils;
          this.irisdetails = details.irisdetails;
          this.facedetails = details.facedetails;
          this.fingerprintdetails = details.fingerprintdetails;
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
  hospitalcode: any
  overridedetails: any = []
  getOverridedetails(overridecode: any) {
    this.memberid = this.claimDetails.MEMBERID;
    this.urn = this.claimDetails.URN;
    this.hospitalcode = this.claimDetails.HOSPITALCODE;
    this.snoService.getOverridecodedetails(overridecode, this.memberid, this.urn, this.hospitalcode).subscribe(
      (data: any) => {
        let resData = data;
        if (resData.status == 'success') {
          let results = resData.data;
          results = JSON.parse(results);
          this.overridedetails = results.overridecodedetails;
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

  caseno: any
  claimno: any
  uidreferencenumber: any
  hscode: any
  totalnumberofpackage: any
  totalnumberofmember: any
  totalnumberofpackageforhospital: any
  totalnumberofmemberforhospital: any
  totalNoOfBloackedamount: any
  packageblockedforpatient: any
  sumofpackageblockedamount: any
  treatmentpackage: any = []
  getdata: any
  getTreatmentHistoryoverpackgae() {
    this.treatmentpackage = []
    this.hscode = this.claimDetails.HOSPITALCODE;
    this.caseno = this.claimDetails.claimCaseNo;
    this.uidreferencenumber = this.claimDetails.uidreferencenumber != undefined ? this.claimDetails.uidreferencenumber : '';
    this.snoService.getTreatmentHistoryoverpackgae(this.txnId, this.urnNo, this.hscode, this.caseno, this.uidreferencenumber, this.user.userId).subscribe(
      (data: any) => {
        this.treatmentpackage = data;
        this.totalnumberofpackage = this.treatmentpackage[0].totalnumberofpackage;
        this.totalnumberofmember = this.treatmentpackage[0].totalnumberofmember;
        this.totalnumberofpackageforhospital = this.treatmentpackage[0].totalnumberofpackageforhospital;
        this.totalnumberofmemberforhospital = this.treatmentpackage[0].totalnumberofmemberforhospital;
        this.totalNoOfBloackedamount = this.treatmentpackage[0].totalNoOfBloackedamount;
        this.packageblockedforpatient = this.treatmentpackage[0].packageblockedforpatient;
        this.sumofpackageblockedamount = this.treatmentpackage[0].sumofpackageblockedamount;
      }
    );
  }
  ongointreatmnet: any = [];
  getOnGoingTreatmenthistory() {
    this.ongointreatmnet = [];
    let urno = this.urnNo;
    this.treatmenthistoryperurn.getOnGoingTreatmenthistory(urno, this.user.userId).subscribe(data => {
      this.ongointreatmnet = data
    },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      });
  }
  triggerdetails = [];
  triggerdetails1 = [];
  getCPDTrigger() {
    this.triggerdetails = [];
    this.triggerdetails1 = [];
    let hospitalcode = this.claimDetails?.HOSPITALCODE;
    let dateofAdmission = this.Dateconvert(this.claimDetails?.DATEOFADMISSION1);
    let dateofdischarge = this.Dateconvert(this.claimDetails?.DATEOFDISCHARGE1);
    let procedurecode = this.claimDetails?.procedureCode1;
    this.treatmenthistoryperurn.getCPDTriggerdetails(hospitalcode, dateofAdmission, dateofdischarge, procedurecode).subscribe((data: any) => {
      this.triggerdetails = data.cpdtrigerlist;
      this.triggerdetails1 = data.cpdtrigerlist1;
      console.log(this.triggerdetails);
    },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      });
  }

  getPackagepattern() {
    let hospitalcode = this.claimDetails?.HOSPITALCODE;
    let dateofAdmission = this.Dateconvert(this.claimDetails?.DATEOFADMISSION1);
    let dateofdischarge = this.Dateconvert(this.claimDetails?.DATEOFDISCHARGE1);
    let procedurecode = this.claimDetails?.procedureCode1;
    let packageName = this.claimDetails?.packageName1;
    this.sessionService.encryptSessionData('hospitalcode', hospitalcode);
    this.sessionService.encryptSessionData('dateofAdmission', dateofAdmission);
    this.sessionService.encryptSessionData('dateofdischarge', dateofdischarge);
    this.sessionService.encryptSessionData('procedurecode', procedurecode);
    this.sessionService.encryptSessionData('procedurecode', procedurecode);
    this.sessionService.encryptSessionData('packageName', packageName);
    this.route.navigate([]).then((result) => {
      window.open(environment.routingUrl + '/packagepattern');
    });
  }

  Dateconvert(date) {
    var datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'dd-MMM-yyyy');
  }

  patienttreatmnetlog: any = [];
  patienttreatmentlog() {
    this.patienttreatmnetlog = [];
    let urno = this.urnNo;
    this.treatmenthistoryperurn.patienttreatmnetlog(urno, this.user.userId, this.txnId).subscribe(data => {
      this.patienttreatmnetlog = data
    },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      });
  }

  showPackagenamePatientlog(text, index) {
    $('#packagenamepatientlog' + index).text(text);
    $('#showMorepacke13' + index).empty()
    $('#showMorepacke14' + index).append('<div style="cursor: pointer; color: #1d89c9">Show Less</div>');
  }

  hidePackagenamePatientlog(text, index) {
    if (text.length > 15) {
      $('#packagenamepatientlog' + index).text(text.substring(0, 15) + '...');
      $('#showMorepacke14' + index).empty()
      $('#showMorepacke13' + index).empty();
      $('#showMorepacke13' + index).append('<span style="cursor: pointer; color: #1d89c9">Show More</span>');
    }
  }

  logdetails: any = [];
  getPatientTreatmentLogThroughProcedureCode() {
    this.logdetails = [];
    let procedureCode = this.claimDetails?.procedureCode1;
    let uidreferencenumber = this.claimDetails?.uidreferencenumber;
    this.treatmenthistoryperurn.getPatientTreatmentLogThroughProcedureCode(procedureCode, uidreferencenumber).subscribe((data: any) => {
      this.logdetails = data.patientlist;
    },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      });
  }

  showPackagenamepatient(text, index) {
    $('#packagenamepatient' + index).text(text);
    $('#showMorepacke3' + index).empty()
    $('#showMorepacke4' + index).append('<div style="cursor: pointer; color: #1d89c9">Show Less</div>');
  }

  hidePackagenamepatient(text, index) {
    if (text.length > 15) {
      $('#packagenamepatient' + index).text(text.substring(0, 15) + '...');
      $('#showMorepacke4' + index).empty()
      $('#showMorepacke3' + index).empty();
      $('#showMorepacke3' + index).append('<span style="cursor: pointer; color: #1d89c9">Show More</span>');
    }
  }
  // Method to calculate total
  getTotal(property: string): number {
    return this.multiPackListcaseno.reduce((acc, item) => acc + (parseFloat(item[property]) || 0), 0);
  }
  // Method to format numbers as strings with commas
  formatNumber(value: number): string {
    return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  triggerList: any = [];
  getTriggerList() {
    this.service.getdynamicconfigurationlist().subscribe((data: any) => {
      this.triggerList = data;
    })
  }

  checkAmount() {
    let amountValue = $('#amount').val();
    let amount = Number(amountValue);
    let totalAmountClaimed = Number(this.claimDetails.TOTALAMOUNTCLAIMED);
    if (amount < totalAmountClaimed) {
      let lessAmount = totalAmountClaimed - amount;
      this.swal(
        '',
        'You are Entering ₹ ' + lessAmount + ' less amount than Hospital claim Amount.',
        'info'
      );
    }
  }

  extentiondetails = [];
  warddetails = [];
  getwardnextentiondetails() {
    this.extentiondetails = [];
    this.warddetails = [];
    let claimCaseNo = this.claimDetails?.claimCaseNo;
    this.treatmenthistoryperurn.getwardnextentiondetailsList(claimCaseNo).subscribe((data: any) => {
      this.extentiondetails = data.extenstionlist;
      this.warddetails = data.wardlist;
    },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      });
  }

  showextionshowlog(text, index) {
    $('#packagenamepatientlog' + index).text(text);
    $('#showMorepacke19' + index).empty()
    $('#showMorepacke20' + index).append('<div style="cursor: pointer; color: #1d89c9">Show Less</div>');
  }

  showextionhidelog(text, index) {
    if (text.length > 15) {
      $('#packagenamepatientlog' + index).text(text.substring(0, 15) + '...');
      $('#showMorepacke20' + index).empty()
      $('#showMorepacke19' + index).empty();
      $('#showMorepacke19' + index).append('<span style="cursor: pointer; color: #1d89c9">Show More</span>');
    }
  }
  files2: any = [];
  documnetname: any = [];
  downloadalldocumnet() {
    this.documnetname = [];
    this.files2 = [];
    for (let document of this.documents) {
      this.documnetname.push(document.filename);
      if (document.filename) { // Check if file exists for the document
        let jsonObj = {
          'f': document.filename, // File name
          'h': document.hospitalcode, // Hospital code
          'd': document.dateofadmission // Date of admission
        };
        this.files2.push(jsonObj);
      }
    }
    this.cpdService.downloadAllDocuments(this.files2).subscribe(data => {
      var result = data;
      let blob = new Blob([result], { type: result.type });
      let url = window.URL.createObjectURL(blob);
      window.open(url);
    });
  }
  getmultipledocumentthroughcaseno() {
    let caseno = this.claimDetails?.claimCaseNo;
    let loginid = this.user.userId;
    this.treatmenthistoryperurn.getmultipledocumentList(caseno, loginid).subscribe((data: any) => {
      this.documents = data.mdocdata;
    },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      });
  }

  getdocumentdownload(event: any, filename: any, dateofadmission: any, hospitalcode: any) {
    this.documnetname = [];
    this.documnetname.push(filename);
    let target = event.target;
    if (
      target.nodeName == 'A' ||
      target.nodeName == 'a' ||
      target.nodeName == 'IMG' ||
      target.nodeName == 'img' ||
      target.nodeName == 'I' ||
      target.nodeName == 'i'
    ) {
      target = $(target);
      let anchor = target.parent();
      anchor = anchor.get(0);
      if (filename != null) {
        this.snoService.downloadFiles(filename, hospitalcode, dateofadmission).subscribe(
          (response: any) => {
            var result = response;
            let blob = new Blob([result], { type: result.type });
            let url = window.URL.createObjectURL(blob);
            window.open(url);
          },
          (error) => {
            console.log(error);
          }
        );
      }
    }
  }
  isActionAuthAllow(){
    let isAction = this.user.isActionAuth;
    if(isAction == 0){
      return true;
    }else{
      return false;
    }
  }
  actionFlag:any;
  submitClaimAction(){
    this.snoService.saveSnoDetails(this.resuestedData).subscribe(
      (data: any) => {
        if (data.status == 'Success') {
          localStorage.setItem('submitStatus', 'Y')
          if (this.actionFlag == 'Approve') {
            this.swal('Success', data.message, 'success');
          } else if (this.actionFlag == 'Query') {
            this.swal('Success', data.message, 'info');
          } else if (this.actionFlag == 'Reject') {
            this.swal('Success', data.message, 'success');
          } else if (this.actionFlag == 'Investigate') {
            this.swal('Success', data.message, 'success');
          } else if (this.actionFlag == 'Revert') {
            this.swal('Success', data.message, 'success');
          }
          if (localStorage.getItem("treatmentAction") == 'true') {
            setTimeout(() => {
              window.close();
            }, 2000);
            localStorage.removeItem("treatmentAction");
          }
          if (this.treat == 'Y') {
            this.route.navigate(['/treatmenthistoryforsna']);
            localStorage.removeItem('treat');
          }
          else {
            this.route.navigate(['/application/claimsOnHold']);
          }
        } else if (data.status == 'Failed') {
          this.swal('Error', data.message, 'error');
        }
        localStorage.removeItem('actionData');
      },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      }
    );
  }
}



