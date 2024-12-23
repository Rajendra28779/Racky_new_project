import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HrApprovalService } from 'src/app/application/Services/hr-approval-service';
import { HeaderService } from 'src/app/application/header.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import Swal from 'sweetalert2';
declare let $: any;
import { Location } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'app-cpd-fresh-application-details',
  templateUrl: './cpd-fresh-application-details.component.html',
  styleUrls: ['./cpd-fresh-application-details.component.scss'],
})
export class CpdFreshApplicationDetailsComponent implements OnInit {
  claimDetails: any;
  maxCharacter: 500;
  description: any;
  cardBalanceDetails: any;
  highEndDrugList: any;
  imageToShow: any = 'http://bootdey.com/img/Content/avatar/avatar1.png';

  multiPackListcaseno: any;
  multiPackList: any;
  constructor(
    private location: Location,
    public headerService: HeaderService,
    private sessionService: SessionStorageService,
    private hrApprovalService: HrApprovalService,
    public route: Router
  ) {}
  data: any;
  ngOnInit(): void {
    this.data = localStorage.getItem('actionData');
    this.cpdUserId = Number(this.data);
    this.headerService.setTitle('Details page');
    // this.headerService.isIndicate(true);
    // this.headerService.isPrint(true);
    // this.headerService.isDelete(true);
    // this.headerService.isDownload(true);
    // this.headerService.isBack(false);
    this.getFreshApplicationDetails();
    let date = new Date();
    var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    $('.selectpicker').selectpicker();
    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      minDate: today,
      daysOfWeekDisabled: ['', 7],
    });
    $('.timepicker').datetimepicker({
      format: 'LT',
      // minDate: moment(), // Set minimum selectable date to current date
      daysOfWeekDisabled: ['', 7],
    });
  }
  remarks: any;
  myGroup = new FormGroup({
    remarks: new FormControl(),
  });
  cpdUserId: any;
  submitDetails(event, mobile, email) {
    let fromDate = $('#fromDate').val();
    let toDate = $('#toDate').val();
    let fromTime = $('#fromTime').val();
    let fromTimeCheck = $('#fromTimeCheck').val();
    let toTime = $('#toTime').val();
    let remarks = $('#remarks').val();
    let checkTime = this.isFromTimeLessThanToTime(fromTime, toTime);
    let checkCurrentTime = this.isFromTimeLessThanToTime(fromTime, fromTimeCheck);
    console.log(checkTime);
    if (Date.parse(fromDate) > Date.parse(toDate)) {
      this.swal('Info', 'From Date should be less than To Date', 'info');
      return;
    }
    let dateToCheck = new Date(fromDate);
    let currentDate = new Date();
    if (
      dateToCheck.getDate() === currentDate.getDate() &&
      dateToCheck.getMonth() === currentDate.getMonth() &&
      dateToCheck.getFullYear() === currentDate.getFullYear()
    ) {
      if (checkCurrentTime) {
        this.swal('Info', 'From Time should not be less than Current time', 'info');
        return;
      }
      if (!checkTime) {
        this.swal('Info', 'From Time should be less than To Time', 'info');
        return;
      }
    } else {
      if (!checkTime) {
        this.swal('Info', 'From Time should be less than To Time', 'info');
        return;
      }
    }

    if (remarks == '' || remarks == null || remarks == undefined) {
      this.swal('', 'Remarks should not be left blank', 'error');
      return;
    }
    let interviewAction;
    if (event.target.id == 'Schedule') {
      interviewAction = 2;
    }
    if (event.target.id == 'Reject') {
      interviewAction = 3;
    }
    let data = {
      fromDate: fromDate,
      toDate: toDate,
      fromTime: fromTime,
      toTime: toTime,
      remarks: remarks,
      cpdUserId: this.cpdUserId,
      interviewAction: interviewAction,
      mobile: mobile,
      email: email,
    };
    Swal.fire({
      title: '',
      text: 'Are you sure To ' + event.target.id + '?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, ' + event.target.id + ' It',
    }).then((result) => {
      if (result.isConfirmed) {
        this.hrApprovalService.scheduleApplication(data).subscribe(
          (data: any) => {
            if (data.status == 'success') {
              if (data.data.status == 'success') {
                this.swal('', data.data.message, 'success');
                this.route.navigate(['/application/cpdempanellist']);
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
  keyPress(event: KeyboardEvent) {
    const pattern = /'/;
    const inputChar = String.fromCharCode(event.charCode);
    if (pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  responseData: any;
  basicDetails: any;
  experienceList: any = [];
  qualificationList: any = [];
  addressDetails: any;
  specilityList: any = [];
  getFreshApplicationDetails() {
    let cpdUserId = this.cpdUserId;
    this.hrApprovalService.getFreshApplicationDetails(cpdUserId).subscribe(
      (response) => {
        this.responseData = response;
        console.log(this.responseData);
        console.log(JSON.parse(this.responseData.data));
        if (this.responseData.status == 'success') {
          let resData = JSON.parse(this.responseData.data);
          this.basicDetails = resData.basicArray[0];
          this.experienceList = resData.experienceArray;
          this.qualificationList = resData.qualificationArray;
          this.addressDetails = resData.addressArray[0];
          this.specilityList = resData.specialityArray;
          this.getImageFile('profilephoto', this.basicDetails.photo);
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
  childmessage: any;
  getResponseFromUtil(data: any) {
    this.childmessage = data;
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
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
      fromHours <= toHours ||
      (fromHours === toHours && fromMinutes <= toMinutes)
    ) {
      return true; // "from" time is less than "to" time
    }

    return false; // "from" time is not less than "to" time
  }
  reSet() {
    window.location.reload();
  }

  getImageFile(prefix: any, filename: any) {
    //debugger
    this.hrApprovalService
      .downloadfileCpdRegistration1(filename, prefix, this.cpdUserId)
      .subscribe((res: any) => {
        let blob = new Blob([res], { type: res.type });

        if (blob.size > 0) {
          let reader = new FileReader();

          reader.readAsDataURL(blob);
          reader.onload = (_event) => {
            this.imageToShow = reader.result;
          };
        } else
          this.imageToShow =
            'http://bootdey.com/img/Content/avatar/avatar1.png';
      });
  }
  image: any;
  downloadfileCpdRegistration(prefix: any, filename: any) {
    console.log(filename);
    if (filename != null && filename != '' && filename != undefined) {
      let img = this.hrApprovalService.downloadfileCpdRegistration(
        filename,
        prefix,
        this.cpdUserId
      );
      this.image = img;
      window.open(img, '_blank');
      //this.imageToShow = img;
    } else {
      this.swal('Info', 'File not available', 'info');
    }
  }
  backClicked() {
    // this.route.navigate(['/trackstatus']);
    this.location.back();
  }
}
