import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FinancialofficerdetailserviceService } from 'src/app/financialofficerdetailservice.service';
import Swal from 'sweetalert2';
import { HeaderService } from '../header.service';
import { SnafloatgenerationserviceService } from '../snafloatgenerationservice.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-sna-view-float',
  templateUrl: './sna-view-float.component.html',
  styleUrls: ['./sna-view-float.component.scss']
})
export class SnaViewFloatComponent implements OnInit {

  folist: any = [];
  showPegi: boolean;
  currentPage: any;
  pageElement: any;
  fromDate: any;
  toDate: any;
  query: boolean = false;
  record: any;
  user: any;

  constructor(private headerService: HeaderService, private snafloatgenerationservice: SnafloatgenerationserviceService, public router: Router, private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle('Financial details');
    this.user = this.sessionService.decryptSessionData("user");
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
    let month: any = date.getMonth() - 1;
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
    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr("placeholder", "From Date *");
    $('input[name="toDate"]').attr("placeholder", "To Date *");
    this.viewSnaFloatData();

  }
  viewSnaFloatData() {
    let userId = this.user.userId;
    this.fromDate = $('#datepickerforfo').val();
    this.toDate = $('#datepickerforfo1').val();
    let Financialnumber = $('#Float').val();
    if (Date.parse(this.fromDate) > Date.parse(this.toDate)) {
      this.swal('', 'From date should be less than To date', 'error');
      return;
    }
    this.snafloatgenerationservice.viewSnaFloatData(this.fromDate, this.toDate, Financialnumber, userId).subscribe((res: any) => {
      console.log(res);
      this.folist = res;
      console.log(this.folist.length);

      if (this.folist.length == 0) {
        this.query = true;
      }
      this.record = this.folist.length;
      if (this.record > 0) {
        this.showPegi = true;
      }
      else {
        this.showPegi = false;
      }
    });
  }
  onrestedata() {
    window.location.reload();
  }
  snaFloatAction(floatNo: any) {
    let state = {
      floatNo: floatNo,
    }
    localStorage.setItem("details", JSON.stringify(state));
    this.router.navigate(['/application/snafloatdetails/action']);

  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
}
