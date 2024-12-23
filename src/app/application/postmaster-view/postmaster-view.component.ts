import { Component, OnInit } from '@angular/core';
import { PostmasterServiceService } from '../Services/postmaster-service.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { HeaderService } from '../header.service';
import { NavigationExtras, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { formatDate } from '@angular/common';
import { TableUtil } from '../util/TableUtil';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-postmaster-view',
  templateUrl: './postmaster-view.component.html',
  styleUrls: ['./postmaster-view.component.scss']
})
export class PostmasterViewComponent implements OnInit {
  childmessage: any;
  showPegi: any;
  user: any;
  pageElement: any;
  currentPage: any;
  txtsearchDate: any;
  postlist: any;
  countpostlist:any;
  constructor(
    private route: Router,
    public headerService: HeaderService,
    private postmasterservice: PostmasterServiceService,
    private sessionService: SessionStorageService
  ) { }

  ngOnInit(): void {
    this.headerService.setTitle('Post Master View');
    this.user = this.sessionService.decryptSessionData('user');
    this.getallpostname();
    this.currentPage = 1;
    this.pageElement = 20;
    this.showPegi = true;

  }
  getallpostname() {
    // this.postmasterservice.getallpostname().subscribe((data) => {
      this.postmasterservice.getallpostname().subscribe(
        (response:any) => {
          this.postlist = response.data;
          this.countpostlist = this.postlist.length;
          if(this.countpostlist>0){
            this.showPegi=true;
            this.currentPage=1;
            this.pageElement=20;
          }else{
            this.showPegi=false;
          }
        },
        (error) => console.log(error)
      )
    //   this.postlist = data;
    //   this.countpostlist = this.postlist.length;
    // });
  }
  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  edit(item: any) {
    let navigationExtras: NavigationExtras = {
      state: {
        user: item,
      },
    };
    this.route.navigate(['application/postmasteradd'], navigationExtras);
  }
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>(
      document.getElementById('pageItem')
    )).value;
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
  report: any = [];
  sno: any = [];
  heading = [['Sl#', 'Post Name', 'Description','Created By', 'Created On', 'Status']];
  downloadReport(no: any) {
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy =  this.user.fullName;
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.postlist.length; i++) {
      sna = this.postlist[i];
      this.sno = [];
      this.sno.push(i + 1);
      this.sno.push(sna.POST_NAME);
      this.sno.push(sna.POST_DESCRIPTION);
      this.sno.push(sna.CREATED_BY);
      this.sno.push(sna.CREATEDON);
      this.sno.push(sna.STATUSFLAG);
      this.report.push(this.sno);
    }
    if (no == 1) {
      let filter = [];
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'Post Master',
        this.heading, filter
      );
    } else {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('p', 'mm', [297, 210]);
      doc.setFontSize(20);
      doc.text("Post Master", 80, 15);
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
      doc.save('Post Master.pdf');
    }
  }
}
