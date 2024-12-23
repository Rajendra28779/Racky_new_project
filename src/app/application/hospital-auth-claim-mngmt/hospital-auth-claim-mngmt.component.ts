import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { JwtService } from 'src/app/services/jwt.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { HeaderService } from '../header.service';
import { HospitalAuthorityReportServiceService } from '../Services/hospital-authority-report-service.service';
import { TableUtil } from '../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';

declare let $: any;
@Component({
  selector: 'app-hospital-auth-claim-mngmt',
  templateUrl: './hospital-auth-claim-mngmt.component.html',
  styleUrls: ['./hospital-auth-claim-mngmt.component.scss']
})
export class HospitalAuthClaimMngmtComponent implements OnInit {
  hospitalcode: any='';
  bskyUserId: any;
  keyword: any = 'hospitalName';
  taggedList: any = [];
  user:any;
  list:any=[];
  listcount: any=0;
  showPegi:any;
  pageElement:any;
  currentPage:any;
  txtsearchDate:any;
  showdetailbtn:any=true;
  showviewbtn:any=false;
  dtls:any="No Data Found!!";
  searchtype:any;
  remarks:any;
  months: string;
  year: number;
  type:any='';
  dataRequest: any;
  fromDate: any;
  toDate: any;
  constructor(private headerService: HeaderService, private auhtorityReport: HospitalAuthorityReportServiceService, private jwtService: JwtService,private route: Router,private sessionService: SessionStorageService
    ) { }

  ngOnInit(): void {
    this.user =  this.sessionService.decryptSessionData("user");
    this.headerService.setTitle("Claim To Raise");
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
      format: 'YYYY-MM-DD LT',
      daysOfWeekDisabled: ['', 7],
    });
    var date = new Date();
    let year = date.getFullYear();
    let date1 = '01';
    let date2=date.getDate();
    let month: any = date.getMonth()-1;
    if(month == -1){
      this.months = 'Dec';
      this.year = year-1;
    }else{
      this.months = this.getMonthFrom(month);
      this.year = year;
    }
    var frstDay = date1 + '-' + this.months + '-' + this.year;
    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr("placeholder", "From Date *");

    $('input[name="toDate"]').attr("placeholder", "To Date *");
    if(localStorage.getItem('hospitalNav') != 'Y'){
      sessionStorage.removeItem('claimData');
    }
    this.dataRequest = this.sessionService.decryptSessionData("claimData");
    if (this.dataRequest != null && this.dataRequest != undefined && this.dataRequest != '' ) {
      let date = new Date(this.dataRequest.fromDate);
      let fromDate = this.getDate(date);
      $('input[name="fromDate"]').val(fromDate);
      let date1 = new Date(this.dataRequest.todate);
      let toDate = this.getDate(date1);
      $('input[name="toDate"]').val(toDate);
      this.hospitalcode = this.dataRequest.hospitalcode;
      this.hospitalName = this.dataRequest.hospitalName;
      // this.hospitalname();
      this.Search();
    }else{
      // this.hospitalname();
      this.Search();
    }
    localStorage.removeItem("hospitalNav");
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
  selectEvent(item) {
       this.hospitalcode = item.hospitalAuthTagging.tagHospitalCode;
      //  this.bskyUserId = item.bskyUserId;
       this.hospitalName = item.hospitalName;
  }
  onReset1() {
    this.hospitalcode="";
  }
  ResetFields(){
    sessionStorage.removeItem('claimData');
    window.location.reload();
  }
  hospitalname(){
    let name=this.user.userId;
    this.auhtorityReport.getHospitalTageed(name).subscribe(
      (response) => {
        console.log(response);
        this.taggedList = response;
      },
      (error) => console.log(error)
    )
  }
  hospitalName:any='';
  Search(){
     this.fromDate=$('#fromDate').val();
     this.toDate=$('#toDate').val();
    let userid=this.user.userId;
    this.type="CLM";
    // if(this.hospitalcode=="" || this.hospitalcode==undefined){
    //   this.hospitalcode=null;
    // }
    if (this.fromDate == null || this.fromDate == "" || this.fromDate == undefined) {
      this.swal("Info", "Please Fill From Date", 'info');
      return;
    }if (this.toDate == null || this.toDate == "" || this.toDate == undefined) {
      this.swal("Info", "Please Fill To Date", 'info');
      return;
    }
    if (Date.parse(this.fromDate) > Date.parse(this.toDate)) {
      this.swal('Warning', ' From Date should be less than To Date', 'error');
      return;
    }
    if(this.type=="" || this.type==null || this.type==undefined){
      this.swal("Info", "Please Select Type", 'info');
      return;
    }
    let requestData = {
      fromDate: this.fromDate,
      todate: this.toDate,
      hospitalcode: this.hospitalcode,
      hospitalName:this.hospitalName,
    }
    this.sessionService.encryptSessionData('claimData', requestData)
    this.auhtorityReport.searchClaimToRaiseList(this.fromDate,this.toDate,this.type,this.hospitalcode,userid).subscribe(
      (response) => {
        console.log(response);
          this.list=response;
          this.listcount=this.list.length;
          if(this.listcount>0){
            this.showPegi=true;
            this.pageElement=10;
            this.currentPage=1;
          }else{
            this.showPegi=false;
          }
      },
      (error) => console.log(error)
    )


  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>(
      document.getElementById('pageItem')
    )).value;
    console.log(this.pageElement);
  }
  onclaim(transactiondetailsid: any, urn: any, authorizedcode: any, hospitalcode: any) {
    let  state={
        Action: transactiondetailsid,
        URN: urn,
        Authroziedcode: authorizedcode,
        Hospitalcode: hospitalcode
      }
      console.log(state);
    localStorage.setItem('hospitalNav', 'Y');
    localStorage.setItem("actionDataforclaim",JSON.stringify(state));
    localStorage.setItem("currentPageNum",JSON.stringify(this.currentPage));
    this.route.navigate(['/application/claimraise/Action']);
  }
  modalClose(){
    $('#appealDisposal').hide()
  }
  view(claim:any){
    this.auhtorityReport.getviewremark(this.searchtype,claim).subscribe(
      (response) => {
        console.log(response);
        this.remarks=response;
        this.dtls=this.remarks.remarks;
        $('#appealDisposal').show()
      });

  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
}

report: any = [];
sno: any = {
  Slno: "",
  URN: "",
  PatientName: "",
  HospitalDetails: "",
  InvoiceNumber: "",
  PackageCode: "",
  packageName: "",
  AdmissionDate: "",
  ActualDateOfAdmission: "",
  DischargeDate: "",
  ActualDateOfDischarge: "",
  ClaimRaisedBy: "",
  DaysLeft: "",
  Amount: "",
};
heading = [['Sl#','URN','Patient Name','Hospital Details','Invoice Number','Package Code','Package Name','Admission Date','Actual Date Of Admission','Discharge Date','Actual Date Of Discharge','Claim Raised By','Days Left','Amount']];

downloadReport(type: any){
  this.report = [];
  if(type == 'excel'){
  let claim: any;
    for(var i=0;i<this.list.length;i++) {
      claim = this.list[i];
      this.sno = [];
      this.sno.Slno = i+1;
      this.sno.URN = claim.urn;
      this.sno.PatientName = claim.patientName;
      this.sno.HospitalDetails = claim.hospitalName+'('+claim.hospitalcode+')';
      this.sno.InvoiceNumber = claim.invoiceno;
      this.sno.PackageCode = claim.packageCode;
      this.sno.packageName = claim.packageName;
      this.sno.AdmissionDate = claim.dateofadmission;
      this.sno.ActualDateOfAdmission = claim.actualdateofadmission;
      this.sno.DischargeDate = claim.dateOfDischarge;
      this.sno.ActualDateOfDischarge = claim.actualdateofdischarge;
      this.sno.ClaimRaisedBy = claim.claimRaiseby;
      this.sno.DaysLeft = claim.remainingDateString;
      this.sno.Amount ='₹'+claim.currentTotalAmount;
      this.report.push(this.sno); 
}
TableUtil.exportListToExcel(this.report, "Claims to Raise List", this.heading);
}else if (type == 'pdf') {
  if(this.list.length == 0){
    this.swal('','No Data Found', 'info');
    return;
  }
  let valuedate:any;
  let todate:any;
  valuedate=this.fromDate;
  todate=this.toDate;
  if(valuedate == undefined || valuedate == null || valuedate == ''){
    valuedate = 'N/A';
  }
  if(todate == undefined || todate == null || todate == ''){
    todate = 'N/A';
  }
  let SlNo = 1;
  this.list.forEach(element => {
    let rowData = [];
    rowData.push(SlNo++);
    rowData.push(element.urn);
    rowData.push(element.patientName);
    rowData.push(element.hospitalName+'('+element.hospitalcode+')');
    rowData.push(element.invoiceno);
    rowData.push(element.packageCode);
    rowData.push(element.packageName);
    rowData.push(element.dateofadmission);
    rowData.push(element.actualdateofadmission);
    rowData.push(element.dateOfDischarge);
    rowData.push(element.actualdateofdischarge);
    rowData.push(element.claimRaiseby);
    rowData.push(element.remainingDateString);
    rowData.push(element.currentTotalAmount);
    this.report.push(rowData);
  });
  let doc = new jsPDF('l', 'mm', [270, 300]);
  doc.setFontSize(10);
  // doc.text('Hospital Name :-'+this.hospitalName,5,5);
  doc.text('Actual Date of Discharge From:-'+valuedate,5,10);
  doc.text('Actual Date of Discharge To:-'+todate,5,15);
  doc.text('Claims to Raise List',100,20);
  autoTable(doc, {head: this.heading, body: this.report, startY: 30, theme: 'grid',
  styles: {overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20},
  bodyStyles: {lineWidth: 0.1, lineColor: 0, textColor: 20},
  headStyles: {lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255] ,fillColor: [26, 99, 54]},
  columnStyles: {
    0: {cellWidth: 8},
    1: {cellWidth: 20},
    2: {cellWidth: 20},
    3: {cellWidth: 30},
    4: {cellWidth: 20},
    5: {cellWidth: 20},
    6: {cellWidth: 20},
    7: {cellWidth: 20},
    8: {cellWidth: 20},
    9: {cellWidth: 20},
    10: {cellWidth:20},
    11: {cellWidth:20},
    12: {cellWidth:20},
    13: {cellWidth:20}
  }
})
  doc.save('Claims_to_Raise_List.pdf');
}
}
//convert number to currency
convertCurrency(amount:any) {
  var formatter = new CurrencyPipe('en-US');
  amount=formatter.transform(amount, '','');
  return amount;
 }
}
