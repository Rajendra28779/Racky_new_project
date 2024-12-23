import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../Services/header.service';
import { CpdreceivecountreportserviceService } from '../Services/cpdreceivecountreportservice.service';
import { TableUtil } from '../util/TableUtil';
import Swal from 'sweetalert2';
import { DatePipe, formatDate } from '@angular/common';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import { log } from 'console';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-cpdreceivedcountreportdetails',
  templateUrl: './cpdreceivedcountreportdetails.component.html',
  styleUrls: ['./cpdreceivedcountreportdetails.component.scss']
})
export class CpdreceivedcountreportdetailsComponent implements OnInit {
  txtsearchDate: any;
  List:any;
  showPegi:boolean;
  pageElement:any;
  currentPage:any;
  record:any=0;
  user: any;
  date:any
  type:any
  casetype:any
  claimlist:any;
  countclaimlist:any
  cpdList:any=[];
  name:any="ALL";
  user3:any;
  show:any=true;
  show1:any=false;
  header:any;
  value:any=[];
  data:any;
  seachType: string;
  constructor( public headerService:HeaderService,private cpdcountservice:CpdreceivecountreportserviceService,private snoService: SnocreateserviceService,private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    // this.headerService.setTitle('Global-Link');

    //  this.user3 = JSON.parse(sessionStorage.getItem("user"));
    this.user3 = this.sessionService.decryptSessionData("user");
    this.user=localStorage.getItem('User1');
    let date=localStorage.getItem('Actiondate');
    this.date = this.convertDate(date)
    this.type=localStorage.getItem('Actiontype');
    this.seachType=localStorage.getItem('SearchBy');
    this.timespan=new Date()
    this.username=this.user3.fullName
   this.getCPDList(this.user);

  //  if(this.type='TOTAL_DISHONORED'){
  //   this.casetype="Total Dishonored"
  //  }else if(this.type='TOTAL_UNPROCESSED'){
  //   this.casetype="Total UnProcessed"
  //  }

// if(this.type=='TOTAL_DISHONORED'){
//   this.show=false;
// }else{
//   this.show=true;
// }
// if(this.type=='TOTAL_UNPROCESSED'){
//   this.show1=true;
//   this.show=false;
// }else{
//   this.show1=false;
//   this.show=true;
// }

    this.cpdcountservice.cpddetails(this.user,this.convertDate1(date),this.type,this.seachType).subscribe((data:any)=>{
        this.data=data;
        console.log(data);

        if(this.data.status==200)
        {
          this.header=this.data.header;
          this.value=this.data.value;
          this.record=this.value.length;

        if(this.record>0){

          this.pageElement=100;

          this.currentPage=1;

          this.showPegi=true;

        }

      }else{
      }

    },

    (error)=>console.log(error)

    );
 }
 onPageBoundsCorrection(number: number) {

  this.currentPage = number;
}

pageItemChange() {

  this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;

  console.log(this.pageElement);
 }

pageItemChange1() {

  this.pageElement = (<HTMLInputElement>document.getElementById("pageItem1")).value;

  console.log(this.pageElement);
}

  //       // console.log(this.claimlist);
  //       // this.countclaimlist=this.claimlist.length

  //   });
  // }
  mon:any;
  year:any;
  username:any;
  timespan:any;
  report: any = [];
  sno: any = {
    Slno: '',
    Caseno: '',
    URN: '',

    Patientname: '',
    ActualDateOfAdmission:'',
    ActualDateOfDischarge:'',
    ActionDate:'',
  };
  heading = [
    [
      'Sl#',
      'Case No',
      ' URN',
      'Patient Name',
      'Actual Date Of Admission',
      'Actual Date Of Discharge',
      ' Action Date',
    ],
  ];
  heading2 = [
    [
      'Sl#',
      'Case No',
      ' URN',
      'Patient Name',
      'Actual Date Of Admission',
      'Actual Date Of Discharge'
    ],
  ];
  // fullName:any;
  downloadReport(type){
    this.report = [];
    // let claim: any;
    // for (var i = 0; i < this.claimlist.length; i++) {
    //   claim = this.claimlist[i];
    //   console.log(claim);
    //   this.sno = [];
    //   this.sno.Slno = i + 1;
    //   this.sno.Caseno = claim.caseno;
    //   this.sno.URN = claim.urn;
    //   this.sno.Patientname = claim.patientname;
    //   this.sno.ActualDateOfAdmission = (claim.actualdateofadmission) ;
    //   this.sno.ActualDateOfDischarge = (claim.actualdateofdischarge) ;
    //   if(this.show){
    //   this.sno.ActionDate = (claim.cpdactiondate) ;
    //   }
      this.report.push(this.header);
    // }
if(type=='xcl') {
      let filter =[];
      filter.push([['CPD Name:- ',this.name]]);
      filter.push([['Alloted Date:- ',this.date]]);

      filter.push([['Case Type :- ',this.type]]);
      // console.log(this.report);


        TableUtil.exportListToExcelWithFilter(
      this.value,
      'CPD  Allotment Details Report',
      this.report,filter
    );

}
else if(type=='pdf') {
    if(this.value==null || this.value.length==0) {
      this.swal("Info", "No Record Found", "info");
      return;
    }
    var doc = new jsPDF('l', 'mm',[360, 260]);
   doc.text('CPD Name : '+this.name,10,20);
   doc.text('Alloted Date :'+this.date,10,30);
   doc.text('Case Type :'+this.type,10,40);

    doc.text('Generated  By :'+this.username,10,50);
    doc.text('Generated On :'+this.convertStringToDate1(this.timespan),10,60);
    doc.setFont('helvetica', 'bold');
    doc.text("CPD  Allotment Details Report", 150, 10);
    doc.setFontSize(30);
    var rows = [];
    if(this.show){
    // for(var i=0;i<this.report.length;i++) {
    //   var clm = this.report[i];
    //   var pdf = [];
    //   pdf[0] = clm.Slno;
    //   pdf[1] = clm.Caseno;
    //   pdf[2] = clm.URN;
    //   pdf[3] = clm.Patientname;
    //   pdf[4] = clm.ActualDateOfAdmission;
    //   pdf[5] = clm.ActualDateOfDischarge;
    //   pdf[6] = clm.ActionDate;

    //   rows.push(pdf);
    // }
    console.log(rows);
        autoTable(doc, {
          head: this.report,
          body: this.value,
          theme: 'grid',
          startY: 70,
          headStyles: {
            fillColor: [26, 99, 54]
          },
          columnStyles: {
            // 0: {cellWidth: 10},
            // 1: {cellWidth: 53},
            // 2: {cellWidth: 53},
            // 3: {cellWidth: 53},
            // 4: {cellWidth: 53},
            // 5: {cellWidth: 53},
            // 6: {cellWidth: 53},
            // 7: {cellWidth: 53},
            // 8: {cellWidth: 53},
            // 9: {cellWidth: 53},

          }
        });
      }
        doc.save('CPD  Allotment Details Report.pdf');
      }
    }
    convertStringToDate1(date) {
      var datePipe = new DatePipe("en-US");
      date = datePipe.transform(date, 'dd-MMM-yyyy HH:mm:ss');
      return date;
      }
      convertDate(date) {
        var datePipe = new DatePipe("en-US");
        date = datePipe.transform(date, 'dd-MMM-yyyy ');
        return date;
      }
      convertDate1(date) {
        var datePipe = new DatePipe("en-US");
        date = datePipe.transform(date, 'yyyy-MM-dd');
        return date;
      }
      swal(title: any, text: any, icon: any) {
        Swal.fire({
          icon: icon,
          title: title,
          text: text
        });
      }

      getCPDList(user:any) {
        this.snoService.getCPDList().subscribe(
          (response) => {
            this.cpdList = response;
            for(let i=0;i<this.cpdList.length;i++){
              if(user==this.cpdList[i].userid){
                this.name=this.cpdList[i].fullName;
                break;
              }
            }
          });
        }
}
