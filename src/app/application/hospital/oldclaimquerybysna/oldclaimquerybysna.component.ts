import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../header.service';
import { SnoCLaimDetailsService } from '../../Services/sno-claim-details.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TableUtil } from '../../util/TableUtil';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-oldclaimquerybysna',
  templateUrl: './oldclaimquerybysna.component.html',
  styleUrls: ['./oldclaimquerybysna.component.scss']
})
export class OldclaimquerybysnaComponent implements OnInit {

  childmessage: any;
  user: any;
  txtsearchDate: any;
  stateCode: any;
  userId: any;
  distCode: any;
  snoclaimlist: any = [];
  record: any;
  showPegi: boolean;
  currentPage: any;
  pageElement: any;
  totalClaimCount: any;
  dataRequest: any;
  claimstatus: any = "";
  fromDate: any;
  toDate: any;
  stateCode1: any;
  distCode1: any;
  hospitalCode: any;
  currentPagenNum: any;
  month:any;
  year:any;
  description:any;
  hospital:any='';
  districtId:any='';
  stateId:any='';
  constructor(
    public headerService: HeaderService,
    public snoService: SnoCLaimDetailsService,
    public route: Router,
    private sessionService: SessionStorageService
  ) {}

  ngOnInit(): void {
    this.user =  this.sessionService.decryptSessionData("user");
    this.dataRequest = this.sessionService.decryptSessionData("requestData");
    this.currentPagenNum = this.sessionService.decryptSessionData("currentPageNum");
    this.headerService.setTitle('Old Claim Queried By SNA');
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);

    this.currentPage = 1;
    this.pageElement = 50;
    $('.selectpicker').selectpicker();

    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      // endDate: '0d',
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
    let months: any = date.getMonth() - 1;
    if(months == -1){
      this.month = 'Dec';
      this.year = year-1;
    }else{
      this.month = this.getMonthFrom(months);
      this.year = year;
    }
    var frstDay = date1 + '-' + this.month + '-' + this.year;

    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr('placeholder', 'From Date *');

    $('input[name="toDate"]').attr('placeholder', 'To Date *');

    if (
      this.dataRequest == null ||
      this.dataRequest == undefined ||
      this.dataRequest == ''
    ) {
    } else {
      let date = new Date(this.dataRequest.fromDate);
      let fromDate = this.getDate(date);
      $('input[name="fromDate"]').val(fromDate);
      let date1 = new Date(this.dataRequest.toDate);
      let toDate = this.getDate(date1);
      $('input[name="toDate"]').val(toDate);
      this.claimstatus=this.dataRequest.claimStatus;
    }
    this.getSnoClaimDetails()
  }
  getDate(date) {
    let year = date.getFullYear();
    let date1 = date.getDate();
    let months = date.getMonth();
    let month = this.getMonthFrom(months);
    var frstDay = date1 + '-' + month + '-' + year;
    return frstDay;
  }
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
  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }
  stateList:any;
  districtList:any
  hospitalList:any
  selectedItems: any = [];
  
  requestData: any;
  getSnoClaimDetails() {
    let hospitalcode = this.user.userName;
    let claimStatus=this.claimstatus;
    this.fromDate = $('#datepicker15').val();
    this.toDate = $('#datepicker16').val();
    if(this.fromDate=='' || this.fromDate==null){
      this.swal('', 'From Date Should not be Blank', 'error');
      return;
    }
    if(this.toDate=='' || this.toDate==null){
      this.swal('', 'To Date Should not be Blank', 'error');
      return;
    }
    if (Date.parse(this.fromDate) > Date.parse(this.toDate)) {
      this.swal('', 'From Date should be less than To Date', 'error');
      return;
    }
    this.requestData = {
      hospitalCode: hospitalcode,
      fromDate: new Date(this.fromDate),
      toDate: new Date(this.toDate),
      claimStatus:claimStatus
    };
    console.log(this.requestData);
    // sessionStorage.setItem('requestData', JSON.stringify(this.requestData));
    this.sessionService.encryptSessionData('requestData', this.requestData)
    this.snoService.getOldClaimQueryBySNAlist(this.requestData).subscribe(
      (data) => {
        this.snoclaimlist = data;
        this.totalClaimCount = this.snoclaimlist.length;
        console.log(data);
        this.record = this.snoclaimlist.length;
        if (this.record > 0) {
          this.showPegi = true;
        } else {
          this.showPegi = false;
        }
      },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      }
    );
  }
  onAction(claimID: any) {
    console.log(claimID);
      let statesno={
        claimid:claimID
      }
    localStorage.setItem("actionDataforsno",JSON.stringify(statesno));
    localStorage.setItem("currentPageNum",JSON.stringify(this.currentPage));
    this.route.navigate(['/application/oldclaimQueriedBySNA/Action']);
  }
  ResetField() {
    sessionStorage.removeItem('requestData');
    window.location.reload();
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  traverseToRequiredPage() {
    if (this.currentPagenNum != null && this.currentPagenNum != undefined) {
      this.currentPage = this.currentPagenNum;
      sessionStorage.removeItem('currentPageNum');
    } else {
      this.currentPage = 1;
    }
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
  report: any = [];
  sno: any = {
    Slno: "",
    URN: "",
    PatientName: "",
    InvoiceNo: "",
    packageName: "",
    packageCode: "",
    DateofAdmission: "",
    ActualDateofAdmission: "",
    DateofDischarge: "",
    ActualDateofDischarge: "",
    oldClaimStatus:"",
    claimAmount: "",
    queryOn: ""
  };
  heading = [['Sl#', 'URN','Patient Name', 'Invoice No','Package Code', 'Package Name','Date of Admission' ,'Actual Date of Admission','Date of Discharge','Actual Date of Discharge','Old Claim Status', 'Claim Amount','Query On']];

downloadReport(){

this.report = [];
let claim: any;
for(var i=0;i<this.snoclaimlist.length;i++) {
  claim = this.snoclaimlist[i];
  console.log(claim);
  this.sno = [];
  this.sno.Slno = i+1;
  this.sno.URN = claim.urn;
  this.sno.PatientName = claim.patientName;
  this.sno.InvoiceNo = claim.invoiceno;
  this.sno.packageCode = claim.packageCode;
  this.sno.packageName = claim.packageName;
  this.sno.DateofAdmission = claim.dateofadmission;
  this.sno.ActualDateofAdmission =  claim.actualdateofadmission;
  this.sno.DateofDischarge =  claim.dateOfDischarge;
  this.sno.ActualDateofDischarge = claim.actualdateofdischarge;
  this.sno.oldClaimStatus=claim.oldCLaimStatus;
  this.sno.claimAmount =  claim.currentTotalAmount;
  this.sno.queryOn =  this.convertDate(claim.claimRaiseby);
  this.report.push(this.sno);
}
      let filter =[],oldclaimStatus='All';
      if(this.requestData.claimStatus!='' && this.requestData.claimStatus!=null)
        oldclaimStatus=this.requestData.claimStatus;
      filter.push([['Actual Date of Discharge From',this.convertStringToDate(this.requestData.fromDate)]]);
      filter.push([['Actual Date of Discharge To', this.convertStringToDate(this.requestData.toDate)]]);
      filter.push([['Old Claim Status', oldclaimStatus]]);
      TableUtil.exportListToExcelWithFilter(this.report, 'Old Claim Queried By SNA List', this.heading, filter);
}
downloadPdf() {
    var doc = new jsPDF('l', 'mm', [285, 255]);
    doc.setFontSize(12);
    let oldclaimStatus='All';
    if(this.requestData.claimStatus!='' && this.requestData.claimStatus!=null)
      oldclaimStatus=this.requestData.claimStatus;
    doc.text('Actual Date of Discharge From:'+this.convertStringToDate(this.requestData.fromDate), 10, 10);
    doc.text('Actual Date of Discharge To:'+this.convertStringToDate(this.requestData.toDate), 150, 10);
    doc.text("Old Claim Status: "+oldclaimStatus, 10, 20);
    doc.text("Generated On: "+this.convertDate(new Date()), 10, 30);
    doc.text("Generated By: "+this.user.fullName, 150, 30);
    doc.text("Old Claim Queried By SNA List", 110, 40);
    var col = [['Sl#', 'URN','Patient Name', 'Invoice No','Package Code', 'Package Name','Date of Admission' ,'Actual Date of Admission','Date of Discharge','Actual Date of Discharge','Old Claim Status', 'Claim Amount','Query On']];
    var rows = [];
    var claim: any;
    for(var i=0;i<this.snoclaimlist.length;i++) {
      claim = this.snoclaimlist[i];
      var temp = [i+1, claim.urn, claim.patientName, claim.invoiceno,claim.packageCode, claim.packageName,claim.dateofadmission, claim.actualdateofadmission,claim.dateOfDischarge,claim.actualdateofdischarge,claim.oldCLaimStatus,claim.currentTotalAmount,this.convertDate(claim.claimRaiseby)];
      rows.push(temp);
    }
    autoTable(doc, {
      head: col,
      body: rows,
      theme: 'grid',
      startY: 50,
      styles: {overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20},
      bodyStyles: {overflow: 'linebreak',cellWidth: 'wrap',lineWidth: 0.1, lineColor: 0, textColor: 20},
      headStyles: {overflow: 'linebreak',cellWidth: 'wrap',lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255],fillColor: [26, 99, 54]},
      columnStyles: {
        0: {cellWidth: 10},
        1: {cellWidth: 25},
        2: {cellWidth: 25},
        3: {cellWidth: 20},
        4: {cellWidth: 30},
        5: {cellWidth: 25},
        6: {cellWidth: 20},
        7: {cellWidth: 20},
        8: {cellWidth: 20},
        9: {cellWidth: 20},
        10:{cellWidth:20},
        11:{cellWidth:20},
        12:{cellWidth:20}
      }
    });
    doc.save('Old Claim Queried By SNA List.pdf');

}
convertStringToDate(date) {
  var datePipe = new DatePipe("en-US");
  date = datePipe.transform(date, 'dd-MMM-yyyy');
  return date;
  }
  convertDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy, h:mm:ss a');
    return date;
    }
}
