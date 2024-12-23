import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { HeaderService } from '../header.service';
import { CpdleaveService } from '../Services/cpdleave.service';
declare let $: any;
import Swal from 'sweetalert2';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-cpdleaveview',
  templateUrl: './cpdleaveview.component.html',
  styleUrls: ['./cpdleaveview.component.scss']
})
export class CpdleaveviewComponent implements OnInit {
  childmessage: any;
  currentPage:any;
  pageElement:any;
  showPegi:boolean;
  txtsearchDate:any;
  userId: any;
  cpdleaveactiondetails: any;
  countcpdactiondetails: any;
  constructor(public headerService: HeaderService,private cpdleaveservice:CpdleaveService,public route:Router,private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle("View Leave Action");
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
   this.getallcpdleaveactiondetails();
  }
  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }
  getallcpdleaveactiondetails(){
    // this.userId =JSON.parse(sessionStorage.getItem("user"));
    this.userId = this.sessionService.decryptSessionData("user");
    this.cpdleaveservice.getallcpdactiondetails(this.userId.userId).subscribe(data=>{
      console.log(data);
      this.cpdleaveactiondetails=data;
      this.countcpdactiondetails=this.cpdleaveactiondetails.length;

      if(this.countcpdactiondetails>0){
        this.currentPage = 1;
        this.pageElement = 9;
        this.showPegi=true;
      }

    });
  }
  view(item:any){
    let navigationExtras: NavigationExtras = {
      state: {
        user: item,
        status:1
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
    this.cpdleaveservice.getallcpdfilteractiondetails(this.userId.userId,fromdate,todate).subscribe(data=>{
      console.log(data);
      this.cpdleaveactiondetails=data;
      this.countcpdactiondetails=this.cpdleaveactiondetails.length;

      if(this.countcpdactiondetails>0){
        this.currentPage = 1;
        this.pageElement = 9;
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
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
}
}
