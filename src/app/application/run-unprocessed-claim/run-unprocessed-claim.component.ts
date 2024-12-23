import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { HeaderService } from '../header.service';
import { PendingService } from '../pending.service';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import { UnprocessedclaimService } from '../Services/unprocessedclaim.service';
import { TableUtil } from '../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-run-unprocessed-claim',
  templateUrl: './run-unprocessed-claim.component.html',
  styleUrls: ['./run-unprocessed-claim.component.scss']
})
export class RunUnprocessedClaimComponent implements OnInit {

  stateList:any=[];
  districtList:any=[];
  hospitalList:any=[];
  selectedItems: any = [];
  data1:any
  days: number;
  actionId: any='';
  months: string;
  year: number;
  responseData: any;
  showPegi: boolean=false;
  record: any;
  claimlist: any = [];
  totalClaimCount: any;
  claimBy: string;
  snoclaimlist: any = [];
  state: any;
  dist: any;
  hospital: any;
  statename: any='ALL';
  distname: any='ALL';
  hospname: any='ALL';
    constructor(private snoService: SnocreateserviceService,public headerService:HeaderService,private unprocessedService: UnprocessedclaimService,public route: Router,private sessionService: SessionStorageService,) { }

  ngOnInit(): void {
    $('#data').hide();
    this.headerService.setTitle('Unprocessed Summary');
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
    this.getStateList();
    this.Search();
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
    this.snoService.getStateList().subscribe(
      (response) => {
        this.stateList = response;
      },
      (error) => console.log(error)
    )
  }
  OnChangeState(id) {
    $("#districtId").val("");
    this.selectedItems = [];
    localStorage.setItem("stateCode", id);
    this.snoService.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = response;
      },
      (error) => console.log(error)
    )
  }
  OnChangeDistrict(id) {
    this.selectedItems = [];
    var stateCode = localStorage.getItem("stateCode");
    this.snoService.getHospitalbyDistrictId(id, stateCode).subscribe(
      (response) => {

        this.hospitalList = response;
      },
      (error) => console.log(error)
    )
  }
  ResetField(){
      window.location.reload();
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  formdate:any;
  toDate:any;
  data:any;
  Search(){
    this.formdate=$('#datepicker1').val();
    this.toDate= $('#datepicker2').val();
    let state=$('#stateId').val();this.state=state;
    let dist=$('#districtId').val();this.dist=dist;
    let hospital=$('#hospital').val();this.hospital=hospital;
    if(this.formdate=='' || this.formdate==null|| this.formdate==undefined){
      this.swal('', 'From Date should not be blank', 'error');
      return;
    }
    if(this.toDate=='' || this.toDate==null || this.toDate==undefined){
      this.swal('', 'To Date should not be blank', 'error');
      return;
    }
    if(Date.parse(this.formdate)>Date.parse(this.toDate)){
      this.swal('', ' From Date should be less than To Date', 'error');
      return;
    }
    this.data={
      "fromDate":this.formdate,
      "toDate":this.toDate,
      "stateCode":state,
      "districtCode":dist,
      "hospitalCode":hospital
    }
    this.unprocessedService.rununprocessed(this.data).subscribe(
      (response:any) => {
        this.responseData = response;
        if (this.responseData.status == 'success') {
          this.snoclaimlist = this.responseData.data;
          this.record = this.snoclaimlist.length;
          if (this.record > 0) {
            this.showPegi = true;
          } else {
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
    )
  }
  report: any = [];
  sno: any = {
    Slno: "",
    discharge: "",
    claim: "",
    cpdfresh: "",
    cpdresettlement: "",
    PendingAtHospital: ""
  };
  heading = [['Sl#', 'Total Discharged', 'Total Claim Submitted', 'Pending at CPD as Fresh', 'Pending at CPD as Re settlement', 'Pending At Hospital After Query from CPD (With in 7 days from Query)']];
  downloadList(no:any){
    this.report = [];
    let bulk: any;
      bulk = this.snoclaimlist[0];
      this.sno = [];
      this.sno.Slno =1;
      this.sno.discharge = bulk.discharge;
      this.sno.claim = bulk.claim;
      this.sno.cpdfresh =bulk.freshCpd;
      this.sno.cpdresettlement =  bulk.cpdResettlement;
      this.sno.PendingAtHospital = bulk.hosPending;
      this.report.push(this.sno);

      for(let j=0; j < this.stateList.length;j++){
        if(this.stateList[j].stateCode==this.state){
          this.statename=this.stateList[j].stateName;
        }
      }
      for(let j=0; j < this.districtList.length;j++){
        if(this.districtList[j].districtcode==this.dist){
          this.distname=this.districtList[j].districtname;
        }
      }
      for(let j=0; j < this.hospitalList.length;j++){
        if(this.hospitalList[j].hospitalCode==this.hospital){
          this.hospname=this.hospitalList[j].hospName;
        }
      }

      if(no==1){
        let filter = [];
      filter.push([['Actual Date Of Discharge From :- ',this.formdate]]);
      filter.push([['Actual Date Of Discharge To :- ', this.toDate]]);
      filter.push([['State Name :-',this.statename]]);
      filter.push([['District Name :-',this.distname]]);
      filter.push([['Hospital Name :-',this.hospname]]);
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'Unprocessed Summary',
        this.heading,
        filter
      );
        // TableUtil.exportListToExcelWithFilter(this.report, "Unprocessed Summary", this.heading,filter);
      }else{
        if (this.report == null || this.report.length == 0) {
          this.swal('Info', 'No Record Found', 'info');
          return;
        }
        var doc = new jsPDF('p', 'mm', [290, 210]);
      let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
      // let generatedBy = JSON.parse(sessionStorage.getItem('user')).fullName;
      let generatedBy = this.sessionService.decryptSessionData("user").fullName;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.text('Unprocessed Summary Report', 65, 15);
      doc.setFontSize(12);
      doc.text('Actual Date Of Discharge From :- ' + this.formdate+ 'To :- '+this.toDate, 15, 23);
      doc.text('State Name :-'+this.statename,15,31);
      doc.text('District Name :-'+this.distname,120,31);
      doc.text('Hospital Name :-'+this.hospname,15,39);
      doc.text('GeneratedOn :- '+generatedOn,15,47);
      doc.text('GeneratedBy :- '+generatedBy,15,55);
      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.Slno;
        pdf[1] = clm.discharge;
        pdf[2] = clm.claim;
        pdf[3] = clm.cpdfresh;
        pdf[4] = clm.cpdresettlement;
        pdf[5] = clm.PendingAtHospital;
        rows.push(pdf);
      }
      autoTable(doc, {
        head: this.heading,
        body: rows,
        theme: 'grid',
        startY: 60,
        headStyles: {
          fillColor: [26, 99, 54],
        },
        columnStyles: {
          0: { cellWidth:10},
        },
      });
      doc.save('GJAY_Unprocessed Summary Report.pdf');
      }

  }
  RunUnprocessed(){
    Swal.fire({
      title: '',
      text: 'Are you sure To Run?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        this.unprocessedService.rununprocessedClaim(this.data).subscribe(
          (response:any) => {
            this.responseData = response;
            if (this.responseData.status == "Success") {
              this.swal("Success", this.responseData.message, "success");
              this.route.navigate(['/application/rununprocessedclaim']);
            } else if (this.responseData.status == "Failed") {
              this.swal("Error", this.responseData.message, "error");
            }
          },
          (error) => {
            console.log(error);
            this.swal('', 'Something went wrong.', 'error');
          }
        )
      }
    });
  }

  details(flag:any,count:any){
    if(count>0){
      for(let j=0; j < this.stateList.length;j++){
        if(this.stateList[j].stateCode==this.state){
          this.statename=this.stateList[j].stateName;
        }
      }
      for(let j=0; j < this.districtList.length;j++){
        if(this.districtList[j].districtcode==this.dist){
          this.distname=this.districtList[j].districtname;
        }
      }
      for(let j=0; j < this.hospitalList.length;j++){
        if(this.hospitalList[j].hospitalCode==this.hospital){
          this.hospname=this.hospitalList[j].hospName;
        }
      }
      let data={
        "fromDate":this.formdate,
        "toDate":this.toDate,
        "stateCode":this.state,
        "districtCode":this.dist,
        "hospitalCode":this.hospital,
        "flag":flag,
        "statename":this.statename,
        "distname":this.distname,
        "hospname":this.hospname
      }
      localStorage.setItem('unprocessed', JSON.stringify(data));
      this.route.navigate([]).then(result => { window.open(environment.routingUrl+'/unprocessedsummarydetails'); });
    }else{
      this.swal("Info", "No Record Found", "info");
          return;
    }

  }
}
