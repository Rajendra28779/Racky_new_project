import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { PackageHeaderService } from '../Services/package-header.service';
import Swal from 'sweetalert2';
import { HeaderService } from '../header.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';


@Component({
  selector: 'app-package-header',
  templateUrl: './package-header.component.html',
  styleUrls: ['./package-header.component.scss']
})
export class PackageHeaderComponent implements OnInit {
  packageForm: FormGroup;
  dataa: any;
  submitted: boolean = false;
  updateId: any;
  updatebutton: boolean;
  submitbutton: boolean;
  isUpdateBtnInVisible: boolean = true;
  childmessage: any;
  currentUser: any;

  constructor(public headerService: HeaderService,
    private route: Router,
    private activeroute: ActivatedRoute,
    public fb: FormBuilder,
    private packageHeaderService: PackageHeaderService,private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle('Package Header');
    this.currentUser = this.sessionService.decryptSessionData("user");
    this.packageForm = this.fb.group({
      packageheadername: new FormControl(''),
      packageheadercode: new FormControl(''),
      createdBy: this.currentUser.userId,
      updatedby: this.currentUser.userId,
    })
    this.updateId = this.activeroute.snapshot.paramMap.get('headerId');
    this.getPackageheaderData();
    this.submitbutton = true;
    this.updatebutton = false;

  }

  getPackageheaderData() {
    if (!this.updateId) {
      return;
    }
    this.isUpdateBtnInVisible = false;
    this.packageHeaderService.getbypackageHeader(this.updateId).subscribe((res: any) => {
      this.updatebutton = true;
      this.submitbutton = false;
      const { packageheadername, packageheadercode } = res;
      this.packageForm.patchValue({
        packageheadername: packageheadername,
        packageheadercode: packageheadercode

      })
    })
  }
  onKeypressEvent() {
    this.swal("Info", "Package Header code is not editable", 'info');
  }

  SubmitCreate() {
    if (this.packageForm.value.packageheadername == null || this.packageForm.value.packageheadername == "" || this.packageForm.value.packageheadername == undefined) {
      $("#packageheadername").focus();
      this.swal("Info", "Please Enter Package Header Name", 'info');
      return;
    }
    if (this.packageForm.value.packageheadercode == null || this.packageForm.value.packageheadercode == "" || this.packageForm.value.packageheadercode == undefined) {
      $("#packageheadercode").focus();
      this.swal("Info", "Please Enter Package Header Code", 'info');
      return;
    }
    this.validatePHName();
    this.validatePHCode();
    this.packageHeaderService.checkDuplicateData(this.packageForm.value.packageheadername).subscribe((data: any) => {
      if (data.status == "Present") {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Package Header Name is already exist!'
        })
        return;
      }
    })
    // this.packageHeaderService.checkDuplicateDatapackageheadercode(this.packageForm.value.packageheadercode).subscribe((data:any)=>{
    //   if (data.status == "Present") {
    //     Swal.fire({
    //       icon: 'error',
    //       title: 'Oops...',
    //       text: 'Package Header Code is already exist!'
    //     })
    //     return;
    //   }
    // })

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
          this.packageHeaderService.updatepackageheader(this.packageForm.value, this.updateId).subscribe((data: any) => {
            this.dataa = data;
            if (this.dataa.status == "Success") {
              this.swal("Success", this.dataa.message, "success");
              this.route.navigate(['/application/packageHeaderView']);

            }
            else if (this.dataa.status == "Failed") {
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
          this.packageHeaderService.save(this.packageForm.value).subscribe((data: any) => {
            this.dataa = data;
            this.packageForm = data.data;
            if (this.dataa.status == "Success") {
              this.swal("Success", this.dataa.message, "success");
              this.route.navigate(['/application/packageHeaderView']);

            }
            else if (this.dataa.status == "Failed") {
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
  validatePHName() {
    // let packageheadername = this.packageForm.value.packageheadername;
    // if (packageheadername.length <= 4) {
    //   $("#packageheadername").focus();
    //   this.swal("Info", "Package header name must be more than 5 character", 'info');
    //   return;
    // }
  }
  validatePHCode() {
    // let packageheadercode = this.packageForm.value.packageheadercode;
    // if (packageheadercode.length <= 2) {
    //   $("#packageheadercode").focus();
    //   this.swal("Info", "Package headerCode must be more than 5 character", 'info');
    //   return;
    // }
  }
  cancel() {
    this.route.navigate(['/application/packageHeaderView']);
  }

}
