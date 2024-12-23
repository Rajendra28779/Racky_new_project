import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../header.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { HighEndDrugsService } from '../../Services/high-end-drugs.service';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-high-end-drugs',
  templateUrl: './high-end-drugs.component.html',
  styleUrls: ['./high-end-drugs.component.scss']
})
export class HighEndDrugsComponent implements OnInit {
  curruser: any;
  highEndForm: FormGroup;
  implantData: any;
  updateId: any;
  getByHighEndDrugsById: any;
  isUpdateBtnVisible: boolean;
  isUpdateBtnInVisible: boolean;
  maxChars = 200;
  wardList: any;
  implantCodeData: any;
  constructor(public headerService: HeaderService,
    public fb: FormBuilder,
    private highEndDrugsService: HighEndDrugsService,
    public route: Router,
    public activeroute: ActivatedRoute,
    private sessionService: SessionStorageService) { }

  updateHighEnddrugs = {
    //implantDetailsId: "",
    hedCode: "",
    hedName: "",
    unit: "",
    price: "",
    recomendedDose: "",
    isPreAuthRequired: "",
    unitEditable: "",
    priceEditable: "",
    //wardCategoryId: "",
    //implantCode: "",
    maximumUnit: "",
  }

  ngOnInit(): void {
    this.updateId = this.activeroute.snapshot.paramMap.get('id');
    this.headerService.setTitle('High End Drugs');
    this.curruser = this.sessionService.decryptSessionData("user");
    this.isUpdateBtnInVisible = true;
    this.isUpdateBtnVisible = false;

    // this.getImplantNames();
    this.getHighEndDrugsById();
    this.getWardName();

    this.highEndForm = this.fb.group({
      //wardCategoryId: new FormControl(''),
      //implantDetailsId: new FormControl(''),
      //implantCode: new FormControl(''),
      hedCode: new FormControl(''),
      hedName: new FormControl(''),
      unit: new FormControl(''),
      price: new FormControl(''),
      maximumUnit: new FormControl(''),
      recomendedDose: new FormControl(''),
      unitEditable: new FormControl(''),
      isPreAuthRequired: new FormControl(''),
      priceEditable: new FormControl(''),
      createdBy: this.curruser.userId,
      updatedBy: this.curruser.userId
    })
  }

  getImplantNames() {
    this.highEndDrugsService.getImplantName().subscribe((data: any) => {
      this.implantData = data;
    })
  }
  getWardName() {
    this.highEndDrugsService.getWardName().subscribe((data: any) => {
      this.wardList = data;
    })
  }

  getHighEndDrugsById() {
    if (!this.updateId) {
      return
    }
    this.highEndDrugsService.getHighEndDrugsById(this.updateId).subscribe((data: any) => {
      this.getByHighEndDrugsById = data;
      // this.updateHighEnddrugs.implantDetailsId = this.getByHighEndDrugsById.implantDetailsId.implantId;
      // this.updateHighEnddrugs.wardCategoryId = this.getByHighEndDrugsById.wardCategoryId.id;
      this.updateHighEnddrugs.hedCode = this.getByHighEndDrugsById.hedCode;
      this.updateHighEnddrugs.hedName = this.getByHighEndDrugsById.hedName;
      this.updateHighEnddrugs.unit = this.getByHighEndDrugsById.unit;
      this.updateHighEnddrugs.price = this.getByHighEndDrugsById.price;
      this.updateHighEnddrugs.recomendedDose = this.getByHighEndDrugsById.recomendedDose;
      this.updateHighEnddrugs.isPreAuthRequired = this.getByHighEndDrugsById.isPreAuthRequired;
      this.updateHighEnddrugs.unitEditable = this.getByHighEndDrugsById.unitEditable;
      this.updateHighEnddrugs.priceEditable = this.getByHighEndDrugsById.priceEditable;
      this.updateHighEnddrugs.maximumUnit = this.getByHighEndDrugsById.maximumUnit;
      // this.listOfImpalntCode(this.updateHighEnddrugs.wardCategoryId);
      // this.updateHighEnddrugs.implantCode = this.getByHighEndDrugsById.implantCode;
      this.isUpdateBtnInVisible = false;
      this.isUpdateBtnVisible = true;
    })
  }
  listOfImpalntCode(name: any) {
    this.highEndDrugsService.getImplantCode(name).subscribe((data: any) => {
      this.implantCodeData = data;
    })
  }
  save() {
    //let implantDetailsId = this.highEndForm.value.implantDetailsId;
    let hedCode = this.highEndForm.value.hedCode;
    let hedName = this.highEndForm.value.hedName;
    let unit = this.highEndForm.value.unit;
    let price = this.highEndForm.value.price;
    let recomendedDose = this.highEndForm.value.recomendedDose;
    let maximumUnit = this.highEndForm.value.maximumUnit;
    let isPreAuthRequired=this.highEndForm.value.isPreAuthRequired;
    let unitEditable=this.highEndForm.value.unitEditable;
    let priceEditable=this.highEndForm.value.priceEditable;
    // let wardCategoryId = this.highEndForm.value.wardCategoryId;
    // let implantCode = this.highEndForm.value.implantCode;
    // if (implantDetailsId == null || implantDetailsId == '' || implantDetailsId == 'undefined') {
    //   $("#implantDetailsId").focus();
    //   this.swal("Info", "Please Select Implant Name", 'info');
    //   return;
    // }
    // if (wardCategoryId == null || wardCategoryId == '' || wardCategoryId == 'undefined') {
    //   $("#wardCategoryId").focus();
    //   this.swal("Info", "Please Select Ward Name", 'info');
    //   return;
    // }
    // if (implantCode == null || implantCode == '' || implantCode == 'undefined') {
    //   $("#implantCode").focus();
    //   this.swal("Info", "Please Select Implant Code", 'info');
    //   return;
    // }
    if (hedCode == null || hedCode == '' || hedCode == 'undefined') {
      $("#hedCode").focus();
      this.swal("Info", "Please Enter HighEndDrug Code", 'info');
      return;
    }
    if (hedName == null || hedName == '' || hedName == 'undefined') {
      $("#hedName").focus();
      this.swal("Info", "Please Enter HighEndDrug Name", 'info');
      return;
    }
    if (unit == null || unit == '' || unit == 'undefined') {
      $("#unit").focus();
      this.swal("Info", "Please Enter No. Of Unit", 'info');
      return;
    }
    if (price == null || price == '' || price == 'undefined') {
      $("#price").focus();
      this.swal("Info", "Please Enter Per Unit Price", 'info');
      return;
    }
    if (maximumUnit == null || maximumUnit == '' || maximumUnit == 'undefined') {
      $("#maximumUnit").focus();
      this.swal("Info", "Please Enter Maximum Unit Price", 'info');
      return;
    }
    
    if (isPreAuthRequired == null || isPreAuthRequired == '' || isPreAuthRequired == 'undefined') {
      $("#isPreAuthRequired").focus();
      this.swal("Info", "Please Select Is Preauth Required", 'info');
      return;
    }
    if (unitEditable == null || unitEditable == '' || unitEditable == 'undefined') {
      $("#unitEditable").focus();
      this.swal("Info", "Please Select Unit Editable", 'info');
      return;
    }
    if (priceEditable == null || priceEditable == '' || priceEditable == 'undefined') {
      $("#priceEditable").focus();
      this.swal("Info", "Please Select Price Editable", 'info');
      return;
    }
    if (recomendedDose == null || recomendedDose == '' || recomendedDose == 'undefined') {
      $("#recomendedDose").focus();
      this.swal("Info", "Please Enter Recomended Dose", 'info');
      return;
    }
    // this.highEndDrugsService.checkDuplicateDrugCode(this.highEndForm.value.hedCode).subscribe((data: any) => {
    //   if (data.status == "Present") {
    //     Swal.fire({
    //       icon: 'error',
    //       title: 'Oops...',
    //       text: 'HighEndDrug Code  is already exist!'
    //     })
    //     return;
    //   }
    // })
    this.validateName();
    this.validateHedName();
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
          this.highEndDrugsService.updateHighEndDrugsById(this.highEndForm.value, this.updateId).subscribe((data: any) => {
            if (data.status == "Success") {
              this.swal("Success", data.message, "success");
              this.route.navigate(['/application/highEndDrugsView']);
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
        confirmButtonText: 'Yes, save it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.highEndDrugsService.saveHighEndDrugs(this.highEndForm.value).subscribe((data: any) => {
            if (data.status == "Success") {
              this.swal("Success", data.message, "success");
              this.route.navigate(['/application/highEndDrugsView']);
            } else if (data.status == "Failed") {
              this.swal("Error", data.message, "error");
            }

          })
        }
      })
    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
  validateName() {
    // let hedCode = this.highEndForm.value.hedCode
    // if (hedCode.length <= 4) {
    //   $("#hedCode").focus();
    //   this.swal("Info", "Drug code must be more than 5 character", 'info');
    //   return;
    // }
  }
  validateHedName() {
    // let hedName = this.highEndForm.value.hedName
    // if (hedName.length <= 4) {
    //   $("#hedName").focus();
    //   this.swal("Info", "HED Name must be more than 5 character", 'info');
    //   return;
    // }
  }
  resetForm() {
    window.location.reload();
  }
  Cancel() {
    this.route.navigate(['/application/highEndDrugsView']);
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

}
