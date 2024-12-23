import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderService } from '../header.service';
import { FpOverridecodeService } from '../Services/fp-overridecode.service';
import Swal from 'sweetalert2';
import { SnoCLaimDetailsService } from '../Services/sno-claim-details.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ReferalService } from '../Services/referal.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-fp-override-code',
  templateUrl: './fp-override-code.component.html',
  styleUrls: ['./fp-override-code.component.scss']
})
export class FpOverrideCodeComponent implements OnInit {
  user: any;
  fpOverrideList: any = [];
  maxChars = 500;
  txtsearchDate: any;
  months: any;
  year: number;
  showRemarks: boolean;
  remarks: any;
  stateData: any = [];
  statelist: Array<any> = [];
  stateCode: any;
  userId: any;
  distList: any;
  distCode: any;
  hospitalList: any;
  checked: boolean;
  approveForm: FormGroup
  selected: any[];
  currentPage: any;
  showPegi: boolean;
  record: any;
  pageElement: any;
  patientList: any = [];

  constructor(public headerService: HeaderService,
    public snoService: SnoCLaimDetailsService,
    private fpOverridecodeService: FpOverridecodeService,
    private referalService: ReferalService,
    public fb: FormBuilder,
    public route: Router,
    private sessionService: SessionStorageService
    ) { }

  ngOnInit(): void {
    this.headerService.setTitle('FP Override Code');
    this.user = this.sessionService.decryptSessionData("user");
    this.currentPage = 1;
    this.pageElement = 10;
    this.approveForm = this.fb.group({
      overrideCode: new FormControl(''),
      userId: new FormControl(''),
      remarks: new FormControl(''),
      action: new FormControl('')
    })
    $('.selectpicker').selectpicker();
    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      maxDate: new Date(),
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
    let month: any = date.getMonth();
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
    $('input[name="toDate"]').attr("placeholder", "To Date *");
    this.overrideRequestData();
    this.gethospitallist();
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
  getDate(date) {
    let year = date.getFullYear();
    let date1 = date.getDate();
    let months = date.getMonth();
    let month = this.getMonthFrom(months);
    var frstDay = date1 + '-' + month + '-' + year;
    return frstDay;
  }
  resetField() {
    window.location.reload();
  }

  overrideRequestData() {
    let userId = this.user.userId;
    let fromDate = $('#date1').val();
    let toDate = $('#date2').val();
    let action = 'A';
    let aprvStatus = '';
    let hospitalCode = $('#hospitalCode').val();
    if (Date.parse(fromDate) > Date.parse(toDate)) {
      this.swal('', ' From Date should be less To Date', 'error');
      return;
    }
    this.fpOverridecodeService.getOverrideCode(userId, fromDate, toDate, action, aprvStatus, hospitalCode).subscribe((data: any) => {
      this.fpOverrideList = data
      this.record = this.fpOverrideList.length;
      if (this.record > 0) {
        this.showPegi = true;
      }
      else {
        this.showPegi = false
      }
    })
  }
  Submit(event: any) {
    this.selected = [];
    var lnk = this.fpOverrideList;
    var t = lnk.filter((opt: any) => opt.status).map((opt: any) => opt);
    for (var j = 0; j < t.length; j++) {
      this.selected.push(t[j]);
    }
    if (this.selected == null || this.selected.length == 0 || this.selected == undefined) {
      this.swal("Error", "Please Select at-least one checkbox", 'error');
      return;
    }
    if (event == 2) {
      if (this.approveForm.value.remarks == null || this.approveForm.value.remarks == undefined || this.approveForm.value.remarks == '') {
        this.swal("Error", "Remark should be mandatory", 'error');
        return;
      }
      Swal.fire({
        title: 'Are you sure to reject?',
        text: '',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes!!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.approveForm.value.overrideCode = this.selected;
          this.approveForm.value.userId = this.user.userId;
          this.approveForm.value.action = event
          this.fpOverridecodeService.approveOverrideCode(this.approveForm.value).subscribe((data: any) => {
            if (data.status == "Success") {
              this.swal("Success", data.message, "success");
              this.route.navigate(['/application/viewoverride']);
            }
            else if (data.status == "Failed") {
              this.swal("Error", data.message, "error");
            }
          })
        }
      })
    }
    if (event == 1) {
      Swal.fire({
        title: 'Are you sure to approve?',
        text: '',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes!!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.approveForm.value.overrideCode = this.selected;
          this.approveForm.value.userId = this.user.userId;
          this.approveForm.value.action = event
          this.fpOverridecodeService.approveOverrideCode(this.approveForm.value).subscribe((data: any) => {
            if (data.status == "Success") {
              this.swal("Success", data.message, "success");
              this.route.navigate(['/application/viewoverride']);
            }
            else if (data.status == "Failed") {
              this.swal("Error", data.message, "error");
            }
          })
        }
      })
    }
  }

  view(urn, memberId, requestedDate, generatedThrough, hospitalCode) {
    this.fpOverridecodeService.getPatientDetails(urn, memberId, requestedDate, generatedThrough, hospitalCode).subscribe((item: any) => {
      this.patientList = item;
    })
  }
  download(pdfName, hCode, dateOfAdm) {
    let img = this.fpOverridecodeService.downloadFileByDC(pdfName, hCode, dateOfAdm);
    window.open(img, '_blank');
  }
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  gethospitallist() {
    this.referalService.gethospitallist(this.user.userId).subscribe((data: any) => {
      this.hospitalList = data;
    })
  }

}
