import { Component, OnInit } from '@angular/core';
import { ReportcountService } from '../application/Services/reportcount.service';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TableUtil } from '../application/util/TableUtil';
import { DatePipe } from '@angular/common';
import { SessionStorageService } from '../services/session-storage.service';

@Component({
  selector: 'app-grievance-count-report',
  templateUrl: './grievance-count-report.component.html',
  styleUrls: ['./grievance-count-report.component.scss']
})
export class GrievanceCountReportComponent implements OnInit {

  token: any;
  fromDate: any;
  toDate: any;
  urn: any;
  eventName: any;
  showPegi: boolean;
  record: any;
  countprogressreport: any=[];
  currentPage: any;
  pageElement: any;
  txtsearchDate: any;
  userId: any;
  hospitalId: any;
  districtId: any;
  stateId: any;
  groupid: any;
  pageHeading: any;
  user: any;
  innerFlag:any;
  constructor(private reportCount: ReportcountService, private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.user = this.sessionService.decryptSessionData("user");
    this.fromDate= localStorage.getItem("fromDate");
    this.toDate= localStorage.getItem("toDate");
    this.eventName= localStorage.getItem("eventName");//p_pending_at--DC,DGO,GO,All
    this.innerFlag= localStorage.getItem("innerFlag");//p_flag--BNF,HOS,MS,NP,EL,SM
    this.token=localStorage.getItem("token");
    this.stateId=localStorage.getItem("stateId");
    this.districtId=localStorage.getItem("districtId");
    this.getHeading(this.innerFlag);
    this.getdetails();
  }
grievanceDetailsArray:any=[];
  getdetails() {
    let requestObj = {
      "fromDate":new Date(this.fromDate),
      "toDate": new Date(this.toDate),
      "sectionFlag": this.eventName,
      "inSection": this.innerFlag,
      "stateCode": this.stateId,
      "districtCode": this.districtId,
    }
    console.log(requestObj);
    this.reportCount.getGOSecReport(requestObj).subscribe((data:any)=>{
      console.log(data);
      this.grievanceDetailsArray=data.grievanceDetails;
      localStorage.removeItem("fromDate");
      localStorage.removeItem("toDate");
      localStorage.removeItem("eventName");
      localStorage.removeItem("innerFlag");
      localStorage.removeItem("token");
      localStorage.removeItem("stateId");
      localStorage.removeItem("districtId");
    },(error) => {
      console.log(error);
      this.swal('', 'Something went wrong.', 'error');
    });
  }
  getHeading(event) {
    switch(event) {
      case 'BNF':
        this.pageHeading = 'Beneficiaries';
        break;
      case 'HOS':
        this.pageHeading = 'Hospital';
        break;
      case 'MS':
        this.pageHeading = 'Mo Sarkar';
        break;
      case 'NP':
        this.pageHeading = 'News Paper';
        break;
      case 'EL':
        this.pageHeading = 'Email/Letter';
        break;
      case 'SM':
        this.pageHeading = 'Social Media';
        break;
      default:
        console.log('Invalid choice');
        break;
    }
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  downloadPdf() {
    if(this.grievanceDetailsArray.length==0) {
      Swal.fire("Info", "No data found", 'info');
      return;
    }
    var doc = new jsPDF('l', 'mm', [280, 210]);
    doc.setFontSize(12);
    let registeredBy = '', pendingAt = '';
    registeredBy=this.pageHeading;
    pendingAt=this.eventName;
    doc.text('Registered By:'+registeredBy, 10, 10);
    doc.text('Pending At:'+pendingAt, 150, 10);
    doc.text("Generated On: "+this.convertDate(new Date()), 10, 20);
    doc.text("Generated By: "+this.user.fullName, 150, 20);
    doc.text("Dashboard Count Details", 100, 30);
    var col = this.heading;
    var rows = [];
    var claim: any;
    for(var i=0;i<this.grievanceDetailsArray.length;i++) {
      claim = this.grievanceDetailsArray[i];
      var temp = [i+1, claim.applicationNo, claim.beneficiaryName, claim.contactNo,claim.stateName, claim.districtName,claim.hospitalDetails, 
      claim.registeredBy, claim.grievanceMedium,claim.appliedDate,claim.lastActionBy,claim.pendingAt];
      rows.push(temp);
    }
    autoTable(doc, {
      head: col,
      body: rows,
      theme: 'grid',
      startY: 40,
      styles: {overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20},
      bodyStyles: {overflow: 'linebreak',cellWidth: 'wrap',lineWidth: 0.1, lineColor: 0, textColor: 20},
      headStyles: {overflow: 'linebreak',cellWidth: 'wrap',lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255],fillColor: [26, 99, 54]},
      columnStyles: {
        0: {cellWidth: 10},
        1: {cellWidth: 25},
        2: {cellWidth: 25},
        3: {cellWidth: 20},
        4: {cellWidth: 25},
        5: {cellWidth: 30},
        6: {cellWidth: 20},
        7: {cellWidth: 20},
        8: {cellWidth: 20},
        9: {cellWidth: 20},
        10:{cellWidth:20},
        11:{cellWidth:20}
      }
    });
    doc.save('Dashboard_Count_Details.pdf');
}

heading = [
  [
    'Sl#',
    'Grievance Number',
    'Beneficiary Name',
    'Contact No',
    'State Name',
    'District Name',
    'Hospital Details',
    'Registered by',
    'Grievance Medium Name',
    'Applied Date',
    'Last Action by',
    'Pending At'
  ],
];
SNALISt: any = {
  slno: "",
  GrievanceNo:"",
  beneficiaryName:"",
  contactNo:"",
  state: "",
  district:"",
  hospital: "",
  registerBy: "",
  MediumName: "",
  AppliedDate: "",
  lastActionBy: "",
  status:""
};
report: any = [];
downloadReport() {
  this.report = [];
  let sna: any;
  for (var i = 0; i < this.grievanceDetailsArray.length; i++) {
    sna = this.grievanceDetailsArray[i];
    this.SNALISt = [];
    this.SNALISt.slno = i + 1;
    this.SNALISt.GrievanceNo=sna.applicationNo;
    this.SNALISt.beneficiaryName=sna.beneficiaryName;
    this.SNALISt.contactNo=sna.contactNo;
    this.SNALISt.state = sna.stateName;
    this.SNALISt.district=sna.districtName;
    this.SNALISt.hospital = sna.hospitalDetails;
    this.SNALISt.registerBy = sna.registeredBy;
    this.SNALISt.MediumName = sna.grievanceMedium;
    this.SNALISt.AppliedDate = sna.appliedDate;
    this.SNALISt.lastActionBy= sna.lastActionBy;
    this.SNALISt.status=sna.pendingAt;
    this.report.push(this.SNALISt);
  }
    let registeredBy = '', pendingAt = '';
    registeredBy=this.pageHeading;
    pendingAt=this.eventName;
    let filter =[];
    filter.push([['Registered By', registeredBy]]);
    filter.push([['Pending At', pendingAt]]);
  TableUtil.exportListToExcelWithFilter(this.report, 'Dashboard_Count_Details', this.heading, filter);
}
convertDate(date) {
  var datePipe = new DatePipe("en-US");
  date = datePipe.transform(date, 'dd-MMM-yyyy, h:mm:ss a');
  return date;
}
}
