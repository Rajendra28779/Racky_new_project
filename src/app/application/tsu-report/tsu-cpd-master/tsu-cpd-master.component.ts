import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../header.service';
import { CreatecpdserviceService } from '../../Services/createcpdservice.service';
import Swal from 'sweetalert2';
import { NavigationExtras, Router } from '@angular/router';
import { TableUtil } from '../../util/TableUtil';
import { DatePipe } from '@angular/common';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
declare let $: any;


@Component({
  selector: 'app-tsu-cpd-master',
  templateUrl: './tsu-cpd-master.component.html',
  styleUrls: ['./tsu-cpd-master.component.scss']
})
export class TsuCpdMasterComponent implements OnInit {

  cpdlist:any;
  currentPage: any;
  pageElement: any;
  showPegi: boolean;
  txtsearchDate: any;
  fromDate: any;
  toDate: any;

  constructor(private CreatecpdserviceService: CreatecpdserviceService,public headerService:HeaderService,
    private route:Router, public datepipe: DatePipe) { }

  ngOnInit(): void {
    this.headerService.setTitle('CPD Details Report');
    this.currentPage = 1;
    this.pageElement = 100;
    this.showPegi=true;
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
    var date = new Date();
    let year = date.getFullYear();
    let date1 = '01';
    let month: any = date.getMonth();
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

    //Date input placeholder
    $('input[name="fromDate"]').val('');
    $('input[name="fromDate"]').attr("placeholder", "Enter From Date");

    $('input[name="toDate"]').val('');
    $('input[name="toDate"]').attr("placeholder", "Enter To Date");
    this.getallcpdlist();
  }

  getallcpdlist() {
    this.CreatecpdserviceService.getcpdlist(this.fromDate, this.toDate,"").subscribe(data => {
      console.log(data);
      this.cpdlist=data;
    })
  }
  edit(item:any){
    let navigationExtras: NavigationExtras = {
      state: {
        user: item
      }
    };
    this.route.navigate(['application/createcpd'], navigationExtras);
  }
  ResetField() {
    window.location.reload();
  }
  onChange() {
    this.fromDate = $('#date3').val();
    this.toDate = $('#date4').val();

    if (this.fromDate == null || this.fromDate == "" || this.fromDate == undefined) {
      this.swal("Info", "Please Select Date of Joining From", 'info');
      return;
    }
    if (this.toDate == null || this.toDate == "" || this.toDate == undefined) {
      this.swal("Info", "Please Select Date of Joining To", 'info');
      return;
    }
    if (Date.parse(this.fromDate) > Date.parse(this.toDate)) {
      this.swal('Info', ' From Date should be less than To Date', 'info');
      return;
    }

    this.cpdlist = [];
    this.CreatecpdserviceService.getcpdlist(this.fromDate, this.toDate,"").subscribe(data => {
      console.log(data);
      this.cpdlist=data;
    })
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  report: any = [];
  cpd: any = {
    slNo: "",
    fullname: "",
    userName: "",
    mobile: "",
    email: "",
    license: "",
    status: "",
  };
  heading = [['Sl No', 'Full Name', 'Username', 'Mobile No', 'Email ID', 'Date Of Joining', 'License No', 'Status']];

  downloadReport(type: any) {
    if(this.cpdlist == "" || this.cpdlist == undefined || this.cpdlist.length==0)
    {
      this.swal('Info','No Data Found', 'info');
      return;
    }
    //console.log(this.cpdlist);
    this.report = [];
    if(type == 'excel'){
    let item: any;
    for(var i=0;i<this.cpdlist.length;i++) {
      item = this.cpdlist[i];
      console.log(item);
      this.cpd = [];
      this.cpd.slNo = i+1;
      this.cpd.fullname = item.fullName;
      this.cpd.userName = item.userName;
      this.cpd.mobile = item.mobileNo?item.mobileNo.toString():'-NA-';
      this.cpd.email = item.emailId?item.emailId:'-NA-';
      this.cpd.doj = this.datepipe.transform(item.dateofJoining, 'dd-MMM-yyyy');
      this.cpd.license = item.doctorLicenseNo?item.doctorLicenseNo:'-NA-';
      if(item.isActive == '0') {
        this.cpd.status = "Active";
      } else if(item.isActive == '1') {
        this.cpd.status = "Inactive";
      }
      this.report.push(this.cpd);
      console.log(this.report);
      console.log(this.cpd);
    }
    TableUtil.exportListToExcel(this.report, "CPD Details Report", this.heading);
  }
  else if(type == 'pdf'){
    if(this.cpdlist == "" || this.cpdlist == undefined || this.cpdlist.length==0)
    {
      this.swal('Info','No Data Found', 'info');
      return;
    }
    const doc = new jsPDF('p', 'mm', [240, 272]);
    doc.setFontSize(12);
    doc.text('CPD Details',5,10);
    doc.setLineWidth(0.7);
    doc.line(5,11,29,11);
    let pdfRpt = [];
    for(var x=0;x<this.cpdlist.length;x++) {
      var flt = this.cpdlist[x];
      var pdf = [];
      pdf[0] = x+1;
      pdf[1] = flt.fullName!=null?flt.fullName:'-NA-';
      pdf[2] = flt.userName!=null?flt.userName:'-NA-';
      pdf[3] = flt.mobileNo!=null?flt.mobileNo.toString():'-NA-';
      pdf[4] = flt.emailId!=null?flt.emailId:'-NA-';
      pdf[5] = this.datepipe.transform(flt.dateofJoining, 'dd-MMM-yyyy');
      pdf[6] = flt.doctorLicenseNo!=null?flt.doctorLicenseNo:'-NA-';
      if(flt.isActive=='0'){
        pdf[7] = "Active";
      }else if(flt.isActive == '1'){
        pdf[7] = "InActive";
      }
      pdfRpt.push(pdf);
    }
    console.log(pdfRpt);
    autoTable(doc, {
      head: this.heading,
      body: pdfRpt,
      startY:28,
      theme: 'grid',
      headStyles: {
        fillColor: [26, 99, 54]
      },

      columnStyles: {
        0: {cellWidth: 10},
        1: {cellWidth: 33},
        2: {cellWidth: 25},
        3: {cellWidth: 25},
        4: {cellWidth: 45},
        5: {cellWidth: 25},
        6: {cellWidth: 25},
        7: {cellWidth: 25},
        8: {cellWidth: 7},

      }
    });
    doc.save('CPD Details Report_'+'.pdf');
    }
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
}
