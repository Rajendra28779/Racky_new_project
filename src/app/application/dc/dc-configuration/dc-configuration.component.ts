import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { Router } from '@angular/router';
import { DcconfigurationService } from '../../Services/dcconfiguration.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare var $: any;

@Component({
  selector: 'app-dc-configuration',
  templateUrl: './dc-configuration.component.html',
  styleUrls: ['./dc-configuration.component.scss']
})
export class DcConfigurationComponent implements OnInit {

  pageName: string = "DC Mapping";
  placeHolder = "Select Hospital";
  public dcList: any = [];
  public stateList: any = [];
  public districtList: any = [];
  public hospitalList: any = [];
  @ViewChild('multiSelect') multiSelect;
  @ViewChild('auto') auto;
  public submitted = false;
  isUpdateBtnInVisible: boolean;
  user: any;
  form: FormGroup;
  public settingDistrict = {};
  //public settingHospital = {};
  public settingHospital: any;
  dcId: any;
  isEditBtn: boolean;
  updatelist: any;
  sid: any;
  did: any;
  datas: any
  hospitalArray: any;
  hosp: any;
  selectedItems: any = [];
  dcUserId: any;
  keyword: any = 'fullName';
  hospObj: any;
  hospList: any = [];

  constructor(public fb: FormBuilder, private dcService: DcconfigurationService,
    private snoService: SnocreateserviceService, public headerService: HeaderService, private route: Router,private sessionService: SessionStorageService) {
    this.dcId = this.route.getCurrentNavigation().extras.state;
  }

  ngOnInit(): void {
    this.getDCList();
    this.getStateList();
    this.user =  this.sessionService.decryptSessionData("user");
    this.form = this.fb.group({

      dcId: new FormControl(''),
      dcName: new FormControl(''),
      hospitalCode: new FormControl(null, []),
      hospList: new FormControl('', []),
      createdBy: new FormControl(this.user.userId),
      updatedBy: new FormControl(this.user.userId),

    })

    this.headerService.setTitle('DC Mapping');
    this.isUpdateBtnInVisible = true;
    this.isEditBtn = false;
    if (this.dcId) {
      this.getDCByIds(this.dcId.dcId);
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
    console.log(this.hospList);
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

  getDCList() {
    this.dcService.getDCDetails().subscribe(
      (response) => {
        this.dcList = response;
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
    this.dcUserId = item.userId;
  }

  clearEvent() {
    this.dcUserId = '';
  }

  setDcConfiguration() {
    this.submitted = true;
    let dcId = this.dcUserId;

    if (dcId == null || dcId == "" || dcId == undefined) {
      this.swal("Info", "Please select DC Name", 'info');
      return;
    }

    let statecode = $('#stateId').val();
    if(statecode==null || statecode==""|| statecode==undefined){
      this.swal("Info", "Please select State Name", 'info');
      return;
    }

    let distcode = $('#districtId').val();
    if(distcode==null || distcode==""|| distcode==undefined){
      this.swal("Info", "Please select District Name", 'info');
      return;
    }

    if (this.hospList.length == 0) {
      this.swal("Info", "Please select a hospital ", 'info');
      return;
    }

    this.form.value.dcId = dcId;
    this.form.value.hospList = this.hospList;
    this.dcService.checkDCAssignedToHosp(this.form.value).subscribe(data => {
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
        this.dcService.saveDCConfigurationLog(dcId, this.user.userId).subscribe(res => {
          if (res.status == "success") {
            this.dcService.saveDCConfiguration(this.form.value).subscribe(data => {
              if (data.status == "Success") {
                this.swal("Success", data.message, "success");
                this.route.navigate(['/application/dcConfigurationdetails']);
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

  updateDcDetails() {
    let dcId = this.dcUserId;

    if (dcId == null || dcId == "" || dcId == undefined) {
      this.swal("Info", "Please select DC Name", 'info');
      return;
    }

    this.form.value.dcId = dcId;
    this.form.value.hospList = this.hospList;
    this.dcService.checkDCAssignedToHospForUpdate(this.form.value).subscribe(data => {
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
        this.dcService.saveDCConfigurationLog(dcId, this.user.userId).subscribe(res => {
          if (res.status == "success") {
            this.dcService.updateDCConfiguration(this.form.value).subscribe(data => {
              if (data.status == "Success") {
                this.swal("Success", data.message, "success");
                this.form.reset();
                this.route.navigate(['/application/dcConfigurationdetails']);
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
    this.route.navigate(['/application/dcConfigurationdetails']);
  }

  getDCByIds(id) {
    this.dcService.getDcById(id).subscribe(data => {
      this.updatelist = data;
      this.isUpdateBtnInVisible = false;
      this.isEditBtn = true;
      this.dcUserId = this.updatelist.dcId;
      this.form.controls['dcName'].setValue(this.updatelist.dcName);
      this.hospList = this.updatelist.hospList;
    });
  }

}
