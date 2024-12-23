import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { HeaderService } from '../header.service';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import { UnprocessedserviceService } from '../Services/unprocessedservice.service';
import { jsPDF } from 'jspdf';
import "jspdf-autotable";
import autoTable from 'jspdf-autotable';
import { TableUtil } from '../util/TableUtil';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-unprocessedfor-admin',
  templateUrl: './unprocessedfor-admin.component.html',
  styleUrls: ['./unprocessedfor-admin.component.scss']
})
export class UnprocessedforAdminComponent implements OnInit {
  currentPage: any;
  pageElement: any;
  showPegi: boolean;
  snoUserId: any;
  public snoList: any = [];
  public unprocessedList: any = [];
  keyword: any = 'fullName';
  constructor(
    private headerService: HeaderService, 
    private snoService: SnocreateserviceService,
    private unprocessed: UnprocessedserviceService,
    private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle('Unprocessed Claims ');
    this.currentPage = 1;
    this.pageElement = 10;
    $('.selectpicker').selectpicker();
    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
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
    let month: any
    var date = new Date();
    let year = date.getFullYear();
    let date1 = '01';
    if (date.getMonth() == 0) {
      year = year - 1;
      month = 11;
    } else {
      month = date.getMonth() - 1;
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
    var frstDay = date1 + "-" + month + "-" + year;
    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr("placeholder", "From Date *");
    $('input[name="toDate"]').attr("placeholder", "To Date *");
    this.getSNOList();
  }
  selectEvent(item) {
    // do something with selected item
    this.snoUserId = item.userId;
  }
  clearEvent() {
    this.snoUserId = '';
  }

  getSNOList() {

    this.snoService.getSNODetails().subscribe(
      (response) => {
        this.snoList = response;
        console.log(this.snoList);
      },
      (error) => console.log(error)
    )
  }
  onclickReset() {
    window.location.reload();
  }
  formdate: any;
  todate: any;
  snoId: any;
  user: any;
  record: any;
  onsearchmethode() {
    this.user = this.sessionService.decryptSessionData("user");
    this.formdate = $('#datepicker4').val();
    this.todate = $('#datepicker3').val();
    this.snoId = this.snoUserId;
    if(Date.parse(this.formdate)>Date.parse(this.todate)){
      this.swal('', 'Actual Discharge Date From should be Less Than Discharge Date To', 'error');
      return;
    }
    if (this.snoId == null || this.snoId == "" || this.snoId == undefined) {
      this.swal("Info", "Please select SNA Doctor Name", 'info');
      return;
    } else {
      this.unprocessed.getUnprocessedClaims(this.snoId, this.formdate, this.todate, this.user.userId).subscribe(
        (response) => {
          this.unprocessedList = response;
          this.record = this.unprocessedList.length;
          if (this.record > 0) {
            this.showPegi = true;
          }
          else {
            this.showPegi = false;
          }
        },
        (error) => console.log(error)
      )
    }
  }
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
    console.log(this.pageElement);
  }
  report: any = [];
  sno: any = {
    Slno: "",
    URN: "",
    claimno :"",
    PatientName: "",
    InvoiceNumber: "",
    hospitalname: "",
    hospitalcode: "",
    PackageCode: "",
    packageName: "",
    ActualDateOfAdmission: "",
    ActualDateOfDischarge: "",
    Cpdallocateddate: "",
    Amount: "",
  };
  heading = [['Sl#','URN','claim Number','Patient Name','Invoice Number','Hospital Name','Hospital Code','Package Code',
  'Package Name','Actual Date Of Admission','Actual Date Of Discharge','Cpd Alloted Date','Amount']];
  
  downloadReport(type: any){
    this.report = [];
    if(type == 'excel'){
    let claim: any;
      for(var i=0;i<this.unprocessedList.length;i++) {
        claim = this.unprocessedList[i];
        this.sno = [];
        this.sno.Slno = i+1;
        this.sno.URN = claim.urn;
        this.sno.claimno = claim.claim_no;
        this.sno.PatientName = claim.patientname;
        this.sno.InvoiceNumber = claim.invoiceno;
        this.sno.hospitalname = claim.hospital_name;
        this.sno.hospitalcode = claim.hospitalcode;
        this.sno.PackageCode = claim.packagecode;
        this.sno.packageName = claim.packagename;
        this.sno.ActualDateOfAdmission = this.convertDatefor(claim.actualdateofadmission);
        this.sno.ActualDateOfDischarge = this.convertDatefor(claim.actualdateofdischarge);
        this.sno.Cpdallocateddate = this.convertDate(claim.cpd_alloted_date);
        this.sno.Amount ='₹'+claim.currenttotalamount;
        this.report.push(this.sno); 
  }
  TableUtil.exportListToExcel(this.report, "Claims to Raise List", this.heading);
  }else if (type == 'pdf') {
    if(this.unprocessedList.length == 0){
      this.swal('','No Data Found', 'info');
      return;
    }
    let valuedate:any;
    let todate:any;
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    valuedate=this.formdate;
    todate=this.todate;
    if(valuedate == undefined || valuedate == null || valuedate == ''){
      valuedate = 'N/A';
    }
    if(todate == undefined || todate == null || todate == ''){
      todate = 'N/A';
    }
    let SlNo = 1;
    this.unprocessedList.forEach(element => {
      let rowData = [];
      rowData.push(SlNo++);
      rowData.push(element.urn);
      rowData.push(element.claim_no);
      rowData.push(element.patientname);
      rowData.push(element.invoiceno);
      rowData.push(element.hospital_name);
      rowData.push(element.hospitalcode);
      rowData.push(element.packagecode);
      rowData.push(element.packagename);
      rowData.push(this.convertDatefor(element.actualdateofadmission));
      rowData.push(this.convertDatefor(element.actualdateofdischarge));
      rowData.push(this.convertDate(element.cpd_alloted_date));
      rowData.push(element.currenttotalamount);
      this.report.push(rowData);
    });
    let doc = new jsPDF('l', 'mm', [238, 270]);
    doc.setFontSize(10);
    doc.text('Hospital Name :-'+this.user.fullName+'('+(this.user.userName)+')',5,5);
    doc.text('Actual Date of Discharge:-'+valuedate,5,10);
    doc.text('Discharge Date To:-'+todate,5,15);
    doc.text('Document Generate Date : ' + new Date().getDate() + ' ' + months[new Date().getMonth()] + ' ' + new Date().getFullYear() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds(),5, 20);
    doc.text('Unprocessed Claims',100,25);
    doc.setLineWidth(0.7);
    doc.line(100,26,132,26);
    autoTable(doc, {head: this.heading, body: this.report, startY:28, theme: 'grid',
    styles: {overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20},
    bodyStyles: {lineWidth: 0.1, lineColor: 0, textColor: 20},
    headStyles: {lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255] ,fillColor: [26, 99, 54]},
    columnStyles: {
      0: {cellWidth: 8},
      1: {cellWidth: 20},
      2: {cellWidth: 20},
      3: {cellWidth: 20},
      4: {cellWidth: 20},
      5: {cellWidth: 20},
      6: {cellWidth: 20},
      7: {cellWidth: 20},
      8: {cellWidth: 20},
      9: {cellWidth: 20},
      10: {cellWidth:20},
    }
  })
    doc.save('Unprocessed_Claims.pdf');
  }
  }

  convertDate(date) { 
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy, h:mm:ss a');
    return date;
  }

  convertDatefor(date) { 
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy');
    return date;
  }

  currency(amount) { 
    var amountPipe = new CurrencyPipe("en-US");
    amount = amountPipe.transform(amount, 'INR');
    return amount;
  }










  swal(title, text, icon) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
}
