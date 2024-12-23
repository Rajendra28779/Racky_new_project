
import { Component, OnInit, Renderer2 } from '@angular/core';
import { InternalGrivanceServiceService } from '../Services/internal-grivance-service.service';
import { NavigationExtras, Router } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { HeaderService } from '../header.service';
import { TableUtil } from '../util/TableUtil';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;


@Component({
  selector: 'app-internal-grievance-view',
  templateUrl: './internal-grievance-view.component.html',
  styleUrls: ['./internal-grievance-view.component.scss']
})
export class InternalGrievanceViewComponent implements OnInit {
  userId: any;
  record: any;
  currentPage: any;
  pageElement: any;
  showPegi: boolean;
  txtsearchDate: any;
  getGrievanceData: any = [];
  deleteDetails: any;
  status: any;
  generatedBy: number;
  generatedOn: number;
  categoryType: any;
  priority: any;
  description: any;
  user: any;
  closingDescription: any;
  showaction: any;
  statusFlag: any;
  maxChars = 500;
  grvby: any;
  rcvdate: any;
  expdate: any;
  module: any;
  type: any;
  prio: any;
  descrip: any;
  email: any;
  phoneno: any;
  stats: any;
  assign: any;
  statu: any;
  dataa: any;
  tokenno: any;
  fromDate: any;
  toDate: any;
  screate: any;
  constructor(private internalGrivanceServiceService: InternalGrivanceServiceService, private route: Router, private headerService: HeaderService, private NgbModal: NgbModal, private renderer: Renderer2,private sessionService: SessionStorageService
    ) { }
  LeaveType = new FormGroup({
    closingDescription: new FormControl(''),
    closingDate: new FormControl(''),
  })

  ngOnInit(): void {
    this.statu = ""
    this.user =  this.sessionService.decryptSessionData("user");
    let date = new Date();
    var expectdate = this.screate;
    $('.selectpicker').selectpicker();
    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      minDate: expectdate,
      daysOfWeekDisabled: ['', 7],
    });
    $('.datepicker1').datetimepicker({
      format: 'DD-MMM-YYYY',
      maxDate: new Date(),
      daysOfWeekDisabled: ['', 7],
    });
    $('.timepicker').datetimepicker({
      format: 'LT',
      daysOfWeekDisabled: ['', 7],
    });
    $('.datetimepicker').datetimepicker({
      format: 'YYYY-MM-DD LT',
      daysOfWeekDisabled: ['', 7],
    });
    if (this.user.groupId == 1) {
      this.showaction = true;
    } else {
      this.showaction = false;
    }
    this.headerService.setTitle("View Internal Grievance");
    this.currentPage = 1;
    this.pageElement = 50;
    this.getAllGrievanceInternal();
    this.fordate = $('#fromDate').val();
    this.todate = $('#toDate').val();
  }

  timespan: any;

  getAllGrievanceInternal() {
    this.cat = 0;
    this.priorityy = 0;
    this.statuss = "";
    this.userId = this.user
    this.internalGrivanceServiceService.getAllGrievanceData().subscribe(data => {
      this.getGrievanceData = data;
      this.record = this.getGrievanceData.length;
      if (this.record > 0) {
        this.showPegi = true;
      } else {
        this.showPegi = false;
      }
    })
  }
  cat: any;
  priorityy: any;
  statuss: any;
  fordate: any;
  todate: any;
  search() {
    let categoryType = $('#categoryType').val();
    let priority = $('#priority').val();
    let statusFlag = $('#statusFlag').val();
    let recvFrommDate = $('#fromDate').val();
    let recvToDate = $('#toDate').val();
    this.fordate = recvFrommDate
    this.todate = recvToDate
    this.cat = categoryType;
    this.priorityy = priority;
    this.statuss = statusFlag;
    if (this.statuss == null) {
      this.statuss = "All";
    }
    this.fromDate = recvFrommDate;
    this.toDate = recvToDate;
    this.userId = this.user
    this.timespan = new Date()
    this.internalGrivanceServiceService.getAllFilterData(categoryType, priority, this.fromDate, this.toDate, statusFlag,).subscribe(data => {
      this.getGrievanceData = [];
      this.getGrievanceData = data;
      this.record = this.getGrievanceData.length;
      if (this.record > 0) {
        this.currentPage = 1;
        this.pageElement = 50;
        this.showPegi = true;
      } else {
        this.showPegi = false;
      }
    });
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  viewData(item: any) {
    this.description = item;
  }
  edit(grievanceId: any) {
    let navigateExtras: NavigationExtras = {
      state: {
        item: grievanceId
      }
    };
    this.route.navigate(['application/internalgrivance'], navigateExtras)
  }

  downlordnotification(event: any, docpath: any) {
    if (docpath != null && docpath != '' && docpath != undefined) {
      let img = this.internalGrivanceServiceService.downloadFile(docpath);
      window.open(img, '_blank');
    } else {
      this.swal('Info', 'There Is No File', 'info');
    }
  }
  report: any = [];
  getGrievanceList: any = {
    slNo: "",
    groupTypeName: "",
    fullname: "",
    grievanceSource: "",
    phoneno: "",
    email: "",
    moduleName: "",
    categoryType: "",
    priority: "",
    description: "",
    documentName: "",
    statusFlag: "",
    createdOn: "",
    closeDate: "",
    assignedName: "",
    closingDescription: "",
    tokenNumber: "",
    expectedDate1: ""

  };
  heading = [['Sl No.', 'Ticket Number', 'Grievance By', 'Name', ' Source', ' Module', ' Type', 'Priority', 'Recieve Date', 'Expected Date', 'Closing Date', 'Assigned To', 'Description', 'Closing Remark', 'Status']];
  catcg: any = "All";
  prity: any = "All";
  sts: any = "All";
  fdate: any;
  tdate: any;
  downloadReport(type: any) {
    let catcg = this.categoryName(this.cat);
    let prity = this.priorityName(this.priorityy);
    let sts = this.statusName(this.statuss);
    this.report = [];
    let v: any;
    for (var i = 0; i < this.getGrievanceData.length; i++) {
      v = this.getGrievanceData[i];
      this.getGrievanceList = [];
      this.getGrievanceList.slNo = i + 1;
      if (v.groupId != null) {
        this.getGrievanceList.groupId = v.groupId.groupTypeName;
      } else {
        this.getGrievanceList.groupId = "Other";
      }
      this.getGrievanceList.fullname = v.fullname;
      this.getGrievanceList.tokenNumber = v.tokenNumber;
      if (v.grievanceSource == '1') {
        this.getGrievanceList.grievanceSource = "Call";
      } else if (v.grievanceSource == '2') {
        this.getGrievanceList.grievanceSource = "Whatsapp";
      } else {
        this.getGrievanceList.grievanceSource = "Email";
      }
      if (v.moduleName == '1') {
        this.getGrievanceList.moduleName = "TMS";
      } else if (v.moduleName == '2') {
        this.getGrievanceList.moduleName = "CMS";
      } else if (v.moduleName == '3') {
        this.getGrievanceList.moduleName = "Grievance";
      } else if (v.moduleName == '4') {
        this.getGrievanceList.moduleName = "Hospital Empanelment";
      } else if (v.moduleName == '5') {
        this.getGrievanceList.moduleName = "ChartBoart";
      } else if (v.moduleName == '6') {
        this.getGrievanceList.moduleName = "Mobile Application";
      } else if (v.moduleName == '7') {
        this.getGrievanceList.moduleName = "Website";
      } else if (v.moduleName == '8') {
        this.getGrievanceList.moduleName = "CCE(104)";
      } else {
        this.getGrievanceList.moduleName = "User Management";
      }
      if (v.categoryType == '1') {
        this.getGrievanceList.categoryType = "Complaint";
      } else if (v.categoryType == '2') {
        this.getGrievanceList.categoryType = "Issue";
      } else if (v.categoryType == '3') {
        this.getGrievanceList.categoryType = "Request";
      } else {
        this.getGrievanceList.categoryType = "Suggestion";
      }
      if (v.priority == '1') {
        this.getGrievanceList.priority = "High";
      } else if (v.priority == '2') {
        this.getGrievanceList.priority = "Medium";
      } else {
        this.getGrievanceList.priority = "Low";
      }
      if (v.description != null) {
        this.getGrievanceList.description = v.description;
      } else {
        this.getGrievanceList.description = "N/A";
      }
      if (v.documentName != null) {
        this.getGrievanceList.documentName = v.documentName;
      } else {
        this.getGrievanceList.documentName = "N/A";
      }
      if (v.createdOn != null) {
        this.getGrievanceList.createdOn = v.createdOn;
      } else {
        this.getGrievanceList.createdOn = "N/A";
      }
      if (v.expectedDate1 != null) {
        this.getGrievanceList.expectedDate1 = v.expectedDate1;
      } else {
        this.getGrievanceList.expectedDate1 = "N/A";
      }

      if (v.closeDate != null) {
        this.getGrievanceList.closeDate = v.closeDate;
      } else {
        this.getGrievanceList.closeDate = "N/A";
      }
      if (v.assignedName != null) {
        this.getGrievanceList.assignedName = v.assignedName;
      } else {
        this.getGrievanceList.assignedName = "N/A";
      }

      this.getGrievanceList.statusFlag = v.statusFlag;
      if (v.statusFlag == '0') {
        this.getGrievanceList.statusFlag = "Open";
      } else if (v.statusFlag == '1') {
        this.getGrievanceList.statusFlag = "InProgress";
      } else if (v.statusFlag == '2') {
        this.getGrievanceList.statusFlag = "Close";
      } else {
        this.getGrievanceList.statusFlag = "All";
      }
      if (v.closingDescription != null) {
        this.getGrievanceList.closingDescription = v.closingDescription;
      } else {
        this.getGrievanceList.closingDescription = "N/A";
      }
      this.getGrievanceList.closingDescription = v.closingDescription;
      this.report.push(this.getGrievanceList);
    }
    if (type == 1) {
      let filter = [];
      filter.push([['Received  From Date:- ', this.fordate]]);
      filter.push([['Received To Date:- ', this.todate]]);
      filter.push([[' Category :-', catcg]]);
      filter.push([[' Priority :-', prity]]);
      filter.push([[' Status :-', sts]]);
      TableUtil.exportListToExcelWithFilter(this.report, "GJAY Internal Grievance List", this.heading, filter);
    } else if (type == 2) {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('l', 'mm', [440, 320]);
      doc.setFontSize(21);
      doc.setFont('helvetica', 'bold');
      doc.text("Internal Grievance List", 190, 20);
      doc.setFontSize(15);
      doc.text("Received  From Date:-" + this.fordate, 15, 35);
      doc.text("Received To Date:-" + this.todate, 280, 35);
      doc.text("Category :-" + catcg, 15, 45);
      doc.text("Priority:-" + prity, 110, 45);
      doc.text("Status:-" + sts, 200, 45);
      doc.text("Generated On: " + this.convertDate(new Date()), 15, 55);
      doc.text("Generated By: " + this.user.fullName, 280, 55);
      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.slNo;
        pdf[1] = clm.tokenNumber;
        pdf[2] = clm.groupId;
        pdf[3] = clm.fullname;
        pdf[4] = clm.grievanceSource;
        pdf[5] = clm.moduleName;
        pdf[6] = clm.categoryType;
        pdf[7] = clm.priority;
        pdf[8] = clm.createdOn != 'N/A' ? this.convertDate1(clm.createdOn) : 'NA';
        pdf[9] = clm.expectedDate1 != 'N/A' ? this.convertDate3(clm.expectedDate1) : 'NA';
        pdf[10] = clm.closeDate != 'N/A' ? this.convertDate2(clm.closeDate) : 'NA';
        pdf[11] = clm.assignedName;
        pdf[12] = clm.description;
        pdf[13] = clm.closingDescription;
        pdf[14] = clm.statusFlag;
        rows.push(pdf);
      }
      autoTable(doc, {
        head: this.heading,
        body: rows,
        theme: 'grid',
        startY: 63,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 30 },
          2: { cellWidth: 30 },
          3: { cellWidth: 20 },
          4: { cellWidth: 30 },
          5: { cellWidth: 20 },
          6: { cellWidth: 20 },
          7: { cellWidth: 20 },
          8: { cellWidth: 25 },
          9: { cellWidth: 20 },
          10: { cellWidth: 50 },
          11: { cellWidth: 50 },
          12: { cellWidth: 25 },
          13: { cellWidth: 30 },
          14: { cellWidth: 30 },

        }
      });
      doc.save('GJAY Internal Grievance  List.pdf');
    }
  }
  convertDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy, h:mm:ss a');
    return date;
  }
  convertDate1(createdOn) {
    var datePipe = new DatePipe("en-US");
    createdOn = datePipe.transform(createdOn, 'dd-MMM-yyyy');
    return createdOn;
  }
  convertDate3(expectedDate1) {
    var datePipe = new DatePipe("en-US");
    expectedDate1 = datePipe.transform(expectedDate1, 'dd-MMM-yyyy');
    return expectedDate1;
  }

  convertDate2(closeDate) {
    var datePipe = new DatePipe("en-US");
    closeDate = datePipe.transform(closeDate, 'dd-MMM-yyyy');
    return closeDate;
  }
  Reset() {
    window.location.reload();
    $('#categoryType').val("0");
    $('#priority').val("0");
    $('#statusId').val("");
    this.getAllGrievanceInternal();
  }

  findStatus(event: any) {
    this.statu = event;
    this.statusFlag = event;
    if (this.statusFlag == 2) {
      $('#openCloseDate').show();
    } else {
      $('#openCloseDate').hide();
      $('#closingDate').val('');
      $('#closingDescription').val('')
    }

  }

  cancelData() {
    window.location.reload();
  }
  id: any
  doc: any
  remark: any
  modalview(item: any) {
    this.statu = "";
    $('#openCloseDate').hide();
    $('#closingDate').val('');
    $('#closingDescription').val('');
    this.grvby = item.fullname;
    this.rcvdate = item.createdOn
    this.expdate = item.expectedDate1
    this.module = item.moduleName
    this.type = item.categoryType
    this.prio = item.priority
    this.descrip = item.description
    this.email = item.email
    this.phoneno = item.phoneno
    this.statu = item.statusFlag
    this.assign = item.assignedName
    this.id = item.grievanceId
    this.doc = item.documentName
    this.tokenno = item.tokenNumber
  }

  m() {
    const ButtonClose = this.renderer.selectRootElement('#myButton');
    this.renderer.setAttribute(ButtonClose, 'data-bs-dismiss', 'modal');
    this.renderer.setAttribute(ButtonClose, 'aria-label', 'Close');
  }

  update() {
    let assinedTo = $('#assinedTo').val();
    let statusFlag = this.statusFlag
    let closingDate = $('#closingDate').val();
    let closingDescription = $('#closingDescription').val();
    let rcvD = this.rcvdate;
    if (assinedTo == null || assinedTo == "" || assinedTo == undefined) {
      this.swal("Info", "Please Fill Assigned To", 'info');
      return;
    }
    if (statusFlag == 2) {
      if (closingDate == null || closingDate == "" || closingDate == undefined) {
        this.swal("Info", "Please Fill Closing Date", 'info');
        return;
      }
      if (closingDescription == null || closingDescription == "" || closingDescription == undefined) {
        this.swal("Info", "Please Enter Closing Remark", 'info');
        return;
      }
      if (closingDate > rcvD) {
        this.swal('', ' Closing Date should be Greater that Assigned Date', 'error');
        return;
      }
    }
    this.internalGrivanceServiceService.update(assinedTo, statusFlag, closingDate, this.id, this.user.userId, closingDescription).subscribe((data) => {
      this.dataa = data;
      if (this.dataa.status == "Success") {
        this.swal("Success", this.dataa.message, "success");
        this.getAllGrievanceInternal();
      } else if (this.dataa.status == "Failed") {
        this.swal("Error", this.dataa.message, "error");
      } else {
        this.swal("Error", "Something went wrong", 'error');
      }
    });
  }


  keyPress(event: KeyboardEvent) {
    const pattern = /^[A-Za-z0-9.,-_ \\s]+$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  categoryName(cate: any) {
    if (cate == 1) {
      return "Complaint";
    } else if (cate == 2) {
      return "Issue";
    } else if (cate == 3) {
      return "Request";
    } else if (cate == 4) {
      return "Suggestion";
    } else {
      return "All";
    }
  }
  priorityName(prio: any) {
    if (prio == 1) {
      return "High";
    } else if (prio == 2) {
      return "Medium";
    } else if (prio == 3) {
      return "Low";
    } else {
      return "All";
    }
  }
  statusName(sta: any) {
    if (sta === 0) {
      return "Open";
    } else if (sta === 1) {
      return "Inprogress";
    } else if (sta === 2) {
      return "Close";
    } else {
      return "All";
    }
  }
}
