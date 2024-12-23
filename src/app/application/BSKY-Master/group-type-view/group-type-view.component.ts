import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { GroupTypeService } from '../../Services/group-type.service';
import { TableUtil } from '../../util/TableUtil';
import autoTable from 'jspdf-autotable';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-group-type-view',
  templateUrl: './group-type-view.component.html',
  styleUrls: ['./group-type-view.component.scss']
})
export class GroupTypeViewComponent implements OnInit {
  record: any;
  currentPage: any;
  pageElement: any;
  showPegi: boolean;
  txtsearchDate: any;
  groupData: any = [];
  deleteDetails: any;
  status: any;
  show: any = false;

  constructor(private groupTypeService: GroupTypeService, private route: Router, public headerService: HeaderService, private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.currentPage = 1;
    this.pageElement = 50;
    this.getGroupdetails();
    this.headerService.setTitle("View Group Type");
  }

  getGroupdetails() {
    this.groupTypeService.getGroupList().subscribe((allData) => {
      this.groupData = allData;
      this.record = this.groupData.length;
      if (this.record > 0) {
        this.currentPage = 1;
        this.pageElement = 50;
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

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  edit(groupId: any) {
    let navigateExtras: NavigationExtras = {
      state: {
        item: groupId
      }
    };
    this.route.navigate(['application/grouptype'], navigateExtras)
  }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

  report: any = [];
  groupTypeDetail: any = {
    slNo: "",
    groupTypeName: "",
    typeId: "",
    status: ""
  };
  heading = [['Sl No.', 'GroupType Name', 'Type Id', 'Status']];
  downloadReport(type) {
    this.report = [];
    let item: any;
    for (var i = 0; i < this.groupData.length; i++) {
      item = this.groupData[i];
      this.groupTypeDetail = [];
      this.groupTypeDetail.slNo = i + 1;
      this.groupTypeDetail.groupTypeName = item.groupTypeName;
      this.groupTypeDetail.typeId = item.typeId;
      if (item.status == '0') {
        this.groupTypeDetail.status = "Active";
      } else if (item.status == '1') {
        this.groupTypeDetail.status = "In Active";
      }
      this.report.push(this.groupTypeDetail);
    }
    if (type == 1) {
      let filter = [];
      TableUtil.exportListToExcelWithFilter(this.report, "Group Type List", this.heading, filter);
    } else if (type == 2) {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('l', 'mm', [200, 220]);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text("Group Type List", 95, 20);
      doc.setFontSize(12);
      doc.text("Generated By: " + this.sessionService.decryptSessionData("user").fullName, 19, 33);
      doc.text("Generated On: " + this.convertDate(new Date()), 19, 40);
      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.slNo;
        pdf[1] = clm.groupTypeName;
        pdf[2] = clm.typeId;
        pdf[3] = clm.status;
        rows.push(pdf);
      }
      autoTable(doc, {
        head: this.heading,
        body: rows,
        theme: 'grid',
        startY: 50,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 65 },
          2: { cellWidth: 35 },
          3: { cellWidth: 50 },
          4: { cellWidth: 50 }
        }
      });
      doc.save('Group Type List.pdf');
    }
  }

  convertDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy hh:mm:ss a');
    return date;
  }
}
