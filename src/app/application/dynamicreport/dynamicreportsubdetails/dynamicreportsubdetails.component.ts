import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicreportService } from '../../Services/dynamicreport.service';
import { HeaderService } from '../../header.service';
import { TableUtil } from '../../util/TableUtil';
import { CurrencyPipe, formatDate } from '@angular/common';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-dynamicreportsubdetails',
  templateUrl: './dynamicreportsubdetails.component.html',
  styleUrls: ['./dynamicreportsubdetails.component.scss']
})
export class DynamicreportsubdetailsComponent implements OnInit {
  user: any;
  flag: any;
  fromdate: any;
  report: any;
  todate: any;
  result: any;
  list: any = [];
  header: any = [];
  showPegi: boolean;
  currentPage: any;
  pageElement: any;
  totalcount: any = 0;
  txtsearchDate: any;
  childmessage: any;

  constructor(public route: Router,
    private service: DynamicreportService,
    public headerService: HeaderService,private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
    this.headerService.setTitle('ME Trigger Details');
    this.user = this.sessionService.decryptSessionData("user");
    this.flag = localStorage.getItem("flag");
    this.report = localStorage.getItem("report");
    this.fromdate = localStorage.getItem("fromdate");
    this.todate = localStorage.getItem("todate");
    let currpage=localStorage.getItem('currpage1');
    this.currentPage = currpage
    let pageelement=localStorage.getItem('pageelement1');
    this.pageElement = pageelement
    this.getlist();
  }
  getlist() {
        this.service.getdynamicreportsubdetails(this.flag, this.report, this.fromdate, this.todate).subscribe((data: any) => {
        if(data.status==200){
            this.header=data.heading;
            this.list = data.data
            this.totalcount = this.list.length;
            if (this.totalcount > 0) {
              this.showPegi = true
              // this.pageElement = 100
            } else {
              this.showPegi = false
            }
        }else{
          this.swal("Error","Something Went Wrong","error")
        }
        });
  }

  getResponseFromUtil(parentData: any) {
    this.route.navigate(['/application/mandereport']);
  }

  onAction(val: any) {
    localStorage.setItem('currpage1', this.currentPage);
    localStorage.setItem('pageelement1',this.pageElement);
    localStorage.setItem('currpage', "1");
    localStorage.setItem('pageelement', "40");
    localStorage.setItem("report", this.report);
    localStorage.setItem("fromdate", this.fromdate);
    localStorage.setItem("todate", this.todate);
    localStorage.setItem("flag", this.flag);
    localStorage.setItem("val", val);
    this.route.navigate(['/application/mereportdetails']);
  }

  downloadList(no: any) {
    let report=[];
    let header=[];
    header.push(this.header)
    for (let i = 0; i < this.list.length; i++) {
      report.push(this.list[i].data);
    }

    if (no == 1) {
      let filter = [];
      filter.push([['Actual Date of Discharge From', this.fromdate]]);
      filter.push([['Actual Date of Discharge To', this.todate]]);
      filter.push([['Report Name', this.report]]);
      TableUtil.exportListToExcelWithFilter(report, 'ME Trigger Report Sub Details', header, filter);
    } else {
      let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
      let generatedBy = this.user.fullName;
      if (report == null || report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      let doc = new jsPDF('p', 'mm', [210, 290]);
      doc.setFontSize(20);
      doc.text("ME Trigger Report Sub Details", 70, 10);
      doc.setFontSize(11);
      doc.text('Actual Date of Discharge From:- ' + this.fromdate, 10, 20);
      doc.text('Actual Date of Discharge To:- ' + this.todate, 120, 20);
      doc.text('Report Name:- ' + this.report, 10, 30);
      doc.text('GeneratedOn :- ' + generatedOn, 120, 40);
      doc.text('GeneratedBy :- ' + generatedBy, 10, 40);
      autoTable(doc, {
        head: header,
        body: report,
        theme: 'grid',
        startY: 45,
        styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
        bodyStyles: { overflow: 'linebreak', cellWidth: 'wrap', lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: { overflow: 'linebreak', cellWidth: 'wrap', lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },

        columnStyles: {
          0: { cellWidth: 10 },
        },
      });
      doc.save('ME Trigger Report Sub Details.pdf');
    }
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }

  convertCurrency(amount: any) {
    let formatter = new CurrencyPipe('en-US');
    amount = formatter.transform(amount, '', '');
    return amount;
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

  downloadexcel(){
    if(this.list.length==0){
      this.swal("Info", "No Record Found", "info");
      return;
    }
    let report=[];
    let header=[];
    this.service.getdynamicreportforexceldoenload(this.flag, this.fromdate, this.todate).subscribe((data: any) => {
      if(data.status==200){
        header.push(data.heading);
        report = data.data;
        let filter = [];
        filter.push([['Actual Date of Discharge From', this.fromdate]]);
        filter.push([['Actual Date of Discharge To', this.todate]]);
        filter.push([['Report Name', this.report]]);
        TableUtil.exportListToExcelWithFilter(report, 'ME Trigger Report Details', header, filter);
      }else{
        this.swal("Error","Something Went Wrong","error")
      }
    });
  }
}

