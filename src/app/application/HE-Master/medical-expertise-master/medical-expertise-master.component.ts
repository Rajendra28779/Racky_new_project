import { Component, OnInit } from '@angular/core';
// import { HeaderService } from '../header.service';
import { Router } from '@angular/router';
// import { EmpanelmentmasterserviceService } from '../Services/empanelmentmasterservice.service';
import { FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { EmpanelmentmasterserviceService } from '../../Services/empanelmentmasterservice.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-medical-expertise-master',
  templateUrl: './medical-expertise-master.component.html',
  styleUrls: ['./medical-expertise-master.component.scss'],
})
export class MedicalExpertiseMasterComponent implements OnInit {
  isSaveData: boolean = true;
  childmessage: any;
  user: any;
  submitted: boolean = false;
  getbyid: any;
  packageUpdate = {
    id: '',
    medexpertisename: '',
    updatedby: '',
    statusFlag: '',
  };
  item: any;
  data: any;
  statusFlag: any;

  constructor(
    private route: Router,
    public headerService: HeaderService,
    private empanelmentmasterservice: EmpanelmentmasterserviceService,private sessionService: SessionStorageService
  ) {
    this.item = this.route.getCurrentNavigation().extras.state;
  }
  packageMaster = new FormGroup({
    medexpertisename: new FormControl(''),
    statusFlag: new FormControl(''),
  });
  ngOnInit(): void {
    this.headerService.setTitle('Medical Expertise');
    this.user = this.sessionService.decryptSessionData("user");
    console.log(this.item);
    if (this.item) {
      this.empanelmentmasterservice.getbyid(this.item.item).subscribe(
        (result: any) => {
          console.log(result);
          this.getbyid = result;
          this.packageUpdate.id = this.getbyid.id;
          this.packageUpdate.medexpertisename = this.getbyid.medexpertisename;
          this.packageUpdate.statusFlag = this.getbyid.statusFlag;
          this.statusFlag = this.getbyid.statusFlag;
          this.isSaveData = false;
        },
        (err: any) => {}
      );
    }
  }

  keyfunction1(e) {
    if (e.value[0] == ' ') {
      $('#expname').val('');
    }
  }
  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }
  saveData() {
    this.packageMaster.value.medexpertisename = $('#expname').val();
    var medexpertisename = $('#expname').val().toString();

    if (
      medexpertisename == null ||
      medexpertisename == '' ||
      medexpertisename == undefined
    ) {
      $('#expname').focus();
      this.swal('Info', 'Please Enter Medical Expertise Name', 'info');
      return;
    }
    this.packageMaster.value.createdby = this.user.userId;
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to Save this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Save it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.empanelmentmasterservice
          .savemedexp(this.packageMaster.value)
          .subscribe((response: any) => {
            this.data = response;
            if (this.data.status == 'Success') {
              this.swal('Success', this.data.message, 'success');
              this.route.navigate(['/application/medicalexpertiseview']);
            } else if (this.data.status == 'Failed') {
              this.swal('Error', this.data.message, 'error');
            } else {
              this.swal('Error', 'Something went wrong', 'error');
            }
          });
      }
    });
  }
  resetData() {}
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  yes($event: any) {
    this.statusFlag = 0;
  }
  no($event: any) {
    this.statusFlag = 1;
  }
  update() {
    var medexpertisename = $('#expname').val().toString();
    if (
      medexpertisename == null ||
      medexpertisename == '' ||
      medexpertisename == undefined
    ) {
      $('#expname').focus();
      this.swal('Info', 'Please Enter medexpertisename', 'info');
      return;
    }
    this.packageUpdate.updatedby = this.user.userId;
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to Update this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Update it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.packageUpdate.medexpertisename = $('#expname').val().toString();
        this.packageUpdate.statusFlag = this.statusFlag;
        this.empanelmentmasterservice
          .updatemedexp(this.packageUpdate)
          .subscribe((response: any) => {
            this.data = response;
            if (this.data.status == 'Success') {
              this.swal('Success', this.data.message, 'success');
              this.route.navigate(['/application/medicalexpertiseview']);
            } else if (this.data.status == 'Failed') {
              this.swal('Success', this.data.message, 'error');
            } else {
              this.swal('Info', 'Something went wrong', 'error');
            }
          });
      }
    });
  }
}
