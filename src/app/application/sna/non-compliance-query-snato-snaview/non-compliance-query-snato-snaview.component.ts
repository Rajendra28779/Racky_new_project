import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { PendingService } from '../../pending.service';
import { SnoCLaimDetailsService } from '../../Services/sno-claim-details.service';
import { TreatmenthistoryperurnService } from '../../Services/treatmenthistoryperurn.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-non-compliance-query-snato-snaview',
  templateUrl: './non-compliance-query-snato-snaview.component.html',
  styleUrls: ['./non-compliance-query-snato-snaview.component.scss']
})
export class NonComplianceQuerySNAToSNAViewComponent implements OnInit {
  childmessage: any;
  claimDetails: any;
  // allremarks: any;
  txnId: any;
  // fileUrl: any;
  claimLog: Array<any> = [];
  pendingAt: any;
  claimStatus: any;
  user: any;
  // routeFlag: any;
  urnNo: any;
  preAuth: any;
  // packageCode: any;
  maxChars = 500;
  check: boolean = false;
  isQuery: boolean = false;
  // isReject: boolean = false;
  // isInvestigate: boolean = false;
  // isRevert: boolean = false;
  // isApproved: boolean = false;
  data: any;
  // Redirection: any;
  keyword= 'remarks';
  trtData: any = [];
  oldTrtData: any = [];
  // isApprove: boolean = true;
  constructor(
    private jwtService: JwtService,
    public headerService: HeaderService,
    public route: Router,
    public snoService: SnoCLaimDetailsService,
    private pendingService: PendingService,
    private treatmenthistoryperurn: TreatmenthistoryperurnService,
    private sessionService: SessionStorageService
  ) {  }

  ngOnInit(): void {
    this.data = JSON.parse(localStorage.getItem('actionData1'));
    this.txnId = this.data.transactionId;
    // this.routeFlag = this.data.flag;
    this.urnNo = this.data.URN;
    // this.packageCode = this.data.packageCode;
    // this.Redirection = this.data.Redirection;
    this.headerService.setTitle('Non Compliance Of Query SNA Approval');
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
    // this.getRemarks();
    this.getSnoClaimDetailsById();
    this.user = this.sessionService.decryptSessionData("user");
    $('#appealDisposal').hide();
  }
  getTreatMentHistory() {
    this.treatmenthistoryperurn.searchbyUrnSnaUser(this.urnNo,this.user.userId).subscribe(data => {
      this.trtData = data;
      if (this.trtData.length > 3) {
        document.getElementById('treatmentHistory').classList.add('treatment-history-table-class', 'treatment-history-table-head-class');

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
      this.oldTrtData = data;
      if (this.oldTrtData.length > 3) {
        document.getElementById('oldTreatmentHistory').classList.add('treatment-history-table-class', 'treatment-history-table-head-class');

      }
    },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      });
  }
  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }
  multiPackList: any = [];
  multiFlag: boolean = false;
  backUpAmount: any;
  getSnoClaimDetailsById() {
    this.pendingService.getMultiPackageNonCompliance(this.txnId).subscribe(
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
          }else {
            $('#procedureNameId').text(procedureName);
          }
          this.claimLog = details.actionLog;
          let multiPkg = details.packageBlock;
          // this.backUpAmount = this.claimDetails.TOTALAMOUNTBLOCKED;
          // if (
          //   details.actionData.pendingat == 3 &&
          //   details.actionData.claimstatus == 1
          // ) {
          //   this.isApproved = true;
          // }
          // else {
          //   this.isApproved = false;
          // }

          // if (
          //   details.actionData.pendingat == 3 &&
          //   details.actionData.claimstatus == 2
          // ) {
          //   this.isReject = true;
          // } else {
          //   this.isReject = false;
          // }

          multiPkg.forEach((item) => {
            if (item.transctionId != this.txnId) {
              this.multiPackList.push(item);
            }
          });
          if (this.multiPackList.length > 0) {
            this.multiFlag = true;
          }
          this.preAuth = details.preAuthHist;
          if (this.preAuth.length != 0) {
            this.check = true;
          }
          this.getTreatMentHistory();
          this.getOldTreatMentHistory();
          this.getTreatmentHistoryoverpackgae();
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
  // getRemarks() {
  //   this.snoService.getRemarks().subscribe(
  //     (data1: any) => {
  //       let remarkData = data1;
  //       this.allremarks = remarkData;
  //     },
  //     (error) => {
  //     }
  //   );
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
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  // treatmentdetails() {
  //   localStorage.setItem('urn', this.urnNo);
  //   localStorage.setItem('transactionDetailsId', this.txnId);
  //   localStorage.setItem('userId', this.user.userId);
  //   localStorage.setItem('token', this.jwtService.getJwtToken());
  //   this.route.navigate([]).then((result) => {
  //     window.open(environment.routingUrl + '/treatmenthistoryforsna');
  //   });
  // }
  preAuthLogDetail(urn: any, authCode: any, hosCode: any) {
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
  // packagedetails() {
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
  files: any = [];
  viewAllDocument(dischargeSlip, additionDoc, additionalDoc1, additionalDoc2, preSurgery, postSurgery, patientPic, intraSurgery, specimenRemoval) {
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
    this.snoService.downloadAllDocuments(this.files).subscribe(data => {
      var result = data;
      let blob = new Blob([result],{ type: result.type});
      let url = window.URL.createObjectURL(blob);
      window.open(url);
    });
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
  getDetails(transactionId, claimId,claimRaiseStatus,urn) {
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

  showProcedureName(){
    $('#procedureNameId').text(this.claimDetails.procedureName1);
    $('#showMoreId').empty()
    $('#showMoreId1').append('<div style="cursor: pointer; color: #1d89c9">Show Less</div>');
  }

  hideProcedureName(){
    let procedureName = this.claimDetails.procedureName1;
    if (procedureName.length > 30) {
      $('#procedureNameId').text(procedureName.substring(0, 30) + '...');
      $('#showMoreId1').empty()
      $('#showMoreId').empty();
      $('#showMoreId').append('<span style="cursor: pointer; color: #1d89c9">Show More</span>');
    }
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
}


