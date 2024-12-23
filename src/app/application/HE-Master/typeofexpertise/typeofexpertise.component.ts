import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { HeaderService } from '../header.service';
// import { EmpanelmentmasterserviceService } from '../Services/empanelmentmasterservice.service';
import { FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { EmpanelmentmasterserviceService } from '../../Services/empanelmentmasterservice.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-typeofexpertise',
  templateUrl: './typeofexpertise.component.html',
  styleUrls: ['./typeofexpertise.component.scss'],
})
export class TypeofexpertiseComponent implements OnInit {
  childmessage: any;
  user: any;
  form: FormGroup;
  isUpdateBtnInVisible: boolean;
  isEditBtn: boolean;
  minlengthforName = /^[a-zA-Z ]{4,}$/;
  updatelist: any;
  user1: any;
  isActive: any;
  update = {
    typeofexpertise: '',
    medicalexpid: 'Select',
    status: '',
  };
  expertiselist: any;
  constructor(
    private route: Router,
    public headerService: HeaderService,
    private empanelmentmasterservice: EmpanelmentmasterserviceService,
    private sessionService: SessionStorageService
  ) {
    this.user = this.route.getCurrentNavigation().extras.state;
  }
ngOnInit(): void {
    this.headerService.setTitle('Type Of Expertise');
    this.user1 = this.sessionService.decryptSessionData("user");
    this.headerService.isIndicate(false);
    this.headerService.isBack(true);
    this.isUpdateBtnInVisible = true;
    this.isEditBtn = false;
    if (this.user) {
      this.empanelmentmasterservice
        .getbyID(this.user.user)
        .subscribe((data) => {
          this.updatelist = data;
          console.log('inside ngonit');
          console.log(this.updatelist);
          this.update.typeofexpertise = this.updatelist.typeofexpertisename;

          this.update.medicalexpid = this.updatelist.medexpertiseid.id;
          this.update.status = this.updatelist.status;
          this.isActive = this.update.status;
          this.isUpdateBtnInVisible = false;
          this.isEditBtn = true;

          console.log(this.update);
        });
    }
    this.getMedicalExpname();
  }
  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }
  Typeofexpertise = new FormGroup({
    medicalexpid: new FormControl(''),
    typeofexpertise: new FormControl(''),
    createdby: new FormControl(''),
  });
  getMedicalExpname() {
    this.empanelmentmasterservice.getMedexpname().subscribe((data) => {
      this.expertiselist = data;
      console.log(this.expertiselist);
    });
  }
  keyfunction1(e) {
    if (e.value[0] == ' ') {
      $('#typeofexpertise').val('');
    }
  }
  saveexpertisetype() {
    if (
      this.Typeofexpertise.value.medicalexpid == 'Select' ||
      this.Typeofexpertise.value.medicalexpid == null
    ) {
      this.swal(
        'warning',
        'Please Fill the Medical Expertise  Name',
        'warning'
      );
    } else {
      let typeofexpertise = $('#typeofexpertise').val().toString();

      if (
        typeofexpertise == null ||
        typeofexpertise == '' ||
        typeofexpertise == undefined
      ) {
        this.swal('Info', 'Please Enter Expertise Type', 'info');
        return;
      }

      if (!typeofexpertise.match(this.minlengthforName)) {
        this.swal(
          'Info',
          'Type of Expertise Name must be more than 3 character',
          'info'
        );
        return;
      }
      Swal.fire({
        title: 'Are you sure?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Save it!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.user1 = this.user1;
          this.Typeofexpertise.value.createdby = this.user1.userId;
          this.Typeofexpertise.value.typeofexpertise = $('#typeofexpertise')
            .val()
            .toString();
          this.empanelmentmasterservice
            .saveexpertisetype(this.Typeofexpertise.value)
            .subscribe((data) => {
              if (data == 1) {
                this.swal('Success', 'Record Saved Successfully', 'success');
                this.route.navigate(['/application/typeofexpertiseview']);
              } else if (data == 0) {
                this.swal('Error', 'Some error happen', 'error');
              } else if (data == 2) {
                this.swal('warning', 'Already Exist', 'warning');
              } else if (data == 3) {
                this.swal(
                  'warning',
                  'Please Fill  Type Of Expertise',
                  'warning'
                );
              }
            });
        }
      });
    }
    window.location;
  }
  cancel() {
    this.route.navigate(['/application/typeofexpertiseview']);
  }

  yes($event: any) {
    this.isActive = 0;
  }

  no($event: any) {
    this.isActive = 1;
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  updategroup(items: any) {
    let typeofexpertise = $('#typeofexpertise').val().toString();
    if (!typeofexpertise.match(this.minlengthforName)) {
      this.swal(
        'Info',
        'Type Of Expertise Name must be more than 3 character',
        'info'
      );
      return;
    }
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Update it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.user1 = this.user1;
        this.updatelist.updateby = this.user1.userId;
        this.updatelist.typeofexpertise = $('#typeofexpertise')
          .val()
          .toString();
        this.updatelist.status = this.isActive;
       this.empanelmentmasterservice.updatetypeofexp(this.updatelist, items.medicalexpid).subscribe((data) => {
            if (data == 1) {
              this.swal('Success', 'Record Update Successful', 'success');
              this.route.navigate(['/application/typeofexpertiseview']);
            } else if (data == 0) {
              this.swal('Error', 'Some error happen', 'error');
            } else if (data == 2) {
              this.swal('warning', 'Already Exists', 'warning');
            } else if (data == 3) {
              this.swal(
                'warning',
                'Please Fill The Type Of Expertise Name',
                'warning'
              );
            }
          });
      }
    });
  }
}
