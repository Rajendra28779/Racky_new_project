import { Component, OnInit, ViewChild } from '@angular/core';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { SwastyaMitraHospitalService } from '../../Services/swastya-mitra-hospital.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { HeaderService } from 'src/app/application/header.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
@Component({
  selector: 'app-swathya-mitra-hospital-configuration',
  templateUrl: './swathya-mitra-hospital-configuration.component.html',
  styleUrls: ['./swathya-mitra-hospital-configuration.component.scss']
})
export class SwathyaMitraHospitalConfigurationComponent implements OnInit {
  hospitalCode: any;
  userIId: any;
  user1: any;
  fullname: any;
  data: any;
  getAllData: { [k: string]: any; };
  getDataforUpdate: any;
  useId: any;
  stateFlg: any;
  mapId: any;
  hospCode: any;
  distCode: any = "";
  staCode: any = "";
  isSaveData: boolean = true;
  isUpdateData: boolean = false;
  selectedItems: any = [];
  public districtList: any = [];
  public stateList: any = [];
  dist: any = "";
  statecode: any = "";
  user: any;
  form: FormGroup;
  placeHolder = "Select Hospital";
  public hospitalList: any = [];
  hospObj: any;
  keyword: any = 'hospitalName';
  hospList: any = [];
  public userList: any = [];
  keyword1: any = 'fullname';
  submitted: boolean = false;
  @ViewChild('multiSelect') multiSelect;
  @ViewChild('auto') auto;


  constructor(private snoService: SnocreateserviceService, public fb: FormBuilder, public swastyaMitraHospitalService: SwastyaMitraHospitalService, public route: Router,
    public headerService: HeaderService,private sessionService: SessionStorageService) {
    this.getDataforUpdate = this.route.getCurrentNavigation().extras.state;
  }

  dropdownSettings: IDropdownSettings = {};

  ngOnInit(): void {
    this.headerService.setTitle(" SwasthyaMitra Hospital Mapping");
    this.user1 = this.sessionService.decryptSessionData("user");
    console.log(this.user1);
    this.OnChangeState(this.statecode);
    this.getStateList();
    this.getSwasthyaMitraList();
    this.form = this.fb.group({
      userId: new FormControl(''),
      stateCode: new FormControl(''),
      districtCode: new FormControl(''),
      hospitalCode: new FormControl(null, []),
      hospList: new FormControl('', []),
    });

    if (this.getDataforUpdate) {
      this.isSaveData = false;
      this.isUpdateData = true;
      console.log(this.getDataforUpdate);
      this.useId = this.getDataforUpdate.useId;
      this.stateFlg = this.getDataforUpdate.stateFlg;
      this.mapId = this.getDataforUpdate.mapId;
      this.staCode = this.getDataforUpdate.staCode;
      this.OnChangeState(this.staCode);
      this.distCode = this.getDataforUpdate.distCode;
      this.OnChangeDistrict(this.distCode);
      this.hospCode = this.getDataforUpdate.hospCode;
      this.isSaveData = false;
      this.isUpdateData = true;
    }
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

  selectEvent1(item) {
    this.hospitalCode = item.hospitalCode;
  }

  selectEvent(item) {
    console.log(item);
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




  getSelected() {
    console.log(this.selectedItems);
  }


  getSwasthyaMitraList() {
    this.swastyaMitraHospitalService.getSwasthyaList().subscribe(
      (response) => {
        this.userList = response;
        console.log(this.userList);
      },
      (error) => console.log(error)
    )
  }

  Save() {
    let swasthyaId = this.userIId;
    if (swasthyaId == null || swasthyaId == "" || swasthyaId == undefined) {
      this.swal("Info", "Please select swasthya mitra", 'info');
      return;
    }
    let stateId = $('#stateId').val();
    if (stateId == null || stateId == "" || stateId == undefined) {
      $("#stateId").focus();
      this.swal("Info", "Please select State", 'info');
      return;
    }
    let districtId = $('#districtId').val();
    if (districtId == null || districtId == "" || districtId == undefined) {
      $("#districtId").focus();
      this.swal("Info", "Please select District", 'info');
      return;
    }
    let hospitalCode = this.hospitalCode;
    if (hospitalCode == null || hospitalCode == "" || hospitalCode == undefined) {
      this.swal("Info", "Please select hospital", 'info');
      return;
    }
    Swal.fire({
      title: 'Are you sure want to save?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Save it!'
    }).then((result) => {
      if (result.isConfirmed) {
        let Object = {
          stateId: stateId,
          districtId: districtId,
          hospitalCode: hospitalCode,
          swasthyaId: swasthyaId,
          createdBy: this.user1.userId.toString(),
        }
        this.swastyaMitraHospitalService.saveSwasthyaMitraHospital(Object).subscribe(
          (result: any) => {
            this.data = result;
            if (this.data.status == "Success") {
              Swal.fire("Success", "Swasthya Mitra Mapped  Successfully!!", "success")
              this.route.navigate(['application/swasthyamitrhospitalconfigurationview']);
              this.submitted = false;
            } else if (this.data.status == "Failed") {
              this.swal('Success', this.data.message, 'error')
            } else {
              this.swal("Error", "Something went wrong", 'error');
            }
          },
          (err: any) => {
            console.log(err);
          }
        )
      }
    });
  }

  updateDcDetails() {
    let swasthyaId = this.userIId;
    let stateId = $('#stateId').val();
    let districtId = $('#districtId').val();
    let hospitalCode = this.hospitalCode;
    Swal.fire({
      title: 'Are you sure want to Update?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Update it!'
    }).then((result) => {
      if (result.isConfirmed) {
        let object = {
          useId: this.useId,
          // stateFlg: this.stateFlg,
          hospitalCode: this.hospCode,
          swasthyaId: this.mapId,
          statCode: this.staCode,
          distCode: this.distCode,
          stateFlg: this.stateFlg,
          updatedBy: this.user1.userId.toString()
        }
        this.swastyaMitraHospitalService.updateSwasthyaMitra(object).subscribe(
          (result: any) => {
            this.data = result;
            console.log(this.data);

            if (this.data.status == "Success") {
              Swal.fire("Success", "Swasthya Mitra Updated  Successfully!!", "success")
              this.route.navigate(['application/swasthyamitrhospitalconfigurationview']);
              this.submitted = false;
            } else if (this.data.status == "Failed") {
              this.swal('Success', this.data.message, 'error')
            } else {
              this.swal("Error", "Something went wrong", 'error');
            }
          },
          (err: any) => {
            console.log(err);
          }
        )
      }
    },
      (err: any) => {
        console.log(err);
      })
  }


  cancel() {
    this.route.navigate(['/application/swasthyamitrhospitalconfigurationview']);
  }
  onReset() {
    window.location.reload();
  }

  yes($event: any) {
    this.stateFlg = 0;
  }

  no($event: any) {
    this.stateFlg = 1;
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }


}
