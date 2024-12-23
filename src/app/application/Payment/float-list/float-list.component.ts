import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderService } from '../../header.service';
import { PaymentfreezeserviceService } from '../../Services/paymentfreezeservice.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { TableUtil } from '../../util/TableUtil';
import { CurrencyPipe, DatePipe, formatDate } from '@angular/common';
import { Session } from 'inspector';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-float-list',
  templateUrl: './float-list.component.html',
  styleUrls: ['./float-list.component.scss'],
})
export class FloatListComponent implements OnInit {
  Status: any;
  floatList: any = [];
  pageElement: any;
  currentPage: any;
  txtsearchDate: any;
  showPegi: boolean;
  groupId: any;
  authMode: any;
  public snoList: any = [];
  keyword: any = 'fullName';
  snoUserId: any;

  months: any;
  year: any;
  months2: any;
  frstDay: string;
  secoundDay: string;
  user:any;
  summary: any;

  constructor(
    public headerService: HeaderService,
    public paymentfreezeService: PaymentfreezeserviceService,
    public route: Router,
    private snoConfigService: SnocreateserviceService,
    private sessionService: SessionStorageService
  ) { }

  ngOnInit(): void {
    this.Status = 'A';
    this.headerService.setTitle('Float List');
    this.user = this.sessionService.decryptSessionData("user");
    this.currentPage = 1;
    this.pageElement = 100;
    sessionStorage.removeItem('floatNumber');
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
    var date = new Date();
    let year = date.getFullYear();
    let date1 = '01';
    let month: any = date.getMonth() - 1;
    if (month == -1) {
      this.months = 'Dec';
      this.year = year - 1;
    } else {
      this.months = this.getMonthFrom(month);
      this.year = year;
    }
    let date2 = date.getDate();

    this.months2 = this.getMonthFrom(date.getMonth());
    this.frstDay = date1 + '-' + this.months + '-' + this.year;

    this.secoundDay = date2 + '-' + this.months2 + '-' + year;

    //Date input placeholder
    $('input[name="fromDate"]').val(this.frstDay);
    $('input[name="fromDate"]').attr('placeholder', 'From Date *');

    // $('input[name="toDate"]').val('');
    $('input[name="toDate"]').attr('placeholder', 'To Date *');
    this.groupId = this.user.groupId;
    this.getFloatList();
    this.getSNOList();
  }
  getMonthFrom(month) {
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
    return month;
  }
  formdate: any;
  todate: any;
  record: any;
  resData: any;
  sonid: any;
  getFloatList() {
    this.formdate = $('#datepicker1').val();
    this.todate = $('#datepicker2').val();
    this.sonid = this.snoUserId;
    let authMode = $('#authMode').val();
    if (Date.parse(this.formdate) > Date.parse(this.todate)) {
      this.swal('', 'From Date Should Be Less Than To Date', 'error');
      return;
    }
    if (this.sonid == null || this.sonid == "" || this.sonid == undefined) {
      this.sonid = "";
    }
    if (this.authMode == null || this.authMode == "" || this.authMode == undefined) {
      this.authMode = "";
    }
    this.paymentfreezeService.getFloatList(this.groupId, this.formdate, this.todate, this.sonid, this.user.userId, authMode).subscribe(
      (data) => {
        this.resData = data;
        console.log(data);
        if (this.resData.status == 'success') {
          this.floatList = this.resData.data;
          this.record = this.floatList.length;
          if (this.record > 0) {
            this.showPegi = true;
          } else {
            this.showPegi = false;
          }
        } else if (this.resData.status == 'failed') {
          this.swal('', this.resData.msg, 'info');
          sessionStorage.clear();
          localStorage.clear();
          this.route.navigateByUrl('/login')
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
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
  pageItemChange() {
    // this.ngOnInit();
    this.pageElement = (<HTMLInputElement>(
      document.getElementById('pageItem')
    )).value;
    console.log(this.pageElement);
    // alert("Page Capcity Extended Upto " + this.pageElement);
  }

  view(floatNumber, fullname, snaName) {
    sessionStorage.removeItem('Searchtype');
    sessionStorage.removeItem('floatNumber');
    sessionStorage.removeItem('Status');
    sessionStorage.removeItem('currentPageNum');
    sessionStorage.removeItem('fullname');
    sessionStorage.removeItem('snaName');
    let Searchtype = $('#authMode').val();
    this.sessionService.encryptSessionData('Searchtype', Searchtype);
    this.sessionService.encryptSessionData('floatNumber', floatNumber);
    this.sessionService.encryptSessionData('Status', this.Status);
    this.sessionService.encryptSessionData('fullname', fullname);
    this.sessionService.encryptSessionData('snaName', snaName);
    this.sessionService.encryptSessionData('currentPageNum', this.currentPage);
    this.route.navigate(['/application/floatReport']);
  }

  onAction(floatNumber) {
    sessionStorage.removeItem('Searchtype');
    sessionStorage.removeItem('floatNumber');
    sessionStorage.removeItem('Status');
    sessionStorage.removeItem('currentPageNum');
    let Searchtype = $('#authMode').val();
    this.sessionService.encryptSessionData('Searchtype', Searchtype);
    this.sessionService.encryptSessionData('floatNumber', floatNumber);
    this.sessionService.encryptSessionData('Status', this.Status);
    this.sessionService.encryptSessionData('currentPageNum', this.currentPage);
    this.route.navigate(['/application/floatdetails']);
  }
  getSNOList() {
    this.snoConfigService.getSNAList().subscribe(
      (response) => {
        this.snoList = response;
        console.log(this.snoList);
      },
      (error) => console.log(error)
    )
  }
  clearEvent() {
    this.snoUserId = '';
  }
  selectEvent(item) {
    this.snoUserId = item.userId;
  }

  onresetrecord() {
    window.location.reload();

  }
  report: any = [];
  sno: any = {
    SNo:"",
    FloatNumber:"",
    GeneratedOn:"",
    GeneratedBy:"",
    SNADoctorName:"",
    TotalClaimCount:"",
    TotalAmount:"",
    Remarks:"",
    remarkby:"",
    VerifyStatus: "",
  };
  heading = [
    [
      'Sl No','Float Number','Generated On','Generated By','SNA Doctor Name',	'Total Claim Count',
      'Total Amount','Remarks','Verify Status','Remark By'
    ],
  ];
  downloadReport(type: any) {
    this.report = [];
    if (type == 'excel') {
      let claim: any;
      for (var i = 0; i < this.floatList.length; i++) {
        claim = this.floatList[i];
        this.sno = [];
        this.sno.Slno = i + 1;
        this.sno.FloatNumber = claim.floateno!=null?claim.floateno:"N/A";
        this.sno.GeneratedOn = this.convertStringToDate(claim.createon);
        this.sno.GeneratedBy = claim.fullname!=null?claim.fullname:"N/A";
        this.sno.SNADoctorName = claim.snaFullName!=null?claim.snaFullName:"N/A";
        this.sno.TotalClaimCount = claim.count!=null?claim.count:"N/A";
        this.sno.TotalAmount = this.convertCurrency(claim.amount);
        this.sno.Remarks = claim.remarks1!=null?claim.remarks1:"N/A";
        this.sno.remarkby = claim.remarkby;
        this.sno.VerifyStatus = claim.isVerified!=null?claim.isVerified:"N/A";
        this.report.push(this.sno);
      }
      let filter = [];
      filter.push('Float Generation Date From: ' + this.formdate);
      filter.push('Float Generation Date To: ' + this.todate);
      if(this.authMode==2){
        filter.push('Float Type:- ' + 'Fresh');
      }else if(this.authMode==6){
        filter.push('Float Type:-' + 'Compliance By Joint CEO');
      }else{
        filter.push('Float Type:-' + 'N/A');
      }
      if(this.sonid!=null && this.sonid!="" && this.sonid!=undefined){
        filter.push('SNA Doctor Name:-' + this.snoList.find(x=>x.userId==this.sonid).fullName);
      }else{
        filter.push('SNA Doctor Name:-' + 'N/A');
      }
      TableUtil.exportListToExcelWithFilterforadmin(this.report, 'Float_List', this.heading, filter);
    } else if (type == 'pdf') {
      if (this.floatList.length == 0) {
        this.swal('', 'No Data Found', 'info');
        return;
      }
      let valuedate: any;
      let todate: any;
      let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en').toString();

      valuedate = this.formdate;
      todate = this.todate;
      if (valuedate == undefined || valuedate == null || valuedate == '') {
        valuedate = 'N/A';
      }
      if (todate == undefined || todate == null || todate == '') {
        todate = 'N/A';
      }
      let SlNo = 1;
      this.floatList.forEach(element => {
        let rowData = [];
        rowData.push(SlNo);
        rowData.push(element.floateno!=null?element.floateno:"N/A");
        rowData.push(this.convertStringToDate(element.createon));
        rowData.push(element.fullname!=null?element.fullname:"N/A");
        rowData.push(element.snaFullName!=null?element.snaFullName:"N/A");
        rowData.push(element.count!=null?element.count:"N/A");
        rowData.push(this.convertCurrency(element.amount));
        rowData.push(element.remarks1!=null?element.remarks1:"N/A");
        rowData.push(element.remarkby);
        rowData.push(element.isVerified!=null?element.isVerified:"N/A");
        this.report.push(rowData);
        SlNo++;
      });
      let doc = new jsPDF('l', 'mm', [238, 270]);
      doc.setFontSize(10);
      doc.text('Float Generation Date From:-' + valuedate, 5, 10);
      doc.text('Float Generation Date To:-' + todate, 5, 15);
      if(this.authMode==2){
        doc.text('Float Type:- ' + 'Fresh', 5, 20);
      }else if(this.authMode==6){
        doc.text('Float Type:-' + 'Compliance By Joint CEO', 5, 20);
      }else{
        doc.text('Float Type:-' + 'N/A', 5, 20);
      }
      if(this.sonid!=null && this.sonid!="" && this.sonid!=undefined){
        doc.text('SNA Doctor Name:-' + this.snoList.find(x=>x.userId==this.sonid).fullName, 5, 25);
      }else{
        doc.text('SNA Doctor Name:-' + 'N/A', 5, 25);
      }
      doc.text('Generate On : ' + generatedOn, 5, 30);
      doc.text('Float List', 100, 35);
      doc.setLineWidth(0.7);
      doc.line(100, 36, 114, 36);
      autoTable(doc, {
        head: this.heading, body: this.report, startY: 28, theme: 'grid',
        styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
        bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 30 },
          2: { cellWidth: 30 },
          3: { cellWidth: 30 },
          4: { cellWidth: 30 },
          5: { cellWidth: 20 },
          6: { cellWidth: 20 },
          7: { cellWidth: 20 },
          8: { cellWidth: 20 },
        }
      })
      doc.save('Float_List.pdf');
    }
  }
  changeAuthMode(event: any) {
    this.authMode = event.target.value;
  }
  convertStringToDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy hh:mm:ss a');
    return date;
  }
  getfloatdetailsHospitalwise(floatnumber: any) {
    this.sessionService.encryptSessionData('hospitalwisefloatnumber', floatnumber);
    this.sessionService.encryptSessionData('Date', this.formdate);
    this.route.navigate([]).then((result) => {
      window.open(environment.routingUrl + '/hospitalwisefloatnumberDetails');
    });
    // this.route.navigate(['/application/hospitalwisefloatnumberDetails']);
  }
  convertCurrency(amount:any) {
    var formatter = new CurrencyPipe('en-US');
    amount=formatter.transform(amount, '', '');
    return amount;
  }
  @ViewChild('closebutton') closebutton;
  floatHistoryList:any=[];
  floatNum:any;
  floatCreatedBy:any;
  floatAmount:any;
  createdOn:any;
  viewHistory(floatData){
    let floatId = floatData.floateId;
    $('#historyModal').show();
    this.paymentfreezeService.getFloatLogList(floatId).subscribe(
      (data) => {
        this.resData = data;
        console.log(data);
        if (this.resData.status == 'success') {
          this.floatHistoryList = this.resData.data;
          this.floatNum = this.floatHistoryList[0].floateno;
          this.floatCreatedBy = this.floatHistoryList[0].createby.fullname;
          // this.floatAmount = this.floatHistoryList[0].amount;
          this.floatAmount = this.floatHistoryList.at(-1).amount;
          this.createdOn = this.floatHistoryList[0].createon;
        } else if (this.resData.status == 'failed') {
          this.swal('', this.resData.msg, 'error');
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
  cancel() {
  }
  floatDocDownload(event,data){
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
      if (data.floatDoc != null) {
        let img = this.paymentfreezeService.downloadFloatFiles(data);
        window.open(img, '_blank');
        // this.paymentfreezeService.downloadFloatFiles(data).subscribe(
        //   (response: any) => {
        //     var result = response;
        //     let blob = new Blob([result], { type: result.type });
        //     let url = window.URL.createObjectURL(blob);
        //     window.open(url);
        //     // this.DocumnetLog();
        //   },
        //   (error) => {
        //     console.log(error);
        //   }
        // );
      }
    }
  }
}
