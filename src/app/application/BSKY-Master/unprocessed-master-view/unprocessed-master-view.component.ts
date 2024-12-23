import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Form, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { UnprocessedConfigurationServiceService } from '../../Services/unprocessed-configuration-service.service';
import { data } from 'jquery';
import { DatePipe } from '@angular/common';
declare let $: any;

@Component({
  selector: 'app-unprocessed-master-view',
  templateUrl: './unprocessed-master-view.component.html',
  styleUrls: ['./unprocessed-master-view.component.scss']
})
export class UnprocessedMasterViewComponent implements OnInit {
  record: any;
  currentPage: any;
  pageElement: any;
  showPegi: boolean;
  txtsearchDate: any;
  unprocessedList: any = [];
  deleteDetails: any;
  status: any;
  childmessage: any;
  getAllYears: any[] = [];
  form!: FormGroup;
  selectedYear: any;
  stickyear: any;
  Months: any;

  constructor(public fb: FormBuilder, public unprocessedmasterservice: UnprocessedConfigurationServiceService, private route: Router, private headerService: HeaderService) { }

  ngOnInit(): void {
    let date = new Date();
    date.setDate(new Date().getDate() + 1)
    $('.selectpicker').selectpicker();
    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      // endDate: '0d',
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
    this.headerService.setTitle("View Unprocess Configuration");
    this.headerService.isIndicate(false);
    this.headerService.isBack(true);
    this.currentPage = 1;
    this.pageElement = 100;
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
    this.getUnprocessedDetails();
  }

  month(no: any) {
    let month = no
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
    return this.Months;
  }

  getUnprocessedDetails() {
    this.unprocessedmasterservice.getUnprocessedData().subscribe((allData) => {
      this.unprocessedList = allData;
      this.record = this.unprocessedList.length;
      if (this.record > 0) {
        this.showPegi = true;
      }
      else {
        this.showPegi = false;
      }
    })
  }
  search() {
    var years = $('#years').val().toString();
    if (years == null || years == "" || years == undefined) {
      $("#years").focus();
      this.swal("Info", "Please Select Year", 'info');
      return;
    }
    var months = $('#months').val().toString();
    if (months == null || months == "" || months == undefined) {
      $("#months").focus();
      this.swal("Info", "Please Select Month", 'info');
      return;
    }
    this.unprocessedmasterservice.getUnprocessFilterData(years, months).subscribe(data => {
      this.unprocessedList = data;
      this.record = this.unprocessedList.length;
      if (this.record > 0) {
        this.currentPage = 1;
        this.pageElement = 9;
        this.showPegi = true;
      } else {
        this.showPegi = false;
      }
    });
  }

  Reset() {
    window.location.reload();
  }

  edit(item: any) {
    let d = new Date().getDate();
    let m = new Date().getMonth() + 1;
    let y = new Date().getFullYear();
    let M = this.month(m);
    let f = d + "-" + M + "-" + y
    if (Date.parse(item.unprocessDate) < Date.parse(f)) {
      this.swal("Error", " Can not Update Due to Unprocess Date Over", 'error');
    } else {
      let objToSend: NavigationExtras = {
        state: {
          unprocessedId: item.unprocessedId
        }
      };
      this.route.navigate(['application/addunprocess'], objToSend);
    }
  }
  convertStringToDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy');
    return date;
  }
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }



}
