import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';
import autoTable from 'jspdf-autotable';

import { TableUtil } from '../../util/TableUtil';
import { MedicalinfracatservService } from '../../Services/medicalinfracatserv.service';
import { MedicalinfrasubcatservService } from '../../Services/medicalinfrasubcatserv.service';
import { HeaderService } from '../../header.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-medicalinfrasubcategoryview',
  templateUrl: './medicalinfrasubcategoryview.component.html',
  styleUrls: ['./medicalinfrasubcategoryview.component.scss']
})
export class MedicalinfrasubcategoryviewComponent implements OnInit {

  record: any;
  currentPage: any;
  pageElement: any;
  showPegi: boolean;
  txtsearchDate:any;
  categoryData: any = [];
  deleteDetails: any;
  status: any;
  user1: any;
  show: any = false;


  constructor(private subcatserv: MedicalinfrasubcatservService,private route: Router,public headerService: HeaderService,private sessionService: SessionStorageService) { }

  ngOnInit(): void {

    this.currentPage = 1;
    this.pageElement = 50;
    this.MedicalSubCategoryList();
    this.headerService.setTitle("View Medical Infra Sub Category");
    this.user1 = this.sessionService.decryptSessionData("user");
  }
  MedicalSubCategoryList() {
    this.subcatserv.getMedicalSubCategoryList().subscribe((allData) => {
      this.categoryData = allData;
      console.log(this.categoryData);
      this.record = this.categoryData.length;
      if (this.record > 0) {
        this.currentPage = 1;
          this.pageElement = 50;
          this.showPegi=true;
      }
      else {
        this.showPegi = false;
      }
    })
  }

  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });

  }

  edit(id: any) {

    let navigateExtras: NavigationExtras = {
      state: {
        item: id
      }
    };
    this.route.navigate(['/application/medicalinfrasubcategoryadd'], navigateExtras)


  }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
}

report: any = [];
  groupTypeDetail: any = {
    slNo: "",
    medInfraCatName: "",
    medInfraSubCatName: "",
    createdOn:"",
    createdBy: "",
    statusFlag: ""
  };

  heading = [['Sl No.','Medical Infra Category','Medical Infra SubCategory', 'created On', 'created By', 'Status']];



  downloadReport(type) {
    this.report = [];
    let item: any;
    for (var i = 0; i < this.categoryData.length; i++) {
      item = this.categoryData[i];
      this.groupTypeDetail = [];
      this.groupTypeDetail.slNo = i + 1;
      this.groupTypeDetail.medInfraCatName = item.medInfracatId.medInfraCatName;
      this.groupTypeDetail.medInfraSubCatName = item.medInfraSubCatName;
      this.groupTypeDetail.createdOn = this.convertDate(item.screatedate);
      this.groupTypeDetail.createdBy = item.userId.fullname;

      if (item.statusFlag == '0') {
        this.groupTypeDetail.statusFlag = "Active";
      } else if (item.statusFlag == '1') {
        this.groupTypeDetail.statusFlag = "In Active";
      }
      this.report.push(this.groupTypeDetail);
    }
    if (type == 1) {
      let filter = [];
      TableUtil.exportListToExcelWithFilter(this.report, "Medical Infra SubCategory List", this.heading, filter);
    } else if (type == 2) {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('l', 'mm', [270, 300]);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text("Medical Infra SubCategory List", 110, 20);
      doc.setFontSize(12);

      doc.text("Generated By: " + this.user1.fullName, 15, 33);
      doc.text("Generated On: " + this.convertDate(new Date()), 15, 40);
      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.slNo;
        pdf[1] = clm.medInfraCatName;
        pdf[2] = clm.medInfraSubCatName;
        pdf[3] = this.convertDate(clm.createdOn);
        pdf[4] = clm.createdBy;
        pdf[5] = clm.statusFlag;
        rows.push(pdf);
      }
      console.log(rows);
      autoTable(doc, {
        head: this.heading,
        body: rows,
        theme: 'grid',
        startY: 47,
        headStyles: {
          fillColor: [26, 99, 54]
          // fillColor:[30,99,54]
        },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 60 },
          2: { cellWidth: 60 },
          3: { cellWidth: 60 },
          4: { cellWidth: 30 },
          5: { cellWidth: 20 },

          // 4: { cellWidth: 50 }
        }
      });
      doc.save('GJAY_Medical Infra SubCategory List.pdf');
    }
  }

  convertDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy hh:mm:ss a');
    return date;
  }
  convertDate1(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy');
    return date;
  }


}
