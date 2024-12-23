import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { HeaderService } from '../../header.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ImplantMasterService } from '../../Services/implant-master.service';
import { PackageDetailsMasterService } from '../../Services/package-details-master.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-implant-master',
  templateUrl: './implant-master.component.html',
  styleUrls: ['./implant-master.component.scss']
})
export class ImplantMasterComponent implements OnInit {
  Implantfrom: FormGroup;

  updatebutton: boolean;
  submitbutton: boolean;
  submitted: boolean = false;
  dataa: any;
  updateId: any;
  isUpdateBtnInVisible: boolean = true;
  childmessage: any;
  currentUser: any;
  packageDetailList: any;
  getByImplantMasterById: any;
  constructor(public headerService: HeaderService,
    public implantMasterService: ImplantMasterService,
    public fb: FormBuilder,
    public router: Router,
    public packageDetailsMasterService: PackageDetailsMasterService,
    private activeroute: ActivatedRoute,
    private sessionService: SessionStorageService) { }
  updateData = {
    procedureCode: "",
    implantCode: "",
    implantName: "",
    unit: "",
    maximumUnit: "",
    perunitCyclePrice: "",
    priceEditable: "",
    unitEditable: "",

  }

  ngOnInit(): void {
    this.headerService.setTitle('Implant Master');

    this.currentUser = this.sessionService.decryptSessionData("user");

    this.Implantfrom = this.fb.group({
      //procedureCode: new FormControl(''),
      implantCode: new FormControl(''),
      implantName: new FormControl(''),
      unit: new FormControl(''),
      maximumUnit: new FormControl(''),
      perunitCyclePrice: new FormControl(''),
      priceEditable: new FormControl(''),
      unitEditable: new FormControl(''),
      createdBy: this.currentUser.userId,
      updatedby: this.currentUser.userId,
    })
    //this.getAllprocedureCode();
    this.updateId = this.activeroute.snapshot.paramMap.get('implantId');
    this.getbyImplantId();
    this.updatebutton = false;
    this.submitbutton = true;
  }
  // getAllprocedureCode() {
  //   this.packageDetailsMasterService.getPackageDetails().subscribe((data: any) => {
  //     this.packageDetailList = data;

  //   })
  // }
  getbyImplantId() {
    if (!this.updateId) {
      return;
    }
    this.isUpdateBtnInVisible = false;
    this.implantMasterService.getbyimplantId(this.updateId).subscribe((response: any) => {
      this.getByImplantMasterById = response;
      this.updateData.implantCode = this.getByImplantMasterById.implantCode;
      this.updateData.implantName = this.getByImplantMasterById.implantName;
      this.updateData.unit = this.getByImplantMasterById.unit;
      this.updateData.maximumUnit = this.getByImplantMasterById.maximumUnit;
      this.updateData.perunitCyclePrice = this.getByImplantMasterById.perunitCyclePrice;
      this.updateData.priceEditable = this.getByImplantMasterById.priceEditable;
      this.updateData.unitEditable = this.getByImplantMasterById.unitEditable;
      this.updatebutton = true;
      this.submitbutton = false;
    })
  }


  SubmitCreate() {
    // if (this.Implantfrom.value.procedureCode == null || this.Implantfrom.value.procedureCode == "" || this.Implantfrom.value.procedureCode == undefined) {
    //   $("#procedureCode").focus();
    //   this.swal("Info", "Please Select Procedure Code", 'info');
    //   return;
    // }
    if (this.Implantfrom.value.implantCode == null || this.Implantfrom.value.implantCode == "" || this.Implantfrom.value.implantCode == undefined) {
      $("#implantCode").focus();
      this.swal("Info", "Please Enter Implant Code", 'info');
      return;
    }
    if (this.Implantfrom.value.implantName == null || this.Implantfrom.value.implantName == "" || this.Implantfrom.value.implantName == undefined) {
      $("#implantName").focus();
      this.swal("Info", "Please Enter Implant Name", 'info');
      return;
    }
    if (this.Implantfrom.value.unit == null || this.Implantfrom.value.unit == "" || this.Implantfrom.value.unit == undefined) {
      $("#unit").focus();
      this.swal("Info", "Please Enter Unit", 'info');
      return;
    }
    if (this.Implantfrom.value.maximumUnit == null || this.Implantfrom.value.maximumUnit == "" || this.Implantfrom.value.maximumUnit == undefined) {
      $("#maximumUnit").focus();
      this.swal("Info", "Please Enter Maximum Unit", 'info');
      return;
    }
    if (this.Implantfrom.value.perunitCyclePrice == null || this.Implantfrom.value.perunitCyclePrice == "" || this.Implantfrom.value.perunitCyclePrice == undefined) {
      $("#perunitCyclePrice").focus();
      this.swal("Info", "Please Enter PerUnitcycle Price", 'info');
      return;
    }
    if (this.Implantfrom.value.priceEditable == null || this.Implantfrom.value.priceEditable == "" || this.Implantfrom.value.priceEditable == undefined) {
      $("#priceEditable").focus();
      this.swal("Info", "Please Enter Price Editable", 'info');
      return;
    }
    if (this.Implantfrom.value.unitEditable == null || this.Implantfrom.value.unitEditable == "" || this.Implantfrom.value.unitEditable == undefined) {
      $("#unitEditable").focus();
      this.swal("Info", "Please Enter Unit Editable", 'info');
      return;
    }

    
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
          this.implantMasterService.updateimplant(this.Implantfrom.value, this.updateId).subscribe((data: any) => {
            this.dataa = data;
            if (this.dataa.status == "Success") {
              this.swal("Success", this.dataa.message, "success");
              this.router.navigate(['/application/implantView']);
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
          this.implantMasterService.save(this.Implantfrom.value).subscribe((data: any) => {
            this.dataa = data;
            this.Implantfrom = data.data;
            if (this.dataa.status == "Success") {
              this.swal("Success", this.dataa.message, "success");
              this.router.navigate(['/application/implantView']);
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
  ResetForm() {

    window.location.reload();
  }

  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }
  cancel(){
    this.router.navigate(['/application/implantView']);
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
}

