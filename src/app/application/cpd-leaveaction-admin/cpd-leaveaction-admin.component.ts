import { Component, OnInit } from '@angular/core';
import { CpdLeaveAdminServiceService } from '../Services/cpd-leave-admin-service.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { data } from 'jquery';
import { Router } from '@angular/router';
import { HeaderService } from '../header.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;


@Component({
  selector: 'app-cpd-leaveaction-admin',
  templateUrl: './cpd-leaveaction-admin.component.html',
  styleUrls: ['./cpd-leaveaction-admin.component.scss']
})
export class CpdLeaveactionAdminComponent implements OnInit {
  maxChars = 200;
  public cpdList: any = [];
  formdate: any;
  todate: any;
  totaldays: number | string;
  date: any;
  bskyUserId: any;
  object: string;
  user: any;
  keyword: any = 'fullName';
  remarks: string;
  fullName: any;

  constructor(private cpdLeaveAdminServiceService: CpdLeaveAdminServiceService, private route: Router,private headerService: HeaderService,private sessionService: SessionStorageService,) { }
  LeaveType = new FormGroup({
    bskyUserId: new FormControl(''),
    fullName:new FormControl(''),
    formdate: new FormControl(''),
    todate: new FormControl(''),
    remarks: new FormControl(''),
    totaldays: new FormControl('')
  })
  ngOnInit(): void {
    this.headerService.setTitle("CPD  Leave Apply");
    // this.user = JSON.parse(sessionStorage.getItem("user"))
    this.user = this.sessionService.decryptSessionData("user");
    let date=new Date();
    var today = new Date(date.getFullYear(), date.getMonth(), date.getDate()+1);      // alert(date);
    $('.selectpicker').selectpicker();

    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      // endDate: '0d',
       minDate: today,
      daysOfWeekDisabled: ['', 7],
    });
    $('.timepicker').datetimepicker({
      format: 'LT',
      daysOfWeekDisabled: ['', 7],
    });
    $('.datetimepicker').datetimepicker({
      format: 'YYYY-MM-DD LT',
      daysOfWeekDisabled: ['', 7],
    });
    this.getCpdName();
  }

  keyPress(event: KeyboardEvent) {
    const pattern = /^[A-Za-z0-9.,-_ \\s]+$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  getCpdName() {
    let nameHos = $('#bskyUserId').val();
    this.cpdLeaveAdminServiceService.getCpdNameList().subscribe(
      (response) => {
        this.cpdList = response;
        for(var i=0;i<this.cpdList.length;i++){
          var h=this.cpdList[i];
          h.fullName=h.fullName+ '('+h.userName+')';
        }

      },
      (error) => console.log(error)
    )
  }
  Reset() {
    window.location.reload();
  }

  OnChangedate(){
    this.todate = $('#todate').val().toString();
    if (this.todate == null || this.todate == "" || this.todate == undefined) {
      // this.swal('', ' Please Fill To Date', 'error');
      return;
    }else{
      this.OnChangeDate();
    }
  }
  OnChangeDate() {
    this.formdate = $('#formdate').val().toString();
    this.todate = $('#todate').val().toString();
    if (this.todate == null || this.todate == "" || this.todate == undefined) {
      this.swal('', ' Please Fill To Date', 'error');
      return;
    }
    this.formdate = new Date(this.formdate);
    this.todate = new Date(this.todate);
    this.formdate = this.formdate.getTime();
    this.todate = this.todate.getTime();
    let singleDay = 1000 * 60 * 60 * 24;
    this.totaldays = (this.todate - this.formdate) / singleDay + 1;
    if (this.formdate > this.todate) {
      this.swal('', ' From Date should be less To Date', 'error');
      return;
    }
    // if (this.totaldays > 7) {
    //   this.swal('', 'You can Apply maximum 7 days', 'error');
    //   return;
    // }
    if (this.totaldays > 365) {
      this.swal('', 'You can Apply maximum 365 days', 'error');
      return;
    }
  }

  applyLeave() {
    var bskyUserId = this.bskyUserId;
    var formdate = $('#formdate').val().toString();
    var todate = $('#todate').val().toString();
    var remarks = $('#remarks').val().toString();
    this.formdate = new Date(formdate);
    this.todate = new Date(todate);
    this.formdate = this.formdate.getTime();
    this.todate = this.todate.getTime();
    let singleDay = 1000 * 60 * 60 * 24;
    this.totaldays = (this.todate - this.formdate) / singleDay + 1;
    if (bskyUserId == null || bskyUserId == "" || bskyUserId == undefined) {
      this.totaldays = ""
      $("#bskyUserId").focus();
      this.swal("Info", "Please select CPD ", 'info');
      return;
    }
    if (todate == null || todate == "" || todate == undefined) {
      this.totaldays = ""
      this.swal('', ' Please Fill To Date', 'error');
      return;
    }
    if (Date.parse(formdate) > Date.parse(todate)) {
      this.swal('', ' From Date should be less To Date', 'error');
      return;
    }
    // if (this.totaldays > 7) {
    //   this.swal('', 'You can Apply maximum 7 days', 'error');
    //   return;
    // }
    if (this.totaldays > 365) {
      this.swal('', 'You can Apply maximum 365 days', 'error');
      return;
    }
    if (remarks == null || remarks == "" || remarks == undefined) {
      this.swal("Info", "Please Enter Description", 'info');
      return;
    }
    Swal.fire({
      title: 'Are you sure want to apply?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, apply it!'
    }).then((result) => {
      let object = {
        bskyUserId: bskyUserId,
        formdate: formdate,
        todate: todate,
        remarks: remarks,
        createdby: this.user.userId,
      }
      this.cpdLeaveAdminServiceService.saveLeaveData(object).subscribe(
        (result: any) => {
          if (result == 1) {
            Swal.fire("", "Applied Successfull !!", "success");
            this.LeaveType.reset();
            this.route.navigate(['application/cpdleavehistoryadmin']);
            this.date = new Date();
          } else if (result == 0){
            Swal.fire("Error", "Some Error Happen !!", "error")
          } else if (result == 2){
            Swal.fire("", "You are already applied for this date!!", "error")
          }
        },
        (err: any) => {
          console.log(err);
          this.swal("Error", "Something went wrong", 'error');
        }
      )

    })
  }
  selectEvent(item) {
    this.bskyUserId = item.bskyUserId;
    this.fullName = item.fullName;
  }
  onReset1() {
    this.bskyUserId = "";
    this.formdate = "";
    this.todate = "";
    this.remarks = "";
    this.date = "";
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  

}
