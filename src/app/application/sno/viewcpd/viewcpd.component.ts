import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../header.service';
import { CreatecpdserviceService } from '../../Services/createcpdservice.service';
import Swal from 'sweetalert2';
import { NavigationExtras, Router } from '@angular/router';
import { TableUtil } from '../../util/TableUtil';
import { DatePipe } from '@angular/common';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-viewcpd',
  templateUrl: './viewcpd.component.html',
  styleUrls: ['./viewcpd.component.scss']
})
export class ViewcpdComponent implements OnInit {
  cpdlist: any;
  currentPage: any;
  pageElement: any;
  showPegi: boolean;
  txtsearchDate: any;
  fromDate: any;
  toDate: any;
  record: any;
  fDate: any = '--';
  tDate: any = '--';
  status:any="";
  user:any;
  constructor(private sessionService: SessionStorageService,private CreatecpdserviceService: CreatecpdserviceService, public headerService: HeaderService,
    private route: Router, public datepipe: DatePipe) { }

  ngOnInit(): void {
    this.headerService.setTitle('CPD Details');
    this.user = this.sessionService.decryptSessionData("user");
    this.currentPage = 1;
    this.pageElement = 100;
    this.showPegi = true;
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
    let frstDay = date1 + "-" + month + "-" + year;
    $('input[name="fromDate"]').val('');
    $('input[name="fromDate"]').attr("placeholder", "Enter From Date");
    $('input[name="toDate"]').val('');
    $('input[name="toDate"]').attr("placeholder", "Enter To Date");
    this.getallcpdlist();
  }

  getallcpdlist() {
    this.status=$('#status').val();
    this.CreatecpdserviceService.getcpdlist(this.fromDate, this.toDate,this.status).subscribe(data => {
      this.cpdlist = data;
      this.record = this.cpdlist.length;
      if (this.record > 0) {
        this.showPegi = true;
        this.currentPage = 1
        this.pageElement = 100;
      } else {
        this.showPegi = false;
      }
    })
  }

  edit(item: any) {
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
    this.fDate = this.fromDate;
    this.tDate = this.toDate;
    this.status=$('#status').val();
    this.CreatecpdserviceService.getcpdlist(this.fromDate, this.toDate,this.status).subscribe(data => {
      this.cpdlist = data;
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
  downloadReport(type) {
    this.report = [];
    let item: any;
    for (let i = 0; i < this.cpdlist.length; i++) {
      item = this.cpdlist[i];
      this.cpd = [];
      this.cpd.slNo = i + 1;
      this.cpd.fullname = item.fullName;
      this.cpd.userName = item.userName;
      this.cpd.mobile = item.mobileNo ? item.mobileNo.toString() : '-NA-';
      this.cpd.email = item.emailId ? item.emailId : '-NA-';
      this.cpd.doj = this.datepipe.transform(item.dateofJoining, 'dd-MMM-yyyy');
      this.cpd.license = item.doctorLicenseNo ? item.doctorLicenseNo : '-NA-';
      if (item.isActive == '0') {
        this.cpd.status = "Active";
      } else if (item.isActive == '1') {
        this.cpd.status = "Inactive";
      }
      this.report.push(this.cpd);
    }

let status="All";
if(this.status==""){
  status="All";
}else if(this.status==0){
  status="Active";
}else if(this.status==1){
  status="Inactive";
}else{
  status="All";
}
    if (type == 1) {
      let filter = [];
      filter.push([['Date of Joining From', this.fDate]]);
      filter.push([['Date of Joining To', this.tDate]]);
      filter.push([['Status', status]]);
      TableUtil.exportListToExcelWithFilter(this.report, "View CPD List", this.heading, filter);
    } else if (type == 2) {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      let doc = new jsPDF('l', 'mm', [300, 240]);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text("View CPD List", 130, 15);
      doc.setFontSize(12);
      doc.text("Date Of Joining From :-" + this.fDate, 20, 25);
      doc.text("Date Of Joining To:-" + this.tDate, 20, 30);
      doc.text("Status :- "+ status, 20, 35);
      doc.text("Generated By: " + this.user.fullName, 20, 40);
      doc.text("Generated On: " + this.convertDate(new Date()), 20, 45);
      let rows = [];
      for (let i = 0; i < this.report.length; i++) {
        let clm = this.report[i];
        let pdf = [];
        pdf[0] = clm.slNo;
        pdf[1] = clm.fullname;
        pdf[2] = clm.userName;
        pdf[3] = clm.mobile;
        pdf[4] = clm.email;
        pdf[5] = clm.doj;
        pdf[6] = clm.license;
        pdf[7] = clm.status;
        rows.push(pdf);
      }
      autoTable(doc, {
        head: this.heading,
        body: rows,
        theme: 'grid',
        startY: 55,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 40 },
          2: { cellWidth: 30 },
          3: { cellWidth: 30 },
          4: { cellWidth: 45 },
          5: { cellWidth: 30 },
          6: { cellWidth: 35 },
          7: { cellWidth: 35 }
        }
      });
      doc.save('GJAY_CPD List.pdf');
    }
  }

  convertDate(date) {
    let datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy hh:mm:ss a');
    return date;
  }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
}
