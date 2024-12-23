import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { PaymentfreezeserviceService } from '../../Services/paymentfreezeservice.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { UsercreateService } from '../../Services/usercreate.service';
import { HeaderService } from '../../header.service';
import { SnopipePipe } from '../../pipes/snopipe.pipe';
import { TableUtil } from '../../util/TableUtil';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-view-verified-list',
  templateUrl: './view-verified-list.component.html',
  styleUrls: ['./view-verified-list.component.scss']
})
export class ViewVerifiedListComponent implements OnInit {

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
  snoUserId: any = '';
  maxChars = 500;
  months: any;
  year: any;
  months2: any;
  frstDay: string;
  secoundDay: string;
  user: any;
  summary: any;
  show: boolean = false;
  btnView: any = "Forward";

  @ViewChild('closebutton') closebutton;
  constructor(public headerService: HeaderService,
    public paymentfreezeService: PaymentfreezeserviceService,
    public route: Router,
    private snoConfigService: SnocreateserviceService,
    private snopipePipe: SnopipePipe,
    private userservice: UsercreateService,private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.Status = 'B';
    this.headerService.setTitle('Float Verified List');
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
    $('input[name="fromDate1"]').val(this.frstDay);
    $('input[name="fromDate1"]').attr('placeholder', 'From Date *');

    // $('input[name="toDate1"]').val('');
    $('input[name="toDate1"]').attr('placeholder', 'To Date *');
    this.groupId = this.user.groupId;
    if (this.groupId == 40) {
      this.showFloatType = true;
    }
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
  formdate1: any;
  toDate1: any;
  record: any;
  resData: any;
  sonid: any;
  floatTypeMode:any;
  showFloatType:any=true;
  getFloatList() {
    this.formdate1 = $('#datepicker3').val();
    this.toDate1 = $('#datepicker4').val();
    this.sonid = this.snoUserId;
    let authMode  = $('#authMode1').val();
    if (this.user.groupId == 40) {
      authMode = authMode;
    } else if (this.user.groupId == 39) {
      this.showFloatType=false;
      authMode = 9;
    }
    if (Date.parse(this.formdate1) > Date.parse(this.toDate1)) {
      this.swal('', 'From Date Should Be Less Than To Date', 'error');
      return;
    }
    if (this.sonid == null || this.sonid == "" || this.sonid == undefined) {
      this.sonid = "";
    }
    if (this.authMode == null || this.authMode == "" || this.authMode == undefined) {
      this.authMode = "";
    }
    this.floatList = [];
    this.paymentfreezeService.getFloatList(this.groupId, this.formdate1, this.toDate1, this.sonid, this.user.userId, authMode).subscribe(
      (data) => {
        this.resData = data;
        if (this.resData.status == 'success') {
          this.floatList = this.resData.data;
          console.log(this.floatList);
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
    let Searchtype = $('#authMode1').val();
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
    let Searchtype;
    if (this.user.groupId == 40) {
      Searchtype = 8;
    } else if (this.user.groupId == 39) {
      Searchtype = 9;
    }
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
    Slno: '',
    FloatNumber: '',
    GenerateBy: '',
    Amount: '',
    VerifyStatus: '',
  };
  heading = [
    [
      'Slno',
      'Float Number',
      'Generate By',
      'Generate On',
      'Total Amount',
      'Verify Status'
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
        this.sno.FloatNumber = claim.floateno;
        this.sno.GenerateBy = claim.fullname;
        this.sno.GenerateOn = this.convertStringtoDate(claim.createon);
        this.sno.Amount = claim.amount;
        this.sno.VerifyStatus = claim.isVerified;
        this.report.push(this.sno);
      }
      let filter = [];
      filter.push([['Float Number', this.floatList[0].floateno]]);
      filter.push([['Float Generated By', this.floatList[0].fullname]]);
      TableUtil.exportListToExcelWithFilter(this.report, 'Float_List', this.heading, filter);
    } else if (type == 'pdf') {
      if (this.floatList.length == 0) {
        this.swal('', 'No Data Found', 'info');
        return;
      }
      let valuedate: any;
      let toDate1: any;
      let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
      valuedate = this.formdate1;
      toDate1 = this.toDate1;
      if (valuedate == undefined || valuedate == null || valuedate == '') {
        valuedate = 'N/A';
      }
      if (toDate1 == undefined || toDate1 == null || toDate1 == '') {
        toDate1 = 'N/A';
      }
      let SlNo = 1;
      this.floatList.forEach(element => {
        let rowData = [];
        rowData.push(SlNo++);
        rowData.push(element.floateno);
        rowData.push(element.fullname);
        rowData.push(this.convertStringtoDate(element.createon));
        rowData.push(element.amount);
        rowData.push(element.isVerified);
        this.report.push(rowData);
      });
      let doc = new jsPDF('l', 'mm', [238, 270]);
      doc.setFontSize(10);
      doc.text('Generated By :-' + this.user.fullName, 5, 5);
      doc.text('Float From Date:-' + valuedate, 5, 10);
      doc.text('Float To Date:-' + toDate1, 5, 15);
      doc.text('Generate On : ' + generatedOn, 5, 20);
      doc.text('Float List', 100, 25);
      doc.setLineWidth(0.7);
      doc.line(100, 26, 114, 26);
      autoTable(doc, {
        head: this.heading, body: this.report, startY: 28, theme: 'grid',
        styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
        bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 40 },
          2: { cellWidth: 50 },
          3: { cellWidth: 30 },
          4: { cellWidth: 30 },
        }
      })
      doc.save('Float_List.pdf');
    }
  }
  // changeFloatType(event: any) {
  //   this.authMode = event.target.value;
  //   if (this.authMode == '1') {
  //     this.btnView = "Assign To";
  //   } else if (this.authMode == '5') {
  //     this.btnView = "Forward to Fo";
  //   } else if (this.authMode == '3') {
  //     this.btnView = "Revert to SNA";
  //   } else if (this.authMode == '9') {
  //     this.btnView = "Forward To FO";
  //   }
  // }
  convertStringtoDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy hh:mm:ss a');
    return date;
  }
  getfloatdetailsHospitalwise(floatnumber: any) {
    this.sessionService.encryptSessionData('hospitalwisefloatnumber', floatnumber);
    this.sessionService.encryptSessionData('Date', this.formdate1);
    this.route.navigate([]).then((result) => {
      window.open(environment.routingUrl + '/hospitalwisefloatnumberDetails');
    });
    // this.route.navigate(['/application/hospitalwisefloatnumberDetails']);
  }
  assignTo() {
    $('#assignFoModal').show();
    $('#userId').val('');
    this.showPending = false;
  }
  getDate(date) {
    let year = date.getFullYear();
    let date1 = date.getDate();
    let months = date.getMonth();
    let month = this.getMonthFrom(months);
    var frstDay = date1 + '-' + month + '-' + year;
    return frstDay;
  }
  // dataIdArray: any = [];
  // checkAllCheckBox(event: any) {
  //   // Angular 13
  //   if (event.target.checked) {
  //     for (let i = 0; i < this.floatList.length; i++) {
  //       $('#' + this.floatList[i].floateId).prop('checked', true);
  //       this.dataIdArray.push(this.floatList[i].floateId);
  //     }
  //   } else {
  //     for (let i = 0; i < this.floatList.length; i++) {
  //       $('#' + this.floatList[i].floateId).prop('checked', false);
  //       this.dataIdArray = [];
  //     }
  //   }
  //   this.dataIdArray = this.dataIdArray.filter(
  //     (value, index) => this.dataIdArray.indexOf(value) === index
  //   );
  //   if (this.dataIdArray.length > 0) {
  //     this.show = true;
  //   } else {
  //     this.show = false;
  //   }
  // }
  // tdCheck(event: any, floateId) {
  //   if (event.target.checked) {
  //     this.dataIdArray.push(floateId);
  //   } else {
  //     for (let i = 0; i < this.dataIdArray.length; i++) {
  //       if (this.dataIdArray[i] == floateId) {
  //         this.dataIdArray.splice(i, 1);
  //       }
  //     }
  //   }
  //   if (this.dataIdArray.length == this.floatList.length) {
  //     $('#allCheck').prop('checked', true);
  //   } else {
  //     $('#allCheck').prop('checked', false);
  //   }
  //   if (this.dataIdArray.length > 0) {
  //     this.show = true;
  //   } else {
  //     this.show = false;
  //   }
  //   this.dataIdArray = this.dataIdArray.filter(
  //     (value, index) => this.dataIdArray.indexOf(value) === index
  //   );
  // }

  cancel() {
    $('#userId').val('');
    this.showPending = false;
  }

  filtered: any = [];
  userData: any = [];
  stateId: any;
  districtId: any;
  getFoUser() {
    this.userData = [];
    this.stateId = null;
    this.districtId = null;
    this.groupId = 8;
    this.userservice.getUserDetailsData(this.groupId, this.stateId, this.districtId).subscribe(
      (data) => {
        this.filtered = data;
        console.log(data)
        if (this.filtered.length != 0) {
          this.userData = this.snopipePipe.transform(this.userData, this.filtered);
          // $('#htmlData').show();
        }
        else if (this.filtered.length <= 0) {
          // $('#htmlData').hide();
          Swal.fire("", "No Record Found !", 'info');
        }
        // this.record = this.userData.length;
        // if (this.record > 0) {
        //   this.showPegi = true;
        // }
        // else {
        //   this.showPegi = false;
        // }
      }
    );
  }
  showPending: boolean = false;
  resultData: any;
  recordCount:any;
  getPendingFloat(event) {
    let user = event.target.value;
    this.paymentfreezeService.getPendingFloat(user).subscribe(
      (data) => {
        this.resData = data;
        console.log(this.resData);
        if (this.resData.status == 'success') {
          this.resultData = this.resData.data;
          this.recordCount = this.resultData.length;
          // if (this.recordCount > 0) {
            this.showPending = true;
          // } else {
          //   this.showPending = false;
          // }
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

  keyPress(event: KeyboardEvent) {
    const pattern = /'/;
    const inputChar = String.fromCharCode(event.charCode);
    if (pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
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
