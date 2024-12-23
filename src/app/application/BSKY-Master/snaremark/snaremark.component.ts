import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HeaderService } from '../../header.service';
import Swal from 'sweetalert2';
import { SnaremarkService } from '../../Services/snaremark.service';
import { Router } from '@angular/router';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-snaremark',
  templateUrl: './snaremark.component.html',
  styleUrls: ['./snaremark.component.scss']
})
export class SnaremarkComponent implements OnInit {

  isSaveData: boolean = true;
  isUpdateData: boolean = false;
  Remarksfrom: FormGroup;
  user1: any;
  submitted: boolean;
  dataa: any;
  rmrk: any;
  rmkUpdate: any;
  constructor(public headerService: HeaderService, public fb: FormBuilder,private snaremarkService: SnaremarkService,
    private route: Router, private sessionService: SessionStorageService) {
      this.rmrk = this.route.getCurrentNavigation().extras.state;
     }

    updateremark = {
      id: "",
      remarks: "",
      statusFlag:""
    };
  ngOnInit(): void {
    this.headerService.setTitle('SNA Remark Master');
    this.user1 = this.sessionService.decryptSessionData("user");
    
    this.Remarksfrom = this.fb.group({
      remarks: new FormControl('')
    })
    
    if (this.rmrk) {
      this.isSaveData = false;
      this.isUpdateData = true;
      this.snaremarkService.getbyId(this.rmrk.id).subscribe(
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
        this.snaremarkService.saveSnaRemark(object).subscribe((data: any) => {
          this.dataa = data;
          if (this.dataa.status === "Success") {
            this.swal("Success", this.dataa.message, "success");
            this.route.navigate(['/application/snaremarkview']);
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

  reset(){
    window.location.reload();
  }

  cancel1(){
    this.route.navigate(['/application/snaremarkview']);
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
       
       
        this.snaremarkService.updatesnaRemark(object).subscribe(
          (result: any) => {
            this.dataa = result;
            if (this.dataa.status == "Success") {
              this.swal('Success', this.dataa.message, 'success')
              this.route.navigate(['application/snaremarkview']);
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


  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });

  }



  keyPress1(event: KeyboardEvent) {
    const pattern = /^[A-Za-z0-9.,-_ \\s]+$/;
    //var regex = new RegExp("^[A-Za-z0-9.,-\\s]+$");
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
        // invalid character, prevent input
        event.preventDefault();
    }
  }

}
