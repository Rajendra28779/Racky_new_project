import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { CpdrejecteractionserviceService } from '../../Services/cpdrejecteractionservice.service';
import { CreatecpdserviceService } from '../../Services/createcpdservice.service';
import { SnoCLaimDetailsService } from '../../Services/sno-claim-details.service';
import { TreatmenthistoryperurnService } from '../../Services/treatmenthistoryperurn.service';
import { DynamicreportService } from '../../Services/dynamicreport.service';
import { ICDSharedServices } from 'src/app/services/ICDSharedServices';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { DatePipe } from '@angular/common';
import { AuthIrisFingerService } from 'src/app/services/auth-iris-finger.service';
// declare var $: any;

@Component({
  selector: 'app-cpdrejectedaction',
  templateUrl: './cpdrejectedaction.component.html',
  styleUrls: ['./cpdrejectedaction.component.scss'],
})
export class CpdrejectedactionComponent implements OnInit {
  childmessage: any;
  claimId: string;
  amount: any;
  URN: String;
  textRemak: any;
  pendingAt: number;
  claimStatus: number;
  txnId: any;
  allremarks: any;
  claimLog: any = [];
  maxChars = 500;
  preAuth: any;
  packageCode: any;
  urnNo: any;
  user: any;
  isQuery: boolean = false;
  isReject: boolean = false;
  isInvestigate: boolean = false;
  isRevert: boolean = false;
  isApproved: boolean = false;
  isHold: boolean = false;
  showsnamor: boolean = false;
  data: any;
  keyword = 'remarks';
  treat: any;
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
  isDisch: boolean = false;
  preAuthHistory: any = [];
  finalIcdObj: any;
  ictDetailsArray: any = [];
  ictSubDetailsArray: any = [];
  facedetails: any = [];
  fingerprintdetails: any = [];
  documents: any = [];
  constructor(
    private jwtService: JwtService,
    public headerService: HeaderService,
    private cpdActionService: CpdrejecteractionserviceService,
    public snoservice: SnoCLaimDetailsService,
    private route: Router,
    private cpdService: CreatecpdserviceService,
    private treatmenthistoryperurn: TreatmenthistoryperurnService,
    private msgService: ICDSharedServices,
    private sessionService: SessionStorageService,
    private irisService: AuthIrisFingerService
  ) { }
  rejectdetails: any = [];
  Amount = {};
  ngOnInit(): void {
    this.headerService.setTitle('CPD Rejected');
    this.data = JSON.parse(localStorage.getItem('actionData'));
    this.treat = localStorage.getItem('treat');
    this.txnId = this.data.transactionId;
    this.urnNo = this.data.URN;
    this.packageCode = this.data.packageCode;
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
    this.getRemarks();
    this.getcpdrejecteddetails();
    this.user = this.sessionService.decryptSessionData("user");
    $('#appealDisposal').hide();
    $('#triggermodal').hide();
    if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
      document.getElementsByTagName("section")[0].className += " safari";
    }
    this.msgService.subsVar = this.msgService.
      invokeFirstComponentFunction.subscribe((data) => {
        this.finalIcdObj = data.icdData;
      });

    this.irisService.subsVar = this.irisService.
      invokeFirstComponentFunction.subscribe((data) => {
        this.actionFlag = data.flag;
        this.submitClaimAction();
    });
  }

  tableData: any = [];
  isTableData: boolean = false;
  ispreAuthLength: boolean = false;
  multiPackList: any = [];
  multiPackListcaseno: any = [];
  multiFlag: boolean = false;
  multiFlagcase: boolean = false;
  backUpAmount: any;
  meTrigger: any = [];
  cardBalanceDetails: any = [];
  getcpdrejecteddetails() {
    this.cpdActionService.getcpdrejecteddetails(this.txnId).subscribe(
      (data: any) => {
        let resData = data;
        if (resData.status == 'success') {
          let details = JSON.parse(resData.details);
          this.rejectdetails = details.actionData;
          let procedureName = this.rejectdetails.procedureName1;
          if (procedureName.length > 30) {
            $('#procedureNameId').text(procedureName.substring(0, 30) + '...');
            $('#showMoreId').empty();
            $('#showMoreId').append('<span style="cursor: pointer; color: #1d89c9">Show More</span>');
          } else {
            $('#procedureNameId').text(procedureName);
          }
          this.tableData = details.actionLog;
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
            ictSubDetailsArray: this.ictSubDetailsArray
          }
          this.msgService.setMessage(icdResponse);
          multiPkg.forEach((item) => {
            if (item.transctionId != this.txnId) {
              this.multiPackList.push(item);
            }
          });
          if (this.multiPackList.length > 0) {
            this.multiFlag = true;
          }
          multipackcasen.forEach((item) => {
            // if (item.transctionId != this.txnId) {
            this.multiPackListcaseno.push(item);
            // }
          });
          if (this.multiPackListcaseno.length > 0) {
            this.multiFlagcase = true;
          }
          this.cpdService
            .getPreAuthHistory(
              this.urnNo,
              this.rejectdetails.AUTHORIZEDCODE,
              this.rejectdetails.HOSPITALCODE
            )
            .subscribe((authData: any) => {
              this.preAuth = authData.preAuthLogList;
              if (this.preAuth.length != 0) {
                this.ispreAuthLength = true;
              }
              this.preAuthHistory = authData.preAuthLog;
            });
          this.getPackageDetailsInfoList();
          this.getmultipledocumentthroughcaseno();
          this.getTreatMentHistory();
          this.getOldTreatMentHistory();
          this.getTreatmentHistoryOverpackage();
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
  myGroup = new FormGroup({
    remarks: new FormControl(),
  });
  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }
  getRemarks() {
    this.cpdActionService.getRemarks().subscribe(
      (data1: any) => {
        this.allremarks = data1;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  remarks: any;
  claimAmout: any;
  actionRemarkId: any;
  resuestedData:any;
  submitCpdRejected(event: any, claimId: any, status) {
    this.remarks = $('#remarks').val();
    let amount = $('#amount').val();
    let userId = this.user.userId;
    this.claimAmout = Number(this.rejectdetails.TOTALAMOUNTCLAIMED);
    let urnNo = this.rejectdetails.URN;
    let presurgeryphoto = this.rejectdetails.PRESURGERYPHOTO;
    let postsurgeryphoto = this.rejectdetails.POSTSURGERYPHOTO;
    let additionaldocs = this.rejectdetails.ADITIONALDOCS;
    let dischargeslip = this.rejectdetails.DISCHARGESLIP;
    let investigationdocs = this.rejectdetails.INVESTIGATIONDOC;
    let additionaldocs1 = this.rejectdetails.ADITIONAL_DOC1;
    let additionaldocs2 = this.rejectdetails.ADITIONAL_DOC2;
    let statusflag = this.rejectdetails.Statusflag;
    let intrasurgery = this.rejectdetails.INTRA_SURGERY_PHOTO;
    let patientpic = this.rejectdetails.PATIENT_PHOTO;
    let specimenpic = this.rejectdetails.SPECIMEN_REMOVAL_PHOTO;
    if (status == 'aprv') {
      this.pendingAt = 3;
      this.claimStatus = 1;
    }
    if (status == 'qry') {
      this.pendingAt = 0;
      this.claimStatus = 4;
      amount = "";//Changes on 29/12/2023 By Rajendra with santanu sir and gyana sir and ashok sir porpose:- issue fixing in postpayment updation
    }
    if (status == 'rej') {
      this.pendingAt = 3;
      this.claimStatus = 2;
      amount = '0';
    }
    if (event.target.id == 'Investigate') {
      this.pendingAt = 4;
      this.claimStatus = 6;
      amount = '0';
    }
    if (event.target.id == 'Hold') {
      this.pendingAt = 2;
      this.claimStatus = 13;
      amount = '0';
    }
    if (event.target.id == 'Revert') {
      this.pendingAt = 1;
      this.claimStatus = 8;
      amount = '0';
    }
    if (event.target.id == 'Revert') {
    } else if (this.actionRemarkId == 0 || this.actionRemarkId == null || this.actionRemarkId == '' || this.actionRemarkId == undefined) {
      this.swal('', ' Please Select Remark', 'error');
      return;
    }

    let snamortality = $('#snamortalityId').val();
    if (status == 'aprv' || status == 'rej') {
      if (snamortality == "" || snamortality == null || snamortality == undefined) {
        this.swal('', ' Please Select SNA Mortality', 'error');
        return;
      }
    }

    if (this.actionRemarkId == 57 || status == 'rvrt' || status == 'rej') {
      if (this.remarks == '' || this.remarks == null) {
        this.swal('', 'Description should not be left blank', 'error');
        return;
      }
    }
    if (this.actionRemarkId == 1) {
      if (amount == 0) {
        this.swal('', 'Amount should not be zero', 'error');
        return;
      }
    }
    if (status != 'qry') {
      if (amount == '' || amount == null || amount == undefined) {
        this.swal('', 'Amount should not be left blank', 'error');
        return;
      }
      let gfg = $.isNumeric(amount);
      if (!gfg) {
        this.swal('', ' Amount should be Numeric', 'error');
        return;
      }

      if (amount > this.claimAmout) {
        this.swal(
          '',
          'Approved  Amount should be less than claim amount',
          'error'
        );
        return;
      }
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
    this.resuestedData = {
      claimId: claimId,
      userId: userId,
      amount: amount,
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
      snamortality: snamortality
    };
    let sharedData = {
      claimId: claimId,
      actionType: this.claimStatus,
      claimNo:this.rejectdetails?.CLAIM_NO,
      flag: event.target.id
    }
    if (this.rejectdetails.TOTALAMOUNTCLAIMED === amount && status === 'aprv') {
      Swal.fire({
        title: '',
        html: `You are Approving Full Claim Amount of <span style="color: red; font-weight: bold;">₹${this.rejectdetails.TOTALAMOUNTCLAIMED}</span>! Are you sure to Approve the Full Amount or Want to Re-Verify the Document?`,
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
            confirmButtonText: 'Yes',
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
        confirmButtonText: 'Yes',
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

  documnetname: any = [];
  downloadAction(
    event: any,
    fileName: any,
    hCode: any,
    dateOfAdm: any,
    status
  ) {
    let docStatus = status;
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
      target.nodeName == 'i'
    ) {
      target = $(target);
      let anchor = target.parent();
      anchor = anchor.get(0);

      if (fileName != null) {
        this.snoservice.downloadFiles(fileName, hCode, dateOfAdm).subscribe(
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

  preAuthLogDetails(urn, authCode, hosCode) {
    let authCodes = authCode;
    localStorage.setItem('urn', urn);
    localStorage.setItem('authorizedCode', authCodes);
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
  packagedetails() {
    let urnNo = this.rejectdetails.URN;
    let Packagecode = this.rejectdetails.packagecode;
    localStorage.setItem('urn', urnNo);
    localStorage.setItem('packagecode', Packagecode);
    localStorage.setItem('token', this.jwtService.getJwtToken());
    this.route.navigate([]).then((result) => {
      window.open(environment.routingUrl + '/treatmenthistorypackage');
    });
  }
  OnChangeRemark(item) {
    let id = item.id;
    this.allremarks.forEach((remark: any) => {
      if (remark.id === id)
        if (this.textRemak) {
          this.textRemak = this.textRemak + ", " + remark.remarks;
        } else
          this.textRemak = remark.remarks;
    })

    this.actionRemarkId = id;
    if (id == '1') {
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
    } else if (id == '58') {
      this.isQuery = true;
      this.isApproved = true;
      this.isInvestigate = true;
      this.isRevert = true;
      this.isHold = true;
      this.isReject = false;
      $('#amount').val(0);
      $('#amount').prop('disabled', true);
    } else {
      this.isQuery = false;
      this.isReject = false;
      this.isInvestigate = false;
      this.isRevert = false;
      this.isApproved = false;
      this.isHold = false;
      $('#amount').prop('disabled', false);
    }
    if (!this.isReject || !this.isApproved) {
      this.showsnamor = true;
    } else {
      this.showsnamor = false;
    }
  }
  modalClose() {
    $('#appealDisposal').hide();
    $('#triggermodal').hide();
  }
  approvedAmount(event: KeyboardEvent) {
    const pattern = /^[A-Za-z0-9.,#%<>()-_ \\s]+$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
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
  keyPress(event: KeyboardEvent) {
    const pattern = /'/;
    const inputChar = String.fromCharCode(event.charCode);
    if (pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  documentstatus: any;
  files: any = [];
  viewAllDocument(dischargeSlip, additionDoc, additionalDoc1, additionalDoc2, preSurgery, postSurgery, patientPic, intraSurgery, specimenRemoval, mortalityauditreport) {
    this.files = [];
    this.documnetname = [];
    this.documentstatus = 1

    if (dischargeSlip != null || dischargeSlip != undefined) {
      this.documnetname.push(dischargeSlip);
      let jsonObj = {
        'f': dischargeSlip,
        'h': this.rejectdetails.HOSPITALCODE,
        'd': this.rejectdetails.DATEOFADMISSION
      }
      this.files.push(jsonObj);
    }
    if (additionDoc != null || additionDoc != undefined) {
      this.documnetname.push(additionDoc);
      let jsonObj = {
        'f': additionDoc,
        'h': this.rejectdetails.HOSPITALCODE,
        'd': this.rejectdetails.DATEOFADMISSION
      }
      this.files.push(jsonObj);
    }
    if (additionalDoc1 != null || additionalDoc1 != undefined) {
      this.documnetname.push(additionalDoc1);
      let jsonObj = {
        'f': additionalDoc1,
        'h': this.rejectdetails.HOSPITALCODE,
        'd': this.rejectdetails.DATEOFADMISSION
      }
      this.files.push(jsonObj);
    }
    if (additionalDoc2 != null || additionalDoc2 != undefined) {
      this.documnetname.push(additionalDoc2);
      let jsonObj = {
        'f': additionalDoc2,
        'h': this.rejectdetails.HOSPITALCODE,
        'd': this.rejectdetails.DATEOFADMISSION
      }
      this.files.push(jsonObj);
    }

    if (preSurgery != null || preSurgery != undefined) {
      this.documnetname.push(preSurgery);
      let jsonObj = {
        'f': preSurgery,
        'h': this.rejectdetails.HOSPITALCODE,
        'd': this.rejectdetails.DATEOFADMISSION
      }
      this.files.push(jsonObj);
    }

    if (postSurgery != null || postSurgery != undefined) {
      this.documnetname.push(postSurgery);
      let jsonObj = {
        'f': postSurgery,
        'h': this.rejectdetails.HOSPITALCODE,
        'd': this.rejectdetails.DATEOFADMISSION
      }
      this.files.push(jsonObj);
    }

    if (patientPic != null || patientPic != undefined) {
      this.documnetname.push(patientPic);
      let jsonObj = {
        'f': patientPic,
        'h': this.rejectdetails.HOSPITALCODE,
        'd': this.rejectdetails.DATEOFADMISSION
      }
      this.files.push(jsonObj);

      if (intraSurgery != null || intraSurgery != undefined) {
        this.documnetname.push(intraSurgery);
        let jsonObj = {
          'f': intraSurgery,
          'h': this.rejectdetails.HOSPITALCODE,
          'd': this.rejectdetails.DATEOFADMISSION
        }
        this.files.push(jsonObj);
      }
    }

    if (specimenRemoval != null || specimenRemoval != undefined) {
      this.documnetname.push(specimenRemoval);
      let jsonObj = {
        'f': specimenRemoval,
        'h': this.rejectdetails.HOSPITALCODE,
        'd': this.rejectdetails.DATEOFADMISSION
      }
      this.files.push(jsonObj);
    }

    if (mortalityauditreport != null || mortalityauditreport != undefined) {
      this.documnetname.push(mortalityauditreport);
      let jsonObj = {
        'f': mortalityauditreport,
        'h': this.rejectdetails.HOSPITALCODE,
        'd': this.rejectdetails.DATEOFADMISSION
      }
      this.files.push(jsonObj);
    }
    this.snoservice.downloadAllDocuments(this.files).subscribe(data => {
      let result = data;
      let blob = new Blob([result], { type: result.type });
      let url = window.URL.createObjectURL(blob);
      window.open(url);
      this.documentLog();
    });
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
      this.oldTrtData = data;
      if (this.oldTrtData.length > 3) {
        document.getElementById('oldTreatmentTable').classList.add('treatment-history-table-class', 'treatment-history-table-head-class');
      }
    },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      });
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
      localStorage.setItem('actionData', JSON.stringify(state));
      localStorage.setItem('treatmentAction', 'true');
      window.open(environment.routingUrl + '/application/snoapproval/action');
      window.onfocus = function () {
        localStorage.setItem('actionData', tempActionData);
        if (localStorage.getItem('submitStatus') == 'Y') {
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
      localStorage.setItem("actionData", JSON.stringify(state));
      localStorage.setItem('treatmentAction', 'true');
      window.open(environment.routingUrl + '/application/cpdrejectedaction/action');
      window.onfocus = function () {
        localStorage.setItem('actionData', tempActionData);
        if (localStorage.getItem('submitStatus') == 'Y') {
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
      localStorage.setItem('actionData', JSON.stringify(state));
      localStorage.setItem('treatmentAction', 'true');
      window.open(environment.routingUrl + '/application/snoreapproval/action');
      window.onfocus = function () {
        localStorage.setItem('actionData', tempActionData);
        if (localStorage.getItem('submitStatus') == 'Y') {
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
        urn: urn
      }
      localStorage.setItem("history", JSON.stringify(state));
      localStorage.setItem("token", this.jwtService.getJwtToken())
      this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/dischargelistHistoryHospital'); });
    }

  }
  getPackageDetailsInfoList() {
    let txnpackagedetailid = this.rejectdetails.txnPackageDetailId;
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
    } else if (this.collapse == 'Expand All') {
      this.collapse = 'Collapse All';
    }
  }

  showProcedureName() {
    $('#procedureNameId').text(this.rejectdetails.procedureName1);
    $('#showMoreId').empty()
    $('#showMoreId1').append('<div style="cursor: pointer; color: #1d89c9">Show Less</div>');
  }

  hideProcedureName() {
    let procedureName = this.rejectdetails.procedureName1;
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

  pkgDetailsData: any = [];
  overAllDetailsData: any = [];
  getPackageDetails(packageCode, subPackageCode, procedureCode) {
    this.snoservice.getPackageDetails(packageCode, subPackageCode, procedureCode, this.rejectdetails.HOSPITALCODE).subscribe(
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
    if (type == 1) {
      this.isDisch = true;
    } else {
      this.isDisch = false;
    }
    this.memberid = this.rejectdetails.MEMBERID;
    this.urn = this.rejectdetails.URN;
    this.hospitalcodedata = this.rejectdetails.HOSPITALCODE;
    this.snoservice.getauthentocationdetails(this.urn, this.memberid, type, this.hospitalcodedata, this.rejectdetails.claimCaseNo).subscribe(
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
    this.memberid = this.rejectdetails.MEMBERID;
    this.urn = this.rejectdetails.URN;
    this.hospitalcode = this.rejectdetails.HOSPITALCODE;
    this.snoservice.getOverridecodedetails(overridecode, this.memberid, this.urn, this.hospitalcode).subscribe(
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
  data1: any;
  pagename: any
  userid: any
  insert: any
  documentLog() {
    this.user = this.sessionService.decryptSessionData("user");
    this.pagename = "CPD Rejected";
    this.userid = this.user.userId;
    this.data1 = {
      "urnumber": this.urnNo,
      "documnetname": this.documnetname,
      "claimid": this.rejectdetails.CLAIMID,
      "userid": this.userid,
      "groupid": this.user.groupId,
      "documnetStatus": this.documentstatus,
      "pagenameAction": this.pagename,
    }
    this.cpdService.insertdocumnetstatus(this.data1).subscribe(
      (data: any) => {
        let resData = data;
        this.insert = resData.data;
        if (this.insert.status == "success") {
          this.documnetname = [];
        } else {
        }
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
  getTreatmentHistoryOverpackage() {
    this.treatmentpackage = []
    this.hscode = this.rejectdetails.HOSPITALCODE;
    this.caseno = this.rejectdetails.claimCaseNo;
    this.uidreferencenumber = this.rejectdetails.uidreferencenumber != undefined ? this.rejectdetails.uidreferencenumber : '';
    this.snoservice.getTreatmentHistoryoverpackgae(this.txnId, this.urnNo, this.hscode, this.caseno, this.uidreferencenumber, this.user.userId).subscribe(
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
  triggerList: any = [];
  list: any = [];
  header: any = [];
  reportName: any;
  getTriggerDetails(data) {
    this.header = [];
    this.list = [];
    let slnumber = data.slNo;
    if (slnumber != null || slnumber != undefined || slnumber != '') {
      this.snoservice.getTriggerDetails(data).subscribe(
        (data: any) => {
          let resData = data;
          if (resData.status == 200) {
            this.header = data.header;
            this.list = data.data
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
  // getOnGoingTreatmenthistory() {
  //   this.ongointreatmnet = [];
  //   let urno = this.urnNo;
  //   this.treatmenthistoryperurn.getOnGoingTreatmenthistory(urno, this.user.userId).subscribe(data => {
  //     this.ongointreatmnet = data
  //   },
  //     (error) => {
  //       this.swal('', 'Something went wrong.', 'error');
  //     });
  // }
  triggerdetails = [];
  triggerdetails1 = [];
  getCPDTrigger() {
    this.triggerdetails = [];
    this.triggerdetails1 = [];
    let hospitalcode = this.rejectdetails?.HOSPITALCODE;
    let dateofAdmission = this.Dateconvert(this.rejectdetails?.DATEOFADMISSION1);
    let dateofdischarge = this.Dateconvert(this.rejectdetails?.DATEOFDISCHARGE1);
    let procedurecode = this.rejectdetails?.procedureCode1;
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
    let hospitalcode = this.rejectdetails?.HOSPITALCODE;
    let dateofAdmission = this.Dateconvert(this.rejectdetails?.DATEOFADMISSION1);
    let dateofdischarge = this.Dateconvert(this.rejectdetails?.DATEOFDISCHARGE1);
    let procedurecode = this.rejectdetails?.procedureCode1;
    let packageName = this.rejectdetails?.packageName1;
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
    let procedureCode = this.rejectdetails?.procedureCode1;
    let uidreferencenumber = this.rejectdetails?.uidreferencenumber != undefined ? this.rejectdetails.uidreferencenumber : '';;
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

  checkAmount() {
    let amountValue = $('#amount').val();
    let amount = Number(amountValue);
    let totalAmountClaimed = Number(this.rejectdetails.TOTALAMOUNTCLAIMED);
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
    let claimCaseNo = this.rejectdetails?.claimCaseNo;
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
    let caseno = this.rejectdetails?.claimCaseNo;
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
        this.snoservice.downloadFiles(filename, hospitalcode, dateofadmission).subscribe(
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
    this.cpdActionService.saveDetails(this.resuestedData).subscribe(
      (data: any) => {
        if (data.status == 'Success') {
          localStorage.setItem('submitStatus', 'Y')
          this.swal('Success', data.message, 'success');
        } else if (data.status == 'Failed') {
          this.swal('Error', data.message, 'error');
        } else if (this.actionFlag == 'Investigate') {
          this.swal('Success', data.message, 'success');
        } else if (this.actionFlag == 'Revert') {
          this.swal('Success', data.message, 'success');
        } else if (this.actionFlag == 'Hold') {
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
          this.route.navigate(['/application/cpdrejected']);
          localStorage.removeItem('actionData');
        }

      },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      }
    );
  }
}




