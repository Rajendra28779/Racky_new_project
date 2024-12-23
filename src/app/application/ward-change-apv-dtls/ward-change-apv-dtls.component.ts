import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { SnoCLaimDetailsService } from '../Services/sno-claim-details.service';
import { PreauthService } from '../Services/preauth.service';
import { TreatmenthistoryperurnService } from '../Services/treatmenthistoryperurn.service';
import { HeaderService } from '../header.service';
declare let $: any;

@Component({
  selector: 'app-ward-change-apv-dtls',
  templateUrl: './ward-change-apv-dtls.component.html',
  styleUrls: ['./ward-change-apv-dtls.component.scss']
})
export class WardChangeApvDtlsComponent implements OnInit {
  blockInfo: any;
  headInfoArray: any = [];
  implantInfoArray: any = [];
  latestdocArray: any = [];
  requestHistoryArray: any = [];
  trtData: any = [];
  caseHistoryArray: any = [];
  wardHistoryArray: any = [];
  pkgDetailsData: any = [];
  overAllDetailsData: any = [];
  malefund: boolean = false;
  femalefund: boolean = false;
  balanceInfo: any;
  insufficientfund: any;
  maxChars = 500;
  textApprovedamount: Number = 0;
  data: any;
  user: any;
  details = [];
  extsnRequestedDate:any;
  dateMin: any;
  dateMax: any;
  actionType: any;
  noOfDays:any;
  action:any;


  constructor(
    public snoService: SnoCLaimDetailsService,
    public preauthService: PreauthService,
    private treatmenthistoryperurn: TreatmenthistoryperurnService,
    private sessionService: SessionStorageService,
    public headerService: HeaderService,
    public route: Router,
  ) {}


  ngOnInit(): void {
    this.headerService.setTitle('Ward Change Details');
    this.headerService.isBack(false);
    this.data = JSON.parse(localStorage.getItem('extsndata'));
    this.user = this.sessionService.decryptSessionData('user');
    this.action=this.data.action;
    this.getRemarks();
    this.getExtensionOfStayDetails();
  }

  submit(event) {
    this.description = $('#description').val();
    if (
      this.actionRemarkId == 0 ||
      this.actionRemarkId == null ||
      this.actionRemarkId == '' ||
      this.actionRemarkId == undefined
    ) {
      this.swal('', ' Please Select Remark', 'error');
      return;
    }
    if (this.description == '' || this.description == null) {
      this.swal('', 'Description should not be left blank', 'error');
      return;
    }

    if (event.target.id == 'Approve') {
      this.actionType = 2;
    }
    if (event.target.id == 'Reject') {
      this.actionType = 1;
    }

    let requestData = {
      actionType: this.actionType,
      txnPackageDetailId: this.data.wardchangeId,
      userId: this.user.userId,
      description: this.description,
      actionRemarksId: this.actionRemarkId,
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
        this.preauthService.updatetwardchangeaprv(requestData).subscribe(
          (data: any) => {
            let resData = data;
            if (resData.status == "200") {
              this.swal('Success', resData.message, 'success');
              this.route.navigate(['/application/wardchangerqstview']);
              localStorage.removeItem('preauthData');
            } else {
              this.swal('', 'Something went wrong.', 'error');
            }
          },
          (error) => {console.log(error);
            this.swal('', 'Something went wrong.', 'error');
          }
        );
      }
    });
  }
  keyPress(event: KeyboardEvent) {
    const pattern = /'/;
    const inputChar = String.fromCharCode(event.charCode);
    if (pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  allremarks: any = [];
  keyword = 'remarks';
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
    $('#description').val('');
    this.description = '';
    this.isApproved = false;
    this.isReject = false;
  }

  description: any;
  isReject: boolean = false;
  isApproved: boolean = false;
  remarks: any;
  getId(item) {
    this.actionRemarkId = item.id;
    this.remarks = item.remarks;
    if (this.actionRemarkId == 1) {
      this.isReject = true;
      this.isApproved = false;
    } else if (this.actionRemarkId == 58) {
      this.isApproved = true;
      this.isReject = false;
    } else {
      this.isApproved = false;
      this.isReject = false;
    }
  }

  hCode: any;
  getExtensionOfStayDetails() {
    this.preauthService
      .getWardchanegeDetails(this.data.wardchangeId)
      .subscribe(
        (data: any) => {
          let resData = data;
          if (resData.status == 'success') {
            let responseData = JSON.parse(resData.data);
            this.blockInfo = responseData.blockInfoArray[0];
            this.hCode = this.blockInfo.hospitalCode;
            this.headInfoArray = responseData.headInfoArray;
            this.implantInfoArray = responseData.implantInfoArray;
            this.caseHistoryArray = responseData.caseHistoryArray;
            this.wardHistoryArray = responseData.wardHistoryArray;
            this.requestHistoryArray = responseData.requestHistoryArray;
            this.latestdocArray = responseData.latestdocArray;
            this.textApprovedamount = this.blockInfo.totalAmount;
            this.noOfDays = this.blockInfo.noOfDays;
            this.extsnRequestedDate = this.blockInfo.extsnRequestedDate;
            this.getTreatMentHistory();
            this.getOldTreatMentHistory();
          } else {
            this.swal('', 'Something went wrong.', 'error');
          }
        },
        (error) => {console.log(error);
          this.swal('', 'Something went wrong.', 'error');
        }
      );
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  getTreatMentHistory() {
    this.treatmenthistoryperurn
      .searchbyUrnSnaUser(this.data.urnNo, this.user.userId)
      .subscribe(
        (data) => {
          this.trtData = data;
        },
        (error) => {console.log(error);
          this.swal('', 'Something went wrong.', 'error');
        }
      );
  }
  oldTrtData: any = [];
  getOldTreatMentHistory() {
    let urno = this.data.urnNo;
    this.treatmenthistoryperurn
      .oldsearchbyUrnSnaUser(urno, this.user.userId)
      .subscribe(
        (data) => {
          this.oldTrtData = data;
        },
        (error) => {console.log(error);
          this.swal('', 'Something went wrong.', 'error');
        }
      );
  }

  getCaseDetails(id) {
    localStorage.setItem('pkgdetailsid', id);
    this.route.navigate([]).then((result) => {
      window.open(environment.routingUrl + '/preauthcasedetails');
    });
  }

  getPackageDetails(packageCode, subPackageCode, procedureCode) {
    this.snoService
      .getPackageDetails(
        packageCode,
        subPackageCode,
        procedureCode,
        this.blockInfo.hospitalCode
      )
      .subscribe(
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
        (error) => {console.log(error);
          this.swal('', 'Something went wrong.', 'error');
        }
      );
  }

  download(pdfName, dateOfAdm) {
    let hCode = this.hCode;
    let img = this.preauthService.downloadFileBySNA(pdfName, hCode, dateOfAdm);
    window.open(img, '_blank');
  }
  posdetails: any = [];
  otpdetaiils: any = [];
  irisdetails: any = [];
  facedetails: any = [];
  memberid:any
  urn:any
  hospitalcodedata:any;
  getAuthenticationdetails(type: any) {
    this.memberid = this.blockInfo?.memberId;
    this.urn = this.blockInfo?.urn;
    this.hospitalcodedata = this.blockInfo?.hospitalCode;
    this.snoService
      .getauthentocationdetails(
        this.urn,
        this.memberid,
        type,
        this.hospitalcodedata,
        this.blockInfo.caseNo
      )
      .subscribe(
        (data: any) => {
          let resData = data;
          if (resData.status == 'success') {
            let details = resData.data;
            details = JSON.parse(details);
            this.posdetails = details.posdetails;
            this.otpdetaiils = details.otpdetaiils;
            this.irisdetails = details.irisdetails;
            this.facedetails = details.facedetails;

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
