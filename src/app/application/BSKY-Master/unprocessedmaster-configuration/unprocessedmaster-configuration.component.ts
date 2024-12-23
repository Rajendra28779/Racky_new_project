import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { UnprocessedConfigurationServiceService } from '../../Services/unprocessed-configuration-service.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from '../../header.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-unprocessedmaster-configuration',
  templateUrl: './unprocessedmaster-configuration.component.html',
  styleUrls: ['./unprocessedmaster-configuration.component.scss']
})

export class UnprocessedmasterConfigurationComponent implements OnInit {
  form!: FormGroup;
  item: any;
  getbyid: any;
  valid: any = 0;
  isSaveData: boolean = true;
  isUpdateData: boolean = false;
  submitted: boolean = false;
  childmessage: any;
  user1: any;
  status: any;
  stickyear: any;
  getAllYears: any[] = [];
  selectedYear: any;
  Months: any;
  M: any;
  object: string;
  getId: any;
  unprocessed: any;

  updateUnprocessed = {
    unprocessedId: "",
    years: "",
    months: "",
    unprocessDate: new Date(),
    statusFlag: 0,
    updatedBy: "",
    createdBy:"", 
  };

  years: any;
  data: any;
  statusFlag: number;
  createdBy: any;
  updatedOn: any;
  createdOn: any;

  constructor(public fb: FormBuilder, public unprocessedmasterservice: UnprocessedConfigurationServiceService, public headerService: HeaderService,
    private route: Router, private sessionService: SessionStorageService) {
    this.item = this.route.getCurrentNavigation().extras.state;
  }

  ngOnInit(): void {
    this.headerService.setTitle("Create Unprocess Configuration");
    this.headerService.isIndicate(false);
    this.headerService.isBack(true);
    let date = new Date();
    date.setDate(new Date().getDate() + 1)
    $('.selectpicker').selectpicker();
    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      minDate: date,
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
    $('#dates').val(date);
    this.user1 = this.sessionService.decryptSessionData("user");
    this.form = this.fb.group({
      unprocessedId: new FormControl(''),
      years: new FormControl(''),
      months: new FormControl(''),
      unprocessDate: new FormControl(''),
      statusFlag: new FormControl(''),
    });
    this.selectedYear = new Date().getFullYear();
    this.stickyear = this.selectedYear
    for (let year = this.selectedYear; year <= 2030; year++) {
      this.getAllYears.push(year);
    }
    let month: any = new Date().getMonth();
    if (month == 1) {
      this.Months = 'JAN';
    } else if (month == 2) {
      this.Months = 'FEB';
    } else if (month == 3) {
      this.Months = 'MAR';
    } else if (month == 4) {
      this.Months = 'APR';
    } else if (month == 5) {
      this.Months = 'MAY';
    } else if (month == 6) {
      this.Months = 'JUN';
    } else if (month == 7) {
      this.Months = 'JUL';
    } else if (month == 8) {
      this.Months = 'AUG';
    } else if (month == 9) {
      this.Months = 'SEP';
    } else if (month == 10) {
      this.Months = 'OCT';
    } else if (month == 11) {
      this.Months = 'NOV';
    } else if (month == 12) {
      this.Months = 'DEC';
    }
    if (this.item) {
      this.isSaveData = false;
      this.isUpdateData = true;
        this.unprocessedmasterservice.getById(this.item.unprocessedId).subscribe(
        (result: any) => {
          this.unprocessed = result;
          this.updateUnprocessed.years = this.unprocessed.years;
          this.updateUnprocessed.months = this.unprocessed.months;
          this.updateUnprocessed.unprocessDate = this.unprocessed.unprocessDate;
          this.updateUnprocessed.statusFlag = this.unprocessed.statusFlag;
          this.statusFlag = this.unprocessed.statusFlag;
          this.createdBy=this.unprocessed.createdBy;
          this.updatedOn=this.unprocessed.updatedOn;
          this.isSaveData = false;
          this.isUpdateData = true;
        }

      )
    }
  }

  save() {
    this.submitted = true;
    let years = $("#years").val().toString();
    let months = $("#months").val();
    let unprocessDate = $("#unprocessDate").val().toString();
    if (years == null || years == "" || years == undefined) {
      $("#years").focus();
      this.swal("Info", "Please Select Year", 'info');
      return;
    }
    if (months == null || months == "" || months == undefined) {
      $("#months").focus();
      this.swal("Info", "Please Select Month", 'info');
      return;
    }
    if (unprocessDate == null || unprocessDate == "" || unprocessDate == undefined) {
      $("#dates").focus();
      this.swal("Info", "Please Choose Date", 'info');
      return;
    }
    this.form.value.createdBy = this.user1.userId;
    Swal.fire({
      title: 'Are you sure want to save?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Save it!'
    }).then((result) => {
      if (result.isConfirmed) {
        let object = {
          years: years,
          months: months,
          unprocessDate: new Date(unprocessDate),
          // dates:dates,
          // statusFlag: statusFlag,
          createdBy: this.user1.userId.toString(),
        }
        this.unprocessedmasterservice.saveUnprocessData(object).subscribe(
          (result: any) => {
            this.data = result;
            if (this.data.status == "Success") {
              Swal.fire("Success", "Unprocess Saved Successfully!!", "success")
              this.route.navigate(['application/viewunprocess']);
              this.submitted = false;
            } else if (this.data.status == "Failed") {
              this.swal('Success', this.data.message, 'error')
            } else {
              this.swal("Error", "Something went wrong", 'error');
            }
          },
          (err: any) => {
            console.log(err);
          }
        )
      }
    });
  }

  update(itemds: any) {
    let years = $("#years").val().toString();
    let months = $("#months").val();
    let unprocessDate = $("#unprocessDate").val().toString();
    if (years == null || years == "" || years == undefined) {
      $("#years").focus();
      this.swal("Info", "Please Select Year", 'info');
      return;
    }
    if (months == null || months == "" || months == undefined) {
      $("#months").focus();
      this.swal("Info", "Please Select Month", 'info');
      return;
    }
    if (unprocessDate == null || unprocessDate == "" || unprocessDate == undefined) {
      $("#dates").focus();
      this.swal("Info", "Please Choose Date", 'info');
      return;
    }
    Swal.fire({
      title: 'Are you sure want to update ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Update it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.updateUnprocessed.createdBy = this.user1.userId;
        this.updateUnprocessed.updatedBy = this.user1.userId;
        this.updateUnprocessed.unprocessedId = itemds.unprocessedId;
        this.updateUnprocessed.unprocessDate = new Date(unprocessDate);
        this.updateUnprocessed.months = months;
        this.updateUnprocessed.years = years;
        this.updateUnprocessed.statusFlag = this.statusFlag;
        this.unprocessedmasterservice.updateUnprocessedData(this.updateUnprocessed).subscribe((resp: any) => {
          this.data = resp;
          if (this.data.status == "Success") {
            this.swal('Success', this.data.message, 'success')
            this.route.navigate(['application/viewunprocess']);
          } else if (this.data.status == "Failed") {
            this.swal('Success', this.data.message, 'error')
          } else {
            this.swal("Error", "Something went wrong", 'error');
          }
        })
      }
    })
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  resetData() {
    window.location.reload();
  }

  cencel1() {
    this.route.navigate(['/application/viewunprocess']);
  }
  yes($event: any) {
    this.statusFlag = 0;
  }

  no($event: any) {
    this.statusFlag = 1;
  }
}
