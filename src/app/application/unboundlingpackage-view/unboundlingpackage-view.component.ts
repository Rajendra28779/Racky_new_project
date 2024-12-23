import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { DynamicreportService } from '../Services/dynamicreport.service';
import { TableUtil } from '../util/TableUtil';
import { HeaderService } from './../header.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-unboundlingpackage-view',
  templateUrl: './unboundlingpackage-view.component.html',
  styleUrls: ['./unboundlingpackage-view.component.scss']
})
export class UnboundlingpackageViewComponent implements OnInit {
  user: any;
  list: any = [];
  showPegi: boolean;
  currentPage: any;
  pageElement: any;
  totalcount: any = 0;
  txtsearchDate: any;




  constructor(public headerService: HeaderService,
    public route: Router,
    private service: DynamicreportService,
    private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle("Unbundling Package Master");
    this.user = this.sessionService.decryptSessionData("user");
    this.getlist();
  }

  getlist() {
    this.service.getunboundlingconfigurationlist().subscribe((data: any) => {
      // console.log(data);
      this.list = data;
      this.totalcount = this.list.length;
      if (this.totalcount > 0) {
        this.showPegi = true
        this.currentPage = 1
        this.pageElement = 100
      } else {
        this.showPegi = false
      }
    })
  }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

  edit(item: any) {
    let navigationExtras: NavigationExtras = {
      state: {
        id: item.unboundlingid,
      }
    };
    this.route.navigate(['application/packgaeunbundlingmaster'], navigationExtras);
  }

  report: any = [];
  sno: any = {
    Slno: "",
    name: "",
    specode: "",
    pkgcode: "",
    createon: "",
    status: "",
  };
  heading = [['Sl#', 'Unbundling Name', 'Unbundling Speciality Code', 'Unbundling Package Code', 'Created On', 'Status']];
  downloadList(no: any) {
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy = this.sessionService.decryptSessionData("user").fullName;
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.list.length; i++) {
      sna = this.list[i];
      this.sno = [];
      this.sno.Slno = i + 1;
      this.sno.name = sna.packagename;
      this.sno.specode = sna.specialitycode;
      this.sno.pkgcode = sna.packagecode;
      this.sno.createon = sna.screatedOn;
      this.sno.status = sna.status == 0 ? "Active" : "In-Active";
      this.report.push(this.sno);
    }
    if (no == 1) {
      let filter = [];
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'Unbundling Package Master',
        this.heading, filter
      );
    } else {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('p', 'mm', [297, 210]);
      doc.setFontSize(20);
      doc.text("Unbundling Package Master", 80, 15);
      doc.setFontSize(12);
      doc.text('GeneratedOn :- ' + generatedOn, 8, 25);
      doc.text('GeneratedBy :- ' + generatedBy, 110, 25);
      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.Slno;
        pdf[1] = clm.name;
        pdf[2] = clm.specode;
        pdf[3] = clm.pkgcode;
        pdf[4] = clm.createon;
        pdf[5] = clm.status;
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
          3: { cellWidth: 65 },

        }
      });
      doc.save('Unbundling Package Master.pdf');
    }
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
}

