import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import Swal from 'sweetalert2';
import { HeaderService } from '../header.service';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import { SwastyaMitraHospitalService } from '../Services/swastya-mitra-hospital.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-smhospitalconfiguration',
  templateUrl: './smhospitalconfiguration.component.html',
  styleUrls: ['./smhospitalconfiguration.component.scss']
})
export class SmhospitalconfigurationComponent implements OnInit {
  isUpdateData: any = false;
  public districtList: any = [];
  public stateList: any = [];
  selectedItems: any = [];
  hospList: any = [];
  public hospitalList: any = [];
  hospitalCode: any;
  userIId: any;
  public userList: any = [];
  user1: any;
  keyword1: any = 'fullname';
  placeHolder = "Select Hospital";
  hospObj: any;
  @ViewChild('multiSelect') multiSelect;
  @ViewChild('auto') auto;
  data: any;
  user: any;
  id: any;
  detailData: any;
  name: any;


  constructor(private snoService: SnocreateserviceService, public swastyaMitraHospitalService: SwastyaMitraHospitalService, public route: Router,
    public headerService: HeaderService, private sessionService: SessionStorageService) {
    this.user = this.route.getCurrentNavigation().extras.state;
  }

  dropdownSettings: IDropdownSettings = {};
  ngOnInit(): void {
    this.headerService.setTitle(" SwasthyaMitra Hospital Mapping");
    this.user1 = this.sessionService.decryptSessionData("user");
    this.getStateList();
    this.getSwasthyaMitraList();

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'hospitalCode',
      textField: 'hospitalName',
      itemsShowLimit: 0,
      allowSearchFilter: true,
      selectAllText: 'Select All',
      unSelectAllText: "Un-Select All",
    };
    if (this.user != undefined) {
      this.isUpdateData = true;
      this.id = this.user.user;
      this.name = this.user.name;
      this.swastyaMitraHospitalService.getsmtaggedhospital(this.id).subscribe(
        (response) => {
          this.detailData = response;
          if (this.detailData != null) {
            for (let i = 0; i < this.detailData.length; i++) {
              let dat = this.detailData[i];
              this.hospObj = {};
              this.hospObj.stateName = dat.state
              this.hospObj.districtName = dat.dist
              this.hospObj.hospitalName = dat.hospitalName
              this.hospObj.hospitalCode = dat.hospitalCode
              this.hospList.push(this.hospObj);
            }
          }
        },
        (error) => console.log(error)
      );


    }
  }


  getStateList() {
    this.snoService.getStateList().subscribe(
      (response) => {
        this.stateList = response;
      },
      (error) => console.log(error)
    )
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
    this.onItemDeSelect(item);
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


  selectEvent(item) {
    this.userIId = item.userId;
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
  getSwasthyaMitraList() {
    this.swastyaMitraHospitalService.getSwasthyaList().subscribe(
      (response) => {
        this.userList = response;
      },
      (error) => console.log(error)
    );
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

  onReset() {
    this.auto.clear();
    $("#stateId").val("");
    this.OnChangeState("");
    $("#districtId").val("");
    this.OnChangeDistrict("");
    this.hospList = [];
  }

  swal(title, text, icon) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  save() {
    if (this.userIId == null || this.userIId == "" || this.userIId == undefined) {
      this.swal("Info", "Please select SwasthyaMitra Name", 'info');
      return;
    }
    if (this.hospList.length == 0) {
      this.swal("Info", "Please select a hospital ", 'info');
      return;
    }
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
        let created = this.user1.userId;
        this.swastyaMitraHospitalService.saveSwasthya(this.userIId, this.hospList, created).subscribe(
          (response) => {
            this.data = response;
            if (this.data.status == "200") {
              this.swal("Success", this.data.message, "success");
              this.route.navigate(['/application/viewsmconfiguration']);
            } else if (this.data.status == "400") {
              this.swal("Error", this.data.message, "error");
            } else if (this.data.status == "401") {
              this.swal("Error", this.data.message, "info");
              this.hospList = [];
            }
          },
          (error) => console.log(error)
        );
      }
    })
  }

  cancel() {
    this.route.navigate(['/application/viewsmconfiguration']);
  }

  update() {
    if (this.hospList.length == 0) {
      this.swal("Info", "Please select a hospital ", 'info');
      return;
    }
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
        let created = this.user1.userId;
        this.swastyaMitraHospitalService.update(this.id, this.hospList, created).subscribe(
          (response) => {
            this.data = response;
            if (this.data.status == "200") {
              this.swal("Success", this.data.message, "success");
              this.route.navigate(['/application/viewsmconfiguration']);
            } else if (this.data.status == "400") {
              this.swal("Error", this.data.message, "error");
            }
          },
          (error) => console.log(error)
        );
      }
    })
  }


}
