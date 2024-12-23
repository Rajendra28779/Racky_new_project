import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../header.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { HospitalPackageMappingService } from '../../Services/hospital-package-mapping.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-hospital-package-mapping',
  templateUrl: './hospital-package-mapping.component.html',
  styleUrls: ['./hospital-package-mapping.component.scss']
})
export class HospitalPackageMappingComponent implements OnInit {

  mappingForm: FormGroup;
  packageHeaderItem: any;
  selectedItems: any = [];
  //public stateList: any = [];
  public districtList: any = [];
  public hospitalList: any = [];
  packageDetailsDesc: any;
  keyword = 'packageheadername';
  keyword1 = 'procedureDescription';
  headerCode: any;
  packageDetailsName: any;
  packageheaderId: any;
  updateId: any;
  isUpdateBtnVisible: boolean;
  isUpdateBtnInVisible: boolean;
  getByHospitalMappingById: any;
  curruser: any;
  stateData: any = [];
  stateList: Array<any> = [];
  packageSubData: any;


  constructor(public headerService: HeaderService,
    public fb: FormBuilder,
    private hospitalPackageMappingService: HospitalPackageMappingService,
    private snoService: SnocreateserviceService,
    public route: Router,
    public activeroute: ActivatedRoute,
    private sessionService: SessionStorageService) { }
  updateData = {
    hospitalState: "",
    hospitalDistrict: "",
    hospitalCode: "",
    packageDetailsId: "",
    packageHeaderId: "",
    packageId: "",
    packageSubcategoryId:""

  }

  ngOnInit(): void {
    this.updateId = this.activeroute.snapshot.paramMap.get('id');

    this.isUpdateBtnInVisible = true;
    this.isUpdateBtnVisible = false;
    this.headerService.setTitle('Hospital Package Mapping');
    this.getPackageHeader();
    this.getByHospitalMappingId();
    this.getStateList();

    this.curruser = this.sessionService.decryptSessionData("user");

    this.mappingForm = this.fb.group({
      hospitalState: new FormControl(''),
      hospitalDistrict: new FormControl(''),
      hospitalCode: new FormControl(''),
      packageHeaderId: new FormControl(''),
      packageDetailsId: new FormControl(''),
      packageSubcategoryId:new FormControl(''),
      createdBy: this.curruser.userId,
      updatedBy: this.curruser.userId

    });
  }

  getByHospitalMappingId() {
    if (!this.updateId) {
      return;
    }

    this.hospitalPackageMappingService.getByHospitalpackageMappingId(this.updateId).subscribe((response: any) => {
      this.getByHospitalMappingById = response;
      this.updateData.hospitalState = this.getByHospitalMappingById.hospitalState;
      this.OnChangeState(this.updateData.hospitalState);
      this.updateData.hospitalDistrict = this.getByHospitalMappingById.hospitalDistrict;
      this.OnChangeDistrict(this.updateData.hospitalDistrict);
      this.updateData.hospitalCode = this.getByHospitalMappingById.hospitalCode.hospitalCode;
      this.updateData.packageHeaderId = this.getByHospitalMappingById.packageHeaderId.packageheadercode;
      this.packageheaderId = this.getByHospitalMappingById.packageHeaderId.headerId
      this.onChangeHeaderName(this.updateData.packageHeaderId)
      this.updateData.packageSubcategoryId=this.getByHospitalMappingById.packageSubcategoryId.subcategoryId;
      this.onChangeSubCategory(this.updateData.packageSubcategoryId)
      this.updateData.packageDetailsId = this.getByHospitalMappingById.packageDetailsId.id;
      this.isUpdateBtnInVisible = false;
      this.isUpdateBtnVisible = true;
    })
  }

  getPackageHeader() {
    this.hospitalPackageMappingService.getallPackageHeaders().subscribe((data: any) => {
      this.packageHeaderItem = data;
    })
  }

  OnChangeState(id) {
    $("#hospitalDistrict").val("");
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

  getStateList() {
    this.snoService.getStateList().subscribe(
      (response) => {
        // this.stateList = response;
        this.stateData = response;
        this.stateData.sort((a, b) => a.stateName.localeCompare(b.stateName));
        for (let j = 0; j < this.stateData.length; j++) {
          if (this.stateData[j].stateCode == '21') {
            this.stateList.push(this.stateData[j]);
          }
        }
        for (let i = 0; i < this.stateData.length; i++) {
          if (this.stateData[i].stateCode != '21') {
            this.stateList.push(this.stateData[i]);
          }
        }
      },
      (error) => console.log(error)
    )
  }
  save() {
    let hospitalState = this.mappingForm.value.hospitalState;
    let hospitalDistrict = this.mappingForm.value.hospitalDistrict;
    let hospitalCode = this.mappingForm.value.hospitalCode;
    let packageHeaderId = this.mappingForm.value.packageHeaderId;
    let packageDetailsId = this.mappingForm.value.packageDetailsId;
    let packageSubcategoryId=this.mappingForm.value.packageSubcategoryId;
    if (hospitalState == null || hospitalState == '' || hospitalState == 'undefined') {
      $("#hospitalState").focus();
      this.swal("Info", "Please Select State Name", 'info');
      return;

    }
    if (hospitalDistrict == null || hospitalDistrict == '' || hospitalState == 'undefined') {
      $("#hospitalDistrict").focus();
      this.swal("Info", "Please Select District Name", 'info');
      return;

    }
    if (hospitalCode == null || hospitalCode == '' || hospitalCode == 'undefined') {
      $("#hospitalCode").focus();
      this.swal("Info", "Please Select Hospital Name", 'info');
      return;

    }
    if (packageHeaderId == null || packageHeaderId == '' || packageHeaderId == 'undefined') {
      $("#packageHeaderId").focus();
      this.swal("Info", "Please Select Package Header Name", 'info');
      return;

    }
    if (packageSubcategoryId == null || packageSubcategoryId == '' || packageSubcategoryId == 'undefined') {
      $("#packageSubcategoryId").focus();
      this.swal("Info", "Please Select Package SubCategory", 'info');
      return;

    }
    if (packageDetailsId == null || packageDetailsId == '' || packageDetailsId == 'undefined') {
      $("#packageDetailsId").focus();
      this.swal("Info", "Please Select Package Details", 'info');
      return;
    }
    
    if (this.updateId) {
      Swal.fire({
        title: 'Are you sure  to update?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, update it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.mappingForm.value.packageHeaderId = this.packageheaderId
          this.hospitalPackageMappingService.updateHospitalMappingById(this.mappingForm.value, this.updateId).subscribe((data: any) => {
            if (data.status == "Success") {
              this.swal("Success", data.message, "success");
              this.route.navigate(['/application/hospitalpackagemappingview']);
            } else if (data.status == "Failed") {
              this.swal("Error", data.message, "error");
            }
          })
        }
      })

    }
    else {
      Swal.fire({
        title: 'Are you sure  to save?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Save it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.mappingForm.value.packageHeaderId = this.packageheaderId
          this.hospitalPackageMappingService.saveHospitalPackageMapping(this.mappingForm.value).subscribe((data: any) => {
            if (data.status == "success") {
              this.swal("Success", data.message, "success");
              this.route.navigate(['/application/hospitalpackagemappingview']);
            } else if (data.status == "Failed") {
              this.swal("Error", data.message, "error");
            }
          })
        }
      })
    }
  }
  resetForm() {
    window.location.reload();
  }
  onChangeHeaderName(id) {
    localStorage.setItem("packageheadercode", id);
    for (var i = 0; i < this.packageHeaderItem?.length; i++) {
      var packageHeader = this.packageHeaderItem[i];
      if (id == packageHeader.packageheadercode) {
        this.packageheaderId = packageHeader.headerId;
      }
    }
    // this.hospitalPackageMappingService.getPackageDetailsDescription(id).subscribe((res: any) => {
    //   this.packageDetailsDesc = res;
    // })
    this.hospitalPackageMappingService.getPackageSubcategory(id).subscribe((res:any)=>{
      this.packageSubData=res;
    })
  }
  onChangeSubCategory(id){
    this.hospitalPackageMappingService.getPackageDetailsDescription(id,1).subscribe((res:any)=>{
      this.packageDetailsDesc=res;
    })
  }
  Cancel(){
    this.route.navigate(['/application/hospitalpackagemappingview']);
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

}
