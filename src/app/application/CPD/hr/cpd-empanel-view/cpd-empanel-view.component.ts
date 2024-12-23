import { IfStmt } from '@angular/compiler';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HrApprovalService } from 'src/app/application/Services/hr-approval-service';
import { HeaderService } from 'src/app/application/header.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import Swal from 'sweetalert2';
declare let $: any;

@Component({
  selector: 'app-cpd-empanel-view',
  templateUrl: './cpd-empanel-view.component.html',
  styleUrls: ['./cpd-empanel-view.component.scss'],
})
export class CpdEmpanelViewComponent implements OnInit {
  pageElement: number;
  selectedIndex: number;
  months: any;
  year: any;
  months2: any;
  frstDay: any;
  secoundDay: any;
  constructor(
    public headerService: HeaderService,
    private sessionService: SessionStorageService,
    private hrApprovalService: HrApprovalService,
    public route: Router
  ) {}

  ngOnInit(): void {
    this.setCurrentTime();
    this.headerService.setTitle('CPD Registration Approval');
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
    this.pageElement = 20;
    this.selectedIndex = 1;
    $('#scheduleModal').hide();
    $('#finalActionModal').hide();
    $('.selectpicker').selectpicker();
    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      maxDate: new Date(),
      daysOfWeekDisabled: ['', 7],
    });
    $('.datepicker1').datetimepicker({
      format: 'DD-MMM-YYYY',
      minDate: new Date(),
      daysOfWeekDisabled: ['', 7],
    });
    $('.timepicker').datetimepicker({
      format: 'LT',
      daysOfWeekDisabled: ['', 7],
    });
    $('.datetimepicker').datetimepicker({
      format: 'DD-MMM-YYYY LT',
      daysOfWeekDisabled: ['', 7],
    });
    var date = new Date();
    let year = date.getFullYear();
    let date1 = '01';
    let month: any = date.getMonth() - 1;
    if (month == -1) {
      this.months = 'Dec';
      this.year = year - 1;
    } else {
      this.months = this.getMonthFrom(month);
      this.year = year;
    }
    let date2 = date.getDate();
    this.months2 = this.getMonthFrom(date.getMonth());
    this.frstDay = date1 + '-' + this.months + '-' + this.year;
    this.secoundDay = date2 + '-' + this.months2 + '-' + year;
    $('input[name="fromDate"]').val(this.frstDay);
    $('input[name="fromDate"]').attr('placeholder', 'From Date *');
    $('input[name="toDate"]').attr('placeholder', 'To Date *');
    this.onClickSearch();
  }

  getMonthFrom(month) {
    if (month == 0) {
      month = 'Jan';
    } else if (month == 1) {
      month = 'Feb';
    } else if (month == 2) {
      month = 'Mar';
    } else if (month == 3) {
      month = 'Apr';
    } else if (month == 4) {
      month = 'May';
    } else if (month == 5) {
      month = 'Jun';
    } else if (month == 6) {
      month = 'Jul';
    } else if (month == 7) {
      month = 'Aug';
    } else if (month == 8) {
      month = 'Sep';
    } else if (month == 9) {
      month = 'Oct';
    } else if (month == 10) {
      month = 'Nov';
    } else if (month == 11) {
      month = 'Dec';
    }
    return month;
  }
  cpdViewApplication: any = [];
  fromDate: any;
  toDate: any;
  responseData: any;
  showPegi: any = false;
  txtsearchDate: any;
  isReject: any = true;
  onClickSearch() {
    this.fromDate = $('#datepicker1').val();
    this.toDate = $('#datepicker2').val();
    let status = $('#status').val();
    if (Number(status) == 3) {
      this.isReject = false;
    } else {
      this.isReject = true;
    }
    if (Date.parse(this.fromDate) > Date.parse(this.toDate)) {
      this.swal('Info', ' From Date should be less than To Date', 'info');
      return;
    }
    let requestData = {
      fromDate: new Date(this.fromDate),
      toDate: new Date(this.toDate),
      status: status,
    };
    this.hrApprovalService.getViewApplication(requestData).subscribe(
      (response) => {
        this.responseData = response;
        if (this.responseData.status == 'success') {
          this.cpdViewApplication = JSON.parse(this.responseData.data);
          console.log(this.cpdViewApplication);
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
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  resetField() {
    window.location.reload();
  }
  scheduledRequest: any;
  hideScheduleTime: any = true;
  mobile:any;
  reschedule(data) {
    this.scheduledRequest = data;
    this.mobile = data.mobile;
    $('#scheduleModal').show();
  }
  finalApprove(data) {
    this.scheduledRequest = data;
    $('#finalActionModal').show();
  }
  closeModal() {
    $('#remarks').val('');
    $('#scheduleModal').hide();
    $('#finalActionModal').hide();
    $('#fromTimeReschedule').val(this.currentTime);
    $('#toTimeReschedule').val(this.currentTime);
  }
  submitDetails(modalData: any, actionStatus: any) {
    let fromDateReschedule = $('#fromDateReschedule').val();
    let toDateReschedule = $('#toDateReschedule').val();
    let fromTimeReschedule = $('#fromTimeReschedule').val();
    let toTimeReschedule = $('#toTimeReschedule').val();
    let remarks = $('#remarks').val();
    let checkTime = this.isFromTimeLessThanToTime(
      fromTimeReschedule,
      toTimeReschedule
    );
    let interviewAction;
    if (actionStatus == 4) {
      interviewAction = 'Re-Schedule';
      if (Date.parse(fromDateReschedule) > Date.parse(toDateReschedule)) {
        this.swal('Info', ' From Date should be less than To Date', 'info');
        return;
      }
      if (!checkTime) {
        this.swal('Info', ' From Time should be less than To Time', 'info');
        return;
      }
    } else if (actionStatus == 5) {
      interviewAction = 'Approve';
    } else {
      interviewAction = 'Reject';
    }
    if (remarks == '' || remarks == null || remarks == undefined) {
      this.swal('', 'Remarks should not be left blank', 'error');
      return;
    }
    let scheduleData = {
      fromDate: fromDateReschedule,
      toDate: toDateReschedule,
      fromTime: fromTimeReschedule,
      toTime: toTimeReschedule,
      remarks: remarks,
      cpdUserId: modalData.cpdUserId,
      interviewAction: actionStatus,
      mobile:this.mobile
    };
    Swal.fire({
      title: '',
      text: 'Are you sure To ' + interviewAction + '?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, ' + interviewAction + ' It',
    }).then((result) => {
      if (result.isConfirmed) {
        this.hrApprovalService.scheduleApplication(scheduleData).subscribe(
          (data: any) => {
            if (data.status == 'success') {
              if (data.data.status == 'success') {
                this.swal('', data.data.message, 'success');
                $('#scheduleModal').hide();
                $('#finalActionModal').hide();
                this.onClickSearch();
              } else {
                this.swal('', data.data.message, 'info');
              }
            } else if (data.status == 'failed') {
              this.swal('', data.message, 'error');
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
  isFromTimeLessThanToTime(fromTime, toTime) {
    let fromParts = fromTime.split(/[\s:]+/); // Split using space or colon as delimiter
    let toParts = toTime.split(/[\s:]+/); // Split using space or colon as delimiter

    // Convert hours and minutes to integers
    let fromHours = parseInt(fromParts[0], 10);
    let fromMinutes = parseInt(fromParts[1], 10);
    let toHours = parseInt(toParts[0], 10);
    let toMinutes = parseInt(toParts[1], 10);

    // Check if the times are in the same period (AM/PM)
    if (fromParts[2].toLowerCase() !== toParts[2].toLowerCase()) {
      return fromParts[2].toLowerCase() === 'am'; // If fromTime is AM and toTime is PM, return true
    }

    // Convert hours to 24-hour format for comparison
    if (fromParts[2].toLowerCase() === 'pm' && fromHours !== 12) {
      fromHours += 12;
    }
    if (toParts[2].toLowerCase() === 'pm' && toHours !== 12) {
      toHours += 12;
    }

    // Compare the times
    if (
      fromHours < toHours ||
      (fromHours === toHours && fromMinutes < toMinutes)
    ) {
      return true; // "from" time is less than "to" time
    }

    return false; // "from" time is not less than "to" time
  }
  description: any;
  maxCharacter: 500;
  remarks: any;
  myGroup = new FormGroup({
    remarks: new FormControl(),
  });

  keyPress(event: KeyboardEvent) {
    const pattern = /'/;
    const inputChar = String.fromCharCode(event.charCode);
    if (pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  getPreview(data) {
    localStorage.setItem('actionData', data.cpdUserId);
    this.route.navigate(['/application/cpdempanelpreview']);
  }
  currentTime: string;
  setCurrentTime() {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };
    this.currentTime = now.toLocaleTimeString('en-US', options);
  }
}
