import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { PrimarylinkserviceService } from '../../Services/primarylinkservice.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-primary-link',
  templateUrl: './primary-link.component.html',
  styleUrls: ['./primary-link.component.scss'],
})
export class PrimaryLinkComponent implements OnInit {
  showupdate: boolean;
  maxChars = 500;
  status: any;
  childmessage: any;
  primarylink!: FormGroup;
  functionlist: any;
  globalist: any;
  group = new FormGroup({
    primaryLinkName: new FormControl(''),
    globalLinkId: new FormControl(''),
    functionId: new FormControl(''),
    description: new FormControl(''),
    createdBy: new FormControl(''),
    updatedby: new FormControl(''),
    id: new FormControl(''),
    isActive: new FormControl(''),
    order: new FormControl(''),
  });
  user: any;
  dataa: any;
  user1: any;
  update: any;
  getbyid = {
    plname: '',
    description: '',
    globallinkid: '',
    functionid: '',
    isactive: '',
    order: '',
  };
  constructor(
    private route: Router,
    public headerService: HeaderService,
    private pmservice: PrimarylinkserviceService,
    private sessionService: SessionStorageService
  ) {
    this.user1 = this.route.getCurrentNavigation().extras.state;
  }

  ngOnInit(): void {
    this.headerService.setTitle('Primary-Link');
    this.user = this.sessionService.decryptSessionData('user');
    this.showupdate = false;
    this.fnlist();
    this.gllist();
    if (this.user1) {
      this.pmservice.getbyid(this.user1.user).subscribe((data) => {
        this.update = data;
        this.getbyid.plname = this.update.primaryLinkName;
        this.getbyid.description = this.update.description;
        this.getbyid.globallinkid = this.update.globalLink.globalLinkId;
        this.getbyid.functionid = this.update.functionMaster.functionId;
        this.getbyid.order = this.update.order;
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

  fnlist() {
    this.pmservice.getfnlist().subscribe((data) => {
      this.functionlist = data;
    });
  }
  gllist() {
    this.pmservice.getgllist().subscribe((data) => {
      this.globalist = data;
    });
  }

  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }
  reset() {
    this.route.navigate(['/application/viewpmlink']);
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }

  save() {
    var primary = $('#primaryname').val().toString();
    if (
      this.group.value.globalLinkId == null ||
      this.group.value.globalLinkId == '' ||
      this.group.value.globalLinkId == undefined
    ) {
      this.swal('Info', 'Please Fill Global Name', 'info');
      return;
    }
    if (
      this.group.value.functionId == null ||
      this.group.value.functionId == '' ||
      this.group.value.functionId == undefined
    ) {
      this.swal('Info', 'Please Fill Function Name', 'info');
      return;
    }
    this.group.value.primaryLinkName = primary;
    if (
      this.group.value.primaryLinkName == null ||
      this.group.value.primaryLinkName == '' ||
      this.group.value.primaryLinkName == undefined
    ) {
      this.swal('Info', 'Please Fill PrimaryLink Name', 'info');
      return;
    }
    if (
      this.group.value.description == null ||
      this.group.value.description == '' ||
      this.group.value.description == undefined
    ) {
      this.swal('Info', 'Please Fill Description', 'info');
      return;
    }
    var order = $('#order').val();
    if (order == null || order == '' || order == undefined) {
      this.swal('Info', 'Please Fill Order No', 'info');
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
        this.group.value.order = order;
        this.group.value.createdBy = this.user.userId;
        this.pmservice.save(this.group.value).subscribe((data) => {
          this.dataa = data;
          if (this.dataa.status == 'Success') {
            this.swal('Success', this.dataa.message, 'success');
            this.group.reset();
            this.route.navigate(['/application/viewpmlink']);
          } else if (this.dataa.status == 'Failed') {
            this.swal('Error', this.dataa.message, 'error');
          }
        });
      }
    });
  }

  updatepm() {
    if (
      this.group.value.globalLinkId == null ||
      this.group.value.globalLinkId == '' ||
      this.group.value.globalLinkId == undefined
    ) {
      this.swal('Info', 'Please Fill Global Name', 'info');
      return;
    }
    if (
      this.group.value.functionId == null ||
      this.group.value.functionId == '' ||
      this.group.value.functionId == undefined
    ) {
      this.swal('Info', 'Please Fill Function Name', 'info');
      return;
    }
    this.group.value.primaryLinkName = $('#primaryname').val().toString();
    if (
      this.group.value.primaryLinkName == null ||
      this.group.value.primaryLinkName == '' ||
      this.group.value.primaryLinkName == undefined
    ) {
      this.swal('Info', 'Please Fill PrimaryLink Name', 'info');
      return;
    }
    if (
      this.group.value.description == null ||
      this.group.value.description == '' ||
      this.group.value.description == undefined
    ) {
      this.swal('Info', 'Please Fill Description', 'info');
      return;
    }
    var order = $('#order').val();
    if (order == null || order == '' || order == undefined) {
      this.swal('Info', 'Please Fill Order No', 'info');
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
        this.group.value.updatedby = this.user.userId;
        this.group.value.id = this.update.primaryLinkId;
        this.group.value.isActive = this.status;
        this.group.value.order = order;
        this.pmservice.update(this.group.value).subscribe((data) => {
          this.dataa = data;
          if (this.dataa.status == 'Success') {
            this.swal('Success', this.dataa.message, 'success');
            this.group.reset();
            this.route.navigate(['/application/viewpmlink']);
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
