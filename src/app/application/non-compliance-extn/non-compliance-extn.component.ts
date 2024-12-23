import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../header.service';
import { PendingService } from '../pending.service';
import { SnamasterserviceService } from '../Services/snamasterservice.service';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import { dateFormat } from 'highcharts';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-non-compliance-extn',
  templateUrl: './non-compliance-extn.component.html',
  styleUrls: ['./non-compliance-extn.component.scss']
})
export class NonComplianceExtnComponent implements OnInit {

  stateList:any;
  districtList:any
  hospitalList:any
  selectedItems: any = [];
  data1:any
  days: number;
  actionId: any='';
  months: string;
  year: number;
  responseData: any;
  showPegi: boolean=false;
  record: any;
  snoclaimlist: any = [];
  totalClaimCount: any;
  claimBy: string;
  userId: any;
  user: any;
  stat:any=0;
  urn:any;
  showsna:any;

    constructor(private snoService: SnocreateserviceService, private snamasterService: SnamasterserviceService,public headerService:HeaderService,private pendingService: PendingService,public route: Router, private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    $('#data').hide();
    this.user = this.sessionService.decryptSessionData("user");
    this.headerService.setTitle('Extension Of NonCompliance');

    $('.selectpicker').selectpicker();

    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      // maxDate: new Date(),
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
    let month: any = date.getMonth()-1;
    if(month == -1){
      this.months = 'Dec';
      this.year = year-1;
    }else{
      this.months = this.getMonthFrom(month);
      this.year = year;
    }
    var frstDay = date1 + '-' + this.months + '-' + this.year;
    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr("placeholder", "From Date *");

    if(this.user.groupId==4){
      this.showsna=true;
    }else{
      this.showsna=false;
    }
    this.getStateList();
  }
  getMonthFrom(month) {
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
    return month;
  }
  getStateList() {
    if(this.showsna){
      this.snamasterService.getStateList(this.user.userId).subscribe(
        (response) => {
          this.stateList = response;
        },
        (error) => console.log(error)
      )
    }else{
        this.snoService.getStateList().subscribe(
          (response) => {
            this.stateList = response;
          },
          (error) => console.log(error)
        );
    }
  }
  OnChangeState(id) {
    $("#districtId").val("");
    this.selectedItems = [];
    localStorage.setItem("stateCode", id);
    if(this.showsna){
        this.snamasterService.getDistrictListByStateId(this.user.userId, id).subscribe(
          (response) => {
            this.districtList = response;
          },
          (error) => console.log(error)
        )
    }else{
        this.snoService.getDistrictListByStateId(id).subscribe(
              (response) => {
                this.districtList = response;
              },
              (error) => console.log(error)
            )
    }

  }
  OnChangeDistrict(id) {
    this.selectedItems = [];
    var stateCode = localStorage.getItem("stateCode");
    if(this.showsna){
      this.snamasterService.getHospitalbyDistrictId(this.user.userId, id, stateCode).subscribe(
        (response) => {
          this.hospitalList = response;
        },
        (error) => console.log(error)
      )
    }else{
      this.snoService.getHospitalbyDistrictId(id, stateCode).subscribe(
        (response) => {

          this.hospitalList = response;
        },
        (error) => console.log(error)
      )
    }

  }

  finddays(fromDate:any,todate:any){{
    const fromDate1=this.GetDate(fromDate);
    const todate1=this.GetDate(todate);
    let diffTime = Math.abs(todate1.getTime() - fromDate1.getTime());
    let days=Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return days;
  }


  }

  finddays1(todate:any){
    const todate1=this.GetDate(todate);
    let diffTime = Math.abs(todate1.getTime() - new Date().getTime());
    let days=Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return days;
  }


  formdate:any;
  toDate:any;
  Search(){
    this.formdate=$('#datepicker1').val();
    this.toDate= $('#datepicker2').val();
    let state=$('#stateId').val();
    let dist=$('#districtId').val();
    let hospital=$('#hospital').val();
    this.days =this.finddays(this.formdate,this.toDate);
    if(Date.parse(this.formdate)>Date.parse(this.toDate)){
      this.swal('', ' From Date should be less than To Date', 'error');
      return;
    }
    if(Date.parse(this.formdate)>Date.parse(this.toDate)){
      this.swal('', ' From Date should be less than To Date', 'error');
      return;
    }
    if(this.days>366){
      this.swal('', ' Maximum 365 days Allow', 'error');
      return;
    }
    if(this.actionId=='' || this.actionId==null){
      this.swal('', ' Please Select Non-Compliance Type', 'error');
      return;
    }
    // if(state=='' || state==null){
    //   this.swal('', ' Please Select State', 'error');
    //   return;
    // }
    // if(dist=='' || dist==null){
    //   this.swal('', ' Please Select District', 'error');
    //   return;
    // }
    // if(hospital=='' || hospital==null){
    //   this.swal('', ' Please Select Hospital', 'error');
    //   return;
    // }
    let data={
      "fromDate":this.formdate,
      "toDate":this.toDate,
      "stateCode":state,
      "districtCode":dist,
      "hospitalCode":hospital,
      "actionId":this.actionId
    }
    this.pendingService.getNonComplianceExtension(data).subscribe(
      (response:any) => {
        this.responseData = response;
        if (this.responseData.status == 'success') {
          this.snoclaimlist = this.responseData.data;
          this.totalClaimCount = this.snoclaimlist.length;
          this.record = this.snoclaimlist.length;
          this.transactionDetails=[];
          if (this.record > 0) {
            this.showPegi = true;
            $('#data').show();
          } else {
            $('#data').hide();
            this.swal('info', 'No Record Found', 'info');
            this.showPegi = false;
          }
        } else {
          this.swal('', 'Something went wrong.', 'error');
        }
      },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      }
    );

  }
  GetDate(str) {
    var arr = str.split("-");
    var months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

    var month = months.indexOf(arr[1].toLowerCase());

    return new Date(parseInt(arr[2]), month, parseInt(arr[0]));
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  swal1(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    }).then((result) => {
      if (result.value) {
        this.Search();
      }
    });
  }

  ResetField(){
    window.location.reload();
  }
  convertDateFormat() {
    var date = new Date();
    let year = date.getFullYear();
    let date2=date.getDate();
    let month: any = date.getMonth();
    var frstDay = date2 + '-' + this.getMonthFrom(month) + '-' + year;
    return frstDay;

  }
  transactionDetails:any=[];
  changeStat(event) {
    if(!event.check) {
      event.check=true;
      this.transactionDetails.push(event.transactionDetailsId);
    } else {
      event.check=false;
      let index = this.transactionDetails.indexOf(event.transactionDetailsId);
      this.transactionDetails.splice(index,1);
    }
  }
  changeStat1(event) {
    for(let i=0;i<this.snoclaimlist.length;i++){
      if(event) {
        this.snoclaimlist[i].check=true;
        this.transactionDetails.push(this.snoclaimlist[i].transactionDetailsId);
      } else {
        this.snoclaimlist[i].check=false;
        let index = this.transactionDetails.indexOf(this.snoclaimlist[i].transactionDetailsId);
        this.transactionDetails.splice(index,1);
      }
    }
  }
  submitDetails(){
    this.userId = this.user.userId;
    this.claimBy= $('#datepicker3').val().trim();
    let fromDate = Date.parse(this.claimBy);
    let yesterday = Date.parse(new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleString());
    if(this.transactionDetails.length==0){
      this.swal('','Please select atleast one record','error');
      return;
    }
    if (fromDate < yesterday) {
      this.swal('', 'Extend Date should be greater than or Equal to Today', 'error');
      return;
    }

    this.days =this.finddays1(this.claimBy);

    if(this.days>7){
      this.swal('', 'More than 7 Days can not be allowed for Extension.', 'error');
      return;
    }

    let data={
      "transactionDetailsId":this.transactionDetails,
      "claimBy":this.claimBy,
      "actionId":this.actionId,
      "createdBy":this.userId,
    }
    Swal.fire({
      title: '',
      text: 'Are you sure To Extend?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        this.pendingService.submitNonComplianceExtension(data).subscribe(
          (response: any) => {
            this.responseData = response;
            if (this.responseData.status == 'Success') {
              this.swal1('success', 'Date Extended Successfully', 'success');
            } else {
              this.swal('', 'Something went wrong.', 'error');
            }
          },
          (error) => {
            console.log(error);
            this.swal('', 'Something went wrong.', 'error');
          }
        );
      }
    });
  }
}
