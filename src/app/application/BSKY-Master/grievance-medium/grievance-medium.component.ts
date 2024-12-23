import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderService } from '../../header.service';
import Swal from 'sweetalert2';
import { GrievanceMediumService } from '../../Services/grievance-medium.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-grievance-medium',
  templateUrl: './grievance-medium.component.html',
  styleUrls: ['./grievance-medium.component.scss']
})
export class GrievanceMediumComponent implements OnInit {
  isSaveData: boolean = true;
  user: any;
  submitted: boolean = false;
  childmessage: any;
  item: any;
  getbyid: any;


  grievanceUpdate = {
    id: "",
    grivancemediumname: "",
    updatedby: "",
    statusFlag: ""


  };
  data: any;

  statusFlag: any;

  constructor(private grievancemediumservice: GrievanceMediumService, private route: Router, public headerService: HeaderService, private sessionService: SessionStorageService) {

    this.item = this.route.getCurrentNavigation().extras.state;

  }
  grievanceMedium = new FormGroup({
    grivancemediumname: new FormControl(''),
    createdby: new FormControl(''),


    statusFlag: new FormControl(''),
  });

  ngOnInit(): void {
    this.headerService.setTitle("Grievance-Medium");
    this.user = this.sessionService.decryptSessionData("user");
    if (this.item) {
      this.grievancemediumservice.getbyid(this.item.item).subscribe(
        (result: any) => {
          this.getbyid = result;
          this.grievanceUpdate.id = this.getbyid.id;
          this.grievanceUpdate.grivancemediumname = this.getbyid.grivancemediumname;
          this.grievanceUpdate.statusFlag = this.getbyid.statusFlag;
          this.statusFlag = this.getbyid.statusFlag;
          this.isSaveData = false;
        },
        (err: any) => {
        }
      );
    }
  }

  keyfunction1(e) {
    if (e.value[0] == " ") {
      $('#grievancemediumname').val('');
    }
  }
  saveData() {
    this.grievanceMedium.value.grievancemediumname = $("#grievancemediumname").val();

    var grievancemediumname = $('#grievancemediumname').val().toString();

    if (grievancemediumname == null || grievancemediumname == "" || grievancemediumname == undefined) {
      $("#grievancemediumname").focus();
      this.swal("Info", "Please Enter Grivance Name", 'info');
      return;
    }
    this.grievanceMedium.value.createdby = this.user.userId;

    Swal.fire({
      title: 'Are you sure?',
      text: "You want to Save this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Save it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.grievancemediumservice.savegrievancemedium(this.grievanceMedium.value).subscribe((response: any) => {
          this.data = response;
          if (this.data.status == "Success") {
            this.swal('Success', this.data.message, 'success')
            this.route.navigate(['/application/grievancemediumView']);
          } else if (this.data.status == "Failed") {
            this.swal('Success', this.data.message, 'error')
          }
          else {
            this.swal("Info", this.data.message, 'error');
          }
        })
      }
    })
  }
  resetData() {
  }
  update() {
    var grievancemediumname = $('#grievancemediumname').val().toString();
    if (grievancemediumname == null || grievancemediumname == "" || grievancemediumname == undefined) {
      $("#grievancemediumname").focus();
      this.swal("Info", "Please Enter Grievance Name", 'info');
      return;
    }
    this.grievanceUpdate.updatedby = this.user.userId;
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to Update this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Update it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.grievanceUpdate.grivancemediumname = $('#grievancemediumname').val().toString();
        this.grievanceUpdate.statusFlag = this.statusFlag;
        this.grievancemediumservice.updateGrievancemediumdata(this.grievanceUpdate).subscribe((response: any) => {
          this.data = response;
          if (this.data.status == "Success") {
            this.swal('Success', this.data.message, 'success');
            this.route.navigate(['/application/grievancemediumView']);
          } else if (this.data.status == "Failed") {
            this.swal('Success', this.data.message, 'error');
          }
          else {
            this.swal("Error", "Something went wrong", 'error');
          }
        })
      }
    })
  }
  yes($event: any) {
    this.statusFlag = 0;
  }
  no($event: any) {
    this.statusFlag = 1;
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }


}




