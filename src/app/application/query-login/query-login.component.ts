import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { LoginService } from 'src/app/services/shared-services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-query-login',
  templateUrl: './query-login.component.html',
  styleUrls: ['./query-login.component.scss'],
})
export class QueryLoginComponent implements OnInit {
  loginPageForm: FormGroup;
  showpassword = false;
  toggletype = 'password';
  submitted: boolean = false;
  user: any;
  timedata: any;
  constructor(
    public fb: FormBuilder,
    public router: Router,
    private service: LoginService,private sessionService: SessionStorageService
  ) {}

  ngOnInit(): void {
    // this.user = JSON.parse(sessionStorage.getItem('user')); 
    this.user = this.sessionService.decryptSessionData("user");
    this.loginPageForm = this.fb.group({
      userInput: ['', Validators.required],
      inputPassword: ['', Validators.required],
    });
    this.timedata = 60;
    this.SendOtp();
    $('#exampleOtpModal').show();
    $('#internal').hide();
  }
  enableDisableBtn() {
    this.showpassword = !this.showpassword;
    if (this.toggletype === 'password') {
      this.toggletype = 'text';
    } else {
      this.toggletype = 'password';
    }
  }
  get f() {
    return this.loginPageForm.controls;
  }
  userDetails: any = [];
  onLoggedIn() {
    this.submitted = true;
    if (this.loginPageForm.invalid) {
      return;
    }
    let userId = this.user.userId;
    let userName = this.loginPageForm.controls['userInput'].value;
    let password = this.loginPageForm.controls['inputPassword'].value;
    let data = {
      userName: userName.trim(),
      passWord: password.trim(),
      userId:userId
    };
    this.service.querylogin(data).subscribe(
      (response: any) => {
        this.userDetails = response;
        if (this.userDetails.status == 'success') {
          let responseData = this.userDetails.data;
          this.swal('', responseData, 'success');
          // sessionStorage.setItem('queryuser', JSON.stringify(responseData));
          this.sessionService.encryptSessionData("queryuser", responseData);
          this.router.navigate(['/application/querybuilder']);
        } else {
          this.swal('Warning', 'Invalid credential', 'error');
          this.loginPageForm.reset();
          this.submitted = false;
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
userName:any;
SendOtp(){
  this.userName = this.user.userName;
      let data = {
        "userName": this.userName,
      }
      this.service.OtpDuringInternalLogin(data).subscribe((response: any) => {
        this.userDetails = response;
        if (this.userDetails.status == "success") {
          if (this.userDetails.data.status == "success") {
          $('#exampleOtpModal').show();
          $('#sendId').show();
          $('#reSendId').hide();
          $('#timerdivId').show();
          $('#timeCounter').show();
          $('#mobileNoId').show();
          $('#phoneId').show();
          $('#userId').val(this.userDetails.data.userName);
          localStorage.setItem("un",this.userDetails.data.userName);

          let phoneNo = this.userDetails.data.phone;
          let timeleft = this.timedata;
          let downloadTimer = setInterval(function() {
            if (timeleft <= 0) {
              clearInterval(downloadTimer);
              // document.getElementById("countdown").innerHTML = "Finished";
              $('#sendId').hide();
              $('#reSendId').show();
              $('#timeCounter').hide();
              $('#timerdivId').hide();
              $('#mobileNoId').hide();
              $('#phoneId').hide();
            } else {
              $('#timeCounter').val(timeleft + " seconds remaining");
              $('#mobileNoId').val("OTP is sent to your " +phoneNo+ " mobile number" );
              // let timercuont = timeleft + " seconds remaining";
              //  $('#counter').append("<span class='badge'>"+timercuont+"</span>&nbsp;&nbsp;&nbsp;&nbsp;");
            }
            timeleft -= 1;
          }, 1000);

          }else{
          $('#exampleOtpModal').hide();
          this.swal('Warning',this.userDetails.data.message, 'error');
          }
        } else {
          $('#exampleOtpModal').hide();
          this.swal('Warning',this.userDetails.msg, 'error');
        }
      });
}
validateOtp() {
  let otpId = $('#otpId').val();
  let userName = this.userName;
  if (otpId == "" || otpId == undefined || otpId == null) {
    this.swal("", "Please enter valid OTP", 'info');
    return;
  } else {
    let data = {
      "otp": otpId,
      "userName": userName,
    }
    this.service.validateOtp(data).subscribe((response: any) => {
      this.userDetails = response;
      if (this.userDetails.data.status == "success") {
        this.swal('Success', 'OTP validated successfully', 'success');
        $('#exampleOtpModal').hide();
        $('#internal').show();
      } else {
        this.swal('Warning', 'Invalid OTP', 'error');
        $('#exampleOtpModal').show();
      }
    });
  }
}
onResendOtp() {
  this.timedata = 60;
  let userName = this.userName;
  if (userName == "" || userName == undefined || userName == null) {
    this.swal("Warning", "Some error occured could not resend OTP.Please try again late", 'error');
    return;
  } else {
    let data = {
      "userName": this.userName,
    }
    this.service.OtpDuringInternalLogin(data).subscribe((response: any) => {
      this.userDetails = response;
      if (this.userDetails.status == "success") {
        if (this.userDetails.data.status == "success") {
        $('#timeDivId').show();
        $('#exampleOtpModal').show();
        $('#sendId').show();
        $('#reSendId').hide();
        $('#timerdivId').show();
        $('#timeCounter').show();
        $('#mobileNoId').show();
        $('#phoneId').show();
        $('#userId').val(this.userDetails.data.userName);
        localStorage.setItem("un",this.userDetails.data.userName);

        let phoneNo =this.userDetails.data.phone;
        let timeleft = this.timedata;
        let downloadTimer = setInterval(function() {
          if (timeleft <= 0) {
            clearInterval(downloadTimer);
            $('#sendId').hide();
            $('#reSendId').show();
            $('#timeCounter').hide();
            $('#timerdivId').hide();
            $('#mobileNoId').hide();
            $('#phoneId').hide();
          } else {
            $('#timeCounter').val(timeleft + " seconds remaining");
            $('#mobileNoId').val("OTP is sent to your " +phoneNo+ " mobile number" );
          }
          timeleft -= 1;
        }, 1000);

        }else{
        $('#exampleOtpModal').hide();
        this.swal('Warning',this.userDetails.data.message, 'error');
        }
      } else {
        $('#exampleOtpModal').hide();
        this.swal('Warning',this.userDetails.msg, 'error');
      }
    });
  }
}
closemodeal(){
  $('#exampleOtpModal').hide();
}
}
