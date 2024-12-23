import { formatDate } from '@angular/common';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { HeaderService } from '../header.service';
import { SnafloatgenerationserviceService } from '../snafloatgenerationservice.service';
import { TableUtil } from '../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-snafloatedetailsforrevert',
  templateUrl: './snafloatedetailsforrevert.component.html',
  styleUrls: ['./snafloatedetailsforrevert.component.scss']
})
export class SnafloatedetailsforrevertComponent implements OnInit {
  countfloate: any;
  childmessage: any;
  txtsearchDate: any;
  showPegi: boolean = false;
  pageElement: any;
  currentPage: any;
  floate: any;
  formdate: any;
  toDate: any;
  user: any;
  state: any;
  floateno: any;

  constructor(private route: Router, public headerService: HeaderService,
    private snafloatgenerationservice: SnafloatgenerationserviceService,private sessionService: SessionStorageService) {
    this.state = this.route.getCurrentNavigation().extras.state;
  }

  ngOnInit(): void {
    this.headerService.setTitle('Float Revert');
    this.user = this.sessionService.decryptSessionData("user");
    this.headerService.isBack(false);
    this.formdate = this.state.from
    this.toDate = this.state.todate
    this.floateno = this.state.float
    this.floatedetails();
  }

  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }
  reset() {
    this.ngOnInit();
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  floatedetails() {
    if (Date.parse(this.formdate) > Date.parse(this.toDate)) {
      this.swal('', ' From Date should be less To Date', 'error');
      return;
    }
    this.snafloatgenerationservice.SnaFloatDataforrevert(this.formdate, this.toDate, this.floateno, this.user.userId).subscribe((res: any) => {
      console.log(res);
      if (res.status == 200) {
        this.floate = res.data;
        this.countfloate = this.floate.length;
        if (this.countfloate > 0) {
          this.showPegi = true;
          this.pageElement = 50
          this.currentPage = 1
        }
        else {
          this.showPegi = false;
        }
      } else {
        this.swal('Error', "Some Error Happen", "error");
      }

    });
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

  revert() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to Revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Revert it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.formdate = $('#fromDate').val();
        this.toDate = $('#toDate').val();
        if (Date.parse(this.formdate) > Date.parse(this.toDate)) {
          this.swal('', ' From Date should be less To Date', 'info');
          return;
        }
        this.snafloatgenerationservice.SnaFloatrevert(this.formdate, this.toDate, this.floateno, this.user.userId).subscribe((res: any) => {
          if (res.status == 200) {
            this.swal('Success', res.message, "success");
            this.floatedetails();
          } else {
            this.swal('Error', "Some Error Happen", "error");
          }
        });
      }
    });
  }

  report: any = [];

  heading = [['Sl#',
    'Claim No',
    'Case No',
    'Hospital Name',
    'Actual Date Of Admission',
    'Actual Date Of Discharge',
    'CPD Approved Amount',
    'CPD Action Date',
    'SNA Approved Amount',
    'Remarks'
  ]];
  sno: any = {
    Slno: "",
    clm: "",
    case: "",
    hosp: "",
    adadm: "",
    addis: "",
    cpdapprvdate: "",
    cpdactiondate: "",
    snaapprvdate: "",
    remark: "",
  };

  downloadList(no: any) {
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy = this.user.fullName;
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.floate.length; i++) {
      sna = this.floate[i];
      this.sno = [];
      this.sno.Slno = i + 1;
      this.sno.clm = sna.claimNo;
      this.sno.case = sna.caseno;
      this.sno.hosp = sna.hospitalName;
      this.sno.adadm = sna.actualDateAdm;
      this.sno.addis = sna.actualDischarge;
      this.sno.cpdapprvdate = sna.cpdappAmount;
      this.sno.cpdactiondate = sna.cpdActionDate;
      this.sno.snaapprvdate = sna.snaapprovemount;
      this.sno.remark = sna.remark;
      this.report.push(this.sno);
    }
    if (no == 1) {
      let filter = [];
      filter.push([['Actual Date Of Discharge From', this.formdate]]);
      filter.push([['Actual Date Of Discharge To', this.toDate]]);
      filter.push([['Floate No.', this.floateno]]);
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'Float_Revert_List',
        this.heading, filter
      );
    } else {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('l', 'mm', [297, 210]);
      doc.setFontSize(20);
      doc.text("Float_Revert_List", 120, 15);
      doc.setFontSize(12);
      doc.text('Actual Date Of Discharge From :- ' + this.formdate, 15, 25);
      doc.text('Actual Date Of Discharge To :- ' + this.toDate, 180, 25);
      doc.text('Float No. :- ' + this.floateno, 15, 33);
      doc.text('GeneratedOn :- ' + generatedOn, 180, 41);
      doc.text('GeneratedBy :- ' + generatedBy, 15, 41);
      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.Slno;
        pdf[1] = clm.clm;
        pdf[2] = clm.case;
        pdf[3] = clm.hosp;
        pdf[4] = clm.adadm;
        pdf[5] = clm.addis;
        pdf[6] = clm.cpdapprvdate;
        pdf[7] = clm.cpdactiondate;
        pdf[8] = clm.snaapprvdate;
        pdf[9] = clm.remark;
        rows.push(pdf);
      }
      autoTable(doc, {
        head: this.heading,
        body: rows,
        theme: 'grid',
        startY: 46,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },
          3: { cellWidth: 40 }
        }
      });
      doc.save('Float_Revert_List.pdf');
    }
  }
}

