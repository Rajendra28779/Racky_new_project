import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderService } from '../../header.service';
import Swal from 'sweetalert2';
import { UsercreateService } from '../../Services/usercreate.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { Subscription, timer } from 'rxjs';
import { ExpiredBeneficiaryRptService } from '../../Services/expired-beneficiary-rpt.service';
declare let $: any;

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.scss'],
})
export class UserprofileComponent implements OnInit {
  childmessage: any;
  addForm!: FormGroup;
  user: any;
  curruser: any;
  bId: any;
  isUpdateBtnInVisible: boolean = true;
  submitted: boolean = false;
  mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  mobileformat = /[6-9][0-9]{9}$/;
  minlengthforName = /^[a-zA-Z0-9 ]{6,}$/;
  maxChars = 500;
  groupList: any = [];
  updatelist: any;
  updatinglist = {
    fullname: '',
    username: '',
    mobile: '',
    email: '',
    groupId: '',
    groupName: '',
    stateCode: '',
    districtCode: '',
    address: '',
    uid: '',
  };
  changelanguage: boolean = false;
  iconview: boolean = false;
  // uidInputView: boolean = false;
  // logData={
  //   bskyUserId:"",
  //   fullname:"",
  //   username:"",
  //   mobile:"",
  //   email:"",
  //   groupId:"",
  //   stateCode:"",
  //   districtCode:"",
  //   address:"",
  //   userId:"",
  //   status:"",
  //   createdBy:""
  // }
  public stateList: any = [];
  public districtList: any = [];

  constructor(
    public fb: FormBuilder,
    private route: Router,
    public headerService: HeaderService,
    private userService: UsercreateService,
    private encryptionService: EncryptionService,
    private sessionService: SessionStorageService,
    private expiredBeneficiaryRptService: ExpiredBeneficiaryRptService,
  ) {}

  ngOnInit(): void {
    $('#dropdown').hide();
    this.headerService.setTitle('User Profile');
    this.headerService.isIndicate(false);
    this.headerService.isBack(true);
    this.getGroupList();
    this.getStateList();
    // this.bId = JSON.parse(sessionStorage.getItem("user"));
    this.bId = this.sessionService.decryptSessionData('user');
    this.addForm = this.fb.group({
      fullName: ['', [Validators.required]],
      userName: ['', [Validators.required]],
      mobileNo: ['', [Validators.required]],
      emailId: ['', [Validators.required]],
      groupId: ['', [Validators.required]],
      groupName: [''],
      stateCode: ['', [Validators.required]],
      districtCode: ['', [Validators.required]],
      address: ['', [Validators.required]],
      aadhaarRef: [''],
      aadhaarNum: [''],
      createdUserName: [''],
    });
    this.isUpdateBtnInVisible = true;
    console.log(this.bId);
    // if (this.bId.groupId == 14 || this.bId.groupId == 16) {
      if (this.bId.isAuth == 0) {
      // this.uidInputView = true;
      if (
        this.bId.uidRefNumber == null ||
        this.bId.uidRefNumber == undefined ||
        this.bId.uidRefNumber == ''
      ) {
        this.iconview = true;
      } else {
        this.addForm.controls['aadhaarRef'].disable();
        this.iconview = false;
        this.isVerified = true;
      }
    } else {
      // this.uidInputView = false;
      this.isVerified = true;
    }
    if (this.bId) {
      this.isUpdateBtnInVisible = false;
      this.userService
        .getbyuserid(this.bId.userId)
        .subscribe((response: any) => {
          response = this.encryptionService.getDecryptedData(response);
          if (response.status == 'success') {
            this.updatelist = response.data;
            this.updatinglist.fullname = this.updatelist.fullName;
            this.updatinglist.username = this.updatelist.userName;
            this.updatinglist.mobile = this.updatelist.mobileNo;
            this.updatinglist.email = this.updatelist.emailId;
            this.updatinglist.groupId = this.updatelist.groupId.typeId;
            this.updatinglist.groupName = this.updatelist.groupId.groupTypeName;
            this.updatinglist.stateCode =
              this.updatelist.districtCode.statecode.stateCode;
            this.OnChangeState(this.updatinglist.stateCode);
            this.updatinglist.districtCode =
              this.updatelist.districtCode.districtcode;
            this.updatinglist.address = this.updatelist.address;
            this.updatinglist.uid = this.updatelist.maskAadhaar;
            this.aadhaarRefNumber = this.updatelist.uidRef;
            this.resAadhaar = this.updatelist.maskAadhaar;
            this.isUpdateBtnInVisible = false;
            if(this.updatelist.userId.registerStatus == 1){
              this.isVerified=false;
              this.iconview=true;
              this.addForm.controls['aadhaarRef'].enable();
            }
          }
        });
    }
  }

  getStateList() {
    this.userService.getStateList().subscribe(
      (response) => {
        this.stateList = response;
        console.log(this.stateList);
      },
      (error) => console.log(error)
    );
  }

  OnChangeState(id) {
    $('#districtId').val('');
    localStorage.setItem('stateCode', id);
    console.log('State Id' + id);

    this.userService.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = response;
        console.log('State List:');
        console.log(response);
      },
      (error) => console.log(error)
    );
  }

  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }

  get f() {
    return this.addForm.controls;
  }

  getGroupList() {
    let groups;
    this.userService.getGroupList().subscribe(
      (response: any) => {
        response = this.encryptionService.getDecryptedData(response);
        groups = response.data;
        console.log(groups);
        for (var i = 0; i < groups.length; i++) {
          var g = groups[i];
          if (g.typeId != 3 && g.typeId != 5) {
            this.groupList.push(g);
          }
        }
        console.log(this.groupList);
      },
      (error) => console.log(error)
    );
  }

  keyPress(event: KeyboardEvent) {
    const pattern = /^[A-Za-z0-9.,-_ \\s]+$/;
    //var regex = new RegExp("^[A-Za-z0-9.,-\\s]+$");
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  cancel() {
    this.route.navigate(['/application/dashboard']);
  }

  updategroup(items: any) {
    this.submitted = true;
    let fullname = $('#fullname').val().toString();
    let username = $('#username').val().toString().toLowerCase();
    console.log('un: ' + username);
    let Mobile = $('#mobile').val().toString();
    let Email = $('#email').val().toString();
    //alert(Email);
    //let groupId=$('#groupId').val();
    let stateId = $('#stateId').val();
    let districtId = $('#districtId').val();
    let address = $('#address').val();
    let uid = $('#uid').val();
    // this.curruser = JSON.parse(sessionStorage.getItem("user"))
    this.curruser = this.sessionService.decryptSessionData('user');
    let createon = this.curruser.userId;

    // this.curruser =JSON.parse(sessionStorage.getItem("user"))
    //var createon=this.curruser.userId;
    if (fullname == null || fullname == '' || fullname == undefined) {
      $('#fullname').focus();
      this.swal('Info', 'Please Enter Full Name', 'info');
      return;
    }
    if (fullname.length <= 4) {
      $('#fullname').focus();
      this.swal('Info', 'Fullname must be more than 5 character', 'info');
      return;
    }
    if (Mobile == null || Mobile == '' || Mobile == undefined) {
      $('#mobile').focus();
      this.swal('Info', 'Please Enter Mobile No', 'info');
      return;
    }
    if (!Mobile.toString().match(this.mobileformat)) {
      $('#mobile').focus();
      this.swal('Info', 'Please Enter Valid Mobile No', 'info');
      return;
    }
    if (Email == null || Email == '' || Email == undefined) {
      $('#email').focus();
      this.swal('Info', 'Please Enter Email', 'info');
      return;
    }
    if (!Email.match(this.mailformat)) {
      $('#email').focus();
      this.swal('Info', 'Please Provide Valid Email', 'info');
      return;
    }
    if (stateId == null || stateId == '' || stateId == undefined) {
      $('#stateId').focus();
      this.swal('Info', 'Please Select State', 'info');
      return;
    }
    if (districtId == null || districtId == '' || districtId == undefined) {
      $('#districtId').focus();
      this.swal('Info', 'Please Select District', 'info');
      return;
    }
    if (address == null || address == '' || address == undefined) {
      $('#address').focus();
      this.swal('Info', 'Please Enter Address', 'info');
      return;
    }
    if (this.iconview == true) {
      if (uid == null || uid == '' || uid == undefined) {
        $('#uid').focus();
        this.swal('Info', 'Please Enter UID', 'info');
        return;
      }
    }
    if (address.length <= 10) {
      $('#address').focus();
      this.swal('Info', 'Address must be more than 10 character', 'info');
      return;
    }
    if (this.isVerified == false) {
      $('#uid').focus();
      this.swal('Info', 'Please verify the E-KYC', 'info');
      return;
    }
    this.validateName();
    this.validatePhoneNo();
    this.validateEmail();

    this.addForm.value.uId = this.updatelist.bskyUserId;
    this.addForm.value.groupId = this.updatelist.groupId.typeId;
    this.addForm.value.createdUserName = createon;
    this.addForm.value.status = '0';
    this.addForm.value.fullName = this.updatinglist.fullname;
    this.addForm.value.aadhaarNum = this.resAadhaar;
    this.addForm.value.aadhaarRef = this.aadhaarRefNumber;
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to Update this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Update it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService
          .saveProfilelog(this.bId.userId, this.bId.userId)
          .subscribe((response: any) => {
            response = this.encryptionService.getDecryptedData(response);
            if (response.status == 'success')
              console.log(response.data.status + ' : ' + response.data.message);
            else console.log(response.message);
          });
        this.userService.updateUser(this.addForm.value).subscribe(
          (data) => {
            console.log(data);
            if (data == 1) {
              this.bId.phone = Mobile;
              this.sessionService.encryptSessionData('user', this.bId);
              // sessionStorage.setItem('user', JSON.stringify(this.bId));
              // this.userService.getbyuserid(this.bId.userId).subscribe(data=>{
              //   this.updatelist=data;
              //   console.log(data);
              //   this.updatinglist.fullname=this.updatelist.fullName;
              //   this.updatinglist.username=this.updatelist.userName;
              //   this.updatinglist.mobile=this.updatelist.mobileNo;
              //   this.updatinglist.email=this.updatelist.emailId;
              //   this.updatinglist.groupId=this.updatelist.groupId.typeId;
              //   this.updatinglist.groupName=this.updatelist.groupId.groupTypeName;
              //   this.updatinglist.stateCode=this.updatelist.districtCode.statecode.stateCode;
              //   //this.OnChangeState(this.updatinglist.stateCode);
              //   this.updatinglist.districtCode=this.updatelist.districtCode.districtcode;
              //   this.addForm.controls['districtCode'].setValue(this.updatinglist.districtCode);
              //   console.log('dist: '+$('#districtId').val());
              //   this.updatinglist.address=this.updatelist.address;
              //   this.isUpdateBtnInVisible=false;
              //   this.submitted = false;
              // this.logData.bskyUserId=this.updatelist.bskyUserId;
              // this.logData.fullname=this.updatelist.fullName;
              // this.logData.username=this.updatelist.userName;
              // this.logData.mobile=this.updatelist.mobileNo;
              // this.logData.email=this.updatelist.emailId;
              // this.logData.groupId=this.updatelist.groupId.typeId;
              // this.logData.stateCode=this.updatelist.districtCode.statecode.stateCode;
              // this.logData.districtCode=this.updatelist.districtCode.districtcode;
              // this.logData.address=this.updatelist.address;
              // this.logData.status=this.updatelist.status;
              // this.logData.userId=this.updatelist.userId.userId;
              // });
              this.swal(
                'Success',
                'User Details Updated Successfully',
                'success'
              );
            } else {
              this.swal('Error', 'Some Error Occured', 'error');
            }
          },
          (error: any) => {
            this.swal('Error', error, 'error');
          }
        );
      }
    });
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }

  validatePhoneNo() {
    let mobileNo = $('#mobile').val().toString();
    if (!mobileNo.match(this.mobileformat)) {
      $('#mobile').focus();
      this.swal('Info', 'Please Enter 10 digit Mobile No', 'info');
      return;
    }
  }

  validateEmail() {
    let emailId = $('#email').val().toString();
    if (!emailId.match(this.mailformat)) {
      $('#email').focus();
      this.swal('Info', 'Please Provide Valid Email Id', 'info');
      return;
    }
  }

  validateName() {
    let fullName = $('#fullname').val().toString();
    if (fullName.length <= 4) {
      $('#fullname').focus();
      this.swal('Info', 'Full Name must be more than 5 character', 'info');
      return;
    }
  }

  checkUserName() {
    let userName = $('#username').val().toString().toLowerCase();
    if (!userName.match(this.minlengthforName)) {
      $('#username').focus();
      this.swal('Info', 'Username must be more than 5 character', 'info');
      return;
    }
    this.userService.checkDuplicateUser(userName).subscribe((data) => {
      console.log(data);
      if (data.status == 'Present') {
        $('#username').focus();
        Swal.fire({
          icon: 'info',
          title: 'Info',
          text: 'Username already exists!',
        });
        return;
      }
    });
  }
  mobilenumber: any;
  ekycdata: any;
  base64Image: any;
  counter: any;
  verifystatus: boolean = false;
  isVerified: boolean = false;
  aadhaarRefNumber:any;
  clickverifyekyc() {
    if (this.verifystatus) {
      this.verifystatus = false;
      $('#declear').prop('checked', false);
      this.ekycdata.verifiedStatusFlag = 0;
      this.ekycdata.aadhaarKey = this.aadhaar;
      this.ekycdata.userType = 1;
      this.userService.finalVerifyEkyc(this.ekycdata).subscribe((data: any) => {
        if (data.status == 200) {
          this.addForm.controls['aadhaarRef'].disable();
          this.aadhaarRefNumber = data.aadhaarRef;
          this.iconview = false;
          this.isVerified = true;
          this.swal(
            'Authenticated Successfully',
            'E-KYC verified Successfully',
            'success'
          );
          $('#ekycdetails').hide();
        } else if(data.status == 300){
          this.swal('', "UID already exists.", 'info');
        }else {
          this.swal('', 'Something went wrong', 'error');
        }
      });
    } else {
      this.swal('Info', 'Please Check Declaration', 'info');
      return;
    }
  }

  closeModal() {
    $('#aadhaarOtp').hide();
    $('#ekycdetails').hide();
  }
  declear(event) {
    this.verifystatus = !this.verifystatus;
  }
  declearValue: boolean = false;
  resAadhaar:any;
  fullName:any;
  validateOtp() {
    let otp = $('#otpId').val();
    let reqData = {
      uid: this.aadhaar,
      txn: this.otptxnid,
      otpValue: otp,
    };
    this.userService.verifyekyc(reqData).subscribe((data: any) => {
      if (data.status == 200) {
        $('#aadhaarOtp').hide();
        this.ekycdata = data.ekycdata;
        this.resAadhaar = this.ekycdata.aadhaarNumber;
        this.updatinglist.fullname = this.ekycdata.fullName;
        let base64String = '';
        base64String = this.ekycdata?.photo;
        this.declearValue = false;
        const imageType = 'png';
        this.base64Image = `data:image/${imageType};base64,${base64String}`;
        $('#ekycdetails').show();
      } else {
        this.swal('', 'Something went wrong', 'error');
      }
    });
  }
  tick: any = 1000;
  otptxnid: any;
  countDown: any = Subscription;
  aadhaar: any;
  getOtp() {
    $('#otpId').val('');
    this.aadhaar = $('#uid').val();
    let reqData = {
      uid: this.aadhaar,
    };
    this.userService.getEkycOtp(reqData).subscribe((res: any) => {
      if (res.status == 200) {
        this.otptxnid = res.txn;
        this.counter = 600;
        this.mobilenumber = res.mobile;
        $('#mobileNoId').val(
          'OTP is sent to your ' + res.mobile + ' mobile number.'
        );
        this.countDown = timer(0, this.tick).subscribe(() => --this.counter);
        $('#aadhaarOtp').show();
      } else {
        this.swal('Error', res.message, 'error');
      }
    });
  }
  close() {
    $('#OtpModal').hide();
  }
  userDetails: any;
  timedata: any=60;
  sendOtp() {
    if (this.isVerified == false) {
      $('#uid').focus();
      this.swal('Info', 'Please verify the E-KYC', 'info');
      return;
    }
    // this.userId = this.bId.userId;
    $('#otpIdUpdate').val('');
    let mobile = $('#mobile').val().toString();
    if (mobile == null || mobile == '' || mobile == undefined) {
      $('#mobile').focus();
      this.swal('Info', 'Please Enter Mobile No', 'info');
      return;
    }
    if (!mobile.toString().match(this.mobileformat)) {
      $('#mobile').focus();
      this.swal('Info', 'Please Enter Valid Mobile No', 'info');
      return;
    }
    this.userService.generateOtpUpdate(mobile).subscribe((data: any) => {
      console.log(data);
      this.userDetails = data;
      if (this.userDetails.status == 'success') {
        $('#OtpModal').show();
        $('#sendId').show();
        $('#reSendId').hide();
        $('#timeCounter').show();
        $('#timerdivId').show();
        $('#mobileNoIdUpdate').show();
        $('#phoneId').show();
        let phoneNo = this.userDetails.phone;
        let timeleft = this.timedata;
        let downloadTimer = setInterval(function () {
          if (timeleft <= 0) {
            clearInterval(downloadTimer);
            // document.getElementById("countdown").innerHTML = "Finished";
            $('#sendId').hide();
            $('#reSendId').show();
            $('#timeCounter').hide();
            $('#timerdivId').hide();
            $('#mobileNoIdUpdate').hide();
            $('#phoneId').hide();
          } else {
            $('#timeCounter').val(timeleft + " seconds remaining");
            $('#mobileNoIdUpdate').val("OTP is sent to your " + phoneNo + " mobile number");
            // let timercuont = timeleft + " seconds remaining";
            //  $('#counter').append("<span class='badge'>"+timercuont+"</span>&nbsp;&nbsp;&nbsp;&nbsp;");
          }
          timeleft -= 1;
        }, 1000);
      } else {
        this.swal('Error', this.userDetails.message, 'error')
      }
    },
      (error) => console.log(error)
    );

  }
  otpvalidate: any;
  validateOtpUpdate() {
    let otp = $('#otpIdUpdate').val();
    if (otp == '' || otp == null || otp == undefined) {
      this.swal('', 'Please Provide Otp !', 'error');
      return;
    }
    this.expiredBeneficiaryRptService.validateotpforhosp(otp,this.bId.userId).subscribe((data: any) => {
      this.otpvalidate = data;
      if (this.otpvalidate.status == 'success') {
        Swal.fire({
          title: "OTP validated successfully",
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
            $('#OtpModal').hide();
            this.updategroup(null);
          }
        });
      } else {
        this.swal('Error', this.otpvalidate.message, 'error')
      }
    },
      (error) => console.log(error)
    );
  }
  onResendOtp() {
    this.sendOtp();
  }
}
