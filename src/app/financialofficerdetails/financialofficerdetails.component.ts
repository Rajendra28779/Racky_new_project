import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../application/header.service';
import { FinancialofficerdetailserviceService } from '../financialofficerdetailservice.service';
declare let $: any;


@Component({
  selector: 'app-financialofficerdetails',
  templateUrl: './financialofficerdetails.component.html',
  styleUrls: ['./financialofficerdetails.component.scss']
})
export class FinancialofficerdetailsComponent implements OnInit {
  folist: any = [];
  showPegi: boolean;
  currentPage: any;
  pageElement: any;
  fromDate:any;
  toDate:any;
  query:boolean = false;
  record:any;

  constructor(private headerService: HeaderService,private finalcialservice:FinancialofficerdetailserviceService,public router: Router) { }

  ngOnInit(): void {
    this.headerService.setTitle('Financial details');
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
  }
  ongetFoDetaisl(){
     this.fromDate = $('#datepickerforfo').val();
     this.toDate = $('#datepickerforfo1').val();
     let Financialnumber = $('#Float').val();
     if(Date.parse(this.fromDate)>Date.parse(this.toDate)){
      this.swal('', 'From date should be less than To date', 'error');
      return;
    }
    this.finalcialservice.getFinancialOfficerDetails(this.fromDate,this.toDate,Financialnumber).subscribe((res: any) => {
      console.log(res);
      this.folist = res;
      if (this.folist.length == 0) {
        this.query=true;
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
  onrestedata(){
    window.location.reload();
  }
  onFiancial(float:any){
    let  state={
      Action: float.float_NO,
    }
    localStorage.setItem("details",JSON.stringify(state));
    this.router.navigate(['/application/fodetailsdetails/Action']);

  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
}
