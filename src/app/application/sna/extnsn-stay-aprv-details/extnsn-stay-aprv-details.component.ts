import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SnoCLaimDetailsService } from '../../Services/sno-claim-details.service';
import { PreauthService } from '../../Services/preauth.service';
import Swal from 'sweetalert2';
import { TreatmenthistoryperurnService } from '../../Services/treatmenthistoryperurn.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { HeaderService } from '../../header.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
declare let $: any;

@Component({
  selector: 'app-extnsn-stay-aprv-details',
  templateUrl: './extnsn-stay-aprv-details.component.html',
  styleUrls: ['./extnsn-stay-aprv-details.component.scss'],
})
export class ExtnsnStayAprvDetailsComponent implements OnInit {
  blockInfo: any;
  headInfoArray: any = [];
  implantInfoArray: any = [];
  latestdocArray: any = [];
  requestHistoryArray: any = [];
  trtData: any = [];
  caseHistoryArray: any = [];
  pkgDetailsData: any = [];
  overAllDetailsData: any = [];
  malefund: boolean = false;
  femalefund: boolean = false;
  balanceInfo: any;
  insufficientfund: any;
  myGroup = new FormGroup({
    remarks: new FormControl(),
  });
  maxChars = 500;
  textApprovedamount: Number = 0;
  data: any;
  user: any;
  details = [];
  extsnRequestedDate:any;
  constructor(
    public snoService: SnoCLaimDetailsService,
    public preauthService: PreauthService,
    private treatmenthistoryperurn: TreatmenthistoryperurnService,
    private sessionService: SessionStorageService,
    public headerService: HeaderService,
    public route: Router,
  ) {}

//   ngAfterViewInit() {
//  // Initialize jQuery date picker and listen to its change event
//  $('#extsnRequestedDate').datepicker({
//   dateFormat: 'DD-MMM-YYYY', // Set date format as required
//   onSelect: (dateText: string) => {
//     this.ngZone.run(() => {
//       this.blockInfo.extsnRequestedDate = dateText;
//       this.getAmount(); // Call the Angular method when date is selected
//     });
//   },
// });
//   }
  dateMin: any;
  dateMax: any;
  ngOnInit(): void {
    this.headerService.setTitle('Extension Of Stay Details');
    this.data = JSON.parse(localStorage.getItem('extsndata'));
    this.user = this.sessionService.decryptSessionData('user');
    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      //maxDate: new Date(),
      daysOfWeekDisabled: ['', 7],
    });
    this.getRemarks();
    this.getExtensionOfStayDetails();
  }
  actionType: any;
  noOfDays:any;
  submit(event) {
    this.description = $('#description').val();
    let extsnRequestedDate = $('#extsnRequestedDate').val();
    if (
      this.actionRemarkId == 0 ||
      this.actionRemarkId == null ||
      this.actionRemarkId == '' ||
      this.actionRemarkId == undefined
    ) {
      this.swal('', ' Please Select Remark', 'error');
      return;
    }
    if (Date.parse(extsnRequestedDate) > Date.parse(this.blockInfo.extsnRequestedDate)) {
      this.swal('', 'Approved Up to Date should be between '+this.blockInfo.lastExtsnDate+' and '+this.blockInfo.extsnRequestedDate, 'error');
      return;
    }
    if (Date.parse(extsnRequestedDate) <= Date.parse(this.blockInfo.lastExtsnDate)) {
      this.swal('', 'Approved Up to Date should be between '+this.blockInfo.lastExtsnDate+' and '+this.blockInfo.extsnRequestedDate, 'error');
      return;
    }
    this.noOfDays = (Date.parse(this.blockInfo.extsnRequestedDate) - Date.parse(this.blockInfo.lastExtsnDate)) / (1000 * 60 * 60 * 24);
    if (this.actionRemarkId == 57) {
      if (this.description == '' || this.description == null) {
        this.swal('', 'Description should not be left blank', 'error');
        return;
      }
    }

    if (event.target.id == 'Approve') {
      this.actionType = 2;
    }
    if (event.target.id == 'Reject') {
      this.actionType = 1;
    }

    let requestData = {
      actionType: this.actionType,
      txnPackageDetailId: this.blockInfo.extensionId,
      userId: this.user.userId,
      description: this.description,
      actionRemarksId: this.actionRemarkId,
      noOfDays: this.noOfDays,
      extensionDate: new Date(extsnRequestedDate),
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
        this.preauthService.updatetExtensionOfStay(requestData).subscribe(
          (data: any) => {
            let resData = data;
            console.log(resData);
            if (resData.status == 'success') {
              if (event.target.id == 'Approve') {
                this.swal('Success', resData.data.message, 'success');
              } else if (event.target.id == 'Reject') {
                this.swal('Success', resData.data.message, 'success');
              }
              this.route.navigate(['/application/extensionrequest']);
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
    this.description = '';
  }
  description: any;
  isReject: boolean = false;
  isApproved: boolean = false;
  remarks: any;
  getId(item) {
    let id = item.id;
    this.actionRemarkId = id;
    this.remarks = item.remarks;
    if (id == 1) {
      this.isReject = true;
      this.isApproved = false;
      $('#amount').prop('disabled', false);
    } else if (id == 58) {
      this.isApproved = true;
      this.isReject = false;
      $('#amount').val(0);
      $('#amount').prop('disabled', true);
    } else {
      this.isApproved = false;
      this.isReject = false;
      $('#amount').prop('disabled', false);
    }
  }
  hCode: any;
  getExtensionOfStayDetails() {
    this.preauthService
      .getExtensionOfStayDetails(this.data.extensionId)
      .subscribe(
        (data: any) => {
          let resData = data;
          console.log(resData);
          if (resData.status == 'success') {
            console.log(JSON.parse(resData.data));
            let responseData = JSON.parse(resData.data);
            this.blockInfo = responseData.blockInfoArray[0];
            this.hCode = this.blockInfo.hospitalCode;
            this.headInfoArray = responseData.headInfoArray;
            this.implantInfoArray = responseData.implantInfoArray;
            this.caseHistoryArray = responseData.caseHistoryArray;
            this.requestHistoryArray = responseData.requestHistoryArray;
            this.latestdocArray = responseData.latestdocArray;
            this.textApprovedamount = this.blockInfo.totalAmount;
            this.noOfDays = this.blockInfo.noOfDays;
            this.extsnRequestedDate = this.blockInfo.extsnRequestedDate;
            // this.setDatePickerToDate(
            //   this.blockInfo?.requestDate,
            //   this.blockInfo?.extsnRequestedDate
            // );

            this.getTreatMentHistory();
            this.getOldTreatMentHistory();
            // this.getindufficientbalance();
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
  // totalbance: Number = 0;
  // gender:any;
  // getindufficientbalance() {
  //   this.gender = this.blockInfo?.gender;
  //   this.insufficientfund = 0;
  //   if (this.gender == 'FEMALE') {
  //     this.femalefund = true;
  //     this.totalbance =
  //       Number(this.blockInfo?.familyFund) +
  //       Number(this.blockInfo?.femaleFund);
  //     this.insufficientfund =
  //       Number(this.blockInfo?.packageCost) - Number(this.totalbance);
  //     if (this.insufficientfund <= 0) {
  //       this.insufficientfund = 0;
  //     } else {
  //       this.insufficientfund;
  //     }
  //   } else if (this.gender == 'MALE') {
  //     this.malefund = true;
  //     this.insufficientfund =
  //       Number(this.blockInfo?.packageCost) -
  //       Number(this.blockInfo?.familyFund);
  //     if (this.insufficientfund <= 0) {
  //       this.insufficientfund = 0;
  //     } else {
  //       this.insufficientfund;
  //     }
  //   }
  //   console.log('amount: ' + this.insufficientfund);
  //   // this.amountdetails();
  // }
  // amountdetails() {
  //   this.textApprovedamount = 0;
  //   if (this.insufficientfund === 0 && this.gender == 'MALE') {
  //     this.textApprovedamount = Number(this.balanceInfo?.totalPackageCost);
  //   } else if (this.insufficientfund === 0 && this.gender == 'FEMALE') {
  //     this.textApprovedamount = Number(this.balanceInfo?.totalPackageCost);
  //   } else if (this.insufficientfund != 0 && this.gender == 'MALE') {
  //     this.textApprovedamount = Number(this.balanceInfo?.familyFund);
  //   } else if (this.insufficientfund != 0 && this.gender == 'FEMALE') {
  //     this.textApprovedamount = Number(this.balanceInfo?.totalPackageCost);
  //   }
  // }
  getAmount() {
      console.log('Hi');
      // Display a Swal alert
      Swal.fire({
        title: 'Hi!',
        text: 'Date selected',
        icon: 'info',
        confirmButtonText: 'OK'
      });

    // this.swal('', 'Hello', 'error');
    // let requestDate = this.blockInfo.lastExtsnDate;
    // let currentRequestedDate = $('#extsnRequestedDate').val();
    // let extsnRequestedDate = this.blockInfo?.extsnRequestedDate;
    // this.swal('', 'Hello', 'error');
    // if (Date.parse(requestDate) > Date.parse(extsnRequestedDate)) {
    //   this.swal('', ' Requested Date should be less', 'error');
    //   return;
    // }
  }
  getDatesInRange(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  }
  getCaseDetails(id) {
    localStorage.setItem('pkgdetailsid', id);
    this.route.navigate([]).then((result) => {
      window.open(environment.routingUrl + '/preauthcasedetails');
    });
  }
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
            console.log(this.overAllDetailsData);
            // $("#packageDetailsModal").show();
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
  setDatePickerToDate(fromdate: string, todate: string) {
    // const dates="MAR-22-2024 04:03:48 PM";
    let dates = fromdate;
    console.log(fromdate);

    const minDate = '01-Oct-2024 09:34:34 PM'; // YYYY-MM-DD format
    const maxDate = '25-Oct-2024 09:34:34 PM';
    const date = new Date(minDate);
    const todates = new Date(maxDate);
    // $('#extsnRequestedDate').datepicker({
    //   format: 'DD-MMM-YYYY',
    //   startDate: date,
    //   endDate: todates
    // });

    // const datepickerOptions = {
    //   dateFormat: 'DD-MMM-YYYY',
    //   changeMonth: true,
    //   changeYear: true,
    //   minDate: date,
    //   maxDate: new Date(todates),
    //   afterShow: function (input: any, inst: any) {
    //     input.setAttribute('readonly', true);
    //     input.setAttribute('style', 'background-color: white');
    //   },
    // };
    // $('#extensionToDate').datepicker(datepickerOptions);
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
}
