import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service';
import { SnoCLaimDetailsService } from '../../Services/sno-claim-details.service';
import { CreatecpdserviceService } from '../../Services/createcpdservice.service';
import { TreatmenthistoryperurnService } from '../../Services/treatmenthistoryperurn.service';
import { ICDSharedServices } from 'src/app/services/ICDSharedServices';
import { HeaderService } from '../../header.service';
import { FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { UnprocessedclaimService } from '../../Services/unprocessedclaim.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { DatePipe } from '@angular/common';
import { AuthIrisFingerService } from 'src/app/services/auth-iris-finger.service';
declare let $: any;
@Component({
  selector: 'app-urnwise-details-action',
  templateUrl: './urnwise-details-action.component.html',
  styleUrls: ['./urnwise-details-action.component.scss']
})
export class UrnwiseDetailsActionComponent implements OnInit {
  childmessage: any;
  claimDetails: any;
  allremarks: any;
  txnId: any;
  claimLog: Array<any> = [];
  pendingAt: any;
  claimStatus: any;
  user: any;
  urnNo: any;
  preAuth: any = [];
  packageCode: any;
  maxChars = 1000;
  check: boolean = false;
  isQuery: boolean = false;
  isReject: boolean = false;
  isInvestigate: boolean = false;
  isRevert: boolean = false;
  isApproved: boolean = false;
  isHold: boolean = false;
  showsnamor: boolean = false;
  data: any;
  requestdata: any;
  keyword = 'remarks';
  treat: string;
  trtData: any = [];
  oldTrtData: any = [];
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
  isDisch: boolean = false;
  preAuthHistory: any = [];
  selectedRemarks: any = [];
  description: string = '';
  finalIcdObj: any;
  ictDetailsArray: any = [];
  ictSubDetailsArray: any = [];
  documents: any = [];
  constructor(
    private jwtService: JwtService,
    public headerService: HeaderService,
    public route: Router,
    public snoService: SnoCLaimDetailsService,
    private cpdService: CreatecpdserviceService,
    private treatmenthistoryperurn: TreatmenthistoryperurnService,
    private msgService: ICDSharedServices,
    private unservice: UnprocessedclaimService,
    private sessionService: SessionStorageService,
    private irisService: AuthIrisFingerService
  ) { }

  ngOnInit(): void {
    this.data = JSON.parse(localStorage.getItem('actionData'));
    this.requestdata = this.sessionService.decryptSessionData('requestData');
    this.treat = localStorage.getItem('treat');
    this.unservice.setIsValidData(1);
    this.txnId = this.data.transactionId;
    this.urnNo = this.data.URN;
    this.packageCode = this.data.packageCode;
    this.headerService.setTitle('URN Wise Action');
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
    this.getRemarks();
    this.getClaimProcessedDetails();
    this.user = this.sessionService.decryptSessionData("user");
    $('#appealDisposal').hide();
    $('#triggermodal').hide();

    this.msgService.subsVar =
      this.msgService.invokeFirstComponentFunction.subscribe((data) => {
        this.finalIcdObj = data.icdData;
      });
    this.irisService.subsVar = this.irisService.
      invokeFirstComponentFunction.subscribe((data) => {
        this.actionFlag = data.flag;
        this.submitClaimAction();
    });
    if (
      navigator.userAgent.search('Safari') >= 0 &&
      navigator.userAgent.search('Chrome') < 0
    ) {
      document.getElementsByTagName('section')[0].className += ' safari';
    }
    if (this.requestdata.cpdFlag == '1') {
      this.isRevert = true;
    }
  }
  approvedAmount(event: KeyboardEvent) {
    const pattern = /^[0-9.\b]+$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }
  multiPackList: any = [];
  multiPackListcaseno: any = [];
  multiFlag: boolean = false;
  multiFlagcase: boolean = false;
  backUpAmount: any;
  meTrigger: any = [];
  cardBalanceDetails: any = [];
  getClaimProcessedDetails() {
    this.snoService.urnWiseDetails(this.txnId).subscribe(
      (data: any) => {
        let resData = data;
        if (resData.status == 'success') {
          let details = JSON.parse(resData.details);
          console.log(details);
          this.claimDetails = details.actionData;
          let procedureName = this.claimDetails.procedureName1;
          this.getsnamortalitystatus(this.claimDetails.CLAIMID);
          if (procedureName.length > 30) {
            $('#procedureNameId').text(procedureName.substring(0, 30) + '...');
            $('#showMoreId').empty();
            $('#showMoreId').append(
              '<span style="cursor: pointer; color: #1d89c9">Show More</span>'
            );
          } else {
            $('#procedureNameId').text(procedureName);
          }
          console.log(this.claimDetails);
          this.claimLog = details.actionLog;
          this.cpdActionLog = details.cpdActionLog;
          this.vitalArray = details.vitalArray;
          let multiPkg = details.packageBlock;
          let multipackcasen = details.multipackagecaseno;
          this.triggerList = details.meTrigger;
          this.ictDetailsArray = details.ictDetailsArray;
          this.ictSubDetailsArray = details.ictSubDetailsArray;
          this.cardBalanceDetails = details.cardBalanceArray;
          let icdResponse = {
            ictDetailsArray: this.ictDetailsArray,
            ictSubDetailsArray: this.ictSubDetailsArray,
          };
          this.msgService.setMessage(icdResponse);

          if (
            details.actionData.pendingat == 3 &&
            details.actionData.claimstatus == 1
          ) {
            this.isApproved = true;
          } else {
            this.isApproved = false;
          }
          if (
            details.actionData.pendingat == 3 &&
            details.actionData.claimstatus == 2
          ) {
            this.isReject = true;
          } else {
            this.isReject = false;
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
          console.log(this.preAuth);
          if (this.preAuth.length != 0) {
            this.check = true;
          }
          let prteLog = details.preAuthLog;
          console.log(prteLog);
          if (prteLog.length > 0) {
            let prteAuth = prteLog[0];
            let prteAuth1: any = {};
            prteAuth1.actionType = 'Hospital Request';
            prteAuth1.actionOn = prteAuth?.REQUESTDATE;
            prteAuth1.remarks = '--';
            prteAuth1.description = prteAuth?.HOSPITALREQUESTDESCRIPTION;
            prteAuth1.amount = prteAuth?.REQUESTAMOUNT;
            prteAuth1.document = prteAuth?.DOC1;
            prteAuth1.sdate = prteAuth?.sdate;
            prteAuth1.hospitaluploaddate = prteAuth?.hospitaluploaddate;
            if (prteAuth?.REQUESTDATE != '--') {
              this.preAuthHistory.push(prteAuth1);
            }
            let prteAuth2: any = {};
            prteAuth2.actionType = 'SNA First Query';
            prteAuth2.actionOn = prteAuth?.QUERY1DATE;
            prteAuth2.remarks = prteAuth?.SNAQUERY1REMARK;
            prteAuth2.description = prteAuth?.SNAQUERY1DESCRIPTION;
            prteAuth2.amount = '--';
            prteAuth2.document = '--';
            prteAuth2.sdate = prteAuth?.sdate;
            prteAuth2.hospitaluploaddate = prteAuth?.hospitaluploaddate;
            if (prteAuth?.QUERY1DATE != '--') {
              this.preAuthHistory.push(prteAuth2);
            }
            let prteAuth3: any = {};
            prteAuth3.actionType = 'First Query Reply By Hospital';
            prteAuth3.actionOn = prteAuth?.QUERYREPLAYBYHOSDATE1;
            prteAuth3.remarks = '--';
            prteAuth3.description = prteAuth?.QUERYREPLAYBYHOS1;
            prteAuth3.amount = '--';
            prteAuth3.document = prteAuth?.DOC2;
            prteAuth3.sdate = prteAuth?.sdate;
            prteAuth3.hospitaluploaddate = prteAuth?.hospitaluploaddate;
            if (prteAuth?.QUERYREPLAYBYHOSDATE1 != '--') {
              this.preAuthHistory.push(prteAuth3);
            }
            let prteAuth4: any = {};
            prteAuth4.actionType = 'SNA Second Query';
            prteAuth4.actionOn = prteAuth?.QUERY2DATE;
            prteAuth4.remarks = prteAuth?.SNAQUERY2REMARK;
            prteAuth4.description = prteAuth?.MOREDOCSDESCRIPTION2;
            prteAuth4.amount = '--';
            prteAuth4.document = '--';
            prteAuth4.sdate = prteAuth?.sdate;
            prteAuth4.hospitaluploaddate = prteAuth?.hospitaluploaddate;
            if (prteAuth?.QUERY2DATE != '--') {
              this.preAuthHistory.push(prteAuth4);
            }
            let prteAuth5: any = {};
            prteAuth5.actionType = 'Second Query Reply By Hospital';
            prteAuth5.actionOn = prteAuth?.QUERYREPLAYBYHOSDATE2;
            prteAuth5.remarks = '--';
            prteAuth5.description = prteAuth?.QUERYREPLAYBYHOS2;
            prteAuth5.amount = '--';
            prteAuth5.document = prteAuth?.DOC3;
            prteAuth5.sdate = prteAuth?.sdate;
            prteAuth5.hospitaluploaddate = prteAuth?.hospitaluploaddate;
            if (prteAuth?.QUERYREPLAYBYHOSDATE2 != '--') {
              this.preAuthHistory.push(prteAuth5);
            }
            let prteAuth6: any = {};
            prteAuth6.actionType = 'SNA Final Action';
            prteAuth6.actionOn = prteAuth?.APPROVEDDATE;
            prteAuth6.remarks = prteAuth?.SNAREMARK;
            prteAuth6.description = prteAuth?.SNADESCRIPTION;
            prteAuth6.amount = prteAuth?.APPROVEDAMOUNT;
            prteAuth6.document = '--';
            prteAuth6.sdate = prteAuth?.sdate;
            prteAuth6.hospitaluploaddate = prteAuth?.hospitaluploaddate;
            if (prteAuth?.APPROVEDDATE != '--') {
              this.preAuthHistory.push(prteAuth6);
            }
          }
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
    this.treatmenthistoryperurn
      .searchbyUrnSnaUser(this.urnNo, this.user.userId)
      .subscribe(
        (data) => {
          this.trtData = data;
          console.log(this.trtData);
        },
        (error) => {
          console.log(error);
          this.swal('', 'Something went wrong.', 'error');
        }
      );
  }
  getOldTreatMentHistory() {
    let urno = this.urnNo;
    this.treatmenthistoryperurn
      .oldsearchbyUrnSnaUser(urno, this.user.userId)
      .subscribe(
        (data) => {
          this.oldTrtData = data;
        },
        (error) => {
          console.log(error);
          this.swal('', 'Something went wrong.', 'error');
        }
      );
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
  documnetname: any = [];
  downloadAction(event: any, fileName: any, hCode: any, dateOfAdm: any) {
    this.documnetname = [];
    this.documnetname.push(fileName);
    this.documentstatus = 0;
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
        this.snoService.downloadFiles(fileName, hCode, dateOfAdm).subscribe(
          (response: any) => {
            let result = response;
            let blob = new Blob([result], { type: result.type });
            let url = window.URL.createObjectURL(blob);
            window.open(url);
            this.documentLog();
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
  amount: any;
  claimAmout: any;
  actionRemarkId: any;
  requestedData:any;
  actionFlag:any
  submitDetails(event: any, claimId: any) {
    this.remarks = $('#remarks').val();
    this.amount = $('#amount').val();
    let userId = this.user.userId;
    this.claimAmout = Number(this.claimDetails.TOTALAMOUNTCLAIMED);
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
    }
    if (event.target.id == 'Query') {
      this.pendingAt = 0;
      this.claimStatus = 4;
      this.amount = ''; //Changes on 29/12/2023 By Rajendra with santanu sir and gyana sir and ashok sir porpose:- issue fixing in postpayment updation
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
    if (event.target.id == 'Hold') {
      this.pendingAt = 2;
      this.claimStatus = 13;
      this.amount = '0';
    }
    if (event.target.id == 'Revert') {
      this.pendingAt = 1;
      this.claimStatus = 8;
      this.amount = '0';
    }
    if (event.target.id == 'Revert') {
    } else if (
      this.actionRemarkId == 0 ||
      this.actionRemarkId == null ||
      this.actionRemarkId == '' ||
      this.actionRemarkId == undefined
    ) {
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
    if (event.target.id == 'Approve') {
      if (Number(this.amount) == 0) {
        this.swal('Info', 'Approved amount cannot be zero', 'info');
        return;
      }
    }
    if (this.remarks != '' && this.remarks != null) {
      const pattern = /'/;
      if (pattern.test(this.remarks)) {
        this.swal('', ' Special character is not allowed', 'error');
        return;
      }
    }
    if (event.target.id != 'Query') {
      if (this.amount == '' || this.amount == null) {
        this.swal('', 'Amount should not be left blank', 'error');
        return;
      }
      let gfg = $.isNumeric(this.amount);
      if (!gfg) {
        this.swal('', 'Amount should be Numeric', 'error');
        return;
      }
    }

    if (this.actionRemarkId == 1) {
      if (this.amount == 0) {
        this.swal('', 'Amount should not be zero', 'error');
        return;
      }
    }

    if (this.amount > this.claimAmout) {
      this.swal(
        '',
        ' Approved Amount should be less than claim amount',
        'error'
      );
      return;
    }
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
    this.requestedData = {
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
      icdFlag: this.finalIcdObj.flag,
      icdFinalData: this.finalIcdObj.icdFinalAry,
      snamortality: snamortality,
    };
    let sharedData = {
      claimId: claimId,
      actionType: this.claimStatus,
      claimNo: this.claimDetails?.CLAIMNO,
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

  clearEvent() {
    this.actionRemarkId = '';
  }
  preAuthLogDetail(urn: any, authCode: any, hosCode: any) {
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

  modalClose() {
    $('#appealDisposal').hide();
    $('#triggermodal').hide();
  }
  multiPackageDetails(
    URN: any,
    authorizedcode: any,
    hospitalCodeOne: any,
    transactionDtlsID: any
  ) {
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
    this.actionRemarkId = id;
    if (id == 1) {
      this.isQuery = true;
      this.isReject = true;
      this.isInvestigate = true;
      this.isRevert = true;
      this.isHold = true;
      this.isApproved = false;
      $('#amount').prop('disabled', false);
    } else if (id == 57) {
      this.isQuery = false;
      this.isReject = true;
      this.isInvestigate = true;
      this.isRevert = true;
      this.isHold = true;
      this.isApproved = true;
    } else if (id == 58) {
      this.isQuery = true;
      this.isApproved = true;
      this.isInvestigate = true;
      this.isRevert = true;
      this.isHold = true;
      this.isReject = false;
      $('#amount').val(0);
      $('#amount').prop('disabled', true);
    } else {
      this.isApproved = false;
      this.isQuery = false;
      this.isReject = false;
      this.isInvestigate = false;
      this.isRevert = false;
      this.isHold = false;
      $('#amount').prop('disabled', false);
    }

    if (!this.isReject || !this.isApproved) {
      this.showsnamor = true;
    } else {
      this.showsnamor = false;
    }

    if (this.description.length === 0) {
      this.description = this.toProperCase(item.remarks);
    } else {
      this.description =
        this.description + ', ' + this.toProperCase(item.remarks);
    }
  }

  toProperCase(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  }

  keyPress(event: KeyboardEvent) {
    const pattern = /'/;
    const inputChar = String.fromCharCode(event.charCode);
    if (pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  documentstatus: any;
  files: any = [];
  viewAllDocument(
    dischargeSlip,
    additionDoc,
    additionalDoc1,
    additionalDoc2,
    preSurgery,
    postSurgery,
    patientPic,
    intraSurgery,
    specimenRemoval,
    mortalityauditreport
  ) {
    this.files = [];
    this.documnetname = [];
    this.documentstatus = 1;

    if (dischargeSlip != null || dischargeSlip != undefined) {
      this.documnetname.push(dischargeSlip);
      let jsonObj = {
        f: dischargeSlip,
        h: this.claimDetails.HOSPITALCODE,
        d: this.claimDetails.DATEOFADMISSION,
      };
      this.files.push(jsonObj);
    }
    if (additionDoc != null || additionDoc != undefined) {
      this.documnetname.push(additionDoc);
      let jsonObj = {
        f: additionDoc,
        h: this.claimDetails.HOSPITALCODE,
        d: this.claimDetails.DATEOFADMISSION,
      };
      this.files.push(jsonObj);
    }
    if (additionalDoc1 != null || additionalDoc1 != undefined) {
      this.documnetname.push(additionalDoc1);
      let jsonObj = {
        f: additionalDoc1,
        h: this.claimDetails.HOSPITALCODE,
        d: this.claimDetails.DATEOFADMISSION,
      };
      this.files.push(jsonObj);
    }
    if (additionalDoc2 != null || additionalDoc2 != undefined) {
      this.documnetname.push(additionalDoc2);
      let jsonObj = {
        f: additionalDoc2,
        h: this.claimDetails.HOSPITALCODE,
        d: this.claimDetails.DATEOFADMISSION,
      };
      this.files.push(jsonObj);
    }

    if (preSurgery != null || preSurgery != undefined) {
      this.documnetname.push(preSurgery);
      let jsonObj = {
        f: preSurgery,
        h: this.claimDetails.HOSPITALCODE,
        d: this.claimDetails.DATEOFADMISSION,
      };
      this.files.push(jsonObj);
    }

    if (postSurgery != null || postSurgery != undefined) {
      this.documnetname.push(postSurgery);
      let jsonObj = {
        f: postSurgery,
        h: this.claimDetails.HOSPITALCODE,
        d: this.claimDetails.DATEOFADMISSION,
      };
      this.files.push(jsonObj);
    }

    if (patientPic != null || patientPic != undefined) {
      this.documnetname.push(patientPic);
      let jsonObj = {
        f: patientPic,
        h: this.claimDetails.HOSPITALCODE,
        d: this.claimDetails.DATEOFADMISSION,
      };
      this.files.push(jsonObj);

      if (intraSurgery != null || intraSurgery != undefined) {
        this.documnetname.push(intraSurgery);
        let jsonObj = {
          f: intraSurgery,
          h: this.claimDetails.HOSPITALCODE,
          d: this.claimDetails.DATEOFADMISSION,
        };
        this.files.push(jsonObj);
      }
    }
    if (specimenRemoval != null || specimenRemoval != undefined) {
      this.documnetname.push(specimenRemoval);
      let jsonObj = {
        f: specimenRemoval,
        h: this.claimDetails.HOSPITALCODE,
        d: this.claimDetails.DATEOFADMISSION,
      };
      this.files.push(jsonObj);
    }
    if (mortalityauditreport != null || mortalityauditreport != undefined) {
      this.documnetname.push(mortalityauditreport);
      let jsonObj = {
        f: mortalityauditreport,
        h: this.claimDetails.HOSPITALCODE,
        d: this.claimDetails.DATEOFADMISSION,
      };
      this.files.push(jsonObj);
    }
    this.snoService.downloadAllDocuments(this.files).subscribe((data) => {
      let result = data;
      let blob = new Blob([result], { type: result.type });
      let url = window.URL.createObjectURL(blob);
      window.open(url);
      this.documentLog();
    });
  }
  getDetails(transactionId, claimId, claimRaiseStatus, urn, packagecode) {
    if (claimRaiseStatus == 1) {
      let trnsId = transactionId;
      let clmId = claimId;
      if (clmId != null || clmId != undefined) {
        let state = {
          Urn: urn,
        };
        localStorage.setItem('claimid', clmId);
        localStorage.setItem('trackingdetails', JSON.stringify(state));
        localStorage.setItem('token', this.jwtService.getJwtToken());
        this.route.navigate([]).then((result) => {
          window.open(environment.routingUrl + '/trackingdetails');
        });
      } else {
        localStorage.setItem('trnsId', trnsId);
        this.route.navigate(['/treatmentinfo']);
      }
    }
    if (claimRaiseStatus == 0) {
      let state = {
        txnid: transactionId,
        urn: urn,
      };
      localStorage.setItem('history', JSON.stringify(state));
      localStorage.setItem('token', this.jwtService.getJwtToken());
      this.route.navigate([]).then((result) => {
        window.open(environment.routingUrl + '/dischargelistHistoryHospital');
      });
    }
  }
  onAction(
    id: any,
    urn: any,
    packageCode: any,
    claimStatus: any,
    txnpackagedetailid: any
  ) {
    let tempActionData = localStorage.getItem('actionData');
    localStorage.removeItem('submitStatus');
    if (claimStatus == 1) {
      let state = {
        transactionId: id,
        flag: 'APRV',
        URN: urn,
        packageCode: packageCode,
        txnpackagedetailid: txnpackagedetailid,
      };
      localStorage.setItem('actionData', JSON.stringify(state));
      localStorage.setItem('treatmentAction', 'true');
      window.open(environment.routingUrl + '/application/snoapproval/action');
      window.onfocus = function () {
        localStorage.setItem('actionData', tempActionData);
        if (localStorage.getItem('submitStatus') == 'Y') {
          window.location.reload();
        }
      };
    }
    if (claimStatus == 2) {
      let state = {
        transactionId: id,
        URN: urn,
        packageCode: packageCode,
        txnpackagedetailid: txnpackagedetailid,
      };
      localStorage.setItem('actionData', JSON.stringify(state));
      localStorage.setItem('treatmentAction', 'true');
      window.open(
        environment.routingUrl + '/application/cpdrejectedaction/action'
      );
      window.onfocus = function () {
        localStorage.setItem('actionData', tempActionData);
        if (localStorage.getItem('submitStatus') == 'Y') {
          window.location.reload();
        }
      };
    }
    if (claimStatus == 3) {
      let state = {
        transactionId: id,
        URN: urn,
        packageCode: packageCode,
        txnpackagedetailid: txnpackagedetailid,
      };
      localStorage.setItem('actionData', JSON.stringify(state));
      localStorage.setItem('treatmentAction', 'true');
      window.open(
        environment.routingUrl +
        '/application/NonComplianceQueryCPDToSNA/action'
      );
      window.onfocus = function () {
        localStorage.setItem('actionData', tempActionData);
        if (localStorage.getItem('submitStatus') == 'Y') {
          window.location.reload();
        }
      };
    }
    if (claimStatus == 4) {
      let state = {
        transactionId: id,
        flag: 'REAPRV',
        URN: urn,
        packageCode: packageCode,
        txnpackagedetailid: txnpackagedetailid,
      };
      localStorage.setItem('actionData', JSON.stringify(state));
      localStorage.setItem('treatmentAction', 'true');
      window.open(environment.routingUrl + '/application/snoreapproval/action');
      window.onfocus = function () {
        localStorage.setItem('actionData', tempActionData);
        if (localStorage.getItem('submitStatus') == 'Y') {
          window.location.reload();
        }
      };
    }
    if (claimStatus == 7) {
      let state = {
        transactionId: id,
        URN: urn,
        packageCode: packageCode,
        txnpackagedetailid: txnpackagedetailid,
      };
      localStorage.setItem('actionData', JSON.stringify(state));
      localStorage.setItem('treatmentAction', 'true');
      window.open(
        environment.routingUrl + '/application/unProcessedClaimList/action'
      );
      window.onfocus = function () {
        localStorage.setItem('actionData', tempActionData);
        if (localStorage.getItem('submitStatus') == 'Y') {
          window.location.reload();
        }
      };
    }
    if (claimStatus == 9) {
      let state = {
        transactionId: id,
        flag: 'DC',
        URN: urn,
        packageCode: packageCode,
        txnpackagedetailid: txnpackagedetailid,
      };
      localStorage.setItem('actionData', JSON.stringify(state));
      localStorage.setItem('treatmentAction', 'true');
      window.open(environment.routingUrl + '/application/dcCompliance/action');
      window.onfocus = function () {
        localStorage.setItem('actionData', tempActionData);
        if (localStorage.getItem('submitStatus') == 'Y') {
          window.location.reload();
        }
      };
    }
  }
  getPackageDetailsInfoList() {
    let txnpackagedetailid = this.claimDetails.txnPackageDetailId;
    console.log('here-> ' + txnpackagedetailid);
    this.cpdService
      .getPackageDetailsInfoList(txnpackagedetailid)
      .subscribe((data) => {
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
      });
  }

  collapseAll() {
    if (this.collapse == 'Collapse All') {
      this.collapse = 'Expand All';
    } else if (this.collapse == 'Expand All') {
      this.collapse = 'Collapse All';
    }
  }

  showProcedureName() {
    $('#procedureNameId').text(this.claimDetails.procedureName1);
    $('#showMoreId').empty();
    $('#showMoreId1').append(
      '<div style="cursor: pointer; color: #1d89c9">Show Less</div>'
    );
  }

  hideProcedureName() {
    let procedureName = this.claimDetails.procedureName1;
    if (procedureName.length > 30) {
      $('#procedureNameId').text(procedureName.substring(0, 30) + '...');
      $('#showMoreId1').empty();
      $('#showMoreId').empty();
      $('#showMoreId').append(
        '<span style="cursor: pointer; color: #1d89c9">Show More</span>'
      );
    }
  }

  showPreDoc(id, text) {
    $('#preAuthDocId' + id).text(text);
    $('#showMoreId2' + id).empty();
    $('#showMoreId3' + id).append(
      '<div style="cursor: pointer; color: #1d89c9">Show Less</div>'
    );
  }

  hidePreDoc(id, text) {
    if (text.length > 30) {
      $('#preAuthDocId' + id).text(text.substring(0, 30) + '...');
      $('#showMoreId3' + id).empty();
      $('#showMoreId2' + id).empty();
      $('#showMoreId2' + id).append(
        '<span style="cursor: pointer; color: #1d89c9">Show More</span>'
      );
    }
  }

  showClaimDoc(id, text) {
    $('#claimProcessDocId' + id).text(text);
    $('#showMoreId4' + id).empty();
    $('#showMoreId5' + id).append(
      '<div style="cursor: pointer; color: #1d89c9">Show Less</div>'
    );
  }

  hideClaimDoc(id, text) {
    if (text.length > 30) {
      $('#claimProcessDocId' + id).text(text.substring(0, 30) + '...');
      $('#showMoreId5' + id).empty();
      $('#showMoreId4' + id).empty();
      $('#showMoreId4' + id).append(
        '<span style="cursor: pointer; color: #1d89c9">Show More</span>'
      );
    }
  }

  showPreDoc1(text) {
    $('#preAuthDocId').text(text);
    $('#showMoreId6').empty();
    $('#showMoreId7').append(
      '<div style="cursor: pointer; color: #1d89c9">Show Less</div>'
    );
  }

  hidePreDoc1(text) {
    if (text.length > 30) {
      $('#preAuthDocId').text(text.substring(0, 30) + '...');
      $('#showMoreId7').empty();
      $('#showMoreId6').empty();
      $('#showMoreId6').append(
        '<span style="cursor: pointer; color: #1d89c9">Show More</span>'
      );
    }
  }

  showClaimDoc1(text) {
    $('#claimProcessDocId').text(text);
    $('#showMoreId8').empty();
    $('#showMoreId9').append(
      '<div style="cursor: pointer; color: #1d89c9">Show Less</div>'
    );
  }

  hideClaimDoc1(text) {
    if (text.length > 30) {
      $('#claimProcessDocId').text(text.substring(0, 30) + '...');
      $('#showMoreId9').empty();
      $('#showMoreId8').empty();
      $('#showMoreId8').append(
        '<span style="cursor: pointer; color: #1d89c9">Show More</span>'
      );
    }
  }

  checkAmount() {
    let amountValue = $('#amount').val();
    let amount = Number(amountValue);
    let totalAmountClaimed = Number(this.claimDetails.TOTALAMOUNTCLAIMED);
    if (amount < totalAmountClaimed) {
      let lessAmount = totalAmountClaimed - amount;
      this.swal(
        '',
        'You are Entering ₹ ' +
        lessAmount +
        ' less amount than Hospital claim Amount.',
        'info'
      );
    }
  }
  pkgDetailsData: any = [];
  overAllDetailsData: any = [];
  getPackageDetails(packageCode, subPackageCode, procedureCode) {
    console.log(
      packageCode,
      subPackageCode,
      procedureCode,
      this.claimDetails.HOSPITALCODE
    );
    this.snoService
      .getPackageDetails(
        packageCode,
        subPackageCode,
        procedureCode,
        this.claimDetails.HOSPITALCODE
      )
      .subscribe(
        (data: any) => {
          let resData = data;
          console.log(resData);
          if (resData.status == 'success') {
            let packgeInfo = resData.data;
            let overallInfo = resData.data1;
            this.pkgDetailsData = JSON.parse(packgeInfo);
            this.overAllDetailsData = JSON.parse(overallInfo);
            console.log(this.pkgDetailsData);
            console.log(this.overAllDetailsData);
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

  memberid: any;
  urn: any;
  hospitalcodedata: any;
  getAuthenticationdetails(type: any) {
    if (type == 1) {
      this.isDisch = true;
    } else {
      this.isDisch = false;
    }
    this.memberid = this.claimDetails.MEMBERID;
    this.urn = this.claimDetails.URN;
    this.hospitalcodedata = this.claimDetails.HOSPITALCODE;
    this.snoService
      .getauthentocationdetails(
        this.urn,
        this.memberid,
        type,
        this.hospitalcodedata,
        this.claimDetails.claimCaseNo
      )
      .subscribe(
        (data: any) => {
          let resData = data;
          console.log(resData + 'data come');
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
  hospitalcode: any;
  overridedetails: any = [];
  getOverridedetails(overridecode: any) {
    this.memberid = this.claimDetails.MEMBERID;
    this.urn = this.claimDetails.URN;
    this.hospitalcode = this.claimDetails.HOSPITALCODE;
    this.snoService
      .getOverridecodedetails(
        overridecode,
        this.memberid,
        this.urn,
        this.hospitalcode
      )
      .subscribe(
        (data: any) => {
          let resData = data;
          console.log(resData);
          if (resData.status == 'success') {
            let results = resData.data;
            results = JSON.parse(results);
            this.overridedetails = results.overridecodedetails;
            console.log(this.overridedetails);
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
  data1: any;
  pagename: any;
  userid: any;
  insert: any;
  documentLog() {
    (this.pagename = 'CPD Approved in SNA'),
      (this.userid = this.user.userId),
      (this.data1 = {
        urnumber: this.urnNo,
        documnetname: this.documnetname,
        claimid: this.claimDetails.CLAIMID,
        userid: this.userid,
        groupid: this.user.groupId,
        documnetStatus: this.documentstatus,
        pagenameAction: this.pagename,
      });
    this.cpdService.insertdocumnetstatus(this.data1).subscribe((data: any) => {
      let resData = data;
      console.log(resData);
      this.insert = resData.data;
      if (this.insert.status == 'success') {
        this.documnetname = [];
      } else {
        console.log(
          'something went worng at the time of documnet status submission'
        );
      }
    });
  }
  caseno: any;
  claimno: any;
  uidreferencenumber: any;
  hscode: any;
  totalnumberofpackage: any;
  totalnumberofmember: any;
  totalnumberofpackageforhospital: any;
  totalnumberofmemberforhospital: any;
  totalNoOfBloackedamount: any;
  packageblockedforpatient: any;
  sumofpackageblockedamount: any;
  treatmentpackage: any = [];
  getdata: any;
  getTreatmentHistoryoverpackgae() {
    this.treatmentpackage = [];
    this.hscode = this.claimDetails.HOSPITALCODE;
    this.caseno = this.claimDetails.claimCaseNo;
    this.uidreferencenumber =
      this.claimDetails.uidreferencenumber != undefined
        ? this.claimDetails.uidreferencenumber
        : '';
    this.snoService
      .getTreatmentHistoryoverpackgae(
        this.txnId,
        this.urnNo,
        this.hscode,
        this.caseno,
        this.uidreferencenumber,
        this.user.userId
      )
      .subscribe((data: any) => {
        console.log(data);
        this.treatmentpackage = data;
        this.totalnumberofpackage =
          this.treatmentpackage[0].totalnumberofpackage;
        this.totalnumberofmember = this.treatmentpackage[0].totalnumberofmember;
        this.totalnumberofpackageforhospital =
          this.treatmentpackage[0].totalnumberofpackageforhospital;
        this.totalnumberofmemberforhospital =
          this.treatmentpackage[0].totalnumberofmemberforhospital;
        this.totalNoOfBloackedamount =
          this.treatmentpackage[0].totalNoOfBloackedamount;
        this.packageblockedforpatient =
          this.treatmentpackage[0].packageblockedforpatient;
        this.sumofpackageblockedamount =
          this.treatmentpackage[0].sumofpackageblockedamount;
      });
  }
  modalClosedd() {
    $('#manetrigger').hide();
  }
  getmandedata() {
    $('#manetrigger').Show();
  }
  triggerList: any = [];

  triggerDetails: any = [];
  list: any = [];
  header: any = [];
  reportName: any;
  getTriggerDetails(data) {
    this.triggerDetails = [];
    this.header = [];
    this.list = [];
    let slnumber = data.slNo;
    console.log(slnumber);
    if (slnumber != null || slnumber != undefined || slnumber != '') {
      this.snoService.getTriggerDetails(data).subscribe(
        (data: any) => {
          let resData = data;
          console.log(resData);
          if (resData.status == 200) {
            this.header = data.header;
            this.list = data.data;
            this.reportName = data.ReportName;
            if (this.list != null || this.list != undefined) {
              $('#triggermodal').show();
            } else {
              $('#triggermodal').hide();
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
    } else {
      $('#triggermodal').hide();
    }
  }
  ongointreatmnet: any = [];
  getOnGoingTreatmenthistory() {
    this.ongointreatmnet = [];
    let urno = this.urnNo;
    this.treatmenthistoryperurn.getOnGoingTreatmenthistory(urno, this.user.userId).subscribe((data) => {
      this.ongointreatmnet = data;
    },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      }
    );
  }

  snamortstatus: any = "";
  getsnamortalitystatus(claimid: any) {
    this.snoService.getsnamortalitystatus(claimid).subscribe((data: any) => {
      this.snamortstatus = data.mortality;
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
  submitClaimAction(){
    this.snoService.saveUrnWiseDetails(this.requestdata).subscribe(
      (data: any) => {
        if (data.status == 'Success') {
          localStorage.setItem('submitStatus', 'Y');
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
          } else if (this.actionFlag == 'Hold') {
            this.swal('Success', data.message, 'success');
          }
          if (localStorage.getItem('treatmentAction') == 'true') {
            setTimeout(() => {
              window.close();
            }, 2000);
            localStorage.removeItem('treatmentAction');
          }
          if (this.treat == 'Y') {
            this.route.navigate(['/treatmenthistoryforsna']);
            localStorage.removeItem('treat');
          } else {
            this.route.navigate(['/application/urnwiseaction']);
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
  isActionAuthAllow(){
    let isAction = this.user.isActionAuth;
    if(isAction == 0){
      return true;
    }else{
      return false;
    }
  }
}








