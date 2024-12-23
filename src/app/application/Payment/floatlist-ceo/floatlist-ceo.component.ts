import { Component, OnInit, ViewChild } from '@angular/core';
import { PaymentfreezeserviceService } from '../../Services/paymentfreezeservice.service';
import { Router } from '@angular/router';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { SnopipePipe } from '../../pipes/snopipe.pipe';
import { UsercreateService } from '../../Services/usercreate.service';
import { HeaderService } from '../../header.service';
import Swal from 'sweetalert2';
import autoTable from 'jspdf-autotable';
import { DatePipe, formatDate } from '@angular/common';
import { TableUtil } from '../../util/TableUtil';
import jsPDF from 'jspdf';
import { environment } from 'src/environments/environment';
import { FormControl, FormGroup } from '@angular/forms';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-floatlist-ceo',
  templateUrl: './floatlist-ceo.component.html',
  styleUrls: ['./floatlist-ceo.component.scss']
})
export class FloatlistCeoComponent implements OnInit {
  Status: any;
  floatList: any = [];
  pageElement: any;
  currentPage: any;
  txtsearchDate: any;
  showPegi: boolean;
  groupId: any;
  authMode: any;
  public snoList: any = [];
  snoUserId: any = '';
  keyword: any = 'fullName';
  year: any;
  months2: any;
  frstDay: string;
  secoundDay: string;
  user: any;
  summary: any;
  months: any;
  show: boolean = false;
  hideStatus: boolean = false;
  maxChars = 1000;
  @ViewChild('closebutton') closebutton;
  constructor(public paymentfreezeService: PaymentfreezeserviceService,
    public route: Router,
    private snoConfigService: SnocreateserviceService,
    private snopipePipe: SnopipePipe,
    private userservice: UsercreateService,
    public headerService: HeaderService,private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.Status = 'A';
    this.headerService.setTitle('Float List(CEO)');
    this.user = this.sessionService.decryptSessionData("user");
    this.currentPage = 1;
    this.pageElement = 100;
    sessionStorage.removeItem('floatNumber');
    // $('.selectpicker').selectpicker();

    // $('.datepicker').datetimepicker({
    //   format: 'DD-MMM-YYYY',
    //   maxDate: new Date(),
    //   daysOfWeekDisabled: ['', 7],
    // });
    // $('.timepicker').datetimepicker({
    //   format: 'LT',
    //   daysOfWeekDisabled: ['', 7],
    // });
    // $('.datetimepicker').datetimepicker({
    //   format: 'DD-MMM-YYYY LT',
    //   daysOfWeekDisabled: ['', 7],
    // });
    // var date = new Date();
    // let year = date.getFullYear();
    // let date1 = '01';
    // let month: any = date.getMonth() - 1;
    // if (month == -1) {
    //   this.months = 'Dec';
    //   this.year = year - 1;
    // } else {
    //   this.months = this.getMonthFrom(month);
    //   this.year = year;
    // }
    // let date2 = date.getDate();
    // this.months2 = this.getMonthFrom(date.getMonth());
    // this.frstDay = date1 + '-' + this.months + '-' + this.year;
    // this.secoundDay = date2 + '-' + this.months2 + '-' + year;
    // $('input[name="fromDate"]').val(this.frstDay);
    // $('input[name="fromDate"]').attr('placeholder', 'From Date *');
    // $('input[name="toDate"]').attr('placeholder', 'To Date *');
    this.groupId = this.user.groupId;
    this.getSNOList();
    this.getfloatceo();
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
  formdate: any;
  todate: any;
  record: any;
  resData: any;
  sonid: any;
  getfloatceo() {
    this.floatList=[];
    $('#allCheck').prop('checked', false);
    this.formdate = "01-Jan-1990";
    this.todate = formatDate(new Date(), 'dd-MMM-yyyy', 'en-US').toString()
    this.sonid = this.snoUserId;
    this.authMode = $('#authMode').val();
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
    this.paymentfreezeService.getFloatList(this.groupId, this.formdate, this.todate, this.sonid, this.user.userId, this.authMode).subscribe(
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
  onresetrecord() {
    window.location.reload();
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  dataIdArray: any = [];
  checkAllCheckBox(event: any) {
    if (event.target.checked) {
      for (let i = 0; i < this.floatList.length; i++) {
        $('#' + this.floatList[i].floateId).prop('checked', true);
        this.dataIdArray.push(this.floatList[i].floateId);
      }
    } else {
      for (let i = 0; i < this.floatList.length; i++) {
        $('#' + this.floatList[i].floateId).prop('checked', false);
        this.dataIdArray = [];
      }
    }
    this.dataIdArray = this.dataIdArray.filter(
      (value, index) => this.dataIdArray.indexOf(value) === index
    );
    if (this.dataIdArray.length > 0) {
      this.show = true;
      this.hideStatus = true;
    } else {
      this.show = false;
      this.hideStatus = false;
    }
  }
  tdCheck(event: any, floateId) {
    if (event.target.checked) {
      this.dataIdArray.push(floateId);
    } else {
      for (let i = 0; i < this.dataIdArray.length; i++) {
        if (this.dataIdArray[i] == floateId) {
          this.dataIdArray.splice(i, 1);
        }
      }
    }
    if (this.dataIdArray.length == this.floatList.length) {
      $('#allCheck').prop('checked', true);
      this.hideStatus = true;
    } else {
      $('#allCheck').prop('checked', false);
      this.hideStatus = false;
    }
    if (this.dataIdArray.length > 0) {
      this.show = true;
      this.hideStatus = true;
    } else {
      this.show = false;
      this.hideStatus = false;
    }
    this.dataIdArray = this.dataIdArray.filter(
      (value, index) => this.dataIdArray.indexOf(value) === index
    );
  }
  convertStringToDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy hh:mm:ss a');
    return date;
  }
  report: any = [];
  sno: any = {
    Slno: '',
    FloatNumber: '',
    GenerateOn: '',
    GenerateBy: '',
    snadoctornames: '',
    Remarks: '',
    remarkby: '',
    TotalClaimCount: '',
    Amount: '',
    VerifyStatus: '',
  };
  heading = [
    [
      'Slno',
      'Float Number',
      'Generate On',
      'Generate By',
      'SNA Doctor Name',
      'Remarks',
      'Remark By',
      'Total Claim Count',
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
        this.sno.GenerateOn = this.convertStringToDate(claim.createon);
        this.sno.GenerateBy = claim.fullname;
        this.sno.snadoctornames = claim.snaFullName;
        this.sno.Remarks = claim.remarks;
        this.sno.remarkby = claim.remarkby;
        this.sno.TotalClaimCount=claim.count;
        this.sno.Amount = claim.amount;
        this.sno.VerifyStatus = claim.isVerified;
        this.report.push(this.sno);
      }
      let filter = [];
      filter.push([['Float Generation Date From', this.formdate]]);
      filter.push([['Float Generation Date To', this.todate]]);
      if(this.authMode==11){
        filter.push([['Float Type', 'NEW']]);
      }else{
        filter.push([['Float Type', 'Observation']]);
      }
      if(this.sonid!=null||this.sonid!=undefined|| this.sonid!=''){
        filter.push([['SNA Doctor Name', this.snoList.fullName]]);
      }else if(this.sonid==null||this.sonid==undefined|| this.sonid==''){
        filter.push([['SNA Doctor Name', 'All']]);
      }
      TableUtil.exportListToExcelWithFilter(this.report, 'Float_List_ceo', this.heading, filter);
    } else if (type == 'pdf') {
      if (this.floatList.length == 0) {
        this.swal('', 'No Data Found', 'info');
        return;
      }
      let valuedate: any;
      let todate: any;
      let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
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
        rowData.push(SlNo++);
        rowData.push(element.floateno);
        rowData.push(this.convertStringToDate(element.createon));
        rowData.push(element.fullname);
        rowData.push(element.snaFullName);
        rowData.push(element.remarks);
        rowData.push(element.remarkby);
        rowData.push(element.count);
        rowData.push(element.amount);
        rowData.push(element.isVerified);
        this.report.push(rowData);
      });
      let doc = new jsPDF('l', 'mm', [238, 270]);
      doc.setFontSize(10);
      doc.text('Generated By :-' + this.user.fullName, 5, 5);
      doc.text('Float Generation Date From:-' + valuedate, 5, 10);
      doc.text('Float Generation Date To:-' + todate, 5, 15);
      if(this.authMode==11){
        doc.text('Float Type:-' + 'NEW', 5, 20);
      }else{
        doc.text('Float Type:-' + 'Observation', 5, 20);
      }
      if(this.sonid!=null||this.sonid!=undefined|| this.sonid!=''){
        doc.text('SNA Doctor Name:-' + this.snoList.fullName, 5, 25);
      }else if(this.sonid==null||this.sonid==undefined|| this.sonid==''){
        doc.text('SNA Doctor Name:-' + 'All', 5, 25);
      }
      doc.text('Generate On : ' + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString(), 5, 30);
      doc.text('Float List (CEO)', 100, 35);
      doc.setLineWidth(0.7);
      doc.line(100,36, 122, 36);
      autoTable(doc, {
        head: this.heading, body: this.report, startY:37, theme: 'grid',
        styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
        bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 30 },
          2: { cellWidth: 20 },
          3: { cellWidth: 30 },
          4: { cellWidth: 30 },
          5: { cellWidth: 30 },
          6: { cellWidth: 20 },
        }
      })
      doc.save('Float_List_ceo.pdf');
    }
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
    this.sessionService.encryptSessionData('currentPageNum',this.currentPage);
    this.route.navigate(['/application/floatReport']);
  }
  getfloatdetailsHospitalwise(floatnumber: any) {
    this.sessionService.encryptSessionData('hospitalwisefloatnumber', floatnumber);
    this.sessionService.encryptSessionData('Date', this.formdate);
    this.route.navigate([]).then((result) => {
      window.open(environment.routingUrl + '/hospitalwisefloatnumberDetails');
    });
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>(
      document.getElementById('pageItem')
    )).value;
    console.log(this.pageElement);
  }
  onAction(floatNumber) {
    let authMode = $('#authMode').val();
    sessionStorage.removeItem('Searchtype');
    sessionStorage.removeItem('floatNumber');
    sessionStorage.removeItem('Status');
    sessionStorage.removeItem('currentPageNum');
    this.sessionService.encryptSessionData('Searchtype', authMode);
    this.sessionService.encryptSessionData('floatNumber', floatNumber);
    this.sessionService.encryptSessionData('Status', this.Status);
    this.sessionService.encryptSessionData('currentPageNum', this.currentPage);
    this.route.navigate(['/application/floatdetails']);
  }
  remarks: any;
  myGroup = new FormGroup({
    remarks: new FormControl(),
  });
  showPending: boolean = false;
  cancel() {
    $('#userId').val('');
    this.showPending = false;
  }
  keyPress(event: KeyboardEvent) {
    const pattern = /'/;
    const inputChar = String.fromCharCode(event.charCode);
    if (pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  verifyFlag: any;
  remark:any
  submitByFoCeo(){
    this.verifyFlag = $('#floatceostatus').val();
    this.remark = $('#remarks').val();
    if(this.verifyFlag == null || this.verifyFlag == '' || this.verifyFlag == undefined){
      this.swal('Error', 'Please Select Action', 'error');
      return;
    }
    // $('#assignFo1').show();
    $('#btn').click();
  }
  floatFile: any;
  submit() {
    let verifyFlag = $('#floatceostatus').val();
    this.sonid = this.user.userId;
    let remark = $('#remarks').val();
    this.floatFile = '';
    if (remark == null || remark == '' || remark == undefined) {
      // $("#remarks").focus();
      // this.swal('Info', 'Please provide remarks', 'info');
      // return;
    } else {
      const pattern = /'/;
      if (pattern.test(this.remarks)) {
        $("#remarks").focus();
        this.swal('Error', 'Special character is not allowed', 'error');
        return;
      }
    }
    Swal.fire({
      title: 'Are You Sure?',
      text: 'You want to forward the selected float(s)!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append('floatList', this.dataIdArray);
        formData.append('remark', remark);
        formData.append('pendingAt', verifyFlag);
        formData.append('userId', this.user.userId);
        formData.append('floatFile', this.floatFile);
        this.paymentfreezeService.forwardFloat(formData).subscribe(
          (data) => {
            this.resData = data;
            console.log(this.resData);
            if (this.resData.status == 'success') {
              this.swal('Success', 'Float Submitted Successfully.', 'success');
              this.getfloatceo();
              $('#allCheck').prop('checked', false);
              this.closebutton.nativeElement.click();
              this.show = false;
              this.hideStatus = false;
            } else {
              this.swal('Error', 'Something went wrong.', 'error');
            }
          },
          (error) => {
            console.log(error);
            this.swal('Error', 'Something went wrong.', 'error');
          }
        );
      }
    });
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
