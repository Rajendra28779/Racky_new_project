import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from '../../header.service';
import { CpdremarkService } from '../../Services/cpdremark.service';
import Swal from 'sweetalert2';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-cpdremark',
  templateUrl: './cpdremark.component.html',
  styleUrls: ['./cpdremark.component.scss']
})
export class CpdremarkComponent implements OnInit {
  isSaveData: boolean = true;
  // submitted: boolean=false;
  Remarksfrom: FormGroup;
  // isUpdateBtnInVisible: boolean = true;
  updateData = {
    remarks: ''
  }
  isUpdateData: boolean = false;
  dataa: any;
  user1: any;
  rmrk: any;
  rmkUpdate: any;
  item: any;
  submitted: boolean;
  constructor(public headerService: HeaderService, public fb: FormBuilder,
    public router: Router, private sessionService: SessionStorageService, private cpdremarkService: CpdremarkService,private route: Router) {
      this.rmrk = this.route.getCurrentNavigation().extras.state;

  }

  updateremark = {
    id: "",
    remarks: "",
    statusFlag:""
  };

  ngOnInit(): void {
    this.headerService.setTitle('CPD Remark Master');
    this.user1 = this.sessionService.decryptSessionData("user");
    
    this.Remarksfrom = this.fb.group({
      remarks: new FormControl('')
    })


    if (this.rmrk) {
      this.isSaveData = false;
      this.isUpdateData = true;
      this.cpdremarkService.getbyId(this.rmrk.id).subscribe(
        (result: any) => {
          this.rmkUpdate = result;
          this.updateremark.id=this.rmkUpdate.id;
          this.updateremark.remarks = this.rmkUpdate.remarks; 
          this.updateremark.statusFlag = this.rmkUpdate.statusFlag;  
          this.isSaveData = false;
          this.isUpdateData = true;
        }
      )
    }
  }
  SubmitCreate() {
    this.submitted=false;
    var remarks = $('#remarks').val().toString().trim();
    if (remarks == null || remarks == "" || remarks == undefined) {
      $("#remarks").focus();
      this.swal("Info", "Please Enter Remark", 'info');
      return;
    }
    // alert(remarks);
    Swal.fire({
      title: 'Are you sure?',
      // text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Save it!'
    }).then((result) => {
      if (result.isConfirmed) {
        let object = { 
          remarks:remarks,

          createdBy: this.user1.userId.toString(),
        }
        this.cpdremarkService.saveCpdRemark(object).subscribe((data: any) => {
          this.dataa = data;
          if (this.dataa.status === "Success") {
            this.swal("Success", this.dataa.message, "success");
            this.router.navigate(['/application/cpdremarkview']);
            this.submitted = false;
          } else if (this.dataa.status === "Failed") {
            this.swal("Error", this.dataa.message, "error");
          } else {
            this.swal("Error", "Something went wrong", 'error');
          }
        }
        );
      }
    })

  }

  keyPress1(event: KeyboardEvent) {
    const pattern = /^[A-Za-z0-9.,-_ \\s]+$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  update(items: any) {
    var remarks = $('#remarks').val().toString().trim();
    if (remarks == null || remarks == " " || remarks == undefined) {
      this.swal("Info", "Please Enter Remark", 'info');
      return;
    }
    Swal.fire({
      title: 'Are you sure want to update ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Update it!'
    }).then((result) => {
      if (result.isConfirmed) {
        let object={
          remarks :remarks,
          id:this.updateremark.id,
          statusFlag:this.updateremark.statusFlag
        }
        // alert(object.id+"and"+object.remarks);
       
       
        this.cpdremarkService.updateCpdRemark(object).subscribe(
          (result: any) => {
            this.dataa = result;
            if (this.dataa.status == "Success") {
              this.swal('Success', this.dataa.message, 'success')
              this.route.navigate(['application/cpdremarkview']);
            } else if (this.dataa.status == "Failed") {
              this.swal('Error', this.dataa.message, 'error')
            } else {
              this.swal("Error", "Something went wrong", 'error');
            }
          }
        )
      }
    },
      (err: any) => {
        console.log(err);
        this.swal("Error", "Something went wrong", 'error');
      }
    )
  }
  ResetForm(){
    window.location.reload();
  }
  keyPress(event: KeyboardEvent) {
    const pattern = /^[A-Za-z0-9.,-_ \\s]+$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  cancel1(){
    this.route.navigate(['/application/cpdremarkview']);
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });

  }

}
