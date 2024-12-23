import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { GloballinkserviceService } from '../../Services/globallinkservice.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-global-link',
  templateUrl: './global-link.component.html',
  styleUrls: ['./global-link.component.scss'],
})
export class GlobalLinkComponent implements OnInit {
  showupdate: boolean;
  maxChars = 100;
  childmessage: any;
  globallink!: FormGroup;
  user: any;
  user1: any;
  update: any;
  status: any;
  getbyid = {
    glName: '',
    description: '',
    isactive: '',
    order: '',
  };
  constructor(
    private route: Router,
    public headerService: HeaderService,
    private globallinkservice: GloballinkserviceService,
    private sessionService: SessionStorageService
  ) {
    this.user1 = this.route.getCurrentNavigation().extras.state;
  }

  ngOnInit(): void {
    this.headerService.setTitle('Global-Link');
    this.user = this.sessionService.decryptSessionData('user');
    // this.user =JSON.parse(sessionStorage.getItem("user"));
    this.showupdate = false;
    if (this.user1) {
      this.globallinkservice.getbyid(this.user1.user).subscribe((data) => {
        this.update = data;
        this.getbyid.glName = this.update.globalLinkName;
        this.getbyid.description = this.update.description;
        this.getbyid.isactive = this.update.bitStatus;
        this.getbyid.order = this.update.order;
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
    this.route.navigate(['/application/viewgllink']);
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  group = new FormGroup({
    globalname: new FormControl(''),
    functiondescription: new FormControl(''),
    order: new FormControl(''),
  });
  dataa: any;
  save() {
    var globalname = $('#globalname').val().toString();
    var description = $('#globaldescription').val().toString();
    var order = $('#order').val();
    if (globalname == null || globalname == '' || globalname == undefined) {
      this.swal('Info', 'Please Fill Global Name', 'info');
      return;
    }

    if (description == null || description == '' || description == undefined) {
      this.swal('Info', 'Please Fill Description', 'info');
      return;
    }
    if (order == null || order == '' || order == undefined) {
      this.swal('Info', 'Please Fill Order By', 'info');
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
          globalLinkName: globalname,
          createdBy: this.user.userId,
          description: description,
          order: order,
        };
        this.globallinkservice.save(object).subscribe((data) => {
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

  updategl() {
    var globalname = $('#globalname').val().toString();
    var description = $('#globaldescription').val().toString();
    var order = $('#order').val();
    if (globalname == null || globalname == '' || globalname == undefined) {
      this.swal('Info', 'Please Fill Global Name', 'info');
      return;
    }

    if (description == null || description == '' || description == undefined) {
      this.swal('Info', 'Please Fill Description', 'info');
      return;
    }
    if (order == null || order == '' || order == undefined) {
      this.swal('Info', 'Please Fill Order By', 'info');
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
        this.update.globalLinkName = globalname;
        this.update.description = description;
        this.update.order = order;
        this.update.updatedBy = this.user.userId;
        this.update.bitStatus = this.status;
        this.globallinkservice.update(this.update).subscribe((data) => {
          this.dataa = data;
          if (this.dataa.status == 'Success') {
            this.swal('Success', this.dataa.message, 'success');
            this.group.reset();
            this.route.navigate(['/application/viewgllink']);
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
