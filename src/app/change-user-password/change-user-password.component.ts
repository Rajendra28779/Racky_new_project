import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LoginService } from '../services/shared-services/login.service';
import { EncryptionService } from '../services/encryption.service';
import { SessionStorageService } from '../services/session-storage.service';

@Component({
  selector: 'app-change-user-password',
  templateUrl: './change-user-password.component.html',
  styleUrls: ['./change-user-password.component.scss']
})
export class ChangeUserPasswordComponent implements OnInit {
  responseMsg: any;
  form: FormGroup;
  submitted: boolean = false;
  forgotPasswordValidation: boolean = false;
  userName: any;
  passwordPattern = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  showpassword = false;
  toggletype = 'password';
  showpassword1 = false;
  toggletype1 = 'password';
  showpassword2 = false;
  toggletype2 = 'password';
  userDetails: any;

  constructor(
    private fb: FormBuilder,
    private route: Router,
    private service: LoginService,
    private encryptionService: EncryptionService,private sessionService: SessionStorageService) { }

  ngOnInit() {
    
    let user = this.sessionService.decryptSessionData("user")//data
   
    
    if (user != null || user != undefined) {
      this.userName = user.userId;
    } else {
      this.userName = localStorage.getItem("un");
    }
    this.form = this.fb.group({
      newPassword: ['', Validators.required],
      confirmPassword: ['', [Validators.required]],
      currentpassword: ['', Validators.required]
    });
  }

  get f() {
    return this.form.controls;
  }

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

  enableDisableBtn2() {
    this.showpassword2 = !this.showpassword2;
    if (this.toggletype2 === 'password') {
      this.toggletype2 = 'text';
    } else {
      this.toggletype2 = 'password';
    }
  }

  OnforgotPassword() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    console.log("h");
    let newPassword = $('#newPassword').val();
    let confirmPassword: any = $('#confirmPassword').val();
    let currentpassword = $('#currentpassword').val();

    if (newPassword != confirmPassword) {
      this.swal("Info", "Confirm Password did not match with New Password !", 'info');
      return;
    }

    if (currentpassword == confirmPassword) {
      this.swal("Info", "You can not use your privious Password Try With New Password !", 'info');
      return;
    }

    if (confirmPassword == 'Bsky@123') {
      this.swal("Info", "This Pasword Can Not Save Try With Another Password !", 'info');
      return;
    }

    if (confirmPassword.length < 8) {
      this.swal("Info", "Pasword Length Should be More Then 8 Character", 'info');
      return;
    }

    if (!this.passwordPattern.test(confirmPassword)) {
      this.swal("Info", "password should contain atleast one upper case And one lower case And one number And one special character ", 'info');
      return;
    }
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Save it!'
    }).then((result) => {
      if (result.isConfirmed) {
        let data = {
          "userName": this.userName,
          "passWord": confirmPassword,
          "oldpwd": currentpassword
        }
        this.service.changeuserPassword(this.encryptionService.encryptRequest(data)).subscribe((response: any) => {
          response = this.encryptionService.getDecryptedData(response);
          this.userDetails = response.data;
          if (response.status == "success") {
            localStorage.removeItem("un")
            this.swal('Success', 'Password Changed successfully', 'success');
            sessionStorage.clear();
            this.route.navigate(['/login']);
          } else {
            this.swal('Warning', this.userDetails.msg, 'error');
          }
        });
      }
    });
  }

  backToLogin() {
    this.route.navigate(['/application/dashboard']);
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
}
