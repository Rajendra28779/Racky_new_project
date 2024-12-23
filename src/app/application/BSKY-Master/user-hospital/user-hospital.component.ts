import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import Swal from 'sweetalert2';
import { HospitalService } from '../../Services/hospital.service';
import * as $ from 'jquery';
import { Router } from '@angular/router';
import { HeaderService } from '../../header.service';
import { DcconfigurationService } from '../../Services/dcconfiguration.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';


@Component({
  selector: 'app-user-hospital',
  templateUrl: './user-hospital.component.html',
  styleUrls: ['./user-hospital.component.scss']
})
export class UserHospitalComponent implements OnInit {
  isvisiblesave: boolean;
  visibleupdate: boolean;
  submitted: boolean = false;
  public stateList: any = [];
  public districtList: any = [];
  public hospitalList: any = [];
  mailformat = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
  phonenoFormat = /[6-9][0-9]{9}$/;
  item: any;
  getbyhId?: any;
  cpdApprovalRequired: any = 0;
  tmsActiveStat: any = 0;
  childmessage: any;
  valid: any = 0;
  curruser: any;
  snoMappingId: any;
  public snoList: any = [];
  public dcList: any = [];
  public catList: any = [];
  stateCd: any = '';
  latitude: any;
  longitude: any;
  ipAddress: any;
  
  constructor(public fb: FormBuilder, private snoService: SnocreateserviceService, private dcService: DcconfigurationService, private hospitaService: HospitalService, private route: Router, public headerService: HeaderService,private sessionService: SessionStorageService) {
    this.item = this.route.getCurrentNavigation().extras.state;
  }

  updateHospital = {
    hospitalId: "",
    hospitalCode: "",
    hospitalName: "",
    cpdApprovalRequired: "",
    stateId: "",
    districtId: "",
    stateCode: "",
    districtcode:"",
    mobile: "",
    emailId: "",
    status: "",
    dcname: "",
    assignedDc: "",
    snaname: "",
    snoUserId: "",
    latitude: "",
    longitude: "",
    hospitalType: "",
    tmsActiveStat: ""
  };
  userId: any;

  ngOnInit(): void {
    this.headerService.setTitle("Create Hospital");
    this.headerService.isIndicate(false);
    this.headerService.isBack(true);
    this.curruser = this.sessionService.decryptSessionData("user");
    this.getStateList();
    this.getSNOList();
    this.getDCList();
    this.getCategoryList();
    this.getIpAddress();
    this.isvisiblesave = true;
    this.visibleupdate = false;
    if (this.item) {
      this.visibleupdate = true;
      this.isvisiblesave = false;
      this.hospitaService.getbyhId(this.item.hospitalId).subscribe(
        (result: any) => {
          this.getbyhId = result;
          this.userId = this.getbyhId.hospital.userId.userId
          this.updateHospital.hospitalName = this.getbyhId.hospital.hospitalName
          this.updateHospital.hospitalCode = this.getbyhId.hospital.hospitalCode
          this.updateHospital.stateId = this.getbyhId.hospital.districtcode.statecode.stateCode
          this.OnChangeState(this.updateHospital.stateId);
          this.updateHospital.districtId = this.getbyhId.hospital.districtcode.districtcode
          this.updateHospital.mobile = this.getbyhId.hospital.mobile
          this.updateHospital.emailId = this.getbyhId.hospital.emailId
          this.updateHospital.cpdApprovalRequired = this.getbyhId.hospital.cpdApprovalRequired
          this.cpdApprovalRequired = this.getbyhId.hospital.cpdApprovalRequired
          this.updateHospital.status = this.getbyhId.hospital.status
          if(this.getbyhId.hospital.latitude) {
            this.latitude = this.getbyhId.hospital.latitude.toString().trim()
            this.latitude = this.latitude.length>6?this.latitude.substring(0, 6):this.latitude
          }
          if(this.getbyhId.hospital.longitude) {
            this.longitude = this.getbyhId.hospital.longitude.toString().trim()
            this.longitude = this.longitude.length>6?this.longitude.substring(0, 6):this.longitude
          }
          if(this.getbyhId.hospital.assigned_dc) {
            this.updateHospital.dcname = this.getbyhId.dcName
            this.updateHospital.assignedDc = this.getbyhId.hospital.assigned_dc
          }
          if(this.getbyhId.sno) {
            this.updateHospital.snaname = this.getbyhId.snoName
            this.updateHospital.snoUserId = this.getbyhId.sno.snoUserId
            this.snoMappingId = this.getbyhId.sno.mappingId
          }
          this.updateHospital.hospitalType = this.getbyhId.hospital.hospitalCategoryid?this.getbyhId.hospital.hospitalCategoryid:'';
          this.updateHospital.tmsActiveStat = this.getbyhId.hospital.userId.tmsLoginStatus;
          this.tmsActiveStat = this.getbyhId.hospital.userId.tmsLoginStatus;
          this.isvisiblesave = false;
          this.visibleupdate = true;
        },
        (err: any) => {
          console.log(err);
        }
      );    
    }
  }

  getIpAddress() {
    this.snoService.getIpAddress().subscribe((res:any)=>{
      this.ipAddress = res.ip;
    });
  }

  HospitalType = new FormGroup({
    hospitalName: new FormControl('', [Validators.required, ]),
    hospitalCode: new FormControl('', [Validators.required, ]),
    stateId: new FormControl('', [Validators.required, ]),
    districtId: new FormControl('', [Validators.required, ]),
    status: new FormControl('', [Validators.required, ]),
    mobile: new FormControl('', [Validators.required, ]),
    emailId: new FormControl('', [Validators.required, ]),
    dcname: new FormControl(''),
    assignedDc: new FormControl('', [Validators.required, ]),
    snaname: new FormControl(''),
    snoUserId: new FormControl('', [Validators.required, ]),
    latitude: new FormControl('', [Validators.required, ]),
    longitude: new FormControl('', [Validators.required, ]),
    hospitalType: new FormControl('', [Validators.required, ])
  });

  getSNOList() {
    this.snoService.getSNODetails().subscribe(
      (response) => {
        this.snoList = response;
      },
      (error) => console.log(error)
    );
  }

  getDCList() {
    this.dcService.getDCDetails().subscribe(
      (response) => {
        this.dcList = response;
      },
      (error) => console.log(error)
    );
  }

  getCategoryList() {
    this.snoService.getHospitalCategoryList().subscribe(
      (response) => {
        this.catList = response;
      },
      (error) => console.log(error)
    );
  }

  getStateList() {
    this.snoService.getStateList().subscribe(
      (response) => {
        this.stateList = response;
      },
      (error) => console.log(error)
    );
  }


  OnChangeState(id) {
    this.stateCd = id;
    $('#districtId').val("");
    this.HospitalType.controls['districtId'].setValue("");
    localStorage.setItem("stateCode", id);
    this.snoService.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = response;
      },
      (error) => console.log(error)
    );
  }

  OnChangeDistrict(id) {
    var stateCode = localStorage.getItem("stateCode");
    this.snoService.getHospitalbyDistrictId(id, stateCode).subscribe(
      (response) => {
        this.hospitalList = response;
      },
      (error) => console.log(error)
    );
  }

  get f() {
    return this.HospitalType.controls;
  }

  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }

  yes($event: any) {
    this.cpdApprovalRequired = 0;
  }

  no($event: any) {
    this.cpdApprovalRequired = 1;
  }

  yes1($event: any) {
    this.tmsActiveStat = 0;
  }

  no1($event: any) {
    this.tmsActiveStat = 1;
  }

  resetVal() {
    this.valid = 0;
    this.submitted = false;
    this.stateCd = '';
  }
  
  saveHospital() {
    this.submitted = true;        
    let hospitalName = $("#hospitalName").val().toString();
    let hospitalCode = $("#hospitalCode").val().toString().toUpperCase();
    let mobile = $("#mobile").val().toString();
    let stateId = $("#stateId").val();
    let districtId = $("#districtId").val();
    let emailId = $("#emailId").val().toString();
    let cpdApprovalRequired = $("#cpdApprovalRequired").val();
    let dcId = $("#assignedDc").val();
    let snoUserId = $("#snoUserId").val();
    let latitude = $('#latitude').val().toString().trim();
    latitude = latitude.length>6?latitude.substring(0, 6):latitude;
    let longitude = $('#longitude').val().toString().trim();
    longitude = longitude.length>6?longitude.substring(0, 6):longitude;
    let hospitalType = $('#hospitalType').val();
    if (hospitalName == null || hospitalName == "" || hospitalName == undefined) {
      $("#hospitalName").focus();
      this.swal("Info", "Please enter Hospital name", 'info');
      return;
    }
    if (hospitalName.length<=6) {
      $("#hospitalName").focus();
      this.swal("Info", "Hospital Name must be more than 5 character", 'info');
      return;
    }
    if (hospitalCode == null || hospitalCode == "" || hospitalCode == undefined) {
      $("#hospitalCode").focus();
      this.swal("Info", "Please enter Hospital code", 'info');
      return;
    }
    if (mobile == null || mobile == "" || mobile == undefined) {
      $("#mobile").focus();
      this.swal("Info", "Please enter mobile number", 'info');
      return;
    }
    if (!mobile.match(this.phonenoFormat)) {
      $("#mobile").focus();
      this.swal("Info", "Please Enter Valid Mobile No", 'info');
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
    if (stateId == null || stateId == "" || stateId == undefined) {
      $("#stateId").focus();
      this.swal("Info", "Please select state", 'info');
      return;
    }
    if (districtId == null || districtId == "" || districtId == undefined) {
      $("#districtId").focus();
      this.swal("Info", "Please select disctrict", 'info');
      return;
    }
    if (cpdApprovalRequired == null || cpdApprovalRequired == "" || cpdApprovalRequired == undefined) {
      this.swal("Info", "Please provide the spc approval name", 'info');
      return;
    }
    if (hospitalType == null || hospitalType == "" || hospitalType == undefined) {
      $("#hospitalType").focus();
      this.swal("Info", "Please select Hospital Type", 'info');
      return;
    }
    if (snoUserId == null || snoUserId == "" || snoUserId == undefined) {
      $("#snoUserId").focus();
      this.swal("Info", "Please select SNA Doctor Name", 'info');
      return;
    }
    if (stateId == '21') {
      if (dcId == null || dcId == "" || dcId == undefined) {
        $("#assignedDc").focus();
        this.swal("Info", "Please select DC Name", 'info');
        return;
      }
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
    this.validateHospital();
    this.validatePhoneNo();
    this.validateEmail();
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      text: 'You want to save!',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Save it!'
    }).then((result) => {
      if (result.isConfirmed) {
        let object = {
          hospitalName: hospitalName,
          hospitalCode: hospitalCode,
          stateId: stateId,
          mobile: mobile,
          districtId: districtId,
          emailId: emailId,
          cpdApprovalRequired: this.cpdApprovalRequired,
          createdBy: this.curruser.userId,
          assignedDc: dcId,
          snoUserId: snoUserId,
          latitude: latitude,
          longitude: longitude,
          hospitalType: hospitalType
        }
        this.hospitaService.saveHospital(object).subscribe(
          (result: any) => {
            if(result==1){
              Swal.fire("Success", "Hospital Saved Successfully", "success")
              this.route.navigate(['application/viewhospital']);
              this.HospitalType.reset();
              $("#stateId").val("");
              $("#districtId").val("");
              $("#assignedDc").val("");
              $("#snoUserId").val("");
              $("#hospitalType").val("");
              $("#cpdApprovalRequired").prop("checked", true);
              this.valid = 0;
            } else {
              Swal.fire("Error", "Some Error Happened", "error")
            }
          },
          (err: any) => {
            console.log(err);
          }
        )
        this.submitted = false;
      }
    });
  }

  update(item: any) {
    this.submitted = true;
    let hospitalName = $("#hospitalName").val().toString();
    let mobile = $("#mobile").val().toString();
    let stateId = $("#stateId").val();
    let districtId = $("#districtId").val();
    let emailId = $("#emailId").val().toString();
    let cpdApprovalRequired = $("#cpdApprovalRequired").val();
    let dcId = $("#assignedDc").val();
    let snoUserId = $("#snoUserId").val();
    let latitude = $('#latitude').val().toString().trim();
    latitude = latitude.length>6?latitude.substring(0, 6):latitude;
    let longitude = $('#longitude').val().toString().trim();
    longitude = longitude.length>6?longitude.substring(0, 6):longitude;
    let hospitalType = $('#hospitalType').val();
    let tmsActiveStat = this.tmsActiveStat;
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
      this.swal("Info", "Please Enter Valid Mobile No", 'info');
      return;
    }
    if (stateId == null || stateId == "" || stateId == undefined) {
      $("#stateId").focus();
      this.swal("Info", "Please select state", 'info');
      return;
    }
    if (districtId == null || districtId == "" || districtId == undefined) {
      $("#districtId").focus();
      this.swal("Info", "Please select disctrict", 'info');
      return;
    }

    if (emailId == null || emailId == "" || emailId == undefined) {
      $("#emailId").focus();
      this.swal("Info", "Please enter email Id", 'info');
      return;
    }

    if (!emailId.match(this.mailformat)) {
      $("#emailId").focus();
      this.swal("Info", "Please enter valid email Id", 'info');
      return;
    }

    if (cpdApprovalRequired == null || cpdApprovalRequired == "" || cpdApprovalRequired == undefined) {
      this.swal("Info", "Please provide the spc approval name", 'info');
      return;
    }

    if (tmsActiveStat == null || tmsActiveStat === "" || tmsActiveStat == undefined) {
      this.swal("Info", "Please provide the tms active status", 'info');
      return;
    }

    if (hospitalType == null || hospitalType == "" || hospitalType == undefined) {
      $("#hospitalType").focus();
      this.swal("Info", "Please select Hospital Type", 'info');
      return;
    }

    if (snoUserId == null || snoUserId == "" || snoUserId == undefined) {
      this.swal("Info", "Please select SNA Doctor Name", 'info');
      return;
    }

    if (stateId == '21') {
      if (dcId == null || dcId == "" || dcId == undefined) {
        this.swal("Info", "Please select DC Name", 'info');
        return;
      }
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
      icon: 'warning',
      text: 'You want to update!',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Update it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.hospitaService.saveHosplog(this.userId, this.curruser.userId).subscribe(data => {
          if(data.status=='Success') {
            this.snoService.saveSNOConfigurationLogForHospital(this.updateHospital.hospitalCode, this.curruser.userId, this.ipAddress).subscribe(res => {
              if (res.status == "success") {
                let object = {
                  hospitalName: this.updateHospital.hospitalName,
                  hospitalCode: this.updateHospital.hospitalCode,
                  stateId: this.updateHospital.stateId,
                  mobile: this.updateHospital.mobile,
                  districtId: this.updateHospital.districtId,
                  emailId: this.updateHospital.emailId,
                  cpdApprovalRequired: this.cpdApprovalRequired,
                  hospitalId:this.getbyhId.hospital.hospitalId,
                  updatedBy: this.curruser.userId,
                  assignedDc: dcId,
                  snoUserId: snoUserId,
                  snoMappingId: this.snoMappingId,
                  latitude: latitude,
                  longitude: longitude,
                  hospitalType: hospitalType,
                  tmsActiveStat: this.tmsActiveStat
                }
                this.hospitaService.updateHospital(object).subscribe(
                  (result: any) => {
                    if(result==1){
                      Swal.fire("Success", "Hospital Updated Successfully!!", "success");
                      this.submitted = false;
                      this.route.navigate(['application/viewhospital']);
                    }else{
                      Swal.fire("Error", "Some Error Happened!!", "error");
                    }
                  }
                );
              } else {
                this.swal("Error", res.message, "error");
              }
            });
          } else {
            Swal.fire("Error", data.message, "error");
          }
        });        
      }
    });
  }

  validatePhoneNo() {
    let mobile = $("#mobile").val().toString();
    if (!mobile.match(this.phonenoFormat)) {
      $("#mobile").focus();
      this.swal("Info", "Please Enter Valid Mobile No", 'info');
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
      if (data.status == "Present") {
        this.valid = 2;
        $("#hospitalCode").focus();
        Swal.fire({
          icon: 'info',
          title: 'Info',
          text: 'Hospital already exists!'
        });
        return;
      } else {
        this.valid = 1;          
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

  cencel1() {
    this.route.navigate(['application/viewhospital']);
  }

  keyfunction1(e){
    if (e.value[0] == " ") {
      $('#hospitalName').val('');
    }
    if (e.value[0] == " ") {
      $('#emailId').val('');
    }
  }
}
