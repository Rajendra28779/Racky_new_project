import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CreatecpdserviceService } from 'src/app/application/Services/createcpdservice.service';
import { SnocreateserviceService } from 'src/app/application/Services/snocreateservice.service';
import { HeaderService } from '../../header.service';
import Swal from 'sweetalert2';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-createsno',
  templateUrl: './createsno.component.html',
  styleUrls: ['./createsno.component.scss']
})
export class CreatesnoComponent implements OnInit {

  AddForm: FormGroup;
  user: any;
  userIdd: any;
  bId: any;
  isUpdateBtnInVisible: boolean = true;
  isSave: boolean = false;
  submitted: boolean = false;
  mailformat = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
  // phonenoFormat = /^\d{10}$/;
  phonenoFormat = /[6-9][0-9]{9}$/;
  minlengthforName = /^[a-zA-Z ]{6,}$/;

  status: any;


  public stateList: any = [];
  public districtList: any = [];
  public hospitalList: any = [];
  @ViewChild('multiSelect') multiSelect;
  childmessage: any;
  constructor(private sessionService: SessionStorageService,private SnocreateserviceServ: SnocreateserviceService, public headerService: HeaderService,
    private CreatecpdserviceServic: CreatecpdserviceService, public fb: FormBuilder, private snoService: SnocreateserviceService, private route: Router) {

    this.bId = this.route.getCurrentNavigation().extras.state;
  }

  form: FormGroup;
  public settingDistrict = {};
  public settingHospital = {};

  updateuser:any;
  updateSNOuserName={
    userName:"",
    fullName:"",
    mobileNo:"",
    emailId:"",
    stateCode:"",
    districtCode:"",
    // hospitalCode:"",
    userId:"",
    districtId:"",
    hospitalId:"",
    status:""
  }

  ngOnInit() {
    this.AddForm = this.fb.group(
      {
        fullName: new FormControl(''),
        userName: new FormControl(''),
        mobileNo: new FormControl(''),
        emailId: new FormControl('', [Validators.required,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
        stateCode: new FormControl(''),
        districtCode: new FormControl(''),
        hospitalCode: new FormControl(null, []),
        userId: new FormControl(''),
        createdUserName: new FormControl(''),
        uId: new FormControl(''),
        status: new FormControl(''),

      }
    )
    this.headerService.setTitle("Create SNA");
    this.headerService.isIndicate(false);
    this.headerService.isBack(true)
    this.getStateList();
    this.settingHospital = {
      singleSelection: false,
      idField: 'hospitalCode',
      textField: 'hospitalName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 20,

    };
    this.user = this.sessionService.decryptSessionData("user");

    if (this.bId) {
      console.log(this.bId);
      console.log(this.bId.bskyUserId);

      this.isUpdateBtnInVisible = false;
      this.isSave = true;

      this.SnocreateserviceServ.forupdateByIDSNO(this.bId.bskyUserId).subscribe(
        (result: any) => {
          console.log(result);
          this.updateuser = result;
          console.log(this.updateuser.userName);
          this.updateSNOuserName.userName = this.updateuser.userName;
          this.updateSNOuserName.fullName = this.updateuser.fullName;
          this.updateSNOuserName.mobileNo = this.updateuser.mobileNo;
          this.updateSNOuserName.emailId = this.updateuser.emailId;
          this.updateSNOuserName.stateCode = this.updateuser.state.stateCode;
          this.updateSNOuserName.districtCode = this.updateuser.districtCode;
          this.updateSNOuserName.status=this.updateuser.status;
          // this.updateSNOuserName.hospitalCode = this.updateuser.hospitalInformation.hospitalCode;
          //this.updateSNOuserName.userName = this.updateuser.userName;
          // console.log("districtCode or districtId hospitalcode or hos")
          // console.log(this.updateSNOuserName);
          console.log("State Code On ngInit: " + this.updateuser.state.stateCode)
          this.OnChangeState(this.updateuser.state.stateCode);
          this.OnChangeDistrict(this.updateuser.districtCode);

          this.isUpdateBtnInVisible = false;
          this.isSave = true;
          this.status=this.updateuser.status;
        });
    }
  }
  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }
  get f() {
    return this.AddForm.controls;
  }

  getStateList() {
    this.snoService.getStateList().subscribe(
      (response) => {
        this.stateList = response;
        console.log(this.stateList);
      },
      (error) => console.log(error)
    )
  }
  OnChangeState(id) {
    $('#districtId').val("");
    localStorage.setItem("stateCode", id);
    console.log("State Id" + id);

    this.snoService.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = response;
        console.log("State List:")
        console.log(response);
      },
      (error) => console.log(error)
    )
  }

  OnChangeDistrict(id) {
    console.log("District Id : " + id)
    var stateCode = localStorage.getItem("stateCode");
    this.snoService.getHospitalbyDistrictId(id, stateCode).subscribe(
      (response) => {
        console.log("Hospital List---->>")
        //console.log(this.hospitalList);
        this.hospitalList = response;
        console.log(this.hospitalList);
      },
      (error) => console.log(error)
    )
  }

  yes($event: any) {
    this.status = 0;
  }

  no($event: any) {
    this.status = 1;
  }

  saveData() {
    this.SnocreateserviceServ.checkDuplicateData(this.updateSNOuserName.userName).subscribe(data => {
      console.log(data);
      if (data.status == "Present") {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Username already exists!'
        })
        return;
      }else{


        let fullName=$("#fullName").val().toString();
        let userName=$('#userName').val().toString().toLowerCase();
        let mobileNo=$('#mobileNo').val().toString();
        let emailId=$('#emailId').val().toString();
        let stateId=$('#stateId').val();
        let districtId=$('#districtId').val();
        //alert(districtId);
        // let hospitalCode=$('#hospitalCode').val();


        if(fullName==null || fullName=="" || fullName==undefined)
        {
          this.swal("Info","Please Enter Full Name",'info');
          return;
        }
        if (!fullName.match(this.minlengthforName)) {
          this.swal("Info", "Name must be more than 5 character", 'info');
          return;
        }
        if (userName == null || userName == "" || userName == undefined) {
          this.swal("Info", "Please Enter User Name", 'info');
          return;
        }
        if (userName.length <= 4) {
          this.swal("Info", "userName must be more than 5 character", 'info');
          return;
        }
        if (mobileNo == null || mobileNo == "" || mobileNo == undefined) {
          this.swal("Info", "Please Enter Mobile No", 'info');
          return;
        }
        if (!mobileNo.match(this.phonenoFormat)) {
          this.swal("Info", "Please Enter 10digit mobile No", 'info');
          return;
        }
        if (emailId == null || emailId == "" || emailId == undefined) {
          this.swal("Info", "Please Enter Email Id", 'info');
          return;
        }
        if (!emailId.match(this.mailformat)) {
          this.swal("Info", "Please Provide Valid Email", 'info');
          return;
        }
        if (stateId == null || stateId == "" || stateId == undefined) {
          this.swal("Info", "Please Select State", 'info');
          return;
        }
        if (districtId == null || districtId == "" || districtId == undefined) {
          this.swal("Info", "Please Select District", 'info');
          return;
        }
        // if(hospitalCode==null || hospitalCode=="" || hospitalCode==undefined)
        // {
        //   this.swal("Info","Please Enter hospital",'info');
        //   return;
        // }
        var userId = this.user.userId
        this.AddForm.controls['createdUserName'].setValue(userId);
        console.log(this.AddForm.value);

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

            this.SnocreateserviceServ.saveSNOData(this.AddForm.value).subscribe((response: any) => {
              //this.AddForm.value.userId = localStorage.getItem("userId");
              console.log(response);
              if(response==1){
                this.swal("Success", "SNA Details Saved Successfully", 'success');
                this.AddForm.reset();
                $("#stateId").val("");
                $("#districtId").val("");
              }
              else {
                this.swal("Error", "Some Error Occured", 'error');
              }
            },
              (error: any) => {
                this.swal("Error", error, 'error');
              }
            )
          }
        })
      }
    })
  }
  update(itemds: any) {
        let fullName=$("#fullName").val().toString();
        let userName=$('#userName').val();
        let mobileNo=$('#mobileNo').val().toString();
        let emailId=$('#emailId').val().toString();
        let stateId=$('#stateId').val();
        let districtId=$('#districtId').val();
       // let hospitalCode=$('#hospitalCode').val();

        if(fullName==null || fullName=="" || fullName==undefined)
        {
          this.swal("Info","Please Enter Full Name",'info');
          return;
        }
        if(!fullName.match(this.minlengthforName))
        {
          this.swal("Info","Name must be more than 5 character",'info');
          return;
        }
        if(mobileNo==null || mobileNo=="" || mobileNo==undefined)
        {
          this.swal("Info","Please Enter Mobile No",'info');
          return;
        }
        if(!mobileNo.match(this.phonenoFormat))
        {
          this.swal("Info","Please Enter 10digit mobileNo",'info');
          return;
        }
        if(emailId==null || emailId=="" || emailId==undefined)
        {
          this.swal("Info","Please Enter Email Id",'info');
          return;
        }
        if (!emailId.match(this.mailformat)){
          this.swal("Info", "Please Provide Valid Email", 'info');
          return;
        }
        if(stateId==null || stateId=="" || stateId==undefined)
        {
          this.swal("Info","Please Select State",'info');
          return;
        }
        if(districtId==null || districtId=="" || districtId==undefined)
        {
          this.swal("Info","Please Select District",'info');
          return;
        }
        // if(hospitalCode==null || hospitalCode=="" || hospitalCode==undefined)
        // {
        //   this.swal("Info","Please Enter hospital",'info');
        //   return;
        // }
          this.updateuser.userName = this.updateSNOuserName.userName;
          this.updateuser.fullName = this.updateSNOuserName.fullName;
          this.updateuser.mobileNo = this.updateSNOuserName.mobileNo;
          this.updateuser.emailId = this.updateSNOuserName.emailId;
          this.updateuser.stateCode = this.updateSNOuserName.stateCode;
          this.updateuser.districtCode = this.updateSNOuserName.districtCode;
          this.updateuser.status = this.status;
          //alert(this.updateuser.status);
          //this.updateuser.hospitalCode = this.updateSNOuserName.hospitalCode;
          this.AddForm.value.uId=this.updateuser.bskyUserId;
          this.AddForm.value.status=this.status;
          console.log("addform uid value is: ")
          console.log(this.AddForm.value.uId)
          console.log("addform value is: ")
          console.log(this.AddForm.value);
          console.log(this.updateuser);
          Swal.fire({
            title: 'Are you sure?',
             text: "You want to update the changes!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, update it!'
          }).then((result)=>{
          if(result.isConfirmed){

        this.SnocreateserviceServ.updateSNOuser(this.AddForm.value).subscribe((resp: any) => {
          console.log(resp)
          if (resp == 1) {
            Swal.fire("Info", "SNA Updated Successfully", "success");
            this.submitted = false;
            this.route.navigate(['/application/createsnoview']);
          } else if (resp == 2) {
            Swal.fire("Error", "SNA assigned to Hospital, cannot be made Inactive", "error");
          } else {
            Swal.fire("Error", "Some Error Occured", "error");
          }
        })

      }
    })
  }

  validatePhoneNo() {
    let mobileNo=$('#mobileNo').val().toString();
    if (!mobileNo.match(this.phonenoFormat)) {
      this.swal("Error", "Please Enter 10 digit Mobile No", 'error');
      $('#mobileNo').val("");
      return;
    }
  }

  validateEmail() {
    let emailId=$('#emailId').val().toString();
    if (!emailId.match(this.mailformat)) {
      this.swal("Error", "Please Provide Valid Email Id", 'error');
      $('#emailId').val("");
      return;
    }
  }

  validateName() {
    let fullName=$("#fullName").val().toString();
    if (!fullName.match(this.minlengthforName)) {
      this.swal("Info", "Name must be more than 5 character", 'info');
      $("#fullName").val("");
      return;
    }
  }

  validateUserName() {
    let userName=$('#userName').val().toString().toLowerCase();
    if (!userName.match(this.minlengthforName)) {
      this.swal("Info", "Username must be more than 5 character", 'info');
      $('#userName').val("");
      return;
    }
    this.SnocreateserviceServ.checkDuplicateData(userName).subscribe(data => {
      console.log(data);
      if (data.status == "Present") {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Username already exists!'
        });
        $('#userName').val("");
        return;
      }
    })
  }

  cancel1() {
    this.route.navigate(['/application/createsnoview']);
  }
  ResetForm() {

    this.districtList = null;
    this.hospitalList = null;
    this.AddForm.reset();
    this.submitted = false;
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
}
