import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { Router } from '@angular/router';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare var $: any;



@Component({
  selector: 'app-sno-configuration',
  templateUrl: './sno-configuration.component.html',
  styleUrls: ['./sno-configuration.component.scss']
})

export class SNOConfigurationComponent implements OnInit {
  pageName: string = "SNA Mapping";
  placeHolder = "Select Hospital";
  public snoList: any = [];
  public stateList: any = [];
  public districtList: any = [];
  public hospitalList: any = [];
  @ViewChild('multiSelect') multiSelect;
  @ViewChild('auto') auto;
  public submitted = false;
  isUpdateBtnInVisible: boolean;
  user: any;
  form!: FormGroup;
  public settingDistrict = {};
  //public settingHospital = {};
  public settingHospital: any;
  sNOId: any;
  isEditBtn: boolean;
  updatelist: any;
  sid: any;
  did: any;
  datas: any
  hospitalArray: any;
  hosp: any;
  selectedItems: any = [];
  status: any;
  snoUserId: any;
  keyword: any = 'fullName';
  hospObj: any;
  hospList: any = [];
  ipAddress: any;

  constructor(private sessionService: SessionStorageService,public fb: FormBuilder, private snoService: SnocreateserviceService,
    public headerService: HeaderService, private route: Router) {
    //this._design.pageTitle(this.pageName);
    this.sNOId = this.route.getCurrentNavigation().extras.state;
  }

  ngOnInit(): void {
    this.getSNOList();
    this.getStateList();
    this.user = this.sessionService.decryptSessionData("user");
    this.form = this.fb.group({
      snoId: new FormControl(''),
      snoName: new FormControl(''),
      hospitalCode: new FormControl(null, []),
      hospList: new FormControl('', []),
      createdBy: new FormControl(this.user.userId),
      updatedBy: new FormControl(this.user.userId)
    });
    this.getIpAddress();

    this.headerService.setTitle('SNA Mapping');
    this.isUpdateBtnInVisible = true;
    this.isEditBtn = false;
    if (this.sNOId) {
      this.getSnoByIds(this.sNOId.sNOId);
    }

    this.settingHospital = {
      singleSelection: false,
      idField: 'hospitalCode',
      textField: 'hospitalName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 0,
      allowSearchFilter: true,
    };
  }

  getIpAddress() {
    this.snoService.getIpAddress().subscribe((res:any)=>{
      this.ipAddress = res.ip;
    });
  }

  onItemSelect(item) {
    this.hospObj={
      stateCode:"",
      stateName:"",
      districtCode:"",
      districtName:"",
      hospitalCode:"",
      hospitalName:""
    }
    this.hospObj.stateCode = $('#stateId').val();
    for(var i=0;i<this.stateList.length;i++) {
      if(this.hospObj.stateCode==this.stateList[i].stateCode) {
        this.hospObj.stateName = this.stateList[i].stateName;
      }
    }
    this.hospObj.districtCode = $('#districtId').val();
    for(var i=0;i<this.districtList.length;i++) {
      if(this.hospObj.districtCode==this.districtList[i].districtcode) {
        this.hospObj.districtName = this.districtList[i].districtname;
      }
    }
    this.hospObj.hospitalCode = item.hospitalCode;
    for(var i=0;i<this.hospitalList.length;i++) {
      if(this.hospObj.hospitalCode==this.hospitalList[i].hospitalCode) {
        this.hospObj.hospitalName = this.hospitalList[i].hospName;
      }
    }

    var stat:boolean = false;
    for (const i of this.hospList) {
      if(i.hospitalCode==this.hospObj.hospitalCode) {
        stat=true;
      }
    }
    if(stat==false) {
      this.hospList.push(this.hospObj);
    }
  }

  onSelectAll(list) {
    for(var x=0;x<list.length;x++) {
      let item = list[x];
      this.hospObj={
        stateCode:"",
        stateName:"",
        districtCode:"",
        districtName:"",
        hospitalCode:"",
        hospitalName:""
      }
      this.hospObj.stateCode = $('#stateId').val();
      for(var i=0;i<this.stateList.length;i++) {
        if(this.hospObj.stateCode==this.stateList[i].stateCode) {
          this.hospObj.stateName = this.stateList[i].stateName;
        }
      }
      this.hospObj.districtCode = $('#districtId').val();
      for(var i=0;i<this.districtList.length;i++) {
        if(this.hospObj.districtCode==this.districtList[i].districtcode) {
          this.hospObj.districtName = this.districtList[i].districtname;
        }
      }
      this.hospObj.hospitalCode = item.hospitalCode;
      for(var i=0;i<this.hospitalList.length;i++) {
        if(this.hospObj.hospitalCode==this.hospitalList[i].hospitalCode) {
          this.hospObj.hospitalName = this.hospitalList[i].hospName;
        }
      }

      var stat:boolean = false;
      for (const i of this.hospList) {
        if(i.hospitalCode==this.hospObj.hospitalCode) {
          stat=true;
        }
      }
      if(stat==false) {
        this.hospList.push(this.hospObj);
      }
    }
  }

  onItemDeSelect(item) {
    for(var i=0;i<this.hospList.length;i++) {
      if(item.hospitalCode==this.hospList[i].hospitalCode) {
        var index = this.hospList.indexOf(this.hospList[i]);
        if (index !== -1) {
          this.hospList.splice(index, 1);
        }
      }
    }
  }

  onDeSelectAll(list) {
    for(var x=0;x<list.length;x++) {
      let item = list[x];
      for(var i=0;i<this.hospList.length;i++) {
        if(item.hospitalCode==this.hospList[i].hospitalCode) {
          var index = this.hospList.indexOf(this.hospList[i]);
          if (index !== -1) {
            this.hospList.splice(index, 1);
          }
        }
      }
    }
  }

  remove(item) {
    for(var i=0;i<this.hospList.length;i++) {
      if(item.hospitalCode==this.hospList[i].hospitalCode) {
        var index = this.hospList.indexOf(this.hospList[i]);
        if (index !== -1) {
          this.hospList.splice(index, 1);
        }
      }
    }
  }

  get f() {
    return this.form.controls;
  }
  getSNOList() {

    this.snoService.getSNODetails().subscribe(
      (response) => {
        this.snoList = response;
      },
      (error) => console.log(error)
    )
  }

  getStateList() {

    this.snoService.getStateList().subscribe(
      (response) => {
        this.stateList = response;
      },
      (error) => console.log(error)
    )
  }

  OnChangeState(id) {
    $("#districtId").val("");
    this.selectedItems = [];
    localStorage.setItem("stateCode", id);
    this.snoService.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = response;
      },
      (error) => console.log(error)
    )
  }


  OnChangeDistrict(id) {
    this.selectedItems = [];
    var stateCode = localStorage.getItem("stateCode");
    this.snoService.getHospitalbyDistrictId(id, stateCode).subscribe(
      (response) => {

        this.hospitalList = response;
      },
      (error) => console.log(error)
    )
  }

  selectEvent(item) {
    // do something with selected item
    this.snoUserId = item.userId;
  }

  clearEvent() {
    this.snoUserId = '';
  }

  setSNOConfiguration() {
    this.submitted = true;
    let snoId = this.snoUserId;

    if (snoId == null || snoId == "" || snoId == undefined) {
      this.swal("Info", "Please select SNA Doctor Name", 'info');
      return;
    }
    if (this.hospList.length == 0) {
      this.swal("Info", "Please select a hospital ", 'info');
      return;
    }

    this.form.value.snoId = snoId;
    this.form.value.hospList = this.hospList;
    this.snoService.checkSNOAssignedToHosp(this.form.value).subscribe(data => {
      if(data.status == "Info") {
        this.swal("Info", data.message, "info");
        return;
      } else if(data.status == "Error") {
        this.swal("Error", data.message, "error");
        return;
      }
    });

    Swal.fire({
      title: 'Are You Sure?',
      text: "You Want To Save This Data!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,Submit It!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.snoService.saveSNOConfigurationLog(snoId, this.user.userId, this.ipAddress).subscribe(res => {
          if (res.status == "success") {
            this.snoService.saveSNOConfiguration(this.form.value).subscribe(data => {
              if (data.status == "Success") {
                this.swal("Success", data.message, "success");
                this.route.navigate(['/application/snaConfigurationdetails']);
              } else if (data.status == "Failed") {
                this.swal("Error", data.message, "error");
              }
            });
          } else {
            this.swal("Error", res.message, "error");
          }
        });
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

  updategSNODetails() {

    let snoId = this.snoUserId;

    if (snoId == null || snoId == "" || snoId == undefined) {
      this.swal("Info", "Please select SNA Doctor Name", 'info');
      return;
    }

    this.form.value.snoId = snoId;
    this.form.value.hospList = this.hospList;
    this.snoService.checkSNOAssignedToHospForUpdate(this.form.value).subscribe(data => {
      if(data.status == "Info") {
        this.swal("Info", data.message, "info");
        return;
      } else if(data.status == "Error") {
        this.swal("Error", data.message, "error");
        return;
      }
    });

    Swal.fire({
      title: 'Are You Sure?',
      text: "You Want To Update This Data!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,Update It!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.snoService.saveSNOConfigurationLog(snoId, this.user.userId, this.ipAddress).subscribe(res => {
          if (res.status == "success") {
            this.snoService.updateSNOConfiguration(this.form.value).subscribe(data => {
              if (data.status == "Success") {
                this.swal("Success", data.message, "success");
                this.form.reset();
                this.route.navigate(['/application/snaConfigurationdetails']);
                this.submitted = false;
              } else if (data.status == "Failed") {
                this.swal("Error", data.message, "error");
              }
            });
          } else {
            this.swal("Error", res.message, "error");
          }
        });
      }
    });
  }

  onReset() {
    this.auto.clear();
    $("#stateId").val("");
    this.OnChangeState("");
    $("#districtId").val("");
    this.OnChangeDistrict("");
  }

  cancel() {
    this.route.navigate(['/application/snaConfigurationdetails']);
  }

  getSnoByIds(id) {
    //let data = this.settingHospital;
    //this.datas = this.settingHospital;
    this.snoService.getSnoById(id).subscribe(data => {
      this.updatelist = data;
      this.isUpdateBtnInVisible = false;
      this.isEditBtn = true;
      this.snoUserId=this.updatelist.snoId;
      this.form.controls['snoName'].setValue(this.updatelist.snoName);
      this.hospList = this.updatelist.hospList;
    });
  }
}
