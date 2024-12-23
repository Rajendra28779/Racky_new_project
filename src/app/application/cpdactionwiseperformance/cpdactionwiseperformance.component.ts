import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HeaderService } from '../header.service';
import { MisreportService } from '../Services/misreport.service';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-cpdactionwiseperformance',
  templateUrl: './cpdactionwiseperformance.component.html',
  styleUrls: ['./cpdactionwiseperformance.component.scss']
})
export class CpdactionwiseperformanceComponent implements OnInit {
  user:any;
  public cpdList: any = [];
  keyword: any = 'fullName';
  cpdId:any="";
  result:any={};
  searchby:any;
  fromdate:any;
  todate:any;
  show:any=false;
  userid: any;
  name: any;
  showname: boolean;
  cpdname: any="ALL";

  constructor(private route:Router, public headerService: HeaderService,private snoService: SnocreateserviceService,private misservice:MisreportService,private sessionService: SessionStorageService,) { }

  ngOnInit(): void {
    this.headerService.setTitle("CPD Action Wise Performance Report");
    // this.user = JSON.parse(sessionStorage.getItem("user"));
    this.user = this.sessionService.decryptSessionData("user");
    this.name=this.user.fullName;
    if(this.user.groupId==3){
      this.showname=true;
    }else{
      this.showname=false;;
    }

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
      format: 'YYYY-MM-DD LT',
      daysOfWeekDisabled: ['', 7],
    });
    var date = new Date();

    let year = date.getFullYear();
    let date1 = '01';
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
    var frstDay = date1 + '-' + month + '-' + year;
    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr('placeholder', 'From Date *');

    // $('input[name="toDate"]').val('');
    $('input[name="toDate"]').attr('placeholder', 'To Date *');
    this.getCPDList();
    // this.search();
  }

  getCPDList() {

    this.snoService.getCPDList().subscribe(
      (response) => {
        this.cpdList = response;
        console.log(this.cpdList);
      },
      (error) => console.log(error)
    )
  }

  selectEvent(item) {
    // do something with selected item
    this.cpdId = item.userid;
    this.cpdname = item.fullName;
    // alert(this.cpdId)
  }

  get(){
    alert("hoi");
  }

  clearEvent() {
    this.cpdId = '';
  }

  reset(){

  }

  search(){
    this.searchby=$('#searchby').val();
    this.fromdate=$('#formdate').val();
    this.todate=$('#todate').val();
    if(this.cpdId==""){
      this.userid=this.user.userId
    }else{
      this.userid=this.cpdId
    }

    if(this.user.groupId==4){
      this.userid=this.user.userId
    }
// alert(this.userid);
    this.misservice.getcpdwiseperformace(this.searchby,this.cpdId,this.fromdate,this.todate,this.userid).subscribe((data:any)=>{
      this.result=data;
      console.log(this.result);
      this.show=true;
    },
    (error) => console.log(error)
    );
  }

  details(no:any,no1:any){
    if(this.user.groupId==3){
      this.cpdname=this.user.fullName;
    }
    localStorage.setItem("userid", this.user.userId);
    localStorage.setItem("serchtype", this.searchby);
    localStorage.setItem("fromdate", this.fromdate);
    localStorage.setItem("todate", this.todate);
    localStorage.setItem("actiontype", no);
    localStorage.setItem("cpdid",this.cpdId);
    localStorage.setItem("cpdname",this.cpdname);
    if(no1==1){
      localStorage.setItem("totalvalue","Total CPd Approved :- "+ this.result.cpdapprv);
    }else if(no1==2){
      localStorage.setItem("totalvalue","Total CPd Rejected :- "+ this.result.cpdreject);
    }else {
      localStorage.setItem("totalvalue","Total CPd Rejected with out Query :- "+this.result.cpdrejwthoutqury);
    }

    this.route.navigate([]).then(result => { window.open(environment.routingUrl+'/cpdwieperformancedetails'); });
  }

}
