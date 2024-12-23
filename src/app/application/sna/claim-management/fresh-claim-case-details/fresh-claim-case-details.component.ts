import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderService } from 'src/app/application/header.service';
import { FreshCaseAllocationService } from 'src/app/application/Services/freshcaseallocation.service';
import { SnoCLaimDetailsService } from 'src/app/application/Services/sno-claim-details.service';
import { SnoFressClaimApprovalService } from 'src/app/application/Services/sno-fress-claim-approval.service';
import { TreatmenthistoryperurnService } from 'src/app/application/Services/treatmenthistoryperurn.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
  selector: 'app-fresh-claim-case-details',
  templateUrl: './fresh-claim-case-details.component.html',
  styleUrls: ['./fresh-claim-case-details.component.scss']
})
export class FreshClaimCaseDetailsComponent implements OnInit {

  user: any;
  data: any;
  caseId: any;
  caseNo: any;
  constructor(
    public headerService: HeaderService,
    public allocateService: FreshCaseAllocationService,
    public snoClaimApprovalService:SnoFressClaimApprovalService,
    private sessionService: SessionStorageService,
    public snoService: SnoCLaimDetailsService,
    private treatmenthistoryperurnService: TreatmenthistoryperurnService,
    public route: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.headerService.setTitle('Case for SNA Approval');
    this.user = this.sessionService.decryptSessionData('user');
    this.data = JSON.parse(localStorage.getItem('actionData'));
    localStorage.removeItem('claimData')
    this.caseId = this.data.caseId;
    this.caseNo = this.data.caseNo;
    this.urn = this.data.urn;
    this.getRemarks();
    this.getTreatmentHistory();
    this.getSNACaseDetails();
  }
  responseData: any;
  patientDetails: any;
  urnHistory: any = [];
  packageDetails: any = [];
  actionLogsList: any = [];
  reasonList: any = [];
  approvedAmount: any = 0;
  getSNACaseDetails() {
    let requestData = {
      caseId: this.caseId,
      caseNumber: this.caseNo,
      urn: this.urn,
    };
    this.snoClaimApprovalService.getSnaCaseDetails(requestData).subscribe(
      (response) => {
        this.responseData = response;
        if (this.responseData.status == 'success') {
          let resData = this.responseData.data;
          this.patientDetails = resData.patientDetails[0];
          this.urnHistory = resData.urnHistory;
          this.packageDetails = resData.packageDetails;
          this.actionLogsList=resData.actionLogs;
          console.log(resData);
          this.packageDetails.forEach((item) => {
            item.originalAmount = item.cpdApprovalAmount; // Store original value
            item.modifiedAmount = item.cpdApprovalAmount; // Initialize modified amount
          });
        } else {
          this.swal('Error', 'Something went wrong.', 'error');
        }
      },
      (error) => {
        console.log(error);
        this.swal('Error', 'Something went wrong.', 'error');
      }
    );
  }
  getSum1(property: string): number {
    return this.urnHistory.reduce(
      (acc, item) => acc + (parseFloat(item[property]) || 0),
      0
    );
  }
  getSum(property: string): number {
    return this.packageDetails.reduce(
      (acc, item) => acc + (parseFloat(item[property]) || 0),
      0
    );
  }
  allremarks: any;
  getRemarks() {
    this.snoService.getRemarks().subscribe(
      (data1: any) => {
        let remarkData = data1;
        this.allremarks = remarkData;
        // this.firstList = this.allremarks;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  description: string = '';
  isQuery: boolean = false;
  isReject: boolean = false;
  isInvestigate: boolean = false;
  isRevert: boolean = false;
  isApproved: boolean = false;
  isHold: boolean = false;
  showsnamor: boolean = false;
  keyword = 'remarks';
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
    } else {
      this.isApproved = false;
      this.isQuery = false;
      this.isReject = false;
      this.isInvestigate = false;
      this.isRevert = false;
      this.isHold = false;
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
  actionRemarkId: any;
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
  maxChars = 1000;
  treatmentHistoryList: any = [];
  urn: any;
  getTreatmentHistory() {
    this.treatmenthistoryperurnService
      .searchbyUrn2(this.urn, null)
      .subscribe((data) => {
        this.treatmentHistoryList = data;
        if (this.treatmentHistoryList?.length > 3) {
          document
            .getElementById('treatmentTable')
            .classList.add(
              'treatment-history-table-class',
              'treatment-history-table-head-class'
            );
        }
      });
  }
  showPackagenametreatment(text, index) {
    $('#packagenametreatment' + index).text(text);
    $('#showMorepacke11' + index).empty();
    $('#showMorepacke12' + index).append(
      '<div style="cursor: pointer; color: #1d89c9">Show Less</div>'
    );
  }
  hidePackagenametreatemnt(text, index) {
    if (text.length > 15) {
      $('#packagenametreatment' + index).text(text.substring(0, 15) + '...');
      $('#showMorepacke12' + index).empty();
      $('#showMorepacke11' + index).empty();
      $('#showMorepacke11' + index).append(
        '<span style="cursor: pointer; color: #1d89c9">Show More</span>'
      );
    }
  }
  showCaseNoTreatment(text, index) {
    $('#casenotreatment' + index).text(text);
    $('#showMorecase11' + index).empty();
    $('#showMorecase12' + index).append(
      '<div style="cursor: pointer; color: #1d89c9">Show Less</div>'
    );
  }
  hideCaseNoTreatemnt(text, index) {
    if (text.length > 6) {
      $('#casenotreatment' + index).text(text.substring(0, 6) + '...');
      $('#showMorecase12' + index).empty();
      $('#showMorecase11' + index).empty();
      $('#showMorecase11' + index).append(
        '<span style="cursor: pointer; color: #1d89c9">Show More</span>'
      );
    }
  }
  showProcedureTreatment(text, index) {
    $('#proceduretreatment' + index).text(text);
    $('#showMoreprocedure11' + index).empty();
    $('#showMoreprocedure12' + index).append(
      '<div style="cursor: pointer; color: #1d89c9">Show Less</div>'
    );
  }
  hideProcedureTreatemnt(text, index) {
    if (text.length > 15) {
      $('#proceduretreatment' + index).text(text.substring(0, 15) + '...');
      $('#showMoreprocedure12' + index).empty();
      $('#showMoreprocedure11' + index).empty();
      $('#showMoreprocedure11' + index).append(
        '<span style="cursor: pointer; color: #1d89c9">Show More</span>'
      );
    }
  }

  showActionDescrption11(text, index) {
    $('#actionDescrption' + index).text(text);
    $('#showActionDescrption11' + index).empty();
    $('#showMoreActionDescrption12' + index).append(
      '<div style="cursor: pointer; color: #1d89c9">Show Less</div>'
    );
  }
  hideActionDescrption(text, index) {
    if (text.length > 15) {
      $('#actionDescrption' + index).text(text.substring(0, 15) + '...');
      $('#showMoreActionDescrption12' + index).empty();
      $('#showActionDescrption11' + index).empty();
      $('#showActionDescrption11' + index).append(
        '<span style="cursor: pointer; color: #1d89c9">Show More</span>'
      );
    }
  }

  showProcedureCase(text, index) {
    $('#procedureCase' + index).text(text);
    $('#showMoreprocedureCase11' + index).empty();
    $('#showMoreprocedureCase12' + index).append(
      '<div style="cursor: pointer; color: #1d89c9">Show Less</div>'
    );
  }
  hideProcedureCase(text, index) {
    if (text.length > 15) {
      $('#procedureCase' + index).text(text.substring(0, 15) + '...');
      $('#showMoreprocedureCase12' + index).empty();
      $('#showMoreprocedureCase11' + index).empty();
      $('#showMoreprocedureCase11' + index).append(
        '<span style="cursor: pointer; color: #1d89c9">Show More</span>'
      );
    }
  }
  onSearchChange(value) {}
  keyPress1(event: KeyboardEvent) {
    const pattern = /^[0-9]+$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
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
  getChangedAmount(item: any) {
    const claimedAmount = parseFloat(item.modifiedAmount);
    if (!item.modifiedAmount || isNaN(claimedAmount)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Input',
        text: `Please enter valid Amount.`,
        confirmButtonText: 'OK',
      }).then((result) => {
        item.modifiedAmount = item.originalAmount;
      });
      return;
    }
    const hospitalDischargeAmount = parseFloat(item.originalAmount);
    if (claimedAmount > hospitalDischargeAmount) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Amount',
        html: `Approved amount cannot be more than the hospital claimed amount.`,
        confirmButtonText: 'OK',
      }).then((result) => {
        item.modifiedAmount = item.originalAmount;
      });
    }
  }
  remarks: any;
  pendingAt: any;
  totalCaseAmount: any;
  claimStatus: any;
  amount: any;
  //Submit
  submitDetails(event) {

    this.remarks = $('#remarks').val();
    this.amount = $('#amount').val();
    let userId = this.user.userId;
    let urnNo = this.patientDetails.urn;
    let allData;
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
    if (event.target.id == 'Investigate') {
      this.pendingAt = 2;
      this.claimStatus = 6;
      this.amount = '0';
    }

    if (
      this.actionRemarkId == 0 ||
      this.actionRemarkId == null ||
      this.actionRemarkId == '' ||
      this.actionRemarkId == undefined
    ) {
      this.swal('', ' Please Select Remark', 'error');
      return;
    }

    let cpdmortality = $('#cpdmortalityId').val();
    if (event.target.id == 'Approve' || event.target.id == 'Reject') {
      if (
        cpdmortality == '' ||
        cpdmortality == null ||
        cpdmortality == undefined
      ) {
        this.swal('', ' Please Select CPD Mortality', 'error');
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
      allData = this.packageDetails
        .map((item) => `${item.claimId}#${item.modifiedAmount}`)
        .join(',');
    } else {
      allData = this.packageDetails
        .map((item) => `${item.claimId}#0`)
        .join(',');
    }
    if (this.remarks != '' && this.remarks != null) {
      const pattern = /'/;
      if (pattern.test(this.remarks)) {
        this.swal('', ' Special character is not allowed', 'error');
        return;
      }
    }
    if (this.actionRemarkId == 1) {
      if (this.amount == 0) {
        this.swal('', 'Amount should not be zero', 'error');
        return;
      }
    }
    let data = {
      userId: userId,
      amount: this.amount,
      remarks: this.remarks,
      actionRemarksId: this.actionRemarkId,
      urnNo: urnNo,
      pendingAt: this.pendingAt,
      claimStatus: this.claimStatus,
      snamortality: cpdmortality,
      claimData: allData,
      caseId: this.caseId,
      caseNo: this.caseNo,
    };
    console.log(data);
    Swal.fire({
      title: '',
      text: 'Are you sure To ' + event.target.id + '?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, ' + event.target.id + ' It',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.snoClaimApprovalService.SnaCaseWiseAction(data).subscribe(
          (data: any) => {
            console.log(data);
            if (data.status == 'Success') {
              if (event.target.id == 'Approve') {
                this.swal('Success', data.message, 'success')
              } else if (event.target.id == 'Query') {
                this.swal('Success', data.message, 'info');
              } else if (event.target.id == 'Reject') {
                this.swal('Success', data.message, 'success');
              } else if (event.target.id == 'Investigate') {
                this.swal('Success', data.message, 'success');
              } else if (event.target.id == 'Revert') {
                this.swal('Success', data.message, 'success');
              } else if (event.target.id == 'Hold') {
                this.swal('Success', data.message, 'success');
              }
            } else if (data.status == 'Failed') {
              this.swal('Error', data.message, 'error');
            }
            localStorage.removeItem('actionData');
            this.route.navigate(['/application/cpdApprovedCase']);
          },
          (error) => {
            console.log(error);
            this.swal('', 'Something went wrong.', 'error');
          }
        );
      } else {
      }
    });
  }
  tabData:any = [];
  getTabDataDetails(action) {
    this.tabData = [];
    let requestData = {
      caseId: this.caseId,
      memberId: this.patientDetails.memberId,
      urn: this.urn,
      action: action,
    };
    this.snoClaimApprovalService.getTabDataDetails(requestData).subscribe(
      (response) => {
        this.responseData = response;
        if (this.responseData.status == 'success') {
          let resData = this.responseData.data;
          this.tabData = resData.patientDetails;
          console.log(this.tabData);
        } else {
          this.swal('Error', 'Something went wrong.', 'error');
        }
      },
      (error) => {
        console.log(error);
        this.swal('Error', 'Something went wrong.', 'error');
      }
    );
  }
  onAction(data){
    let state = {
      transactionDetailsId: data.transactionDetailsId,
      urn: data.urn,
      memberId: data.memberId,
      procedureCode:data.procedureCode,
      hospitalCode:data.hospitalCode,
      authroziedCode:data.authroziedCode,
    };
    localStorage.setItem('claimData', JSON.stringify(state));
    this.route.navigate(['/application/snaApprovalClaimDetails']);
  }

  backClicked() {
    this.location.back();
  }

}
