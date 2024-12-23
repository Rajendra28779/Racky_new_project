import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { HospitalPackageMappingService } from '../../Services/hospital-package-mapping.service';
import { QcadminServicesService } from '../../Services/qcadmin-services.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-hospital-specility-add',
  templateUrl: './hospital-specility-add.component.html',
  styleUrls: ['./hospital-specility-add.component.scss'],
})
export class HospitalSpecilityAddComponent implements OnInit {
  @ViewChild('auto') auto;
  @ViewChild('autocopy') autocopy;

  keyword: string = 'packageheadername';
  procedure: any = '';
  procedureName: any = '';
  packageHeaderItem: any = [];
  keyword2 = 'hospitalName';
  hospitalId: any = '';
  hospitalname: any = '';
  hospitalList: any = [];
  user: any;
  showtable: any;
  stateList: any = [];
  districtList: any = [];
  showfilter: any = true;
  buttonshowhospital: boolean;
  buttonshowAdmin: boolean;
  isDisable = false;
  isHospitalLoggedIn: boolean;
  constructor(
    private hospitalService: HospitalPackageMappingService,
    private snoService: SnocreateserviceService,
    public headerService: HeaderService,
    private sessionService: SessionStorageService,
    public route: Router,
    public qcadminserv: QcadminServicesService
  ) { }

  ngOnInit(): void {
    this.headerService.setTitle('Hospital Speciality Tagging');
    this.user = this.sessionService.decryptSessionData('user');
    $('#stateId').val('');
    $('#districtId').val('');
    this.hospitalId = '';
    if (this.user.groupId == 5) {
      this.showfilter = false;
      this.buttonshowhospital = true;
      this.buttonshowAdmin = false;
      this.isHospitalLoggedIn = true;
      this.getHospitalList();
    } else {
      this.showfilter = true;
      this.buttonshowAdmin = true;
      this.buttonshowhospital = false;
      this.isHospitalLoggedIn = false;
      this.getHospitalList();
      this.getStateList();
    }
  }

  getStateList() {
    this.snoService.getStateList().subscribe((response) => {
      this.stateList = response;
    });
  }
  OnChangeState(id) {
    this.snoService.getDistrictListByStateId(id).subscribe((response) => {
      this.districtList = response;
      this.getHospitalList();
    });
  }

  getHospitalList() {
    let state;
    let dist;
    if (!this.showfilter) {
      state = '';
      dist = '';
    } else {
      state = $('#stateId').val();
      dist = $('#districtId').val();
    }
    this.qcadminserv
      .gettmasactivehospitallist(state, dist)
      .subscribe((response) => {
        this.hospitalList = response;
        this.getCategoryList();
        if (!this.showfilter) {
          for (let i = 0; i < this.hospitalList.length; i++) {
            if (this.hospitalList[i].hospitalCode == this.user.userName) {
              this.hospitalId = this.hospitalList[i].hospitalId;
              this.hospitalname = this.hospitalList[i].hospitalName;
              this.getpackagelist();
              this.showtable = true;
              this.specialist = [];
            }
          }
        }
      });
  }

  // getPackageHeader() {
  //   this.hospitalService.getallPackageHeaders().subscribe((data: any) => {
  //     this.packageHeaderItem = data;
  //   });
  // }

  // selectEvent(item) {
  //   this.procedure = c;
  //   this.procedureName = item.headername;
  // }

  // clearEvent() {
  //   this.procedure = '';
  //   this.procedureName = '';
  // }

  selectEvent2(item) {
    this.hospitalId = item.hospitalId;
    this.hospitalname = item.hospitalName;
    this.getpackagelist();
    this.showtable = true;
    this.specialist = [];
  }

  clearEvent2() {
    this.hospitalId = '';
    this.hospitalname = '';
    this.showtable = false;
    this.specialist = [];
  }

  getpackagelist() {
    this.qcadminserv
      .getpackagelistbyhospitalid(this.hospitalId, this.user.userId)
      .subscribe((response) => {
        this.packageHeaderItem = response;
      });
  }
  swal(title, text, icon) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  specialist: any = [];
  specialistbkp: any = [];
  special: any;
  selectitem(item: any, index) {
    let hospitalTypeId = $('#hospitalTypeId' + index).val();
    for (let i = 0; i < this.packageHeaderItem.length; i++) {
      if (this.packageHeaderItem[i].packageid == item.packageid) {
        this.packageHeaderItem[i].showstatus =
          this.packageHeaderItem[i].showstatus == 0 ? 1 : 0;
      }
    }
    this.special = {
      packageid: '',
      packagecode: '',
      privyear: 0,
      bfrlastyear: 0,
      status: 0,
      hospitalTypeId: hospitalTypeId,
    };
    this.special.packageid = item.packageid;
    this.special.packagecode = item.packagecode;
    this.special.status = item.status == 0 ? 1 : 0;
    let stat = false;
    for (const i of this.specialist) {
      if (i.packageid == this.special.packageid) {
        stat = true;
      }
    }
    if (stat == false) {
      this.specialist.push(this.special);
    } else {
      for (let i = 0; i < this.specialist.length; i++) {
        if (item.packageid == this.specialist[i].packageid) {
          let index = this.specialist.indexOf(this.specialist[i]);
          if (index !== -1) {
            this.specialist.splice(index, 1);
          }
        }
      }
    }
  }
  submit() {
    if (
      this.hospitalId == null ||
      this.hospitalId == '' ||
      this.hospitalId == undefined
    ) {
      this.swal('Info', 'Please select Hospital Name', 'info');
      return;
    }
    if (this.specialist.length == 0) {
      this.swal('Info', 'Please select at least One Specialist', 'info');
      return;
    }
    let checkHospitalType = false;
    if (!this.isHospitalLoggedIn) {
      this.specialist.forEach(element => {
        if(element.status==0){
          if (element.hospitalTypeId == null || element.hospitalTypeId == undefined || element.hospitalTypeId == "") {
            checkHospitalType = true;
          }
        }
      });
      if (checkHospitalType) {
        this.swal('Info', 'Please select Hospital type', 'info');
        return;
      }
    }
    if (this.user.groupId == 5) {
      Swal.fire({
        title: 'Are You Sure?',
        text: 'You Want To Request This Data!',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes,Submit It!',
      }).then((result) => {
        if (result.isConfirmed) {
          let object = {
            hospitalcode: this.hospitalId,
            specialist: this.specialist,
            createdby: this.user.userId,
          };
          this.qcadminserv
            .savepecialistconfig(object)
            .subscribe((data: any) => {
              if (data.status == 200) {
                this.swal('Success', 'Record Updated Succefully', 'success');
                this.specialist = [];
                this.getpackagelist();
              }else if (data.status == 401) {
                this.swal('Error', data.message, 'error');
              } else {
                this.swal('Error', 'Something went wrong', 'error');
              }
            });
        }
      });
    } else {
      Swal.fire({
        title: 'Are You Sure?',
        text: 'You Want To Save This Data!',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes,Submit It!',
      }).then((result) => {
        if (result.isConfirmed) {
          let object = {
            hospitalcode: this.hospitalId,
            specialist: this.specialist,
            createdby: this.user.userId,
          };
          this.qcadminserv
            .savepecialistconfig(object)
            .subscribe((data: any) => {
              if (data.status == 200) {
                this.swal('Success', 'Record Updated Succefully', 'success');
                this.specialist = [];
                this.getpackagelist();
              }else if (data.status == 401) {
                this.swal('Error', data.message, 'error');
              }else {
                this.swal('Error', 'Something went wrong', 'error');
              }
            });
        }
      });
    }
  }

  onReset() {
    this.getpackagelist();
    this.specialist = [];
  }

  // prvyear(event, item) {
  //   let stat = false;
  //   for (var i = 0; i < this.specialist.length; i++) {
  //     if (item.packageid == this.specialist[i].packageid) {
  //       stat = true;
  //       this.specialist[i].privyear = event;
  //     }
  //   }
  //   if (!stat) {
  //     this.special = {
  //       packageid: '',
  //       packagecode: '',
  //       privyear: '',
  //       bfrlastyear: '',
  //       status: '',
  //     }
  //     this.special.packageid = item.packageid
  //     this.special.packagecode = item.packagecode
  //     this.special.status = 2;
  //     this.special.privyear = event;
  //     this.special.bfrlastyear = 0;

  //     this.specialist.push(this.special);
  //   }
  // }

  // lastyear(event, item) {
  //   let stat = false
  //   for (var i = 0; i < this.specialist.length; i++) {
  //     if (item.packageid == this.specialist[i].packageid) {
  //       stat = true;
  //       this.specialist[i].bfrlastyear = event;
  //     }
  //   }
  //   if (!stat) {
  //     this.special = {
  //       packageid: '',
  //       packagecode: '',
  //       privyear: '',
  //       bfrlastyear: '',
  //       status: '',
  //     }
  //     this.special.packageid = item.packageid
  //     this.special.packagecode = item.packagecode
  //     this.special.status = 2;
  //     this.special.privyear = item.addmissionprvyear;
  //     this.special.bfrlastyear = event;

  //     this.specialist.push(this.special);
  //   }
  // }
  catList: any = [];
  categoryList: any = [];
  getCategoryList() {
    this.catList = [];
    let stateId = $('#stateId').val();
    this.snoService.getHospitalCategoryList().subscribe(
      (response) => {
        this.categoryList = response;
        this.categoryList.forEach((element) => {
          if (stateId == 21) {
            if (
              element.categoryId == 1 ||
              element.categoryId == 2 ||
              element.categoryId == 3
            ) {
              this.catList.push(element);
            }
          } else {
            if (
              element.categoryId == 2 ||
              element.categoryId == 4 ||
              element.categoryId == 5 ||
              element.categoryId == 6
            ) {
              this.catList.push(element);
            }
          }
        });
      },
      (error) => console.log(error)
    );
  }
  onSelectType(item: any, index) {
    let hospitalTypeId = $('#hospitalTypeId' + index).val();
    let stat=false;
    this.specialist.forEach(element => {
      if (element.packageid == item.packageid) {
        element.hospitalTypeId = hospitalTypeId;
        stat=true;
      }
    });
    if(!stat){
      if (item.status == 0) {
        this.special = {
          packageid: '',
          packagecode: '',
          privyear: 0,
          bfrlastyear: 0,
          status: 0,
          hospitalTypeId: hospitalTypeId,
        };
        this.special.packageid = item.packageid;
        this.special.packagecode = item.packagecode;

        this.specialist.push(this.special);
      } else {
        this.specialist.forEach(element => {
          if (element.packageid === item.packageid) {
            element.hospitalTypeId = hospitalTypeId;
          }
        });
      }
    }
  }
}
