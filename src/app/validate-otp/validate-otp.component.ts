import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ForgotpasswordService } from '../application/Services/forgotpassword.service';
import { LoginService } from '../services/shared-services/login.service';
import { EncryptionService } from '../services/encryption.service';

@Component({
  selector: 'app-validate-otp',
  templateUrl: './validate-otp.component.html',
  styleUrls: ['./validate-otp.component.scss']
})
export class ValidateOtpComponent implements OnInit {
  @ViewChild("countdown") countdown: ElementRef;
  exampleModal
  responseMsg: any;
  form: FormGroup;
  submitted: boolean = false;
  forgotPasswordValidation: boolean = false;
  userId: any;
  userDetails: any;
  passwordPattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$";
  constructor(
    private router: Router,
    private encryptionService: EncryptionService,
    private service: LoginService,) { }

  ngOnInit(): void {
    $('#exampleOtpModal').hide();
    localStorage.removeItem("otp");
  }

  OnforgotPassword() {
    let userName = $('#userName').val();
    if (userName == "" || userName == undefined || userName == null) {
      this.swal("Info", "Please enter valid Username", 'info');
      return;
    } else {
      let data = {
        "userName": userName,
      }
      this.service.forgotPassword(data).subscribe((response: any) => {
        response = this.encryptionService.getDecryptedData(response);
        this.userDetails = response.data;
        if (response.status == "success") {
          if (this.userDetails.status == "success") {
            $('#exampleOtpModal').show();
            $('#sendId').show();
            $('#reSendId').hide();
            $('#timerdivId').show();
            $('#timeCounter').show();
            $('#mobileNoId').show();
            $('#phoneId').show();
            $('#userId').val(this.userDetails.userName);
            localStorage.setItem("un", this.userDetails.userName);

            let phoneNo = this.userDetails.phone;
            let timeleft = 60;
            let downloadTimer = setInterval(function () {
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
                $('#mobileNoId').val("OTP is sent to your " + phoneNo + " mobile number");
              }
              timeleft -= 1;
            }, 1000);

          } else {
            $('#exampleOtpModal').hide();
            this.swal('Warning', this.userDetails.message, 'warning');
          }
        } else {
          $('#exampleOtpModal').hide();
          this.swal('Warning', response.message, 'warning');
        }
      });
    }
  }
  closemodeal() {
    $('#exampleOtpModal').hide();
  }

  onResendOtp() {
    let userName = $('#userName').val();
    if (userName == "" || userName == undefined || userName == null) {
      this.swal("Warning", "Some error occured could not resend OTP.Please try again late", 'error');
      return;
    } else {
      let data = {
        "userName": userName,
      }
      this.service.forgotPassword(data).subscribe((response: any) => {
        response = this.encryptionService.getDecryptedData(response);
        this.userDetails = response.data;
        if (response.status == "success") {
          if (this.userDetails.status == "success") {
            $('#timeDivId').show();
            $('#exampleOtpModal').show();
            $('#sendId').show();
            $('#reSendId').hide();
            $('#timerdivId').show();
            $('#timeCounter').show();
            $('#mobileNoId').show();
            $('#phoneId').show();
            $('#userId').val(this.userDetails.userName);
            localStorage.setItem("un", this.userDetails.userName);

            let phoneNo = this.userDetails.phone;
            let timeleft = 60;
            let downloadTimer = setInterval(function () {
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
                $('#mobileNoId').val("OTP is sent to your " + phoneNo + " mobile number");
              }
              timeleft -= 1;
            }, 1000);

          } else {
            $('#exampleOtpModal').hide();
            this.swal('Warning', this.userDetails.message, 'error');
          }
        } else {
          $('#exampleOtpModal').hide();
          this.swal('Warning', response.message, 'error');
        }
      });
    }
  }


  backToLogin() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }



  // this.forgotpassword.forgotpasswordfor(this.forgotpassForm.value).subscribe((Response:any) =>{
  //   console.log(Response);
  // })
  validateOtp() {
    let otpId = $('#otpId').val().toString();
    let userName = $('#userName').val();
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
          localStorage.setItem("otp", otpId);
          this.router.navigate(['/changepassword']);
        } else {
          this.swal('Warning', 'Invalid OTP', 'error');
          $('#exampleOtpModal').show();
        }
      });
    }
  }

}
