import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { FacilityDetailServiceService } from '../../Services/facility-detail-service.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
//import { HeaderService } from '../header.service';
//import { FacilityDetailServiceService } from '../Services/facility-detail-service.service';

@Component({
  selector: 'app-facility-detail-master',
  templateUrl: './facility-detail-master.component.html',
  styleUrls: ['./facility-detail-master.component.scss']
})
export class FacilityDetailMasterComponent implements OnInit {

  isSaveData: boolean = true;
  // submitted: boolean=false;
  Remarksfrom: FormGroup;
  facilityUpdate:any;
  // isUpdateBtnInVisible: boolean = true;

  isUpdateData: boolean = false;
  dataa: any;
  user1: any;
  rmrk: any;
  rmkUpdate: any;
  item: any;
  submitted: boolean;
  data: any;
  // object: any;
  updateFacilitate = {
    facilityDetailId: "",
    facilityName: "",
    createdBy: "",
    createdOn: "",
    statusFlag: 0,
    updatedBy: "",
    updatedOn: ""

  };
  statusFlag: any;
  constructor(public headerService: HeaderService,private facilityDetailService:FacilityDetailServiceService,
    public route: Router,public formBuilder: FormBuilder, private sessionService: SessionStorageService) { 
      this.item = this.route.getCurrentNavigation().extras.state;
    }

  ngOnInit(): void {
    this.headerService.setTitle("Add Facility Details");
    this.user1 = this.sessionService.decryptSessionData("user");
    this.Remarksfrom = this.formBuilder.group({
      facilityDetailId: new FormControl(''),
      facilityName: new FormControl(''),
      createdBy: new FormControl('')
    });

    if (this.item) {
      this.isSaveData = false;
      this.isUpdateData = true;
      this.facilityDetailService.getbyId(this.item.facilityDetailId).subscribe(
        (result: any) => {
          console.log(result);
          this.facilityUpdate = result;
          this.updateFacilitate.facilityDetailId=this.facilityUpdate.facilityDetailId;
          this.updateFacilitate.facilityName = this.facilityUpdate.facilityName;
          // this.updateFacilitate.createdBy = this.facilityUpdate.createdBy;
         this.statusFlag=this.facilityUpdate.statusFlag;
          console.log(this.updateFacilitate.statusFlag);
          // this.statusFlag = this.bankUpdate.statusflag;(original)
          this.isSaveData = false;
          this.isUpdateData = true;
        }

      )
    }
  }


  SubmitCreate() {
    let facilityName = $("#facilityName").val().toString().trim();
    if (facilityName == null || facilityName == "" || facilityName == undefined) {
      $("#facilityName").focus();
      this.swal("Info", "Please Enter Facility Detail", 'info');
      return;
    }
    // this.form.value.createdBy = this.user1.userId;
    Swal.fire({
      title: 'Are you sure want to save?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Save it!'
    }).then((result) => {
      if (result.isConfirmed) {
        let object = {
          facilityName: facilityName,
          createdBy: this.user1.userId.toString(),
        }
        console.log(object.facilityName);
        this.facilityDetailService.saveFacilityData(object).subscribe(
          (result: any) => {
            console.log(result);
            this.data=result;
            if (this.data.status == "Success") {
              Swal.fire("Success", "Facility Detail Saved Successfully!!", "success")
              this.route.navigate(['application/facilitydetailview']);
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
  Reset(){
    window.location.reload();
  }
  yes($event: any) {
    console.log("++++++++" + $event + " is yes");

    this.statusFlag = 0;
    console.log(this.statusFlag);
  }

  no($event: any) {
    console.log("++++++++" + $event + " is No");

    this.statusFlag = 1;
    console.log(this.statusFlag);
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });

  }
  // keyPress1(event: KeyboardEvent) {
  //   const pattern = /^[A-Za-z0-9.,-_ \\s]+$/;
  //   const inputChar = String.fromCharCode(event.charCode);
  //   if (!pattern.test(inputChar)) {
  //     event.preventDefault();
  //   }
  // }


  // validateGroupName() {
  //   let groupTypeName = $("#groupTypeName").val().toString();
  //   if (!groupTypeName.match(this.minlengthforName)) {
  //     $("#groupTypeName").focus();
  //     this.swal("Info", "Group Type Name must be more than 3 character", 'info');
  //     return;
  //   }
  // }

  keyFunc1(e) {
   
      if (e.value[0] == " ") {
        $('#facilityName').val('');
      }
    else if (e.value[0] == "@") {
      $('#facilityName').val('');
    } 
    else if (e.value[0] == ' ') {
      $('#facilityName').val('')
    }
    else if (e.value[0] == "_") {
      $('#facilityName').val('')
    }
    else if (e.value[0] == ".") {
      $('#facilityName').val('')
    } else if (e.value[0] == "/") {
      $('#facilityName').val('')
    } else if (e.value[0] == ",") {
      $('#facilityName').val('')
    }
  }
  
  update(item: any) {
    let facilityName = $("#facilityName").val().toString();
    if (facilityName == null || facilityName == "" || facilityName == undefined) {
      $("#facilityName").focus();
      this.swal("Info", "Please Enter Facility Detail", 'info');
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
        this.updateFacilitate.updatedBy = this.user1.userId;
        this.updateFacilitate.facilityDetailId = this.facilityUpdate.facilityDetailId;
        this.updateFacilitate.facilityName = facilityName;
        this.updateFacilitate.statusFlag = this.statusFlag;
        console.log(this.statusFlag+"----------------"+ this.facilityUpdate.facilityDetailId);
        
        // alert(this.updateBank);
        this.facilityDetailService.updateFacilityDetial(this.updateFacilitate).subscribe(
          (result: any) => {
            console.log(result);
            this.data = result;
            if (this.data.status == "Success") {
              this.swal('Success', this.data.message, 'success')
              this.route.navigate(['application/facilitydetailview']);
            } else if (this.data.status == "Failed") {
              this.swal('Success', this.data.message, 'error')
            } else {
              this.swal("Error", "Something went wrong", 'error');
            }
          }
        )
      }
    },
      (err: any) => {
        console.log(err);
        this.swal("some error occur", "Try later", 'error');
      }
    )
  }
  cencel1(){
    this.route.navigate(['/application/facilitydetailview']);
  }


}
