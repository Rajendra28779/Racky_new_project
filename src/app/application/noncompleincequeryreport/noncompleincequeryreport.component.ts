import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from './../header.service';
import { PendingService } from './../pending.service';
import { ClaimRaiseServiceService } from './../Services/claim-raise-service.service';
import autoTable from "jspdf-autotable";
import { jsPDF } from 'jspdf';
import { TableUtil } from './../util/TableUtil';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { JwtService } from 'src/app/services/jwt.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-noncompleincequeryreport',
  templateUrl: './noncompleincequeryreport.component.html',
  styleUrls: ['./noncompleincequeryreport.component.scss']
})
export class NoncompleincequeryreportComponent implements OnInit {
  pageElement: any;
  currentPage: any;
  txtsearchDate:any;
  public serachdata: any = [];
  packageName: any;
  packagependingdata: any;
  user: any;
  packageId: any;
  sysRejeted:any;
  snareport:boolean=false;
  record:any;
  showPegi: boolean;

  packgaeNAme:any;



  constructor(public headerService: HeaderService,public route: Router,private jwtService: JwtService, private pendingService: PendingService, private LoginServ: ClaimRaiseServiceService, private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle('Non compliance of Query-SNA');
    this.currentPage = 1;
    this.pageElement = 10;
    this.Inclusionofsearchingforpackagedetails();
    this.OngetdataforSnaList();
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
    let month: any
    var date = new Date();
    let year = date.getFullYear();
    let date1 = '01';
    if(date.getMonth()==0){
    year = year-1;
    month=11;
    }else{
     month= date.getMonth() - 1;
    }
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
    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr("placeholder", "From Date *");
    $('input[name="toDate"]').attr("placeholder", "To Date *");
  }
  OnsearchSNA() {
    // const URNNO = $('#txtsearchDate').val();
    // if (URNNO == "") {
    //   this.swal('', 'Please Enter URN Number', 'info');
    //   // this.OnGetClaimList();
    // }
    // this.Rejetedlist = this.Rejetedlist.filter((data) => {
    //   return data.urn.match(URNNO);
    // })
  }
  OnGetReset(){
  //  $('#Package').val("");
  //  $('#PackageName').val("");
  //  $('#actionTypee').val("");
  //  this.packagependingdata = null;
  window.location.reload();

  }
    Inclusionofsearchingforpackagedetails() {
    this.LoginServ.getsearcdetails().subscribe(data => {
      this.serachdata = data;
    });
  }
  ongetpackagename(event: any) {
    this.packgaeNAme=event;




  }
  getPackageName(event: any) {
    // this.serachdata.forEach(element => {
    //   if(element.id == event){
    //     this.packageName = element.packagename;
    //   }
    // });
    for (let i = 0; i < this.serachdata.length; i++) {
      if (this.serachdata[i].id == event) {
        this.packageName = this.serachdata[i].procedurecode;
        this.LoginServ.getdatapackgaename(this.packageName).subscribe(data => {
          this.packagependingdata = data;
          console.log(this.packagependingdata);
        });
      }
    }
  }
  fromDate:any
  toDate:any
OngetdataforSnaList(){
  this.user = this.sessionService.decryptSessionData("user");
  console.log(this.user);
  var sno = this.user.userId;
  this.fromDate = $('#datep').val();
  this.toDate = $('#datepicker').val();
  let Package = this.packageName;
  let packgaename=this.packgaeNAme;
  let URN = $('#actionTypee').val();
  if (Package == undefined) {
    Package = "";
  }
  if (packgaename == undefined) {
    packgaename = "";
  }
  if (URN == "") {
    URN = "";
  }
  if(Date.parse(this.fromDate)>Date.parse(this.toDate)){
    this.swal('', 'From date should be less than To date', 'error');
    return;
  }
  this.pendingService.noncompliancequerysno(sno,this.fromDate,this.toDate,Package,packgaename,URN).subscribe(data => {
    this.sysRejeted = data;
    console.log(this.sysRejeted);
    if(this.sysRejeted.length == 0){
      this.snareport=true;
    }
    this.record = this.sysRejeted.length;
    if (this.record > 0) {
      this.showPegi = true;
      this.snareport=false;
    }
    else {
      this.showPegi = false;
      this.snareport=true;
    }
  },
  (error) => {
    console.log(error);
    this.swal('', 'Something went wrong.', 'error');
  }
  );
}
onclaim(transactiondetailsid,urn,updateon){
  let  state={
    Action: transactiondetailsid,
    URN: urn,
    Hospitalcode: this.user.userName,
    claimraisedBy:updateon,
  }
localStorage.setItem("actionDataforsnacompliance",JSON.stringify(state));
this.route.navigate(['/application/SNARejectedlist/Action']);

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
report: any = [];
sno: any = {
  Slno: "",
  ClaimNo: "",
  URN: "",
  hospitaldetails:"",
  PatientName: "",
  invoiceNo: "",
  PackageCode: "",
  packageName: "",
  AdmissionDate: "",
  ActualdateofAdmission: "",
  DischargeDate: "",
  ActualdateofDischarge: "",
  LastDateOfQuery: "",
  Amount: "",
};
heading = [['Sl#','Claim No.', 'URN','Hospital Details', 'Patient Name','invoiceNo','Package Code','package Name','Admission Date','Actual Date of Admission','Discharge Date','Actual Date of Discharge','Last Date Of Query','Amount']];
downloadReport(type: any) {
  this.report = [];
  let claim: any;
  if (type == 'excel') {
    for(var i=0;i<this.sysRejeted.length;i++) {
      claim = this.sysRejeted[i];
      this.sno = [];
      this.sno.Slno = i+1;
      this.sno.ClaimNo = claim.claim_no;
      this.sno.URN = claim.urn;
      this.sno.hospitaldetails=claim.hospitalName+" ("+claim.hospitalCode+")"
      this.sno.PatientName = claim.patientName;
      this.sno.invoiceNo = claim.invoiceno;
      this.sno.PackageCode = claim.packageCode;
      this.sno.packageName = claim.packageName;
      this.sno.AdmissionDate = claim.dateofadmission;
      this.sno.ActualdateofAdmission = claim.actualdateofadmission;
      this.sno.DischargeDate =claim.dateofdischarge;
      this.sno.ActualdateofDischarge =claim.actualdateofdischarge;
      this.sno.LastDateOfQuery =this.convertDate(claim.updateon);
      this.sno.Amount ='₹'+claim.snoapprovedamount;
      this.report.push(this.sno);
    }
    TableUtil.exportListToExcel(this.report, "Non compliance of Query-SNA", this.heading);
}else if(type == 'pdf'){
  let SlNo = 1;
  if(this.sysRejeted.length == 0){
    this.swal('', 'No data to download', 'info');
    return;
  }
  let valuedate:any;
  let todate:any;
  let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  valuedate=this.fromDate;
  todate=this.toDate;
  if(valuedate == undefined || valuedate == null || valuedate == ''){
    valuedate = 'N/A';
  }
  if(todate == undefined || todate == null || todate == ''){
    todate = 'N/A';
  }
  this.sysRejeted.forEach(element => {
    let rowData = [];
    rowData.push(SlNo++);
    rowData.push(element.claim_no);
    rowData.push(element.urn);
    // var hospitaldetails=
    rowData.push(element.hospitalName+" ("+element.hospitalCode+")");
    rowData.push(element.patientName);
    rowData.push(element.invoiceno);
    rowData.push(element.packageCode);
    rowData.push(element.packageName);
    rowData.push(element.dateofadmission);
    rowData.push(element.actualdateofadmission);
    rowData.push(element.dateofdischarge);
    rowData.push(element.actualdateofdischarge);
    rowData.push(this.convertDate(element.updateon));
    rowData.push(element.snoapprovedamount);
    this.report.push(rowData);
  });
  let doc = new jsPDF('l', 'mm', [240, 290]);
  doc.setFontSize(10);
  doc.text('Doctor Name :-'+this.user.fullName+'('+(this.user.userName)+')',5,5);
  doc.text('Actual Date of Discharge:-'+valuedate,5,10);
  doc.text('Discharge Date To:-'+todate,5,15);
  doc.text('Document Generate Date : ' + new Date().getDate() + ' ' + months[new Date().getMonth()] + ' ' + new Date().getFullYear() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds(),5, 20);
  doc.text('Non compliance of Query-SNA',100,25);
  doc.line(100,26,148,26);
  autoTable(doc, {head: this.heading, body: this.report, startY: 30, theme: 'grid',
  styles: {overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20},
  bodyStyles: {lineWidth: 0.1, lineColor: 0, textColor: 20},
  headStyles: {lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255] ,fillColor: [26, 99, 54]},
  columnStyles: {
    0: {cellWidth: 8},
    1: {cellWidth: 20},
    2: {cellWidth: 20},
    3: {cellWidth: 20},
    4: {cellWidth: 20},
    5: {cellWidth: 20},
    6: {cellWidth: 20},
    7: {cellWidth: 20},
    8: {cellWidth: 20},
    9: {cellWidth: 20},
    10:{cellWidth: 20},
    11:{cellWidth: 20},
    12:{cellWidth: 20},
    13:{cellWidth: 15},
    14:{cellWidth: 10},
  }
})
  doc.save('Non_compliance_of_Query-SNA.pdf');
}
}
convertDate(date) {
  var datePipe = new DatePipe("en-US");
  date = datePipe.transform(date, 'dd-MMM-yyyy, h:mm:ss a');
  return date;
}

view(claimid:any){
  localStorage.setItem("claimid", claimid)
    localStorage.setItem("token", this.jwtService.getJwtToken())
    this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/trackingdetails'); });
}
}
