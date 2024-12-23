import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderService } from '../header.service';
import { StatisfiedReportService } from '../Services/statisfied-report.service';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import { ViewAppListService } from 'src/app/services/form-services/view-app-list.service';
import Swal from 'sweetalert2';
import * as XLSX from "xlsx";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-grievance-ccefeedback-report',
  templateUrl: './grievance-ccefeedback-report.component.html',
  styleUrls: ['./grievance-ccefeedback-report.component.scss']
})
export class GrievanceCCEFeedbackReportComponent implements OnInit {
  cceReport: any;
  txtsearchDate: any;
  showPegi: any;
  pageElement: any;
  currentPage: any;
  hospitalList: any=[];
  districtList: any=[];
  stateList: any=[];
  months: string;
  year: number;
  selectedItems: any = [];
  cceOutboundData: any;
  record: any;
  user: any;
  fromDate: any;
  toDate: any;
  countfloate: number;
  action: string;
  hospitalCode: string;
  userId: string;
  CceDetails: any;
  CceDetailsList: any[];
  pageIn: number;
  pageEnd: any;
  selectedIndex: number;
  size: number;
  pgList: any[];
  pgElement: any;
constructor(private route: Router, public headerService: HeaderService,
    private statisfiedReportService: StatisfiedReportService,
    private snoService: SnocreateserviceService,
    private appListService: ViewAppListService, private sessionService: SessionStorageService) { }
 ngOnInit(): void {
    this.currentPage = 1;
    this.pageElement = 100;
    this.selectedIndex = 1;
    this.headerService.setTitle('Grievance CCE Feedback Report');
    this.user = this.sessionService.decryptSessionData("user");
    $('.selectpicker').selectpicker();

    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      maxDate: new Date(),
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
    let month: any = date.getMonth();
    if (month == -1) {
      this.months = 'Dec';
      this.year = year - 1;
    } else {
      this.months = this.getMonthFrom(month);
      this.year = year;
    }
    var frstDay = date1 + '-' + this.months + '-' + this.year;
    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr("placeholder", "From Date *");
    $('input[name="toDate"]').attr("placeholder", "To Date *");
    this.getStateList();
    this.OnChangeState(this.stateId);
    this.onSearch();
  }
  stateId:any='21';
  getMonthFrom(month) {
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
    return month;
  }
  getDate(date) {
    let year = date.getFullYear();
    let date1 = date.getDate();
    let months = date.getMonth();
    let month = this.getMonthFrom(months);
    var frstDay = date1 + '-' + month + '-' + year;
    return frstDay;
  }
  timespan:any;
  stateData: any = [];
  statelist: Array<any> = [];
  getStateList() {
    this.snoService.getStateList().subscribe((data: any) => {
      this.stateData = data;
      this.stateData.sort((a, b) => a.stateName.localeCompare(b.stateName));
      for (let j = 0; j < this.stateData.length; j++) {
        if (this.stateData[j].stateCode == '21') {
          this.statelist.push(this.stateData[j]);
        }
      }
      for (let i = 0; i < this.stateData.length; i++) {
        if (this.stateData[i].stateCode != '21') {
          this.statelist.push(this.stateData[i]);
        }
      }
      console.log(this.statelist);
    });
  }
  OnChangeState(id) {
    // alert(id);
    $("#districtId").val("");
    this.selectedItems = [];
    localStorage.setItem("stateCode", id);
    this.snoService.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = response;
        console.log(response);
      },
      (error) => console.log(error)
    )
  }

SNALISt: any = {
  slno: "",
  district:"",
  tillLastmonth:"",
  duringMonth:"",
  total: "",
  tillLastMonthComplied:"",
  duringMonthCmplied: "",
  totalComplied: "",
  pending3months: "",
  pending1months: "",
  pending15days: "",
  pendingDGO:"",
  pendingDC:"",
  totalPending:""
};
report: any = [];
downloadReport() {
  this.report = [];
  let sna: any;
  for (var i = 0; i < this.countlist.length; i++) {
    sna = this.countlist[i];
    this.SNALISt = [];
    this.SNALISt.slno = i + 1;
    this.SNALISt.district=sna.DISTRICTNAME;
    this.SNALISt.tillLastmonth=sna.TILL_LAST_MONTH;
    this.SNALISt.duringMonth=sna.DURING_THE_MONTH;
    this.SNALISt.total = sna.TOTAL;
    this.SNALISt.tillLastMonthComplied=sna.TILL_LAST_MONTH_RESOLVED;
    this.SNALISt.duringMonthCmplied = sna.DURING_THE_MONTH_RESOLVED;
    this.SNALISt.totalComplied = sna.TOTAL_RESOLVED;
    this.SNALISt.pending3months = sna.PENDING_MORE_THAN_90_DAYS;
    this.SNALISt.pending1months = sna.PENDING_MORE_THAN_30_DAYS;
    this.SNALISt.pending15days= sna.PENDING_MORE_THAN_15_DAYS;
    this.SNALISt.pendingDGO=sna.PENDINGAT_DGO;
    this.SNALISt.pendingDC=sna.PENDINGAT_DC;
    this.SNALISt.totalPending=sna.TOTAL_PENDING_DC_DGO;
    this.report.push(this.SNALISt);
  }
  let stateName = 'All', districtName = 'All';
  let fromDate = this.requestData1.fromDate;
  let toDate = this.requestData1.toDate;
  for(var i=0;i<this.statelist.length;i++) {
    if(this.requestData1.state==this.statelist[i].stateCode) {
      stateName=this.statelist[i].stateName;
    }
  }
  for(var i=0;i<this.districtList.length;i++) {
    if(this.requestData1.district==this.districtList[i].districtcode) {
      districtName=this.districtList[i].districtname;
    }
  }
    let filter =[];
    filter.push([['From Date', fromDate]]);
    filter.push([['To Date', toDate]]);
    filter.push([['State Name', stateName]]);
    filter.push([['District Name', districtName]]);
          this.exportfiltercceListToExcel(
          this.report,
          'CCE Feedback Report',
          this.excelHeading,
          filter,
          this.excelSubHeading
        );
}
exportfiltercceListToExcel(list: any[], name: string, heading: any[],filter: any[], subheading: any[]) {
  let generatedOn = this.convertDate(new Date());
  let generatedBy = this.user.fullName;
  if(list==null || list.length==0) {
    Swal.fire("Info", "No data found", 'info');
    return;
  }
  const header = Object.keys(list[0]);
  const subheader = Object.keys(list[0]);
  var wscols = [];
  for (var i = 0; i < header?.length && subheader?.length; i++) {  // columns length added
      wscols.push({ wch: header[i]?.length + 15 && subheader[i]?.length + 15})
  }

  var wb = XLSX.utils.book_new();
  var ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([]);
  for(var i=0; i<filter.length; i++) {
    XLSX.utils.sheet_add_aoa(ws, filter[i], { origin: 'A'+(1+i).toString() });
  }
  XLSX.utils.sheet_add_aoa(ws, [['Generated By', generatedBy]], { origin: 'A'+(filter.length+1).toString() });
  XLSX.utils.sheet_add_aoa(ws, [['Generated On', generatedOn]], { origin: 'A'+(filter.length+2).toString() });
  XLSX.utils.sheet_add_aoa(ws, heading, { origin: 'A'+(filter.length+4).toString() });
  XLSX.utils.sheet_add_aoa(ws, subheading, { origin: 'A'+(filter.length+5).toString() });
  XLSX.utils.sheet_add_json(ws, list, { origin: 'A'+(filter.length+6).toString(), skipHeader: true });
  ws['!merges'] = [
    { s: { r: filter.length+3, c: 2 }, e: { r: filter.length+3, c: 4 } },
    { s: { r: filter.length+3, c: 5 }, e: { r: filter.length+3, c: 7 } },
    { s: { r: filter.length+3, c: 8 }, e: { r: filter.length+3, c: 10 } },
    { s: { r: filter.length+3, c: 0 }, e: { r: filter.length+4, c: 0 } },
    { s: { r: filter.length+3, c: 1 }, e: { r: filter.length+4, c: 1 } },
    { s: { r: filter.length+3, c: 11 }, e: { r: filter.length+4, c: 11 } },
    { s: { r: filter.length+3, c: 12 }, e: { r: filter.length+4, c: 12} },
    { s: { r: filter.length+3, c: 13 }, e: { r: filter.length+4, c: 13} },
  ];
  ws['!cols'] = wscols;
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, "GJAY_"+name+".xlsx");
}

excelHeading=[
  [
    'Sl#',
    'Name Of District',
    'CCE Feedback',
    'CCE Feedback',
    'CCE Feedback',
    'Complied',
    'Complied',
    'Complied',
    'Pending More Than',
    'Pending More Than',
    'Pending More Than',
    'Pending With DGO',
    'Pending With DC',
    'Final Pending',
  ]
]
excelSubHeading=[
  [
    '',
    '',
    'Till Last Month',
    'During The Month',
    'Total',
    'Till Last Month',
    'During The Month',
    'Total',
    '3 Months',
    '1 Month',
    '15 Days',
    '',
    '',
    '',
  ]
]
heading = [
  [
    'Sl#',
    'Name Of District',
    '',
    'CCE Feedback',
    '',
    '',
    'Complied',
    '',
    '',
    'Pending More Than',
    '',
    'Pending With DGO',
    'Pending With DC',
    'Final Pending',
  ],
  [
    '',
    '',
    'Till Last Month',
    'During The Month',
    'Total',
    'Till Last Month',
    'During The Month',
    'Total',
    '3 Months',
    '1 Month',
    '15 Days',
    '',
    '',
    '',
  ]
];
downloadPdf() {
  var doc = new jsPDF('l', 'mm', [300, 240]);
  doc.setFontSize(12);
  let stateName = 'All', districtName = 'All';
  let fromDate = this.requestData1.fromDate;
  let toDate = this.requestData1.toDate;
  for(var i=0;i<this.statelist.length;i++) {
    if(this.requestData1.state==this.statelist[i].stateCode) {
      stateName=this.statelist[i].stateName;
    }
  }
  for(var i=0;i<this.districtList.length;i++) {
    if(this.requestData1.district==this.districtList[i].districtcode) {
      districtName=this.districtList[i].districtname;
    }
  }
  doc.text('From Date:'+fromDate, 10, 10);
  doc.text('To Date:'+toDate, 170, 10);
  doc.text('State Name:'+stateName, 10, 20);
  doc.text('District Name:'+districtName, 170, 20);
  doc.text("Generated On: "+this.convertDate(new Date()), 10, 30);
  doc.text("Generated By: "+this.user.fullName, 170, 30);
  doc.text("CCE Feedback Report", 110, 40);
  var col = this.heading;
  var rows = [];
  var claim: any;
  for(var i=0;i<this.countlist.length;i++) {
    claim = this.countlist[i];
    var temp = [i+1, claim.DISTRICTNAME, claim.TILL_LAST_MONTH, claim.DURING_THE_MONTH,claim.TOTAL, claim.TILL_LAST_MONTH_RESOLVED,
    claim.DURING_THE_MONTH_RESOLVED, claim.TOTAL_RESOLVED,claim.PENDING_MORE_THAN_90_DAYS,claim.PENDING_MORE_THAN_30_DAYS,claim.PENDING_MORE_THAN_15_DAYS,
    claim.PENDINGAT_DC,claim.PENDINGAT_DGO,claim.TOTAL_PENDING_DC_DGO];
    rows.push(temp);
  }
  autoTable(doc, {
    head: col,
    body: rows,
    theme: 'grid',
    startY: 50,
    // styles: {overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20},
    // bodyStyles: {overflow: 'linebreak',cellWidth: 'wrap',lineWidth: 0.1, lineColor: 0, textColor: 20},
    headStyles: {fillColor:[26,99,54]},
    columnStyles: {
      0: {cellWidth: 10},
      1: {cellWidth: 20},
      2: {cellWidth: 20},
      3: {cellWidth: 20},
      4: {cellWidth: 20},
      5: {cellWidth: 20},
      6: {cellWidth: 20},
      7: {cellWidth: 20},
      8: {cellWidth: 20},
      9: {cellWidth: 20},
      10: {cellWidth: 20},
      11: {cellWidth: 20},
      12: {cellWidth: 20},
      13: {cellWidth: 20},
    }
  });

  doc.save('CCE Feedback Report.pdf');
}
  convertStringToDate1(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy HH:mm:ss');
    return date;
    }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  resetField() {
    window.location.reload();
  }
  username:any;
  state:any;
  dis:any;
  hospital:any;
  formdat:any;
  todat:any;
  GetDate(str) {
    var arr = str.split("-");
    var months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

    var month = months.indexOf(arr[1].toLowerCase());

    return new Date(parseInt(arr[2]), month, parseInt(arr[0]));
  }
  days:any;
  countlist:any=[];
  requestData1:any;
  onSearch() {
    let userId = this.user.userId;
    this.fromDate = $('#date3').val();
    this.toDate = $('#date4').val();
    let stateCode = this.stateId;
    let distCode = $('#districtId').val();
    if(this.fromDate=='' || this.fromDate==null || this.fromDate==undefined){
      this.swal('', 'Please Select From Date', 'error');
      return;
    }
    if(this.toDate=='' || this.toDate==null || this.toDate==undefined){
      this.swal('', 'Please Select To Date', 'error');
      return;
    }
    if (Date.parse(this.fromDate) > Date.parse(this.toDate)) {
      this.swal('', 'From Date should be less than To Date', 'error');
      return;
    }
    const fromDate1=this.GetDate(this.fromDate);
    const todate1=this.GetDate(this.toDate);
    let diffTime = Math.abs(todate1.getTime() - fromDate1.getTime());
    this.days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // alert(this.days);
    if(this.days>365){
      this.swal('', ' Maximum 1 year Allow', 'error');
      return;
    }
     this.requestData1 = {
      userId: userId,
      fromDate: this.fromDate,
      toDate: this.toDate,
      state: stateCode,
      district: distCode,
    };
    console.log(this.requestData1);
    this.appListService.getCCEFeedbackReportsDetails(this.requestData1).subscribe(
      (data:any) => {
        console.log(JSON.parse(data.details));
        let resData = data;
        if (resData.status == 'success') {
          let details = JSON.parse(resData.details);
          this.countlist = details.actionData;
          this.record = this.countlist.length;
          if (this.record > 0) {
            this.showPegi = true;
          } else {
            this.showPegi = false;
          }
        } else {
          this.swal('', 'Something went wrong.', 'error');
        }

      },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      }
    );
  }
  convertDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy, h:mm:ss a');
    return date;
  }

}
