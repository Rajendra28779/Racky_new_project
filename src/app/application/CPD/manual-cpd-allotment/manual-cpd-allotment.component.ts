import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderService } from '../../header.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { CpdLeaveAdminServiceService } from '../../Services/cpd-leave-admin-service.service';
import Swal from 'sweetalert2';
import { FreshCaseAllocationService } from '../../Services/freshcaseallocation.service';
declare let $: any;
@Component({
  selector: 'app-manual-cpd-allotment',
  templateUrl: './manual-cpd-allotment.component.html',
  styleUrls: ['./manual-cpd-allotment.component.scss'],
})
export class ManualCpdAllotmentComponent implements OnInit {
  user: any;
  currentPage: any;
  pageElement: any;
  showPegi: boolean;
  @ViewChild('auto') auto;
  constructor(
    public headerService: HeaderService,
    private sessionService: SessionStorageService,
    private cpdLeaveAdminServiceService: CpdLeaveAdminServiceService,
    private allocateService: FreshCaseAllocationService
  ) {}

  ngOnInit(): void {
    this.headerService.setTitle('CPD Unassigned Claim');
    this.user = this.sessionService.decryptSessionData('user');
    this.currentPage = 1;
    this.pageElement = 100;
    sessionStorage.removeItem('floatNumber');
    $('.selectpicker').selectpicker();

    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      // endDate: '0d',
      maxDate: new Date(),
      daysOfWeekDisabled: ['', 7],
    });
    $('#assignFoModal').hide();
    this.getCPDUnassignedList();
    this.getCPDList();
  }
  responseData: any;
  claimList: any = [];
  getCPDUnassignedList() {
    let fromDate = $('#datepicker1').val();
    let toDate = $('#datepicker2').val();
    if (Date.parse(fromDate) > Date.parse(toDate)) {
      this.swal('Info', ' From Date should be less than To Date', 'info');
      return;
    }
    let requestData = {
      userId: this.user.userId,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
    };
    this.allocateService.getUnAssignedClaimList(requestData).subscribe(
      (response) => {
        this.responseData = response;
        if (this.responseData.status == 'success') {
          this.claimList = this.responseData.data;
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
  onresetrecord() {
    window.location.reload();
  }
  CPDList: any = [];
  submit() {
    if (this.cpdUserId == '' || this.cpdUserId == undefined || this.cpdUserId ==null) {
      this.swal('', 'Please select the CPD', 'info');
      return;
    }
    let reqData = {
      userId: this.cpdUserId,
      claimNo: this.claimNo,
    };
    Swal.fire({
      title: '',
      text: 'Do you want to Allocate?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.allocateService.manualAlloment(reqData).subscribe(
          (data: any) => {
            if (data.status == 'Success') {
              this.swal('Info', data.message, 'info');
              $('#assignFoModal').hide();
              this.auto.clear();
              this.getCPDUnassignedList();
            } else if (data.status == 'Failed') {
              this.swal('Error', data.message, 'error');
            }
          },
          (error) => {
            console.log(error);
            this.swal('', 'Something went wrong', 'error');
          }
        );
      } else {
      }
    });
  }
  cancel() {
    $('#assignFoModal').hide();
    this.cpdUserId = '';
    this.auto.clear();
  }
  getCPD(event) {}
  keyword: any = 'fullName';
  cpdUserId: any;
  selectEvent(item) {
    this.cpdUserId = item.userid.userId;
  }
  clearEvent() {
    this.cpdUserId = '';
    this.auto.clear();
  }
  getCPDList() {
    this.cpdLeaveAdminServiceService.getCpdNameList().subscribe(
      (response) => {
        this.CPDList = response;
        console.log(this.CPDList);
      },
      (error) => console.log(error)
    );
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  claimNo: any;
  assignModal(claimNo) {
    this.claimNo = claimNo;
    this.cpdUserId = '';
    $('#assignFoModal').show();
  }
}
