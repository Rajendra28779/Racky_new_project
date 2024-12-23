import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HrApprovalService } from 'src/app/application/Services/hr-approval-service';
import { SnocreateserviceService } from 'src/app/application/Services/snocreateservice.service';
import { HeaderService } from 'src/app/application/header.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import Swal from 'sweetalert2';
declare let $: any;

@Component({
  selector: 'app-cpd-empaneled-approve-details',
  templateUrl: './cpd-empaneled-approve-details.component.html',
  styleUrls: ['./cpd-empaneled-approve-details.component.scss'],
})
export class CpdEmpaneledApproveDetailsComponent implements OnInit {
  claimDetails: any;
  maxCharacter: 500;
  description: any;
  cardBalanceDetails: any;
  highEndDrugList: any;
  imageToShow: any = 'http://bootdey.com/img/Content/avatar/avatar1.png';
  data: any;
  userName: any;
  constructor(
    public headerService: HeaderService,
    private sessionService: SessionStorageService,
    private hrApprovalService: HrApprovalService,
    public route: Router,
    private snoService: SnocreateserviceService,
  ) {}

  ngOnInit(): void {
    this.data = localStorage.getItem('actionData');
    this.cpdUserId = Number(this.data);
    this.headerService.setTitle('Details page');
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
    let date=new Date();
    var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    $('.selectpicker').selectpicker();
    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      minDate: today,
      daysOfWeekDisabled: ['', 7],
    });
    $('.timepicker').datetimepicker({
      format: 'LT',
      daysOfWeekDisabled: ['', 7],
    });
    this.getFreshApplicationDetails();
  }
  remarks: any;
  myGroup = new FormGroup({
    remarks: new FormControl(),
  });
  cpdUserId: any;
  submitDetails(mobile,email) {
    let fromDate = $('#fromDate').val();
    let mouFromDate = $('#mouFromDate').val();
    let mouToDate = $('#mouToDate').val();
    let maximumClaim = $('#maximumClaim').val();

    if(this.userName == undefined || this.userName == null || this.userName == ""){
      this.swal('Info', 'Username shoud not be left blank.', 'info');
      return;
    }
    if(this.valid != 1){
      this.swal('Info', 'Please enter valid Username', 'info');
      return;
    }
    if(maximumClaim == undefined ||maximumClaim == null || maximumClaim == ""){
      this.swal('Info', 'Maximum Claim shoud not be left blank.', 'info');
      return;
    }
    if (Date.parse(fromDate) > Date.parse(mouFromDate)) {
      this.swal('Info', 'Joining Date should be less than MOU from Date', 'info');
      return;
    }
    if (Date.parse(mouFromDate) > Date.parse(mouToDate)) {
      this.swal('Info', 'MOU From Date should be less than To Date', 'info');
      return;
    }
    let data = {
      userName:this.userName,
      joiningFromDate: fromDate,
      maximumClaim: maximumClaim,
      mouFromDate: mouFromDate,
      mouToDate: mouToDate,
      cpdUserId: this.cpdUserId,
      mobile: mobile,
      email:email
    };
    Swal.fire({
      title: '',
      text: 'Are you sure To Submit ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Submit It',
    }).then((result) => {
      if (result.isConfirmed) {
        this.hrApprovalService.finalApproveApplication(data).subscribe(
          (data: any) => {
            if (data.status == 'success') {
              if (data.data.status == 'success') {
                this.swal('', data.data.message, 'success');
                this.route.navigate(['/application/cpdempanelapprovelist']);
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
  interviewList: any = [];
  addressDetails: any;
  specilityList: any = [];
  getFreshApplicationDetails() {
    let cpdUserId = this.cpdUserId;
    this.hrApprovalService.getApprovedApplicationDetails(cpdUserId).subscribe(
      (response) => {
        this.responseData = response;
        console.log(this.responseData);
        console.log(JSON.parse(this.responseData.data));
        if (this.responseData.status == 'success') {
          let resData = JSON.parse(this.responseData.data);
          this.basicDetails = resData.basicArray[0];
          console.log(this.basicDetails.applicantFullName);
          console.log(this.basicDetails.applicantFullName.replace(/\s/g, ''));
          this.userName =
            'Dr' + (this.basicDetails.applicantFullName.replace(/\s/g, '')).substring(0, 5);
          this.addressDetails = resData.addressArray[0];
          this.interviewList = resData.interviewArray;
          this.specilityList = resData.specialityArray;
          this.checkUserName();
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
  checkCharacter(event: KeyboardEvent) {
    const pattern = /^[0-9.\b]+$/;
    //var regex = new RegExp("^[A-Za-z0-9.,-\\s]+$");
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  showPreDoc1(text, index) {
    $('#proceduredescription' + index).text(text);
    $('#showMoreId6' + index).empty();
    $('#showMoreId7' + index).append(
      '<div style="cursor: pointer; color: #1d89c9">Show Less</div>'
    );
  }

  hidePreDoc1(text, index) {
    if (text.length > 10) {
      $('#proceduredescription' + index).text(text.substring(0, 10) + '...');
      $('#showMoreId7' + index).empty();
      $('#showMoreId6' + index).empty();
      $('#showMoreId6' + index).append(
        '<span style="cursor: pointer; color: #1d89c9">Show More</span>'
      );
    }
  }
  valid: any = 0;
  minlengthforName = /^[a-zA-Z0-9 ]{6,}$/;
  checkUserName() {
    let userName = this.userName.toString().toLowerCase();
    if (!userName.match(this.minlengthforName)) {
      this.valid = 0;
      $('#userName').focus();
      this.swal('Info', 'Username must be more than 5 character', 'info');
      return;
    }
    this.snoService.checkDuplicateData(userName).subscribe((data) => {
      if (data.status == 'Present') {
        this.valid = 2;
        $('#userName').focus();
        Swal.fire({
          icon: 'info',
          title: 'Info',
          text: 'Username already exists!',
        });
        return;
      } else {
        this.valid = 1;
      }
    });
  }
}
