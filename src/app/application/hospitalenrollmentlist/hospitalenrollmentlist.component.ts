import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../header.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DcClaimService } from '../Services/dc-claim.service';
import { DatePipe, formatDate } from '@angular/common';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TableUtil } from '../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-hospitalenrollmentlist',
  templateUrl: './hospitalenrollmentlist.component.html',
  styleUrls: ['./hospitalenrollmentlist.component.scss']
})
export class HospitalenrollmentlistComponent implements OnInit {
  showPegi: boolean;
  currentPage: any;
  pageElement: any;
  txtsearchDate: any;
  fromDate: any;
  toDate: any;
  user: any;
  details: any = [];
  recoedCount: any;
  months: any;
  months2: any;
  year: any;
  secoundDay: any;
  frstDay: any;
  constructor(private headerService: HeaderService, public router: Router, private http: HttpClient, private dsService: DcClaimService,private sessionService: SessionStorageService
    ) { }
  ngOnInit(): void {
    this.headerService.setTitle('Hospital Enrollment List');
    this.user = this.sessionService.decryptSessionData("user");
    this.currentPage = 1;
    this.pageElement = 50;
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
    let date = new Date();
    let year = date.getFullYear();
    let date1 = '01';
    let month: any = date.getMonth() - 2;

    if(month == -1){
      this.months = 'Dec';
      this.year = year-1;
    } else if(month == -2){
      this.months = 'Nov';
      this.year = year-1;
    } else{
      this.months = this.getMonthFrom(month);
      this.year = year;
    }
    let date2 = date.getDate();
    this.months2=this.getMonthFrom( date.getMonth())
    this.frstDay = date1 + '-' + 'Jan' + '-' + 2024;
    this.secoundDay = date2 + "-" + this.months2 + "-" + year;

    $('input[name="fromDate"]').val(this.frstDay).attr('placeholder', 'From Date *');
    $('input[name="toDate"]').attr('placeholder', 'To Date *');
    this.getenrollment();
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
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
  urn:any;
  getenrollment() {
    this.fromDate = $('#datepicker4').val();
    this.toDate = $('#datepicker3').val();
    this.urn=$('#urn').val();
    if (this.urn == '' || this.urn == null || this.urn == undefined) {
      this.urn='';
    }
    if (Date.parse(this.fromDate) > Date.parse(this.toDate)) {
      this.swal('', 'Register From  should be Less Than Register To.', 'error');
      return;
    }
    this.dsService.gethospitralenrollmentlist(this.fromDate, this.toDate, this.user.userId,this.urn).subscribe(data => {
      this.details = data;
      this.recoedCount = this.details.length;
      if (this.details.length == 0) {
        this.showPegi = false;
      } else {
        this.showPegi = true;
      }
    }
    );

  }
  getRestdata() {
    window.location.reload();
  }
  onclaim(data: any) {
   let state ={
    fromdate:this.fromDate,
    todate:this.toDate,
    userid:this.user.userId,
    depregid:data.deprgid,
    acknowledgementnumber:data.acknowledgementno
   }
   localStorage.setItem("enrollmnent", JSON.stringify(state));
   this.router.navigate(['/application/hospitalenrollmentview/Action']);
  }
  dateconvert(date: any) {
    var datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'dd-MMM-yyyy');
  }
  dateconvertwithtimestamp(date: any) {
    var datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'dd-MMM-yyyy hh:mm:ss a');
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  report: any = [];
  sno: any = {
    Slno: "",
    URN: "",
    Name: "",
    Gender: "",
    Age: "",
    DateOfBirth: "",
    Registeron: "",
  };
  heading = [['Sl#', 'URN', 'Name', 'Gender', 'Age', 'Date Of Birth', 'Register On']];
  downloadReport(type: any) {
    this.report = [];
    if (type == 'excel') {
      let claim: any;
      for (var i = 0; i < this.details.length; i++) {
        claim = this.details[i];
        this.sno = [];
        this.sno.Slno = i + 1;
        this.sno.URN = claim.urn;
        this.sno.Name = claim.membername;
        this.sno.Gender = claim.gender;
        this.sno.Age = claim.age;
        this.sno.DateOfBirth = this.dateconvert(claim.dob);
        this.sno.Registeron = this.dateconvertwithtimestamp(claim.registrationdate);
        this.report.push(this.sno);
      }
      let filter1 = [];
      filter1.push([['Register From:-', this.fromDate]]);
      filter1.push([['Register To:-', this.toDate]]);
      if(this.urn == '' || this.urn == null || this.urn == undefined){
        filter1.push([['URN:-', 'N/A']]);
      }else{
        filter1.push([['URN:-', this.urn]]);
      }
      TableUtil.exportListToExcelWithFilterforhospitals(this.report, "Hospital Enrollment List", this.heading,filter1);
    } else if (type == 'pdf') {
      if (this.details.length == 0) {
        this.swal('', 'No Data Found', 'info');
        return;
      }
      let SlNo = 1;
      this.details.forEach(element =>{
        let rowData = [];
        rowData.push(SlNo);
        rowData.push(element.urn);
        rowData.push(element.membername);
        rowData.push(element.gender);
        rowData.push(element.age);
        rowData.push(this.dateconvert(element.dob));
        rowData.push(this.dateconvertwithtimestamp(element.registrationdate));
        this.report.push(rowData);
        SlNo++;
      });
      let doc = new jsPDF('l', 'mm', [238, 270]);
      doc.setFontSize(10);
      doc.text('Authority Name :-' + this.user.fullName, 5, 5);
      doc.text('Register From:-' + this.fromDate, 5, 10);
      doc.text('Register To:-' + this.toDate, 5, 15);
      if(this.urn == '' || this.urn == null || this.urn == undefined){
        doc.text('URN:-' + 'N/A', 5, 20);
      }else{
        doc.text('URN:-' + this.urn, 5, 20);
      }
      doc.text('Document Generate Date :-' +formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en').toString(),5,25);
      doc.text('Hospital Enrollment List',100,26);
      doc.setLineWidth(0.7);
      doc.line(100, 27, 138, 27);
      autoTable(doc, {
        head: this.heading, body: this.report, startY: 28, theme: 'grid',
        styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
        bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
        columnStyles: {
          0: { cellWidth: 20},
          1: { cellWidth: 30 },
          2: { cellWidth: 30 },
          3: { cellWidth: 20 },
          4: { cellWidth: 20 },
          5: { cellWidth: 20 },
          6: { cellWidth: 20 },
        }
      })
      doc.save('Hospital_Enrollment_List.pdf');
    }
  }
}
