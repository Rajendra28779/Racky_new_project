import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderService } from '../header.service';
import { HospitalWiseClaimReportServiceService } from '../Services/hospital-wise-claim-report-service.service';
import { PendingClaimSnaReportServiceService } from '../Services/pending-claim-sna-report-service.service';
import { TableUtil } from '../util/TableUtil';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import { CurrencyPipe, formatDate } from '@angular/common';
import autoTable from 'jspdf-autotable';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;
@Component({
  selector: 'app-hospital-wise-claim-report',
  templateUrl: './hospital-wise-claim-report.component.html',
  styleUrls: ['./hospital-wise-claim-report.component.scss']
})
export class HospitalWiseClaimReportComponent implements OnInit {
  user: any;
  currentPage:any;
  pageElement:any;
  public hospitalList: any = [];
  hospitalId: any="";
  keyword2="hospitalName";
  stateId: any;
  dischareandclaimsubcount: any;
  countlist: any;
  showPegi:any;
  snareport:any;
  txtsearchDate:any;
  taggedList:any;
  @ViewChild('auto2') auto2;
  constructor(public headerService:HeaderService,private pendingclaimsnareprtservice:PendingClaimSnaReportServiceService,private hospitalwiseclaimreportserv: HospitalWiseClaimReportServiceService,public route: Router,private sessionService: SessionStorageService
    ) { }

  ngOnInit(): void {
    this.headerService.setTitle('Hospital Wise Claim Report');
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
    this.user = this.sessionService.decryptSessionData("user");
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
    let month:any = date.getMonth();
    if(month == 0){
      month = 'Jan';
    }else if(month == 1){
      month = 'Feb';
    }else if(month == 2){
      month = 'Mar';
    }else if(month == 3){
      month = 'Apr';
    }else if(month == 4){
      month = 'May';
    }else if(month == 5){
      month = 'Jun';
    }else if(month == 6){
      month = 'Jul';
    }else if(month == 7){
      month = 'Aug';
    }else if(month == 8){
      month = 'Sep';
    }else if(month == 9){
      month = 'Oct';
    }else if(month == 10){
      month = 'Nov';
    }else if(month == 11){
      month = 'Dec';
    }
    var frstDay = date1+"-"+month+"-"+year;
    //Date input placeholder
    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr("placeholder","From Date *");
    // $('input[name="toDate"]').val('');
    $('input[name="toDate"]').attr("placeholder","To Date *");
    //this.getSNAReports();
    //this.getActionTypeList();
    if(this.user.groupId==4){
      this.ongotHospitalCode();
    }else{
    this. getHospitalList();
    }
    this.search();
    this.currentPage = 1;
    this.pageElement = 10;

  }
  getHospitalList() {
    this.hospitalwiseclaimreportserv.getHospitalForAdminList().subscribe(
      (response) => {
        this.hospitalList = response;
        console.log(this.hospitalList);
      },
      (error) => console.log(error)
    )
  }
  ongotHospitalCode() {
    this.taggedList = [];
    let list = [];
    var name1=this.user.userId
    this.pendingclaimsnareprtservice.getHospitalTageed(name1).subscribe(
      (response) => {
        list = response;
        for(var i=0;i<list.length;i++) {
          var h = list[i];
          h.hospitalName = h.hospitalName + ' (' + h.hospitalCode + ')';
          this.hospitalList.push(h);
        }
      },
      (error) => console.log(error)
    )  
  }

  fromdate:any;
  todate:any;
  search(){
    let userId = this.user.userId;
    let fromDate=$('#date1').val();
    let toDate=$('#date2').val();
    let hospitalId = this.hospitalId;
    if (fromDate == null || fromDate == "" || fromDate == undefined) {
      this.swal("Info", "Please Select Actual Date of Discharge From", 'info');
      return;
    }
    if (toDate == null || toDate == "" || toDate == undefined) {
      this.swal("Info", "Please Select Actual Date of Discharge To", 'info');
      return;
    }
    if (Date.parse(fromDate) > Date.parse(toDate)) {
      this.swal('Info', ' From Date should be less than To Date', 'info');
      return;
    }

    this.fromdate=fromDate;
    this.todate=toDate;
    this.hospitalwiseclaimreportserv.searchhospitalwiseclaimreportdata(userId,this.fromdate,this.todate,hospitalId).subscribe(
      (response) =>{
       // console.log(response)
        this.dischareandclaimsubcount=response;
        this.countlist=this.dischareandclaimsubcount.length;
        if(this.countlist>0){
        this.currentPage = 1;
        this.pageElement = 10;
        this.showPegi=true;
        }
        if(this.dischareandclaimsubcount.length>0){
          this.snareport=false;
        }else{
        this.snareport=true;
        }
      },
      (error) => console.log(error)
    )
  }
  selectEvent2(item) {
    this.hospitalId = item.hospitalCode;
    this.hospitalname =item.hospitalName;

  }

  clearEvent2() {
    this.hospitalId = '';
  }

  ResetField(){
  window.location.reload();
  }
 report: any = [];
  cpdmappinglist: any = {
    slNo: "",
    hospitalCode: "",
    hospitalName: "",
    totalDischarge: "",
    claimsubmitted:"",
    
   };  
  heading = [['Sl No.', 'HospitalCode', 'HospitalName', 'Total Discharge', 'Claim Submitted']];


  hospitalname:any="ALL";
  downloadReport(type: any){
    if(this.dischareandclaimsubcount.length == 0)
    {
      this.swal('','No Data Found', 'info');
      return;
    }
    this.report = [];
    let item: any;
    for(var i=0;i<this.dischareandclaimsubcount.length;i++){
        item=this.dischareandclaimsubcount[i];
       // console.log("items of excel are"+item);
        this.cpdmappinglist=[];
        this.cpdmappinglist.slNo=i+1;
        this.cpdmappinglist.hospitalCode=item.hospitalCode;
        this.cpdmappinglist.hospitalName=item.hospitalName;
        this.cpdmappinglist.totalDischarge=item.totalDischarge;
        this.cpdmappinglist.claimsubmitted=item.claimsubmitted;
        this.report.push(this.cpdmappinglist);
    }
    if(type == 'excel'){
      let filter =[];
      filter.push([['Actual Date of Discharge from :- ', this.fromdate]]);
      filter.push([['Actual Date of Discharge to:- ',this.todate]]);
      filter.push([['Hospital Name:- ',this.hospitalname]]);
    TableUtil.exportListToExcelWithFilter(this.report, "Hospital Wise Claim Report", this.heading,filter);
  }else if(type == 'pdf'){
    if(this.dischareandclaimsubcount.length == 0)
    {
      this.swal('','No Data Found', 'info');
      return;
    }
    const doc = new jsPDF('p', 'mm', [240, 272] );
    doc.setFontSize(12);

      doc.text("Hospital Wise Claim Report", 14, 10);
      doc.text('Actual Date of Discharge :- '+this.fromdate +' To '+this.todate,14,20);
      doc.text('Hospital Name :- '+this.hospitalname,14,30);
      doc.text("Generated By: "+this.user.fullName+"\tGenerated On: " + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString(), 14, 40);
    
    let pdfRpt = [];
    for(var x=0;x<this.dischareandclaimsubcount.length;x++) {
      var flt = this.dischareandclaimsubcount[x];
      var pdf = [];
      pdf[0] = x+1;
      pdf[1] = flt.hospitalCode;
      pdf[2] = flt.hospitalName;
      pdf[3] = flt.totalDischarge;
      pdf[4] = flt.claimsubmitted;
      pdfRpt.push(pdf);
    }
    console.log(pdfRpt);
    autoTable(doc, {
      head: this.heading,
      body: pdfRpt,
      theme: 'grid',
      startY: 50,
      headStyles: {
        fillColor: [26, 99, 54]
      },
      columnStyles: {
        0: {cellWidth: 10},
        1: {cellWidth: 40},
        2: {cellWidth: 80},
        3: {cellWidth: 40},
        4: {cellWidth: 40},
      }          
    }); 
    doc.save('Hospital_Wise_Claim_Report_'+'.pdf');  
  }
    
  }

  dischargeData(event:any,hospitalcode:any){
    // let eventName=event.target.id;
    let userId = this.user.userId;
    let fromDate=$('#date1').val();
    let toDate=$('#date2').val();
    let hospitalId = this.hospitalId;
    localStorage.setItem("fromDate", fromDate);
    localStorage.setItem("toDate", toDate);
    localStorage.setItem("eventName",event);
    localStorage.setItem("hospitalId", hospitalcode);
    localStorage.setItem("userId",userId);
    //console.log(this.searchby,this.fromDate,this.toDate,this.urn,eventName);
    this.route.navigate([]).then(result => { window.open(environment.routingUrl+'/hospitalwiseclaimreportdetaildata'); 
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
