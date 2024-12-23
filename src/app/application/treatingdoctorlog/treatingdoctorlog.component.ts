import { Component, OnInit } from '@angular/core';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import { HeaderService } from '../header.service';
import { HospitalService } from '../Services/hospital.service';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { TableUtil } from '../util/TableUtil';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';
import autoTable from 'jspdf-autotable';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-treatingdoctorlog',
  templateUrl: './treatingdoctorlog.component.html',
  styleUrls: ['./treatingdoctorlog.component.scss']
})
export class TreatingdoctorlogComponent implements OnInit {
  txtsearchDate: any;
  list: any = [];
  list1: any = [];
  checkall: any;
  totalcount: any = 0
  showPegi: boolean;
  currentPage: any;
  pageElement: any;
  constructor(private sessionService: SessionStorageService,
    public headerService: HeaderService, private hospitaService: HospitalService,
    public route: Router) { }
  ngOnInit(): void {
    this.headerService.setTitle("Treating Doctor Configuration Log");
    this.hospitaService.getTreatingdoctorlogdetails().subscribe((data: any) => {
      console.log(data);
      this.list = data.data;
      this.list1 = this.list;
      this.totalcount = this.list.length;
      if (this.totalcount > 0) {
        this.showPegi = true
        this.currentPage = 1
        this.pageElement = 100
      } else {
        this.showPegi = true
      }
    },
      (error) => console.log(error)
    );
  }
  report: any = [];
  sno: any = {
    Slno: "",
    state: "",
    dist: "",
    hospname: "",
    hospcode: "",
    hosmobile: "",
    email: "",
    updateby: "",
    updateon: "",
  };
  heading = [['Sl#', 'State Name', 'District Name', 'Hospital Name', 'Hospital Code', 'Hospital Mobile No.',
    'Hospital emailId','Updated By', 'Updated On']];

  downloadList(no: any) {
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy = this.sessionService.decryptSessionData("user").fullName;
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.list.length; i++) {
      sna = this.list[i];
      this.sno = [];
      this.sno.Slno = i + 1;
      this.sno.state = sna.statename;
      this.sno.dist = sna.districtname;
      this.sno.hospname = sna.hospital_code;
      this.sno.hospcode = sna.hospital_name;
      this.sno.hosmobile = sna.mobile;
      this.sno.email = sna.email_id;
      this.sno.updateby = sna.fullname;
      this.sno.updateon = formatDate(sna.updatedon, 'dd-MMM-yyyy', 'en-US').toString();
      this.report.push(this.sno);
    }
    if (no == 1) {
      let filter = [];
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'Treating Doctor Configuration Log',
        this.heading, filter
      );
    } else {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('l', 'mm', [297, 210]);
      doc.setFontSize(20);
      doc.text("Treating Doctor Configuration Log", 110, 15);
      doc.setFontSize(14);
      doc.text('GeneratedOn :- ' + generatedOn, 180, 23);
      doc.text('GeneratedBy :- ' + generatedBy, 15, 23);
      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.Slno;
        pdf[1] = clm.state;
        pdf[2] = clm.dist;
        pdf[3] = clm.hospname;
        pdf[4] = clm.hospcode;
        pdf[5] = clm.hosmobile;
        pdf[6] = clm.email;
        pdf[7] = clm.updateby;
        pdf[8] = clm.updateon;
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
          3: { cellWidth: 40 },
        }
      });
      doc.save('Treating Doctor Configuration Log.pdf');
    }
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
}

