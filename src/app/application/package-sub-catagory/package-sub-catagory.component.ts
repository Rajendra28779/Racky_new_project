import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PackageSubCategoryService } from '../Services/package-sub-category.service';
import { HeaderService } from '../header.service';
import Swal from 'sweetalert2';
import { PackageHeaderService } from '../Services/package-header.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-package-sub-catagory',
  templateUrl: './package-sub-catagory.component.html',
  styleUrls: ['./package-sub-catagory.component.scss']
})
export class PackageSubCatagoryComponent implements OnInit {
  pkgSubCatagoryForm: FormGroup
  submitted: boolean = false;
  dataa: any;
  packageheadercode: any;
  packageHeaderView: any;
  updateId: any;
  updatebutton: boolean;
  submitbutton: boolean;
  childmessage: any;
  isUpdateBtnInVisible: boolean = true;
  currentUser: any;
  constructor(private route: Router,
    public fb: FormBuilder,
    private packageHeaderService: PackageHeaderService,
    private packageSubCategoryService: PackageSubCategoryService,
    public headerService: HeaderService,
    private activeroute: ActivatedRoute,private sessionService: SessionStorageService
  ) { }
  addGroup = new FormGroup({
    packageheadercode: new FormControl(''),
    subcategoryName: new FormControl(''),
    packagesubcategoryname: new FormControl(''),
    packagesubcatagorycode: new FormControl(''),
  });

  ngOnInit(): void {
    this.headerService.setTitle('Package SubCategory');
    this.currentUser = this.sessionService.decryptSessionData("user");
    this.pkgSubCatagoryForm = this.fb.group({
      packageheadercode: new FormControl(''),
      subcategoryName: new FormControl(''),
      packagesubcategoryname: new FormControl(''),
      packagesubcategorycode: new FormControl(''),
      createdBy: this.currentUser.userId,
      updatedby: this.currentUser.userId,
    })
    this.getAll();
    this.updateId = this.activeroute.snapshot.paramMap.get('subcategoryId');

    this.getbyPackagesubcategory();
    this.submitbutton = true;
    this.updatebutton = false;

  }
  getAll() {
    this.packageHeaderService.getalldata().subscribe((data: any) => {
      this.packageHeaderView = data;
    })
  }
  SubmitCreate() {

    if (this.pkgSubCatagoryForm.value.packageheadercode == null || this.pkgSubCatagoryForm.value.packageheadercode == "" || this.pkgSubCatagoryForm.value.packageheadercode == undefined) {
      $("#packageheadercode").focus();
      this.swal("Info", "Please Select Package Header Code", 'info');
      return;
    }
    if (this.pkgSubCatagoryForm.value.subcategoryName == null || this.pkgSubCatagoryForm.value.subcategoryName == "" || this.pkgSubCatagoryForm.value.subcategoryName == undefined) {
      $("#subcategoryName").focus();
      this.swal("Info", "Please Select Sub Category Name", 'info');
      return;
    }
    if (this.pkgSubCatagoryForm.value.packagesubcategoryname == null || this.pkgSubCatagoryForm.value.packagesubcategoryname == "" || this.pkgSubCatagoryForm.value.packagesubcategoryname == undefined) {
      $("#packagesubcategoryname").focus();
      this.swal("Info", "Please Enter Package Subcategory Name", 'info');
      return;
    }
    if (this.pkgSubCatagoryForm.value.packagesubcategorycode == null || this.pkgSubCatagoryForm.value.packagesubcategorycode == "" || this.pkgSubCatagoryForm.value.packagesubcategorycode == undefined) {
      $("#packagesubcategorycode").focus();
      this.swal("Info", "Please Enter Package Subcategory Code", 'info');
      return;
    }
    this.validatePSCName();
    this.validatePSCode();
    //   this.packageSubCategoryService.checkDuplicatesubcategorycode(this.pkgSubCatagoryForm.value.packagesubcategorycode).subscribe((data:any)=>{
    //     if (data.status == "Present") {
    //       Swal.fire({
    //         icon: 'error',
    //         title: 'Oops...',
    //         text: 'Package Subcategory Code is already exist!'
    //       })
    //       return;
    //     }
    //   })
    //   this.packageSubCategoryService.checkDuplicateData(this.pkgSubCatagoryForm.value.packagesubcategoryname).subscribe((data:any)=>{
    //     if (data.status == "Present") {
    //       Swal.fire({
    //         icon: 'error',
    //         title: 'Oops...',
    //         text: 'Package Subcategory Name is already exist!'
    //       })
    //       return;
    //     }
    //   })
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
          this.packageSubCategoryService.updatePackagesubcategory(this.pkgSubCatagoryForm.value, this.updateId).subscribe((data: any) => {
            this.dataa = data;
            if (this.dataa.status == "Success") {
              this.swal("Success", this.dataa.message, "success");
              this.route.navigate(['/application/packageSubCategoryView']);
            } else if (this.dataa.status == "Failed") {
              this.swal("Error", this.dataa.message, "error");
            }
            else if (this.dataa.status == "Present") {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Package Subcategory Name is already exist!'
              })
            }
            else if (this.dataa.status == "PresentSub") {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Package Subcategory Code is already exist!'
              })
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
          this.packageSubCategoryService.save(this.pkgSubCatagoryForm.value).subscribe((data: any) => {
            this.dataa = data;
            this.pkgSubCatagoryForm = data.data;
            if (this.dataa.status == "Success") {
              this.swal("Success", this.dataa.message, "success");
              this.route.navigate(['/application/packageSubCategoryView']);
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


  getbyPackagesubcategory() {
    if (!this.updateId) {
      return;
    }
    this.isUpdateBtnInVisible = false;
    this.packageSubCategoryService.getbyPackagesubcategory(this.updateId).subscribe((res: any) => {
      this.updatebutton = true;
      this.submitbutton = false;
      const { packageheadercode, subcategoryName, packagesubcategoryname, packagesubcategorycode } = res;
      this.pkgSubCatagoryForm.patchValue({
        packageheadercode: packageheadercode,
        subcategoryName: subcategoryName,
        packagesubcategoryname: packagesubcategoryname,
        packagesubcategorycode: packagesubcategorycode,
      })
    })
  }
  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }
  validatePSCName() {
    // let packagesubcategoryname = this.pkgSubCatagoryForm.value.packagesubcategoryname;
    // if (packagesubcategoryname.length <= 4) {
    //   $("#packagesubcategoryname").focus();
    //   this.swal("Info", "Package subcategory name must be more than 5 character", 'info');
    //   return;
    // }
  }
  validatePSCode() {
    // let packagesubcategorycode = this.pkgSubCatagoryForm.value.packagesubcategorycode;
    // if (packagesubcategorycode.length <= 4) {
    //   $("#packagesubcategorycode").focus();
    //   this.swal("Info", "Package subcategory code must be more than 5 character", 'info');
    //   return;
    // }
  }
  Cancel() {
    this.route.navigate(['/application/packageSubCategoryView']);
  }

}
