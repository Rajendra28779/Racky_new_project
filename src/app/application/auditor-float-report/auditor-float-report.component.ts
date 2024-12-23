import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../header.service';
import { AuditorfloatreportserviceService } from '../Services/auditorfloatreportservice.service';

declare let $: any;

@Component({
  selector: 'app-auditor-float-report',
  templateUrl: './auditor-float-report.component.html',
  styleUrls: ['./auditor-float-report.component.scss']
})
export class AuditorFloatReportComponent implements OnInit {

  floatReport:any;
  countfloatReport:any;
  showPegi:any;
  pageElement:any;
  currentPage:any;
  txtsearchDate:any;
  constructor(public headerService: HeaderService,public auditorfloatreportservice: AuditorfloatreportserviceService,private route:Router) { }

  group=new FormGroup({
    fromdate:new FormControl(''),
    todate:new FormControl(''),
    floatno:new FormControl(''),
  });

  ngOnInit(): void {
    this.headerService.setTitle('Auditor Float Report');
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
     //Date input placeholder
     $('input[name="fromDate"]').val(frstDay);
     $('input[name="fromDate"]').attr("placeholder", "From Date *");
     $('input[name="toDate"]').val(secoundDay);
     $('input[name="toDate"]').attr("placeholder", "To Date *");
     this.floatreportOfAudior();
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  }
  reset(){
    this.ngOnInit();
  }
  floatreportOfAudior(){
    let fromdate=$('#datepicker1').val().toString().trim();
    let todate=$('#datepicker2').val().toString().trim();
    let floatno=$('#floatno').val().toString().trim();
    console.log(fromdate+" "+todate+" "+floatno);
    if(Date.parse(fromdate) > Date.parse(todate)){
      this.swal('', ' From Date should be less To Date', 'error');
      return;
    }
    this.auditorfloatreportservice.getFloatReportOfAuditor(fromdate,todate,floatno).subscribe(data=>{
      console.log(data);
      this.floatReport=data;
      this.countfloatReport=this.floatReport.length;
        if(this.countfloatReport>0){
          this.currentPage = 1;
          this.pageElement = 10;
          this.showPegi=true;
        }
    })
  }
  Details(claim:any){
    let navigationExtras: NavigationExtras = {
      state: {
        user: claim.floateno
      }
    };
    this.route.navigate(['application/floatedetails'], navigationExtras);
  }
  keyfunction1(e){
    if (e.value[0] == " ") {
      $('#floatno').val('');
    }
  }
}
