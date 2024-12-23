import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { PaymentfreezeserviceService } from '../../Services/paymentfreezeservice.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { TableUtil } from '../../util/TableUtil';
import { DatePipe } from '@angular/common';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-float-report',
  templateUrl: './float-report.component.html',
  styleUrls: ['./float-report.component.scss'],
})
export class FloatReportComponent implements OnInit {
  user: any;
  floatNumber: any;
  summary: any;
  childmessage: any;
  snoName: any;
  createdByName: any;
  snahold: any;
  snactionofhold: any;
  holdpercentage: any;
  constructor(
    private sessionService: SessionStorageService,
    public headerService: HeaderService,
    public paymentfreezeService: PaymentfreezeserviceService,
    public route: Router,
    private jwtService: JwtService
  ) {}

  ngOnInit(): void {
    this.headerService.setTitle('Float Count Report');
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
    this.user = this.sessionService.decryptSessionData('user');
    this.floatNumber = this.sessionService.decryptSessionData('floatNumber');
    this.createdByName = this.sessionService.decryptSessionData('fullname');
    this.snoName = this.sessionService.decryptSessionData('snaName');
    this.getSummary();
  }
  selectedItem: any;
  getSummary() {
    this.summary = '';
    if(this.levelId == null || this.levelId == "" || this.levelId == undefined){
      this.levelId = 0;
    }
    this.paymentfreezeService
      .getCountDetailsByFloatNo(this.floatNumber,this.levelId)
      .subscribe(
        (data) => {
          this.summary = data;
          console.log(data);
          // this.levelList = [2,1]
          let levelIds = this.summary.maxLevelId;
          for (let i = levelIds; i >= 1; i--) {
            this.levelList.push(i);
          }
          if(this.levelId == null || this.levelId == "" || this.levelId == undefined){
            this.selectedItem = this.levelList[0]
          }else{
            this.selectedItem = this.levelId;
          }
          if (this.summary > 0) {
            this.snahold = this.summary.snaholds;
            this.snactionofhold = this.summary.snaactionofhold;
            this.holdpercentage =
              (Number(this.snahold) / Number(this.snactionofhold)) * 100;
            console.log(this.holdpercentage);
          } else {
            this.holdpercentage = 0;
          }
        },
        (error) => {
          console.log(error);
          this.swal('Error', 'Something went wrong.', 'error');
          this.summary = '';
        }
      );
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }

  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }
  downloadActionFloatfile(
    event: any,
    filename: any,
    floatNumber: any,
    floatid: any
  ) {
    let currentYear = new Date().getFullYear();
    let target = event.target;
    if (
      target.nodeName == 'A' ||
      target.nodeName == 'a' ||
      target.nodeName == 'IMG' ||
      target.nodeName == 'img' ||
      target.nodeName == 'I' ||
      target.nodeName == 'i'
    ) {
      target = $(target);
      let anchor = target.parent();
      anchor = anchor.get(0);
      if (filename != null) {
        this.paymentfreezeService
          .downloadFilesforfloat(filename, floatNumber, currentYear)
          .subscribe(
            (response: any) => {
              var result = response;
              let blob = new Blob([result], { type: result.type });
              let url = window.URL.createObjectURL(blob);
              window.open(url);
            },
            (error) => {}
          );
      }
    }
  }

  report: any = [];
  heading = [['Summery', 'Count']];
  heading1=[['Cases To Be Paid', 'Total Cases','Amount']]
  downloadReport(fileType) {
    let alldata = [
      // 1. Summary Details -
      { name: 'Total Discharged', value: this.summary.totalDischarge },
      { name: 'Total Claim Raised', value: this.summary?.totalclaimrasied },
      { name: 'Non-Uploading Cases', value: this.summary?.nonUploadingCases },
      { name: 'Total Count of Float Generated', value: this.summary?.totalFloatGenerated },
      { name: 'Total Count of Float Not Generated', value: this.summary?.totalFloatNotGenerated },
      // 2. Float Details at CPD Level
      { name: 'CPD Approved Cases', value: this.summary?.tcpdApproved },
      { name: 'CPD Rejected Cases', value: this.summary?.cpdrejection },
      { name: 'CPD query non compliance cases', value: this.summary?.cpdNonCompliance },
      { name: 'CPD Unprocessed Cases', value: this.summary?.cpdPendingCases },
      // 3. Float Details at SNA Level
      { name: 'SNA approved', value: this.summary?.snaapproved },
      { name: 'SNA-Bulk approved', value: this.summary?.bulkapproved },
      { name: 'SNA Rejected', value: this.summary?.snarejected },
      { name: 'SNA query cases pending at Hospital', value: this.summary?.snaQuery },
      { name: 'SNA investigation cases pending at DC', value: this.summary?.snaInvestigate },
      { name: 'System rejected (Non Compliance of SNA query)', value: this.summary?.systemRejected },
      { name: 'Cases Hold by SNA', value: this.summary?.snaholds },
      // 4. Settlement of CPD Approved Cases by SNA
      { name: 'Total CPD approve cases', value: this.summary?.tcpdApproved },
      { name: 'Settlement of CPD Approved (Approved & Rejected)', value: this.summary?.snaActionOfCpdAprvd },
      { name: 'Settlement Percentage (Approved & Rejected)', value: this.summary?.percent1!=null?this.summary?.percent1:0 +"%" },
      // 5. Mortality Review
      { name: 'Mortality', value: this.summary?.mortality },
      { name: 'Mortality Review By SNA Doctor', value: this.summary?.smortality },
      { name: 'Percentage Of Mortality Review By SNA Doctor', value: this.summary?.percent2!=null?this.summary?.percent2:0 +"%" },
      // 6. Settlement of CPD Rejected
      { name: 'Total Claims Rejected By CPD', value: this.summary?.cpdrejection },
      { name: 'Claims Reviewed by SNA', value: this.summary?.cpdrejectionofsnaaction },
      { name: 'Percentage of Review', value: this.summary?.percentofreview!=null?this.summary?.percentofreview:0 +"%" },
      // 7. Freeze Status
      { name: 'Payment Freeze Claims', value: this.summary?.paymentFreezed },
      { name: 'Payment Not Freeze Claims', value: this.summary?.paymentUnfreezed },

      { name: 'Description', value: this.summary?.description },

      // { name: 'Total Claims Hold By SNA', value: this.summary?.snaholds },
      // { name: 'Claims Reviewed by SNA', value: this.summary?.snaactionofhold },
      // { name: 'Percentage of Review', value: this.holdpercentage },
    ];

    let totaldata = [
      { name: 'SNA Approved', count:this.summary?.snaapproved ,value: this.summary?.snoamount },
      { name: 'Unaudited CPD Claims', count:this.summary?.bulkapproved ,value: this.summary?.cpdamount },
      { name: 'Total', count:this.summary?.totalapproved ,value: this.summary?.totalAmount },
    ];

    this.report = [];
    alldata.forEach(item => {
      let row = [];
      row.push(item.name);
      row.push(item.value);
      this.report.push(row);
    });

    if (fileType == 'excel') {
      let filter = [];
      filter.push([['Float Number', this.floatNumber]]);
      filter.push([['SNA Doctor', this.snoName]]);
      filter.push([['Float Generated By', this.createdByName]]);

      let row = [];
        row.push('');
        row.push('');
        row.push('');
        this.report.push(row);
        row = [];
        row.push('Cases To Be Paid');
        row.push('Total Cases');
        row.push('Amount');
        this.report.push(row);

      totaldata.forEach(item => {
        let row = [];
        row.push(item.name);
        row.push(item.count);
        row.push(item.value);
        this.report.push(row);
      });

      TableUtil.exportListToExcelWithFilter(
        this.report,
        this.floatNumber,
        this.heading,
        filter
      );
    } else if (fileType == 'pdf') {
      if (
        this.summary == '' ||
        this.summary == null ||
        this.summary == undefined
      ) {
        this.swal('', 'No Data Found', 'info');
        return;
      }

      let doc = new jsPDF('p', 'mm', [297, 210]);
      doc.setFontSize(14);
      doc.text('Float Number :-' + this.floatNumber, 15, 15);
      doc.text('SNA Doctor:-' + this.snoName, 15, 22);
      doc.text('Generated By:-' + this.createdByName, 15, 29);
      // doc.text(this.floatNumber, 70, 31);
      autoTable(doc, {
        head: this.heading,
        body: this.report,
        startY: 35,
        theme: 'grid',
        styles: {
          overflow: 'linebreak',
          halign: 'center',
          valign: 'middle',
          fontSize: 10,
          cellPadding: 1,
          lineWidth: 0.1,
          lineColor: 0,
          textColor: 20,
        },
        bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: {
          lineWidth: 0.1,
          lineColor: 0,
          textColor: [255, 255, 255],
          fillColor: [26, 99, 54],
        },
        columnStyles: {
        },
      });

      let reportdata=[];
      totaldata.forEach(item => {
        let row = [];
        row.push(item.name);
        row.push(item.value);
        row.push(item.count);
        reportdata.push(row);
      });
       // Calculate the position for the second table
       let finalY = (doc as any).lastAutoTable.finalY + 10;
       autoTable(doc, {
         head: this.heading1,
         body: reportdata,
         startY: finalY, // Ensure table starts below the Float Number
         theme: 'grid',
         styles: {
          overflow: 'linebreak',
          halign: 'center',
          valign: 'middle',
          fontSize: 10,
          cellPadding: 1,
          lineWidth: 0.1,
          lineColor: 0,
          textColor: 20,
         },
         bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
         headStyles: {
           lineWidth: 0.1,
           lineColor: 0,
           textColor: [255, 255, 255],
           fillColor: [26, 99, 54],
         },
         columnStyles: {
         },
       });
      doc.save(this.floatNumber + '.pdf');
    }
  }
  convertStringToDate(date) {
    var datePipe = new DatePipe('en-US');
    date = datePipe.transform(date, 'dd-MMM-yyyy hh:mm:ss a');
    return date;
  }
  levelList:any = [];
  levelId:any;
  changeLevel(event){
    this.levelId = event.target.value;
    this.getSummary();
  }
}
