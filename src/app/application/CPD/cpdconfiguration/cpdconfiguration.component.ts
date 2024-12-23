import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-cpdconfiguration',
  templateUrl: './cpdconfiguration.component.html',
  styleUrls: ['./cpdconfiguration.component.scss']
})

export class CPDConfigurationComponent implements OnInit {
  user: any;
  cPDID: any;
  placeHolder = "Select Hospital";
  updatelist: any;
  public cpdList: any = [];
  public stateList: any = [];
  public districtList: any = [];
  public hospitalList: any = [];
  isUpdateBtnInVisible: boolean;
  isEditBtn: boolean;
  submitted: boolean = false;
  sid: any;
  did: any;
  hospitalArray: any;
  selectedItems: any = [];
  cpdId: any;
  keyword: any = 'fullName';
  hospObj: any;
  hospList: any = [];
  ipAddress: any;

  @ViewChild('multiSelect') multiSelect;
  @ViewChild('auto') auto;
  constructor(public fb: FormBuilder, private snoService: SnocreateserviceService,
    public headerService: HeaderService, public route: Router,private sessionService: SessionStorageService) {
    this.cPDID = this.route.getCurrentNavigation().extras.state;
  }

  form!: FormGroup;
  public settingDistrict = {};
  // public settingHospital = {};
  dropdownSettings: IDropdownSettings = {};
  ngOnInit(): void {
    this.headerService.setTitle('CPD Mapping');
    this.isUpdateBtnInVisible = true;
    this.isEditBtn = false;
    this.getCPDList();
    this.getStateList();
    // this.user = JSON.parse(sessionStorage.getItem("user"))
    this.user = this.sessionService.decryptSessionData("user");
    this.form = this.fb.group({
      cpdId: new FormControl(''),
      cpdName: new FormControl(''),
      hospitalCode: new FormControl(null, []),
      hospList: new FormControl('', []),
      createdBy: new FormControl(this.user.userId),
      updatedBy: new FormControl(this.user.userId)
    });
    this.getIpAddress();

    if (this.cPDID) {
      this.getCpdByIds(this.cPDID.cPDID);
    }

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'hospitalCode',
      textField: 'hospitalName',
      itemsShowLimit: 0,
      allowSearchFilter: true,
      selectAllText: 'Select All',
      unSelectAllText: "Un-Select All",
    };
  }

  getIpAddress() {
    this.snoService.getIpAddress().subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  onItemSelect(item) {
    this.hospObj = {
      stateCode: "",
      stateName: "",
      districtCode: "",
      districtName: "",
      hospitalCode: "",
      hospitalName: ""
    }
    this.hospObj.stateCode = $('#stateId').val();
    for (var i = 0; i < this.stateList.length; i++) {
      if (this.hospObj.stateCode == this.stateList[i].stateCode) {
        this.hospObj.stateName = this.stateList[i].stateName;
      }
    }
    this.hospObj.districtCode = $('#districtId').val();
    for (var i = 0; i < this.districtList.length; i++) {
      if (this.hospObj.districtCode == this.districtList[i].districtcode) {
        this.hospObj.districtName = this.districtList[i].districtname;
      }
    }
    this.hospObj.hospitalCode = item.hospitalCode;
    for (var i = 0; i < this.hospitalList.length; i++) {
      if (this.hospObj.hospitalCode == this.hospitalList[i].hospitalCode) {
        this.hospObj.hospitalName = this.hospitalList[i].hospName;
      }
    }

    var stat: boolean = false;
    for (const i of this.hospList) {
      if (i.hospitalCode == this.hospObj.hospitalCode) {
        stat = true;
      }
    }
    if (stat == false) {
      this.hospList.push(this.hospObj);
    }
  }

  onSelectAll(list) {
    for (var x = 0; x < list.length; x++) {
      let item = list[x];
      this.hospObj = {
        stateCode: "",
        stateName: "",
        districtCode: "",
        districtName: "",
        hospitalCode: "",
        hospitalName: ""
      }
      this.hospObj.stateCode = $('#stateId').val();
      for (var i = 0; i < this.stateList.length; i++) {
        if (this.hospObj.stateCode == this.stateList[i].stateCode) {
          this.hospObj.stateName = this.stateList[i].stateName;
        }
      }
      this.hospObj.districtCode = $('#districtId').val();
      for (var i = 0; i < this.districtList.length; i++) {
        if (this.hospObj.districtCode == this.districtList[i].districtcode) {
          this.hospObj.districtName = this.districtList[i].districtname;
        }
      }
      this.hospObj.hospitalCode = item.hospitalCode;
      for (var i = 0; i < this.hospitalList.length; i++) {
        if (this.hospObj.hospitalCode == this.hospitalList[i].hospitalCode) {
          this.hospObj.hospitalName = this.hospitalList[i].hospName;
        }
      }

      var stat: boolean = false;
      for (const i of this.hospList) {
        if (i.hospitalCode == this.hospObj.hospitalCode) {
          stat = true;
        }
      }
      if (stat == false) {
        this.hospList.push(this.hospObj);
      }
    }
  }

  onItemDeSelect(item) {
    for (var i = 0; i < this.hospList.length; i++) {
      if (item.hospitalCode == this.hospList[i].hospitalCode) {
        var index = this.hospList.indexOf(this.hospList[i]);
        if (index !== -1) {
          this.hospList.splice(index, 1);
        }
      }
    }
  }

  onDeSelectAll(list) {
    for (var x = 0; x < list.length; x++) {
      let item = list[x];
      for (var i = 0; i < this.hospList.length; i++) {
        if (item.hospitalCode == this.hospList[i].hospitalCode) {
          var index = this.hospList.indexOf(this.hospList[i]);
          if (index !== -1) {
            this.hospList.splice(index, 1);
          }
        }
      }
    }
  }

  remove(item) {
    for (var i = 0; i < this.hospList.length; i++) {
      if (item.hospitalCode == this.hospList[i].hospitalCode) {
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
  getCPDList() {

    this.snoService.getCPDList().subscribe(
      (response) => {
        this.cpdList = response;
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
    this.hospitalList = [];
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

  getSelected() {
  }

  selectEvent(item) {
    // do something with selected item
    this.cpdId = item.bskyUserId;
  }

  clearEvent() {
    this.cpdId = '';
  }

  setCPDConfiguration() {
    this.submitted = true;
    let cpdId = this.cpdId;

    if (cpdId == null || cpdId == "" || cpdId == undefined) {
      this.swal("Info", "Please select CPD Doctor Name", 'info');
      return;
    }
    if (this.hospList.length == 0) {
      this.swal("Info", "Please select a hospital ", 'info');
      return;
    }

    this.form.value.cpdId = cpdId;
    this.form.value.hospList = this.hospList;
    // this.snoService.checkCPDAssignedClaims(this.form.value).subscribe(data => {
    //   if(data.status == "Info") {
    //     this.swal("Info", data.message, "info");
    //     return;
    //   } else if(data.status == "Error") {
    //     this.swal("Error", data.message, "error");
    //     return;
    //   }
    // });

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
        this.snoService.saveCPDConfigurationLog(cpdId, this.user.userId, this.ipAddress).subscribe(res => {
          if (res.status == "success") {
            this.snoService.saveCPDConfiguration(this.form.value).subscribe(data => {
              if (data.status == "Success") {
                this.swal("Success", data.message, "success");
                this.route.navigate(['/application/cpdConfigurationdetails']);
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

  updategCPDDetails() {
    let cpdId = this.cpdId;

    if (cpdId == null || cpdId == "" || cpdId == undefined) {
      this.swal("Info", "Please select CPD Doctor Name", 'info');
      return;
    }

    this.form.value.cpdId = cpdId;
    this.form.value.hospList = this.hospList;
    // this.snoService.checkCPDAssignedClaimsForUpdate(this.form.value).subscribe(data => {
    //   if(data.status == "Info") {
    //     this.swal("Info", data.message, "info");
    //     return;
    //   } else if(data.status == "Error") {
    //     this.swal("Error", data.message, "error");
    //     return;
    //   }
    // });

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
        this.form.value.cpdId = cpdId;
        this.form.value.hospList = this.hospList;
        this.snoService.saveCPDConfigurationLog(cpdId, this.user.userId, this.ipAddress).subscribe(res => {
          if (res.status == "success") {
            this.snoService.updateCPDConfiguration(this.form.value).subscribe(data => {
              if (data.status == "Success") {
                this.swal("Success", data.message, "success");
                this.route.navigate(['/application/cpdConfigurationdetails']);
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
    this.hospList = [];
  }

  cancel() {
    this.route.navigate(['/application/cpdConfigurationdetails']);
  }


  getCpdByIds(id) {
    this.snoService.getbyid(id).subscribe(data => {
      this.updatelist = data;
      this.isUpdateBtnInVisible = false;
      this.isEditBtn = true;
      this.cpdId = this.updatelist.cpdId;
      this.form.controls['cpdName'].setValue(this.updatelist.cpdName);
      this.hospList = this.updatelist.hospList;
    });
  }
}
