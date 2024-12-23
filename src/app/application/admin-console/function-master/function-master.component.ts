import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { HeaderService } from '../../header.service';
import { FormControl, FormGroup } from '@angular/forms';
import { FunctionmasterserviceService } from '../../Services/functionmasterservice.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-function-master',
  templateUrl: './function-master.component.html',
  styleUrls: ['./function-master.component.scss'],
})
export class FunctionMasterComponent implements OnInit {
  showupdate: boolean;
  maxChars = 100;
  childmessage: any;
  functionmaster!: FormGroup;
  user: any;
  user1: any;
  update: any;
  status: any;
  getbyid = {
    fileName: '',
    description: '',
    functionName: '',
    isactive: '',
  };
  dataa: any;
  constructor(
    private route: Router,
    public headerService: HeaderService,
    public fnmservice: FunctionmasterserviceService,
    private sessionService: SessionStorageService
  ) {
    this.user1 = this.route.getCurrentNavigation().extras.state;
  }

  ngOnInit(): void {
    this.headerService.setTitle('Function-Master');
    this.user = this.sessionService.decryptSessionData('user');
    // this.user =JSON.parse(sessionStorage.getItem("user"));
    this.showupdate = false;
    if (this.user1) {
      this.fnmservice.getbyid(this.user1.user).subscribe((data) => {
        this.update = data;
        this.getbyid.fileName = this.update.fileName;
        this.getbyid.functionName = this.update.functionName;
        this.getbyid.description = this.update.description;
        this.getbyid.isactive = this.update.bitStatus;
        this.status = this.update.bitStatus;
        this.showupdate = true;
      });
    }
  }
  yes($event: any) {
    this.status = 0;
  }

  no($event: any) {
    this.status = 1;
  }

  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }
  reset() {
    this.route.navigate(['/application/viewfnmaster']);
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  group = new FormGroup({
    functionname: new FormControl(''),
    functionurl: new FormControl(''),
    functiondescription: new FormControl(''),
  });
  save() {
    var fnname = $('#functionname').val().toString();
    var fnurl = $('#functionurl').val().toString().trim();
    var description = $('#functiondescription').val().toString();
    if (fnname == null || fnname == '' || fnname == undefined) {
      this.swal('Info', 'Please Fill Function Name', 'info');
      return;
    }
    if (fnurl == null || fnurl == '' || fnurl == undefined) {
      this.swal('Info', 'Please Fill Function URL', 'info');
      return;
    }
    if (description == null || description == '' || description == undefined) {
      this.swal('Info', 'Please Fill Description', 'info');
      return;
    }
    Swal.fire({
      title: 'Are you sure?',
      // text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Save it!',
    }).then((result) => {
      if (result.isConfirmed) {
        let object = {
          functionName: fnname,
          fileName: fnurl,
          createdBy: this.user.userId,
          description: description,
        };
        this.fnmservice.save(object).subscribe((data) => {
          this.dataa = data;
          if (this.dataa.status == 'Success') {
            this.swal('Success', this.dataa.message, 'success');
            this.group.reset();
          } else if (this.dataa.status == 'Failed') {
            this.swal('Error', this.dataa.message, 'error');
          }
        });
      }
    });
  }

  updatefn() {
    var fnname = $('#functionname').val().toString();
    var fnurl = $('#functionurl').val().toString().trim();
    var description = $('#functiondescription').val().toString();
    if (fnname == null || fnname == '' || fnname == undefined) {
      this.swal('Info', 'Please Fill Function Name', 'info');
      return;
    }
    if (fnurl == null || fnurl == '' || fnurl == undefined) {
      this.swal('Info', 'Please Fill Function URL', 'info');
      return;
    }
    if (description == null || description == '' || description == undefined) {
      this.swal('Info', 'Please Fill Description', 'info');
      return;
    }
    Swal.fire({
      title: 'Are you sure?',
      // text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Save it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.update.fileName = fnurl;
        this.update.functionName = fnname;
        this.update.description = description;
        this.update.updatedBy = this.user.userId;
        this.update.bitStatus = this.status;
        this.fnmservice.update(this.update).subscribe((data) => {
          this.dataa = data;
          if (this.dataa.status == 'Success') {
            this.swal('Success', this.dataa.message, 'success');
            this.group.reset();
            this.route.navigate(['/application/viewfnmaster']);
          } else if (this.dataa.status == 'Failed') {
            this.swal('Error', this.dataa.message, 'error');
          }
        });
      }
    });
  }
  keyPress(event: KeyboardEvent) {
    const pattern = /^[A-Za-z0-9.,-_ \\s]+$/;
    //var regex = new RegExp("^[A-Za-z0-9.,-\\s]+$");
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }
}
