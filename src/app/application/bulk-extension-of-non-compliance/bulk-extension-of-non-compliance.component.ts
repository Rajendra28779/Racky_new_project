import { Component, OnInit } from '@angular/core';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import { HeaderService } from '../header.service';
import { PendingService } from '../pending.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-bulk-extension-of-non-compliance',
  templateUrl: './bulk-extension-of-non-compliance.component.html',
  styleUrls: ['./bulk-extension-of-non-compliance.component.scss']
})
export class BulkExtensionOfNonComplianceComponent implements OnInit {


  stateList: any;
  districtList: any
  hospitalList: any
  selectedItems: any = [];
  data1: any
  days: number;
  actionId: any = '';
  months: string;
  year: number;
  responseData: any;
  showPegi: boolean = false;
  record: any;
  snoclaimlist: any = [];
  totalClaimCount: any;
  claimBy: string;
  userId: any;
  user: any;

  constructor(private snoService: SnocreateserviceService, public headerService: HeaderService, private pendingService: PendingService, public route: Router,
    private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    $('#data1').hide();
    this.user = this.sessionService.decryptSessionData("user");
    this.headerService.setTitle('Bulk Extension Of NonCompliance');
    $('.selectpicker').selectpicker();

    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      // maxDate: new Date(),
      daysOfWeekDisabled: ['', 7],
    });
    $('.timepicker').datetimepicker({
      format: 'LT',
      daysOfWeekDisabled: ['', 7],
    });
    $('.datetimepicker').datetimepicker({
      format: 'DD-MMM-YYYY LT',
      daysOfWeekDisabled: ['', 7],
    });
    var date = new Date();
    let year = date.getFullYear();
    let date1 = '01';
    let date2 = date.getDate();
    let month: any = date.getMonth() - 1;
    if (month == -1) {
      this.months = 'Dec';
      this.year = year - 1;
    } else {
      this.months = this.getMonthFrom(month);
      this.year = year;
    }
    var frstDay = date1 + '-' + this.months + '-' + this.year;
    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr("placeholder", "From Date *");
    this.getStateList();
    this.getSNOList();
  }
  getMonthFrom(month) {
    if (month == 0) {
      month = 'Jan';
    } else if (month == 1) {
      month = 'Feb';
    } else if (month == 2) {
      month = 'Mar';
    } else if (month == 3) {
      month = 'Apr';
    } else if (month == 4) {
      month = 'May';
    } else if (month == 5) {
      month = 'Jun';
    } else if (month == 6) {
      month = 'Jul';
    } else if (month == 7) {
      month = 'Aug';
    } else if (month == 8) {
      month = 'Sep';
    } else if (month == 9) {
      month = 'Oct';
    } else if (month == 10) {
      month = 'Nov';
    } else if (month == 11) {
      month = 'Dec';
    }
    return month;
  }
  getStateList() {
    this.snoService.getStateList().subscribe(
      (response) => {
        this.stateList = response;
      },
      (error) => console.log(error)
    )
  }
  OnChangeState(id) {
    $("#districtId").val("");
    this.selectedItems = [];
    localStorage.setItem("stateCode", id);
    this.snoService.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = response;
      },
      (error) => console.log(error)
    )
  }
  OnChangeDistrict(id) {
    this.selectedItems = [];
    var stateCode = localStorage.getItem("stateCode");
    this.snoService.getHospitalbyDistrictId(id, stateCode).subscribe(
      (response) => {
        this.hospitalList = response;
      },
      (error) => console.log(error)
    )
  }
  formdate: any;
  toDate: any;
  public snoList: any = [];
  keyword: any = 'fullName';
  snoUserId: any = '';
  snoName: any;

  getSNOList() {

    this.snoService.getSNODetails().subscribe(
      (response) => {
        this.snoList = response;
      },
      (error) => console.log(error)
    )
  }
  clearEvent() {
    this.snoUserId = '';
    this.snoName = '';
  }
  selectEvent(item) {
    this.snoUserId = item.userId;
    this.snoName = item.fullName;
  }
  typedata: any = '';
  reqdata: any = '';
  Search() {
    this.formdate = $('#datepicker1').val();
    this.toDate = $('#datepicker2').val();
    let state = $('#stateId').val();
    let dist = $('#districtId').val();
    let hospital = $('#hospital').val();
    const fromDate1 = this.GetDate(this.formdate);
    const todate1 = this.GetDate(this.toDate);
    let diffTime = Math.abs(todate1.getTime() - fromDate1.getTime());
    this.days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (Date.parse(this.formdate) > Date.parse(this.toDate)) {
      this.swal('', ' From Date should be less than To Date', 'info');
      return;
    }
    if (Date.parse(this.formdate) > Date.parse(this.toDate)) {
      this.swal('', ' From Date should be less than To Date', 'info');
      return;
    }
    if (this.days > 60) {
      this.swal('', ' Maximum 60 days Allow', 'info');
      return;
    }
    if (this.actionId == '' || this.actionId == null) {
      this.swal('', ' Please Select Extension Type', 'info');
      return;
    }
    this.reqdata = {
      "fromDate": this.formdate,
      "toDate": this.toDate,
      "stateCode": state,
      "districtCode": dist,
      "hospitalCode": hospital,
      "actionId": this.actionId,
      "snoid": this.snoUserId
    }
    this.pendingService.getBulkNonComplianceExtension(this.reqdata).subscribe(
      (response: any) => {
        this.responseData = response;
        if (this.responseData.status == 'success') {
          this.snoclaimlist = this.responseData.data;
          this.totalClaimCount = this.snoclaimlist.length;
          this.record = this.snoclaimlist.length;
          if (this.snoclaimlist[0].count > 0) {
            this.showPegi = true;
            this.typedata = this.actionId;
            $('#data1').show();
          } else {
            $('#data1').hide();
            this.swal('info', 'No Record Found', 'info');
            this.showPegi = false;
          }
        } else {
          this.swal('', 'Something went wrong.', 'error');
        }
      },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      }
    );

  }
  GetDate(str) {
    var arr = str.split("-");
    var months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

    var month = months.indexOf(arr[1].toLowerCase());

    return new Date(parseInt(arr[2]), month, parseInt(arr[0]));
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  swal1(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    }).then((result) => {
      if (result.value) {
        this.Search();
      }
    });
  }

  ResetField() {
    window.location.reload();
  }
  convertDateFormat() {
    var date = new Date();
    let year = date.getFullYear();
    let date2 = date.getDate();
    let month: any = date.getMonth();
    var frstDay = date2 + '-' + this.getMonthFrom(month) + '-' + year;
    return frstDay;

  }

  submitDetails() {
    this.userId = this.user.userId;
    this.claimBy = $('#datepicker3').val();
    let fromDate1 = Date.parse(this.claimBy);
    //get yesterday date in milliseconds
    let yesterday = Date.parse(new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleString());
    let fromDate = this.reqdata.fromDate;
    let toDate = this.reqdata.toDate;
    let state = this.reqdata.stateCode;
    let dist = this.reqdata.districtCode;
    let hospital = this.reqdata.hospitalCode;
    let actionId = this.reqdata.actionId;
    let snoid = this.reqdata.snoid;
    let statusflag = 0;
    if (fromDate1 < yesterday) {
      this.swal('', 'Extend Date should be greater than or Equal to Today', 'info');
      return;
    }
    let data = {
      "claimBy": this.claimBy,
      "actionId": actionId,
      "createdBy": this.userId,
      "fromDate": fromDate,
      "toDate": toDate,
      "stateCode": state,
      "districtCode": dist,
      "hospitalCode": hospital,
      "snoid": snoid,
      "statusflag": statusflag,
    }
    Swal.fire({
      title: '',
      text: 'Are you sure To Extend?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        this.pendingService.submitBulkNonComplianceExtension(data).subscribe(
          (response: any) => {
            this.responseData = response;
            if (this.responseData.status == 'Success') {
              this.swal1('success', 'Date Extended Successfully', 'success');
            } else {
              this.swal('', 'Something went wrong.', 'error');
            }
          },
          (error) => {
            console.log(error);
            this.swal('', 'Something went wrong.', 'error');
          }
        );
      }
    });
  }
}
