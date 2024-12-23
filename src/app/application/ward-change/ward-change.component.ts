import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { HeaderService } from '../header.service';
import { PreauthService } from '../Services/preauth.service';
import { TableUtil } from '../util/TableUtil';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatDate } from '@angular/common';
declare let $: any;

@Component({
  selector: 'app-ward-change',
  templateUrl: './ward-change.component.html',
  styleUrls: ['./ward-change.component.scss']
})
export class WardChangeComponent implements OnInit {
  wardchangeList: any = [];
  txtsearchDate: any;
  pageElement: any;
  currentPage: any;
  showPegi: boolean;
  user: any;
  fromDate: any;
  toDate: any;
  constructor(
    public headerService: HeaderService,
    private sessionService: SessionStorageService,
    public preauthService: PreauthService,
    public route: Router
  ) {}

  ngOnInit(): void {
    this.headerService.setTitle('Ward Change');
    this.headerService.isBack(true);
    this.user = this.sessionService.decryptSessionData('user');
    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      maxDate: new Date(),
      daysOfWeekDisabled: ['', 7],
    });
    this.getwardchangeList();
  }
  resData: any;
  getwardchangeList() {
    this.fromDate = $('#formdate').val();
    this.toDate = $('#todate').val();
    if (Date.parse(this.fromDate) > Date.parse(this.toDate)) {
      this.swal('', ' From Date should be less To Date', 'error');
      return;
    }
    let requestData = {
      userId: this.user.userId,
      fromDate: this.fromDate,
      toDate: this.toDate,
      action: 'A',
    };
    this.preauthService.getwardchangeList(requestData).subscribe(
      (data) => {
        this.resData = data;
        if (this.resData.status == 200) {
          this.wardchangeList = this.resData.data;
          if (this.wardchangeList.length>0) {
            this.currentPage = 1;
            this.pageElement = 50;
            this.showPegi = true;
          } else {
            this.showPegi = false;
          }
        } else {
          this.swal('', 'Something went wrong.', 'error');
        }
      },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      }
    );
  }
  reset() {
    window.location.reload();
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  statusSubmit(urn, id) {
    let state = {
      urnNo: urn,
      wardchangeId: id,
      action:1
    };
    localStorage.setItem('extsndata', JSON.stringify(state));
    this.route.navigate(['/application/wardchangerqstdetails']);
  }

  downloadList(no:any){
    const generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    const generatedBy = this.user.fullName;

    // Table headings
    const heading = [
        [
            'Sl No.',
            'Hospital (Code)',
            'Case No',
            'URN',
            'Patient Name',
            'Package Code',
            'Package Name',
            'Package Extension Upto',
            'Requested Date',
            'Ward Change From Date',
            'Ward Change From',
            'Ward Change To',
            'Status',
        ]
    ];

    const report = []; // Initialize report data

    // Populate rows
    for (let i = 0; i < this.wardchangeList.length; i++) {
        const data = this.wardchangeList[i];
        const row = [];
        row.push(i + 1); // Sl No.
        row.push(data.hospitalName+"( "+data.hospitalCode+")"); // Hospital (Code)
        row.push(data.caseNo || 'N/A'); // Case No
        row.push(data.urn || 'N/A'); // URN
        row.push(data.patientName || 'N/A'); // Patient Name
        row.push(data.procedureCode || 'N/A'); // Package Code
        row.push(data.procedureName || 'N/A'); // Package Name
        row.push(data.extnupto || 'N/A'); // Ward Change From Date
        row.push(data.requestDate || 'N/A'); // Ward Change Upto Date
        row.push(data.wardchngfrom || 'N/A'); // Amount
        row.push(data.fromward || 'N/A'); // No Of Days
        row.push(data.toward || 'N/A'); // No Of Days
        row.push(data.status || 'N/A'); // Status
        report.push(row);
    }

    if (no === 1) {
        // Export as Excel
        const filter = [[['Requested From Date:', this.fromDate]], [['Requested To Date:', this.toDate]]];
        TableUtil.exportListToExcelWithFilter(report, 'Ward Change Request List', heading, filter);
    } else {
        // Export as PDF
        if (report.length === 0) {
            this.swal("Info", "No Record Found", "info");
            return;
        }

        const doc = new jsPDF('l', 'mm', [210, 297]); // Landscape A4
        doc.setFontSize(20);
        doc.text("Ward Change Request", 100, 15);
        doc.setFontSize(12);
        doc.text('Requested From Date: ' + this.fromDate, 14, 25);
        doc.text('Requested To Date: ' + this.toDate, 180, 25);
        doc.text('Generated On: ' + generatedOn, 180, 32);
        doc.text('Generated By: ' + generatedBy, 14, 32);

        autoTable(doc, {
            head: heading,
            body: report,
            theme: 'grid',
            startY: 36,
            headStyles: { fillColor: [31, 114, 63] },
            columnStyles: {
                0: { cellWidth: 10 }, // Sl No
            }
        });
        doc.save('Ward_Change_Request_List.pdf');
    }
  }
}
