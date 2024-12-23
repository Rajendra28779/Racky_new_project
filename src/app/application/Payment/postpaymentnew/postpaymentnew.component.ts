import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderService } from '../../header.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { CpdPaymentReportService } from '../../Services/cpd-payment-report.service';
import { formatDate } from '@angular/common';
import { TableUtil } from '../../util/TableUtil';
import autoTable from 'jspdf-autotable';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
declare let $: any;

@Component({
  selector: 'app-postpaymentnew',
  templateUrl: './postpaymentnew.component.html',
  styleUrls: ['./postpaymentnew.component.scss']
})
export class PostpaymentnewComponent implements OnInit {
  years: any = [];
  user: any;
  snaDoctorList: any = [];
  snadoctor: any = "";
  snadoctorname: any = "All";
  keyword: any = 'fullName';
  totalcount: any = 0;
  txtsearchDate: any;
  list: any = [];
  showPegi: boolean;
  currentPage: any;
  pageElement: any;
  formdate: any;
  todate: any;
  showsna: any = false;
  @ViewChild('auto') auto;

  constructor(private route: Router,
    public headerService: HeaderService,
    private snoService: SnocreateserviceService,
    private sessionService: SessionStorageService,
    private cpdpaymentservice: CpdPaymentReportService) { }

  ngOnInit(): void {
    this.headerService.setTitle('Post-Payment Update New');
    this.user = this.sessionService.decryptSessionData('user');
    if (this.user.groupId == 4) {
      this.getsnalist();
      this.showsna = true;
      this.snadoctor = this.user.userId;
      this.snadoctorname = this.user.fullName;
    } else if (this.user.groupId == 18) {
      if (this.user.groupId != 4) {
        this.getSNOList();
      }
    } else {
      this.showsna = false;
    }

    $('.selectpicker').selectpicker();
    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      // endDate: '0d',
      maxDate: new Date(),
      daysOfWeekDisabled: ['', 7],
    });
    $('.timepicker').datetimepicker({
      format: 'LT',
      daysOfWeekDisabled: ['', 7],
    });
    $('.datetimepicker').datetimepicker({
      format: 'DD-MMM-YYYY LT',
      daysOfWeekDisabled: ['', 7],
    });
    // Calculate the first day of the previous month
    let today = new Date();
    let firstDayPrevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const formatDate = (date) => {
      const options = { day: '2-digit', month: 'short', year: 'numeric' };
      return date.toLocaleDateString('en-GB', options).replace(/ /g, '-');
    };

    this.formdate = this.sessionService.decryptSessionData('fromdate') || formatDate(firstDayPrevMonth);
    this.todate = this.sessionService.decryptSessionData('todate') || formatDate(today);
    $('input[name="fromDate1"]').val(this.formdate);
    $('input[name="todate1"]').val(this.todate);
    this.Search();
  }
  snaname: any;
  selectEvent(item) {
    if (this.user.groupId == 4) {
      this.snadoctor = item.userId;
    } else if(this.user.groupId == 18){
      this.snadoctor = item.snaUserId;
    }
    this.snadoctorname = item.fullName;
  }

  onReset1() {
    this.snadoctor = '';
    this.snadoctorname = "ALL";
  }
  getsnalist() {
    this.snaDoctorList = [];
    this.snoService.getSNODetails().subscribe(
      (response) => {
        this.snaDoctorList = response;
      }
    );
  }
  responseData: any;
  getSNOList() {
    this.snaDoctorList = [];
    let userid = this.user.userId;
    this.snoService.getSNOListByExecutive(userid).subscribe(
      (response) => {
        this.responseData = response;
        if (this.responseData.status == 'success') {
          this.snaDoctorList = JSON.parse(this.responseData.data);

        } else {
          this.swal('', 'Something went wrong.', 'error');
        }
      },
      (error) => console.log(error)
    );
  }

  Search() {
    this.formdate = $('#datepicker3').val();
    this.todate = $('#datepicker4').val();
    let snadoctor = this.snadoctor;
    if (Date.parse(this.formdate) > Date.parse(this.todate)) {
      this.swal('', ' Float Generated From Date should be less than Float Generated To Date', 'error');
      return;
    }
    if (snadoctor == '' || snadoctor == null || snadoctor == undefined) {
      this.swal('', 'Please Select SNA Doctor Name', 'info');
      return;
    }
    const fromDateMillis = Date.parse(this.formdate);
    const toDateMillis = Date.parse(this.todate);
    const differenceMillis = toDateMillis - fromDateMillis;
    const differenceDays = differenceMillis / (24 * 60 * 60 * 1000);
    if (differenceDays > 90) {
      this.swal('', 'The date range should not exceed 90 days', 'error');
      return;
    }
    this.cpdpaymentservice.getprocessfloatfrpostpaymentnew(this.formdate, this.todate, snadoctor, this.user.userId).subscribe((data: any) => {
      if (data.status == 200) {
        this.list = data.data;
        this.totalcount = this.list.length;
        if (this.totalcount > 0) {
          this.showPegi = true
          this.currentPage = 1
          this.pageElement = 100
        } else {
          this.showPegi = false
        }
      }
    });
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }

  floatHistoryList: any = [];
  floatNum: any;
  floatCreatedBy: any;
  floatAmount: any;
  createdOn: any;
  viewData(floatnumber: any, snauserid: any) {
    this.cpdpaymentservice.getFloatDescription(this.formdate, this.todate, floatnumber, snauserid).subscribe(response => {
      this.floatHistoryList = response;
      if (this.floatHistoryList.length > 0) {
        this.floatNum = this.floatHistoryList[0].floatNo;
        this.floatCreatedBy = this.floatHistoryList[0].createdBy;
        this.floatAmount = this.floatHistoryList[0].amount;
        this.createdOn = this.floatHistoryList[0].createdOn;
      } else {
        this.floatNum = '';
        this.floatCreatedBy = '';
        this.floatAmount = '';
        this.createdOn = '';
      }
    },
      (error) => {
        this.swal('', 'Something went wrong.', 'error');
      }
    );
  }
  view(floatNumber, fullname, snaName) {
    this.sessionService.encryptSessionData('fromdate', this.formdate);
    this.sessionService.encryptSessionData('todate', this.todate);
    this.sessionService.encryptSessionData('snaid', this.snadoctor);
    this.sessionService.encryptSessionData('snaname', this.snadoctorname);
    sessionStorage.removeItem('Searchtype');
    sessionStorage.removeItem('floatNumber');
    sessionStorage.removeItem('Status');
    sessionStorage.removeItem('currentPageNum');
    sessionStorage.removeItem('fullname');
    sessionStorage.removeItem('snaName');
    this.sessionService.encryptSessionData('Searchtype', "");
    this.sessionService.encryptSessionData('floatNumber', floatNumber);
    this.sessionService.encryptSessionData('Status', 'B');
    this.sessionService.encryptSessionData('fullname', fullname);
    this.sessionService.encryptSessionData('snaName', snaName);
    this.sessionService.encryptSessionData('currentPageNum', this.currentPage);
    this.route.navigate(['/application/floatReport']);
  }

  floatDocDownload(event, data) {
    if (data.document != null) {
      let img = this.cpdpaymentservice.downloadFloatFiles(data);
      window.open(img, '_blank');
    }
  }

  getfloatdetailsHospitalwise(floatnumber: any) {
    this.sessionService.encryptSessionData('hospitalwisefloatnumber', floatnumber);
    this.sessionService.encryptSessionData('Date', this.formdate);
    this.route.navigate([]).then((result) => {
      window.open(environment.routingUrl + '/hospitalwiseAbstractReport');
    });
  }

  onAction(floatNumber) {
    this.sessionService.encryptSessionData('fromdate', this.formdate);
    this.sessionService.encryptSessionData('todate', this.todate);
    this.sessionService.encryptSessionData('snaid', this.snadoctor);
    this.sessionService.encryptSessionData('snaname', this.snadoctorname);
    sessionStorage.removeItem('Searchtype');
    sessionStorage.removeItem('floatNumber');
    sessionStorage.removeItem('Status');
    sessionStorage.removeItem('currentPageNum');
    let Searchtype = $('#authMode1').val();
    this.sessionService.encryptSessionData('Searchtype', "");
    this.sessionService.encryptSessionData('floatNumber', floatNumber);
    this.sessionService.encryptSessionData('Status', 'B');
    this.sessionService.encryptSessionData('currentPageNum', this.currentPage);
    this.route.navigate(['/application/floatlistdetails']);
  }

  report: any = [];
  sno: any = [];
  heading = [["Sl No", "Float Number", "Generated On", "Generated By", "SNA Doctor Name", "Assigned FO Name",
    "Total Claim Count", "Total Amount (₹)", "Current Status"]];
  downloadList(no: any) {
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy = this.user.fullName;
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.list.length; i++) {
      sna = this.list[i];
      this.sno = [];
      this.sno.push(i + 1);
      this.sno.push(sna.floateno);
      this.sno.push(sna.createon);
      this.sno.push(sna.fullname);
      this.sno.push(sna.snaFullName);
      this.sno.push(sna.assignedFoName);
      this.sno.push(sna.count);
      this.sno.push(sna.amount);
      this.sno.push(sna.currentstatus);
      this.report.push(this.sno);
    }
    if (no == 1) {
      let filter = [];
      filter.push([['Float Generation Date From', this.formdate]]);
      filter.push([['Float Generation Date To', this.todate]]);
      filter.push([['SNA Name', this.snadoctorname]]);
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'Process Float Report',
        this.heading, filter
      );
    } else {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('l', 'mm', [297, 210]);
      doc.setFontSize(20);
      doc.text("Process Float Report", 110, 15);
      doc.setFontSize(13);
      doc.text('Float Generation Date From :- ' + this.formdate, 15, 23);
      doc.text('Float Generation Date To :- ' + this.todate, 160, 23);
      doc.text('SNA Doctor Name :- ' + this.snadoctorname, 15, 31);
      doc.text('GeneratedOn :- ' + generatedOn, 15, 39);
      doc.text('GeneratedBy :- ' + generatedBy, 160, 39);
      autoTable(doc, {
        head: this.heading,
        body: this.report,
        theme: 'grid',
        startY: 45,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },
        }
      });
      doc.save('Post-Payment_Update_New.pdf');
    }
  }
  heading1 = [["Sl No", "Action By", "Action On", "Amount", "Remarks",]];
  downloadList1(no: any) {
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy = this.user.fullName;
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.floatHistoryList.length; i++) {
      sna = this.floatHistoryList[i];
      this.sno = [];
      this.sno.push(i + 1);
      this.sno.push(sna.actionBy);
      this.sno.push(sna.actionOn);
      this.sno.push(sna.amount);
      this.sno.push(sna.remark);
      this.report.push(this.sno);
    }
    if (no == 1) {
      let filter = [];
      filter.push([['Float Number', this.floatNum]]);
      filter.push([['Amount', this.floatAmount]]);
      filter.push([['Created By', this.floatCreatedBy]]);
      filter.push([['Created On', this.createdOn]]);
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'Float Action History',
        this.heading1, filter
      );
    } else {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('p', 'mm', [297, 210]);
      doc.setFontSize(20);
      doc.text("Float Action History", 80, 15);
      doc.setFontSize(13);
      doc.text('Float Number :- ' + this.floatNum, 15, 23);
      doc.text('Created By :- ' + this.floatCreatedBy, 15, 31);
      doc.text('Amount :- ' + this.floatAmount, 15, 39);
      doc.text('Created On :- ' + this.createdOn, 15, 47);
      doc.text('GeneratedOn :- ' + generatedOn, 15, 55);
      doc.text('GeneratedBy :- ' + generatedBy, 15, 63);
      autoTable(doc, {
        head: this.heading1,
        body: this.report,
        theme: 'grid',
        startY: 70,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },
        }
      });
      doc.save('Post-Payment_Update_New.pdf');
    }
  }
}


