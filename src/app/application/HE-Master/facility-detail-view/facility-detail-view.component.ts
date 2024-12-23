import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';

import { HeaderService } from '../../header.service';
import { FacilityDetailServiceService } from '../../Services/facility-detail-service.service';
import autoTable from 'jspdf-autotable';
import { TableUtil } from '../../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-facility-detail-view',
  templateUrl: './facility-detail-view.component.html',
  styleUrls: ['./facility-detail-view.component.scss']
})
export class FacilityDetailViewComponent implements OnInit {
  remarkView:any;
  currentPage: any;
  pageElement: any;
  txtsearchDate: any;
  showPegi: boolean;
  record: any;
  user1: any;

  constructor(public headerService: HeaderService,private facilityDetailService:FacilityDetailServiceService,
    public route: Router,private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle('Facility Details View');
    this.user1 = this.sessionService.decryptSessionData("user");
    this.getFacilityDetails();
  }

  getFacilityDetails() {
    this.facilityDetailService.getallFacilityData().subscribe((data:any)=>{
      this.remarkView=data;
      console.log(this.remarkView);

      this.record = this.remarkView.length;
      if (this.record > 0) {
        this.currentPage = 1;
        this.pageElement = 20;
        this.showPegi = true;
      }
    });
  }

  edit(item: any) {
    let objToSend: NavigationExtras = {
      state: {
        facilityDetailId: item
      }
    };
    this.route.navigate(['/application/facilitydetailadd'], objToSend);
  }

  report: any = [];
  groupTypeDetail: any = {
    slNo: "",
    facilityName: "",
    fullname:"",
    createdOn:"",
    statusFlag: ""
  };

  heading = [['Sl No.', 'Facility Name', 'Created By','Created On', 'Status']];
  downloadReport(type){
    this.report = [];
    let item: any;
    for (var i = 0; i < this.remarkView.length; i++) {
      item = this.remarkView[i];
      this.groupTypeDetail = [];
      this.groupTypeDetail.slNo = i + 1;
      this.groupTypeDetail.facilityName = item.facilityName;
      this.groupTypeDetail.fullname = item.createdBy.fullname;
      this.groupTypeDetail.createdOn=this.convertDate1(item.createdOn);
      if (item.statusFlag ==0) {
        this.groupTypeDetail.statusFlag = "Active";
      } else if (item.statusFlag == 1) {
        this.groupTypeDetail.statusFlag = "In Active";
      }
      this.report.push(this.groupTypeDetail);
    }
    if (type == 1) {
      let filter = [];
      TableUtil.exportListToExcelWithFilter(this.report, "Facility Details", this.heading, filter);
    } else if (type == 2) {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('l', 'mm', [200, 220]);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text("Facility Details", 95, 20);
      doc.setFontSize(12);

      doc.text("Generated By: " + this.user1.fullName, 19, 33);
      doc.text("Generated On: " + this.convertDate(new Date()), 19, 40);
      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.slNo;
        pdf[1] = clm.facilityName;
        pdf[2]=clm.fullname;
        pdf[3]=clm.createdOn;
        pdf[4] = clm.statusFlag;
        rows.push(pdf);
      }
      console.log(rows);
      autoTable(doc, {
        head: this.heading,
        body: rows,
        theme: 'grid',
        startY: 50,
        headStyles: {
          fillColor: [26, 99, 54]
          // fillColor:[30,99,54]
        },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 55 },
          2: { cellWidth: 35 },
          3:{cellWidth:30},
          4:{cellWidth:30},
        }
      });
      doc.save('Facility Details.pdf');
    }

  }
  convertDate1(createdOn: any){
    var datePipe = new DatePipe("en-US");
    createdOn = datePipe.transform(createdOn, 'dd-MMM-yyyy');
    return createdOn;
  }
  convertDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy hh:mm:ss a');
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



