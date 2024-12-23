import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { SwastyaMitraHospitalService } from '../../Services/swastya-mitra-hospital.service';
import { TableUtil } from '../../util/TableUtil';
declare let $: any;


@Component({
  selector: 'app-smscoringview',
  templateUrl: './smscoringview.component.html',
  styleUrls: ['./smscoringview.component.scss']
})
export class SmscoringviewComponent implements OnInit {
  txtsearchDate: any;
  list: any = [];
  showPegi: boolean;
  currentPage: any;
  pageElement: any;
  totalcount: any = 0;
  selectedYear:any;
  years:any=[];
  month:any;
  user:any;

  constructor(public swastyaMitraHospitalService: SwastyaMitraHospitalService,
    public route: Router,
   public headerService: HeaderService,
   private snoService: SnocreateserviceService,
   private sessionService: SessionStorageService) { }

 ngOnInit(): void {
   this.headerService.setTitle("SwasthyaMitra Scoring");
   this.user = this.sessionService.decryptSessionData("user");
   this.selectedYear = new Date().getFullYear();
   for (let year = this.selectedYear; year >= 2010; year--) {
     this.years.push(year);
   }
   this.month= new Date().getMonth();
   if(this.month==0){
     this.month=12;
     this.selectedYear=this.selectedYear-1;
   };
   this.search();
 }
 swal(title: any, text: any, icon: any) {
  Swal.fire({
    icon: icon,
    title: title,
    text: text
  });
}
search() {
  this.swastyaMitraHospitalService.getsmscoreview(this.selectedYear,this.month,this.user.userId).subscribe(
    (response:any) => {
      console.log(response);
      if (response.status == 200) {
        this.list = response.data;
        this.totalcount = this.list.length;
        if (this.totalcount > 0) {
          this.showPegi = true
          this.currentPage = 1
          this.pageElement = 100
        } else {
          this.showPegi = false
        }
      } else {
        this.showPegi = false
        this.swal("Error", 'Something Went Wrong', "error");
      }
    });
}

reset(){
  window.location.reload();
}

monthNames:any = ["",
  "January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"
];
report: any = [];
sno: any = [];
heading = [["Sl#", "SM Name", "Contact No", "No Of Duty Days", "No Of Present Days", "SNA Remark",
"Score Of SNA", "DC Remark", "Score Of DC"]];
downloadList(no:any){
  this.report=[];
  let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
  let generatedBy =  this.user.fullName;
  for (let i = 0; i < this.list.length; i++) {
    let sna = this.list[i];
    this.sno = [];
    this.sno.push(i + 1);
    this.sno.push(sna.fullname);
    this.sno.push(sna.phoneNO);
    this.sno.push(sna.dutydays);
    this.sno.push(sna.presentdays);
    this.sno.push(sna.snaremark);
    this.sno.push(sna.snascore);
    this.sno.push(sna.dcremark);
    this.sno.push(sna.dcscore);
    this.report.push(this.sno);
  }
  if (no == 1) {
    let filter = [];
    filter.push([['Year', this.selectedYear]]);
    filter.push([['Month', this.monthNames[this.month]]]);
    TableUtil.exportListToExcelWithFilter(
      this.report,
      'SwasthyaMitra Scoring View',
      this.heading, filter
    );
  } else {
    if (this.report == null || this.report.length == 0) {
      this.swal("Info", "No Record Found", "info");
      return;
    }
    let doc = new jsPDF('l', 'mm', [297, 210]);
    doc.setFontSize(24);
    doc.text("SwasthyaMitra Scoring View", 60, 15);
    doc.setFontSize(16);
    doc.text('Year :- ' + this.selectedYear , 15, 25);
    doc.text('Month :- ' +this.monthNames[this.month], 15, 33);
    doc.text('GeneratedOn :- ' + generatedOn, 15, 41);
    doc.text('GeneratedBy :- ' + generatedBy, 15, 49);
    autoTable(doc, {
      head: this.heading,
      body: this.report,
      theme: 'grid',
      startY: 55,
      headStyles: {
        fillColor: [26, 99, 54]
      },
      columnStyles: {
        0: { cellWidth: 10 },
      }
    });
    doc.save('SwasthyaMitra_Scoring_View.pdf');
  }
}
}


