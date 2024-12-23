import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../header.service';
import { FormBuilder } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { PackageHeaderService } from '../Services/package-header.service';
import Swal from 'sweetalert2';
import { TableUtil } from '../util/TableUtil';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { SessionStorageService } from 'src/app/services/session-storage.service';


@Component({
  selector: 'app-package-header-view',
  templateUrl: './package-header-view.component.html',
  styleUrls: ['./package-header-view.component.scss']
})
export class PackageHeaderViewComponent implements OnInit {
  packageHeaderView: any;
  txtsearchDate: any;
  showPegi: boolean;
  record: any;
  currentPage: any;
  pageElement: any;
  user: any;

  report: any[];
  packageHeader: any = {
    Slno: '',
    packageHeaderName: '',
    packageHeaderCode: '',
    status: ''
  };
  heading = [
    [
      'Sl#',
      'Package Header Name',
      'Package Header Code',
      'Status',
    ],
  ];
  constructor(public headerService: HeaderService,
    private packageHeaderService: PackageHeaderService,
    public fb: FormBuilder,
    public router: Router,
    private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle('View Package Header');
    this.user = this.sessionService.decryptSessionData("user");
    this.getalldata();

  }
  username: any;
  timespan: any;
  getalldata() {
    // this.username=this.user.fullName
    this.timespan = new Date()
    this.packageHeaderService.getalldata().subscribe((data: any) => {
      this.packageHeaderView = data;
      this.record = this.packageHeaderView?.length;
      if (this.record > 0) {
        this.currentPage = 1;
        this.pageElement = 100;
        this.showPegi = true;
      }
      else {
        this.showPegi = false;
      }
    })
  }

  delete(item: any) {
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.packageHeaderService.deletepackageheader(item).subscribe((data: any) => {
          if (data.status == "Success") {
            this.swal(
              'Deleted!',
              'Record has been Inactivate.',
              'success'
            )
          }
          this.getalldata();
          (err: any) => {
          }
        })
      }
    })
  }

  active(item: any) {
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Active it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.packageHeaderService.activepackageheader(item,this.user.userId).subscribe((data: any) => {
          if (data.status == "Success") {
            this.swal(
              'Activated!',
              'Record Activated Successfully',
              'success'
            )
          }
          this.getalldata();
          (err: any) => {
          }
        })
      }
    })
  }

  edit(headerId: any) {
    this.router.navigate(['/application/packageHeader', headerId]);
  }
  downloadList(type) {
    this.report = [];
    let packageP: any;
    for (var i = 0; i < this.packageHeaderView.length; i++) {
      packageP = this.packageHeaderView[i];
      this.packageHeader = [];
      this.packageHeader.Slno = i + 1;
      this.packageHeader.packageHeaderName = packageP.packageheadername;
      this.packageHeader.packageHeaderCode = packageP.packageheadercode;
      this.packageHeader.status = packageP.deletedFlag==0?"Active":"In-Active";
      this.report.push(this.packageHeader);
    }
    if (type == 'xcl') {
      let filter = [];

      TableUtil.exportListToExcel(
        this.report, 'Package Header', this.heading
      );
    }
    else if (type == 'pdf') {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('l', 'mm', [200, 120]);
      doc.setFontSize(12);

      doc.text("Package Header", 5, 10);
      // doc.text('Generated By :- '+this.username,5,60);

      // doc.text('Generated On :'+this.convertDate(this.timespan),5,70);



      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.Slno;
        pdf[1] = clm.packageHeaderName;
        pdf[2] = clm.packageHeaderCode;
        pdf[3] = clm.status;

        rows.push(pdf);
      }
      autoTable(doc, {
        head: this.heading,
        body: rows,
        theme: 'grid',
        startY: 20,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },

        }
      });
      doc.save('Bsky_Package Header.pdf');
    }
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  convertDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy, h:mm:ss a');
    return date;
  }
}