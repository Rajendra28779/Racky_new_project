import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from '../../header.service';
import { WardMasterService } from '../../Services/ward-master.service';
import { PackageDetailsMasterService } from '../../Services/package-details-master.service';
import Swal from 'sweetalert2';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-ward-master',
  templateUrl: './ward-master.component.html',
  styleUrls: ['./ward-master.component.scss']
})
export class WardMasterComponent implements OnInit {
  packageDetailList: any;
  updatebutton: boolean;
  submitbutton: boolean;
  updateId: any;
  currentUser: any;
  Wardfrom: FormGroup;
  isUpdateBtnInVisible: boolean = true;
  childmessage: any;
  submitted: boolean=false;
  dataa: any;
  getByWardMasterById: any;
  hospitalCategory:any;
  packageHeader: any;
  wardmasterCategory: any;
  packageheaderId: any;
  packageDetailsDesc: any;

  constructor(public headerService: HeaderService,
    public wardMasterService: WardMasterService,
    public fb: FormBuilder,
    public router: Router,
    public packageDetailsMasterService: PackageDetailsMasterService,
    private activeroute: ActivatedRoute,
    private sessionService: SessionStorageService) { }
  updateData = {
    // packageHeaderCode:'',
    // hospitalCategoryId:'',
    // procedureCode: "",
    implantCode: "",
    wardName: "",
    unit: "",
    maximumUnit: "",
    // unitCyclePrice: "",
    // priceFixedEditable: "",

  }

  ngOnInit(): void {
    this.headerService.setTitle('Ward Master');

    this.currentUser = this.sessionService.decryptSessionData("user");

    this.Wardfrom = this.fb.group({
    //   packageHeaderCode:new FormControl(''),
    // hospitalCategoryId:new FormControl(''),
    //   procedureCode: new FormControl(''),
      implantCode: new FormControl(''),
      wardName: new FormControl(''),
      unit: new FormControl(''),
      maximumUnit: new FormControl(''),
      // unitCyclePrice: new FormControl(''),
      // priceFixedEditable: new FormControl(''),
      createdBy: this.currentUser.userId,
      updatedby: this.currentUser.userId,
    })
    //this.getAllprocedureCode();
    this.updateId = this.activeroute.snapshot.paramMap.get('wardMasterId');
   this.getbyWardId();
    this.updatebutton = false;
    this.submitbutton = true;
  //  this. getHospitalcategory();
  //  this.getPackageHeader();
  //  this.getWardCategoryMaster();
  }
  // getAllprocedureCode() {
  //   this.packageDetailsMasterService.getPackageDetails().subscribe((data: any) => {
  //     this.packageDetailList = data;

  //   })
  // }

  getbyWardId() {
    if (!this.updateId) {
      return;
    }
    this.isUpdateBtnInVisible = false;
    this.wardMasterService.getbywardId(this.updateId).subscribe((response: any) => {
      this.getByWardMasterById = response;
      // this.updateData.packageHeaderCode = this.getByWardMasterById.packageHeaderCode;
      // this.updateData.hospitalCategoryId = this.getByWardMasterById.hospitalCategoryId;
      // this.onChangeHeaderName(this.updateData.hospitalCategoryId);
      // this.updateData.procedureCode = this.getByWardMasterById.procedureCode;
      this.updateData.implantCode = this.getByWardMasterById.implantCode;
      this.updateData.wardName = this.getByWardMasterById.wardName;
      this.updateData.unit = this.getByWardMasterById.unit;
      this.updateData.maximumUnit = this.getByWardMasterById.maximumUnit;
      // this.updateData.unitCyclePrice = this.getByWardMasterById.unitCyclePrice;
      // this.updateData.priceFixedEditable = this.getByWardMasterById.priceFixedEditable;
      this.updatebutton = true;
      this.submitbutton = false;
    })
  }
  
  SubmitCreate(){
    // if (this.Wardfrom.value.procedureCode == null || this.Wardfrom.value.procedureCode == "" || this.Wardfrom.value.procedureCode == undefined) {
    //   $("#procedureCode").focus();
    //   this.swal("Info", "Please Select Procedure Code", 'info');
    //   return;
    // }
    if (this.Wardfrom.value.implantCode == null || this.Wardfrom.value.implantCode == "" || this.Wardfrom.value.implantCode == undefined) {
      $("#implantCode").focus();
      this.swal("Info", "Please Enter Implant Code", 'info');
      return;
    }
    if (this.Wardfrom.value.wardName == null || this.Wardfrom.value.wardName == "" || this.Wardfrom.value.wardName == undefined) {
      $("#wardName").focus();
      this.swal("Info", "Please Enter Ward Name", 'info');
      return;
    }
    if (this.Wardfrom.value.unit == null || this.Wardfrom.value.unit == "" || this.Wardfrom.value.unit == undefined) {
      $("#unit").focus();
      this.swal("Info", "Please Enter Unit", 'info');
      return;
    }
    if (this.Wardfrom.value.maximumUnit == null || this.Wardfrom.value.maximumUnit == "" || this.Wardfrom.value.maximumUnit == undefined) {
      $("#maximumUnit").focus();
      this.swal("Info", "Please Enter Maximum Unit", 'info');
      return;
    }
    // if (this.Wardfrom.value.unitCyclePrice == null || this.Wardfrom.value.unitCyclePrice == "" || this.Wardfrom.value.unitCyclePrice == undefined) {
    //   $("#unitCyclePrice").focus();
    //   this.swal("Info", "Please Enter Unitcycle Price", 'info');
    //   return;
    // }
    // if (this.Wardfrom.value.priceFixedEditable == null || this.Wardfrom.value.priceFixedEditable == "" || this.Wardfrom.value.priceFixedEditable == undefined) {
    //   $("#priceFixedEditable").focus();
    //   this.swal("Info", "Please Enter Pricefixed Editable", 'info');
    //   return;
    // }
   

    this.wardMasterService.checkDuplicateData(this.Wardfrom.value.wardName).subscribe((data:any)=>{
      if (data.status == "Present") {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'WardName is already exist!'
        })
        return;
      }
    })
    this.wardMasterService.checkDuplicateWardCode(this.Wardfrom.value.wardCode).subscribe((data:any)=>{
      if (data.status == "Present") {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'WardCode is already exist!'
        })
        return;
      } 
    })
    this.submitted = true;
    if (this.updateId) {
      Swal.fire({
        title: 'Are you sure to update?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, update it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.wardMasterService.updateward(this.Wardfrom.value, this.updateId).subscribe((data: any) => {
            this.dataa = data;
            if (this.dataa.status == "Success") {
              this.swal("Success", this.dataa.message, "success");
              this.router.navigate(['/application/wardView']);
            } else if (this.dataa.status == "Failed") {
              this.swal("Error", this.dataa.message, "error");
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
    this.wardMasterService.save(this.Wardfrom.value).subscribe((data:any)=>{
      this.dataa = data;
      this.Wardfrom = data.data;
      if (this.dataa.status == "Success") {
        this.swal("Success", this.dataa.message, "success");
        this.router.navigate(['/application/wardView']);
      } else if (this.dataa.status == "Failed") {
        this.swal("Error", this.dataa.message, "error");
      }
    })
  }
})
}
}
swal(title: any, text: any, icon: any) {
Swal.fire({
icon: icon,
title: title,
text: text
});

}
  ResetForm(){
    window.location.reload();
  }
  cancel(){
    this.router.navigate(['/application/wardView']);
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }
  // getHospitalcategory() {
  //   this.packageDetailsMasterService.getAllHospitalCategory().subscribe((data: any) => {
  //     this.hospitalCategory = data;
  //   })
//}
// getPackageHeader() {
//   this.packageDetailsMasterService.getAllHeader().subscribe((data: any) => {
//     this.packageHeader = data;
//   })
// }
// getWardCategoryMaster(){
//   this.wardMasterService.getallWardCategorydata().subscribe((data:any)=>{
//     this.wardmasterCategory=data;
//   })
// }
onChangeHeaderName(id) {
//   localStorage.setItem("packageheadercode", id);
//   for (var i = 0; i < this.packageDetailList?.length; i++) {
//     var packageHeader = this.packageDetailList[i];
//     if (id == packageHeader.packageheadercode) {
//       this.packageheaderId = packageHeader.headerId;
//     }
// }
this.wardMasterService.getPackagdescription(id).subscribe((res:any)=>{
  this.packageDetailsDesc=res;
})
}
// onChangeSubCategory(id){
//   this.wardMasterService.getPackagdescription(id).subscribe((res:any)=>{
//     this.packageDetailsDesc=res;
//   })
// }
}