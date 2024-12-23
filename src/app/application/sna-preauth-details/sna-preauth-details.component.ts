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
// import * as ECT from '@whoicd/icd11ect';
import { ICDSharedServices } from 'src/app/services/ICDSharedServices';
import { CurrencyPipe } from '@angular/common';
import { SessionStorageService } from 'src/app/services/session-storage.service';
@Component({
  selector: 'app-sna-preauth-details',
  templateUrl: './sna-preauth-details.component.html',
  styleUrls: ['./sna-preauth-details.component.scss'],
})
export class SnaPreauthDetailsComponent implements OnInit {
  data: any;
  totalfemalecost: any = 0;
  user: any;
  keyword = 'remarks';
  memberid: any;
  hospitalcodedata: any;
  urn: any;
  posdetails: any = [];
  otpdetaiils: any = [];
  irisdetails: any = [];
  facedetails: any = [];
  gender: any;
  insufficientfund: any;
  finalIcdObj: any;
  malefund: boolean = false;
  femalefund: boolean = false;
  isHedModalOpen = false;
  isimplantModalOpen = false;

  constructor(
    public headerService: HeaderService,
    public preauthService: PreauthService,
    private treatmenthistoryperurn: TreatmenthistoryperurnService,
    public snoService: SnoCLaimDetailsService,
    private jwtService: JwtService,
    public route: Router,
    private msgService: ICDSharedServices,
    private sessionService: SessionStorageService
  ) { }

  ngOnInit(): void {
    this.headerService.setTitle('Pre-auth Details');
    this.data = JSON.parse(localStorage.getItem('preauthData'));
    this.user = this.sessionService.decryptSessionData("user");
    localStorage.removeItem('pkgdetailsid');
    this.getRemarks();
    this.getPreAuthDetails();
    this.msgService.subsVar = this.msgService.
      invokeFirstComponentFunction.subscribe((data) => {
        this.finalIcdObj = data.icdData;
        console.log(this.finalIcdObj);
      });
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
  approvedAmount: any;
  details = [];
  ictDetailsArray: any = [];
  ictSubDetailsArray: any = [];

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
            this.approvedAmount = this.balanceInfo.totalPackageCost;
            this.hospitalRemarkArray = responseData.hospitalRemarkArray;
            this.snaRemarkArray = responseData.snaRemarkArray;
            this.actionHistoryArray = responseData.actionHistoryArray;
            this.ongoingArray = responseData.ongoingArray;
            this.latestdocArray = responseData.latestdocArray;
            this.allPreauthReqArray = responseData.allPreauthArray;
            this.ictDetailsArray = responseData.ictDetailsArray;
            this.ictSubDetailsArray = responseData.ictSubDetailsArray;
            let icdResponse = {
              ictDetailsArray: this.ictDetailsArray,
              ictSubDetailsArray: this.ictSubDetailsArray
            }
            this.msgService.setMessage(icdResponse);
            if (this.ongoingArray.length != 0) {
              this.urnNumber = this.ongoingArray[0].urn;
            }
            let queryCount = Number(this.blockInfo.queryCount);
            if (queryCount == 2) {
              this.isQuery = true;
            }
            console.log('len: ' + this.allPreauthReqArray.length);
            this.getTreatMentHistory();
            this.getOldTreatMentHistory();
            this.getindufficientbalance();
            this.getcost();
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
    let urno = this.data.urnNo;
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
      $('#amount').val(this.textApprovedamount.toString());
      $('#amount').prop('disabled', true);
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
      } else {
        this.isQuery = false;
      }
      this.isReject = false;
      // $('#amount').val(this.backUpAmount);
      $('#amount').prop('disabled', true);
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
  onAmountChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = parseFloat(inputElement.value) || 0; // Parse and default to 0 if invalid
    const originalAmount = parseFloat(this.finalpackagecost) || 0; // Parse and default to 0 if invalid

    if (inputValue <= 0 || inputValue > originalAmount) {
      // Determine error message based on the condition
      const errorMessage =
        inputValue <= 0
          ? 'Amount cannot be 0. Please enter a valid value.'
          : `Entered amount cannot be greater than the Ward Cost / Package Cost (${originalAmount}).`;

      // Show swal with the determined message
      this.swal('Invalid Amount', errorMessage, 'error');

      // Reset the input to the original amount
      inputElement.value = originalAmount.toString();

      // Recalculate the approved amount after resetting the input value
      this.list[0].totalwardcost = originalAmount; // Ensure the model reflects the reset value
      this.calculateApprovedAmount();
      return; // Exit early to avoid further processing
    }

    // Update the model with the valid value
    this.list[0].totalwardcost = inputValue;

    // Recalculate the approved amount for valid input
    this.calculateApprovedAmount();
  }


  wardpackAmount: any;
  submit(event) {
    this.description = $('#description').val();
    let amountValue = $('#amount').val();
    this.wardpackAmount = $('#wardAmount').val();
    let packageCost = $('#packageCost').val();
    let wardCost = $('#wardCost').val();

    if (packageCost != '0') {
      this.wardpackAmount = packageCost;
    } else if (wardCost != '0') {
      this.wardpackAmount = wardCost;
    }
    let amount = Number(amountValue);
    if (isNaN(amount)) {
      this.swal('', ' Please Enter valid amount.', 'error');
      return;
    }
    if (this.actionRemarkId == 0 || this.actionRemarkId == null || this.actionRemarkId == '' || this.actionRemarkId == undefined) {
      this.swal('', ' Please Select Remark', 'error');
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
      $('#amount').val(Number(this.textApprovedamount));
      return;
    }
    if (event.target.id == 'Approve') {
      if (amount == 0) {
        this.swal('', 'Amount should not be zero', 'error');
        $('#amount').val(Number(this.textApprovedamount));
        return;
      }
    }
    let totalPackageCost = Number(this.balanceInfo.totalPackageCost);
    let familyfundformale = Number(this.balanceInfo?.familyFund);
    let familyfundforfemale = Number(this.balanceInfo?.familyFund) + Number(this.balanceInfo?.femaleFund);
    // if (this.insufficientfund != 0 && this.gender == 'MALE') {
    //   if (amount > familyfundformale) {
    //     this.swal('', 'Approved Amount Can Not Be Approved More Than' + ' ' + familyfundformale, 'error');
    //     return;
    //   }
    // } else if (this.insufficientfund != 0 && this.gender == 'FEMALE') {
    //   if (amount > totalPackageCost) {
    //     this.swal('', 'Approved Amount Can Not Be Approved More Than' + ' ' + totalPackageCost, 'error');
    //     return;
    //   } else if (amount > familyfundforfemale) {
    //     this.swal('', 'Approved Amount Can Not Be Approved More Than' + ' ' + familyfundforfemale, 'error');
    //     return;
    //   }
    // } else if (this.insufficientfund === 0 && this.gender == 'MALE') {
    //   if (amount > totalPackageCost) {
    //     this.swal('', 'Approved Amount Can Not Be Approved More Than' + ' ' + totalPackageCost, 'error');
    //     return;
    //   }
    // } else if (this.insufficientfund === 0 && this.gender == 'FEMALE') {
    //   if (amount > totalPackageCost) {
    //     this.swal('', 'Approved Amount Can Not Be Approved More Than' + ' ' + totalPackageCost, 'error');
    //     return;
    //   } else if (amount > familyfundforfemale) {
    //     this.swal('', 'Approved Amount Can Not Be Approved More Than' + ' ' + familyfundforfemale, 'error');
    //     return;
    //   }
    // }

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
        this.swal('', 'Query limit exist.', 'info');
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
      icdFlag: this.finalIcdObj.flag,
      icdFinalData: this.finalIcdObj.icdFinalAry,
      wardpackagecost: this.wardpackAmount,
      hedamount: this.hedUpdatedList,
      implantamount: this.implantUpdatedList
    };
    if (this.actionType === 1 && event.target.id == 'Approve' && amount > familyfundformale && this.gender == 'MALE') {
      Swal.fire({
        title: `<span class="swal2-title-lg">The Available Fund Is <span style="color: red;">${familyfundformale}</span> And The Approved Amount Chosen Is <span style="color: red;">${totalPackageCost}</span>. Do You Want To Proceed?</span>`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
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
        } else {
          console.log("Choosen No");
        }
      });
    } else if (this.actionType === 1 && event.target.id == 'Approve' && amount > familyfundforfemale && this.gender == 'FEMALE') {
      Swal.fire({
        title: `<span class="swal2-title-lg">The Available Fund Is <span style="color: red;">${familyfundforfemale}</span> And The Approved Amount Chosen Is <span style="color: red;">${totalPackageCost}</span>. Do You Want To Proceed?</span>`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
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

        } else {
          console.log("Choosen No");
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
  }
  approved_Amount(event: KeyboardEvent) {
    const pattern = /^[0-9\b]+$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  keyPress(event: KeyboardEvent) {
    const pattern = /'/;
    const inputChar = String.fromCharCode(event.charCode);
    if (pattern.test(inputChar)) {
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
  getCaseDetails(id) {
    localStorage.setItem('pkgdetailsid', id);
    this.route.navigate([]).then((result) => {
      window.open(environment.routingUrl + '/preauthcasedetails');
    });
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
  pkgDetailsData: any = [];
  overAllDetailsData: any = [];
  // modalShow:boolean =false;
  getPackageDetails(packageCode, subPackageCode, procedureCode) {
    console.log(
      packageCode,
      subPackageCode,
      procedureCode,
      this.blockInfo.hospitalCode
    );
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
          console.log(resData);
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

  getAuthenticationdetails(type: any) {
    this.memberid = this.blockInfo?.memberid;
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
          console.log(resData);
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
  totalbance: Number = 0;
  getindufficientbalance() {
    this.gender = this.blockInfo?.gender;
    this.insufficientfund = 0;
    if (this.gender == 'FEMALE') {
      this.femalefund = true;
      this.totalbance =
        Number(this.balanceInfo?.familyFund) +
        Number(this.balanceInfo?.femaleFund);
      this.insufficientfund =
        Number(this.balanceInfo?.totalPackageCost) - Number(this.totalbance);
      if (this.insufficientfund <= 0) {
        this.insufficientfund = 0;
      } else {
        this.insufficientfund;
      }
    } else if (this.gender == 'MALE') {
      this.malefund = true;
      this.insufficientfund =
        Number(this.balanceInfo?.totalPackageCost) -
        Number(this.balanceInfo?.familyFund);
      if (this.insufficientfund <= 0) {
        this.insufficientfund = 0;
      } else {
        this.insufficientfund;
      }
    }
    console.log('amount: ' + this.insufficientfund);
    this.amountdetails();
  }
  //convert number to currency
  convertCurrency(amount: any) {
    var formatter = new CurrencyPipe('en-US');
    amount = formatter.transform(amount, '', '');
    return amount;
  }
  textApprovedamount: Number = 0;
  amountdetails() {
    this.textApprovedamount = 0;
    if (this.insufficientfund === 0 && this.gender == 'MALE') {
      this.textApprovedamount = Number(this.balanceInfo?.totalPackageCost);
    } else if (this.insufficientfund === 0 && this.gender == 'FEMALE') {
      this.textApprovedamount = Number(this.balanceInfo?.totalPackageCost);
    } else if (this.insufficientfund != 0 && this.gender == 'MALE') {
      this.textApprovedamount = Number(this.balanceInfo?.familyFund);
    } else if (this.insufficientfund != 0 && this.gender == 'FEMALE') {
      this.textApprovedamount = Number(this.balanceInfo?.totalPackageCost);
    }
  }


  selectedLabel: string = '';
  actioncode: any;
  hedlist: any = [];
  implantList: any = [];
  // Open modal and set the selected label
  openModalhedcost(label: string): void {
    this.selectedLabel = label;
    this.actioncode = 2;
    let packagedetailsid = this.data.txnPckgDetailId
    this.hedlist = [];
    this.implantList = [];
    this.snoService.gethedandimpalntlist(this.actioncode, packagedetailsid).subscribe((data: any) => {
      this.hedlist = data.hed.map((item: any) => ({
        ...item,
        originalHedUnit: item.hedunit, // Store original values
        originalHedPricePerUnit: item.hedpriceperunit,
      }));
      this.calculateTotal('hed'); // Calculate total price
      this.isHedModalOpen = true;
    },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      }
    );
  }



  openModalimplantCost(label: string): void {
    this.selectedLabel = label;
    this.actioncode = 3;
    let packagedetailsid = this.data.txnPckgDetailId
    this.hedlist = [];
    this.implantList = [];
    this.snoService.gethedandimpalntlist(this.actioncode, packagedetailsid).subscribe((data: any) => {
      this.implantList = data.implant.map((item: any) => ({
        ...item,
        originalImpUnit: item.impunit, // Store original values
        originalImpUnitPriceCycle: item.impunitpricecycle,
      }));
      this.calculateTotal('implant'); // Calculate total implant price
      this.isimplantModalOpen = true
    },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      }
    );

  }

  totalImplantAmount: any;
  totalhedAmount: any;
  calculateTotal(type: any) {
    if (type === 'implant') {
      // Ensure impltamount is correctly parsed as a number
      this.totalImplantAmount = this.implantList.reduce(
        (sum, item) => sum + (parseFloat(item.impltamount) || 0),
        0
      );
    } else if (type === 'hed') {
      // Ensure hedprice is correctly parsed as a number
      this.totalhedAmount = this.hedlist.reduce(
        (sum, item) => sum + (parseFloat(item.hedprice) || 0),
        0
      );
    }
  }


  list: any = [];
  packageCost: any;
  wardCost: any;
  finalpackagecost: any = 0;
  getcost() {
    const actioncode = '1';
    const packagedetailsid = this.data.txnPckgDetailId;

    this.snoService.getcostlist(actioncode, packagedetailsid).subscribe(
      (data: any) => {
        this.list = data;

        if (!this.list || this.list.length === 0) {
          this.packageCost = '0';
          this.wardCost = '0';
          return;
        }

        const packageType = this.list[0]?.packagetype;
        const isSurgical = this.list[0]?.wardpackagecoststatus;
        this.finalpackagecost = this.list[0]?.totalwardcost;

        if (packageType === 'SURGICAL') {
          this.packageCost = this.list[0]?.totalwardcost;
          this.wardCost = '0';
        } else if (packageType === 'MEDICAL(PERDAY)') {
          this.packageCost = '0';
          this.wardCost = this.list[0]?.totalwardcost;;
        } else if (packageType === 'MEDICAL(FIXED COST)') {
          this.packageCost = this.list[0]?.totalwardcost;
          this.wardCost = '0';
        }

        this.calculateApprovedAmount();
      },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      }
    );
  }



  closeModalhedcost(): void {
    this.isHedModalOpen = false;
    this.hedlist = [];
    this.implantList = [];
  }

  closeModalimplantcost(): void {
    this.isimplantModalOpen = false;
    this.hedlist = [];
    this.implantList = [];
  }

  preventClose(event: MouseEvent): void {
    event.stopPropagation(); // Prevent closing the modal on background click
  }


  validateAndUpdate(item: any): void {
    // Ensure `hedunit` is valid
    if (Number(item.hedunit) <= 0) {
      item.hedunit = Number(item.originalHedUnit); // Reset to original if invalid
      this.swal('', 'HED Unit cannot be zero or negative.', 'error');
      return;
    } if (Number(item.hedunit) > Number(item.originalHedUnit)) {
      item.hedunit = Number(item.originalHedUnit); // Reset if greater than original
      this.swal('', 'HED Unit cannot be greater than the original HED Unit value.', 'error');
      return;
    }
    // Ensure `hedpriceperunit` is valid
    if (Number(item.hedpriceperunit) <= 0) {
      item.hedpriceperunit = Number(item.originalHedPricePerUnit); // Reset to original if invalid
      this.swal('', 'HED Price Per Unit cannot be zero or negative.', 'error');
      return;
    } if (Number(item.hedpriceperunit) > Number(item.originalHedPricePerUnit)) {
      item.hedpriceperunit = Number(item.originalHedPricePerUnit); // Reset if greater than original
      this.swal('', 'HED Price Per Unit cannot be greater than original HED Price Unit value.', 'error');
      return;
    }

    // Auto-calculate the `hedprice`
    item.hedprice = Number(item.hedunit) * Number(item.hedpriceperunit);
    // Update the total price
    this.calculateTotal('hed');
  }



  validateAndUpdateImplant(item: any): void {
    // Ensure `impunit` is valid
    if (Number(item.impunit) <= 0) {
      item.impunit = Number(item.originalImpUnit); // Reset to original if invalid
      this.swal('', 'Implant Unit cannot be zero or negative.', 'error');
      return;
    } if (Number(item.impunit) > Number(item.originalImpUnit)) {
      item.impunit = Number(item.originalImpUnit); // Reset if greater than original
      this.swal('', 'Implant Unit cannot be greater than original Implant Unit value.', 'error');
      return;
    }

    // Ensure `impunitpricecycle` is valid
    if (Number(item.impunitpricecycle) <= 0) {
      item.impunitpricecycle = Number(item.originalImpUnitPriceCycle); // Reset to original if invalid
      this.swal('', 'Implant Price Per Unit cannot be zero or negative.', 'error');
      return;
    } if (Number(item.impunitpricecycle) > Number(item.originalImpUnitPriceCycle)) {
      item.impunitpricecycle = Number(item.originalImpUnitPriceCycle); // Reset if greater than original
      this.swal('', 'Implant Price Per Unit cannot be greater than original Implant Price Unit value.', 'error');
      return;
    }

    // Auto-calculate the `impltamount`
    item.impltamount = Number(item.impunit) * Number(item.impunitpricecycle);

    // Update the total price
    this.calculateTotal('implant');
  }

  hedUpdatedList: any[] = []; // To store the updated HED data
  updatedTotalhed: Number = 0; // To store the updated
  updateAmounthed(): void {
    // Create an updated array from the `hedlist`
    this.hedUpdatedList = this.hedlist.map(item => ({
      hedtxnheddetailsid: item.txnheddetailsid,
      hedunit: item.hedunit,
      hedpriceperunit: item.hedpriceperunit,
      hedprice: item.hedprice,
    }));
    // Calculate the updated total HED cost, filtering out invalid or zero values
    this.updatedTotalhed = this.hedUpdatedList
      .filter(item => Number(item.hedprice) > 0) // Only include valid prices
      .reduce((sum, item) => sum + (Number(item.hedprice) || 0), 0); // Ensure numeric addition


    // Update the total HED cost
    this.list[0].totalhedcost = this.updatedTotalhed;
    this.calculateApprovedAmount()
    // Close the modal
    this.closeModalhedcost();
  }


  implantUpdatedList: any[] = []; // To store the updated Implant data
  updatedTotalimplant: Number = 0; //
  updateAmountImplant(): void {
    // Create an updated array from the `implantList`
    this.implantUpdatedList = this.implantList.map(item => ({
      imptxnhdedetailsid: item.implantdetailsid,
      impunit: item.impunit,
      impunitpricecycle: item.impunitpricecycle,
      impltamount: item.impltamount,
    }));

    // Calculate the updated total implant cost, filtering out invalid or zero values
    this.updatedTotalimplant = this.implantUpdatedList
      .filter(item => Number(item.impltamount) > 0) // Only include valid amounts
      .reduce((sum, item) => sum + Number(item.impltamount), 0);

    // Update the total Implant cost
    this.list[0].totalimplantcost = this.updatedTotalimplant;
    this.calculateApprovedAmount()
    // Close the modal
    this.closeModalimplantcost();
  }

  calculateApprovedAmount(): void {
    const totalWardCost = this.list[0]?.totalwardcost || 0;
    const totalHedCost = this.list[0]?.totalhedcost || 0;
    const totalImplantCost = this.list[0]?.totalimplantcost || 0;
    this.textApprovedamount = Number(totalWardCost) + Number(totalHedCost) + Number(totalImplantCost);
  }


}

