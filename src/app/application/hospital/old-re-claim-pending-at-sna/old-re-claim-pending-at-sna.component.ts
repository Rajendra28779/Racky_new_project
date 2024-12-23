import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../header.service';
import { SnoCLaimDetailsService } from '../../Services/sno-claim-details.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TableUtil } from '../../util/TableUtil';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-old-re-claim-pending-at-sna',
  templateUrl: './old-re-claim-pending-at-sna.component.html',
  styleUrls: ['./old-re-claim-pending-at-sna.component.scss']
})
export class OldReCLaimPendingAtSNAComponent implements OnInit {
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
    this.user = this.sessionService.decryptSessionData("user");
    this.dataRequest =  this.sessionService.decryptSessionData("requestData");
    this.currentPagenNum = this.sessionService.decryptSessionData("currentPageNum");

    this.headerService.setTitle('Query Re-Claimed And Pending At SNA');
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

    $('input[name="fromDate1"]').val(frstDay);
    $('input[name="fromDate1"]').attr('placeholder', 'From Date *');

    $('input[name="toDate1"]').attr('placeholder', 'To Date *');

    if (
      this.dataRequest != null &&
      this.dataRequest != undefined &&
      this.dataRequest != ''
    ) {
    } else {
      let date = new Date(this.dataRequest.fromDate);
      let fromDate = this.getDate(date);
      $('input[name="fromDate1"]').val(fromDate);
      let date1 = new Date(this.dataRequest.toDate);
      let toDate = this.getDate(date1);
      $('input[name="toDate1"]').val(toDate);
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
    this.fromDate = $('#datepicker17').val();
    this.toDate = $('#datepicker18').val();
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
    this.snoService.getReCLaimedAndPendingAtSNAlist(this.requestData).subscribe(
      (data:any) => {
        if (data.status == 'success') {
          let details = JSON.parse(data.details);
          this.snoclaimlist = details.actionData;
          console.log(this.snoclaimlist);
          this.record = this.snoclaimlist.length;
          if(this.record>0){
            this.showPegi = true;
          }else{
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
    claimNo:"",
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
    ReClaimAmount: "",
    ReClaimOn: ""
  };
  heading = [['Sl#','Claim No.','URN','Patient Name', 'Invoice No','Package Code', 'Package Name','Date of Admission' ,'Actual Date of Admission','Date of Discharge','Actual Date of Discharge','Old Claim Status', 'Re-Claim Amount','Re-Claim On']];

downloadReport(){
this.report = [];
let claim: any;
for(var i=0;i<this.snoclaimlist.length;i++) {
  claim = this.snoclaimlist[i];
  this.sno = [];
  this.sno.Slno = i+1;
  this.sno.claimNo = claim.CLAIMNO;
  this.sno.URN = claim.URN;
  this.sno.PatientName = claim.PATIENTNAME;
  this.sno.InvoiceNo = claim.INVOICENO;
  this.sno.packageCode = claim.PACKAGECODE;
  this.sno.packageName = claim.PACKAGENAME;
  this.sno.DateofAdmission = this.convertStringToDate(claim.DATEOFADMISSION);
  this.sno.ActualDateofAdmission =  this.convertStringToDate(claim.ACTUALDATEOFADMISSION);
  this.sno.DateofDischarge =  this.convertStringToDate(claim.DATEOFDISCHARGE);
  this.sno.ActualDateofDischarge = this.convertStringToDate(claim.ACTUALDATEOFDISCHARGE);
  this.sno.oldClaimStatus=claim.OLDCLAIMSTATUS;
  this.sno.ReClaimAmount =  this.convertnumbertoCurrency(claim.CLAIMAMOUNT);
  this.sno.ReClaimOn =  this.convertDate(claim.ACTIONON);
  this.report.push(this.sno);
}
      let filter =[],oldclaimStatus='All';
      if(this.requestData.claimStatus!='' && this.requestData.claimStatus!=null)
        oldclaimStatus=this.requestData.claimStatus;
      filter.push([['Actual Date of Discharge From',this.convertStringToDate(this.requestData.fromDate)]]);
      filter.push([['Actual Date of Discharge To', this.convertStringToDate(this.requestData.toDate)]]);
      filter.push([['Old Claim Status', oldclaimStatus]]);
      TableUtil.exportListToExcelWithFilter(this.report, 'Query Re-Claimed And Pending At SNA List', this.heading, filter);
}
downloadPdf() {
    var doc = new jsPDF('l', 'mm', [325, 290]);
    doc.setFontSize(12);
    let oldclaimStatus='All';
    if(this.requestData.claimStatus!='' && this.requestData.claimStatus!=null)
      oldclaimStatus=this.requestData.claimStatus;
    doc.text('Actual Date of Discharge From:'+this.convertStringToDate(this.requestData.fromDate), 10, 10);
    doc.text('Actual Date of Discharge To:'+this.convertStringToDate(this.requestData.toDate), 160, 10);
    doc.text("Old Claim Status: "+oldclaimStatus, 10, 20);
    doc.text("Generated On: "+this.convertDate(new Date()), 10, 30);
    doc.text("Generated By: "+this.user.fullName, 160, 30);
    doc.text("Query Re-Claimed And Pending At SNA List", 110, 40);
    var col = [['Sl#','Claim No.','URN','Patient Name', 'Invoice No','Package Code', 'Package Name','Date of Admission' ,'Actual Date of Admission','Date of Discharge','Actual Date of Discharge','Old Claim Status', 'Re-Claim Amount','Re-Claim On']];
    var rows = [];
    var claim: any;
    for(var i=0;i<this.snoclaimlist.length;i++) {
      claim = this.snoclaimlist[i];
      var temp = [i+1, claim.CLAIMNO, claim.URN, claim.PATIENTNAME,claim.INVOICENO, claim.PACKAGECODE,claim.PACKAGENAME, this.convertStringToDate(claim.DATEOFADMISSION),this.convertStringToDate(claim.ACTUALDATEOFADMISSION),this.convertStringToDate(claim.DATEOFDISCHARGE),this.convertStringToDate(claim.ACTUALDATEOFDISCHARGE),
        claim.OLDCLAIMSTATUS, this.convertnumbertoCurrency(claim.CLAIMAMOUNT),this.convertDate(claim.ACTIONON)];
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
        12:{cellWidth:20},
        13:{cellWidth:20}
      }
    });
    doc.save('Query Re-Claimed And Pending At SNA List.pdf');

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
  convertnumbertoCurrency(amount){
    var amnt=new CurrencyPipe('en-US');
    amount=amnt.transform(amount,'','');
    return amount;
  }
}
