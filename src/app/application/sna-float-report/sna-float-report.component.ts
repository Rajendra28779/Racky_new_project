import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../header.service';
import Swal from 'sweetalert2';
import { SnaFloatServiceService } from '../sna-float-service.service';
import { NavigationExtras, Router } from '@angular/router';
import { SessionStorageService } from 'src/app/services/session-storage.service';

declare let $: any;
@Component({
  selector: 'app-sna-float-report',
  templateUrl: './sna-float-report.component.html',
  styleUrls: ['./sna-float-report.component.scss']
})
export class SnaFloatReportComponent implements OnInit {
  folist: any = [];
  showPegi: boolean;
  currentPage: any;
  pageElement: any;
  fromDate: any;
  toDate: any;
  query: boolean = false;
  record: any;
  router: any;
  txtsearchDate: any
  countfolist: any = 0;
  constructor(public headerService: HeaderService, private snafloatservice: SnaFloatServiceService, private route: Router, private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle("SNA Float Report ");
    this.currentPage = 1;
    this.pageElement = 10;

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
    let date2 = date.getDate();
    let month: any = date.getMonth();
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
    var frstDay1 = date2 + "-" + month + "-" + year;
    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr("placeholder", "From Date *");
    $('input[name="toDate"]').val(frstDay1);
    $('input[name="toDate"]').attr("placeholder", "To Date *");
    this.getsnafloatlist();
  }
  getsnafloatlist() {
    this.fromDate = $('#datepickerforfo').val();
    this.toDate = $('#datepickerforfo1').val();
    let Floatnumber = $('#Float').val();
    let userid = this.sessionService.decryptSessionData("user");
    if (Date.parse(this.fromDate) > Date.parse(this.toDate)) {
      this.swal('', 'From date should be less than To date', 'error');
      return;
    }
    this.snafloatservice.getsnafloatDetails(this.fromDate, this.toDate, Floatnumber, userid.userId).subscribe((res: any) => {
      console.log(res);
      this.folist = res;
      this.countfolist = this.folist.length
      console.log(this.folist.length);
      // if (this.folist.length == 0) {
      //   this.query=true;
      // }
      this.record = this.folist.length;
      if (this.record > 0) {
        this.showPegi = true;
      }
      else {
        this.showPegi = false;
      }
    });
  }
  Details(claim: any) {
    let navigationExtras: NavigationExtras = {
      state: {
        user: claim.floateno
      }
    };
    this.route.navigate(['application/floatedetails'], navigationExtras);
  }
  onrestedata() {
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
