import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LoginService } from '../services/shared-services/login.service';
import { EncryptionService } from '../services/encryption.service';
import { SessionStorageService } from '../services/session-storage.service';

declare var $: any;

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {
  responseMsg: any;
  form: FormGroup;
  submitted: boolean = false;
  forgotPasswordValidation: boolean = false;
  userName: any;
  passwordPattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$";
  showpassword = false;
  toggletype = 'password';
  showpassword1 = false;
  toggletype1 = 'password';
  // otp: any;
  timeleft: number = 0;

  @ViewChild('hdbtn') hdbtn;
  @ViewChild('closebutton1') closebutton1;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private service: LoginService,
    private encryptionService: EncryptionService,
    private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    let user = this.sessionService.decryptSessionData("user");//data
    if (user != null || user != undefined) {
      this.userName = user.userName;
    } else {
      this.userName = localStorage.getItem("un");
      // this.otp = localStorage.getItem("otp");
    }
    this.form = this.fb.group({
      newPassword: ['', Validators.required],
      confirmPassword: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
    });
  }

  // validateOtp() {
  //   if (this.otp==null || this.otp=='' || this.otp==undefined) {
  //     this.router.navigate(['/forgotpassword']);
  //   }
  // }

  enableDisableBtn() {
    this.showpassword = !this.showpassword;
    if (this.toggletype === 'password') {
      this.toggletype = 'text';
    } else {
      this.toggletype = 'password';
    }
  }

  enableDisableBtn1() {
    this.showpassword1 = !this.showpassword1;
    if (this.toggletype1 === 'password') {
      this.toggletype1 = 'text';
    } else {
      this.toggletype1 = 'password';
    }
  }

  get f() {
    return this.form.controls;
  }

  userDetails: any;

  OnforgotPassword() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    let userName = $('#userName').val();
    let newPassword = $('#newPassword').val();
    let confirmPassword = $('#confirmPassword').val();
    let otpId = $('#otpId').val().toString();
    if (userName == null || userName == '' || userName == undefined) {
      this.swal("Info", "Please enter valid Username", 'info');
      return;
    }
    if (otpId == null || otpId == '' || otpId == undefined) {
      this.swal("Info", "Please enter OTP", 'info');
      return;
    }
    if (newPassword != confirmPassword) {
      this.swal("Info", "Confirm Password did not match with New Password", 'info');
      return;
    }
    if (confirmPassword == 'Bsky@123') {
      this.swal("Info", "This Pasword Cannot Be Saved. Try With Another Password", 'info');
      return;
    }
    if (confirmPassword.length < 8) {
      this.swal("Info", "Pasword Length Should be More Than 8 Character", 'info');
      return;
    }
    let data = {
      "userName": userName,
      "passWord": confirmPassword,
      "otp": otpId,
    }
    this.service.changePassword(data).subscribe((response: any) => {
      response = this.encryptionService.getDecryptedData(response);
      if (response.status == "success" && response.data.status == "success") {
        localStorage.removeItem("un");
        Swal.fire({
          text: response.data.message,
          title: 'Success',
          icon: 'success'
        }).then(res => {
          window.location.href = '/';
        });
      } else {
        Swal.fire({
          text: response.data.message,
          title: 'Warning',
          icon: 'warning'
        }).then(res => {
          // window.location.reload();
        });
      }
    });
  }

  OnGenerateOtp() {
    let userName = $('#userName').val();
    let newPassword = $('#newPassword').val();
    let confirmPassword = $('#confirmPassword').val();
    if (userName == "" || userName == undefined || userName == null) {
      this.swal("Info", "Please enter valid Username", 'info');
      return;
    }
    if (newPassword != confirmPassword) {
      this.swal("Info", "Confirm Password did not match with New Password", 'info');
      return;
    }
    if (confirmPassword == 'Bsky@123') {
      this.swal("Info", "This Pasword Cannot Be Saved. Try With Another Password", 'info');
      return;
    }
    if (confirmPassword.length < 8) {
      this.swal("Info", "Pasword Length Should be More Than 8 Character", 'info');
      return;
    }
    $('#otpId').val("");
    $('#otpId').focus();
    let data = {
      "userName": userName,
    }
    this.service.forgotPassword(data).subscribe((response: any) => {
      response = this.encryptionService.getDecryptedData(response);
      this.userDetails = response.data;
      if (response.status == "success") {
        if (this.userDetails.status == "success") {
          this.hdbtn.nativeElement.click();
          $('#sendId').show();
          $('#reSendId').hide();
          $('#timerdivId').show();
          $('#timeCounter').show();
          $('#mobileNoId').show();
          $('#phoneId').show();
          $('#userId').val(this.userDetails.userName);

          let phoneNo = this.userDetails.phone;
          this.timeleft = 60;
          let downloadTimer = setInterval((res) => {
            if (this.timeleft <= 0) {
              clearInterval(downloadTimer);
              $('#sendId').hide();
              $('#reSendId').show();
              $('#timeCounter').hide();
              $('#timerdivId').hide();
              $('#mobileNoId').hide();
              $('#phoneId').hide();
            } else {
              $('#timeCounter').val(this.timeleft + " seconds remaining");
              $('#mobileNoId').val("OTP is sent to your " + phoneNo + " mobile number");
            }
            this.timeleft -= 1;
          }, 1000);
          $('#exampleOtpModal').on('hidden.bs.modal', (result) => {
            this.timeleft = 0;
          });
        } else {
          this.timeleft = 0;
          this.closebutton1.nativeElement.click();
          this.swal('Warning', this.userDetails.message, 'warning');
        }
      } else {
        this.timeleft = 0;
        this.closebutton1.nativeElement.click();
        this.swal('Warning', response.message, 'warning');
      }
    });
  }

  onResendOtp() {
    let userName = $('#userName').val();
    let newPassword = $('#newPassword').val();
    let confirmPassword = $('#confirmPassword').val();
    if (userName == "" || userName == undefined || userName == null) {
      this.swal("Warning", "Some error occured could not resend OTP.Please try again late", 'error');
      return;
    }
    if (newPassword != confirmPassword) {
      this.swal("Info", "Confirm Password did not match with New Password", 'info');
      return;
    }
    if (confirmPassword == 'Bsky@123') {
      this.swal("Info", "This Pasword Cannot Be Saved. Try With Another Password", 'info');
      return;
    }
    if (confirmPassword.length < 8) {
      this.swal("Info", "Pasword Length Should be More Than 8 Character", 'info');
      return;
    }
    $('#otpId').val("");
    $('#otpId').focus();
    let data = {
      "userName": userName,
    }
    this.service.forgotPassword(data).subscribe((response: any) => {
      response = this.encryptionService.getDecryptedData(response);
      this.userDetails = response.data;
      if (response.status == "success") {
        if (this.userDetails.status == "success") {
          $('#timeDivId').show();
          $('#sendId').show();
          $('#reSendId').hide();
          $('#timerdivId').show();
          $('#timeCounter').show();
          $('#mobileNoId').show();
          $('#phoneId').show();
          $('#userId').val(this.userDetails.userName);

          let phoneNo = this.userDetails.phone;
          this.timeleft = 60;
          let downloadTimer = setInterval((res) => {
            if (this.timeleft <= 0) {
              clearInterval(downloadTimer);
              $('#sendId').hide();
              $('#reSendId').show();
              $('#timeCounter').hide();
              $('#timerdivId').hide();
              $('#mobileNoId').hide();
              $('#phoneId').hide();
            } else {
              $('#timeCounter').val(this.timeleft + " seconds remaining");
              $('#mobileNoId').val("OTP is sent to your " + phoneNo + " mobile number");
            }
            this.timeleft -= 1;
          }, 1000);
          $('#exampleOtpModal').on('hidden.bs.modal', (result) => {
            this.timeleft = 0;
          });
        } else {
          this.timeleft = 0;
          this.closebutton1.nativeElement.click();
          this.swal('Warning', this.userDetails.message, 'error');
        }
      } else {
        this.timeleft = 0;
        this.closebutton1.nativeElement.click();
        this.swal('Warning', response.message, 'error');
      }
    });
  }

  closemodal() {
    this.timeleft = 0;
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
}
