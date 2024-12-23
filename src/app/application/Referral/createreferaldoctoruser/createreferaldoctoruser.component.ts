import { IfStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { ReferralService } from '../../Services/referral.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { UsercreateService } from '../../Services/usercreate.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-createreferaldoctoruser',
  templateUrl: './createreferaldoctoruser.component.html',
  styleUrls: ['./createreferaldoctoruser.component.scss']
})
export class CreatereferaldoctoruserComponent implements OnInit {
  isUpdateBtnInVisible:any=true;
  mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  mobileformat=/[6-9][0-9]{9}$/;
  minlengthforName = /^[a-zA-Z0-9 ]{6,}$/;
  maxChars = 500;
  valid: any = 0;
  user:any;user1:any
  status:any
  districtList: any=[];
  blocklist: any=[];
  hosptypelist:any=[]

  constructor(private userService: ReferralService,private snoService: SnocreateserviceService,private route: Router, public headerService: HeaderService,private sessionService: SessionStorageService,
    ) {
    this.user1 = this.route.getCurrentNavigation().extras.state;
  }

  ngOnInit(): void {
    this.headerService.setTitle('Create Referral Doctor');
    // this.user=JSON.parse(sessionStorage.getItem("user"));
    this.user = this.sessionService.decryptSessionData("user");
    if(this.user1){
        this.updatinglist.fullname=this.user1.fullname
        this.updatinglist.username=this.user1.username
        this.updatinglist.mobile=this.user1.mobileno
        this.updatinglist.email=this.user1.email
        this.updatinglist.status=this.user1.stsus
        this.status=this.user1.stsus
        this.updatinglist.license=this.user1.license
        this.isUpdateBtnInVisible=false;
    }
  }

  updatinglist={
    fullname:"",
    username:"",
    mobile:"",
    email:"",
    license:"",
    status:""
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  validatePhoneNo() {
    let mobileNo=$('#mobile').val().toString();
    if(mobileNo.length<10){
      $("#mobile").focus();
      this.swal("Info", "Please Enter 10 digit Mobile No", 'info');
      return;
    }
    if (!mobileNo.match(this.mobileformat)) {
      $("#mobile").focus();
      this.swal("Info", "Please Provide Valid Mobile No", 'info');
      return;
    }
  }

  validateEmail() {
    let emailId=$('#email').val().toString();
    if (!emailId.match(this.mailformat)) {
      $("#email").focus();
      this.swal("Info", "Please Provide Valid Email Id", 'info');
      return;
    }
  }

  validateName() {
    let fullName=$("#fullname").val().toString();
    if (fullName.length<=4) {
      $("#fullname").focus();
      this.swal("Info", "Full Name must be more than 5 character", 'info');
      return;
    }
  }

  checkUserName() {
    let userName=$('#username').val().toString().toLowerCase();
    if (!userName.match(this.minlengthforName)) {
      this.valid = 0;
      $("#username").focus();
      this.swal("Info", "Username must be more than 5 character", 'info');
      return;
    }
    this.userService.checkDuplicateUser(userName).subscribe(data => {
      console.log(data);
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

  resetVal() {
    $('#username').val('');
    $("#fullname").val('');
    $('#email').val('');
    $('#mobile').val('');
    $('#license').val('');
 }

 SubmitCreate(){
  let fullname = $('#fullname').val().toString();
    let username = $('#username').val().toString().toLowerCase();
    let Mobile = $('#mobile').val().toString();
    let Email = $('#email').val().toString();
    let license = $('#license').val().toString();
    if (fullname==null || fullname== "" || fullname==undefined){
      $("#fullname").focus();
      this.swal("Info", "Please Enter Full Name", 'info');
      return;
    }
    if(fullname.length<=4){
      $("#fullname").focus();
      this.swal("Info","Fullname must be more than 5 character",'info');
      return;
    }
    if (username==null || username== "" || username==undefined){
      $("#username").focus();
      this.swal("Info", "Please Enter Username", 'info');
      return;
    }
    if (Mobile==null || Mobile== "" || Mobile==undefined){
      $("#mobile").focus();
      this.swal("Info", "Please Enter Mobile No", 'info');
      return;
    }
    if (!(Mobile.toString()).match(this.mobileformat)){
      $("#mobile").focus();
      this.swal("Info", "Please Enter Valid Mobile No", 'info');
      return;
    }
    if (Email==null || Email== "" || Email==undefined){
      $("#email").focus();
      this.swal("Info", "Please Enter Email", 'info');
      return;
    }
    if (!Email.match(this.mailformat)){
      $("#email").focus();
      this.swal("Info", "Please Provide Valid Email", 'info');
      return;
    }

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
        let object={
          fullname:fullname,
          username:username,
          mobileno:Mobile,
          emailid:Email,
          licenseno:license,
          createby:this.user.userId
        }

        this.userService.savereferaldoctor(object).subscribe((data:any)=>{
          console.log(data);
          if(data.status==200){
            this.swal("Success", data.message, 'success');
            $('#username').val('');
            $("#fullname").val('');
            $('#email').val('');
            $('#mobile').val('');
            $('#license').val('');
            this.route.navigate(['application/referaldoctorview']);
          }else{
            this.swal("Error", data.message, 'error');
          }
        });
      }
    });
 }
 yes($event: any) {
  this.status = 0;
}

no($event: any) {
  this.status = 1;
}

 ResetForm(){
  this.route.navigate(['application/referaldoctorview']);
 }

 updategroup(item:any){
  let fullname = $('#fullname').val().toString();
    let username = $('#username').val().toString().toLowerCase();
    let Mobile = $('#mobile').val().toString();
    let Email = $('#email').val().toString();
    let license = $('#license').val().toString();
  if (fullname==null || fullname== "" || fullname==undefined){
    $("#fullname").focus();
    this.swal("Info", "Please Enter Full Name", 'info');
    return;
  }
  if(fullname.length<=4){
    $("#fullname").focus();
    this.swal("Info","Fullname must be more than 5 character",'info');
    return;
  }
  if (username==null || username== "" || username==undefined){
    $("#username").focus();
    this.swal("Info", "Please Enter Username", 'info');
    return;
  }
  if (Mobile==null || Mobile== "" || Mobile==undefined){
    $("#mobile").focus();
    this.swal("Info", "Please Enter Mobile No", 'info');
    return;
  }
  if (!(Mobile.toString()).match(this.mobileformat)){
    $("#mobile").focus();
    this.swal("Info", "Please Enter Valid Mobile No", 'info');
    return;
  }
  if (Email==null || Email== "" || Email==undefined){
    $("#email").focus();
    this.swal("Info", "Please Enter Email", 'info');
    return;
  }
  if (!Email.match(this.mailformat)){
    $("#email").focus();
    this.swal("Info", "Please Provide Valid Email", 'info');
    return;
  }
  Swal.fire({
    title: 'Are you sure?',
    text: "You want to Update this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, Save it!'
  }).then((result) => {
    if (result.isConfirmed) {
      let object={
        fullname:fullname,
        mobileno:Mobile,
        emailid:Email,
        licenseno:license,
        updateby:this.user.userId,
        status:this.status,
        doctorid:this.user1.id
      }

      this.userService.updatereferaldoctor(object).subscribe((data:any)=>{
        console.log(data);
        if(data.status==200){
          this.swal("Success", data.message, 'success');
          $('#username').val('');
          $("#fullname").val('');
          $('#email').val('');
          $('#mobile').val('');
          $('#license').val('');
          this.route.navigate(['application/referaldoctorview']);
        }else{
          this.swal("Error", data.message, 'error');
        }
      });
    }
  });
 }
}
