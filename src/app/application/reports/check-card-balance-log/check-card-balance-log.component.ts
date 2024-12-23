import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../header.service';
import { HealthDeptDtlAdauthServiceService } from '../../Services/health-dept-dtl-adauth-service.service';
import Swal from 'sweetalert2';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { TableUtil } from '../../util/TableUtil';
import { formatDate } from '@angular/common';
declare let $:any;

@Component({
  selector: 'app-check-card-balance-log',
  templateUrl: './check-card-balance-log.component.html',
  styleUrls: ['./check-card-balance-log.component.scss'],
})
export class CheckCardBalanceLogComponent implements OnInit {
  pageElement: any;
  currentPage: any;
  cardBalanceLog: any = [];
  showPegi: boolean = false;
  txtsearchDate:any;
  user:any
  constructor(
    public headerService: HeaderService,
    public service: HealthDeptDtlAdauthServiceService,
    private sesonserivce:SessionStorageService
  ) {}

  ngOnInit(): void {
    this.headerService.setTitle('Check Card Balance');
    this.user = this.sesonserivce.decryptSessionData("user");
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
      format: 'YYYY-MM-DD LT',
      daysOfWeekDisabled: ['', 7],
    });

    let date = new Date();
    let year = date.getFullYear();
    let date1 = '01';
    let month: any = date.getMonth();

    if (month == 0) {
      month = 'Jan';
    } else if (month == 1) {
      month = 'Feb';
    } else if (month == 2) {
      month = 'Mar';
    } else if (month == 3) {
      month = 'Apr';
    } else if (month == 4) {
      month = 'May';
    } else if (month == 5) {
      month = 'Jun';
    } else if (month == 6) {
      month = 'Jul';
    } else if (month == 7) {
      month = 'Aug';
    } else if (month == 8) {
      month = 'Sep';
    } else if (month == 9) {
      month = 'Oct';
    } else if (month == 10) {
      month = 'Nov';
    } else if (month == 11) {
      month = 'Dec';
    }
    let frstDay = date1 + '-' + month + '-' + year;
    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr('placeholder', 'From Date *');
    $('input[name="toDate"]').attr('placeholder', 'To Date *');
    this.getCardBalanceLog();
  }

  resData:any;
  record:any;
  formdate:any;
  todate:any;
  getCardBalanceLog() {
    this.formdate = $('#formdate').val();
    this.todate = $('#todate').val();
    this.service.checkCardBalanceLog(this.formdate,this.todate,this.user.userId).subscribe(
      (res: any) => {
        this.resData = res;
        if (this.resData.status == 'success') {
          this.cardBalanceLog = JSON.parse(this.resData.data);
          this.record = this.cardBalanceLog.length;
          if (this.record > 0) {
            this.currentPage = 1;
            this.pageElement = 100;
            this.showPegi = true;
          } else {
            this.showPegi = false;
          }
        } else {
          this.swal('', 'Something went wrong.', 'error');
        }
      },
      (error) => {
        this.swal('', 'Something went wrong.', 'error');
      }
    );
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  report: any = [];
  sno: any = [];
  heading = [['Sl#', 'Search Type', 'Search No.', 'Search On', 'Search By']];
  downloadList(no: any) {
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy =  this.user.fullName;
    this.report = [];
    let sna: any;
    for (let i = 0; i < this.cardBalanceLog.length; i++) {
      sna = this.cardBalanceLog[i];
      this.sno = [];
      this.sno.push(i + 1);
      this.sno.push(sna.searchType);
      this.sno.push(sna.searchNo);
      this.sno.push(sna.searchOn);
      this.sno.push(sna.fullName);
      this.report.push(this.sno);
    }
    if (no == 1) {
      let filter = [];
      filter.push([['From Date', this.formdate]]);
      filter.push([['To Date', this.todate]]);
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'Card Balance Log',
        this.heading, filter
      );
    } else {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      let doc = new jsPDF('p', 'mm', [297, 210]);
      doc.setFontSize(20);
      doc.text("Card Balance Log", 70, 15);
      doc.setFontSize(13);
      doc.text('From Date:- ' + this.formdate, 15, 25);
      doc.text('To Date :- ' + this.todate, 15, 32);
      doc.text('GeneratedOn :- ' + generatedOn, 15, 39);
      doc.text('GeneratedBy :- ' + generatedBy, 15, 46);
      autoTable(doc, {
        head: this.heading,
        body: this.report,
        theme: 'grid',
        startY: 50,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },
        }
      });
      doc.save('Card Balance Log.pdf');
    }
  }

  getReset(){
  window.location.reload();
  }
}
