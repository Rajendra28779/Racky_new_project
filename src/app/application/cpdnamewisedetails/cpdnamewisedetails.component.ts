import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CpdNamewiseCountReportService } from '../Services/cpd-namewise-count-report.service';
import { HeaderService } from '../header.service';
import { TableUtil } from '../util/TableUtil';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;
@Component({
  selector: 'app-cpdnamewisedetails',
  templateUrl: './cpdnamewisedetails.component.html',
  styleUrls: ['./cpdnamewisedetails.component.scss']
})
export class CpdnamewisedetailsComponent implements OnInit {
  txtsearchDate:any;
  userid:any;
  showPegi:any;
  pageElement:any;
  currentPage:any;
  formdate:any
  todate:any
  useris:any
  user:any;
   data: any= [];
   user1:any;
   cpd:any;
   fullname:any;
   record: any;
   totalApproveCount:any;
   totalApproveCount1:any;
   totalApproveCount2:any;
   totalApproveCount3:any;
   constructor( private cpdnamewiseservice: CpdNamewiseCountReportService,
    public headerService:HeaderService,private sessionService: SessionStorageService,
    public route: Router) {
      // this.user1 = this.route.getCurrentNavigation().extras.state;
    }

  ngOnInit(): void {
    this.headerService.setTitle('CPD Name Wise Details');
    // this.user =JSON.parse(sessionStorage.getItem("user"));
    this.user = this.sessionService.decryptSessionData("user");
    this.user1=JSON.parse(localStorage.getItem("Details"));
    this.useris=this.user1.userId
    this.formdate=this.user1.formdate
    this.todate=this.user1.todate
    this.fullname=this.user1.fullname
    console.log(this.cpd)
    console.log(this.useris)
    console.log(this.formdate)
    console.log(this.todate)
this.Details(this.useris,this.formdate,this.todate);
  }
  // demo(){
  //   this.Details(this.useris,this.formdate,this.todate);
  // }
  datalength:any
  Details(useris,formdate,todate){
    console.log(useris)
    console.log(formdate)
    console.log(todate)
    this.cpdnamewiseservice.getdetails(useris,formdate,todate).subscribe(data=>{
      console.log(data)
      this.data=data

      let sum = 0;
      let sum1 = 0;
      let sum2 = 0;

      let sum3 = 0;
      for (let i = 0; i < this.data.length; i += 1) {
        sum += parseInt(this.data[i].APPROVE);
        sum1 += parseInt(this.data[i].REJECT);
        sum2 += parseInt(this.data[i].QUERY);

        sum3 += parseInt(this.data[i].total);
      }
      this.totalApproveCount = sum;
  this.totalApproveCount1 = sum1;
  this.totalApproveCount2 = sum2;

  this.totalApproveCount3 = sum3;





      this.datalength=this.data.length;
      if(this.datalength>0){
        this.showPegi=true;
        this.currentPage = 1;
      this.pageElement = 10;
      }
      else{
        this.showPegi=false;
      }
    })

  }


  pageItemChange() {

    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
    console.log(this.pageElement);

  }
  report: any = [];
  sno: any = {
    Slno: '',
    Date: '',
    Approve:'',
    Reject:'',
    Query:'',
   TotalSettlement: '',



  };
  heading = [
    [
      'Sl#',
      'Date',
      'Approve',
      'Reject',
      'Query',
      'TotalSettlement',


    ],
  ];
  downloadReport(type){
    this.report = [];
  let claim: any;

  for (var i = 0; i < this.data.length; i++) {
    claim = this.data[i];
    console.log(claim);
    this.sno = [];
    this.sno.Slno = i + 1;
    this.sno.Date = this.convertStringToDate(claim.date);
    this.sno.Approve=claim.APPROVE;
    this.sno.Reject=claim.REJECT;
    this.sno.Query=claim.QUERY;
   this.sno.TotalSettlement = claim.total;
    this.report.push(this.sno);
    console.log(this.report);
    console.log(this.sno);
  }
  this.sno = [];
  this.sno.Date = "TOTAL";
    this.sno.Approve=this.totalApproveCount;
    this.sno.Reject=this.totalApproveCount1;
    this.sno.Query=this.totalApproveCount2;
   this.sno.TotalSettlement = this.totalApproveCount3;
   this.report.push(this.sno);

  if(type=='xls') {
  TableUtil.exportListToExcel(
    this.report,
    'CPD Name Wise Details  Report',
    this.heading
  );
}
else if(type=='pdf') {
  if(this.report==null || this.report.length==0) {
    this.swal("Info", "No Record Found", "info");
    return;
  }

   var doc = new jsPDF('l', 'mm',[360, 260]);
    doc.text("CPD Name Wise Details  Report", 5, 10);
    doc.setFontSize(12);
    //doc.text('Actual Date of Discharge :- '+this.fdate +' To '+this.tdate,5,20);
    var rows = [];
    for(var i=0;i<this.report.length;i++) {
      var clm = this.report[i];
      var pdf = [];
      pdf[0] = clm.Slno;
      pdf[1] = clm.Date;
      pdf[2] = clm.Approve;
      pdf[3] = clm.Reject;
      pdf[4] = clm.Query;
      pdf[5] = clm.TotalSettlement;




      rows.push(pdf);
    }
    console.log(rows);
    autoTable(doc, {
      head: this.heading,
      body: rows,
      theme: 'grid',
      startY: 25,
      headStyles: {
        fillColor: [26, 99, 54]
      },
      columnStyles: {
        0: {cellWidth: 10},
        1: {cellWidth: 60},
        2: {cellWidth: 60},
        3: {cellWidth: 60},
        4: {cellWidth: 60},
        5: {cellWidth: 60},


      }
    });
    doc.save('Bsky_CPD_Name_Wise_Details_Report.pdf');
  }
}
convertStringToDate(date) {
  var datePipe = new DatePipe("en-US");
  date = datePipe.transform(date, 'dd-MMM-yyyy');
  return date;
  }
swal(title: any, text: any, icon: any) {
  Swal.fire({
    icon: icon,
    title: title,
    text: text,
  });

  }


}
