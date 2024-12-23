import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderService } from '../../header.service';
import Swal from 'sweetalert2';
import { UsercreateService } from '../../Services/usercreate.service';
import { HospitaloperatorService } from '../../Services/hospitaloperator.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-hospitaloperatorprofile',
  templateUrl: './hospitaloperatorprofile.component.html',
  styleUrls: ['./hospitaloperatorprofile.component.scss']
})
export class HospitaloperatorprofileComponent implements OnInit {

  childmessage: any;
  addForm!: FormGroup;
  user: any;
  status:any;
  curruser: any;
  submitted: boolean = false;
  mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  mobileformat=/[6-9][0-9]{9}$/;
  minlengthforName = /^[a-zA-Z0-9 ]{6,}$/;
  maxChars = 500;
  groupList: any = [];
  valid: any = 0;
  updatelist: any;
  updatinglist={
    fullname:"",
    username:"",
    mobile:"",
    email:"",
    groupId:"",
    stateCode:"",
    districtCode:"",
    address:"",
  }
  userId: any;
  public stateList: any = [];
  public districtList: any = [];

  constructor(private sessionService: SessionStorageService,public fb: FormBuilder, private route: Router, public headerService: HeaderService, private userService: UsercreateService,private hospoitalservice:HospitaloperatorService) {

  }

  ngOnInit(): void {
    this.headerService.setTitle('Create Hospital Operator');
    this.headerService.isIndicate(false);
    this.headerService.isBack(true);
    this.getStateList();

    this.addForm = this.fb.group({
      fullName: ['', [Validators.required, ]],
      userName: ['', [Validators.required, ]],
      mobileNo: ['', [Validators.required,]],
      emailId: ['', [Validators.required, ]],
      groupId:"",
      stateCode: ['', [Validators.required, ]],
      districtCode: ['', [Validators.required, ]],
      address: ['', [Validators.required, ]],
      createdUserName: [''],
      hospitalCode:[''],
      status:['']
    });
    this.getdata();
  }
  getdata(){
    let bid;
    let userid=this.sessionService.decryptSessionData("user");
    this.hospoitalservice.getoperatoridthroughuserid(userid.userId).subscribe((data:any)=>{
      bid=data;
      if(bid==null || bid==undefined || bid==""){
        this.swal("Error","Something Went Wrong","info");
        return;
      }else{
        this.hospoitalservice.getoperatorbyid(bid).subscribe((data:any)=>{
          console.log(data);
          this.updatelist=data.data;
          this.updatinglist.fullname=this.updatelist.fullName;
          this.updatinglist.username=this.updatelist.userName;
          this.updatinglist.mobile=this.updatelist.mobileNo;
          this.updatinglist.email=this.updatelist.email;
          this.updatinglist.groupId="16";
          this.updatinglist.stateCode=this.updatelist.stateCode;
          this.OnChangeState(this.updatinglist.stateCode);
          this.updatinglist.districtCode=this.updatelist.distCode;
          this.updatinglist.address=this.updatelist.address;
        });
      }
    });
  }

  getStateList() {
    this.userService.getStateList().subscribe(
      (response) => {
        this.stateList = response;
        //console.log(this.stateList);
      },
      (error) => console.log(error)
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
      (error) => console.log(error)
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
  }

  no($event: any) {
    this.status = 1;
  }

  keyPress(event: KeyboardEvent) {
    const pattern = /^[A-Za-z0-9.,-_ \\s]+$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
        event.preventDefault();
    }
  }

  ResetForm() {
    this.getdata();
  }


  updategroup(items:any) {
    this.submitted = true;
    let fullname = $('#fullname').val().toString();
    let Mobile = $('#mobile').val().toString();
    let Email = $('#email').val().toString();
    let groupId=$('#groupId').val();
    let stateId=$('#stateId').val();
    let districtId=$('#districtId').val();
    let address=$('#address').val();
    this.curruser =this.sessionService.decryptSessionData("user");
    let createon=this.curruser.userId;
    this.curruser =this.sessionService.decryptSessionData("user");
    if (groupId == null || groupId == "" || groupId == undefined) {
      $("#groupId").focus();
      this.swal("Info", "Please Select Group", 'info');
      return;
    }
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
    if(address.length<=10){
      $("#address").focus();
      this.swal("Info","Address must be more than 10 character",'info');
      return;
    }
    this.validateName();
    this.validatePhoneNo();
    this.validateEmail();

    this.addForm.value.uId=this.updatelist.operatorId;
    this.addForm.value.status=this.status;
    this.addForm.value.createdUserName = createon;
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
            this.getdata();
          }else {
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
    let mobileNo=$('#mobile').val().toString();
    if (!mobileNo.match(this.mobileformat)) {
      $("#mobile").focus();
      this.swal("Info", "Please Enter 10 digit Mobile No", 'info');
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
      //console.log(data);
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

}
