import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { PaymentfreezeserviceService } from '../../Services/paymentfreezeservice.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { TableUtil } from '../../util/TableUtil';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;


@Component({
  selector: 'app-hospitalwise-float-list',
  templateUrl: './hospitalwise-float-list.component.html',
  styleUrls: ['./hospitalwise-float-list.component.scss']
})
export class HospitalwiseFloatListComponent implements OnInit {
  public snoList: any = [];
  snoUserId: any;
  keyword: any = 'fullName';
  months: any;
  year: any;
  months2: any;
  frstDay: string;
  secoundDay: string;
  formdate: any;
  todate: any;
  record: any;
  resData: any;
  sonid:any;
  txtsearchDate: any;
  hospitalwisefloatList: any = [];
  user:any;
  groupId: any;
  showPegi: boolean;
  pageElement: any;
  currentPage: any;

  constructor(   public headerService: HeaderService,
    public paymentfreezeService: PaymentfreezeserviceService,
    public route: Router,
    private snoConfigService: SnocreateserviceService,private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle('Hospital Wise Float List');
    this.user = this.sessionService.decryptSessionData("user");
    this.currentPage = 1;
    this.pageElement = 100;
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
    this.getSNOList();
    this.gethospitalwieseFloatList();

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
  authMode: any;
  changeAuthMode(event : any) {
    this.authMode = event.target.value;
  }
  gethospitalwieseFloatList(){
    this.formdate = $('#datepicker1').val();
    this.todate = $('#datepicker2').val();
    this.sonid=this.snoUserId;
    let authMode = $('#authMode').val();
    if(Date.parse(this.formdate)>Date.parse(this.todate)){
      this.swal('', 'From Date Should Be Less Than To Date', 'error');
      return;
    }
    if (this.sonid == null || this.sonid == "" || this.sonid == undefined) {
       this.sonid ="";
    }
    if (this.authMode == null || this.authMode == "" || this.authMode == undefined) {
      this.authMode ="";
   }
   this.paymentfreezeService.getFloatList(this.groupId,this.formdate,this.todate,this.sonid,this.user.userId,authMode).subscribe(
    (data) => {
      this.resData = data;
      console.log(+JSON.stringify(data));
      if (this.resData.status == 'success') {
        this.hospitalwisefloatList = this.resData.data;
        this.record = this.hospitalwisefloatList.length;
        if (this.record > 0) {
          this.showPegi = true;
        } else {
          this.showPegi = false;
        }
      }else if(this.resData.status == 'failed'){
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
  onAction(floatNumber) {
    let Searchtype=$('#authMode').val();
    this.sessionService.encryptSessionData('Searchtype', Searchtype);
    this.sessionService.encryptSessionData('floatNumber', floatNumber);
    this.sessionService.encryptSessionData('currentPageNum', this.currentPage);
    this.route.navigate(['/application/floatdetails']);
  }
  onhospitalwiselist(){
    window.location.reload();

  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  reporthospital: any = [];
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
  downloadReport(type:any) {
    this.reporthospital = [];
    if(type == 'excel'){
    let claim: any;
    for (var i = 0; i < this.hospitalwisefloatList.length; i++) {
      claim = this.hospitalwisefloatList[i];
      this.sno = [];
      this.sno.Slno = i + 1;
      this.sno.FloatNumber = claim.floateno;
      this.sno.GenerateBy = claim.fullname;
      this.sno.GenerateOn = this.convertStringToDate(claim.createon);
      this.sno.Amount = claim.amount;
      this.sno.VerifyStatus = claim.isVerified;
      this.reporthospital.push(this.sno);
    }
    let filter =[];
    filter.push([['Float Number',this.hospitalwisefloatList[0].floateno]]);
    filter.push([['Float Generated By',this.hospitalwisefloatList[0].fullname]]);
    TableUtil.exportListToExcelWithFilter(this.reporthospital,'Float_List_Hospitalwise',this.heading,filter);
  }else if(type == 'pdf'){
    if(this.hospitalwisefloatList.length == 0){
      this.swal('','No Data Found', 'info');
      return;
    }
    let valuedate:any;
    let todate:any;
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();

    valuedate=this.formdate;
    todate=this.todate;
    if(valuedate == undefined || valuedate == null || valuedate == ''){
      valuedate = 'N/A';
    }
    if(todate == undefined || todate == null || todate == ''){
      todate = 'N/A';
    }
    let SlNo = 1;
    this.hospitalwisefloatList.forEach(element => {
      let rowData = [];
      rowData.push(SlNo++);
      rowData.push(element.floateno);
      rowData.push(element.fullname);
      rowData.push(this.convertStringToDate(element.createon));
      rowData.push(element.amount);
      rowData.push(element.isVerified);
      this.reporthospital.push(rowData);
    });
    let doc = new jsPDF('l', 'mm', [238, 270]);
    doc.setFontSize(10);
    doc.text('Generated By :-'+this.user.fullName,5,5);
    doc.text('Float From Date:-'+valuedate,5,10);
    doc.text('Float To Date:-'+todate,5,15);
    doc.text('Generate On : ' + generatedOn,5, 20);
    doc.text('Float List Hospitalwise',100,25);
    doc.setLineWidth(0.7);
    doc.line(100,26,124,26);
    autoTable(doc, {head: this.heading, body: this.reporthospital, startY:28, theme: 'grid',
    styles: {overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20},
    bodyStyles: {lineWidth: 0.1, lineColor: 0, textColor: 20},
    headStyles: {lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255] ,fillColor: [26, 99, 54]},
    columnStyles: {
      0: {cellWidth: 10},
      1: {cellWidth: 40},
      2: {cellWidth: 50},
      3: {cellWidth: 30},
      4: {cellWidth: 30},
    }
  })
    doc.save('Float_List_Hospitalwise.pdf');
  }
}
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>(
      document.getElementById('pageItem')
    )).value;
    console.log(this.pageElement);
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
  convertStringToDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy hh:mm:ss a');
    return date;
  }

  getfloatdetailsHospitalwise(floatnumber:any){
    this.sessionService.encryptSessionData('hospitalwisefloatnumber',floatnumber);
    this.sessionService.encryptSessionData('Date',this.formdate);
    this.route.navigate([]).then((result) => {
      window.open(environment.routingUrl + '/hospitalwisefloatnumberDetails');
    });
    // this.route.navigate(['/application/hospitalwisefloatnumberDetails']);
  }
}

