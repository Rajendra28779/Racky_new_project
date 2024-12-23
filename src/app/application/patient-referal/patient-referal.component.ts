import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../header.service';
import { ReferalService } from '../Services/referal.service';
import { SnoCLaimDetailsService } from '../Services/sno-claim-details.service';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import { VitalStatisticsService } from '../Services/vital-statistics.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-patient-referal',
  templateUrl: './patient-referal.component.html',
  styleUrls: ['./patient-referal.component.scss']
})
export class PatientReferalComponent implements OnInit {

  statelist: Array<any> = [];
  stateData: any = [];
  distList: any;
  distCode: any;
  stateCode: any;
  maxChars = 200;
  user: any;
  userId: any;
  vitals: any;
  public stateList: any = [];
  public districtList: any = [];
  public hospitalList: any = [];
  stateCd: any = '';
  referal: FormGroup;
  sno: {
    vital: string; value: string;
  };
  addVitals: any = [];
  viewVitals: any = [];
  fileToUpload?: File;
  flag: boolean;
  stateNameList: any;
  patientName: any;
  patientAge: number;
  patientGender: any='';
  districtNameList: any;
  hospitalNameList: any;
  lId: any;
  memberId: any;
  vtl: string;
  sn1: { vital: string; value: string; };

  constructor(
    public headerService: HeaderService,
    public referalService: ReferalService,
    public fb: FormBuilder,
    public router: Router,
    public vitalStatisticsService: VitalStatisticsService,
    private snoService: SnocreateserviceService,private sessionService: SessionStorageService
  ) { }

  ngOnInit(): void {
    this.headerService.setTitle('Patient Referral Form');
    this.user = this.sessionService.decryptSessionData("user");
    console.log(this.user)
    console.log(this.user.userId)
    this.getVitals();
    this.getStateList();
    this.getSchemeList();
    this.referal = this.fb.group({
      schemeName: [{ value: '1', disabled: false }, [Validators.required,]],
      categoryName: ['', [Validators.required,]],
      patientName: ['', [Validators.required,]],
      age: ['', [Validators.required,]],
      gender: ['', [Validators.required,]],
      regdno: ['', [Validators.required,]],
      urn: ['', [Validators.required,]],
      memberId: ['', [Validators.required,]],
      referralDate: ['', [Validators.required,]],
      vitalsValue: ['', [Validators.required,]],
      vital: ['', [Validators.required,]],
      fromHospitalName: ['', [Validators.required,]],
      fromDrName: ['', [Validators.required,]],
      fromDeptName: ['', [Validators.required,]],
      fromReferralDate: ['', [Validators.required,]],
      stateId: ['', [Validators.required,]],
      districtId: ['', [Validators.required,]],
      toHospital: ['', [Validators.required,]],
      toHospitalCode: ['', [Validators.required]],
      reasonForRefer: ['', [Validators.required,]],
      toReferralDate: ['', [Validators.required,]],
      diagnosis: [''],
      briefHistory: [''],
      treatmentGiven: [''],
      investigationRemark: [''],
      treatmentAdvised: [''],
      document: [''],
      referedThrough: ['', [Validators.required,]],
      approvedBy: [this.user.userId],
      createdBy: [this.user.userId],
      updatedBy: [this.user.userId]
    });
    console.log(this.referal);
    this.getSchemeCategoryList();
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
      format: 'DD-MM-YYYY LT',
      daysOfWeekDisabled: ['', 7],
    });

  }

  getVitals() {
    this.vitalStatisticsService.getalldata().subscribe((data: any) => {
      this.vitals = data;
      console.log(this.vitals)
    })
  }

  validateVitalParameterInput(event: any) {
    const invalidChars = /[\\[\];:+={}!@#$%^&*()<>~`|_-]/g;
    (event.target as HTMLInputElement).value = (event.target as HTMLInputElement).value.replace(invalidChars, '');
  }

  add() {
    this.sno = {
      vital: "",
      value: "",
    };
    this.sn1 = {
      vital: "",
      value: "",
    };
    this.sno.vital = this.referal.value.vital;
    this.sno.value = this.referal.value.vitalsValue;

    this.sn1.vital = this.referal.value.vital;
    this.sn1.value = this.referal.value.vitalsValue;

    this.vtl = this.sno.vital.substring(0, this.sno.vital.indexOf("("))
    this.sn1.vital = this.vtl;
    if (this.sno.vital == null || this.sno.vital == '' || this.sno.vital == 'undefined') {
      // $("#urn").focus();
      this.swal("Info", "Please Select Vital Parameter", 'info');
      return;
    }

    if (this.sno.value == null || this.sno.value == '' || this.sno.value == 'undefined') {
      // $("#urn").focus();
      this.swal("Info", "Please Enter Vital Parameter Value", 'info');
      return;
    }
    for(const element of this.addVitals){
      if(this.sno.vital==element.vital){
        this.swal("Info", "Vital Parameter Already Selected ", 'info');
        return;
      }
    }
    this.addVitals.push(this.sno);
    this.viewVitals.push(this.sn1);
    $("#vital").val('');
    $("#vitalsValue").val('');
    this.referal.value.vita='';
    this.referal.value.vitalsValue='';
  }

  remove(v) {
    this.addVitals.splice(v, 1);
    this.viewVitals.splice(v, 1);
  }

  getStateList() {
    this.snoService.getStateList().subscribe(
      (response) => {
        this.stateList = response;
        console.log(this.stateList);
      },
      (error) => console.log(error)
    );
  }
  schemeList: any = [];
  getSchemeList(){
    this.referalService.getSchemeList().subscribe(
      (response:any) => {
        this.schemeList = response;
        console.log(this.schemeList);
      },
      (error) => console.log(error)
    );
  }
  schemeCategoryList: any = [];
  getSchemeCategoryList() {
    let schemeId=this.referal.get('schemeName').value;
    this.referalService.getSchemeCategoryById(schemeId).subscribe(
      (response:any) => {
        this.schemeCategoryList = response;
        console.log(this.schemeCategoryList);
      },
      (error) => console.log(error)
    );
  }
  OnChangeState(id) {
    this.stateCd = id;
    $('#districtId').val("");
    console.log("State Id : " + id)
    localStorage.setItem("stateCode", id);
    this.snoService.getDistrictListByStateId(id).subscribe(
      (response) => {
        console.log(response);
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
        console.log(response);
      },
      (error) => console.log(error)
    );
  }

  swal(title, text, icon) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    }).then(function () {
    });
  }

  save() {
    let schemeId=this.referal.get('schemeName').value;
    let schemeCategoryId = this.referal.value.categoryName;
    let urn = this.referal.value.urn;
    let patientName = this.referal.value.patientName;
    let regdno = this.referal.value.regdno;
    let referralDate = this.referal.value.referralDate;
    let fromHospitalName = this.referal.value.fromHospitalName;
    let fromDrName = this.referal.value.fromDrName;
    let fromDeptName = this.referal.value.fromDeptName;
    let fromReferralDate = this.referal.value.fromReferralDate;
    let stateId = this.referal.value.stateId;
    let districtId = this.referal.value.districtId;
    let toHospital = this.referal.value.toHospital;
    let reasonForRefer = this.referal.value.reasonForRefer
    let toReferralDate = this.referal.value.toReferralDate;
    let gender=this.patientGender;
    let age:any=this.patientAge;
    if (schemeCategoryId == null || schemeCategoryId == '' || schemeCategoryId == 'undefined') {
      $("#categoryName").focus();
      this.swal("Info", "Please Select Scheme Category Name", 'info');
      return;
    }
    if (urn == null || urn == '' || urn == 'undefined') {
      $("#urn").focus();
      this.swal("Info", "Please Enter Card No.", 'info');
      return;
    }

    if (patientName == null || patientName == '' || patientName == 'undefined') {
      $("#patientName").focus();
      this.swal("Info", "Please Select Patient Name", 'info');
      return;
    }
    if (gender == null || gender == '' || gender == 'undefined') {
      $("#gender").focus();
      this.swal("Info", "Please Select Gender", 'info');
      return;
    }
    if (age == null || age == '' || age == 'undefined') {
      $("#age").focus();
      this.swal("Info", "Age Should not be blank", 'info');
      return;
    }
    if (regdno == null || regdno == '' || regdno == 'undefined') {
      $("#regdno").focus();
      this.swal("Info", "Please Enter RegdNo", 'info');
      return;
    }

    if (referralDate == null || referralDate == '' || referralDate == 'undefined') {
      $("#referralDate").focus();
      this.swal("Info", "Please Enter Referral Date", 'info');
      return;
    }

    if (fromHospitalName == null || fromHospitalName == '' || fromHospitalName == 'undefined') {
      $("#fromHospitalName").focus();
      this.swal("Info", "Please Enter Hospital Name", 'info');
      return;
    }

    if (fromDrName == null || fromDrName == '' || fromDrName == 'undefined') {
      $("#fromDrName").focus();
      this.swal("Info", "Please Enter Doctor Name", 'info');
      return;
    }

    if (fromDeptName == null || fromDeptName == '' || fromDeptName == 'undefined') {
      $("#fromDeptName").focus();
      this.swal("Info", "Please Enter Department Name", 'info');
      return;
    }

    if (fromReferralDate == null || fromReferralDate == '' || fromReferralDate == 'undefined') {
      $("#fromReferralDate").focus();
      this.swal("Info", "Please Enter Referral From Date", 'info');
      return;
    }

    if (stateId == null || stateId == '' || stateId == 'undefined') {
      $("#stateId").focus();
      this.swal("Info", "Please Select State Name", 'info');
      return;
    }

    if (districtId == null || districtId == '' || districtId == 'undefined') {
      $("#districtId").focus();
      this.swal("Info", "Please Select District Name", 'info');
      return;
    }

    if (toHospital == null || toHospital == '' || toHospital == 'undefined') {
      $("#toHospital").focus();
      this.swal("Info", "Please Select Hospital", 'info');
      return;
    }

    if (reasonForRefer == null || reasonForRefer == '' || reasonForRefer == 'undefined') {
      $("#reasonForRefer").focus();
      this.swal("Info", "Please Enter Reason", 'info');
      return;
    }

    if (toReferralDate == null || toReferralDate == '' || toReferralDate == 'undefined') {
      $("#toReferralDate").focus();
      this.swal("Info", "Please Enter Referral To Date", 'info');
      return;
    }

    console.log(this.referal.value)
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Save it!'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(this.referal.value)
        console.log(this.fileToUpload);
        this.referal.value.vitalParam = this.addVitals;
        this.referal.value.memberId = this.memberId;
        this.referal.value.schemeName = schemeId;
        this.referalService.saveReferal(this.referal.value).subscribe((data: any) => {
          if (data.status == "Success") {
            console.log(data.message)
            this.lId = data.message
            console.log(this.lId)
            const formData: FormData = new FormData();
            formData.append('file', this.fileToUpload);
            formData.append('refId', this.lId);
            console.log(formData)
            this.referalService.saveReferalDoc(formData).subscribe((data: any) => {
              if (data.status == "Success") {
                this.swal("Success", "Referral Form Saved Successfully", "success");
                this.router.navigate(['/application/patientformview']);
              } else if (data.status == "Failed") {
                this.swal("Error", data.message, "error");
              }
            })
            this.swal("Success", "Referral Form Saved Successfully", "success");
            this.router.navigate(['/application/patientformview']);
          } else if (data.status == "Failed") {
            this.swal("Error", data.message, "error");
          }
        })
      }
    });
  }

  search() {
    let schemeCategoryId =this.referal.value.categoryName;
    let urn = $('#urn').val().toString();
    if (schemeCategoryId == null || schemeCategoryId == '' || schemeCategoryId == undefined) {
      $("#categoryName").focus();
      this.swal("Info", "Please Select Scheme Category Name", 'info');
      return;
    }
    if (urn == null || urn == '' || urn == 'undefined') {
      $("#urn").focus();
      this.swal("Info", "Please Enter Card No.", 'info');
      return;
    }

    this.referalService.getNameByCardNo(schemeCategoryId,urn).subscribe((data: any) => {
      console.log(data.length)
      if (data.length > 0) {
        this.patientName = data;
      } else {
        this.swal('', 'Please Enter Valid Card No.', 'error');
      }
    })
  }

  onChangePatientName(name) {
    localStorage.setItem("fullNameEnglish", name);
    this.referalService.getAgeAndGenderByName(name).subscribe((data: any) => {
      this.patientAge = data.age;
      this.patientGender = data.gender;
      this.memberId = data.memberId;
      if (this.patientGender == "Male") {
        this.patientGender = 'M'
      }
      if (this.patientGender == "Female") {
        this.patientGender = 'F'
      }
      console.log(data)
    })
  }
  onChangeCategory() {
    this.referal.get('urn').setValue('');
    this.patientName=[];
    this.referal.get('patientName').setValue('')
    this.referal.get('age').setValue('');
    this.referal.get('gender').setValue('');
  }
  handleFileInput(event: any) {
    this.fileToUpload = event.target.files[0];
    var filename = event.target.files[0];
    var extension = filename.name.split('.').pop();
    console.log(extension);
    var allowedExtensions = /(\jpg|\jpeg|pdf)$/i;
    if (!allowedExtensions.exec(extension)) {
      this.swal('Warning', 'DOCX, DOC, EXE is Not allowed', 'warning');
      $('#document').val('');
      return;
    }
    if (Math.round(this.fileToUpload.size / 1024) >= 3100) {
      this.swal('Warning', ' Please Provide Document Size Less than 3MB', 'warning');
      $('#document').val('');
      this.fileToUpload = event.target.files[0];
      this.flag = false;
    } else {
      this.flag = true;
    }
  }

  numericOnly(event) {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }

  reset() {
    window.location.reload();
  }

}
