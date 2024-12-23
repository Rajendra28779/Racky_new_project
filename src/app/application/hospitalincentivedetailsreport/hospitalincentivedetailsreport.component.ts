import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { HeaderService } from '../header.service';
import { HospitalService } from '../Services/hospital.service';
import { TableUtil } from '../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-hospitalincentivedetailsreport',
  templateUrl: './hospitalincentivedetailsreport.component.html',
  styleUrls: ['./hospitalincentivedetailsreport.component.scss']
})
export class HospitalincentivedetailsreportComponent implements OnInit {
  statecode: any;
  statename: any;
  distcode: any;
  distname: any;
  catgorycode: any;
  catgoryname: any;
  txtsearchDate:any;
  length:any=0;
  currentPage: any;
  pageElement: any;
  showPegi: boolean=false;
  public List: any = [];
  user:any;
  data:any;
  header:any;

  constructor(public headerService: HeaderService,private hospitaService: HospitalService,private sessionService: SessionStorageService
    ) { }

  ngOnInit(): void {
    this.headerService.setTitle('Hospital Incentive Report');
    this.user =this.sessionService.decryptSessionData("user");
    this.statecode=localStorage.getItem("statecode");
    this.statename=localStorage.getItem("statename");
    this.distcode=localStorage.getItem("distcode");
    this.distname=localStorage.getItem("distname");
    this.catgorycode=localStorage.getItem("catgorycode");
    this.catgoryname=localStorage.getItem("catgoryname");
    this.search();
  }

  search(){
    this.hospitaService.getincentivedetails(this.statecode,this.distcode,this.catgorycode).subscribe(data => {
      console.log(data);
      this.data=data;
      if(this.data.status==200){
        this.header=this.data.header
        this.List=this.data.vlaue
        this.length=this.List.length;
        if(this.length>0){
          this.pageElement=100;
          this.currentPage=1;
          this.showPegi=true;
        }else{
          this.showPegi=false;
        }
      }
    },
    (error) =>console.log(error)
    );
  }

  report: any = [];
  downloadReport(no:any){
    this.report.push(this.header);
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy = this.user.fullName;
    if(no==1){
      let filter =[];
      filter.push([['State Name', this.statename]]);
        filter.push([['District Name', this.distname]]);
        filter.push([['catagory Name', this.catgoryname]]);
        TableUtil.exportListToExcelWithFilter(
          this.List,
          'Hospital Incentive Details Report',
          this.report,filter
        );
    }else{
      var doc = new jsPDF('l', 'mm',[297,210 ]);
      doc.setFontSize(20);
      // doc.text(" ", 5, 5);
      doc.text("Hospital Incentive Report", 120, 15);
      doc.setFontSize(12);
      doc.text('State Name :- '+ this.statename,15,26);
      doc.text('District Name :- '+ this.distname,140,26);
      doc.text('Catagory Name :- '+ this.catgoryname,15,40);
      doc.text('GeneratedOn :- '+generatedOn,15,33);
      doc.text('GeneratedBy :- '+generatedBy,140,33);
            autoTable(doc, {
              head: this.report,
              body: this.List,
              theme: 'grid',
              startY: 45,
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
            doc.save('Hospital Incentive Report.pdf');
  }

}
// pageItemChange() {
//   this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
// }
// pageItemChange1() {
//   this.pageElement = (<HTMLInputElement>document.getElementById("pageItem1")).value;
// }
onPageBoundsCorrection(number: number) {
  this.currentPage = number;
}
}
