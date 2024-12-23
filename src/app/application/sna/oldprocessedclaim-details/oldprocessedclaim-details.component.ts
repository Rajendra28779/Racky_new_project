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
  selector: 'app-oldprocessedclaim-details',
  templateUrl: './oldprocessedclaim-details.component.html',
  styleUrls: ['./oldprocessedclaim-details.component.scss']
})
export class OldprocessedclaimDetailsComponent implements OnInit {
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
  keyword= 'remarks';
  treat: string;
  treatment: string;
  trtData: any = [];
  oldTrtData: any = [];
  transId: any;
  constructor(
    private jwtService: JwtService,
    public headerService: HeaderService,
    public route: Router,
    public snoService: SnoCLaimDetailsService,
    private treatmenthistoryperurn: TreatmenthistoryperurnService,
    private sessionService: SessionStorageService
  ) {
  }

  ngOnInit(): void {
    this.user = this.sessionService.decryptSessionData("user");
    this.data = JSON.parse(localStorage.getItem('actionData'));
    this.treat=localStorage.getItem('treat');
    this.treatment=localStorage.getItem('treatment');
    this.txnId = this.data.transactionId;
    this.routeFlag = this.data.flag;
    this.urnNo = this.data.URN;
    this.transId = this.data.transId;
    this.headerService.setTitle('Old Processed Claim');
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
    console.log(this.txnId);
    this.snoService.getOldClaimDetailsById(this.txnId).subscribe(
      (data: any) => {
        let resData = data;
        if (resData.status == 'success') {
          let details = JSON.parse(resData.details);
          this.claimDetails = details.actionData;
          console.log(this.claimDetails);
          this.claimLog = details.actionLog;
          // let multiPkg = details.packageBlock;
          // multiPkg.forEach((item) => {
          //   if (item.transctionId != this.txnId) {
          //     this.multiPackList.push(item);
          //   }
          // });
          // if (this.multiPackList.length > 0) {
          //   this.multiFlag = true;
          // }
          this.preAuth = details.preAuthHist;
          console.log(this.preAuth);
          if (this.preAuth.length != 0) {
            this.check = true;
          }
          // this.getTreatMentHistory();
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
        for (let i = 0; i < remarkData.length; i++) {
          if(remarkData[i].id==1 || remarkData[i].id==58){
            remarkData.splice(i,1);
          }
        }
        this.allremarks = remarkData;
        console.log(this.allremarks);
      },
      (error) => {
        console.log(error);
      }
    );
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
            let blob = new Blob([result],{ type: result.type});
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
  amount: any;
  claimAmout: any;
  actionRemarkId: any;
  submitDetails(event: any) {
    this.remarks = $('#remarks').val();
    let userId = this.user.userId;
    let claimId=this.transId;
    this.claimAmout = Number(this.claimDetails.TOTALAMOUNTBLOCKED);
    let urnNo = this.claimDetails.URN;
    let statusflag =0;
    if (event.target.id == 'Query') {
      this.pendingAt = 0;
      this.claimStatus = 4;
      this.amount = '0';
    }
    if (this.actionRemarkId == 0 || this.actionRemarkId == null ||this.actionRemarkId==''|| this.actionRemarkId==undefined) {
      this.swal('', ' Please Select Remark', 'error');
      return;
    }
    if (this.actionRemarkId == 57) {
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
      statusflag: statusflag,
    };
    console.log(data);
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
        this.snoService.saveOldClaimDetails(data).subscribe(
          (data: any) => {
            if (data.status == 'Success') {
              localStorage.setItem('submitStatus', 'Y')
              this.swal('Success', data.message, 'success');
              localStorage.removeItem('actionData');
              this.route.navigate(['/application/OldProcessedClaimList']);
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
  clearEvent(){
    this.actionRemarkId = '';
  }
  getTreatMentHistory() {
    this.treatmenthistoryperurn.searchbyUrnSnaUser(this.urnNo,this.user.userId).subscribe(data => {
      this.trtData = data;
      if (this.trtData.length > 3) {
        document.getElementById('treatmentTable').classList.add('treatment-history-table-class', 'treatment-history-table-head-class');
      }
      console.log(this.trtData);
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
      console.log(this.oldTrtData);
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
    // let id = $('#actionRemark').val();
    if (id == 1) {
      this.isQuery = true;
      this.isReject = true;
      this.isInvestigate = true;
      this.isApproved = false;
      // $('#amount').val(this.backUpAmount);
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
      // $('#amount').val(this.backUpAmount);
      $('#amount').prop('disabled', false);
    }
  }
  keyPress(event: KeyboardEvent) {
    // const pattern = /^[A-Za-z0-9.,-_ \\s]+$/;
    // const pattern = /^[A-Za-z0-9.,#%<>()-_ \\s]+$/;
    const pattern = /'/;
    //var regex = new RegExp("^[A-Za-z0-9.,-\\s]+$");
    const inputChar = String.fromCharCode(event.charCode);
    if (pattern.test(inputChar)) {
      // if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  files: any = [];
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
        urn:urn
      }
      localStorage.setItem("history",JSON.stringify(state));
      localStorage.setItem("token", this.jwtService.getJwtToken())
      this.route.navigate([]).then(result => { window.open(environment.routingUrl+'/dischargelistHistoryHospital'); });
    }

  }

}
