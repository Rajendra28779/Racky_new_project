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
  selector: 'app-cpdprofile',
  templateUrl: './cpdprofile.component.html',
  styleUrls: ['./cpdprofile.component.scss']
})
export class CpdprofileComponent implements OnInit {

  fileName: any;
  fileToUpload: File;
  documentType: any;
  fullname: any;
  specialityList: any = [];
  hospitaldtalist: any = [];
  message: any;
  childmessage: any;
  bankName: String = "";
  branchName: String = "";
  ifsccodevalidation = /^[A-Za-z]{4}\d{7}$/;
  mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  mobileformat = /[6-9][0-9]{9}$/;
  minlengthforName = /^[a-zA-Z0-9 ]{6,}$/;
  stateList: any;
  image: any;
  bankId: any;
  flag: boolean = false;
  ifsc: any = 0;
  doc: any = 0;

  loginpageForm!: FormGroup;
  user: any;
  public settingHospital = {};
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
    maxClaim: ""
  }
  // logData={
  //   fullName:"",
  //   userName:"",
  //   userid:"",
  //   bskyUserId:"",
  //   mobileNo:"",
  //   emailId:"",
  //   dateofJoining:"",
  //   doctorLicenseNo:"",
  //   payeeName:"",
  //   bankAccNo:"",
  //   ifscCode:"",
  //   bankName:"",
  //   branchName:"",
  //   uploadPassbook:"",
  //   createdBy:"",
  //   bankId:"",
  //   status:"",
  //   maxClaim:""
  // }
  isUpdateBtnInVisible: boolean;
  districtList: any;
  hospitalList: any;



  constructor(private createcpdservice: CreatecpdserviceService, private snoService: SnocreateserviceService,
    public fb: FormBuilder, private CreatecpdserviceService: CreatecpdserviceService, private route: Router,
    public headerService: HeaderService,
    private sessionService: SessionStorageService) { }

  ngOnInit() {
    $('#dropdown').hide();
    this.headerService.setTitle('CPD Profile');
    this.headerService.isIndicate(false);
    this.headerService.isBack(true);
    this.createcpdservice.currentMessage.subscribe(data => {
      this.user = this.sessionService.decryptSessionData("user");
      console.log(this.user);
    });

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
      ifscCode: ['',],
      maxClaim: ['', [Validators.required,]]
    });
    this.isUpdateBtnInVisible = false;
    if (this.user) {
      this.isUpdateBtnInVisible = false;
      this.CreatecpdserviceService.getbyUserid(this.user.userId).subscribe(data => {
        this.updatelist = data;

        this.updatinglist.fullname = this.updatelist.cpduserdetails.fullName
        this.updatinglist.username = this.updatelist.cpduserdetails.userName
        this.updatinglist.mobile = this.updatelist.cpduserdetails.mobileNo
        this.updatinglist.email = this.updatelist.cpduserdetails.emailId
        this.updatinglist.date = this.updatelist.cpduserdetails.dateofJoining
        this.updatinglist.Doctor = this.updatelist.cpduserdetails.doctorLicenseNo
        this.updatinglist.Payee = this.updatelist.cpduserdetails.fullName
        this.updatinglist.maxClaim = this.updatelist.cpduserdetails.maxClaim
        // this.logData.userid=this.user.userId;
        // this.logData.bskyUserId=this.updatelist.cpduserdetails.bskyUserId;
        // this.logData.fullName=this.updatelist.cpduserdetails.fullName;
        // this.logData.userName=this.updatelist.cpduserdetails.userName;
        // this.logData.mobileNo=this.updatelist.cpduserdetails.mobileNo
        // this.logData.emailId=this.updatelist.cpduserdetails.emailId
        // this.logData.dateofJoining=this.updatelist.cpduserdetails.dateofJoining
        // this.logData.doctorLicenseNo=this.updatelist.cpduserdetails.doctorLicenseNo
        // this.logData.status=this.updatelist.cpduserdetails.isActive
        // this.logData.maxClaim=this.updatelist.cpduserdetails.maxClaim
        // this.logData.payeeName=this.updatelist.cpduserdetails.fullName
        if (this.updatelist.bankdetails) {
          this.updatinglist.BankACC = this.updatelist.bankdetails.bankAccNo
          this.updatinglist.ifscCode = this.updatelist.bankdetails.ifscCode
          this.updatinglist.bankname = this.updatelist.bankdetails.bankName
          this.updatinglist.branchname = this.updatelist.bankdetails.branchName
          this.updatinglist.file = this.updatelist.bankdetails.uploadPassbook
          this.fileToUpload = this.updatelist.bankdetails.uploadPassbook;
          // this.logData.bankAccNo=this.updatelist.bankdetails.bankAccNo
          // this.logData.ifscCode=this.updatelist.bankdetails.ifscCode
          // this.logData.bankName=this.updatelist.bankdetails.bankName
          // this.logData.branchName=this.updatelist.bankdetails.branchName
          // this.logData.uploadPassbook=this.updatelist.bankdetails.uploadPassbook
          this.bankId = this.updatelist.bankdetails.bankId;
          // this.logData.bankId=this.updatelist.bankdetails.bankId;
          this.fileName = this.updatelist.bankdetails.uploadPassbook;
        }
        this.isUpdateBtnInVisible = false;
      });
    }
    console.log('file: ' + this.fileToUpload);

    $('.selectpicker').selectpicker();

    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      // endDate: '0d',
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
      this.swal('Warning', ' Please provide Bank PassBook with Limited Size', 'warning');
      $('#bannkpass').val('');
      this.fileToUpload = null;
      this.fileName = '';
      this.flag = false;
    } else {
      this.fileName = this.fileToUpload.name;
      this.flag = true;
    }
  }

  ResetForm() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to cancel this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Cancel it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.route.navigate(['application/Viewcpd']);
      }
    });
  }

  downloadfiletreatmentbill(event: any, fileName: any) {
    console.log('file: ' + fileName);
    if (this.flag == false) {
      if (this.user) {
        console.log('here: ' + this.user.userId);
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

  // validateIFSC(){
  //   var ifscCode = $('#ifscCode').val().toString().toUpperCase();
  //   if (ifscCode==null || ifscCode== "" || ifscCode==undefined){
  //     $('#bankName').val("");
  //     $('#branchname').val("");
  //     $("#ifscCode").focus();
  //     this.ifsc = 0;
  //     this.swal("Info", "Please Enter IFSC code", 'info');
  //     return;
  //   }
  //   this.CreatecpdserviceService.getBankDetailsByIFSC(ifscCode).subscribe(data=>{
  //     //alert(data.bank+' : '+data.branch);
  //     if(data.bank!=''&&data.branch!=''){
  //       this.bankName = data.bank;
  //       this.branchName = data.branch;
  //       //alert(this.bankName+' : '+this.branchName);
  //       this.ifsc = 1;
  //     } else {
  //       this.bankName = '';
  //       this.branchName = '';
  //       $('#bankName').val("");
  //       $('#branchname').val("");
  //       $("#ifscCode").focus();
  //       this.ifsc = 2;
  //       this.swal("Info", "Please fill correct IFSC Code", 'info');
  //       //alert(this.bankName+' : '+this.branchName);
  //     }
  //   });
  // }

  cancel() {
    this.route.navigate(['/application/dashboard']);
  }

  updategroup(items: any) {

    var datee = $('#date').val().toString();
    var ifscCode = $('#ifscCode').val().toString().toUpperCase();
    var bankName = $('#bankName').val().toString();
    var branchname = $('#branchname').val().toString();
    this.image = this.fileToUpload;
    console.log(items);
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
      this.swal("Info", "Please Enter UserName", 'info');
      return;
    }
    if (items.mobile == null || items.mobile == "" || items.mobile == undefined) {
      $("#mobile").focus();
      this.swal("Info", "Please Enter Mobile No", 'info');
      return;
    }
    if (!(items.mobile.toString()).match(this.mobileformat)) {
      $("#mobile").focus();
      this.swal("Info", "Please Enter Valid Mobile No", 'info');
      return;
    }
    if (items.email == null || items.email == "" || items.email == undefined) {
      $("#email").focus();
      this.swal("Info", "Please Enter Email", 'info');
      return;
    }
    if (!items.email.match(this.mailformat)) {
      $("#email").focus();
      this.swal("Info", "Please Provide Valid Email", 'info');
      return;
    }
    if (datee == null || datee == "" || datee == undefined) {
      $("#date").focus();
      this.swal("Info", "Please Enter Date of Joining", 'info');
      return;
    }
    // if ( items.Doctor==null ||  items.Doctor== "" ||  items.Doctor==undefined){
    //   $("#Doctor").focus();
    //   this.swal("Info", "Please Enter License no.", 'info');
    //   return;
    // }
    // if ( items.maxClaim==null || items.maxClaim== "" || items.maxClaim==undefined){
    //   $("#maxClaim").focus();
    //   this.swal("Info", "Please Enter Maximum claims for CPD", 'info');
    //   return;
    // }
    if (items.Payee == null || items.Payee == "" || items.Payee == undefined) {
      $("#Payee").focus();
      this.swal("Info", "Please Enter Payee Name", 'info');
      return;
    }
    // if (items.BankACC==null || items.BankACC== "" || items.BankACC==undefined){
    //   $("#BankACC").focus();
    //   this.swal("Info", "Please Enter Account No", 'info');
    //   return;
    // }
    // if (items.ifscCode==null || items.ifscCode== "" || items.ifscCode==undefined){
    //   $("#ifscCode").focus();
    //   this.swal("Info", "Please Enter IFSC code", 'info');
    //   return;
    // }
    // if (bankName==null || bankName== "" || bankName==undefined){
    //   $("#ifscCode").focus();
    //   this.swal("Info", "Please Enter IFSC code Correctly", 'info');
    //   return;
    // }
    // if (branchname==null || branchname== "" || branchname==undefined){
    //   $("#ifscCode").focus();
    //   this.swal("Info", "Please Enter IFSC code Correctly", 'info');
    //   return;
    // }
    // if (this.image==null  || this.image==undefined){
    //   this.swal("Info", "Please Upload PassBook", 'info');
    //   return;
    // }
    // if (ifscCode!=null && ifscCode!="" && ifscCode!=undefined) {
    //   if (bankName==null || bankName== "" || bankName==undefined){
    //     $("#ifscCode").focus();
    //     this.swal("Info", "Please Enter IFSC code Correctly", 'info');
    //     return;
    //   }
    //   if (branchname==null || branchname== "" || branchname==undefined){
    //     $("#ifscCode").focus();
    //     this.swal("Info", "Please Enter IFSC code Correctly", 'info');
    //     return;
    //   }
    // }
    this.validateName();
    this.validatePhoneNo();
    this.validateEmail();
    // this.checkLicense();
    // this.validateIFSC();

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
        // this.logData.createdBy = createon;
        // console.log('log data: ');
        // console.log(this.logData);
        this.CreatecpdserviceService.savecpdlog(createon, createon).subscribe(data => {
          console.log(data.status + ": " + data.message);
        });
        const formData: FormData = new FormData();
        formData.append('file', this.image);
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
        formData.append('activeStatus', '0');
        formData.append('loginStatus', '0');
        console.log(formData);
        this.CreatecpdserviceService.updatecpd(formData).subscribe(data => {
          if (data.status == "Success") {
            this.user.phone = items.mobile;
            this.sessionService.encryptSessionData('user', this.user);
            // console.log('initial:');
            // console.log(this.updatelist);
            // this.CreatecpdserviceService.getbyUserid(this.user.userId).subscribe(resp=>{
            //   this.updatelist=resp;
            //   console.log('later:');
            //   console.log(this.updatelist);
            //   this.updatinglist.fullname=this.updatelist.cpduserdetails.fullName
            //   this.updatinglist.username=this.updatelist.cpduserdetails.userName
            //   this.updatinglist.mobile=this.updatelist.cpduserdetails.mobileNo
            //   this.updatinglist.email=this.updatelist.cpduserdetails.emailId
            //   this.updatinglist.date=this.updatelist.cpduserdetails.dateofJoining
            //   this.updatinglist.Doctor=this.updatelist.cpduserdetails.doctorLicenseNo
            //   this.updatinglist.Payee=this.updatelist.cpduserdetails.fullName
            //   this.updatinglist.BankACC=this.updatelist.bankdetails.bankAccNo
            //   this.updatinglist.ifscCode=this.updatelist.bankdetails.ifscCode
            //   this.updatinglist.bankname=this.updatelist.bankdetails.bankName
            //   this.updatinglist.branchname=this.updatelist.bankdetails.branchName
            //   this.updatinglist.file=this.updatelist.bankdetails.uploadPassbook
            //   this.fileToUpload=this.updatelist.bankdetails.uploadPassbook;
            //   this.doc = 0;
            //   this.ifsc = 0;
            //   this.logData.userid=this.user.userId;
            //   this.logData.bskyUserId=this.updatelist.cpduserdetails.bskyUserId;
            //   this.logData.fullName=this.updatelist.cpduserdetails.fullName;
            //   this.logData.userName=this.updatelist.cpduserdetails.userName;
            //   this.logData.mobileNo=this.updatelist.cpduserdetails.mobileNo
            //   this.logData.emailId=this.updatelist.cpduserdetails.emailId
            //   this.logData.dateofJoining=this.updatelist.cpduserdetails.dateofJoining
            //   this.logData.doctorLicenseNo=this.updatelist.cpduserdetails.doctorLicenseNo
            //   this.logData.payeeName=this.updatelist.bankdetails.payeeName
            //   this.logData.bankAccNo=this.updatelist.bankdetails.bankAccNo
            //   this.logData.ifscCode=this.updatelist.bankdetails.ifscCode
            //   this.logData.bankName=this.updatelist.bankdetails.bankName
            //   this.logData.branchName=this.updatelist.bankdetails.branchName
            //   this.logData.uploadPassbook=this.updatelist.bankdetails.uploadPassbook
            //   this.bankId=this.updatelist.bankdetails.bankId;
            //   this.logData.bankId=this.updatelist.bankdetails.bankId;
            //   this.isUpdateBtnInVisible=false;
            // });
            // this.swal("Success", data.message, "success");
            Swal.fire({
              title: 'Success?',
              text: data.message,
              icon: 'success',
              showCancelButton: false, // This removes the cancel button
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'ok',
              allowOutsideClick: false, // Prevent closing the dialog by clicking outside
              allowEscapeKey: false,    // Prevent closing the dialog with the escape key
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.reload();
              }
            }
            )

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
      this.swal("Info", "Name must be more than 5 character", 'info');
      return;
    }
  }

  checkUserName() {
    let userName = $('#username').val().toString().toLowerCase();
    if (!userName.match(this.minlengthforName)) {
      this.swal("Info", "Username must be more than 5 character", 'info');
      return;
    }
    this.snoService.checkDuplicateData(userName).subscribe(data => {
      console.log(data);
      if (data.status == "Present") {
        Swal.fire({
          icon: 'info',
          title: 'Info',
          text: 'Username already exists!'
        });
        return;
      }
    });
  }

  // checkLicense() {
  //   let userName=$('#username').val().toString().toLowerCase();
  //   let license=$('#Doctor').val().toString();
  //   if(license.length==0) {
  //     this.doc = 0;
  //   } else {
  //     this.createcpdservice.checkDuplicateLicense(license, userName).subscribe(data => {
  //       console.log(data);
  //       if (data.status == "Present") {
  //         this.doc = 2;
  //         $("#Doctor").focus();
  //         Swal.fire({
  //           icon: 'info',
  //           title: 'Info',
  //           text: 'Doctor license already exists!'
  //         })
  //         return;
  //       } else {
  //         this.doc = 1;
  //       }
  //     });
  //   }
  // }

}
