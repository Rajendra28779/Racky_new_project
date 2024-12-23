import { Component, OnInit, ViewChild } from '@angular/core';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import { HeaderService } from '../header.service';
import { CpdwisemaximumminimumlimitService } from '../Services/cpdwisemaximumminimumlimit.service';
import { TableUtil } from '../util/TableUtil';
import Swal from 'sweetalert2';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { DatePipe, formatDate } from '@angular/common';
import { NavigationExtras, Router } from '@angular/router';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-viewcpdwisemaximumminimumlimit',
  templateUrl: './viewcpdwisemaximumminimumlimit.component.html',
  styleUrls: ['./viewcpdwisemaximumminimumlimit.component.scss']
})
export class ViewcpdwisemaximumminimumlimitComponent implements OnInit {
  txtsearchDate: any;
  public cpdList: any = [];
  data: any = [];
  cpdId: any = '';
  keyword: any = 'fullName';
  user: any;
  @ViewChild('auto') auto;
  constructor(private snoService: SnocreateserviceService, public headerService: HeaderService, 
    private cpdwisemaximumminimumlimitService: CpdwisemaximumminimumlimitService,private route: Router, private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle('Cpd wise Maximum And Minimum Limit Set');
    this.user = this.sessionService.decryptSessionData("user");
    this.currentPage = 1;
    this.pageElement = 100;
    this.getCPDList();
    this.ongetdetails();
  }
  report: any = [];
  sno: any = {
    Slno: "",
    CPDDoctorName: "",
    maxlimit: "",
    assigneduptodate: "",
  };
  heading = [['Sl#', 'CPD Doctor Name', 'Maximum Limit', 'Asigned Up To']];
  downloadList(type: any) {
    this.report = [];
    if (type == 'excel') {
      let claim: any;
      for (var i = 0; i < this.data.length; i++) {
        claim = this.data[i];
        this.sno = [];
        this.sno.Slno = i + 1;
        this.sno.CPDDoctorName = claim.fullname;
        this.sno.maxlimit = claim.maxlimt;
        if(claim.assignedupto==null || claim.assignedupto == undefined || claim.assignedupto == ''){
          this.sno.assigneduptodate = claim.assignedupto != null ? claim.assignedupto :"N/A";
        }else{
          this.sno.assigneduptodate = this.Dateconvert(claim.assignedupto);
        }
        this.report.push(this.sno);
      }
      let filter1 = [];
      TableUtil.exportListToExcelWithFilterforadmin(this.report, "Cpd wise Maximum And Minimum Limit Set", this.heading,filter1);
    } else if (type == 'pdf') {
      if (this.data.length == 0) {
        this.swal('', 'No Data Found', 'info');
        return;
      }
      let SlNo = 1;
      this.data.forEach(element => {
        let rowData = [];
        rowData.push(SlNo);
        rowData.push(element.fullname);
        rowData.push(element.maxlimt);
        if(element.assignedupto==null || element.assignedupto == undefined || element.assignedupto == ''){
          rowData.push('N/A');
        }
        rowData.push(this.Dateconvert(element.assignedupto));
        this.report.push(rowData);
        SlNo++;
      });
      let doc = new jsPDF('l', 'mm', [238, 270]);
      doc.setFontSize(10);
      doc.text('Authority Name :-' + this.user.fullName, 5, 5);
      doc.text('Document Generate Date :-' + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en').toString(), 5, 10);
      doc.text('Cpd wise Maximum And Minimum Limit Set',100,20);
      doc.setLineWidth(0.7);
      doc.line(100, 21, 168, 21);
      autoTable(doc, {
        head: this.heading, body: this.report, startY: 23, theme: 'grid',
        styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
        bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
        columnStyles: {
          0: { cellWidth: 20},
        }
      })
      doc.save('Cpd_wise_Maximum_And_Minimum_Limit_Set.pdf');
    }
  }
  resetTable() {
    this.currentPage = 1;
    this.pageElement = 100;  
    this.auto.clear();
    this.cpdId = '';
    this.ongetdetails();
  }
  getCPDList() {
    this.snoService.getCPDList().subscribe(
      (response) => {
        this.cpdList = response;
      },
      (error) => console.log(error)
    )
  }
  selectEvent(item) {
    this.cpdId = item.bskyUserId;
  }
  clearEvent() {
    this.cpdId = '';
  }
  record: any;
  showPegi: boolean;
  ongetdetails() {
    this.cpdId = this.cpdId;
    if (this.cpdId == '' || this.cpdId == undefined || this.cpdId == null) {
      this.cpdId = '';
    }
    this.cpdwisemaximumminimumlimitService.viewsetMinimumMaximumLimit(this.cpdId).subscribe(
      (response) => {
        this.data = response;
        this.record = this.data.length;
        if (this.record > 0) {
          this.showPegi = true;
        }
        else {
          this.showPegi = false;
        }
      }
    )
  }
  currentPage: any;
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
  pageElement: any;
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  edit(item: any) {
    let objToSend: NavigationExtras = {
      state: {
        cpduserid: item
      }
    };
    this.route.navigate(['/application/cpdwisemaximumandminimumlimitset'], objToSend);
  }
  Dateconvert(date) {
    var datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'dd-MMM-yyyy');
  }
}
