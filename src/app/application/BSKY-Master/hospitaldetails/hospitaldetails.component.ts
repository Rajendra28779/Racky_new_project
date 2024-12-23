import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { sysrejreports } from 'src/app/services/api-config';
import Swal from 'sweetalert2';
import { HospitalService } from '../../Services/hospital.service';
import { TableUtil } from '../../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-hospitaldetails',
  templateUrl: './hospitaldetails.component.html',
  styleUrls: ['./hospitaldetails.component.scss']
})
export class HospitaldetailsComponent implements OnInit {
  hospoitalid: any;
  hospitalcode: any;
  tmsstatus: any;
  data: any;
  logdata: any;
  result: any;
  user: any;
  logdetails: any;
  currentPage: any;
  pageElement: any;
  showPegi: boolean;
  logdetailstotal: any;
  txtsearchDate: any;
  incentivelogdetails: any = [];

  constructor(private hospitaService: HospitalService, private sessionService: SessionStorageService) { }



  ngOnInit(): void {
    this.user = this.sessionService.decryptSessionData("user");
    this.hospoitalid = localStorage.getItem("hospitalid");
    this.hospitalcode = localStorage.getItem("hospitalcode");
    this.tmsstatus = localStorage.getItem("tmsstatus");
    this.getcurrentdata(this.hospoitalid);
    this.getlogdata(this.hospoitalid);
  }

  getcurrentdata(item: any) {
    this.hospitaService.getbyhId(item).subscribe(
      (result: any) => {
        console.log(result);
        this.data = result;
        this.result = this.data.hospital
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  getlogdata(hospoitalid) {
    this.hospitaService.getlogdata(hospoitalid).subscribe(
      (result: any) => {
        console.log(result);
        this.logdata = result;
        if (this.logdata.status == 200) {
          this.logdetails = this.logdata.hospitallog;
          this.incentivelogdetails = this.logdata.incentivelog;
          this.logdetailstotal = this.logdetails.length;
          if (this.logdetailstotal > 0) {
            this.showPegi = true;
            this.currentPage = 1;
            this.pageElement = 20
          } else {
            this.showPegi = false;
          }
        }
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
  report: any = [];
  hosp: any = {
    slNo: "",
    hospname: "",
    hospcode: "",
    mobile: "",
    email: "",
    dc: "",
    hospitalType: "",
    NABHstartdate: "",
    NABHenddate: "",
    MOUstartdate: "",
    MOUenddate: "",
    cpdApproval: "",
    empStatus: "",
    mouStatus: "",
    status: "",
    updateby: "",
    updateon: ""
  };
  heading = [['Sl No', 'Hospital Name', 'Hospital Code', 'Mobile No.', 'Email id', 'Assigned DC', 'Hospital Type', 'Incentive Start Date', 'Incentive End Date', 'MOU Start Date', 'MOU End Date', 'CPD Approval Required', 'Empanelment Active Status', 'MOU Status', 'Status', 'Updated By', 'Updated On']];

  downloadReport(no: any) {
    //console.log(this.hospitalData);
    this.report = [];
    let item: any;
    for (var i = 0; i < this.logdetails.length; i++) {
      item = this.logdetails[i];
      this.hosp = [];
      this.hosp.slNo = i + 1;
      this.hosp.hospname = item.hospitalName;
      this.hosp.hospcode = item.hospitalCode;
      this.hosp.mobile = item.mobile;
      this.hosp.email = item.emailId;
      this.hosp.dc = item.dcname;
      this.hosp.hospitalType = item.typename;
      if (item.hcValidFromDate != null) {
        this.hosp.NABHstartdate = this.convertDate(item.hcValidFromDate);
      } else {
        this.hosp.NABHstartdate = "N/A"
      }
      if (item.hcValidToDate != null) {
        this.hosp.NABHenddate = this.convertDate(item.hcValidToDate);
      } else {
        this.hosp.NABHenddate = "N/A"
      }
      if (item.mouStartDate != null) {
        this.hosp.MOUstartdate = this.convertDate(item.mouStartDate);
      } else {
        this.hosp.MOUstartdate = "N/A"
      }
      if (item.mouEndDate != null) {
        this.hosp.MOUenddate = this.convertDate(item.mouEndDate);
      } else {
        this.hosp.MOUenddate = "N/A"
      }
      if (item.cpdApprovalRequired == '1') {
        this.hosp.cpdApproval = "No";
      } else if (item.cpdApprovalRequired == '0') {
        this.hosp.cpdApproval = "Yes";
      }

      if (item.empanelmentstatus == 0) {
        this.hosp.empStatus = "Active";
      } else {
        this.hosp.empStatus = "Inactive";
      }

      if (item.mouStatus == 0) {
        this.hosp.mouStatus = "Active";
      } else {
        this.hosp.mouStatus = "Inactive";
      }

      if (item.status == 0) {
        this.hosp.status = "Active";
      } else {
        this.hosp.status = "Inactive";
      }

      this.hosp.updateby = item.createname
      this.hosp.updateon = this.convertDate(item.createdOn);

      this.report.push(this.hosp);
      console.log(this.hosp);

    }
    if (no == 1) {
      let filter = [];
      TableUtil.exportListToExcelWithFilter(this.report, this.result?.hospitalName + ' Log Details', this.heading, filter);
    } else {
      if (this.report.length == 0) {
        Swal.fire("Info", "No data found", 'info');
        return;
      }
      let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
      let generatedBy = this.sessionService.decryptSessionData("user").fullName;
      var doc = new jsPDF('l', 'mm', [450, 210]);
      doc.setFontSize(24);
      doc.text("Hospital Log Details", 180, 15);
      doc.setFontSize(20);
      doc.text('GeneratedOn :- ' + generatedOn, 290, 23);
      doc.text('GeneratedBy :- ' + generatedBy, 15, 23);
      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.slNo;
        pdf[1] = clm.hospname;
        pdf[2] = clm.hospcode;
        pdf[3] = clm.mobile;
        pdf[4] = clm.email;
        pdf[5] = clm.dc;
        pdf[6] = clm.hospitalType;
        pdf[7] = clm.NABHstartdate;
        pdf[8] = clm.NABHenddate;
        pdf[9] = clm.MOUstartdate;
        pdf[10] = clm.MOUenddate;
        pdf[11] = clm.cpdApproval;
        pdf[12] = clm.empStatus;
        pdf[13] = clm.mouStatus;
        pdf[14] = clm.status;
        pdf[15] = clm.updateby;
        pdf[16] = clm.updateon;
        rows.push(pdf);
      }
      autoTable(doc, {
        head: this.heading,
        body: rows,
        theme: 'grid',
        startY: 30,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },
          11: { cellWidth: 15 },
          12: { cellWidth: 16 },
          // 3: {cellWidth: 15},
          // 4: {cellWidth: 42},

        }
      });
      doc.save('GJAY_'+this.result?.hospitalName+ ' Log Details.pdf');
    }
  }
  convertDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy');
    return date;
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

}
