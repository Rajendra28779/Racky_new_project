import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../header.service';
import { CpdleaveService } from 'src/app/application/Services/cpdleave.service';
import { NavigationExtras, Router } from '@angular/router';
declare let $: any;
import Swal from 'sweetalert2';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-cpdleaveapprove',
  templateUrl: './cpdleaveapprove.component.html',
  styleUrls: ['./cpdleaveapprove.component.scss']
})
export class CpdleaveapproveComponent implements OnInit {
  childmessage: any;
  currentPage:any;
  pageElement:any;
  showPegi:boolean;
  txtsearchDate:any;
  userId: any;
  cpdleaverequest:any;
  countcpdleaverequest:any;
  constructor(public headerService: HeaderService,private cpdleaveservice:CpdleaveService,public route:Router,private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle("CPD Leave Approve");
    $('.selectpicker').selectpicker();

$('.datepicker').datetimepicker({
  format: 'DD-MMM-YYYY',
  // endDate: '0d',
  // maxDate: new Date(),
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
   this.getallcpdleaverequest();

  }
  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }
  getallcpdleaverequest(){
    // this.userId =JSON.parse(sessionStorage.getItem("user"));
    this.userId = this.sessionService.decryptSessionData("user");
    this.cpdleaveservice.getallcpdleaverequest(this.userId.userId).subscribe(data=>{
      console.log(data);
      this.cpdleaverequest=data;
      this.countcpdleaverequest=this.cpdleaverequest.length;
      console.log(this.countcpdleaverequest);
      if(this.countcpdleaverequest>0){
        this.currentPage = 1;
        this.pageElement = 10;
        this.showPegi=true;
      }

    });
  }
  Action(item:any){
    let navigationExtras: NavigationExtras = {
      state: {
        user: item,
        status:0
      }
    };
    this.route.navigate(['application/cpdleaveapproveaction'], navigationExtras);
  }
  search(){
    var fromdate = $('#fromDate').val().toString();
    var todate = $('#toDate').val().toString();
    if(Date.parse(fromdate)>Date.parse(todate)){
      this.swal('', 'From date should be less than To date', 'error');
      return;
    }
    // this.userId =JSON.parse(sessionStorage.getItem("user"));
    this.userId = this.sessionService.decryptSessionData("user");
    this.cpdleaveservice.getallcpdleavefilterrequest(this.userId.userId,fromdate,todate).subscribe(data=>{
      console.log(data);
      this.cpdleaverequest=data;
      this.countcpdleaverequest=this.cpdleaverequest.length;
      console.log(this.countcpdleaverequest);
      if(this.countcpdleaverequest>0){
        this.currentPage = 1;
        this.pageElement = 10;
        this.showPegi=true;
      }

    });

  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
}
