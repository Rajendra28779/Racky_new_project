import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service';
import { CreatecpdserviceService } from '../../Services/createcpdservice.service';
import { SnoCLaimDetailsService } from '../../Services/sno-claim-details.service';
import { TreatmenthistoryperurnService } from '../../Services/treatmenthistoryperurn.service';
import { HeaderService } from '../../header.service';
import { FormGroup, FormControl } from '@angular/forms';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { CardbalanceupdateserviceService } from '../../cardbalanceupdateservice.service';
import { CurrencyPipe } from '@angular/common';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-wallet-refund',
  templateUrl: './wallet-refund.component.html',
  styleUrls: ['./wallet-refund.component.scss']
})
export class WalletRefundComponent implements OnInit {

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
  preAuth: any;
  packageCode: any;
  maxChars = 500;
  check: boolean = false;
  isQuery: boolean = false;
  isReject: boolean = false;
  isInvestigate: boolean = false;
  isRevert: boolean = false;
  isApproved: boolean = false;
  data: any;
  Redirection: any;
  keyword= 'remarks';
  treat: string;
  treatment: string;
  reconsider: string;
  trtData: any = [];
  oldTrtData: any = [];
  currentbalance: any = [];
  // memberid: any;
  // claimedamount: any;
  snoapprovedamount: any;
  claimid: any;
  balanceAmount: any;
  totalAmountBlocked: any;

  // isApprove: boolean = true;
  constructor(
    private jwtService: JwtService,
    public headerService: HeaderService,
    public route: Router,
    public snoService: SnoCLaimDetailsService,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private cardbalanceupdateserviceService: CardbalanceupdateserviceService,
    private treatmenthistoryperurn: TreatmenthistoryperurnService,
    private sessionService: SessionStorageService
  ) { }

  ngOnInit(): void {
    this.data = JSON.parse(localStorage.getItem('actionData'));
    this.treat=localStorage.getItem('treat');
    this.treatment=localStorage.getItem('treatment');
    // this.reconsider=localStorage.getItem('consider');
    let consider = localStorage.getItem('reconsider');
    this.txnId = this.data.transactionId;
    this.routeFlag = this.data.flag;
    this.urnNo = this.data.URN;
    this.snoapprovedamount = this.data.snaapprvamount;
    this.packageCode = this.data.packageCode;
    this.claimid = this.data.claimid;
    this.balanceAmount = this.data.balanceamount;
    this.totalAmountBlocked = this.data.blockamount;
    this.Redirection = this.data.Redirection;
    // dynamic title
    if (this.routeFlag == 'APRV') {
      this.headerService.setTitle('Approval by SNA');
    } else if (this.routeFlag == 'REAPRV') {
      this.headerService.setTitle('Re-Approval by SNA');
    }
    this.headerService.setTitle('Wallet Refund');
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
    this.getRemarks();
    this.getSnoClaimDetailsById();
    this.user = this.sessionService.decryptSessionData("user");
    $('#appealDisposal').hide();
    if (consider == 'Y') {
      $('#Revert').hide();
    }
  }

  approved_Amount(event: KeyboardEvent) {
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
  getSnoClaimDetailsById() {
    console.log(this.txnId);
    this.snoService.getMultiPackage(this.txnId).subscribe(
      (data: any) => {
        let resData = data;
        //console.log(resData);
        if (resData.status == 'success') {
          let details = JSON.parse(resData.details);
          this.claimDetails = details.actionData;
          console.log(this.claimDetails);
          this.claimLog = details.actionLog;
          let multiPkg = details.packageBlock;
          // this.backUpAmount = this.claimDetails.TOTALAMOUNTBLOCKED;
          console.log(details.actionData);
          console.log(details.actionLog);
          console.log(details.packageBlock);
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
          this.preAuth = details.preAuthHist;
          console.log(this.preAuth);
          if (this.preAuth.length != 0) {
            this.check = true;
          }
          // this.claimLog.shift();
          // this.cpdService.getPreAuthHistory(this.urnNo, this.claimDetails.AUTHORIZEDCODE, this.claimDetails.HOSPITALCODE).subscribe((authData: any) => {
          //   this.preAuth = authData;
          //   console.log(this.preAuth);
          //   if (this.preAuth.length != 0) {
          //     this.check = true;
          //   }
          // })
          // localStorage.removeItem('reconsider');
          this.getTreatMentHistory();
          this.getOldTreatMentHistory();
          this.getcarbalancedetailsbyurn();
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

  getcarbalancedetailsbyurn() {
    this.currentbalance = [];
    let responseData = [];
    this.cardbalanceupdateserviceService.getcarbalancedetailsbyurn(this.claimDetails.URN).subscribe((data: any) => {
      console.log(data);
      let resData = data;
      if (resData.status == 'success') {
        responseData = JSON.parse(resData.data);
        for (let i = 0; i < responseData.length; i++) {
          if(this.claimDetails.MEMBERID == responseData[i].memberid) {
            if(this.claimDetails.CLAIMID == responseData[i].claimid) {
              this.currentbalance.push(responseData[i]);
            }
          }
        }
      }
    }
    );
    (error) => {
      console.log(error);
    }
  }

  getTreatMentHistory() {
    this.treatmenthistoryperurn.searchbyUrnSnaUser(this.urnNo,this.user.userId).subscribe(data => {
      this.trtData = data;
      console.log(this.trtData);
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
    this.treatmenthistoryperurn.oldsearchbyUrnSnaUser(urno,this.user.userId).subscribe(data => {
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

  formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  });

  submitDetails() {
    let remarks = $('#remarks').val();
    let date1 = new Date(this.claimDetails.ACTUALDATEOFDISCHARGE);

    if(remarks==null || remarks=='' || remarks==undefined) {
      $("#remarks").focus();
      this.swal('Info', 'Please Enter Remarks', 'info');
      return;
    } else {
      const pattern = /'/;
      if (pattern.test(this.remarks)) {
        $("#remarks").focus();
        this.swal('Error', 'Special character is not allowed', 'error');
        return;
      }
    }

    let date = new Date();
    let year = date.getFullYear(); //2023
    let prev = year + 1;//2024
    // alert(new Date('01-Sep-'+prev));
    // alert(new Date('31-Aug-'+year));
    //According the policy year the year is change  by Rajendra With Gyana Sir Dt-13-Nov-2023
    // if(date1<new Date('01-Sep-'+year) || date1>new Date('31-Aug-'+prev)) {
    //   this.swal('Info', 'Claim is not under current financial year', 'info');
    //   return;
    // }

    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to refund the balance amount '+this.formatter.format(this.balanceAmount),
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Refund It!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cardbalanceupdateserviceService.refundAmount(this.user.userId, this.claimDetails.MEMBERID, this.urnNo, this.balanceAmount, this.claimid, remarks).subscribe(
          (data: any) => {
            let resData = data;
            if (resData.status == 'Success') {
              this.swal('Success', data.message, 'success');
              localStorage.removeItem('actionData');
              this.route.navigate(['/application/claimprocessed']);
            }
            else if (resData.status == 'Failed') {
              this.swal('error', data.message, 'error');
            }
          }
        );
      }
    });
  }

  downloadAction(event: any, fileName: any, hCode: any, dateOfAdm: any) {
    let target = event.target;
    //console.log(target.nodeName);
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
  amount: any;
  claimAmout: any;
  actionRemarkId: any;
  remarks: any;
  myGroup = new FormGroup({
    remarks: new FormControl(),
  });

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  treatmentdetails() {
    // localStorage.setItem("click", "Y");
    // localStorage.setItem('urn', this.urnNo);
    // localStorage.setItem('token', this.jwtService.getJwtToken());
    // this.route.navigate([]).then((result) => {
    //   window.open(environment.routingUrl + '/treatmenthistory');
    // });
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
  clearEvent(){
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
  packagedetails() {
    // localStorage.setItem("click1", "Y");
    let urnNo = this.urnNo;
    let packagecode = this.packageCode;
    localStorage.setItem('urn', urnNo);
    localStorage.setItem('packagecode', packagecode);
    localStorage.setItem('token', this.jwtService.getJwtToken());
    this.route.navigate([]).then((result) => {
      window.open(environment.routingUrl + '/treatmenthistorypackage');
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
    this.actionRemarkId = id;
    // let id = $('#actionRemark').val();
    if (id == 1) {
      this.isQuery = true;
      this.isReject = true;
      this.isInvestigate = true;
      this.isRevert = true;
      this.isApproved = false;
      // $('#amount').val(this.backUpAmount);
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
      // $('#amount').val(this.backUpAmount);
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
  fileArray: any = [];
  downloadAllFile(dischargeSlip,additionaldoc,additionaldoc1,additionaldoc2){
    this.fileArray = [];
    if(dischargeSlip != null || dischargeSlip != undefined){
      let jsonObj = {
        'f': dischargeSlip,
        'h': this.claimDetails.HOSPITALCODE,
        'd': this.claimDetails.ACTUALDATEOFADMISSION
      }
      this.fileArray.push(jsonObj);
    }
    if(additionaldoc != null || additionaldoc != undefined){
      let jsonObj = {
        'f': additionaldoc,
        'h': this.claimDetails.HOSPITALCODE,
        'd': this.claimDetails.ACTUALDATEOFADMISSION
      }
      this.fileArray.push(jsonObj);
    }
    if(additionaldoc1 != null || additionaldoc1 != undefined){
      let jsonObj = {
        'f': additionaldoc1,
        'h': this.claimDetails.HOSPITALCODE,
        'd': this.claimDetails.ACTUALDATEOFADMISSION
      }
      this.fileArray.push(jsonObj);
    }
    if(additionaldoc2 != null || additionaldoc2 != undefined){
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
        let blob = new Blob([result],{ type: result.type});
        let url = window.URL.createObjectURL(blob);
        window.open(url);
      },
      (error) => {
        console.log(error);
      }
    );
  }


  files: any = [];
  viewAllDocument(dischargeSlip, additionDoc, additionalDoc1, additionalDoc2, preSurgery, postSurgery, patientPic, intraSurgery, specimenRemoval) {
    this.files = [];
    console.log("Inside View All Document");
    console.log("dischargeSlip: " + dischargeSlip);
    console.log("additionDoc: " + additionDoc);
    console.log("additionalDoc1: " + additionalDoc1);
    console.log("additionalDoc2: " + additionalDoc2);
    console.log("preSurgery: " + preSurgery);
    console.log("postSurgery: " + postSurgery);
    console.log("patientPic: " + patientPic);
    console.log("intraSurgery: " + intraSurgery);
    console.log("specimenRemoval: " + specimenRemoval);


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
    this.snoService.downloadAllDocuments(this.files).subscribe(data => {
      var result = data;
      let blob = new Blob([result],{ type: result.type});
      let url = window.URL.createObjectURL(blob);
      window.open(url);
    });
  }
  getDetails(transactionId, claimId,claimRaiseStatus,urn,packagecode) {
    if(claimRaiseStatus==1){
      let trnsId = transactionId;
      let clmId = claimId;
      if (clmId != null || clmId != undefined) {
        let state = {
          Urn:urn
        }
        localStorage.setItem("claimid", clmId);
        localStorage.setItem("trackingdetails",JSON.stringify(state));
        localStorage.setItem("token",this.jwtService.getJwtToken());
        this.route.navigate([]).then(result => { window.open(environment.routingUrl+'/trackingdetails'); });
      } else {
        localStorage.setItem("trnsId", trnsId);
        this.route.navigate(['/treatmentinfo']);
      }
    }
    if(claimRaiseStatus==0){
      let  state={
        txnid: transactionId,
        //  authcode:authorizedcode,
        //  hospitalcode:hospitalcode,
         urn:urn
     }
     localStorage.setItem("history",JSON.stringify(state));
     localStorage.setItem("token", this.jwtService.getJwtToken())
     this.route.navigate([]).then(result => { window.open(environment.routingUrl+'/dischargelistHistoryHospital'); });
    }
  }
  onAction(id: any, urn: any, packageCode: any,claimStatus:any) {
    let tempActionData = localStorage.getItem('actionData');
    localStorage.removeItem("submitStatus");
    if(claimStatus == 1){
      let state = {
        transactionId: id,
        flag: 'APRV',
        URN: urn,
        packageCode: packageCode,
      };
      // localStorage.setItem('treat', 'Y');
      localStorage.setItem('actionData', JSON.stringify(state));
      localStorage.setItem('treatmentAction','true');
      window.open(environment.routingUrl + '/application/snoapproval/action');
      window.onfocus = function () {
        localStorage.setItem('actionData', tempActionData);
        if (localStorage.getItem('submitStatus') == 'Y') {
          // localStorage.removeItem('submitStatus');
          window.location.reload();
        }
      }
    }
    if(claimStatus == 2){
      let state = {
        transactionId:id,
        URN:urn,
        packageCode:packageCode
      }
      // localStorage.setItem('treat', 'Y');
      localStorage.setItem("actionData",JSON.stringify(state));
      localStorage.setItem('treatmentAction','true');
      window.open(environment.routingUrl +'/application/cpdrejectedaction/action');
      window.onfocus = function () {
        localStorage.setItem('actionData', tempActionData);
        if (localStorage.getItem('submitStatus') == 'Y') {
          // localStorage.removeItem('submitStatus');
          window.location.reload();
        }
      }
    }
    if(claimStatus == 3){
      let state = {
        transactionId:id,
        URN:urn,
        packageCode:packageCode
      }
      localStorage.setItem("actionData",JSON.stringify(state));
      localStorage.setItem('treatmentAction','true');
      window.open(environment.routingUrl +'/application/NonComplianceQueryCPDToSNA/action');
      window.onfocus = function () {
        localStorage.setItem('actionData', tempActionData);
        if (localStorage.getItem('submitStatus') == 'Y') {
          window.location.reload();
        }
      }
    }
    if(claimStatus == 4){
      let state = {
        transactionId: id,
        flag: 'REAPRV',
        URN: urn,
        packageCode: packageCode,
      };
      // localStorage.setItem('treat', 'Y');
      localStorage.setItem('actionData', JSON.stringify(state));
      localStorage.setItem('treatmentAction','true');
      window.open( environment.routingUrl +'/application/snoreapproval/action');
      window.onfocus = function () {
        localStorage.setItem('actionData', tempActionData);
        if (localStorage.getItem('submitStatus') == 'Y') {
          // localStorage.removeItem('submitStatus');
          window.location.reload();
        }
      }
    }
    if(claimStatus == 7){
      let state = {
        transactionId: id,
        URN: urn,
        packageCode: packageCode,
      };
      localStorage.setItem('actionData', JSON.stringify(state));
      localStorage.setItem('treatmentAction','true');
      window.open( environment.routingUrl +'/application/unProcessedClaimList/action');
      window.onfocus = function () {
        localStorage.setItem('actionData', tempActionData);
        if (localStorage.getItem('submitStatus') == 'Y') {
          window.location.reload();
        }
      }
    }
    if(claimStatus == 9){
      let state = {
        transactionId: id,
        flag: 'DC',
        URN: urn,
        packageCode: packageCode,
      };
      localStorage.setItem('actionData', JSON.stringify(state));
      localStorage.setItem('treatmentAction','true');
      window.open( environment.routingUrl +'/application/dcCompliance/action');
      window.onfocus = function () {
        localStorage.setItem('actionData', tempActionData);
        if (localStorage.getItem('submitStatus') == 'Y') {
          window.location.reload();
        }
      }
    }
  }

}
