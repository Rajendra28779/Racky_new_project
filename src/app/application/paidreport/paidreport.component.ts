import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Session } from 'inspector';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { HeaderService } from '../header.service';
import { PaidamountserviceService } from '../Services/paidamountservice.service';
import { SnamasterserviceService } from '../Services/snamasterservice.service';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import { TableUtil } from '../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;


@Component({
  selector: 'app-paidreport',
  templateUrl: './paidreport.component.html',
  styleUrls: ['./paidreport.component.scss']
})
export class PaidreportComponent implements OnInit {
  stateCode = "Odisha";
  state: any;
  district: any;
  hospital: any;
  hospitalId: any;
  districtId: any;
  stateId: any;
  keyword: any = "hospitalName";
  keyword1: any = "districtname";
  keyword2: any = "stateName";
  percentage: any;
  @ViewChild('auto') auto;
  @ViewChild('auto1') auto1;
  @ViewChild('auto2') auto2;
  public stateList: any = [];
  public districtList: any = [];
  public hospitalList: any = [];
  public paidList: any = [];
  user: any;
  record: any;
  showPegi: boolean;
  value: any;
  currentPage: any;
  pageElement: any;
  months: string;
  year: number;
  check: boolean = false;
  constructor(private sessionService: SessionStorageService,private headerService: HeaderService, public snoService: SnocreateserviceService,
    public paidamountserviceService: PaidamountserviceService, private route: Router) { }

  ngOnInit(): void {
    this.user = this.sessionService.decryptSessionData("user");
    if (this.user.groupId == 5) {
      this.headerService.setTitle('HospitalWise Paid Report');
    } else if (this.user.groupId == 6) {
      this.headerService.setTitle('Dc Paid Report');
    } else if (this.user.groupId == 1) {
      this.headerService.setTitle('Admin Paid Report');
    } else if (this.user.groupId == 8) {
      this.headerService.setTitle('FO Paid Report');
    }
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
    var date = new Date();
    let year = date.getFullYear();
    let date1 = '01';
    let month: any = date.getMonth();
    if(month == -1){
      this.months = 'Dec';
      this.year = year-1;
    }else{
      this.months = this.getMonthFrom(month);
      this.year = year;
    }
    var frstDay = date1 + '-' + this.months + '-' + this.year;
    //Date input placeholder
    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr("placeholder", "From Date *");
    // $('input[name="toDate"]').val('');
    $('input[name="toDate"]').attr("placeholder", "To Date *");
    this.getStateList();
    this.getpaidsearch();
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
  getStateList() {
    this.snoService.getStateList().subscribe(
      (response) => {
        this.stateList = response;
        console.log(this.stateList);
      },
      (error) => console.log(error)
    )
  }

  selectEvent2(item) {
    // do something with selected item
    this.stateId = item.stateCode;
    this.OnChangeState(this.stateId);
  }
  OnChangeState(id) {
    this.auto1.clear();
    this.auto.clear();
    this.districtId = '';
    this.hospitalId = '';
    this.auto.clear();
    this.hospitalList = [];
    localStorage.setItem("stateCode", id);
    this.snoService.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = response;
        console.log(response);
      },
      (error) => console.log(error)
    )
  }
  selectEvent1(item) {
    // do something with selected item
    this.districtId = item.districtcode;
    this.OnChangeDistrict(this.districtId);
  }
  OnChangeDistrict(id) {
    this.hospitalId = '';
    this.auto.clear();
    var stateCode = localStorage.getItem("stateCode");
    this.snoService.getHospitalbyDistrictId(id, stateCode).subscribe(
      (response) => {
        this.hospitalList = response;
        console.log(response);
      },
      (error) => console.log(error)
    )
  }
  selectEvent(item) {
    // do something with selected item
    this.hospitalId = item.hospitalCode;
  }
  clearEvent() {
    this.hospitalId = '';
  }
  clearEvent1() {
    this.districtId = '';
    this.OnChangeDistrict(this.districtId);
  }
  clearEvent2() {
    this.stateId = '';
    this.OnChangeState(this.stateId);
  }

  getReset() {
    // this.stateId = '';
    // this.districtId = '';
    // this.hospitalId = '';
    // this.auto.clear();
    // this.auto1.clear();
    // this.auto2.clear();
    // this.hospitalList = [];
    // this.districtList = [];
    // this.stateList = [];
    // this.getStateList();
    window.location.reload();
  }
  fromDate: any
  toDate: any
  flag: any
  getpaidsearch() {
    this.fromDate = $('#datepicker4').val();
    this.toDate = $('#datepicker3').val();

    if (this.user.groupId == 1) {
      this.stateId = this.stateId;
      this.districtId = this.districtId;
      this.hospitalId = this.hospitalId;
    }
    if (Date.parse(this.fromDate) > Date.parse(this.toDate)) {
      this.swal('', 'Discharge Date From should be Less Than Discharge Date To', 'error');
      return;
    }
    this.paidamountserviceService.getsearchdata(this.user.userId, this.user.userName, this.fromDate,
      this.toDate, this.user.groupId, this.stateId != undefined ? this.stateId : '', this.districtId != undefined ? this.districtId : '', this.hospitalId != undefined ? this.hospitalId : '').subscribe(
        (response) => {
          this.record = response;
          console.log("ok");
          this.paidList = JSON.parse(this.record.value);
          this.value = this.paidList.length;
          if (this.value > 0) {
            this.showPegi = true;
          }
          else {
            this.showPegi = false;
          }
        },
        (error) => {
          console.log(error);
          this.swal('', 'Something went wrong.', 'error');
        }
      );
  }
  report: any = [];
  sno: any = {
    Slno: "",
    PaymentDate: "",
    TotalDischarge: "",
    TotalPaidCase: "",
    TotalAmount: "",

  };
  heading = [['Sl#', 'Payment Date', 'Total Paid Case', 'Total Amount']];

  downloadReport(type: any) {
    this.report = [];
    if (type == 'excel') {
      let claim: any;
      for (var i = 0; i < this.paidList.length; i++) {
        claim = this.paidList[i];
        this.sno = [];
        this.sno.Slno = i + 1;
        if(claim.payment_date != 'N/A'){
          this.sno.PaymentDate = this.convertStringToDate(claim.payment_date != null ? claim.payment_date : 'N/A');
        }else if(claim.payment_date == 'N/A'){
        this.sno.PaymentDate = claim.payment_date != null ? claim.payment_date : 'N/A';
      }
        // this.sno.TotalDischarge = claim.total_discharge != null ? claim.total_discharge : 'N/A';
        this.sno.TotalPaidCase = claim.total_paid_case != null ? claim.total_paid_case : 'N/A';
        this.sno.TotalAmount = claim.total_amount != null ? claim.total_amount : 'N/A';
        this.report.push(this.sno);
      }
      if(this.user.groupId == 1){
      TableUtil.exportListToExcel(this.report, "Admin_Paid_Report", this.heading);
      }else if(this.user.groupId == 5){
        TableUtil.exportListToExcel(this.report, "HospitalWise_Paid_Report", this.heading);
      }else if(this.user.groupId == 8){
        TableUtil.exportListToExcel(this.report, "FO_Paid_Report", this.heading);
      }else if(this.user.groupId == 6){
        TableUtil.exportListToExcel(this.report, "DC_Paid_Report", this.heading);
      }
    } else if (type == 'pdf') {
      if (this.paidList.length == 0) {
        this.swal('', 'No Data Found', 'info');
        return;
      }
      let valuedate: any;
      let todate: any;
      let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      valuedate = this.fromDate;
      todate = this.toDate;
      if (valuedate == undefined || valuedate == null || valuedate == '') {
        valuedate = 'N/A';
      }
      if (todate == undefined || todate == null || todate == '') {
        todate = 'N/A';
      }
      let SlNo = 1;
      this.paidList.forEach(element => {
        let rowData = [];
        rowData.push(SlNo++);
        if(element.payment_date != 'N/A'){
        rowData.push(this.convertStringToDate(element.payment_date != null ? element.payment_date : 'N/A'));
        }else if(element.payment_date == 'N/A'){
        rowData.push(element.payment_date != null ? element.payment_date : 'N/A');
        }
        // rowData.push(element.total_discharge != null ? element.total_discharge : 'N/A');
        rowData.push(element.total_paid_case != null ? element.total_paid_case : 'N/A');
        rowData.push(this.convertCurrency(element.total_amount != null ? element.total_amount : 'N/A'));
        this.report.push(rowData);
      });
      let doc = new jsPDF('l', 'mm', [238, 270]);
      doc.setFontSize(10);
      if(this.user.groupId==1){
        doc.text('Authority Name :-' + this.user.fullName, 5, 5);
        }else if(this.user.groupId==5){
          doc.text('Hospital Name :-' + this.user.fullName + '(' + (this.user.userName) + ')', 5, 5);
        }else if(this.user.groupId==8){
          doc.text('FO Name :-' + this.user.fullName , 5, 5);
        }else if(this.user.groupId==6){
          doc.text('DC Name :-' + this.user.fullName , 5, 5);
        }
      doc.text('Actual Date of Discharge:-' + valuedate, 5, 10);
      doc.text('Discharge Date To:-' + todate, 5, 15);
      doc.text('Document Generate Date : ' + new Date().getDate() + ' ' + months[new Date().getMonth()] + ' ' + new Date().getFullYear() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds(), 5, 20);
      doc.text('Paid Report', 100, 25);
      doc.setLineWidth(0.7);
      doc.line(100, 26, 120, 26);
      autoTable(doc, {
        head: this.heading, body: this.report, startY: 28, theme: 'grid',
        styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
        bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 40 },
          2: { cellWidth: 40 },
          3: { cellWidth: 40 },
          4: { cellWidth: 40 },
          5: { cellWidth: 40 },
          6: { cellWidth: 40 },
        }
      })
      if(this.user.groupId==1){
      doc.save('Admin_Paid_Report.pdf');
      }else if(this.user.groupId==5){
      doc.save('HospitalWise_Paid_Report.pdf');
      }else if(this.user.groupId==8){
      doc.save('FO_Paid_Report.pdf');
      }else if(this.user.groupId==6){
      doc.save('DC_Paid_Report.pdf');
      }
    }
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  myFunction(paymentdate: any, number: any, totaldischarge: any) {
    this.sessionService.encryptSessionData("paymentdate", paymentdate)
    this.sessionService.encryptSessionData("number", number)
    this.sessionService.encryptSessionData("totaldischarge", totaldischarge)
    this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/paidreportdetails'); });
  }
  convertStringToDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy');
    return date;
    }
    convertCurrency(amount:any) {
      var formatter = new CurrencyPipe('en-US');
      amount=formatter.transform(amount, '', '');
      return amount;
      }
}




