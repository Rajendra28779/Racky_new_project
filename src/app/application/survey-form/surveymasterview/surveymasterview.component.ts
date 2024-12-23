import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { SurverconfurationService } from '../../Services/surverconfuration.service';
import { TableUtil } from '../../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-surveymasterview',
  templateUrl: './surveymasterview.component.html',
  styleUrls: ['./surveymasterview.component.scss']
})
export class SurveymasterviewComponent implements OnInit {
  user: any
  txtsearchDate: any;
  list: any = [];
  showPegi: boolean;
  currentPage: any;
  pageElement: any;
  totalcount: any = 0;

  constructor(public headerService: HeaderService, private surveyserv: SurverconfurationService, private route: Router,private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.user = this.sessionService.decryptSessionData("user");
    this.headerService.setTitle("Survey Master");
    this.getsurveylist();
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  getsurveylist() {
    this.surveyserv.getsurveymstlist().subscribe((data: any) => {
      console.log(data);
      if (data.status == 200) {
        this.list = data.data;
        this.totalcount = this.list.length;
        if (this.totalcount > 0) {
          this.showPegi = true
          this.currentPage = 1
          this.pageElement = 100
        } else {
          this.showPegi = false
        }
      } else {
        this.showPegi = false
        this.swal("Error", 'Something Went Wrong', "error");
      }
    });
  }

  edit(item: any) {
    let navigationExtras: NavigationExtras = {
      state: {
        surveyname: item.surveyName,
        fromdate: item.sfromdate,
        todate: item.stodate,
        status: item.statusFlag,
        id: item.surveyId,
      }
    };
    this.route.navigate(['/application/surveymater'], navigationExtras);
  }

  report: any = [];
  sno: any = [];
  heading = [['Sl#', 'Survey Name', 'Effective From', 'Effective To', 'Created On', 'Status']];
  downloadList(no: any) {
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy =  this.user.fullName;
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.list.length; i++) {
      sna = this.list[i];
      this.sno = [];
      this.sno.push(i + 1);
      this.sno.push(sna.surveyName);
      this.sno.push(sna.sfromdate);
      this.sno.push(sna.stodate);
      this.sno.push(sna.screatedOn);
      this.sno.push(sna.statusFlag == 0 ? "Active" : "In-Active");
      this.report.push(this.sno);
    }
    if (no == 1) {
      let filter = [];
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'Survey Name List',
        this.heading, filter
      );
    } else {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('p', 'mm', [297, 210]);
      doc.setFontSize(20);
      doc.text("Survey Name List", 80, 15);
      doc.setFontSize(13);
      doc.text('GeneratedOn :- ' + generatedOn, 15, 25);
      doc.text('GeneratedBy :- ' + generatedBy, 15, 33);
      autoTable(doc, {
        head: this.heading,
        body: this.report,
        theme: 'grid',
        startY: 40,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },
        }
      });
      doc.save('Survey_Name_List.pdf');
    }
  }

}
