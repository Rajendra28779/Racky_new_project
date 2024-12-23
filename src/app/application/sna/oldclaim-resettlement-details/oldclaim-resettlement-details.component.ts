import { Component, OnInit } from '@angular/core';
import { JwtService } from 'src/app/services/jwt.service';
import { HeaderService } from '../../header.service';
import { Router } from '@angular/router';
import { SnoCLaimDetailsService } from '../../Services/sno-claim-details.service';
import { TreatmenthistoryperurnService } from '../../Services/treatmenthistoryperurn.service';
import { FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-oldclaim-resettlement-details',
  templateUrl: './oldclaim-resettlement-details.component.html',
  styleUrls: ['./oldclaim-resettlement-details.component.scss']
})
export class OldclaimResettlementDetailsComponent implements OnInit {
  childmessage: any;
  claimDetails: any;
  allremarks: any;
  txnId: any;
  fileUrl: any;
  claimLog: Array<any> = [];
  pendingAt: any;
  claimStatus: any;
  user: any;
  routeFlag: any;
  urnNo: any;
  preAuth: any = [];
  packageCode: any;
  maxChars = 500;
  check: boolean = false;
  isQuery: boolean = false;
  isReject: boolean = false;
  isInvestigate: boolean = false;
  isApproved: boolean = false;
  data: any;
  keyword = 'remarks';
  treat: string;
  treatment: string;
  trtData: any = [];
  oldTrtData: any = [];

  constructor(
    private jwtService: JwtService,
    public headerService: HeaderService,
    public route: Router,
    public snoService: SnoCLaimDetailsService,
    private treatmenthistoryperurn: TreatmenthistoryperurnService,
    private sessionService: SessionStorageService) { }
  ngOnInit(): void {
    this.user = this.sessionService.decryptSessionData("user");
    this.data = JSON.parse(localStorage.getItem('actionData'));
    this.treat = localStorage.getItem('treat');
    this.treatment = localStorage.getItem('treatment');
    this.txnId = this.data.transactionId;
    this.routeFlag = this.data.flag;
    this.urnNo = this.data.URN;
    this.packageCode = this.data.packageCode;
    this.headerService.setTitle('Old Claim Resettlement');
    $('#appealDisposal').hide();
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
    this.getRemarks();
    this.getSnoClaimDetailsById();
  }

  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }
  multiPackList: any = [];
  multiFlag: boolean = false;
  backUpAmount: any;
  getSnoClaimDetailsById() {
    this.snoService.getOldClaimResettlementById(this.txnId).subscribe(
      (data: any) => {
        let resData = data;
        if (resData.status == 'success') {
          let details = JSON.parse(resData.details);
          this.claimDetails = details.actionData;
          this.claimLog = details.actionLog;
          this.backUpAmount = this.claimDetails.TOTALAMOUNTBLOCKED;
          this.preAuth = details.preAuthHist;
          if (this.preAuth.length != 0) {
            this.check = true;
          }
          this.getTreatMentHistory();
          this.getOldTreatMentHistory();
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
  OlddownloadAction(event: any, fileName: any, hCode: any, year: any) {
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
        this.snoService.downloadOldFiles(fileName, hCode, year).subscribe(
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
  fileArray: any = [];
  downloadAllFile(dischargeSlip, additionaldoc, additionaldoc1, additionaldoc2) {
    this.fileArray = [];
    if (dischargeSlip != null || dischargeSlip != undefined) {
      let jsonObj = {
        'f': dischargeSlip,
        'h': this.claimDetails.HOSPITALCODE,
        'd': this.claimDetails.ACTUALDATEOFADMISSION
      }
      this.fileArray.push(jsonObj);
    }
    if (additionaldoc != null || additionaldoc != undefined) {
      let jsonObj = {
        'f': additionaldoc,
        'h': this.claimDetails.HOSPITALCODE,
        'd': this.claimDetails.ACTUALDATEOFADMISSION
      }
      this.fileArray.push(jsonObj);
    }
    if (additionaldoc1 != null || additionaldoc1 != undefined) {
      let jsonObj = {
        'f': additionaldoc1,
        'h': this.claimDetails.HOSPITALCODE,
        'd': this.claimDetails.ACTUALDATEOFADMISSION
      }
      this.fileArray.push(jsonObj);
    }
    if (additionaldoc2 != null || additionaldoc2 != undefined) {
      let jsonObj = {
        'f': additionaldoc2,
        'h': this.claimDetails.HOSPITALCODE,
        'd': this.claimDetails.ACTUALDATEOFADMISSION
      }
      this.fileArray.push(jsonObj);
    }
    this.snoService.downloadAllFiles(this.fileArray).subscribe(
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

  approved_Amount(event: KeyboardEvent) {
    const pattern = /^\d+(\.\d{1,2})?$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  remarks: any;
  myGroup = new FormGroup({
    remarks: new FormControl(),
  });
  amount: any;
  claimAmout: any;
  actionRemarkId: any;
  submitDetails(event: any, claimId: any) {
    this.remarks = $('#remarks').val();
    this.amount = $('#amount').val();
    let userId = this.user.userId;
    this.claimAmout = Number(this.claimDetails.TOTALAMOUNTBLOCKED);
    let urnNo = this.claimDetails.URN;
    let additionaldocs1 = this.claimDetails.ADITIONAL_DOC1;
    let additionaldocs2 = this.claimDetails.ADITIONAL_DOC2;
    let statusflag = 0;
    if (event.target.id == 'Approve') {
      this.pendingAt = 3;
      this.claimStatus = 1;
    }
    if (event.target.id == 'Query') {
      this.pendingAt = 0;
      this.claimStatus = 4;
      this.amount = '0';
    }
    if (event.target.id == 'Reject') {
      this.pendingAt = 3;
      this.claimStatus = 2;
      this.amount = '0';
    }

    if (this.actionRemarkId == 0 || this.actionRemarkId == null || this.actionRemarkId == '' || this.actionRemarkId == undefined) {
      this.swal('', ' Please Select Remark', 'error');
      return;
    }
    if (this.actionRemarkId == 57 || event.target.id == 'Reject') {
      if (this.remarks == '' || this.remarks == null) {
        this.swal('', 'Description should not be left blank', 'error');
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
    if (this.amount == '' || this.amount == null) {
      this.swal('', 'Amount should not be left blank', 'error');
      return;
    }
    var gfg = $.isNumeric(this.amount);
    if (!gfg) {
      this.swal('', ' Amount should be Numeric', 'error');
      return;
    }
    if (event.target.id == 'Approve') {
      if (this.amount == 0) {
        this.swal('', 'Amount should not be zero', 'error');
        return;
      }
    }
    if (this.amount > this.claimAmout) {
      this.swal(
        '',
        'Approved  Amount should be less than claim amount',
        'error'
      );
      return;
    }

    let data = {
      claimId: claimId,
      userId: userId,
      amount: this.amount,
      claimAmount: this.claimAmout,
      remarks: this.remarks,
      actionRemarksId: this.actionRemarkId,
      urnNo: urnNo,
      pendingAt: this.pendingAt,
      claimStatus: this.claimStatus,
      additionaldoc1: additionaldocs1,
      additionaldoc2: additionaldocs2,
      statusflag: statusflag,
    };
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
        this.snoService.saveSnoDetailsOfOldReAprv(data).subscribe(
          (data: any) => {
            if (data.status == 'Success') {
              if (event.target.id == 'Approve') {
                this.swal('Success', data.message, 'success');
              } else if (event.target.id == 'Query') {
                this.swal('Success', data.message, 'info');
              } else if (event.target.id == 'Reject') {
                this.swal('Success', data.message, 'success');
              }
              localStorage.removeItem('actionData');
              this.route.navigate(['/application/oldClaimResettlement']);

            } else if (data.status == 'Failed') {
              this.swal('Error', data.message, 'error');
            }
          },
          (error) => {
            console.log(error);
            this.swal('', 'Something went wrong.', 'error');
          }
        );
      }
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
  treatmentdetails() {
    localStorage.setItem('urn', this.urnNo);
    localStorage.setItem('transactionDetailsId', this.txnId);
    localStorage.setItem('userId', this.user.userId);
    localStorage.setItem('token', this.jwtService.getJwtToken());
    this.route.navigate([]).then((result) => {
      window.open(environment.routingUrl + '/treatmenthistoryforsna');
    });
  }
  Oldtreatmentdetails() {
    localStorage.setItem('urn1', this.urnNo);
    localStorage.setItem('transactionDetailsId1', this.txnId);
    localStorage.setItem('userId1', this.user.userId);
    localStorage.setItem('token1', this.jwtService.getJwtToken());
    this.route.navigate([]).then((result) => {
      window.open(environment.routingUrl + '/Oldtreatmenthistoryforsna');
    });
  }
  dtls: any;
  viewDescription(descriptinDtls) {
    this.dtls = descriptinDtls;
    $('#appealDisposal').show();
  }
  packagedetails() {
    let urnNo = this.urnNo;
    let packagecode = this.packageCode;
    localStorage.setItem('urn', urnNo);
    localStorage.setItem('packagecode', packagecode);
    localStorage.setItem('token', this.jwtService.getJwtToken());
    this.route.navigate([]).then((result) => {
      window.open(environment.routingUrl + '/treatmenthistorypackage');
    });
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
  modalClose() {
    $('#appealDisposal').hide();
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
      this.isApproved = false;
      $('#amount').val(this.backUpAmount);
      $('#amount').prop('disabled', false);
    } else if (id == 58) {
      this.isQuery = true;
      this.isApproved = true;
      this.isInvestigate = true;
      this.isReject = false;
      $('#amount').val(0);
      $('#amount').prop('disabled', true);
    } else {
      this.isQuery = false;
      this.isReject = false;
      this.isInvestigate = false;
      this.isApproved = false;
      $('#amount').val(this.backUpAmount);
      $('#amount').prop('disabled', false);
    }
  }
  keyPress(event: KeyboardEvent) {
    const pattern = /'/;
    const inputChar = String.fromCharCode(event.charCode);
    if (pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  files: any = [];
  viewAllDocument(dischargeSlip, additionDoc, additionalDoc1, additionalDoc2, investigationdocs, investigationdocs2, preSurgery, postSurgery, patientPic, intraSurgery, specimenRemoval) {
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
    if (investigationdocs != null || investigationdocs != undefined) {
      let jsonObj = {
        'f': investigationdocs,
        'h': this.claimDetails.HOSPITALCODE,
        'd': this.claimDetails.DATEOFADMISSION
      }
      this.files.push(jsonObj);
    }
    if (investigationdocs2 != null || investigationdocs2 != undefined) {
      let jsonObj = {
        'f': investigationdocs2,
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
    this.snoService.downloadAllDocuments(this.files).subscribe(data => {
      var result = data;
      let blob = new Blob([result], { type: result.type });
      let url = window.URL.createObjectURL(blob);
      window.open(url);
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
    if (claimStatus == 7) {
      let state = {
        transactionId: id,
        URN: urn,
        packageCode: packageCode
      }
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
}
