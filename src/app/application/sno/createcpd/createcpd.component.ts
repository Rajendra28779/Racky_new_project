import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CreatecpdserviceService } from 'src/app/application/Services/createcpdservice.service';
// import * as $ from 'jquery';
import Swal from 'sweetalert2';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { Router } from '@angular/router';
import { HeaderService } from '../../header.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-createcpd',
  templateUrl: './createcpd.component.html',
  styleUrls: ['./createcpd.component.scss']
})
export class CreatecpdComponent implements OnInit {
  fileName: any;
  fileToUpload?: File;
  documentType: any;
  fullname: any
  submitted: boolean = false;
  message: any;
  childmessage: any;
  bankName: String = "";
  branchName: String = "";
  ifsccodevalidation = /^[A-Za-z]{4}\d{7}$/;
  mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  mobileformat = /[6-9][0-9]{9}$/;
  minlengthforName = /^[a-zA-Z0-9 ]{6,}$/;
  bankId: any;
  flag: boolean = false;
  valid: any = 0;
  ifsc: any = 0;
  doc: any = 0;
  loginpageForm!: FormGroup;
  user: any;
  updatelist: any;
  updatinglist = {
    fullname: "",
    username: "",
    mobile: "",
    email: "",
    date: "",
    Payee: "",
    Doctor: "",
    BankACC: "",
    ifscCode: "",
    bankname: "",
    branchname: "",
    file: "",
    status: "",
    maxClaim: ""
  }
  userId: any;
  isUpdateBtnInVisible: boolean = true;
  isVisibleSave: any = false;
  activeStatus: any;
  loginStatus: any;

  constructor(private sessionService: SessionStorageService,private createcpdservice: CreatecpdserviceService, private snoService: SnocreateserviceService,
    public fb: FormBuilder, private CreatecpdserviceService: CreatecpdserviceService, private route: Router,
    public headerService: HeaderService) {
    this.user = this.route.getCurrentNavigation().extras.state;
   
    
  }

  ngOnInit() {
    this.headerService.setTitle('Create CPD');
    this.headerService.isIndicate(false);
    this.headerService.isBack(true);
    this.loginpageForm = this.fb.group({
      fullname: ['', [Validators.required,]],
      username: ['', [Validators.required,]],
      mobile: ['', [Validators.required,]],
      email: ['', [Validators.required,]],
      district: ['', [Validators.required,]],
      date: [null, Validators.required],
      State: [null,],
      hospital: [null,],
      Doctor: ['', [Validators.required,]],
      Payee: ['', [Validators.required,]],
      BankACC: ['', [Validators.required,]],
      ifscCode: ['', [Validators.required,]],
      status: ['',],
      maxClaim: ['', [Validators.required,]]
    });
    this.isUpdateBtnInVisible = true;
    if (this.user) {
      this.isUpdateBtnInVisible = false;
      this.CreatecpdserviceService.getbyid(this.user.user).subscribe(data => {
        this.updatelist = data;
        this.updatinglist.fullname = this.updatelist.cpduserdetails.fullName
        this.updatinglist.username = this.updatelist.cpduserdetails.userName
        this.updatinglist.mobile = this.updatelist.cpduserdetails.mobileNo
        this.updatinglist.email = this.updatelist.cpduserdetails.emailId
        this.updatinglist.date = this.updatelist.cpduserdetails.dateofJoining
        this.updatinglist.Doctor = this.updatelist.cpduserdetails.doctorLicenseNo
        this.updatinglist.status = this.updatelist.cpduserdetails.isActive
        this.updatinglist.maxClaim = this.updatelist.cpduserdetails.maxClaim
        this.updatinglist.Payee = this.updatelist.cpduserdetails.fullName
        this.userId = this.updatelist.cpduserdetails.userid.userId;
        if (this.updatelist.bankdetails) {
          this.updatinglist.BankACC = this.updatelist.bankdetails.bankAccNo
          this.updatinglist.ifscCode = this.updatelist.bankdetails.ifscCode
          this.updatinglist.bankname = this.updatelist.bankdetails.bankName
          this.updatinglist.branchname = this.updatelist.bankdetails.branchName
          this.updatinglist.file = this.updatelist.bankdetails.uploadPassbook
          this.bankId = this.updatelist.bankdetails.bankId;
          this.fileName = this.updatelist.bankdetails.uploadPassbook;
          this.isVisibleSave = true;
          this.updatelist.cpduserdetails.isActive == 0 ? this.activeStatus = true : this.activeStatus = false;
          this.updatelist.userdetails.status == 0 ? this.loginStatus = true : this.loginStatus = false;
        }
        this.isUpdateBtnInVisible = false;
      });
    }
    $('.selectpicker').selectpicker();
    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      maxDate: new Date(),
      daysOfWeekDisabled: ['', 7],
    });
    $('.timepicker').datetimepicker({
      format: 'LT',
      daysOfWeekDisabled: ['', 7],
    });
    $('.datetimepicker').datetimepicker({
      format: 'YYYY-MM-DD LT',
      daysOfWeekDisabled: ['', 7],
    });
  }

  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }

  get f() {
    return this.loginpageForm.controls;
  }

  handleFileInput(event: any) {
    this.fileToUpload = event.target.files[0];
    if (Math.round(this.fileToUpload.size / 1024) >= 3100) {
      this.swal('Warning', ' Please Provide Bank PassBook Size Less than 3MB', 'warning');
      $('#bannkpass').val('');
      this.fileToUpload = null;
      this.fileName = '';
      this.flag = false;
    } else {
      this.fileName = this.fileToUpload.name;
      this.flag = true;
    }
  }

  SubmitCpdCreate() {
    this.submitted = true;
    var fullname = $('#fullname').val().toString();
    var username = $('#username').val().toString().toLowerCase();
    var Mobile = $('#mobile').val().toString();
    var Email = $('#email').val().toString();
    var datee = $('#date').val().toString();
    var doctor = $('#Doctor').val().toString();
    var maxClaim = $('#maxClaim').val();
    var Payee = $('#Payee').val().toString();
    var BankACC = $('#BankACC').val().toString();
    var ifscCode = $('#ifscCode').val().toString().toUpperCase();
    var bankName = $('#bankName').val().toString();
    var branchname = $('#branchname').val().toString();
    var Image = this.fileToUpload;
    this.user = this.sessionService.decryptSessionData("user");
    var createon = this.user.userId;
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
    if (Mobile != null && Mobile != "" && Mobile != undefined) {
      if (!(Mobile.toString()).match(this.mobileformat)) {
        $("#mobile").focus();
        this.swal("Info", "Please Enter Valid Mobile No", 'info');
        return;
      }
    }
    if (Email != null && Email != "" && Email != undefined) {
      if (!Email.match(this.mailformat)) {
        $("#email").focus();
        this.swal("Info", "Please Provide Valid Email Id", 'info');
        return;
      }
    }
    if (datee == null || datee == "" || datee == undefined) {
      $("#date").focus();
      this.swal("Info", "Please Enter Date of Joining", 'info');
      return;
    }
    if (maxClaim == null || maxClaim == "" || maxClaim == undefined) {
      $("#maxClaim").focus();
      this.swal("Info", "Please Enter Maximum claims for CPD", 'info');
      return;
    }
    this.validateName();
    this.checkUserName();
    this.validatePhoneNo();
    this.validateEmail();
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to Save this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Save it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const formData: FormData = new FormData();
        formData.append('file', Image);
        formData.append('fullName', fullname);
        formData.append('userName', username);
        formData.append('mobileNo', Mobile);
        formData.append('emailId', Email);
        formData.append('dateofJoining', datee);
        formData.append('createon', createon);
        formData.append('doctorLicenseNo', doctor);
        formData.append('maxClaim', maxClaim);
        formData.append('payeeName', Payee);
        formData.append('bankAccNo', BankACC);
        formData.append('ifscCode', ifscCode);
        formData.append('bankName', bankName);
        formData.append('branchName', branchname);
        this.CreatecpdserviceService.saveData1(formData).subscribe(data => {
          if (data.status == "Success") {
            this.swal("Success", data.message, "success");
            this.route.navigate(['application/Viewcpd']);
            this.loginpageForm.reset();
            $('#bannkpass').val('');
            $('#bankName').val('');
            $('#branchname').val('')
            this.valid = 0;
            this.ifsc = 0;
            this.doc = 0;
            this.submitted = false;
          } else if (data.status == "Failed") {
            this.swal("Error", data.message, "error");
          }
        });
      }
    });
  }
  ResetForm() {
    this.route.navigate(['application/Viewcpd']);
  }

  resetVal() {
    this.submitted = false;
    this.valid = 0;
    this.doc = 0;
  }

  downloadfiletreatmentbill(event: any, fileName: any) {
    if (this.flag == false) {
      if (this.user) {
        let target = event.target;
        if (
          target.nodeName == 'A' ||
          target.nodeName == 'a' ||
          target.nodeName == 'IMG' ||
          target.nodeName == 'img' ||
          target.nodeName == 'I' ||
          target.nodeName == 'i'
        ) {
          target = $(target);
          let anchor = target.parent();
          anchor = anchor.get(0);

          if (fileName != null && fileName != '' && fileName != undefined) {
            let img = this.CreatecpdserviceService.downloadFile(fileName);
            window.open(img, '_blank');
          } else {
            this.swal('Info', 'Please Select File', 'info');
          }
        }
      } else {
        this.swal('Info', 'Please Select File', 'info');
      }
    } else {
      if (this.fileToUpload) {
        const file: File | null = this.fileToUpload;
        if (file) {
          this.documentType = file.type;
          const blob = new Blob([file], { type: this.documentType });
          const url = window.URL.createObjectURL(blob);
          window.open(url);
        }
      } else {
        this.swal('Info', 'Please Select File', 'info');
      }
    }
  }


  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  validateIFSC() {
    var ifscCode = $('#ifscCode').val().toString().toUpperCase();
    if (ifscCode == null || ifscCode == "" || ifscCode == undefined) {
      $('#bankName').val("");
      $('#branchname').val("");
      $("#ifscCode").focus();
      return;
    }
    this.CreatecpdserviceService.getBankDetailsByIFSC(ifscCode).subscribe(data => {
      if (data.bank != '' && data.branch != '') {
        this.bankName = data.bank;
        this.branchName = data.branch;
      } else {
        this.bankName = '';
        this.branchName = '';
      }
    });
  }

  cancel() {
    this.route.navigate(['/application/Viewcpd']);
  }

  updategroup(items: any) {
    this.submitted = true;
    var datee = $('#date').val().toString();
    var maxClaim = $('#maxClaim').val();
    var ifscCode = $('#ifscCode').val().toString().toUpperCase();
    var bankName = $('#bankName').val().toString();
    var branchname = $('#branchname').val().toString();
    var Image = this.fileToUpload;
    this.user = this.sessionService.decryptSessionData("user");
    var createon = this.user.userId;
    if (items.fullname == null || items.fullname == "" || items.fullname == undefined) {
      $("#fullname").focus();
      this.swal("Info", "Please Enter Full Name", 'info');
      return;
    }
    if (items.fullname.length <= 4) {
      $("#fullname").focus();
      this.swal("Info", "Fullname must be more than 5 character", 'info');
      return;
    }
    if (items.username == null || items.username == "" || items.username == undefined) {
      $("#username").focus();
      this.swal("Info", "Please Enter Username", 'info');
      return;
    }
    if (items.mobile != null && items.mobile != "" && items.mobile != undefined) {
      if (!(items.mobile.toString()).match(this.mobileformat)) {
        $("#mobile").focus();
        this.swal("Info", "Please Enter Valid Mobile No", 'info');
        return;
      }
    }
    if (items.email != null && items.email != "" && items.email != undefined) {
      if (!items.email.match(this.mailformat)) {
        $("#email").focus();
        this.swal("Info", "Please Provide Valid Email Id", 'info');
        return;
      }
    }
    if (datee == null || datee == "" || datee == undefined) {
      $("#date").focus();
      this.swal("Info", "Please Enter Date of Joining", 'info');
      return;
    }
    if (items.maxClaim == null || items.maxClaim == "" || items.maxClaim == undefined) {
      $("#maxClaim").focus();
      this.swal("Info", "Please Enter Maximum claims for CPD", 'info');
      return;
    }
    this.validateName();
    this.validatePhoneNo();
    this.validateEmail();
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
        this.CreatecpdserviceService.savecpdlog(this.userId, createon).subscribe(data => {
        });
        const formData: FormData = new FormData();
        formData.append('file', Image);
        formData.append('fullName', items.fullname);
        formData.append('userName', items.username);
        formData.append('mobileNo', items.mobile);
        formData.append('emailId', items.email);
        formData.append('dateofJoining', datee);
        formData.append('Update', createon);
        formData.append('doctorLicenseNo', items.Doctor);
        formData.append('maxClaim', items.maxClaim);
        formData.append('payeeName', items.Payee);
        formData.append('bankAccNo', items.BankACC);
        formData.append('ifscCode', items.ifscCode);
        formData.append('bankName', bankName);
        formData.append('branchName', branchname);
        formData.append('cpduserid', this.updatelist.cpduserdetails.bskyUserId);
        formData.append('bankid', this.bankId);
        formData.append('activeStatus', this.activeStatus == true ? "0" : "1");
        formData.append('loginStatus', this.loginStatus == true ? "0" : "1");
        this.CreatecpdserviceService.updatecpd(formData).subscribe(data => {
          if (data.status == "Success") {
            this.swal("Success", data.message, "success");
            this.route.navigate(['application/Viewcpd']);
            this.doc = 0;
            this.ifsc = 0;
            this.submitted = false;
          } else if (data.status == "Failed") {
            this.swal("Error", data.message, "error");
          }
        });
      }
    });
  }

  validateUsername(value: any) {
    this.updatinglist.Payee = this.updatinglist.fullname
  }

  validatePhoneNo() {
    let mobileNo = $('#mobile').val().toString();
    if (!mobileNo.match(this.mobileformat)) {
      $("#mobile").focus();
      this.swal("Info", "Please Enter Valid Mobile No", 'info');
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
      this.swal("Info", "Name must be more than 5 character", 'info');
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
    this.snoService.checkDuplicateData(userName).subscribe(data => {
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
    });
  }

  checkLicense() {
    let userName = $('#username').val().toString().toLowerCase();
    let license = $('#Doctor').val().toString();
    if (license.length == 0) {
      this.doc = 0;
    } else {
      this.createcpdservice.checkDuplicateLicense(license, userName).subscribe(data => {
        if (data.status == "Present") {
          this.doc = 2;
          $("#Doctor").focus();
          Swal.fire({
            icon: 'info',
            title: 'Info',
            text: 'Doctor license already exists!'
          })
          return;
        } else {
          this.doc = 1;
        }
      });
    }
  }
}



