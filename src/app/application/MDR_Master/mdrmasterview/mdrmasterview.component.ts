import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { ForemarkService } from '../../Services/foremark.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { formatDate } from '@angular/common';
import { TableUtil } from '../../util/TableUtil';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-mdrmasterview',
  templateUrl: './mdrmasterview.component.html',
  styleUrls: ['./mdrmasterview.component.scss']
})
export class MdrmasterviewComponent implements OnInit {
  childmessage: any;
  txtsearchDate:any;
  showPegi:any=false;
  pageElement:any;
  currentPage:any;
  list:any
  user: any;
  dataa: any;
  countgllist: any;
  constructor(private route:Router,public headerService:HeaderService,
    public foremarkservice:ForemarkService, private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle('MDR Document Master');
    this.user = this.sessionService.decryptSessionData("user");
    this.getallgloballink();
  }

  getallgloballink(){
    this.foremarkservice.getalldocumentlist().subscribe((data:any)=>{
      if(data.status==200){
        this.list=data.data;
        this.countgllist=this.list.length
          if(this.countgllist>0){
            this.currentPage = 1;
            this.pageElement = 50;
            this.showPegi=true;
          }else{
            this.showPegi=false;
          }
        }else{
          this.swal('Error','Something Went Wrong','error')
        }
    });
  }

  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  edit(item:any){
    let navigationExtras: NavigationExtras = {
      state: {
        user: item
      }
    };
    this.route.navigate(['application/mdrdocumentmaster'], navigationExtras);
  }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

  report: any = [];
  sno: any = [];
  heading = [['Sl#', 'Document Name', 'Created By', 'Created On', 'Status']];
  downloadReport(no: any) {
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy =  this.user.fullName;
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.list.length; i++) {
      sna = this.list[i];
      this.sno = [];
      this.sno.push(i + 1);
      this.sno.push(sna.documentname);
      this.sno.push(sna.createbyname);
      this.sno.push(sna.createtime);
      this.sno.push(sna.statusflag == 0 ? "Active" : "In-Active");
      this.report.push(this.sno);
    }
    if (no == 1) {
      let filter = [];
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'MDR Document Master',
        this.heading, filter
      );
    } else {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('p', 'mm', [297, 210]);
      doc.setFontSize(20);
      doc.text("MDR Document Master", 80, 15);
      doc.setFontSize(13);
      doc.text('GeneratedOn :- ' + generatedOn, 15, 25);
      doc.text('GeneratedBy :- ' + generatedBy, 15, 33);
      autoTable(doc, {
        head: this.heading,
        body: this.report,
        theme: 'grid',
        startY: 40,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },
        }
      });
      doc.save('MDR Document Master.pdf');
    }
  }


}
