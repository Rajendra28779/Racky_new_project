import { Component, OnInit } from '@angular/core';
import { CallCenterExecutiveService } from '../../Services/call-center-executive.service';
import { HeaderService } from '../../header.service';
import { Router } from '@angular/router';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { TableUtil } from '../../util/TableUtil';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cce-report-total-connected',
  templateUrl: './cce-report-total-connected.component.html',
  styleUrls: ['./cce-report-total-connected.component.scss']
})
export class CceReportTotalConnectedComponent implements OnInit {
  txtsearchDate:any;
  showPegi:any;
  pageElement:any;
  currentPage:any;
  show=0;
  totalConnected:any;
  countfloate: any;
  formdate: string;
  todate: string;
  type: string;
  hospitalCode: string;
  user1:any;
  action:any;
  constructor(private route:Router,public headerService:HeaderService
    , private callCenterExecutiveService: CallCenterExecutiveService) {
      this.user1 = this.route.getCurrentNavigation().extras.state;
     }

  ngOnInit(): void {
    this.headerService.setTitle('Total Connected Question');
   if(this.user1!=undefined){
     this.formdate=this.user1.fdate;
    this.todate=this.user1.tdate;
    this.type=this.user1.userid;
    this.hospitalCode=this.user1.hcode;
   }
   this.action='B';
    

    this.callCenterExecutiveService.getalltotalconnectedDetails(this.formdate,this.todate,this.type,this.hospitalCode,this.action).subscribe((data:any)=>{
      console.log(data);
      this.totalConnected=data
      this.countfloate=this.totalConnected?.length;
      if(this.countfloate>0){
        this.currentPage = 1;
        this.pageElement = 10;
        this.showPegi=true;
      }else {
        this.showPegi = false;
      }
    
    })
   
  }
  report: any = [];
  totalConnectedList: any = {
  slNo: "",
  question1: "",
  question1n:'',
  question2: "",
  question2n: "",
  question3: "",
  question3n: "",
  question4: "",
  question4n: "",
};

heading = [['Sl No.', 'Question1', '', 'Question2', '', 'Question3', '', 'Question4']];
subheading = [['', 'Yes', 'No', 'Yes', 'No', 'Yes', 'No','Yes', 'No',]];

  downloadReport(type:any){
    this.report = [];
    let item: any;
    for (var i = 0; i < this.totalConnected?.length; i++) {
      item = this.totalConnected[i];
      this.totalConnectedList = [];
      this.totalConnectedList.slNo = i + 1;
      this.totalConnectedList.question1 = item.question1;
      this.totalConnectedList.question1n = item.question1n;
      this.totalConnectedList.question2 = item.question2;
      this.totalConnectedList.question2n = item.question2n;
      this.totalConnectedList.question3 = item.question3;
      this.totalConnectedList.question3n = item.question3n;
      this.totalConnectedList.question4 = item.question4;
      this.totalConnectedList.question4n = item.question4n;
      this.totalConnectedList.date = item.date;
      this.report.push(this.totalConnectedList);
    }
    if(type=='excel'){
       TableUtil.exportcceListToExcel(this.report, "Hospital Details Report", this.heading,this.subheading);
       //TableUtil.exportListToExcel(this.report, "Hospital Details Report", this.subheading);
          }else if(type=='pdf'){
      if(this.report==null || this.report.length==0){
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc=new jsPDF('l','mm',[360,260]);
      doc.text("Cce Report List",14,20);
      doc.setFontSize(8);
      var rows = [];
      for(var i=0;i<this.report.length;i++){
        var clm=this.report[i];
        var pdf=[];
        pdf[0]=clm.slNo;
        pdf[1]=clm.question1;
        pdf[2]=clm.question1n;
        pdf[3]=clm.question2;
        pdf[4]=clm.question2n;
        pdf[5]=clm.question3;
        pdf[6]=clm.question3n;
        pdf[7]=clm.question4;
        pdf[8]=clm.question4n;
       // pdf[5]=clm.date;
       rows.push(pdf);
      }
      console.log(rows);
      let heading1 = [['Sl No.', 'Question1', '', 'Question2', '', 'Question3', '', 'Question4',''],['', 'Yes', 'No', 'Yes', 'No', 'Yes', 'No','Yes', 'No']];
      autoTable(doc,{
        head:heading1,
        body:rows,
        theme:'grid',
        startY: 25,
        headStyles:{
          fillColor:[26,99,54]
        },
        columnStyles:{
          0:{cellWidth:10},
          1:{cellWidth:30},
          2:{cellWidth:30},
          3:{cellWidth:25},
          4:{cellWidth:30},
          5:{cellWidth:30},
          6:{cellWidth:30},
          7:{cellWidth:30},
          8:{cellWidth:30},
          //5:{cellWidth:25},
        }
      });
      doc.save('Cce Out Bound Call Report.pdf');
      
    }

  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
 
}
