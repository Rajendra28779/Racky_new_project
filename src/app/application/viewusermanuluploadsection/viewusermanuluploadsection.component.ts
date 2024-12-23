import { Component, OnInit } from '@angular/core';
import { UsermanualService } from '../Services/usermanual.service';
import { NavigationExtras, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HeaderService } from '../header.service';
import { TableUtil } from '../util/TableUtil';
import jsPDF from 'jspdf';
import { formatDate } from '@angular/common';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-viewusermanuluploadsection',
  templateUrl: './viewusermanuluploadsection.component.html',
  styleUrls: ['./viewusermanuluploadsection.component.scss']
})
export class ViewusermanuluploadsectionComponent implements OnInit {
  txtsearchDate: any;
  currentPage: any;
  pageElement: any;
  user: any;
  record: any;
  showPegi: boolean;
  constructor(private usermanualService: UsermanualService, public router: Router, private http: HttpClient,
     private headerService: HeaderService,
     private sessionService: SessionStorageService) { }
  ngOnInit(): void {
    this.headerService.setTitle('View User Manual Upload Section');
    //this.user = JSON.parse(sessionStorage.getItem("user"));
    this.user = this.sessionService.decryptSessionData("user");
    this.currentPage = 1;
    this.pageElement = 50;
    this.getallviewdetails();
  }
  details: any = [];
  getallviewdetails() {
    this.usermanualService.getallviewdetails(this.user.userId).subscribe((data: any) => {
      this.details = data;
      this.record = this.details.length;
      if (this.record > 0) {
        this.showPegi = true;
      } else {
        this.showPegi = false;
      }
    }
    )
  }
  report: any = [];
  sno: any = {
    Slno: "",
    usertype: "",
    primarylinkname: "",
    descrition: "",
    cretedby: "",
    cretedon: "",
  };
  heading = [['Sl#', 'User Type', 'Bucket Name', 'Description', 'Published By', 'Published On']];
  downloadReport(type: any) {
    this.report = [];
    if (type == 'excel') {
      let claim: any;
      for (var i = 0; i < this.details.length; i++) {
        claim = this.details[i];
        this.sno = [];
        this.sno.Slno = i + 1;
        this.sno.usertype = claim.user_type_name;
        this.sno.primarylinkname = claim.primary_link_name;
        this.sno.descrition = claim.remarks;
        this.sno.cretedby = claim.full_name;
        this.sno.cretedon = claim.created_on;
        this.report.push(this.sno);
      }
      let filter1 = [];
      TableUtil.exportListToExcelWithFilterforhospitals(this.report, "View User Manual Upload Section", this.heading, filter1);
    } else if (type == 'pdf') {
      if (this.details.length == 0) {
        this.swal('', 'No Data Found', 'info');
        return;
      }
      let SlNo = 1;
      this.details.forEach(element => {
        let rowData = [];
        rowData.push(SlNo++);
        rowData.push(element.user_type_name);
        rowData.push(element.primary_link_name);
        rowData.push(element.remarks);
        rowData.push(element.full_name);
        rowData.push(element.created_on);
        this.report.push(rowData);
      });
      let doc = new jsPDF('l', 'mm', [238, 270]);
      doc.setFontSize(10);
      doc.text('Document Generate Date :-' + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en').toString(), 5, 5);
      doc.text('View User Manual Upload Section', 100, 10);
      doc.setLineWidth(0.7);
      doc.line(100, 12, 156, 12);
      autoTable(doc, {
        head: this.heading, body: this.report, startY: 12, theme: 'grid',
        styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
        bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 30 },
          2: { cellWidth: 30 },
          3: { cellWidth: 50 },
          4: { cellWidth: 30 },
          5: { cellWidth: 30 },
        }
      })
      doc.save('View_User_Manual_Upload_Section.pdf');
    }
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
  downloaddoc(event: any, docname: any, type: any) {
    let target = event.target;
    if (
      target.nodeName == 'A' ||
      target.nodeName == 'a' ||
      target.nodeName == 'IMG' ||
      target.nodeName == 'img' ||
      target.nodeName == 'I' ||
      target.nodeName == 'i' ||
      target.nodeName == 'SPAN' ||
      target.nodeName == 'span'
    ) {
      target = $(target);
      let anchor = target.parent();
      anchor = anchor.get(0);
      if (docname != null) {
        let img = this.usermanualService.downloadFiles(docname, type);
        window.open(img, '_blank');
      }
    }
  }
  edit(user_type_id: any, primary_link_id: any, remarks: any, user_manual_id: any, user_type_name: any, primary_link_name) {
    let navigationExtras: NavigationExtras = {
      state: {
        user_type_id: user_type_id,
        primary_link_id: primary_link_id,
        remarks: remarks,
        user_manual_id: user_manual_id,
        user_type_name: user_type_name,
        primary_link_name: primary_link_name,
        type: 'edit'
      }
    };
    this.router.navigate(['application/usermanualuploadesction'], navigationExtras);
  }
}

