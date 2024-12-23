import { Component, OnInit } from '@angular/core';
import { UsermanualService } from '../Services/usermanual.service';
import { HttpClient } from '@angular/common/http';
import { HeaderService } from '../header.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TableUtil } from '../util/TableUtil';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { formatDate } from '@angular/common';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-usermanualdownload',
  templateUrl: './usermanualdownload.component.html',
  styleUrls: ['./usermanualdownload.component.scss']
})
export class UsermanualdownloadComponent implements OnInit {
  txtsearchDate: any;
  user: any
  showPegi: boolean;
  record: any
  currentPage: any;
  pageElement: any;
  constructor(private usermanualService: UsermanualService, public router: Router, private sessionService: SessionStorageService, private headerService: HeaderService) { }
  ngOnInit(): void {
    this.headerService.setTitle('Download User Manual');
    this.user = this.sessionService.decryptSessionData("user");
    this.pageElement = 50;
    this.currentPage = 1;
    this.getlist();
  }
  report: any = [];
  sno: any = {
    Slno: "",
    usertype: "",
    primarylinkname: "",
    descrition: "",
    cretedon: "",
  };
  heading = [['Sl#', 'Bucket Name', 'Description', 'Published On']];
  downloadReport(type: any) {
    this.report = [];
    if (type == 'excel') {
      let claim: any;
      for (var i = 0; i < this.list.length; i++) {
        claim = this.list[i];
        this.sno = [];
        this.sno.Slno = i + 1;
        this.sno.primarylinkname = claim.primary_link_name;
        this.sno.descrition = claim.remarks;
        this.sno.cretedon = claim.created_on;
        this.report.push(this.sno);
      }
      let filter1 = [];
      TableUtil.exportListToExcelWithFilterforhospitals(this.report, "Download User Manual", this.heading, filter1);
    } else if (type == 'pdf') {
      if (this.list.length == 0) {
        this.swal('', 'No Data Found', 'info');
        return;
      }
      let SlNo = 1;
      this.list.forEach(element => {
        let rowData = [];
        rowData.push(SlNo++);
        rowData.push(element.primary_link_name);
        rowData.push(element.remarks);
        rowData.push(element.created_on);
        this.report.push(rowData);
      });
      let doc = new jsPDF('l', 'mm', [238, 270]);
      doc.setFontSize(10);
      doc.text('Document Generate Date :-' + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en').toString(), 5, 5);
      doc.text('Download User Manual', 100, 10);
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
      doc.save('Download_User_Manual.pdf');
    }
  }
  list: any = [];
  getlist() {
    this.usermanualService.getlist(this.user.groupId).subscribe((data: any) => {
      this.list = data;
      this.record = this.list.length
      if (this.record > 0) {
        this.showPegi = true;
      } else {
        this.showPegi = false;
      }
    }
    );
  }
  img: any;
  downloaddoc(event: any, docname: any, type: any) {
    if (docname != null && docname != '' && docname != undefined) {
      let img = this.usermanualService.downloadFiles(docname, type);
      window.open(img, '_blank');
    } else {
      this.swal('Info', 'Please Select File', 'info');
    }
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  primarylinkid: any
  Onchangebucketname(event: any) {
    this.primarylinkid = event;
  }
  Search() {
    let primarylinkids = this.primarylinkid;
    if (primarylinkids == null || primarylinkids == undefined || primarylinkids == '') {
      this.swal('Error', 'Please Select Bucket Name ', 'error')
    } else {
      this.usermanualService.getsearchdata(this.primarylinkid).subscribe(data => {
        this.list = data
        this.record = this.list.length
        if (this.record > 0) {
          this.showPegi = true;
        } else {
          this.showPegi = false;
        }
      }
      )
    }
  }
  ResetField() {
    $('#bucket').val('')
    this.getlist();
  }
}
