import { Component, OnInit } from '@angular/core';
import { UsermanualService } from '../Services/usermanual.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HeaderService } from '../header.service';
import Swal from 'sweetalert2';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-usermanualuploadsection',
  templateUrl: './usermanualuploadsection.component.html',
  styleUrls: ['./usermanualuploadsection.component.scss']
})
export class UsermanualuploadsectionComponent implements OnInit {
  grouptydata: any = [];
  maxChars = 1000;
  user: any;
  data: any;
  description: any = "";
  descriptiondata: any = "";
  grouptypenamedata: any = "";
  primarylinkidnamedata: any = "";
  user_manual_id: any;
  type: any;
  hidestatusupdate: boolean;
  hidestatusadd: boolean;
  constructor(private usermanualService: UsermanualService, public router: Router, private sessionService: SessionStorageService, private headerService: HeaderService,) { this.data = this.router.getCurrentNavigation().extras.state; }
  ngOnInit(): void {
    this.headerService.setTitle('User Manual Upload Section');
    this.user = this.sessionService.decryptSessionData("user");
    this.getgrouptyes();
    if (this.data != null) {
      this.grouptypenamedata = this.data.user_type_id
      this.primarylinkidnamedata = this.data.primary_link_id
      this.description = this.data.remarks;
      this.user_manual_id = this.data.user_manual_id;
      this.grouptypename = this.data.user_type_name;
      this.primarylinname = this.data.primary_link_name;
      this.type = this.data.type;
      this.getprimarylink(this.grouptypenamedata);
      this.hidestatusupdate = true;
    } else {
      this.hidestatusadd = true;
    }
  }
  getgrouptyes() {
    this.usermanualService.getgrouptyes().subscribe((data: any) => {
      this.grouptydata = data;
    })
  }
  grouptype: any;
  primarylinkname: any = [];
  grouptypename: any
  getprimarylink(event: any) {
    this.grouptypenamedata = event;
    this.usermanualService.getprimarylink(event).subscribe((data: any) => {
      this.primarylinkname = data;
    })
    for (let i = 0; i < this.grouptydata.length; i++) {
      if (this.grouptydata[i].typrid == event) {
        this.grouptypename = this.grouptydata[i].grouptypename;
      }
    }
  }
  primarylinkid: any
  primarylinname: any
  getPrimarylinkid(event: any) {
    for (let i = 0; i < this.primarylinkname.length; i++) {
      if (this.primarylinkname[i].primaryLinkId == event) {
        this.primarylinkidnamedata = this.primarylinkname[i].primaryLinkId;
        this.primarylinname = this.primarylinkname[i].primaryLinkName;
      }
    }
  }
  keyPress(event: KeyboardEvent) {
    const pattern = /'/;
    const inputChar = String.fromCharCode(event.charCode);
    if (pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  lengthforfilevalue: any;
  traetmentvalue: string = '';
  TreatmentDetailsSlipfilename: any
  TreatmentDetails: any;
  selectedFile: any;
  TreatmentDetailsSlip(files: any) {
    this.TreatmentDetails = files.target.files;
    $("#tratemnet").css("border-color", "green");
    for (var i = 0; i < this.TreatmentDetails.length; i++) {
      var filename = files.target.files[0];
      var extension = filename.name.split('.').pop();
      this.TreatmentDetailsSlipfilename = filename.name.split('.').shift();
    }
    var allowedExtensions = /(\jpg|\jpeg|pdf)$/i;
    if (!allowedExtensions.exec(extension)) {
      this.swal('Warning', 'Only JPG/JPEG/PDF Are Allowed!', 'warning');
      $("#tratemnet").css("border-color", "red");
      $('#Treatment').val('');
      this.traetmentvalue = "Select a file to upload";
      this.selectedFile = null;
      return;
    } else
      this.selectedFile = files.target.files[0];
    $("#tratemnet").css("border-color", "green");
    this.lengthforfilevalue = files.target.files.length;
    this.traetmentvalue = this.selectedFile.name;
    if (Math.round(this.selectedFile.size / 1024) >= 8192) {
      this.swal('Warning', 'Please provide User Manual Document  with Limited Size', 'warning');
      $("#tratemnet").css("border-color", "red");
      $('#Treatment').val('');
      this.traetmentvalue = "Select a file to upload";
      this.selectedFile = undefined;
    }
  }
  documentType: any;
  downloadfiletreatmentbill() {
    if (this.selectedFile) {
      const file: File | null = this.selectedFile;
      if (file) {
        this.documentType = file.type;
        const blob = new Blob([file], { type: this.documentType });
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      }
    } else {
      this.swal('', 'please select file', 'warning');
    }
  }
  actionflag: any;
  msg: any;
  getsubmit() {
    this.grouptypenamedata = this.grouptypenamedata;
    this.primarylinkidnamedata = this.primarylinkidnamedata;
    this.selectedFile = this.selectedFile;
    this.descriptiondata = $('#remarks').val();
    if (this.grouptypenamedata == undefined || this.grouptypenamedata == null || this.grouptypenamedata == "") {
      this.swal('Warning', 'Please Select User Type', 'warning');
      return;
    } if (this.primarylinkidnamedata == undefined || this.primarylinkidnamedata == null || this.primarylinkidnamedata == "") {
      this.swal('Warning', 'Please Select Bucket Name', 'warning');
      return;
    } if (this.selectedFile == undefined || this.selectedFile == null || this.selectedFile == "") {
      this.swal('Warning', 'Please Upload User Manual Document', 'warning');
      return;
    } if (this.description == undefined || this.description == null || this.description == "") {
      this.swal('Warning', 'Please Enter Description', 'warning');
      return;
    }
    if (this.type != null && this.type != undefined && this.type != '') {
      this.actionflag = 2;
      this.user_manual_id = this.user_manual_id
      this.msg = 'Are You Sure Want To Update?'
    } else {
      this.actionflag = 1;
      this.user_manual_id = '';
      this.msg = 'Are You Sure Want To Submit?'
    }
    Swal.fire({
      title: this.msg,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append('description', this.description)
        formData.append('selectedFile', this.selectedFile)
        formData.append('primarylinkid', this.primarylinkidnamedata)
        formData.append('primarylinname', this.primarylinname)
        formData.append('grouptype', this.grouptypenamedata)
        formData.append('grouptypename', this.grouptypename)
        formData.append('userid', this.user.userId)
        formData.append('actionflag', this.actionflag)
        formData.append('user_manual_id', this.user_manual_id)
        this.usermanualService.getsubmit(formData).subscribe((data: any) => {
          if (data.status == "Success") {
            Swal.fire({
              title: data.message,
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'ok',
              allowOutsideClick: false
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.reload();
              } else {
                window.location.reload();
              }
            }
            )
          }
          else if (data.status == "Failed") {
            this.swal('Error', data.message, 'error');
          }
        }
        )
      }
    }
    )
  }

  reset() {
    window.location.reload();
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
}
