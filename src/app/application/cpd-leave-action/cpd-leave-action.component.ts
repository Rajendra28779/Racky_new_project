import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CpdleaveService } from '../Services/cpdleave.service';
import { data } from 'jquery';
import Swal from 'sweetalert2';
declare let $: any;
import { HeaderService } from '../header.service';
import { Router } from '@angular/router';
import { IfStmt } from '@angular/compiler';
import { CpdLeaveAdminServiceService } from '../Services/cpd-leave-admin-service.service';
import { MatNativeDateModule } from '@angular/material/core';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-cpd-leave-action',
  templateUrl: './cpd-leave-action.component.html',
  styleUrls: ['./cpd-leave-action.component.scss']
})
export class CpdLeaveActionComponent implements OnInit {

  @ViewChild('auto') auto;
  @ViewChild('autocopy') autocopy;
  addLeaveData = FormGroup;
  maxChars = 200;
  date: any
  formdate: any;
  todate: any;
  totaldays: number | string;

  public cpdList: any = [];
  user: any;
  username: any;
  childmessage: any;
  showDuration: boolean;
  leaveform: FormGroup;
  userId: any;
  constructor(private leaveService: CpdleaveService, public formBuilder: FormBuilder, private headerService: HeaderService, private route: Router,
    private cpdLeaveAdminServiceService: CpdLeaveAdminServiceService, private sessionService: SessionStorageService) { }
  form: FormGroup;
  LeaveType = new FormGroup({
    formdate: new FormControl(''),
    todate: new FormControl(''),
    remarks: new FormControl(''),
    totaldays: new FormControl('')
  })
  ngOnInit(): void {
    this.headerService.setTitle(" Leave Apply");
    // this.user = JSON.parse(sessionStorage.getItem("user"))
    this.user = this.sessionService.decryptSessionData("user");
    this.userId = this.user.userId
    //  this.username = this.user.userName;

    this.LeaveType = this.formBuilder.group({
      bskyUserId: new FormControl(''),
      cpdName: new FormControl(''),
      formdate: new FormControl(''),
      todate: new FormControl(''),
      remarks: new FormControl(''),
      totaldays: new FormControl('')
    })
    let date = new Date();
    var today = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
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
        if (this.user.groupId == 3) {
          let data = this.cpdList
          for (let i = 0; i <= this.cpdList.length; i++) {
            if (data[i].userid.userId == this.userId) {
              this.username = data[i].userid.userId;
              console.log(this.username);
              this.cpdList = [];
              this.cpdList.push(data[i]);
              // this.getCpdRecievedCountList();
              break;
            }
          }
          // this.SearchForm.controls['bskyUserId'].setValue(this.username);
        } else {
          this.userId = this.user.userId
        }
      
      },
      (error) => console.log(error)
    )

  }
  saveLeave() {
    var formdate = $('#formdate').val().toString();
    var todate = $('#todate').val().toString();
    var remarks = $('#remarks').val().toString();
    this.formdate = new Date(formdate);
    this.todate = new Date(todate);
    this.formdate = this.formdate.getTime();
    this.todate = this.todate.getTime();
    let singleDay = 1000 * 60 * 60 * 24;
    this.totaldays = (this.todate - this.formdate) / singleDay + 1;
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
      if (result.isConfirmed) {
        let object = {
          formdate: formdate,
          todate: todate,
          remarks: remarks,
          createdby: this.user.userId,
        }
        this.leaveService.saveLeaveData(object).subscribe(
          (result: any) => {
            console.log(result);
            if (result == 1) {
              Swal.fire("", "Applied Successfull !!", "success");
              this.LeaveType.reset();
              this.route.navigate(['application/cpdleavehistory']);
              this.date = new Date();
              console.log(this.LeaveType.value);
            } else if (result == 0) {
              Swal.fire("Error", "Some Error Happen !!", "error")
            } else if (result == 2) {
              Swal.fire("", "You are already applied for this date!!", "error")

            }
          },
          (err: any) => {
            console.log(err);
            this.swal("Error", "Something went wrong", 'error');
          }
        )
      }
    })
  }
  OnChangedate() {
    this.todate = $('#todate').val().toString();
    if (this.todate == null || this.todate == "" || this.todate == undefined) {
      // this.swal('', ' Please Fill To Date', 'error');
      return;
    } else {
      this.OnChangeDate();
    }
  }
  OnChangeDate() {
    this.showDuration = true;
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
    // this.showDuration=true;
    // console.log(this.todate+"to date comes===");
    // console.log(this.formdate+"from date comes====");
    let singleDay = 1000 * 60 * 60 * 24;
    this.totaldays = (this.todate - this.formdate) / singleDay + 1;
    // console.log(this.totaldays+"total days comes===");
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
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }
  myForm: any;
  onSubmit() {
    this.myForm.reset();
  }
  Reset() {
    window.location.reload();
  }
  LeaveReset() {
    $('#formdate').val("");
    $('#todate').val("");
    $('#remarks').val("");
  }
  getLink() {
    this.route.navigate(['/application/cpdleavehistory']);
  }
  getLink1() {
    this.route.navigate(['/application/cpdleaveapply']);
  }
  selectEvent(item) {
    // do something with selected item

  }

}
