import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderService } from '../header.service';
import { PendingClaimSnaReportServiceService } from '../Services/pending-claim-sna-report-service.service';
import { HospitalWiseClaimReportServiceService } from '../Services/hospital-wise-claim-report-service.service';
import { Router } from '@angular/router';
import { TableUtil } from '../util/TableUtil';
import jsPDF from 'jspdf';
import { CurrencyPipe, formatDate } from '@angular/common';
import autoTable from 'jspdf-autotable';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-snawise-payment-status',
  templateUrl: './snawise-payment-status.component.html',
  styleUrls: ['./snawise-payment-status.component.scss']
})
export class SNAWisePaymentStatusComponent implements OnInit {
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
  totalClaim: number;
  hospitalClaimAmount: number;
  cpdApprovedAmount: number;
  snaApprovedAmount: number;
  snaRejectedAmount: number;
  snaPaymentFreezeAmount: number;
  constructor(public headerService:HeaderService,private pendingclaimsnareprtservice:PendingClaimSnaReportServiceService,private hospitalwiseclaimreportserv: HospitalWiseClaimReportServiceService,public route: Router,private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle('SNA Wise Payment Status');
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
    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr("placeholder","From Date *");
    $('input[name="toDate"]').attr("placeholder","To Date *");
    // if(this.user.groupId==4){
    //   this.ongotHospitalCode();
    // }else{
    this. getHospitalList();
    // }
    this.search();
    this.currentPage = 1;
    this.pageElement = 10;

  }
  getHospitalList() {
    this.hospitalwiseclaimreportserv.getHospitalForAdminList().subscribe(
      (response) => {
        this.hospitalList = response;
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
  SNAWiseData:any=[];
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
    let requestData={
      "hospitalCode":hospitalId,
      "fromdate":new Date(fromDate),
      "todate":new Date(toDate)
    }
    this.hospitalwiseclaimreportserv.getSNAWiseStatusReport(requestData).subscribe(
      (response:any) =>{
       let sum1=0;let sum2=0;let sum3=0;let sum4=0;let sum5=0;let sum6=0;
        this.SNAWiseData=response.SnaWisePaymentStatus;
        for(var i=0;i<this.SNAWiseData.length;i++){
         sum1=sum1+this.SNAWiseData[i].TotalClaim;
          sum2=sum2+this.SNAWiseData[i].HospitalClaimAmount;
          sum3=sum3+this.SNAWiseData[i].CpdApprovedAmount;
          sum4=sum4+this.SNAWiseData[i].SnaApprovedAmount;
          sum5=sum5+this.SNAWiseData[i].SnaRejectedAmount;
          sum6=sum6+this.SNAWiseData[i].SnaPaymentFreezeAmount;
        }
        this.totalClaim=sum1;
        this.hospitalClaimAmount=sum2;
        this.cpdApprovedAmount=sum3;
        this.snaApprovedAmount=sum4;
        this.snaRejectedAmount=sum5;
        this.snaPaymentFreezeAmount=sum6;
        this.countlist=this.SNAWiseData.length;
        if(this.countlist>0){
        this.currentPage = 1;
        this.pageElement = 10;
        this.showPegi=true;
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
  snawisepaymentList: any = {
    slNo: "",
    SnaName: "",
    hospitalClaimAmount: "",
    cpdApprovedAmount: "",
    snaApprovedAmount:"",
    snaRejectedAmount:"",
    paymentFreezeAmount:"",
   };  
  heading = [['Sl No.', 'SNA Doctor Name', 'Hospital Claim AMount', 'CPD Approved Amount', 'SNA Approved Amount','SNA Rejected Amount','Payment Freeze Amount']];


  hospitalname:any="ALL";
  downloadReport(type: any){
    if(this.SNAWiseData.length == 0)
    {
      this.swal('','No Data Found', 'info');
      return;
    }
    this.report = [];
    let item: any;
    for(var i=0;i<this.SNAWiseData.length;i++){
        item=this.SNAWiseData[i];
        this.snawisepaymentList=[];
        this.snawisepaymentList.slNo=i+1;
        this.snawisepaymentList.SnaName=item.SnaDoctorName;
        this.snawisepaymentList.hospitalClaimAmount=this.convertCurrency(item.HospitalClaimAmount);
        this.snawisepaymentList.cpdApprovedAmount=this.convertCurrency(item.CpdApprovedAmount);
        this.snawisepaymentList.snaApprovedAmount=this.convertCurrency(item.SnaApprovedAmount);
        this.snawisepaymentList.snaRejectedAmount=this.convertCurrency(item.SnaRejectedAmount);
        this.snawisepaymentList.paymentFreezeAmount=this.convertCurrency(item.SnaPaymentFreezeAmount);
        this.report.push(this.snawisepaymentList);
    }
    this.snawisepaymentList = [];
    this.snawisepaymentList.SnaName = "TOTAL";
    this.snawisepaymentList.hospitalClaimAmount=this.convertCurrency(this.hospitalClaimAmount);
    this.snawisepaymentList.cpdApprovedAmount = this.convertCurrency(this.cpdApprovedAmount);
    this.snawisepaymentList.snaApprovedAmount =this.convertCurrency(this.snaApprovedAmount);
    this.snawisepaymentList.snaRejectedAmount=this.convertCurrency(this.snaRejectedAmount);
   this.snawisepaymentList.paymentFreezeAmount = this.convertCurrency(this.snaPaymentFreezeAmount);
   this.report.push(this.snawisepaymentList);
    if(type == 'excel'){
      let filter =[];
      filter.push([['Actual Date of Discharge from :- ', this.fromdate]]);
      filter.push([['Actual Date of Discharge to:- ',this.todate]]);
      filter.push([['Hospital Name:- ',this.hospitalname]]);
    TableUtil.exportListToExcelWithFilter(this.report, "SNA Wise Payment Status", this.heading,filter);
  }else if(type == 'pdf'){
    if(this.SNAWiseData.length == 0)
    {
      this.swal('','No Data Found', 'info');
      return;
    }
    const doc = new jsPDF('p', 'mm', [290, 272] );
      doc.setFontSize(12);
      doc.text("SNA Wise Payment Status", 14, 10);
      doc.text('Actual Date of Discharge :- '+this.fromdate +' To '+this.todate,14,20);
      doc.text('Hospital Name :- '+this.hospitalname,14,30);
      doc.text("Generated By: "+this.user.fullName+"\tGenerated On: " + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString(), 14, 40);
  //  pdfRpt.push(this.snawisepaymentList);
          var claim: any;
          var rows = [];
          for(var i=0;i<this.SNAWiseData.length;i++) {
            claim = this.SNAWiseData[i];
            var temp = [i+1, claim.SnaDoctorName,this.convertCurrency(claim.HospitalClaimAmount), this.convertCurrency(claim.CpdApprovedAmount), this.convertCurrency(claim.SnaApprovedAmount),this.convertCurrency(claim.SnaRejectedAmount),this.convertCurrency(claim.SnaPaymentFreezeAmount) ];
            rows.push(temp);
          }
          let list = [];
          list[1] = "TOTAL";
          list[2]=this.convertCurrency(this.hospitalClaimAmount);
          list[3] = this.convertCurrency(this.cpdApprovedAmount);
          list[4] =this.convertCurrency(this.snaApprovedAmount);
          list[5]=this.convertCurrency(this.snaRejectedAmount);
          list[6] = this.convertCurrency(this.snaPaymentFreezeAmount);
          rows.push(list);
    autoTable(doc, {
      head: this.heading,
      body: rows,
      theme: 'grid',
      startY: 50,
      headStyles: {
        fillColor: [26, 99, 54]
      },
      columnStyles: {
        0: {cellWidth: 10},
        1: {cellWidth: 40},
        2: {cellWidth: 40},
        3: {cellWidth: 40},
        4: {cellWidth: 40},
        5: {cellWidth: 40},
        6: {cellWidth: 40},
      }          
    }); 
    doc.save('SNA_Wise_Payment_Status_'+'.pdf');  
  }
    
  }

  dischargeData(event:any,hospitalcode:any){
    let userId = this.user.userId;
    let fromDate=$('#date1').val();
    let toDate=$('#date2').val();
    let hospitalId = this.hospitalId;
    localStorage.setItem("fromDate", fromDate);
    localStorage.setItem("toDate", toDate);
    localStorage.setItem("eventName",event);
    localStorage.setItem("hospitalId", hospitalcode);
    localStorage.setItem("userId",userId);
    this.route.navigate([]).then(result => { window.open(environment.routingUrl+'/hospitalwiseclaimreportdetaildata'); 
    });    
  }
  //convert number to currency
convertCurrency(amount:any) {
  var formatter = new CurrencyPipe('en-US');
  amount=formatter.transform(amount, '', '');
  return amount;
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

}
