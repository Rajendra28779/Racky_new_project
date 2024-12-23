import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginSharedServiceService } from 'src/app/login-shared-service.service';
import { JwtService } from 'src/app/services/jwt.service';
import { LoginService } from 'src/app/services/shared-services/login.service';
import { SidebarmenuComponent } from 'src/app/shared/sidebarmenu/sidebarmenu.component';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { CaptchaService } from '../Services/captcha.service';
import { CreatecpdserviceService } from '../Services/createcpdservice.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-admin-internal-login',
  templateUrl: './admin-internal-login.component.html',
  styleUrls: ['./admin-internal-login.component.scss']
})

export class AdminInternalLoginComponent implements OnInit {
  showpassword = false;
  inputUserPasswordInvalidated: boolean = false;
  userId: number;
  inputPasswordvalidated: boolean = false;
  hospitalCode: string;
  submitted: boolean = false;
  userDetails: any;
  userNamePattern = "^a-z/0-9/A-Z";
  inValidCaptcha: boolean = false;
  timedata: any;
  user:any;
userName:any;
menuList:any=[];

  // @ViewChild('appDashboard', { static: false }) sidebarmenuComponent: SidebarmenuComponent;

  constructor(
    public fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private loginSharedServiceService: LoginSharedServiceService,
    private encryptionService: EncryptionService,
    private sessionService: SessionStorageService) {
     }

  ngOnInit(): void {
    this.timedata = 60;
    this.SendOtp();
    $('#exampleOtpModal').show();
    $('#internal').hide();
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

SendOtp(){
  this.user = this.sessionService.decryptSessionData("user");
  this.userName = this.user.userName;
      let data = {
        "userName": this.userName,
      }
      this.loginService.OtpDuringInternalLogin(data).subscribe((response: any) => {
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

  internalLogin() {

    let userName = $('#userName').val();
    if (userName == "" || userName == undefined || userName == null) {
      this.swal("", "Please enter valid Username", 'info');
      return;
    }else {
      let data = {
        "userName": userName,
      }
    this.loginService.internalLogin(data).subscribe((response: any) => {
      this.userDetails = response;
      if (this.userDetails.status == "success") {
        let responseData = this.userDetails.data
        this.loginSharedServiceService.setUserDetails(JSON.stringify(responseData.user));
        this.getMenuList(responseData.user.userId);
        //this.router.navigate(['/application/dashboard']);
        this.router.navigate([]).then((result) => {
        //   window.open(environment.routingUrl + '/application/dashboard');
        //  window.location.reload();
         this.router.navigate(['/application/dashboard']);
          window.location.reload();
        });

      } else {
        this.swal('Warning', 'Invalid credential', 'error');
      }
    },
    (error) => {
      console.log(error);
      this.swal('', 'Something went wrong.', 'error');
    });
  }
  }

  getMenuList(userId){
    this.loginService.getMenuList(userId).subscribe((response: any) => {
      let resData = this.encryptionService.getDecryptedData(response);
      if (resData.status == "success") {
        this.menuList= resData.data;
        console.log(this.menuList);
        this.loginSharedServiceService.setMessage(this.menuList);
      } else {
        this.swal('', 'Something went wrong.', 'error');
      }
    },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      });
  }
  closemodeal(){
    $('#exampleOtpModal').hide();
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
      this.loginService.validateOtp(data).subscribe((response: any) => {
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
      this.loginService.OtpDuringInternalLogin(data).subscribe((response: any) => {
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
}
