import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../header.service';
import { SnoCLaimDetailsService } from '../Services/sno-claim-details.service';
import Swal from 'sweetalert2';
import { TableUtil } from '../util/TableUtil';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { DatePipe, formatDate } from '@angular/common';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;
@Component({
  selector: 'app-snabulkapprovedrevert',
  templateUrl: './snabulkapprovedrevert.component.html',
  styleUrls: ['./snabulkapprovedrevert.component.scss']
})
export class SnabulkapprovedrevertComponent implements OnInit {
  user: any;
  fromDate: any;
  toDate: any;
  txtsearchDate: any;
  data: any = [];
  showPegi: boolean;
  currentPage: any;
  pageElement: any;
  records: any;
  constructor(private http: HttpClient, private headerService: HeaderService, public snoService: SnoCLaimDetailsService,private sessionService: SessionStorageService) { }
  ngOnInit(): void {
    this.headerService.setTitle('Bulk Approval Revert');
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
    this.getbulklist();
  }

  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
  bulkappdata: any;
  getbulklist() {
    this.fromDate = $('#datepicker4').val();
    this.toDate = $('#datepicker3').val();
    let objectts = {
      fromDate: this.fromDate,
      todate: this.toDate,
      userid: this.user.userId
    }
    this.snoService.getBulkapprovalist(this.fromDate, this.toDate, this.user.userId).subscribe((data: any) => {
      this.bulkappdata = data;
      this.data = this.bulkappdata.details
      this.records = this.data.length;
      if (this.data.length > 0) {
        this.showPegi = true;
      } else {
        this.showPegi = false;
      }
    },
      (error) => {
        console.log(error);
        this.swal('Error', 'Something went wrong.', 'error');
      })
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  getreset() {
    window.location.reload();
  }
  report: any = [];
  sno: any = {
    Slno: "",
    URN: "",
    PatientName: "",
    packageName: "",
    Procedurename: "",
    ActualDateOfAdmission: "",
    ActualDateOfDischarge: "",
  };
  heading = [['Sl#', 'URN', 'Patient Name', 'Package Name', 'Procedure Name', 'Actual Date Of Admission', 'Actual Date Of Discharge']];
  downloadReport(type: any) {
    this.report = [];
    if (type == 'excel') {
      let claim: any;
      for (var i = 0; i < this.data.length; i++) {
        claim = this.data[i];
        this.sno = [];
        this.sno.Slno = i + 1;
        this.sno.URN = claim.urn;
        this.sno.PatientName = claim.patientname;
        this.sno.packageName = claim.packagename;
        this.sno.Procedurename = claim.procedurename;
        this.sno.ActualDateOfAdmission = this.Dateconvert(claim.actualdateofadmission);
        this.sno.ActualDateOfDischarge = this.Dateconvert(claim.actualdateofdischarge);
        this.report.push(this.sno);
      }
      let filter1 = [];
      filter1.push([['Actual Date of Discharge From:-', this.fromDate]]);
      filter1.push([['To:-', this.toDate]]);
      TableUtil.exportListToExcelWithFilterforadmin(this.report, "Bulk Approval Revert", this.heading, filter1);
    } else if (type == 'pdf') {
      if (this.data.length == 0) {
        this.swal('', 'No Data Found', 'info');
        return;
      }
      let SlNo = 1;
      this.data.forEach(element => {
        let rowData = [];
        rowData.push(SlNo++);
        rowData.push(element.urn);
        rowData.push(element.patientname);
        rowData.push(element.packagename);
        rowData.push(element.procedurename);
        rowData.push(this.Dateconvert(element.actualdateofadmission));
        rowData.push(this.Dateconvert(element.actualdateofdischarge));
        this.report.push(rowData);
      });
      let doc = new jsPDF('l', 'mm', [238, 270]);
      doc.setFontSize(10);
      doc.text('Authority Name :-' + this.user.fullName, 5, 5);
      doc.text('Actual Date of Discharge From:-' + this.fromDate, 5, 10);
      doc.text('To:-' + this.toDate, 5, 15);
      doc.text('Document Generate Date :-' + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en').toString(), 5, 20);
      doc.text('Bulk Approval Revert', 100, 25);
      doc.setLineWidth(0.7);
      doc.line(100, 26, 132, 26);
      autoTable(doc, {
        head: this.heading, body: this.report, startY: 28, theme: 'grid',
        styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
        bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 30 },
          2: { cellWidth: 30 },
          3: { cellWidth: 40 },
          4: { cellWidth: 40 },
          5: { cellWidth: 30 },
          6: { cellWidth: 30 },
        }
      })
      doc.save('Bulk_Approval_Revert.pdf');
    }
  }
  Dateconvert(date) {
    var datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'dd-MMM-yyyy');
  }
  getrevertdata() {
    let data = {
      formdate: this.fromDate,
      todate: this.toDate,
      userid: this.user.userId
    }
    Swal.fire({
      title: '',
      text: 'Are you sure To Revert it' + '?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes Revert it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.snoService.getBulkrevertsubmit(data).subscribe((data: any) => {
          if (data.status == 'Success') {
            Swal.fire({
              title: data.message,
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'ok',
              allowOutsideClick: false
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.reload();
              } else {
                window.location.reload();
              }
            }
            );
          } else if (data.status == 'Failed') {
            this.swal("error", "Something Went Wrong", 'error');
          }
        }, (error) => {
          console.log(error);
          this.swal('Error', 'Something went wrong.', 'error');
        });
      }
    });
  }
}
