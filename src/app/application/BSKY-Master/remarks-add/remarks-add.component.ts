import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { HeaderService } from '../../header.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RemarksMasterService } from '../../Services/remarks-master.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-remarks-add',
  templateUrl: './remarks-add.component.html',
  styleUrls: ['./remarks-add.component.scss']
})
export class RemarksAddComponent implements OnInit {
  Remarksfrom: FormGroup;
  submitted: boolean = false;
  dataa: any;
  isUpdateBtnInVisible: boolean = true;
  updateId: any;
  updatebutton: boolean;
  submitbutton: boolean;
  getByRemarkMasterById: any;
  constructor(public headerService: HeaderService,
    public remarksMasterService: RemarksMasterService,
    public fb: FormBuilder,
    public router: Router,
    //public packageDetailsMasterService: PackageDetailsMasterService,
    private activeroute: ActivatedRoute) { }
  updateData = {
    remarks: ''
  }
  ngOnInit(): void {
    this.headerService.setTitle('Remarks Master');

    this.Remarksfrom = this.fb.group({
      remarks: new FormControl('')
    })
    this.updateId = this.activeroute.snapshot.paramMap.get('id');
    this.getbyRemarkId();
    this.updatebutton = false;
    this.submitbutton = true;

  }

  getbyRemarkId() {
    if (!this.updateId) {
      return;
    }
    this.isUpdateBtnInVisible = false;
    this.remarksMasterService.getbyRemark(this.updateId).subscribe((response: any) => {
      this.getByRemarkMasterById = response;
      this.updateData.remarks = this.getByRemarkMasterById.remarks;
      this.updatebutton = true;
      this.submitbutton = false;
    })
  }



  SubmitCreate() {
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
          this.remarksMasterService.updateRemark(this.Remarksfrom.value, this.updateId).subscribe((data: any) => {
            this.dataa = data;
            if (this.dataa.status == "Success") {
              this.swal("Success", this.dataa.message, "success");
              this.router.navigate(['/application/remarksView']);
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
          this.remarksMasterService.save(this.Remarksfrom.value).subscribe((data: any) => {
            this.Remarksfrom = data;
            this.dataa = data;
            if (this.dataa.status == "Success") {
              this.swal("Success", this.dataa.message, "success");
              this.router.navigate(['/application/remarksView']);
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
}
