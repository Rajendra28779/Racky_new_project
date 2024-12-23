import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { HospitalService } from '../../Services/hospital.service';
import * as $ from 'jquery';
import { Router } from '@angular/router';
import { HeaderService } from '../../header.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { environment } from 'src/environments/environment';
import { EncrypyDecrpyService } from 'src/app/services/form-services/encrypy-decrpy.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-hospitalprofile',
  templateUrl: './hospitalprofile.component.html',
  styleUrls: ['./hospitalprofile.component.scss']
})
export class HospitalprofileComponent implements OnInit {

  mailformat = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
  phonenoFormat = /[6-9][0-9]{9}$/;
  //minlengthforName = /^[a-zA-Z ]{6,}$/;
  submitted: boolean = false;
  item: any;
  getbyhId: any;
  cardtypeStatus: any;
  cardType: boolean;
  childmessage: any;
  assigndc: any;
  latitude: any;
  longitude: any;
  colors: string[] = ['blue', 'red'];
  currentIndex: number = 0;

  constructor(public encDec : EncrypyDecrpyService, public fb: FormBuilder, private hospitaService: HospitalService, private route: Router, public headerService: HeaderService,
    private sessionService: SessionStorageService) { }

  form: FormGroup;

  updateHospital = {
    hospitalId: "",
    hospitalCode: "",
    hospitalName: "",
    cpdApprovalRequired: "",
    stateId: "",
    districtId: "",
    districtName: "",
    stateCode: "",
    stateName: "",
    districtcode:"",
    mobile: "",
    emailId: "",
    dcname: "",
    snaname: "",
    latitude: "",
    longitude: "",
    hospitalType: "",
    tmsActiveStat: ""
  };
  // logData={
  //   hospitalId: "",
  //   userId: "",
  //   hospitalCode: "",
  //   hospitalName: "",
  //   cpdApprovalRequired: "",
  //   stateId: "",
  //   districtId: "",
  //   stateCode: "",
  //   districtcode:"",
  //   mobile: "",
  //   emailId: "",
  //   createdBy: "",
  //   assignedDc: "",
  //   status: "",
  //   latitude: "",
  //   longitude: ""
  // };
  ngOnInit(): void {
    this.openHospital();
    // this.headerService.setTitle("Hospital Profile");
    // this.headerService.isIndicate(false);
    // this.headerService.isBack(true)
    // this.item = JSON.parse(sessionStorage.getItem("user"));
    // console.log(this.item);
    // if (this.item) {
    //   //this.visibleupdate = true;
    //  this.getProfileDetails();
    // }
    // setInterval((timeout) => {
    //   $('#tag').css({
    //     color: this.colors[this.currentIndex]
    //   });
    //   if (!this.colors[this.currentIndex]) {
    //     this.currentIndex = 0;
    //   } else {
    //     this.currentIndex++;
    //   }
    // }, 200);
  }

  HospitalType = new FormGroup({
    hospitalName: new FormControl('', [Validators.required, ]),
    hospitalCode: new FormControl('', [Validators.required, ]),
    stateId: new FormControl('', [Validators.required, ]),
    districtId: new FormControl('', [Validators.required, ]),
    mobile: new FormControl('', [Validators.required, ]),
    emailId: new FormControl('', [Validators.required, ]),
    districtcode:new FormControl(''),
    districtName:new FormControl(''),
    stateCode:new FormControl(''),
    stateName:new FormControl(''),
    dcname: new FormControl(''),
    snaname: new FormControl(''),
    latitude: new FormControl('', [Validators.required, ]),
    longitude: new FormControl('', [Validators.required, ]),
    hospitalType: new FormControl('')
  });

  cpdReqrd: any;
  tmsActiveStat: any;

  getProfileDetails(){
    let userID = this.item.userId;
    this.hospitaService.getbyUserId(userID).subscribe(
      (result: any) => {
        this.getbyhId = result;
        console.log(this.getbyhId);
        this.updateHospital.hospitalName = this.getbyhId.hospital.hospitalName
        this.updateHospital.hospitalCode = this.getbyhId.hospital.hospitalCode
        this.updateHospital.stateId = this.getbyhId.hospital.districtcode.statecode.stateCode
        this.updateHospital.stateName = this.getbyhId.hospital.districtcode.statecode.stateName
        this.updateHospital.mobile = this.getbyhId.hospital.mobile
        this.updateHospital.districtId = this.getbyhId.hospital.districtcode.districtcode
        this.updateHospital.districtName = this.getbyhId.hospital.districtcode.districtname
        //alert(this.getbyhId.hospital.districtcode);
        this.updateHospital.emailId = this.getbyhId.hospital.emailId
        //this.updateHospital.stateCode=this.getbyhId.hospital.stateCode
        this.updateHospital.cpdApprovalRequired = this.getbyhId.hospital.cpdApprovalRequired
        this.updateHospital.snaname = this.getbyhId.snoName!=null?this.getbyhId.snoName:'None'
        this.updateHospital.dcname = this.getbyhId.dcName!=null?this.getbyhId.dcName:'None'
        if(this.getbyhId.hospital.latitude) {
          this.latitude = this.getbyhId.hospital.latitude.toString().trim()
          this.latitude = this.latitude.length>6?this.latitude.substring(0, 6):this.latitude
        }
        if(this.getbyhId.hospital.longitude) {
          this.longitude = this.getbyhId.hospital.longitude.toString().trim()
          this.longitude = this.longitude.length>6?this.longitude.substring(0, 6):this.longitude
        }
        this.cpdReqrd = this.getbyhId.hospital.cpdApprovalRequired;
        this.assigndc = this.getbyhId.hospital.assigned_dc
        this.updateHospital.hospitalType = this.getbyhId.categoryName!=null?this.getbyhId.categoryName:'-NA-';
        this.tmsActiveStat = this.getbyhId.hospital.userId.tmsLoginStatus;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  get f() {
    return this.HospitalType.controls;
  }

  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }

  getGeoLocation() {
    this.hospitaService.getPosition().then(pos=> {
      console.log(pos);
      this.latitude = pos.lat.toString().trim();
      this.latitude = this.latitude.length>6?this.latitude.substring(0, 6):this.latitude;
      this.longitude = pos.lng.toString().trim();
      this.longitude = this.longitude.length>6?this.longitude.substring(0, 6):this.longitude;
    },err=> {
      console.log('Error: ');
      console.log(err);
      if(err) {
        this.swal('Warning', 'Please allow location access', 'warning');
      }
    });
  }

  update(item: any) {
    this.submitted = true;
    let hospitalName = $("#hospitalName").val().toString();
    let mobile = $("#mobile").val().toString();
    let emailId = $("#emailId").val().toString();
    let latitude = $('#latitude').val().toString().trim();
    latitude = latitude.length>6?latitude.substring(0, 6):latitude;
    let longitude = $('#longitude').val().toString().trim();
    longitude = longitude.length>6?longitude.substring(0, 6):longitude;

    if (hospitalName == null || hospitalName == "" || hospitalName == undefined) {
      $("#hospitalName").focus();
      this.swal("Info", "Please enter Hospital name", 'info');
      return;
    }

    if (hospitalName.length<=6) {
      $("#hospitalName").focus();
      this.swal("Info", "Name must be more than 5 character", 'info');
      return;
    }
    if (mobile == null || mobile == "" || mobile == undefined) {
      $("#mobile").focus();
      this.swal("Info", "Please enter mobile number", 'info');
      return;
    }

    if (!mobile.match(this.phonenoFormat)) {
      $("#mobile").focus();
      this.swal("Info", "Please Enter valid Mobile No", 'info');
      return;
    }

    if (emailId == null || emailId == "" || emailId == undefined) {
      $("#emailId").focus();
      this.swal("Info", "Please enter mail Id", 'info');
      return;
    }

    if (!emailId.match(this.mailformat)) {
      $("#emailId").focus();
      this.swal("Info", "Please enter valid mail Id", 'info');
      return;
    }

    if (latitude == null || latitude == "" || latitude == undefined) {
      $("#latitude").focus();
      this.swal("Info", "Please enter Latitude", 'info');
      return;
    }

    if (longitude == null || longitude == "" || longitude == undefined) {
      $("#longitude").focus();
      this.swal("Info", "Please enter Longitude", 'info');
      return;
    }

    this.validateName();
    this.validatePhoneNo();
    this.validateEmail();

    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to update!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Update it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.hospitaService.saveHosplog(this.item.userId, this.item.userId).subscribe(data => {
          console.log(data.status+": "+data.message);
        });
        console.log(this.updateHospital);
        let object = {
          hospitalCode: this.updateHospital.hospitalCode,
          mobile: this.updateHospital.mobile,
          emailId: this.updateHospital.emailId,
          updatedBy: this.item.userId,
          latitude: latitude,
          longitude: longitude
        }
        //console.log('obj: '+object.districtId);
        this.hospitaService.updateHospitalProfile(object).subscribe(
          (result: any) => {
            console.log(result);
            if(result==1){
              this.item.phone=this.updateHospital.mobile;
              this.sessionService.encryptSessionData('user', this.item);
              // sessionStorage.setItem('user', JSON.stringify(this.item));
              Swal.fire("Success", "Hospital Updated Successfully!!", "success");
            }else{
              Swal.fire("Error", "Some Error Happened!!", "error")
            }
          }
        )
      }
    });
  }

  validatePhoneNo() {
    let mobile = $("#mobile").val().toString();
    if (!mobile.match(this.phonenoFormat)) {
      $("#mobile").focus();
      this.swal("Info", "Please Enter 10 digit Mobile No", 'info');
      return;
    }
  }

  validateEmail() {
    let emailId = $("#emailId").val().toString();
    if (!emailId.match(this.mailformat)) {
      $("#emailId").focus();
      this.swal("Info", "Please Provide Valid Email Id", 'info');
      return;
    }
  }

  validateName() {
    let hospitalName = $("#hospitalName").val().toString();
    if (hospitalName.length<=6) {
      $("#hospitalName").focus();
      this.swal("Info", "Hospital Name must be more than 5 character", 'info');
      return;
    }
  }

  validateHospital() {
    let hospitalCode = $("#hospitalCode").val().toString().toUpperCase();
    this.hospitaService.checkDuplicateCode(hospitalCode).subscribe(data => {
      console.log(data);
      if (data.status == "Present") {
        Swal.fire({
          icon: 'info',
          title: 'Info',
          text: 'Hospital already exists!'
        });
        return;
        } else {
          if (this.HospitalType.invalid) {
            Swal.fire("Warning", "This field can't be blank", 'warning')
            return;
          }

        }
      });
  }

  swal(title, text, icon) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  cancel() {
    this.route.navigate(['application/dashboard']);
  }

  keyfunction1(e){
    if (e.value[0] == " ") {
      $('#hospitalName').val('');
    }
    if (e.value[0] == " ") {
      $('#emailId').val('');
    }
  }

  openHospital(){
    // let user = sessionStorage.getItem("user");
    let user = this.sessionService.decryptSessionData("user");
    user = this.encDec.encText(user);
    // let token = sessionStorage.getItem("auth_token");
    let token = this.sessionService.decryptSessionData("auth_token");
    token = this.encDec.encText(token);
    let sessionId = this.sessionService.decryptSessionData("sessionId");
    sessionId = this.encDec.encText(sessionId);
    // window.location.href = environment.hospitalEmpanelmentUrl + user + '/' + token + '/' + sessionId;
    window.open(environment.hospitalEmpanelmentUrl + user + '/' + token + '/' + sessionId);
  }
}
