import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { data } from 'jquery';
import Swal from 'sweetalert2';
import { ForeportserviceService } from '../Services/foreportservice.service';
declare let $: any;
@Component({
  selector: 'app-fo-float-report',
  templateUrl: './fo-float-report.component.html',
  styleUrls: ['./fo-float-report.component.scss']
})
export class FoFloatReportComponent implements OnInit {
  headerService: any;
  currentPage: any;
  pageElement: any;
  formdate: any;
  todate: any;
  floatData: any;
  foReportDataList: any = [];
  txtsearchDate: any;
  floateno: any;
  record: any;
  showPegi: boolean;

  constructor(private fofloatReportService: ForeportserviceService, private route: Router) { }

  ngOnInit(): void {
    $('.selectpicker').selectpicker();
    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      // endDate: '0d',
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
    let date2=date.getDate();
    let month: any = date.getMonth();
    let month1: any = date.getMonth()-1;
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
    var frstDay = date1 + "-" + month + "-" + year;
    var secoundDay = date2 + "-" + month + "-" + year;
    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr("placeholder", "From Date *");
     $('input[name="toDate"]').val(secoundDay);
    $('input[name="toDate"]').attr("placeholder", "To Date *");
    this.Search();
  }
  Search() {
    var formdate = $('#datepicker1').val().toString().trim();
    var todate = $('#datepicker2').val().toString().trim();
    var floateno = $('#floateno').val().toString().trim();
    console.log("Data in ts==========" + formdate + " " + todate + "" + floateno);
    if (Date.parse(formdate) > Date.parse(todate)) {
      this.swal('', 'From date should be less than To date', 'error');
      return;
    }
    this.fofloatReportService.getFoFilterData(formdate, todate, floateno).subscribe(data => {
      console.log(data);
      this.foReportDataList = data;
      this.record = this.foReportDataList.length;
      if (this.record > 0) {
        this.showPegi = true;
        this.currentPage = 1;
          this.pageElement = 10;
      }
      else {
        this.showPegi = false;
      }
    });
  }
  ResetField() {
    window.location.reload()
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  keyfunction1(e){
    if (e.value[0] == " ") {
      $('#floateno').val('');
    }
  }
  Details(v: any) {
    let navigationExtras: NavigationExtras = {
      state: {
        user: v.floateno
      }
    };
    this.route.navigate(['application/floatedetails'], navigationExtras);
  }
}
