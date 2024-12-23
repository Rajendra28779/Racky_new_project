import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../header.service';
import { SnoCLaimDetailsService } from '../../Services/sno-claim-details.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TableUtil } from '../../util/TableUtil';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-oldclaim-resettlement',
  templateUrl: './oldclaim-resettlement.component.html',
  styleUrls: ['./oldclaim-resettlement.component.scss']
})
export class OldclaimResettlementComponent implements OnInit {
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
    private snoService1: SnocreateserviceService,
    public route: Router,
    private sessionService: SessionStorageService
  ) {}

  ngOnInit(): void {
    // dynamic title
    this.user = this.sessionService.decryptSessionData("user");
    this.dataRequest = this.sessionService.decryptSessionData('requestData');
    this.currentPagenNum = this.sessionService.decryptSessionData('currentPageNum');
    this.headerService.setTitle('Old Claim Resettlement');
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);

    this.getStateList();
    this.currentPage = 1;
    this.pageElement = 50;
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
      this.getSnoClaimDetails();
    } else {
      let date = new Date(this.dataRequest.fromDate);
      let fromDate = this.getDate(date);
      $('input[name="fromDate"]').val(fromDate);
      let date1 = new Date(this.dataRequest.toDate);
      let toDate = this.getDate(date1);
      $('input[name="toDate"]').val(toDate);
      this.stateId=this.dataRequest.stateCode;
      this.OnChangeState(this.stateId);
      this.districtId=this.dataRequest.distCode;
      this.OnChangeDistrict(this.districtId);
      this.hospital=this.dataRequest.hospitalCode;
      this.getSnoClaimDetails();
    }
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
  stateList:any=[];
  districtList:any=[];
  hospitalList:any=[];
  selectedItems: any = [];
  getStateList() {
    this.snoService1.getStateList().subscribe(
      (response) => {
        this.stateList = response;
        console.log(this.stateList);
      },
      (error) => console.log(error)
    )
  }
  OnChangeState(id) {
    $("#districtId").val("");
    this.selectedItems = [];
    localStorage.setItem("stateCode", id);
    this.snoService1.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = response;
        console.log(response);
      },
      (error) => console.log(error)
    )
  }
  OnChangeDistrict(id) {
    this.selectedItems = [];
    var stateCode = localStorage.getItem("stateCode");
    this.snoService1.getHospitalbyDistrictId(id, stateCode).subscribe(
      (response) => {

        this.hospitalList = response;
        console.log(response);
      },
      (error) => console.log(error)
    )
  }
  requestData: any;
  getSnoClaimDetails() {
    let userId = this.user.userId;
    this.fromDate = $('#datepicker17').val();
    this.toDate = $('#datepicker18').val();
    this.stateCode1 = this.stateId;
    this.distCode1 = this.districtId;
    this.hospitalCode = this.hospital;
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
      userId: userId,
      fromDate: new Date(this.fromDate),
      toDate: new Date(this.toDate),
      stateCode: this.stateCode1,
      distCode: this.distCode1,
      hospitalCode: this.hospitalCode,
    };
    console.log(this.requestData);
    this.sessionService.encryptSessionData('requestData',this.requestData);
    this.snoService.getOldClaimResettlementlist(this.requestData).subscribe(
      (data) => {
        this.snoclaimlist = data;
        this.totalClaimCount = this.snoclaimlist.length;
        // this.traverseToRequiredPage();
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
  onAction(id: any, urn: any, transid: any) {
    let state = {
      transactionId: id,
      URN: urn,
      transId: transid,
    };
    localStorage.setItem('actionData', JSON.stringify(state));
    this.sessionService.encryptSessionData('currentPageNum', this.currentPage);
    this.route.navigate(['/application/oldClaimResettlement/action']);
  }
  stateData: any = [];
  // getStateList() {
  //   this.snoService.getStateList().subscribe((data: any) => {
  //     this.stateData = data;
  //     this.stateData.sort((a, b) => a.stateName.localeCompare(b.stateName));
  //     for (let j = 0; j < this.stateData.length; j++) {
  //       if (this.stateData[j].stateCode == '21') {
  //         this.statelist.push(this.stateData[j]);
  //       }
  //     }
  //     for (let i = 0; i < this.stateData.length; i++) {
  //       if (this.stateData[i].stateCode != '21') {
  //         this.statelist.push(this.stateData[i]);
  //       }
  //     }
  //     console.log(this.statelist);
  //   });
  // }
  distId: any = '';
  // getDistrict(code) {
  //   this.stateCode = code;
  //   this.userId = this.user.userId;
  //   this.snoService
  //     .getDistrictListByState(this.userId, this.stateCode)
  //     .subscribe((data:any) => {
  //       this.distList = data;
  //       this.distList.sort((a, b) =>
  //         a.DISTRICTNAME.localeCompare(b.DISTRICTNAME)
  //       );
  //       console.log(data);
  //     });
  // }
  hospitalId: any = '';
  // getHospital(code) {
  //   this.distCode = code;
  //   this.userId = this.user.userId;
  //   this.snoService
  //     .getHospitalByDist(this.userId, this.stateCode, this.distCode)
  //     .subscribe((data:any) => {
  //       this.hospitalList = data;
  //       console.log(data);
  //     });
  // }

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
    HospitalName: "",
    HospitalCode: "",
    packageCode: "",
    DateofAdmission: "",
    ActualDateofAdmission: "",
    DateofDischarge: "",
    ActualDateofDischarge: "",
    claimAmount: "",
  };
  heading = [['Sl#', 'URN','Patient Name', 'Invoice No','Hospital Name', 'Hospital Code','Package ID','Date of Admission' ,'Actual Date of Admission','Date of Discharge','Actual Date of Discharge', 'Claim Amount']];

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
  this.sno.InvoiceNo = claim.invoiceNumber;
  this.sno.HospitalName = claim.hospitalname;
  this.sno.HospitalCode = claim.hospitalcode;
  this.sno.packageCode =  claim.packageCode;
  this.sno.DateofAdmission = claim.dateofadmission;
  this.sno.ActualDateofAdmission =  claim.actualDateOfAdmission;
  this.sno.DateofDischarge =  claim.dateofdischarge;
  this.sno.ActualDateofDischarge = claim.actualDateOfDischarge;
  this.sno.claimAmount = this.convertCurrency(claim.currentTotalAmount);
  this.report.push(this.sno);
}
let stateName = 'All', districtName = 'All', hospitalName = 'All';
    for(var i=0;i<this.stateList.length;i++) {
      if(this.requestData.stateCode==this.stateList[i].stateCode) {
        stateName=this.stateList[i].stateName;
      }
    }
    for(var i=0;i<this.districtList.length;i++) {
      if(this.requestData.distCode==this.districtList[i].districtcode) {
        districtName=this.districtList[i].districtname;
      }
    }
    for(var i=0;i<this.hospitalList.length;i++) {
      if(this.requestData.hospitalCode==this.hospitalList[i].hospitalCode) {
        hospitalName=this.hospitalList[i].hospitalName;
      }
    }
      let filter =[];
      filter.push([['Actual Date of Discharge From',this.convertStringToDate(this.requestData.fromDate)]]);
      filter.push([['Actual Date of Discharge To', this.convertStringToDate(this.requestData.toDate)]]);
      filter.push([['State Name', stateName]]);
      filter.push([['District Name', districtName]]);
      filter.push([['Hospital Name', hospitalName]]);
      TableUtil.exportListToExcelWithFilter(this.report, 'Old Claim Resettlement List', this.heading, filter);
}
downloadPdf() {
    var doc = new jsPDF('l', 'mm', [285, 255]);
    doc.setFontSize(12);
    doc.text('Actual Date of Discharge From:'+this.convertStringToDate(this.requestData.fromDate), 10, 10);
    doc.text('Actual Date of Discharge To:'+this.convertStringToDate(this.requestData.toDate), 150, 10);
    let stateName = 'All', districtName = 'All', hospitalName = 'All';
    for(var i=0;i<this.stateList.length;i++) {
      if(this.requestData.stateCode==this.stateList[i].stateCode) {
        stateName=this.stateList[i].stateName;
      }
    }
    for(var i=0;i<this.districtList.length;i++) {
      if(this.requestData.distCode==this.districtList[i].districtcode) {
        districtName=this.districtList[i].districtname;
      }
    }
    for(var i=0;i<this.hospitalList.length;i++) {
      if(this.requestData.hospitalCode==this.hospitalList[i].hospitalCode) {
        hospitalName=this.hospitalList[i].hospitalName;
      }
    }
    doc.text('State Name:'+stateName, 10, 20);
    doc.text('District Name:'+districtName, 80, 20);
    doc.text('Hospital Name:'+hospitalName, 150, 20);
    doc.text("Generated On: "+this.convertDate(new Date()), 10, 30);
    doc.text("Generated By: "+this.user.fullName, 150, 30);
    doc.text("Old Claim Resettlement List", 110, 40);
    var col = [['Sl#', 'URN','Patient Name', 'Invoice No','Hospital Name', 'Hospital Code','Package ID','Date of Admission' ,'Actual Date of Admission','Date of Discharge','Actual Date of Discharge', 'Claim Amount']];
    var rows = [];
    var claim: any;
    for(var i=0;i<this.snoclaimlist.length;i++) {
      claim = this.snoclaimlist[i];
      var temp = [i+1, claim.urn, claim.patientName, claim.invoiceNumber,claim.hospitalname, claim.hospitalcode,claim.packageCode,claim.dateofadmission, claim.actualDateOfAdmission,claim.dateofdischarge,claim.actualDateOfDischarge,this.convertCurrency(claim.currentTotalAmount)];
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
        11:{cellWidth:20}
      }
    });
    doc.save('Old Claim Resettlement List.pdf');

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
  convertCurrency(amount) {
    var formatter = new CurrencyPipe('en-US');
    amount=formatter.transform(amount, '', '');
    return amount;
  }
}
