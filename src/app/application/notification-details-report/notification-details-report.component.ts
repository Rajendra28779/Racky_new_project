import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HeaderService } from '../header.service';
import { UsercreateService } from '../Services/usercreate.service';
import Swal from 'sweetalert2';
import { TableUtil } from '../util/TableUtil';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { CurrencyPipe, formatDate } from '@angular/common';
import { NotificationdetailsreportServiceService } from '../Services/notificationdetailsreport-service.service';
import { NotificationService } from '../Services/notification.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-notification-details-report',
  templateUrl: './notification-details-report.component.html',
  styleUrls: ['./notification-details-report.component.scss']
})
export class NotificationDetailsReportComponent implements OnInit {

  showPegi: any;
  pageElement: any;
  currentPage: any;
  txtsearchDate: any;
  groupList: any = [];
  notificationReport: any;
  countnotificationReport: any;
  user: any;

  constructor(public headerService: HeaderService, private notificatiodetailsnserv: NotificationdetailsreportServiceService, private userService: UsercreateService, private notificationservice: NotificationService, private encryptionService: EncryptionService, private sessionService: SessionStorageService) { }

  notificationDetialsReport = new FormGroup({
    fromdate: new FormControl(''),
    todate: new FormControl(''),
    groupId: new FormControl(''),
  });

  ngOnInit(): void {
    this.headerService.setTitle('Notification Details Report');
    this.user = this.sessionService.decryptSessionData("user");
    $('.selectpicker').selectpicker();

    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      // endDate: '0d',
      // maxDate: new Date(),
      daysOfWeekDisabled: ['', 7],
    });
    $('.timepicker').datetimepicker({
      format: 'LT',
      daysOfWeekDisabled: ['', 7],
    });
    $('.datetimepicker').datetimepicker({
      format: 'DD-MMM-YYYY LT',
      daysOfWeekDisabled: ['', 7],
    });

    var date = new Date();
    let year = date.getFullYear();
    let date1 = '01';
    let date2 = date.getDate();
    let month: any = date.getMonth();
    if (month == 0) {
      month = 'Jan';
    } else if (month == 1) {
      month = 'Feb';
    } else if (month == 2) {
      month = 'Mar';
    } else if (month == 3) {
      month = 'Apr';
    } else if (month == 4) {
      month = 'May';
    } else if (month == 5) {
      month = 'Jun';
    } else if (month == 6) {
      month = 'Jul';
    } else if (month == 7) {
      month = 'Aug';
    } else if (month == 8) {
      month = 'Sep';
    } else if (month == 9) {
      month = 'Oct';
    } else if (month == 10) {
      month = 'Nov';
    } else if (month == 11) {
      month = 'Dec';
    }
    var frstDay = date1 + "-" + month + "-" + year;
    var secoundDay = date2 + "-" + month + "-" + year;
    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr("placeholder", "From Date *");
    $('input[name="toDate"]').val(secoundDay);
    $('input[name="toDate"]').attr("placeholder", "To Date *");
    this.getGroupList();
    this.notificationsdetails();
  }
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  }
  reset() {
    //this.ngOnInit();
    window.location.reload();
  }
  frmdate: any;
  tdate: any;
  notificationsdetails() {
    let fromdate = $('#datepicker1').val().toString().trim();
    let todate = $('#datepicker2').val().toString().trim();
    if (Date.parse(fromdate) > Date.parse(todate)) {
      this.swal('', ' From Date should be less To Date', 'error');
      return;
    }
    this.frmdate = fromdate;
    this.tdate = todate;
    this.notificatiodetailsnserv.getNotificationdetailsReport(fromdate, todate).subscribe(data => {
      this.notificationReport = data;
      this.countnotificationReport = this.notificationReport.length;
      if (this.countnotificationReport > 0) {
        this.currentPage = 1;
        this.pageElement = 10;
        this.showPegi = true;
      }
    })
  }
  grpid: any = 'ALL';
  notificationsdetails1() {
    let fromdate = $('#datepicker1').val().toString().trim();
    let todate = $('#datepicker2').val().toString().trim();
    let groupId = $('#groupId').val().toString().trim();
    if (Date.parse(fromdate) > Date.parse(todate)) {
      this.swal('', ' From Date should be less To Date', 'error');
      return;
    }
    this.frmdate = fromdate;
    this.tdate = todate;
    this.grpid = groupId;
    if (fromdate == undefined) {
      fromdate = "";
    }
    if (todate == undefined) {
      todate = "";
    }
    if (groupId == undefined) {
      groupId = "";
    }
    this.notificatiodetailsnserv.getSearchData(fromdate, todate, groupId).subscribe(data => {
      this.notificationReport = data;
      this.countnotificationReport = this.notificationReport.length;
      if (this.countnotificationReport > 0) {
        this.currentPage = 1;
        this.pageElement = 10;
        this.showPegi = true;
      }
    })
  }
  getGroupList() {
    this.userService.getGroupList().subscribe(
      (response: any) => {
        response = this.encryptionService.getDecryptedData(response);
        this.groupList = response.data;
      },
      (error) => console.log(error)
    )
  }
  keyfunction1(e) {
    if (e.value[0] == " ") {
      $('#group').val('');
    }
  }
  report: any = [];
  notificationdetailsreportlist: any = {
    slNo: "",
    groupId: "",
    noticeContent: "",
    fromDate: "",
    toDate: "",
    document: "",
    statusFlag: ""
  };
  heading = [['Sl No.', 'Group', 'Notice Content', 'From Date', 'To Date', 'Document', 'Status']];

  groupname: any = 'ALL';
  downloadReport(type: any) {
    this.report = [];
    let item: any;
    for (var i = 0; i < this.notificationReport.length; i++) {
      item = this.notificationReport[i];
      this.notificationdetailsreportlist = [];
      this.notificationdetailsreportlist.slNo = i + 1;
      this.notificationdetailsreportlist.groupId = item.groupId.groupTypeName;
      this.notificationdetailsreportlist.noticeContent = item.noticeContent;
      this.notificationdetailsreportlist.fromDate = item.fdate;
      this.notificationdetailsreportlist.toDate = item.tdate;
      this.notificationdetailsreportlist.document = item.docpath;
      if (item.statusFlag == '0') {
        this.notificationdetailsreportlist.statusFlag = "Active";
      } else if (item.statusFlag == '1') {
        this.notificationdetailsreportlist.statusFlag = "Inactive";
      }
      this.report.push(this.notificationdetailsreportlist);
    }

    for (let i = 0; i < this.groupList.length; i++) {
      if (this.groupList[i].typeId == this.grpid) {
        this.groupname = this.groupList[i].groupTypeName;
      }
    }

    if (type == 'excel') {
      let filter = [];
      filter.push([['From Date :- ', this.frmdate]]);
      filter.push([['To Date:- ', this.tdate]]);
      filter.push([['Group Name:- ', this.groupname]]);
      TableUtil.exportListToExcelWithFilter(this.report, "Notification Details Report", this.heading, filter);
    } else if (type == 'pdf') {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('l', 'mm', [297, 210]);
      doc.setFontSize(12);

      doc.text("Notification Details Report", 14, 10);
      doc.text('From Date :- ' + this.frmdate, 14, 20);
      doc.text('To Date:- ' + this.tdate, 14, 30);
      doc.text('Group Name:- ' + this.groupname, 14, 40);
      doc.text("Generated By: " + this.user.fullName + "\tGenerated On: " + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString(), 14, 50);

      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var notdetails = this.report[i];
        var pdf = [];
        pdf[0] = notdetails.slNo;
        pdf[1] = notdetails.groupId;
        pdf[2] = notdetails.noticeContent;
        pdf[3] = notdetails.fromDate;
        pdf[4] = notdetails.toDate;
        pdf[5] = notdetails.document;
        pdf[6] = notdetails.statusFlag;

        rows.push(pdf);
      }
      autoTable(doc, {
        head: this.heading,
        body: rows,
        theme: 'grid',
        startY: 60,
        //startX: 50,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 30 },
          2: { cellWidth: 60 },
          3: { cellWidth: 30 },
          4: { cellWidth: 55 },
          5: { cellWidth: 50 },
          6: { cellWidth: 30 },

          // 6: {cellWidth: 25},
          // 7: {cellWidth: 25},
          // 8: {cellWidth: 30},
          // 9: {cellWidth: 30},

        }
      });
      doc.save('GJAY_Notification Details Report.pdf');
    }

  }

  flag: any = false;
  documentType: any;
  fileToUpload?: File;
  downlordnotification(event: any, docpath: any) {
    if (docpath != null && docpath != '' && docpath != undefined) {
      let img = this.notificationservice.downloadFile(docpath);
      window.open(img, '_blank');
    } else {
      this.swal('Info', 'There Is No File', 'info');
    }
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
}
