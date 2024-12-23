import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../header.service';
import Swal from 'sweetalert2';
import { PreauthService } from '../Services/preauth.service';
import { TreatmenthistoryperurnService } from '../Services/treatmenthistoryperurn.service';
import { SnoCLaimDetailsService } from '../Services/sno-claim-details.service';
import { JwtService } from 'src/app/services/jwt.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FormControl, FormGroup } from '@angular/forms';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-sna-view-preauth-details',
  templateUrl: './sna-view-preauth-details.component.html',
  styleUrls: ['./sna-view-preauth-details.component.scss'],
})
export class SnaViewPreauthDetailsComponent implements OnInit {
  data: any;
  user: any;
  keyword = 'remarks';
  constructor(
    public headerService: HeaderService,
    public preauthService: PreauthService,
    private treatmenthistoryperurn: TreatmenthistoryperurnService,
    public snoService: SnoCLaimDetailsService,
    private jwtService: JwtService,
    public route: Router,
    private sessionService: SessionStorageService
  ) { }

  ngOnInit(): void {
    this.headerService.setTitle('SNA Action Taken Details');
    this.data = JSON.parse(localStorage.getItem('preauthData'));
    this.user = this.sessionService.decryptSessionData("user");
    localStorage.removeItem('pkgdetailsid');
    this.getRemarks();
    this.getPreAuthDetails();
  }
  blockInfo: any;
  headInfoArray: any = [];
  implantInfoArray: any = [];
  balanceInfoArray: any = [];
  hospitalRemarkArray: any = [];
  snaRemarkArray: any = [];
  actionHistoryArray: any = [];
  ongoingArray: any = [];
  allPreauthReqArray: any = [];
  balanceInfo: any;
  urnNumber: any = '';
  hCode: any;
  latestdocArray: any = [];
  isQuery: boolean = false;
  isReject: boolean = false;
  isApproved: boolean = false;
  maxChars = 500;
  remarks: any;
  myGroup = new FormGroup({
    remarks: new FormControl(),
  });
  // approvedAmount:any;
  details = []

  getPreAuthDetails() {
    this.preauthService
      .getPreAutDetails(this.data.txnPckgDetailId, this.data.urnNo)
      .subscribe(
        (data: any) => {
          let resData = data;
          if (resData.status == 'success') {
            console.log(JSON.parse(resData.data));
            let responseData = JSON.parse(resData.data);
            this.blockInfo = responseData.blockInfoArray[0];
            this.hCode = this.blockInfo.hospitalCode;
            this.headInfoArray = responseData.headInfoArray;
            this.implantInfoArray = responseData.implantInfoArray;
            this.balanceInfoArray = responseData.balanceInfoArray;
            this.balanceInfo = this.balanceInfoArray[0];
            // this.approvedAmount = this.balanceInfo.totalPackageCost;
            this.hospitalRemarkArray = responseData.hospitalRemarkArray;
            this.snaRemarkArray = responseData.snaRemarkArray;
            this.actionHistoryArray = responseData.actionHistoryArray;
            this.ongoingArray = responseData.ongoingArray;
            this.latestdocArray = responseData.latestdocArray;
            this.allPreauthReqArray = responseData.allPreauthArray;
            if (this.ongoingArray.length != 0) {
              this.urnNumber = this.ongoingArray[0].urn;
            }
            let queryCount = Number(this.blockInfo.queryCount);
            if (queryCount == 2) {
              this.isQuery = true;
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
  trtData: any = [];
  getTreatMentHistory() {
    this.treatmenthistoryperurn
      .searchbyUrnSnaUser(this.data.urnNo, this.user.userId)
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
  oldTrtData: any = [];
  getOldTreatMentHistory() {
    let urno =
    // this.data.urnNo;
    this.data.txnPckgDetailId
    this.treatmenthistoryperurn
      .oldsearchbyUrnSnaUser(urno, this.user.userId)
      .subscribe(
        (data) => {
          this.oldTrtData = data;
          console.log(this.oldTrtData)
        },
        (error) => {
          console.log(error);
          this.swal('', 'Something went wrong.', 'error');
        }
      );
  }
  allremarks: any = [];
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
  actionRemarkId: any;
  clearEvent() {
    this.actionRemarkId = '';
    this.description = '';
  }
  description: any;
  getId(item) {
    let id = item.id;
    this.actionRemarkId = id;
    this.remarks = item.remarks;
    if (id == 1) {
      this.isQuery = true;
      this.isReject = true;
      this.isApproved = false;
      // $('#amount').val(this.backUpAmount);
      $('#amount').prop('disabled', false);
    } else if (id == 58) {
      this.isQuery = true;
      this.isApproved = true;
      this.isReject = false;
      $('#amount').val(0);
      $('#amount').prop('disabled', true);
    } else {
      this.isApproved = false;
      let queryCount = Number(this.blockInfo.queryCount);
      if (queryCount == 2) {
        this.isQuery = true;
      }else{
        this.isQuery = false;
      }
      this.isReject = false;
      // $('#amount').val(this.backUpAmount);
      $('#amount').prop('disabled', false);
    }
  }

  getDetails(transactionId, claimId, claimRaiseStatus, urn, packagecode) {
    // if(claimRaiseStatus==1){
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
      // }
    }
  }
  download(pdfName, dateOfAdm) {
    let hCode = this.hCode;
    let img = this.preauthService.downloadFileBySNA(pdfName, hCode, dateOfAdm);
    window.open(img, '_blank');
  }
  actionType: any;
  checkAmount() {
    let amountValue = $('#amount').val();
    let amount = Number(amountValue);
    let totalPackageCost = Number(this.balanceInfo.totalPackageCost);
    if (amount < totalPackageCost) {
      let lessAmount = totalPackageCost - amount;
      this.swal(
        '',
        'You are Entering ₹ ' + lessAmount + ' less amount than Hospital block Amount.',
        'info'
      );
    }
  }
  submit(event) {
    this.description = $('#description').val();
    let amountValue = $('#amount').val();
    let amount = Number(amountValue);
    let totalPackageCost = Number(this.balanceInfo.totalPackageCost);
    if (
      this.actionRemarkId == 0 ||
      this.actionRemarkId == null ||
      this.actionRemarkId == '' ||
      this.actionRemarkId == undefined
    ) {
      this.swal('', ' Please Select Remark', 'error');
      return;
    }
    if (amount > totalPackageCost) {
      this.swal(
        '',
        ' Approved amount should be less than total package cost.',
        'error'
      );
      return;
    }
    if (this.actionRemarkId == 57) {
      if (this.description == '' || this.description == null) {
        this.swal('', 'Description should not be left blank', 'error');
        return;
      }
    }
    if (amountValue == '' || amountValue == null) {
      this.swal('', 'Amount should not be left blank', 'error');
      // $('#amount').val(this.backUpAmount);
      return;
    }
    if (this.actionRemarkId == 1) {
      if (amount == 0) {
        this.swal('', 'Amount should not be zero', 'error');
        // $('#amount').val(this.backUpAmount);
        return;
      }
    }
    if (event.target.id == 'Approve') {
      this.actionType = 1;
    }
    if (event.target.id == 'Reject') {
      this.actionType = 2;
      amount = 0;
    }
    if (event.target.id == 'Query') {
      this.actionType = 3;
      amount = 0;
      let queryCount = Number(this.blockInfo.queryCount);
      if (queryCount == 2) {
        this.swal("","Query limit exist.","info")
        return;
      }
    }

    let requestData = {
      actionType: this.actionType,
      txnPackageDetailId: this.data.txnPckgDetailId,
      userId: this.user.userId,
      amount: amount,
      remarks: this.remarks,
      description: this.description,
      actionRemarksId: this.actionRemarkId,
      id: this.blockInfo.id,
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
        this.preauthService.updatePreAuthorization(requestData).subscribe(
          (data: any) => {
            let resData = data;
            console.log(resData);
            if (resData.status == 'success') {
              if (event.target.id == 'Approve') {
                this.swal('Success', resData.data.message, 'success');
              } else if (event.target.id == 'Query') {
                this.swal('Success', resData.data.message, 'info');
              } else if (event.target.id == 'Reject') {
                this.swal('Success', resData.data.message, 'success');
              }
              this.route.navigate(['/application/preauth']);
              localStorage.removeItem('preauthData');
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
    });
  }
  approved_Amount(event: KeyboardEvent) {
    const pattern = /^[0-9\b]+$/;
    //var regex = new RegExp("^[A-Za-z0-9.,-\\s]+$");
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  keyPress(event: KeyboardEvent) {
    const pattern = /'/;
    const inputChar = String.fromCharCode(event.charCode);
    if (pattern.test(inputChar)) {
      // invalid character, prevent input
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
  swal2(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      html: text,
    });
  }
  getCaseDetails(id){
    localStorage.setItem('pkgdetailsid', id);
    this.route.navigate([]).then((result) => {
      window.open(environment.routingUrl + '/preauthcasedetails');
    });
  }

  memberid:any;
  hospitalcodedata:any;
  urn:any;
  posdetails:any=[];
  otpdetaiils:any=[];
  irisdetails:any=[];
  getAuthenticationdetails(type: any) {
    this.memberid = this.blockInfo?.memberid;
    this.urn = this.blockInfo?.urn;
    this.hospitalcodedata = this.blockInfo?.hospitalCode;
    this.snoService.getauthentocationdetails(this.urn, this.memberid, type, this.hospitalcodedata,this.blockInfo.caseNo).subscribe(
      (data: any) => {
        let resData = data;
        console.log(resData);
        if (resData.status == 'success') {
          let details = resData.data;
          details = JSON.parse(details);
          this.posdetails = details.posdetails;
          this.otpdetaiils = details.otpdetaiils;
          this.irisdetails = details.irisdetails;
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
}
