import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import Swal from 'sweetalert2';
import { HeaderService } from '../header.service';
import { SnadoctorserviceService } from '../Services/snadoctorservice.service';
import { TableUtil } from '../util/TableUtil';

@Component({
  selector: 'app-doctors-details',
  templateUrl: './doctors-details.component.html',
  styleUrls: ['./doctors-details.component.scss']
})
export class DoctorsDetailsComponent implements OnInit {
  userid: any;
  name: any;
  SnaDetails: any;
  docDetails: any;
  record: any;
  email: any;
  mobile: any;
  sna: any;
  showPegi: boolean;
  pageElement: any;
  currentPage: any;
  txtsearchDate: any;
  user:any;
  constructor(public headerService: HeaderService, public route: Router, private snadoc: SnadoctorserviceService,
    private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle(' Doctor Tag  Details');
    this.userid = JSON.parse(localStorage.getItem("userid"));
    this.sna = JSON.parse(localStorage.getItem("Snadetails"));
    this.user = this.sessionService.decryptSessionData("user");
    this.snadoc.getsnadoctordetailslist(this.userid).subscribe(data => {
      this.SnaDetails = data;
      this.record = this.SnaDetails.length;
      if (this.record > 0) {
        this.showPegi = true;
        this.currentPage = 1;
        this.pageElement = 10;
      }
      else {
        this.showPegi = false;
      }
    });
  }
  report: any = [];
  sno: any = {
    Slno: '',
    HospitalName: '',
    HospitalCode: '',
    State: '',
    District: '',
    Email: '',
    HospitalContactnumber: '',
    AssignedDc: '',
    hospitalType: "",
    NABHstartdate: "",
    NABHenddate: "",
    MOUstartdate: "",
    MOUenddate: "",
    cpdApproval: "",
    tmsStatus: "",
  };
  heading = [
    [
      'Sl#',
      'Hospital Name',
      'Hospital Code',
      'State',
      'District',
      'Email',
      'Hospital Contact Number',
      'Assigned DC ',
      'Hospital Type',
      'Incentive Start Date',
      'Incentive End Date',
      'MOU Start Date',
      'MOU End Date',
      'CPD Approval Required',
      'TMS Active Status'
    ],
  ];

  downloadReport(no: any) {
    this.report = [];
    let Sna: any;
    for (var i = 0; i < this.SnaDetails.length; i++) {
      Sna = this.SnaDetails[i];
      this.sno = [];
      this.sno.Slno = i + 1;
      this.sno.HospitalName = Sna.hospitalname;
      this.sno.HospitalCode = Sna.hospitalcode;
      this.sno.State = Sna.state;
      this.sno.District = Sna.district;
      this.sno.Email = Sna.email;
      this.sno.HospitalContactnumber = Sna.mobile;
      this.sno.AssignedDc = Sna.assigndc;
      this.sno.hospitalType = Sna.hospcatogory;
      this.sno.NABHstartdate = Sna.hcvalidfrm
      this.sno.NABHenddate = Sna.hcvalidto
      this.sno.MOUstartdate = Sna.moustart
      this.sno.MOUenddate = Sna.mouend
      this.sno.cpdApproval = Sna.cpdapproval;
      this.sno.tmsStatus = Sna.tmsactivestatus;
      this.report.push(this.sno);
    }
    if (no == 1) {
      let filter = [];
      filter.push([['SNA Doctor Name', this.sna.name]]);
      filter.push([['Mobile No', this.sna.phone]]);
      filter.push([['Email', this.sna.email]]);
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'Doctor Tag Details',
        this.heading, filter
      );
    } else {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
      let generatedBy = this.user.fullName;

      var doc = new jsPDF('l', 'mm', [397, 250]);
      doc.setFontSize(22);
      doc.text("Doctor Tag Details", 160, 15);
      doc.setFontSize(15);
      doc.text('SNA Doctor Name :- ' + this.sna.name, 15, 25);
      doc.text('Email :- ' + this.sna.email, 150, 25);
      doc.text('Mobile No :- ' + this.sna.phone, 280, 25);
      doc.text('GeneratedBy :- ' + generatedBy, 15, 35);
      doc.text('GeneratedOn :- ' + generatedOn, 280, 35);
      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.Slno;
        pdf[1] = clm.HospitalName;
        pdf[2] = clm.HospitalCode;
        pdf[3] = clm.State;
        pdf[4] = clm.District;
        pdf[5] = clm.Email;
        pdf[6] = clm.HospitalContactnumber;
        pdf[7] = clm.AssignedDc;
        pdf[8] = clm.hospitalType;
        pdf[9] = clm.NABHstartdate;
        pdf[10] = clm.NABHenddate;
        pdf[11] = clm.MOUstartdate;
        pdf[12] = clm.MOUenddate;
        pdf[13] = clm.cpdApproval;
        pdf[14] = clm.tmsStatus;
        rows.push(pdf);
      }
      autoTable(doc, {
        head: this.heading,
        body: rows,
        theme: 'grid',
        startY: 40,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },
          5: { cellWidth: 40 },
        }
      });
      doc.save('Doctor Tag Details');
    }
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
}


