import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { SchedularserviceService } from '../Services/schedularservice.service';
import { TableUtil } from '../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-dbschedulerdetailsreport',
  templateUrl: './dbschedulerdetailsreport.component.html',
  styleUrls: ['./dbschedulerdetailsreport.component.scss']
})
export class DbschedulerdetailsreportComponent implements OnInit {
  txtsearchDate: any;
  record: any = 0
  date: any;
  object: any;
  procid: any;
  procname: any;
  schedularname: any;
  list: any = [];
  showPegi: boolean = false;
  currentPage: any;
  pageElement: any;
  data: any;
  header: any;
  value: any;
  user: any;

  constructor(public schedularserv: SchedularserviceService, private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.procid = localStorage.getItem("procid");
    this.procname = localStorage.getItem("procname");
    this.schedularname = localStorage.getItem("schedularname");
    this.date = localStorage.getItem("procdate");
    this.user = this.sessionService.decryptSessionData("user");
    this.schedularserv.getschedulardetailslist(this.procid, this.convertDate1(this.date)).subscribe((data: any) => {
      console.log(data);
      this.data = data;
      if (this.data.status == 200) {
        this.header = this.data.header;
        this.value = this.data.vlaue;
        this.record = this.value.length
        if (this.record > 0) {
          this.pageElement = 100;
          this.currentPage = 1;
          this.showPegi = true;
        }
      } else {

      }
    },
      (error) => console.log(error)
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

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }

  heading: any = []

  downloadReport(no: any) {
    if (this.record == 0) {
      this.swal("Info", "No Record Found", "info");
      return;
    }
    this.heading = [];
    this.heading.push(this.header);
    if (no == 1) {
      let filter = [];
      filter.push([['Execution Date', this.convertDate(this.date)]]);
      filter.push([['Schedular Name', this.schedularname]]);
      TableUtil.exportListToExcelWithFilter(
        this.value,
        'DB Schedular Report Details',
        this.heading, filter
      );
    } else {
      let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
      let generatedBy = this.user.fullName;

      var doc = new jsPDF('l', 'mm', [297, 210]);
      doc.setFontSize(22);
      // doc.text(" ", 5, 5);
      doc.text("DB Schedular Report Details", 110, 15);
      // doc.line(70, 17,145, 17)
      doc.setFontSize(12);
      doc.text('Execution Date :- ' + this.convertDate(this.date), 180, 25);
      doc.text('Schedular Name :- ' + this.schedularname, 15, 25);
      doc.text('GeneratedBy :- ' + generatedBy, 15, 35);
      doc.text('GeneratedOn :- ' + generatedOn, 180, 35);
      autoTable(doc, {
        head: this.heading,
        body: this.value,
        theme: 'grid',
        startY: 40,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },

        }
      });
      doc.save('DB Schedular Report Details.pdf');
    }
  }
  convertDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy hh:mm:ss a');
    return date;
  }
  convertDate1(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy');
    return date;
  }
}
