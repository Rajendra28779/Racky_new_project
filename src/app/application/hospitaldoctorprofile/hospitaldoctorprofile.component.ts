import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../header.service';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import { UsermanualService } from '../Services/usermanual.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Console } from 'console';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-hospitaldoctorprofile',
  templateUrl: './hospitaldoctorprofile.component.html',
  styleUrls: ['./hospitaldoctorprofile.component.scss']
})
export class HospitaldoctorprofileComponent implements OnInit {
  user: any;
  profileid: any;
  type: any;
  speciality_code: any;
  speciality_name: any;
  speciality_id: any;
  currentPage: any;
  pageElement: any;
  showPegi: boolean;
  txtsearchDate: any;
  public dcList: any = [];
  public stateList: any = [];
  public districtList: any = [];
  public hospitalList: any = [];
  hidestatus: boolean = false;
  hiseestatusadmin: boolean = false;
  buttonhide: boolean = false;
  hidebuttonstatus: boolean = true;
  hidebuttonstatusadmin: boolean = false;
  statecodedata: any = "";
  districtcodedata: any = "";
  hospitalcodedata: any = "";
  // isDisabled: boolean=false;
  constructor(public headerService: HeaderService, private snoService: SnocreateserviceService, public router: Router, private usermanualService: UsermanualService,private sessionService: SessionStorageService
    ) { this.data = this.router.getCurrentNavigation().extras.state }
  ngOnInit(): void {
    this.headerService.setTitle('Hospital Doctor Profile Add');
    this.user = this.sessionService.decryptSessionData("user");
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
      format: 'DD-MMM-YYYY LT',
      daysOfWeekDisabled: ['', 7],
    });
    let month: any
    var date = new Date();
    let year = date.getFullYear();
    let date1 = '01';
    if (date.getMonth() == 0) {
      year = year - 1;
      month = 11;
    } else {
      month = date.getMonth() - 1;
    }
    if (month == 0) {
      month = 'Jan';
    } else if (month == 1) {
      month = 'Feb';
    } else if (month == 2) {
      month = 'Mar';
    } else if (month == 3) {
      month = 'Apr';
    } else if (month == 4) {
      month = 'May';
    } else if (month == 5) {
      month = 'Jun';
    } else if (month == 6) {
      month = 'Jul';
    } else if (month == 7) {
      month = 'Aug';
    } else if (month == 8) {
      month = 'Sep';
    } else if (month == 9) {
      month = 'Oct';
    } else if (month == 10) {
      month = 'Nov';
    } else if (month == 11) {
      month = 'Dec';
    }
    var frstDay = date1 + "-" + month + "-" + year;
    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr("placeholder", "From Date *");
    $('input[name="toDate"]').attr("placeholder", "To Date *");
    this.getStateList();
    if (Number(this.user.groupId) == 5) {
      this.getHospitalByDistrict();
    } else if (Number(this.user.groupId) == 1 || Number(this.user.groupId) == 10) {
      this.hiseestatusadmin = true;
    }
    this.getSpeciality();
    if (this.data != null || this.data != undefined) {
      if (Number(this.user.groupId) == 5) {
        this.hidebuttonstatusadmin = true
        this.hidebuttonstatus = false;
        this.profileid = this.data.profileid
        this.edit(this.profileid)
        this.hospitalCodename = this.data.hospitalCodename
        this.docname = this.data.docname
        this.contactnumber = this.data.contactnumber
        this.regnumber = this.data.regnumber
        this.dateofjoining = this.data.dateofjoining
        this.statecodedata = this.data.statecode
        this.districtcodedata = this.data.districtcode
        this.hospitalcodedata = this.data.hospitalcode
        this.speciality_code = this.data.speciality_code
        this.speciality_name = this.data.speciality_name
        this.speciality_id = this.data.speciality_id
        this.type = this.data.type
      } else if (Number(this.user.groupId) == 1 || Number(this.user.groupId) == 10) {
        this.hidebuttonstatusadmin = true
        this.hidebuttonstatus = false;
        this.profileid = this.data.profileid
        this.edit(this.profileid)
        this.hospitalCodename = this.data.hospitalCodename
        this.docname = this.data.docname
        this.contactnumber = this.data.contactnumber
        this.regnumber = this.data.regnumber
        this.dateofjoining = this.data.dateofjoining
        this.statecodedata = this.data.statecode
        this.districtcodedata = this.data.districtcode
        this.hospitalcodedata = this.data.hospitalcode
        this.speciality_code = this.data.speciality_code
        this.speciality_name = this.data.speciality_name
        this.speciality_id = this.data.speciality_id
        this.type = this.data.type
        this.OnChangeState(this.statecodedata);
      }
    } else {
      this.data = '';
      this.type = '';
    }
  }
  getStateList() {
    this.snoService.getStateList().subscribe(
      (response) => {
        this.stateList = response;
        if (Number(this.user.groupId) == 1 || Number(this.user.groupId) == 10) {
          this.buttonhide = false;
        }
      },
    )
  }
  statecodedate: any;
  OnChangeState(id) {
    if (Number(this.user.groupId) == 5) {
      this.statecodedate = id
    } else if (Number(this.user.groupId) == 1 || Number(this.user.groupId) == 10) {
      this.statecodedate = this.statecodedata;
      this.buttonhide = false;
    }
    this.snoService.getDistrictListByStateId(this.statecodedate).subscribe(
      (response) => {
        this.districtList = response;
        if (Number(this.user.groupId) == 5) {
          if (this.type == 'edit') {
          } else {
          }
        } else if (Number(this.user.groupId) == 1 || Number(this.user.groupId) == 10) {
          this.OnChangeDistrict(this.districtcodedata);
        }
      },
    )

  }
  stateCode: any;
  OnChangeDistrict(id) {
    if (Number(this.user.groupId) == 5) {
      this.stateCode = this.statecodedate;
    } else if (Number(this.user.groupId) == 1 || Number(this.user.groupId) == 10) {
      this.stateCode = this.statecodedata;
    }
    this.snoService.getHospitalbyDistrictId(id, this.stateCode).subscribe(
      (response) => {
        this.hospitalList = response;
        if (Number(this.user.groupId) == 1 || Number(this.user.groupId) == 10) {
          this.OnChangehospital(this.hospitalcodedata);
        }
      },
    )
  }
  data: any = []
  statecode: any;
  districtcode: any;
  hospitalcode: any;
  getHospitalByDistrict() {
    let hospitalCode = this.user.userName;
    this.usermanualService.gethospitalbystae(hospitalCode).subscribe(data => {
      this.data = data;
      this.statecode = data[0].statecode;
      this.districtcode = data[0].districtcode;
      this.hospitalcode = data[0].hospitalcode
      if (Number(this.user.groupId) == 5) {
        this.OnChangeState(this.statecode);
        this.OnChangeDistrict(this.districtcode);
        this.hidestatus = true;
      } else {
        this.hiseestatusadmin = true;
      }
    })
  }
  speciality: any = [];
  hospitalCodevalue: any
  getSpeciality() {
    let hospitalcode = this.user.userName;
    this.usermanualService.getSpeciality(hospitalcode).subscribe(data => {
      this.speciality = data;
    });
  }
  hospitalcodeforadmin: any;
  OnChangehospital(event) {
    if (Number(this.user.groupId) == 5) {
      this.hospitalcodeforadmin = event;
    } else if (Number(this.user.groupId) == 1 || Number(this.user.groupId) == 10) {
      this.hospitalcodeforadmin = this.hospitalcodedata;
      this.buttonhide = false;
    }
    this.usermanualService.getSpeciality(this.hospitalcodeforadmin).subscribe(data => {
      let datavalue = data;
      this.speciality = datavalue;
    });
  }
  dataIdArray: any = [];
  packageheaderArray: any = [];
  show: boolean = false;
  checkAllCheckBox(event: any) {
    if (event.target.checked == true) {
      for (let i = 0; i < this.speciality.length; i++) {
        $('#' + this.speciality[i].packageheadercode).prop('checked', true);
        this.dataIdArray.push(this.speciality[i].packageheadercode);
        this.packageheaderArray.push(this.speciality[i].packageheader);
      }
    } else {
      for (let i = 0; i < this.speciality.length; i++) {
        $('#' + this.speciality[i].packageheadercode).prop('checked', false);
        this.dataIdArray = [];
        this.packageheaderArray = [];
      }
    }
    this.dataIdArray = this.dataIdArray.filter(
      (value, index) => this.dataIdArray.indexOf(value) === index
    );
    if (this.dataIdArray.length > 0) {
      this.buttonhide = true;
    } else {
      this.buttonhide = false;
    }
  }
  tdCheck(event: any, packageheadercode: any, packageheader: any) {
    if (event.target.checked) {
      this.dataIdArray.push(packageheadercode);
      this.packageheaderArray.push(packageheader);
    } else {
      for (let i = 0; i < this.speciality.length; i++) {
        if (this.dataIdArray[i] == packageheadercode) {
          this.dataIdArray.splice(i, 1);
        }
        if (this.packageheaderArray[i] == packageheader) {
          this.packageheaderArray.splice(i, 1);
        }
      }
    }
    if (this.dataIdArray.length == this.speciality.length) {
      $('#allCheck').prop('checked', true);
    } else {
      $('#allCheck').prop('checked', false);
    }
    if (this.dataIdArray.length > 0) {
      this.buttonhide = true;
    } else {
      this.buttonhide = false;
    }
    this.dataIdArray = this.dataIdArray.filter(
      (value, index) => this.dataIdArray.indexOf(value) === index
    );
  }
  statecodename: any;
  districtcodename: any;
  hospitalCodename: any;
  docname: any;
  contactnumber: any;
  regnumber: any;
  dateofjoining: any = '';
  msg: any;
  Submit() {
    if (Number(this.user.groupId) == 5) {
      this.statecodename = this.statecode;
      this.districtcodename = this.districtcode;
      this.hospitalCodename = this.hospitalcode;
    } else if (Number(this.user.groupId == 1 || Number(this.user.groupId) == 10)) {
      this.statecodename = $('#stateId').val();
      this.districtcodename = $('#districtId').val();
      this.hospitalCodename = $('#hospitalcode').val();
    }
    this.docname = $('#docname').val();
    this.contactnumber = $('#contactnumber').val();
    this.regnumber = $('#regnumber').val();
    this.dateofjoining = $('#datepicker3').val();
    if (this.statecodename == null || this.statecodename == undefined || this.statecodename == '') {
      this.swal('', 'Select State Name.', 'error');
    } else if (this.districtcodename == null || this.districtcodename == undefined || this.districtcodename == '') {
      this.swal('', 'Select District Name.', 'error');
    } else if (this.hospitalCodename == null || this.hospitalCodename == undefined || this.hospitalCodename == '') {
      this.swal('', 'Select Hospital  Name.', 'error');
    } else if (this.docname == null || this.docname == undefined || this.docname == '') {
      this.swal('', 'Please Enter Doctor Name.', 'error');
    } else if (this.contactnumber == null || this.contactnumber == undefined || this.contactnumber == '') {
      this.swal('', 'Please Enter Contact Number.', 'error');
    } else if (this.contactnumber.length > 10 || this.contactnumber.length < 10) {
      this.swal('', 'Please Enter Valid Contact Number.', 'error');
    } else if (this.regnumber == null || this.regnumber == undefined || this.regnumber == '') {
      this.swal('', 'Please Enter Registration Number.', 'error');
    } else if (this.dateofjoining == null || this.dateofjoining == undefined || this.dateofjoining == '') {
      this.swal('', 'Please Select Date Of Joining', 'error');
    }
    else {
      if (this.type == 'edit') {
        this.msg = "Are You Sure Want To Update?"
        this.profileid = this.profileid;
      } else {
        this.msg = "Are You Sure Want To Submit?"
        this.profileid = '';
      }
      let state = {
        statecodename: this.statecodename,
        districtcodename: this.districtcodename,
        hospitalCodename: this.hospitalCodename,
        docname: this.docname,
        contactnumber: this.contactnumber,
        regnumber: this.regnumber,
        dateofjoining: this.dateofjoining,
        specialitycode: this.dataIdArray,
        packageheader: this.packageheaderArray,
        userid: this.user.userId,
        profileid: this.profileid,
      }
      Swal.fire({
        title: this.msg,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
      }).then((result) => {
        if (result.isConfirmed) {
          this.usermanualService.getSubmitdata(state).subscribe((data: any) => {
            let resdata = data;
            if (resdata.status == "Success") {
              Swal.fire({
                title: resdata.message,
                icon: 'success',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'ok',
                allowOutsideClick: false
              }).then((result) => {
                if (result.isConfirmed) {
                  window.location.reload();
                } else {
                  window.location.reload();
                }
              }
              );
            } else {
              this.swal("error", "Something Went Wrong", 'error');
            }

          })
        }
      })
    }
  }
  Reset() {
    window.location.reload();
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  detailsdata: any = [];
  edit(profileid) {
    this.usermanualService.detailsdata(profileid).subscribe(data => {
      this.detailsdata = data;
      setTimeout(() => {
        this.getcheckpointdata();
      }, 2000);
    })
  }
  specialitycode: any;
  speciality_codeval: any;
  speciality_nameval: any;
  getcheckpointdata() {
    // this.isDisabled=true;
    for (let i = 0; i < this.detailsdata.length; i++) {
      this.speciality_codeval = this.detailsdata[i].speciality_code
      this.speciality_nameval = this.detailsdata[i].speciality_name
      $('#' + this.detailsdata[i].speciality_code).prop('checked', true);
      this.buttonhide = true;
      this.dataIdArray.push(this.speciality_codeval);
      this.packageheaderArray.push(this.speciality_nameval)
      if (this.detailsdata.length == this.speciality.length) {
        $('#allCheck').prop('checked', true);
      } else {
        $('#allCheck').prop('checked', false);
      }
    }
  }
}
