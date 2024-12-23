import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderService } from './../header.service';
import Swal from 'sweetalert2';
import { UsercreateService } from './../Services/usercreate.service';
import { SwastyaMitraHospitalService } from '../Services/swastya-mitra-hospital.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-smcreateuser',
  templateUrl: './smcreateuser.component.html',
  styleUrls: ['./smcreateuser.component.scss']
})
export class SmcreateuserComponent implements OnInit {

  childmessage: any;
  addForm!: FormGroup;
  user: any;
  curruser: any;
  bId: any;
  isUpdateBtnInVisible: boolean = true;
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
    groupId:14,
    stateCode:"",
    districtCode:"",
    address:"",
    date:""
  }
  userId: any;
  public stateList: any = [];
  public districtList: any = [];
  status:any=0;

  constructor(public fb: FormBuilder, private route: Router, public swastyaMitraHospitalService: SwastyaMitraHospitalService ,public headerService: HeaderService, private userService: UsercreateService, private encryptionService: EncryptionService, private sessionService: SessionStorageService) {
    this.bId = this.route.getCurrentNavigation().extras.state;
  }

  ngOnInit(): void {
    this.headerService.setTitle('Create Swasthyamitra User');
    this.headerService.isIndicate(false);
    this.headerService.isBack(true);
    this.getGroupList();
    this.getStateList();
    $('#doj').show();

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

    this.addForm = this.fb.group({
      fullName: ['', [Validators.required, ]],
      userName: ['', [Validators.required, ]],
      mobileNo: ['', [Validators.required,]],
      emailId: ['', [Validators.required, ]],
      groupId: ['', [Validators.required, ]],
      stateCode: ['', [Validators.required, ]],
      districtCode: ['', [Validators.required, ]],
      address: ['', [Validators.required, ]],
      date: ['', [Validators.required, ]],
      createdUserName: [''],
      status:['']
    });
    this.isUpdateBtnInVisible=true;
    if(this.bId) {
      this.isUpdateBtnInVisible = false;
      this.userService.getbyid(this.bId.bskyUserId).subscribe(data=>{
        this.updatelist=data;
        this.userId=this.updatelist.userId.userId;
        this.updatinglist.fullname=this.updatelist.fullName;
        this.updatinglist.username=this.updatelist.userName;
        this.updatinglist.mobile=this.updatelist.mobileNo;
        this.updatinglist.email=this.updatelist.emailId;
        this.updatinglist.groupId=this.updatelist.groupId.typeId;
        this.updatinglist.stateCode=this.updatelist.districtCode.statecode.stateCode;
        this.OnChangeState(this.updatinglist.stateCode);
        this.updatinglist.districtCode=this.updatelist.districtCode.districtcode;
        this.updatinglist.address=this.updatelist.address;
        this.updatinglist.date=this.updatelist.dateofjoin;
        this.status=this.updatelist.status;
        if(this.updatelist.groupId.typeId==14){
          $('#doj').show();
        }
        this.isUpdateBtnInVisible=false;
      });
    }
  }

  getStateList() {
    this.userService.getStateList().subscribe(
      (response) => {
        this.stateList = response;
      },
      (error) => console.log(error)
    )
  }

  OnChangeState(id) {
    $('#districtId').val("");
    this.addForm.value.districtCode = "";
    this.updatinglist.districtCode = "";
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

  getGroupList() {
    let groups;
    this.userService.getGroupList().subscribe(
      (response : any) => {
        response = this.encryptionService.getDecryptedData(response);
        groups = response.data;
        for(var i=0;i<groups.length;i++) {
          var g = groups[i];
          if(g.typeId!=3&&g.typeId!=5&&g.typeId!=16) {
            this.groupList.push(g);
          }
        }
      },
      (error) => console.log(error)
    )
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

  showdoj:Boolean=false
  swasgroup(){
    let groupId=$('#groupId').val();
    if(groupId==14){
      this.showdoj=true;
      $('#doj').show();
    }else{
      this.showdoj=false;
      $('#doj').hide();
    }
  }

  SubmitCreate() {
    this.submitted = true;
    let fullname = $('#fullname').val().toString();
    let username = $('#username').val().toString().toLowerCase();
    let Mobile = $('#mobile').val().toString();
    let Email = $('#email').val().toString();
    let groupId=$('#groupId').val();
    let stateId=$('#stateId').val();
    let districtId=$('#districtId').val();
    let address=$('#address').val();
    this.curruser =this.sessionService.decryptSessionData("user");
    let createon=this.curruser.userId;
    let date=$('#date').val();

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
    if(groupId==14){
      if(date == null || date == "" || date == undefined){
        $("#date").focus();
        this.swal("Info","Please Enter Date Of Joining",'info');
        return;
      }
    }
    this.validateName();
    this.checkUserName();
    this.validatePhoneNo();
    this.validateEmail();

    // this.addForm.value.userName = username;
    this.addForm.value.createdUserName = createon;
    this.addForm.value.date = date;

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

        this.userService.saveData(this.addForm.value).subscribe(data => {
          if (data==1) {
            this.swal("Success", "User Details Saved Successfully", "success");
            this.route.navigate(['application/smuserview']);
            this.addForm.reset();
            $("#groupId").val("");
            $("#stateId").val("");
            $("#districtId").val("");
            this.OnChangeState("");
            this.valid = 0;
            this.submitted = false;
          }else{
            this.swal("Error", "Some Error Occured", "error");
          }
        },
        (error: any) => {
          this.swal("Error", error, 'error');
        });
      }
    });
  }

  ResetForm() {
    this.route.navigate(['application/smuserview']);
  }

  resetVal() {
    this.submitted = false;
    this.valid = 0;
  }

  updategroup(items:any) {

    this.submitted = true;
    let fullname = $('#fullname').val().toString();
    let username = $('#username').val().toString().toLowerCase();
    let Mobile = $('#mobile').val().toString();
    let Email = $('#email').val().toString();
    let groupId=$('#groupId').val();
    let stateId=$('#stateId').val();
    let districtId=$('#districtId').val();
    let address=$('#address').val();
    this.curruser =this.sessionService.decryptSessionData("user");
    let createon=this.curruser.userId;
    let date=$('#date').val();
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
    if(groupId==14){
      if(date == null || date == "" || date == undefined){
        $("#date").focus();
        this.swal("Info","Please Enter Date Of Joining",'info');
        return;
      }
    }
    this.validateName();
    this.validatePhoneNo();
    this.validateEmail();

    this.addForm.value.uId=this.updatelist.bskyUserId;
    this.addForm.value.createdUserName = createon;
    this.addForm.value.date = date;
    this.addForm.value.status=this.status;
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
        this.userService.saveProfilelog(this.userId, createon).subscribe((response: any) => {
          response = this.encryptionService.getDecryptedData(response);
          if(response.status == "success")
            console.log(response.data.status+" : "+response.data.message);
          else
            console.log(response.message);
        });
        this.swastyaMitraHospitalService.inactiveSwasthyaMitra(this.curruser.userId,this.updatelist.userId.userId,this.status).subscribe(
          (data) => {
            this.userService.updateUser(this.addForm.value).subscribe(data => {
              if (data == 1) {
                this.swal("Success", "User Details Updated Successfully", "success");
                this.submitted = false;
                this.route.navigate(['application/smuserview']);
              }else {
                this.swal("Error", "Some Error Occured", "error");
              }
            },
            (error: any) => {
              this.swal("Error", error, 'error');
            });
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
