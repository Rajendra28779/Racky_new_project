import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SnaactiontakenlogserviceService } from './../Services/snaactiontakenlogservice.service';
import { JwtService } from 'src/app/services/jwt.service';
import { environment } from 'src/environments/environment';
import { TableUtil } from 'src/app/application/util/TableUtil';
import { MisreportService } from '../Services/misreport.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { formatDate } from '@angular/common';
import { SessionStorageService } from 'src/app/services/session-storage.service';
@Component({
  selector: 'app-cpdactionwiseperformancedetails',
  templateUrl: './cpdactionwiseperformancedetails.component.html',
  styleUrls: ['./cpdactionwiseperformancedetails.component.scss']
})
export class CpdactionwiseperformancedetailsComponent implements OnInit {
  user:any
  date:any
  type:any
  claimlist:any;
  countclaimlist:any
  serchtype: any;
  serchtypename: any;
  fdate: any;
  tdate: any;
  cpdid: any;
  cpdname: any;
  value: any;
  typename:any;
  showPegi: boolean;
currentPage: any;
pageElement: any;
txtsearchDate:any;

    constructor(private snaactionlog: SnaactiontakenlogserviceService,private route:Router,private jwtService: JwtService,private misservice:MisreportService,private sessionService: SessionStorageService) {

     }

  ngOnInit(): void {
    this.user=localStorage.getItem('userid');
    this.serchtype=localStorage.getItem('serchtype');
    this.fdate=localStorage.getItem('fromdate');
    this.tdate=localStorage.getItem('todate');
    this.type=localStorage.getItem('actiontype');
    this.cpdid=localStorage.getItem('cpdid');
    this.cpdname=localStorage.getItem('cpdname');
    this.value=localStorage.getItem('totalvalue');
    this.typename=this.gettypename(this.type);
    if(this.serchtype==1){
      this.serchtypename="Actual Date Of Discharge"
    }else{
      this.serchtypename="Alloted Date";
    }
    this.getdetails();
  }

  gettypename(no:any){
      if(no==1){
        return "SNA Approved";
      }else if(no==2){
        return "SNA Rejected";
      }else if(no==3){
        return "SNA Query";
      }else if(no==4){
        return "SNA Hold";
      }else if(no==5){
        return "SNA Investigate";
      }else if(no==6){
        return "SNA Revert";
      }else if(no==7){
        return "SNA Approved";
      }else if(no==8){
        return "SNA Rejected";
      }else if(no==9){
        return "SNA Query";
      }else if(no==10){
        return "SNA Hold";
      }else if(no==11){
        return "SNA Investigate";
      }else if(no==12){
        return "SNA Revert";
      }else {
        return "Count";
      }

  }


  getdetails(){
    this.misservice.getcpdwiseperformacedetails(this.user,this.cpdid,this.fdate,this.tdate,this.serchtype,this.type).subscribe((data:any)=>{
      this.claimlist=data;
      console.log(this.claimlist);
      this.countclaimlist=this.claimlist.length
      if(this.countclaimlist>0){
        this.showPegi=true;
        this.currentPage=1;
        this.pageElement=100;
      }else{
        this.showPegi=false
      }
    },
    (error) => console.log(error)
    );
  }

  report: any = [];
  claimlistreport: any = {
    slno:"",
    claimNo:"",
    URN:"",
    Patientname:"",
    packagename:"",
    packagecode:"",
    dateofaddmission:"",
    dateofdischarge:"",
    alloteddate:"",
    claimamount:"",
    cpdapprovedamount:"",
    snaapprovedamount:"",
    cpdactiontype:"",
    snaactiontype:"",
    cpdactiondate:"",
    snaactiondate:""
  };

  heading = [
    [
      'Sl#',
      'Claim No',
      'URN',
      'Patient Name',
      'Package Code ',
      'Package name',
      'Actual Date Of Admission',
      'Actual Date Of Discharge',
      'Alloted Date',
      'Claim amount',
      'CPD Approved Amount',
      'SNA Approved Amount',
      'CPD Action Type',
      'SNA Action Type',
      'CPD Action Date',
      'SNA Action Date',
    ],
  ];
  downloadReport(no:any){
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.claimlist.length; i++) {
      sna=this.claimlist[i];
      this.claimlistreport=[];
      this.claimlistreport.slno=i+1;
      this.claimlistreport.claimNo=sna.claimNo
      this.claimlistreport.URN=sna.urn
      this.claimlistreport.Patientname=sna.patentname
      this.claimlistreport.packagecode=sna.packagecode
      this.claimlistreport.packagename=sna.packageName
      this.claimlistreport.dateofaddmission=sna.actDateOfAdm
      this.claimlistreport.dateofdischarge=sna.actDateOfDschrg
      this.claimlistreport.alloteddate=sna.cpdAllotedDate
      this.claimlistreport.claimamount=sna.claimamount
      this.claimlistreport.cpdapprovedamount=sna.cpdapproveamount
      this.claimlistreport.snaapprovedamount=sna.snaapproveamount
      this.claimlistreport.cpdactiontype=sna.cpdactiontye
      this.claimlistreport.snaactiontype=sna.snaactiontype
      this.claimlistreport.cpdactiondate=sna.cpdactiondate
      this.claimlistreport.snaactiondate=sna.snaactiondate

  this.report.push(this.claimlistreport);

    }
    let filter =[];

if(no==1){
  let filter =[];
      filter.push([['Search By :- ', this.serchtypename]]);
        filter.push([[ 'From',this.fdate  ,'TO',this.tdate]]);
        filter.push([['CPD Name', this.cpdname]]);
        filter.push([[this.value]]);
        filter.push([[this.typename, this.countclaimlist]]);
        TableUtil.exportListToExcelWithFilter(
          this.report,
          'CPD Action Wise Performance Report Details',
          this.heading,filter
        );
}else{
  if(this.report==null || this.report.length==0) {
    this.swal("Info", "No Record Found", "info");
    return;
  }
  let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy =this.sessionService.decryptSessionData("user").fullName;

  var doc = new jsPDF('l', 'mm',[420,290 ]);
  doc.setFontSize(28);
  // doc.text(" ", 5, 5);
  doc.text("CPD Action Wise Performance Report Details", 90, 18);
  doc. line(90, 22,290,22);
  doc.setFontSize(15);
  doc.text('Search By :- '+ this.serchtypename,10,35);
  doc.text( 'From :- '+this.fdate +' TO :- '+this.tdate,120,35);
  doc.text( this.value,220,35);
  doc.text( this.typename+' :- ' +this.countclaimlist,310,35);
  doc.text('CPD Name :- '+this.cpdname,120,45);
  doc.text('GeneratedOn :- '+generatedOn,10,45);
  doc.text('GeneratedBy :- '+generatedBy,270,45);
        var rows = [];
        for(var i=0;i<this.report.length;i++) {
          var clm = this.report[i];
          var pdf = [];
          pdf[0] = clm.slno;
          pdf[1] = clm.claimNo;
          pdf[2] = clm.URN;
          pdf[3] = clm.Patientname;
          pdf[4] = clm.packagecode;
          pdf[5] = clm.packagename;
          pdf[6] = clm.dateofaddmission;
          pdf[7] = clm.dateofdischarge;
          pdf[8] = clm.alloteddate;
          pdf[9] = clm.claimamount;
          pdf[10] = clm.cpdapprovedamount;
          pdf[11] = clm.snaapprovedamount;
          pdf[12] = clm.cpdactiontype;
          pdf[13] = clm.snaactiontype;
          pdf[14] = clm.cpdactiondate;
          pdf[15] = clm.snaactiondate;
          rows.push(pdf);
        }
        autoTable(doc, {
          head: this.heading,
          body: rows,
          theme: 'grid',
          startY: 55,
          headStyles: {
            fillColor: [26, 99, 54]
          },
          columnStyles: {
            0: {cellWidth: 10},
            // 1: {cellWidth: 42},
            // 2: {cellWidth: 42},
            // 3: {cellWidth: 42},
            // 4: {cellWidth: 42},

          }
        });
        // alert("hi");
        doc.save('CPD Action Wise Performance Report Details.pdf');

    }

  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }

  // onPageBoundsCorrection(number: number) {
  //   this.currentPage = number;
  // }

  // pageItemChange() {
  //   this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  //   console.log(this.pageElement);

  //  }


}
