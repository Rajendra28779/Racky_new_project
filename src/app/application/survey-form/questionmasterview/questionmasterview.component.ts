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
  selector: 'app-questionmasterview',
  templateUrl: './questionmasterview.component.html',
  styleUrls: ['./questionmasterview.component.scss']
})
export class QuestionmasterviewComponent implements OnInit {
  childmessage: any;
  txtsearchDate: any;
  showPegi: any;
  pageElement: any;
  currentPage: any;
  list: any
  user: any;
  countgllist: any;

  constructor(private route: Router, public headerService: HeaderService, private surveyserv: SurverconfurationService,private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle('Question Master');
    this.user = this.sessionService.decryptSessionData("user");
    this.getallgloballink();
  }

  getallgloballink() {
    this.surveyserv.getallquestionmst().subscribe((data: any) => {
      console.log(data);
      if (data.status == 200) {
        this.list = data.data;
        this.countgllist = this.list.length
        if (this.countgllist > 0) {
          this.currentPage = 1;
          this.pageElement = 50;
          this.showPegi = true;
        } else {
          this.showPegi = false;
        }
      } else {
        this.showPegi = false;
        this.swal("Error", "Something went wrong", "error");
      }
    });
  }

  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  edit(item: any) {
    let navigationExtras: NavigationExtras = {
      state: {
        question: item.questionName,
        questiontype: item.questionType,
        mandotory: item.mandotoryRemark,
        status: item.statusFlag,
        id: item.questionId,
      }
    };
    this.route.navigate(['/application/questionmstsurvey'], navigationExtras);
  }

  report: any = [];
  sno: any = [];
  heading = [['Sl#', 'Question', 'Question Type', 'Is Mandotory', 'Status']];
  downloadList(no: any) {
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy = this.user.fullName;
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.list.length; i++) {
      sna = this.list[i];
      this.sno = [];
      this.sno.push(i + 1);
      this.sno.push(sna.questionName);
      this.sno.push(sna.questionType == 1 ? "Radio Button" : sna.questionType == 2 ? "Text Field" : sna.questionType == 3 ? "Date" : "N/A");
      this.sno.push(sna.mandotoryRemark == 0 ? "Yes" : "No");
      this.sno.push(sna.statusFlag == 0 ? "Active" : "In-Active");
      this.report.push(this.sno);
    }
    if (no == 1) {
      let filter = [];
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'Survey Question List',
        this.heading, filter
      );
    } else {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('p', 'mm', [297, 210]);
      doc.setFontSize(20);
      doc.text("Survey Question List", 80, 15);
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
      doc.save('Survey_Question_List.pdf');
    }
  }
}
