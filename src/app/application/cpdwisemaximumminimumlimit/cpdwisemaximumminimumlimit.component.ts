import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HeaderService } from '../header.service';
import { Router } from '@angular/router';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import Swal from 'sweetalert2';
import { CpdwisemaximumminimumlimitService } from '../Services/cpdwisemaximumminimumlimit.service';
import { DatePipe } from '@angular/common';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;


@Component({
  selector: 'app-cpdwisemaximumminimumlimit',
  templateUrl: './cpdwisemaximumminimumlimit.component.html',
  styleUrls: ['./cpdwisemaximumminimumlimit.component.scss']
})
export class CpdwisemaximumminimumlimitComponent implements OnInit {
  cpduserid: any;
  user: any;
  public cpdList: any = [];
  isUpdateBtnInVisible: boolean;

  isEditBtn: boolean;
  submitted: boolean = false;
  sid: any;
  did: any;
  hospitalArray: any;
  selectedItems: any = [];
  cpdId: any;
  keyword: any = 'fullName';
  hospObj: any;
  hospList: any = [];
  ipAddress: any;
  maxlimit: any;
  minimumlimit: any
  @ViewChild('multiSelect') multiSelect;
  @ViewChild('auto') auto;
  constructor(public headerService: HeaderService, public route: Router,private sessionService: SessionStorageService,
    private snoService: SnocreateserviceService, private cpdwisemaximumminimumlimitService: CpdwisemaximumminimumlimitService) {
    this.cpduserid = this.route.getCurrentNavigation().extras.state;
  }
  ngOnInit(): void {
    this.headerService.setTitle('Cpd wise Maximum Limit Set');
    // this.user = JSON.parse(sessionStorage.getItem("user"))
    this.user = this.sessionService.decryptSessionData("user");
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
    this.isEditBtn = false;
    this.isUpdateBtnInVisible = true;
    this.getCPDList();
    if (this.cpduserid != null || this.cpduserid != undefined) {
      this.getupdatedata(this.cpduserid.cpduserid);
    }
  }
  getCPDList() {
    this.snoService.getCPDList().subscribe(
      (response) => {
        this.cpdList = response;
      },
      (error) => console.log(error)
    )
  }
  selectEvent(item) {
    this.cpdId = item.bskyUserId;
  }
  clearEvent() {
    this.cpdId = '';
  }
  userId: any;
  record: any
  Assigneduptodate: any
  cpdwiselimit() {
    this.userId = this.user.userId;
    this.maxlimit = $('#maximum').val();
    // this.minimumlimit = $('#minimum').val();
    this.Assigneduptodate = $('#todate').val();
    let cpdId = this.cpdId;
    if (this.cpdId == '' || this.cpdId == undefined || this.cpdId == null) {
      this.swal("Info", "Please Select CPD Doctor Name", "info");
      return;
    }
    if (this.maxlimit == '' || this.maxlimit == undefined || this.maxlimit == null) {
      this.swal("Info", "Please Enter the Maximum limit", "info");
      return;
    }
    if (this.Assigneduptodate == '' || this.Assigneduptodate == undefined || this.Assigneduptodate == null) {
      this.swal("Info", "Please Enter The Assigned Upto Date", "info");
      return;
    }
    if (this.maxlimit.startsWith('0')) {
      this.swal("Info", "Maximum Limit Should Not Start With Zero", "info");
      return;
    }
    Swal.fire({
      title: 'Are You Sure  Want To Submit?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cpdwisemaximumminimumlimitService.cpdwisemaximumminimumlimit(cpdId, this.maxlimit, this.minimumlimit, this.userId, this.Assigneduptodate).subscribe(
          (response) => {
            this.record = response;
            if (this.record.status == "success") {
              this.swal(this.record.status, this.record.message, "success");
              this.auto.clear();
              $('#maximum').val('');
              $('#todate').val('');
              this.cpdId = '';
            } else if (this.record.status == 'error') {
              this.swal(this.record.status, this.record.message, "error");
            }
          },
          (error) => {
            console.log(error);
            this.swal('', 'Something went wrong.', 'error');
          });
      }
    })
  }

  onReset() {
    this.auto.clear();
    $('#maximum').val('');
    $('#todate').val('');
    this.cpdId = '';
  }
  swal(title, text, icon) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  getdata: any = [];
  maxlimitdat: any;
  minimumlimitdata: any
  cpdname: any;
  cpdid: any;
  asigneduptodate: any;
  getupdatedata(cpduserid) {
    this.cpdwisemaximumminimumlimitService.updatethecpdwisemaximumminimumlimit(cpduserid).subscribe(
      (response) => {
        this.record = response;
        this.getdata = this.record.Data;
        this.maxlimitdat = this.record.Data[0];
        this.minimumlimitdata = this.record.Data[1];
        this.cpdname = this.record.Data[2];
        this.cpdid = this.record.Data[3];
        this.asigneduptodate = this.Dateconvert(this.record.Data[4]);
        this.isEditBtn = true;
        this.isUpdateBtnInVisible = false;
      }
    )
  }
  update: any
  updatedassignedupto: any
  updategCPDDetails() {
    this.maxlimit = $('#maximum').val();
    let cpdid = this.cpdid;
    let userid = this.user.userId;
    this.updatedassignedupto = $('#todate').val();
    if (this.maxlimit == '' || this.maxlimit == undefined || this.maxlimit == null) {
      this.swal("Info", "Please Enter the Maximum limit", "info");
      return;
    }
    if (this.updatedassignedupto == '' || this.updatedassignedupto == undefined || this.updatedassignedupto == null) {
      this.swal("Info", "Please Enter The Assigned Upto Date", "info");
      return;
    }
    if (this.maxlimit.startsWith('0')) {
      this.swal("Info", "Maximum limit should not start with zero", "info");
      return;
    }
    Swal.fire({
      title: 'Are You Sure  Want To Update?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cpdwisemaximumminimumlimitService.updatecpdwisemaximumminimumlimit(cpdid, this.maxlimit, userid, this.updatedassignedupto).subscribe(
          (response) => {
            this.update = response;
            if (this.update.status == "success") {
              this.swal(this.update.status, this.update.message, "success");
              this.route.navigate(['/application/viewcpdwisemaximumandminimumlimitset']);
            } else if (this.update.status == 'error') {
              this.swal(this.update.status, this.update.message, "error");
            }
          }
        )
      }
    })
  }
  cancel() {
    window.location.reload();
  }
  Dateconvert(date) {
    var datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'dd-MMM-yyyy');
  }
}
