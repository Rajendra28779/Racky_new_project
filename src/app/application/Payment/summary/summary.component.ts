import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { JwtService } from 'src/app/services/jwt.service';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { PaymentfreezeserviceService } from '../../Services/paymentfreezeservice.service';
import { SnoCLaimDetailsService } from '../../Services/sno-claim-details.service';
import { TableUtil } from '../../util/TableUtil';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { PackageDetailsMasterService } from '../../Services/package-details-master.service';
declare let $: any;

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {
  statelist: Array<any> = [];
  user: any;
  currentPage: any;
  pageElement: any;
  paymentList: any = [];
  txtsearchDate: any;
  record: any;
  showPegi: boolean;
  childmessage: any;
  hospitalCode: any;
  stateCode: any;
  userId: any;
  distList: any;
  distCode: any;
  hospitalList: any;
  totalpaymentlist: any;
  dataa: any;
  status: any;
  keyword: any = 'HOSPITALNAME';
  keywords: any = 'fullName';
  snadoctornamehidestatus: boolean = true;
  snoUserId: any;
  constructor(
    public headerService: HeaderService,
    public paymentfreezeService: PaymentfreezeserviceService,
    public snoService: SnoCLaimDetailsService,
    private jwtService: JwtService,
    private snoConfigService: SnocreateserviceService,
    public route: Router, private sessionService: SessionStorageService,
    private encryptionService: EncryptionService, public packageDetailsMasterService: PackageDetailsMasterService
  ) { }

  ngOnInit(): void {
    this.getSchemeData();
    this.headerService.setTitle('Float Generation');
    this.user = this.sessionService.decryptSessionData("user");
    this.currentPage = 1;
    this.pageElement = 50;
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
      format: 'DD-MM-YYYY LT',
      daysOfWeekDisabled: ['', 7],
    });
    var date = new Date();
    let year = date.getFullYear();
    let date1 = '01';
    let month: any = date.getMonth() - 1;
    if (month == -1) {
      month = 11;
      year = year - 1;
    }
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
    var frstDay = date1 + '-' + month + '-' + year;
    $('input[name="fromDate1"]').val(frstDay);
    $('input[name="fromDate1"]').attr('placeholder', 'From Date *');
    $('input[name="todate1"]').attr('placeholder', 'To Date *');
    if (this.user.groupId == 4) {
      this.snadoctornamehidestatus = false;
      this.snoUserId = this.user.userId;
      this.getdetailssummary();
    }
    this.getSNOList();
  }
  report: any = [];
  sno: any = {
    Slno: '',
    FloatNo: '',
    GeneratedOn: '',
    Amount: '',
    isVerified: '',
  };
  heading = [['Sl#', 'Float No', 'Generated On', 'Amount', 'Is Verified']];
  downloadReport(type: any) {
    this.report = [];
    if (type == 'excel') {
      let claim: any;
      for (var i = 0; i < this.paymentList.length; i++) {
        claim = this.paymentList[i];
        this.sno = [];
        this.sno.Slno = i + 1;
        this.sno.FloatNo = claim.float_no;
        this.sno.GeneratedOn = this.dateconvert(claim.CREATED_ON);
        this.sno.Amount = claim.amount;
        this.sno.isVerified = claim.isVerified;
        this.report.push(this.sno);
      }
      let filter = [];
      filter.push([['Generated Float From', this.fromDate1]]);
      filter.push([['Generated Float To', this.todate1]]);
      if (this.Verifystatus == '0') {
        filter.push([['Is Verified', "NO"]]);
      } else if (this.Verifystatus == '1') {
        filter.push([['Is Verified', "YES"]]);
      } else {
        filter.push([['Is Verified', "All"]]);
      }
      if (this.schemecategoryidvalue == '1') {
        filter.push([['Scheme Category Name', "NFSA/SFSS"]]);
      } else if (this.schemecategoryidvalue == '2') {
        filter.push([['Scheme Category Name', "GJAY-1"]]);
      } else {
        filter.push([['Scheme Category Name', "All"]]);
      }
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'Summary Details',
        this.heading,
        filter
      );
    } else if (type == 'pdf') {
      if (this.paymentList.length == 0) {
        this.swal('', 'No Data Found', 'info');
        return;
      }
      let SlNo = 1;
      this.paymentList.forEach((element) => {
        let rowData = [];
        rowData.push(SlNo++);
        rowData.push(element.float_no);
        rowData.push(this.dateconvert(element.CREATED_ON));
        rowData.push(element.amount);
        rowData.push(element.isVerified);
        this.report.push(rowData);
      });
      let doc = new jsPDF('l', 'mm', [200, 240]);
      let months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
      doc.setFontSize(10);
      doc.text('Generated Float From :-' + this.fromDate1, 5, 5);
      doc.text('Generated Float To:-' + this.todate1, 5, 10);
      if(this.Verifystatus =='0'){
        doc.text('Is Verified:-' + "NO", 5, 15);
      }else if(this.Verifystatus =='1'){
        doc.text('Is Verified:-' + "YES", 5, 15);
      }else{
        doc.text('Is Verified:-' + "All", 5, 15);
      }
      if(this.schemecategoryidvalue =='1'){
        doc.text('Scheme Category Name:-' + "NFSA/SFSS", 5, 20);
      }else if(this.schemecategoryidvalue =='2'){
        doc.text('Scheme Category Name:-' + "GJAY-1", 5, 20);
      }else{
        doc.text('Scheme Category Name:-' + "All", 5, 20);
      }
      doc.text('Generated By :-' + this.user.fullName, 5, 25);
      doc.text('Document Generated Date : ' +generatedOn,5,30);
      doc.text('Summary Details', 100, 35);
      doc.setLineWidth(0.7);
      doc.line(100, 36, 128, 36);
      autoTable(doc, {
        head: this.heading,
        body: this.report,
        startY: 38,
        theme: 'grid',
        styles: {
          overflow: 'linebreak',
          halign: 'center',
          valign: 'middle',
          fontSize: 8,
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
          0: { cellWidth: 10 },
          1: { cellWidth: 50 },
          2: { cellWidth: 40 },
          3: { cellWidth: 40 },
        },
      });
      doc.save('Summary Details.pdf');
    }
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  fromDate1: any;
  todate1: any;
  Verifystatus: any;
  getdetailssummary() {
    this.Verifystatus = this.data;
    this.fromDate1 = $('#formdate1').val();
    this.todate1 = $('#todate1').val();
    let schemecategoryid = this.schemecategoryidvalue;
    if (schemecategoryid == null || schemecategoryid == undefined || schemecategoryid == '') {
      schemecategoryid = "";
    } else {
      schemecategoryid = schemecategoryid;
    }
    if (this.Verifystatus == undefined) {
      this.Verifystatus = '';
    }
    if (Date.parse(this.fromDate1) > Date.parse(this.todate1)) {
      this.swal('', ' From Date should be less Than To Date', 'error');
      return;
    }
    if (
      this.snoUserId == undefined ||
      this.snoUserId == null ||
      this.snoUserId == ''
    ) {
      this.swal('', 'Please Select SNA Doctor', 'info');
      return;
    }
    let fDate = this.getconvertDate(this.fromDate1);
    let tDate = this.getconvertDate(this.todate1);
    this.paymentfreezeService.getSummary(this.snoUserId, fDate, tDate, this.Verifystatus, schemecategoryid).subscribe(
      (data: any) => {
        this.paymentList = data;
        this.record = this.paymentList.length;
        if (this.record > 0) {
          this.showPegi = true;
        } else {
          this.showPegi = false;
        }
      }
    );
  }
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>(
      document.getElementById('pageItem')
    )).value;
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
  dateconvert(date: any) {
    var datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'dd-MMM-yyyy hh:mm:ss a');
  }
  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }
  resetField() {
    this.Verifystatus = '';
    window.location.reload();
  }
  getconvertDate(date: any) {
    var datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'yyyy-MM-dd');
  }
  data: any;
  onselected(event: any) {
    this.data = event.target.value;
  }
  selectSnaEvent(item) {
    this.snoUserId = item.snaUserId;
  }
  clearSnaEvent() {
    this.snoUserId = '';
  }
  responseData: any;
  snoList: any = [];
  getSNOList() {
    let userid = this.user.userId;
    this.snoConfigService.getSNOListByExecutive(userid).subscribe(
      (response) => {
        this.responseData = response;
        if (this.responseData.status == 'success') {
          this.snoList = JSON.parse(this.responseData.data);
        } else {
          this.swal('', 'Something went wrong.', 'error');
        }
      },
      (error) => console.log(error)
    );
  }

  view(floatNumber) {
    sessionStorage.removeItem('Searchtype');
    sessionStorage.removeItem('floatNumber');
    sessionStorage.removeItem('currentPageNum');
    sessionStorage.removeItem('fullname');
    sessionStorage.removeItem('snaName');
    let Searchtype = $('#authMode').val();
    this.sessionService.encryptSessionData('Searchtype', Searchtype);
    this.sessionService.encryptSessionData('floatNumber', floatNumber);
    this.sessionService.encryptSessionData('fullname', this.user.fullName);
    this.sessionService.encryptSessionData('snaName', this.user.fullName);
    this.sessionService.encryptSessionData('currentPageNum', this.currentPage);
    this.route.navigate(['/application/floatReport']);
  }

  onAction(floatNumber) {
    this.sessionService.encryptSessionData('floatNumber', floatNumber);
    this.sessionService.encryptSessionData('currentPageNum', this.currentPage);
    this.route.navigate([]).then((result) => {
      window.open(environment.routingUrl + '/summarydetails');
    });
  }

  getfloatdetailsHospitalwise(floatnumber: any) {
    this.sessionService.encryptSessionData('hospitalwisefloatnumber', floatnumber);
    this.sessionService.encryptSessionData('Date', this.fromDate1);
    this.route.navigate([]).then((result) => {
      window.open(environment.routingUrl + '/hospitalwisefloatnumberDetails');
    });
  }

  floatHistoryList: any = [];
  floatNum: any;
  resData: any;
  floatCreatedBy: any;
  floatAmount: any;
  createdOn: any;
  viewHistory(floatData) {
    let floatId = floatData.float_id;
    $('#historyModal').show();
    this.paymentfreezeService.getFloatLogList(floatId).subscribe(
      (data) => {
        this.resData = data;
        if (this.resData.status == 'success') {
          this.floatHistoryList = this.resData.data;
          this.floatNum = this.floatHistoryList[0].floateno;
          this.floatCreatedBy = this.floatHistoryList[0].createby.fullname;
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
    $('#historyModal').hide();
  }
  floatDocDownload(event, data) {
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
      }
    }
  }
  ///scheme
  scheme: any = [];
  schemeidvalue: any = 1;
  schemeName: any = ''
  getSchemeData() {
    let data = {
      action: 'A',
      schemeId: 1,
      schemeCategoryId: '',
    };
    let encData = this.encryptionService.encryptRequest(data);
    this.packageDetailsMasterService.getSchemeDetails(encData).subscribe((res: any) => {
      let resData = this.encryptionService.getDecryptedData(res);
      if (resData.status == 'success') {
        this.scheme = resData.data;
        for (let i = 0; i < this.scheme.length; i++) {
          this.schemeidvalue = this.scheme[i].schemeId;
          this.schemeName = this.scheme[i].schemeName;
        }
        this.getSchemeDetails();

      } else {
        this.swal('', 'Something went wrong.', 'error');

      }
    },
      (error) => {
        this.swal('', 'Something went wrong.', 'error');
      });
  }

  schemeList: any = [];
  getSchemeDetails() {
    let data = {
      action: 'B',
      schemeId: 1,
      schemeCategoryId: '',
    };
    let encData = this.encryptionService.encryptRequest(data);
    this.packageDetailsMasterService.getSchemeDetails(encData).subscribe((res: any) => {
      let resData = this.encryptionService.getDecryptedData(res);
      if (resData.status == 'success') {
        this.schemeList = resData.data;
      } else {
        this.swal('', 'Something went wrong.', 'error');

      }
    },
      (error) => {
        this.swal('', 'Something went wrong.', 'error');
      });
  }

  schemecategoryidvalue: any
  schemecategoryName: any;
  getschemacategoryid(event: any) {
    if (event != null && event != undefined && event != '' && event != "") {
      for (let i = 0; i < this.schemeList.length; i++) {
        if (event == this.schemeList[i].schemeCategoryId)
          this.schemecategoryidvalue = this.schemeList[i].schemeCategoryId;
        this.schemecategoryName = this.schemeList[i].categoryName;
      }
    } else {
      this.schemecategoryidvalue = '';
      this.schemecategoryName = "All"
    }
  }
}


