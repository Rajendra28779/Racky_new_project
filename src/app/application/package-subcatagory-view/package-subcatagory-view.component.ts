import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../header.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { PackageSubCategoryService } from '../Services/package-sub-category.service';
import Swal from 'sweetalert2';
import { TableUtil } from '../util/TableUtil';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-package-subcatagory-view',
  templateUrl: './package-subcatagory-view.component.html',
  styleUrls: ['./package-subcatagory-view.component.scss']
})
export class PackageSubcatagoryViewComponent implements OnInit {
  packageSubCategoryView: any;
  currentPage: any;
  pageElement: any;
  txtsearchDate: any;
  showPegi: boolean;
  record: any;
  user;any;

  report: any[];
  packageHeader: any = {
    Slno: '',
    packageHeaderCode: '',
    packagesubheader: '',
    packageSubcategoryName: '',
    packageSubcategoryCode: '',
    status: '',
  };
  heading = [
    [
      'Sl#',
      'Package Header Code',
      'SubCategory Name',
      'Package Name',
      'Package SubCategory Code',
      'Status'
    ],
  ];

  constructor(public headerService: HeaderService,
    private packageSubCategoryService: PackageSubCategoryService,
    public fb: FormBuilder,
    public router: Router,
    private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle('View Package SubCategory');
    this.user = this.sessionService.decryptSessionData("user");
    this.getallData();
  }
  getallData() {
    this.packageSubCategoryService.getAllpackageSubCatagory().subscribe((data: any) => {
      this.packageSubCategoryView = data;
      this.record = this.packageSubCategoryView?.length;
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
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;

  }
  edit(subcategoryId: any) {
    this.router.navigate(['/application/pkgSubCatagory', subcategoryId]);
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
        this.packageSubCategoryService.deletepackagesubcategory(item).subscribe((data: any) => {
          if (data.status == "Success") {
            this.swal(
              'Deleted!',
              'Record has been Inactivate.',
              'success'
            )
          }
          (err: any) => {
          }
          this.getallData();
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
        this.packageSubCategoryService.activepackagesubcategory(item,this.user.userId).subscribe((data: any) => {
          if (data.status == "Success") {
            this.swal(
              'Activated!',
              'Record Activated Successfully',
              'success'
            )
            this.getallData();
          }
          (err: any) => {
          }
        })
      }
    })
  }
  downloadList(type) {
    this.report = [];
    let packageP: any;
    for (var i = 0; i < this.packageSubCategoryView.length; i++) {
      packageP = this.packageSubCategoryView[i];
      this.packageHeader = [];
      this.packageHeader.Slno = i + 1;
      this.packageHeader.packageHeaderCode = packageP.packageheadercode;
      this.packageHeader.packagesubheader = packageP.subcategoryName;
      this.packageHeader.packageSubcategoryName = packageP.packagesubcategoryname;
      this.packageHeader.packageSubcategoryCode = packageP.packagesubcategorycode;
      this.packageHeader.status = packageP.deletedFlag==0?"Active":"In-Active";
      this.report.push(this.packageHeader);
    }
    if (type == 'xcl') {
      let filter = [];
      TableUtil.exportListToExcel(
        this.report, 'Package SubCategory', this.heading
      );
    }
    else if (type == 'pdf') {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('l', 'mm', [200, 120]);
      doc.setFontSize(12);

      doc.text("Package SubCategory", 5, 10);


      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.Slno;
        pdf[1] = clm.packageHeaderCode;
        pdf[2] = clm.packagesubheader;
        pdf[3] = clm.packageSubcategoryName;
        pdf[4] = clm.packageSubcategoryCode;
        pdf[5] = clm.status;
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
}


