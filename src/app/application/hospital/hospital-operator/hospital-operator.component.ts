import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderService } from '../../header.service';
import Swal from 'sweetalert2';
import { UsercreateService } from '../../Services/usercreate.service';
import { HospitaloperatorService } from '../../Services/hospitaloperator.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { Subscription, timer } from 'rxjs';
import { ExpiredBeneficiaryRptService } from '../../Services/expired-beneficiary-rpt.service';
declare let $: any;

@Component({
  selector: 'app-hospital-operator',
  templateUrl: './hospital-operator.component.html',
  styleUrls: ['./hospital-operator.component.scss']
})
export class HospitalOperatorComponent implements OnInit {
  showRemarks:boolean = false;
  childmessage: any;
  addForm!: FormGroup;
  user: any;
  status: any;
  curruser: any;
  bId: any;
  isUpdateBtnInVisible: boolean = true;
  submitted: boolean = false;
  mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  mobileformat = /[6-9][0-9]{9}$/;
  minlengthforName = /^[a-zA-Z0-9 ]{6,}$/;
  maxChars = 500;
  groupList: any = [];
  valid: any = 0;
  updatelist: any;
  updatinglist = {
    fullname: "",
    username: "",
    mobile: "",
    email: "",
    groupId: "",
    stateCode: "",
    districtCode: "",
    address: "",
    uid:"",
    operatorStatus:"",
    remarks:""
  }
  iconview: boolean = true;
  userId: any;
  public stateList: any = [];
  public districtList: any = [];
  activeStatusFlag: boolean = false;
  constructor(private expiredBeneficiaryRptService: ExpiredBeneficiaryRptService,public fb: FormBuilder, private route: Router, public headerService: HeaderService, private userService: UsercreateService, private hospoitalservice: HospitaloperatorService,private sessionService: SessionStorageService) {
    this.bId = this.route.getCurrentNavigation().extras.state;
  }

  ngOnInit(): void {
    this.headerService.setTitle('Create Hospital Operator');
    this.user = this.sessionService.decryptSessionData('user');

    this.headerService.isIndicate(false);
    this.headerService.isBack(true);
    this.getStateList();

    this.addForm = this.fb.group({
      fullName: ['', [Validators.required,]],
      userName: ['', [Validators.required,]],
      mobileNo: ['', [Validators.required,]],
      emailId: ['', [Validators.required,]],
      groupId: "",
      stateCode: ['', [Validators.required,]],
      districtCode: ['', [Validators.required,]],
      address: ['', [Validators.required,]],
      createdUserName: [''],
      hospitalCode: [''],
      status: [''],
      aadhaarRef: [''],
      remarks:['']
    });
    this.isUpdateBtnInVisible = true;
    if (this.bId) {
      this.isUpdateBtnInVisible = false;
      this.hospoitalservice.getoperatorbyid(this.bId.bskyUserId).subscribe((data: any) => {
        this.updatelist = data.data;
        console.log(this.updatelist);
        this.updatinglist.fullname = this.updatelist.fullName;
        this.updatinglist.username = this.updatelist.userName;
        this.updatinglist.mobile = this.updatelist.mobileNo;
        this.updatinglist.email = this.updatelist.email;
        this.updatinglist.groupId = "16";
        this.updatinglist.stateCode = this.updatelist.stateCode;
        this.OnChangeState(this.updatinglist.stateCode);
        this.updatinglist.districtCode = this.updatelist.distCode;
        this.updatinglist.address = this.updatelist.address;
        this.updatinglist.uid = this.updatelist.maskUid;
        this.updatinglist.operatorStatus = this.updatelist.operatorStatus;
        if(this.updatinglist.operatorStatus == '1' || this.updatinglist.operatorStatus == '2' || this.updatinglist.operatorStatus == '3'){
          this.activeStatusFlag = false;
        }else{
          this.activeStatusFlag = true;
        }
        this.status = this.updatelist.operatorStatus;
        this.aadhaarRefNumber = this.updatelist.uidRefNumber;
        this.fullName = this.updatelist.fullName;
        if (
          this.updatelist.uidRefNumber == null ||
          this.updatelist.uidRefNumber == undefined ||
          this.updatelist.uidRefNumber == ''
        ) {
          this.iconview = true;
        } else {
          this.iconview = false;
          this.addForm.controls['aadhaarRef'].disable();
          this.addForm.controls['fullName'].disable();
          this.isVerified = true;
        }
        this.isUpdateBtnInVisible = false;
      });
    }
  }

  getStateList() {
    this.userService.getStateList().subscribe(
      (response) => {
        this.stateList = response;
      },
    )
  }

  OnChangeState(id) {
    $('#districtId').val("");
    this.addForm.value.districtId = "";
    localStorage.setItem("stateCode", id);
    this.userService.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = response;
      },
    )
  }

  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }

  get f() {
    return this.addForm.controls;
  }

  yes($event: any) {
    this.status = 0;
    this.showRemarks=false;
  }

  no($event: any) {
    this.status = 1;
    this.showRemarks=true;
  }

  keyPress(event: KeyboardEvent) {
    const pattern = /^[A-Za-z0-9.,-_ \\s]+$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  SubmitCreate() {
    this.submitted = true;
    let fullname = $('#fullname').val().toString();
    let username = $('#username').val().toString().toLowerCase();
    let Mobile = $('#mobile').val().toString();
    let Email = $('#email').val().toString();
    let groupId = $('#groupId').val();
    let stateId = $('#stateId').val();
    let districtId = $('#districtId').val();
    let address = $('#address').val();
    let uid = $('#uid').val();
    this.curruser = this.user;
    let createon = this.curruser.userId;

    if (groupId == null || groupId == "" || groupId == undefined) {
      $("#groupId").focus();
      this.swal("Info", "Please Select Group", 'info');
      return;
    }
    if (stateId == null || stateId == "" || stateId == undefined) {
      $("#stateId").focus();
      this.swal("Info", "Please Select State", 'info');
      return;
    }
    if (districtId == null || districtId == "" || districtId == undefined) {
      $("#districtId").focus();
      this.swal("Info", "Please Select District", 'info');
      return;
    }
    if (address == null || address == "" || address == undefined) {
      $("#address").focus();
      this.swal("Info", "Please Enter Address", 'info');
      return;
    }
    if (address.length <= 10) {
      $("#address").focus();
      this.swal("Info", "Address must be more than 10 character", 'info');
      return;
    }
    if (Mobile == null || Mobile == "" || Mobile == undefined) {
      $("#mobile").focus();
      this.swal("Info", "Please Enter Mobile No", 'info');
      return;
    }
    if (!(Mobile.toString()).match(this.mobileformat)) {
      $("#mobile").focus();
      this.swal("Info", "Please Enter Valid Mobile No", 'info');
      return;
    }
    if (Email == null || Email == "" || Email == undefined) {
      $("#email").focus();
      this.swal("Info", "Please Enter Email", 'info');
      return;
    }
    if (!Email.match(this.mailformat)) {
      $("#email").focus();
      this.swal("Info", "Please Provide Valid Email", 'info');
      return;
    }
    if (this.iconview == true) {
      if (uid == null || uid == '' || uid == undefined) {
        $('#uid').focus();
        this.swal('Info', 'Please Enter UID', 'info');
        return;
      }
    }
    if (this.isVerified == false) {
      $('#uid').focus();
      this.swal('Info', 'Please verify the E-KYC', 'info');
      return;
    }
    if (fullname == null || fullname == "" || fullname == undefined) {
      $("#fullname").focus();
      this.swal("Info", "Please Enter Full Name", 'info');
      return;
    }
    if (fullname.length <= 4) {
      $("#fullname").focus();
      this.swal("Info", "Fullname must be more than 5 character", 'info');
      return;
    }
    if (username == null || username == "" || username == undefined) {
      $("#username").focus();
      this.swal("Info", "Please Enter Username", 'info');
      return;
    }
    this.validateName();
    this.checkUserName();
    this.validatePhoneNo();
    this.validateEmail();

    this.addForm.value.userName = username;
    this.addForm.value.createdUserName = createon;
    this.addForm.value.hospitalCode = this.curruser.userName;
    this.addForm.value.aadhaarRef = this.aadhaarRefNumber;
    this.addForm.value.fullName = this.fullName;
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to Apply this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Apply it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.hospoitalservice.saveData(this.addForm.value).subscribe((data: any) => {
          if (data.status == 200) {
            this.swal("Success", "User Applied Successfully", "success");
            this.addForm.reset();
            $("#stateId").val("");
            $("#districtId").val("");
            this.OnChangeState("");
            this.valid = 0;
            this.submitted = false;
            this.iconview = true;
            this.addForm.controls['aadhaarRef'].enable();
            this.addForm.controls['fullName'].enable();
          } else {
            this.swal("Error", data.message, "error");
          }
        },
          (error: any) => {
            this.swal("Error", error, 'error');
          });
      }
    });
  }

  ResetForm() {
    this.route.navigate(['application/viewhospitalopreator']);
  }

  resetVal() {
    this.submitted = false;
    this.valid = 0;
  }

  updategroup(items: any) {
    this.submitted = true;
    let fullname = $('#fullname').val().toString();
    let username = $('#username').val().toString().toLowerCase();
    let Mobile = $('#mobile').val().toString();
    let Email = $('#email').val().toString();
    let groupId = $('#groupId').val();
    let stateId = $('#stateId').val();
    let districtId = $('#districtId').val();
    let address = $('#address').val();
    let remarks = $('#remarks').val();
    this.curruser = this.user;
    let createon = this.curruser.userId;
    this.curruser = this.user;
    if (groupId == null || groupId == "" || groupId == undefined) {
      $("#groupId").focus();
      this.swal("Info", "Please Select Group", 'info');
      return;
    }
    if (fullname == null || fullname == "" || fullname == undefined) {
      $("#fullname").focus();
      this.swal("Info", "Please Enter Full Name", 'info');
      return;
    }
    if (fullname.length <= 4) {
      $("#fullname").focus();
      this.swal("Info", "Fullname must be more than 5 character", 'info');
      return;
    }
    if (Mobile == null || Mobile == "" || Mobile == undefined) {
      $("#mobile").focus();
      this.swal("Info", "Please Enter Mobile No", 'info');
      return;
    }
    if (!(Mobile.toString()).match(this.mobileformat)) {
      $("#mobile").focus();
      this.swal("Info", "Please Enter Valid Mobile No", 'info');
      return;
    }
    if (Email == null || Email == "" || Email == undefined) {
      $("#email").focus();
      this.swal("Info", "Please Enter Email", 'info');
      return;
    }
    if (!Email.match(this.mailformat)) {
      $("#email").focus();
      this.swal("Info", "Please Provide Valid Email", 'info');
      return;
    }
    if (stateId == null || stateId == "" || stateId == undefined) {
      $("#stateId").focus();
      this.swal("Info", "Please Select State", 'info');
      return;
    }
    if (districtId == null || districtId == "" || districtId == undefined) {
      $("#districtId").focus();
      this.swal("Info", "Please Select District", 'info');
      return;
    }
    if (address == null || address == "" || address == undefined) {
      $("#address").focus();
      this.swal("Info", "Please Enter Address", 'info');
      return;
    }
    if (address.length <= 10) {
      $("#address").focus();
      this.swal("Info", "Address must be more than 10 character", 'info');
      return;
    }
    if (this.showRemarks == true) {
      if (remarks == null || remarks == "" || remarks == undefined) {
        $("#remarks").focus();
        this.swal("Info", "Please Enter Remarks", 'info');
        return;
      }
    }
    this.validateName();
    this.validatePhoneNo();
    this.validateEmail();

    this.addForm.value.uId = this.updatelist.operatorId;
    this.addForm.value.status = this.status;
    this.addForm.value.createdUserName = createon;
    this.addForm.value.aadhaarRef = this.aadhaarRefNumber;
    this.addForm.value.fullName = this.fullName;
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to Update this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Update it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.hospoitalservice.updateUser(this.addForm.value).subscribe(data => {
          if (data == 1) {
            this.swal("Success", "User Details Updated Successfully", "success");
            this.submitted = false;
            this.route.navigate(['application/viewhospitalopreator']);
          } else if (data == 2) {
            this.swal("Error", "User Already Exist", "error");
          } else {
            this.swal("Error", "Some Error Occured", "error");
          }
        },
          (error: any) => {
            this.swal("Error", error, 'error');
          });
      }
    });
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  validatePhoneNo() {
    let mobileNo = $('#mobile').val().toString();
    if (!mobileNo.match(this.mobileformat)) {
      $("#mobile").focus();
      this.swal("Info", "Please Enter 10 digit Mobile No", 'info');
      return;
    }
  }

  validateEmail() {
    let emailId = $('#email').val().toString();
    if (!emailId.match(this.mailformat)) {
      $("#email").focus();
      this.swal("Info", "Please Provide Valid Email Id", 'info');
      return;
    }
  }

  validateName() {
    let fullName = $("#fullname").val().toString();
    if (fullName.length <= 4) {
      $("#fullname").focus();
      this.swal("Info", "Full Name must be more than 5 character", 'info');
      return;
    }
  }

  checkUserName() {
    let userName = $('#username').val().toString().toLowerCase();
    if (!userName.match(this.minlengthforName)) {
      this.valid = 0;
      $("#username").focus();
      this.swal("Info", "Username must be more than 5 character", 'info');
      return;
    }
    this.userService.checkDuplicateUser(userName).subscribe(data => {
      if (data.status == "Present") {
        this.valid = 2;
        $("#username").focus();
        Swal.fire({
          icon: 'info',
          title: 'Info',
          text: 'Username already exists!'
        })
        return;
      } else {
        this.valid = 1;
      }
    })
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
  changelanguage: boolean = false;
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
      this.ekycdata.userType = 0;
      this.userService.finalVerifyEkyc(this.ekycdata).subscribe((data: any) => {
        if (data.status == 200) {
          this.addForm.controls['aadhaarRef'].disable();
          this.addForm.controls['fullName'].disable();
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
  declearValue: boolean = false;
  closeModal() {
    $('#aadhaarOtp').hide();
    $('#ekycdetails').hide();
  }
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
        console.log(this.ekycdata);
        this.updatinglist.fullname = this.ekycdata.fullName;
        this.fullName = this.ekycdata.fullName;
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
  declear(event) {
    this.verifystatus = !this.verifystatus;
  }
  otpvalidate: any;
  validateOtpUpdate() {
    let otp = $('#otpIdUpdate').val();
    if (otp == '' || otp == null || otp == undefined) {
      this.swal('', 'Please Provide Otp !', 'error');
      return;
    }
    this.expiredBeneficiaryRptService.validateotpforhosp(otp,this.user.userName).subscribe((data: any) => {
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
            if(this.isUpdateBtnInVisible == true){
              this.SubmitCreate();
            }else{
              this.updategroup(this.updatinglist);
            }
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
  close() {
    $('#OtpModal').hide();
  }
  userDetails: any;
  timedata: any=60;
  sendOtp() {
    let fullname = $('#fullname').val().toString();
    let Email = $('#email').val().toString();
    let groupId = $('#groupId').val();
    let stateId = $('#stateId').val();
    let districtId = $('#districtId').val();
    let address = $('#address').val();
    let uid = $('#uid').val();
    let username = $('#username').val().toString().toLowerCase();

    if (groupId == null || groupId == "" || groupId == undefined) {
      $("#groupId").focus();
      this.swal("Info", "Please Select Group", 'info');
      return;
    }
    if (stateId == null || stateId == "" || stateId == undefined) {
      $("#stateId").focus();
      this.swal("Info", "Please Select State", 'info');
      return;
    }
    if (districtId == null || districtId == "" || districtId == undefined) {
      $("#districtId").focus();
      this.swal("Info", "Please Select District", 'info');
      return;
    }
    if (address == null || address == "" || address == undefined) {
      $("#address").focus();
      this.swal("Info", "Please Enter Address", 'info');
      return;
    }
    if (address.length <= 10) {
      $("#address").focus();
      this.swal("Info", "Address must be more than 10 character", 'info');
      return;
    }

    if (Email == null || Email == "" || Email == undefined) {
      $("#email").focus();
      this.swal("Info", "Please Enter Email", 'info');
      return;
    }
    if (!Email.match(this.mailformat)) {
      $("#email").focus();
      this.swal("Info", "Please Provide Valid Email", 'info');
      return;
    }
    if (this.iconview == true) {
      if (uid == null || uid == '' || uid == undefined) {
        $('#uid').focus();
        this.swal('Info', 'Please Enter UID', 'info');
        return;
      }
    }
    if (this.isVerified == false) {
      $('#uid').focus();
      this.swal('Info', 'Please verify the E-KYC', 'info');
      return;
    }
    if (fullname == null || fullname == "" || fullname == undefined) {
      $("#fullname").focus();
      this.swal("Info", "Please Enter Full Name", 'info');
      return;
    }
    if (fullname.length <= 4) {
      $("#fullname").focus();
      this.swal("Info", "Fullname must be more than 5 character", 'info');
      return;
    }
    if (username == null || username == "" || username == undefined) {
      $("#username").focus();
      this.swal("Info", "Please Enter Username", 'info');
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

    this.validateName();
    this.checkUserName();
    this.validatePhoneNo();
    this.validateEmail();
    this.userService.generateOtpHospital(mobile).subscribe((data: any) => {
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
}
