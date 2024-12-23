import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../header.service';

import { SnocreateserviceService } from '../../Services/snocreateservice.service';
declare let $: any;
import Swal from 'sweetalert2';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { TableUtil } from '../../util/TableUtil';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SnawiseClaimsubmitreportServiceService } from '../../Services/snawise-claimsubmitreport-service.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';


@Component({
  selector: 'app-hospitalwisedischargeandclaim',
  templateUrl: './hospitalwisedischargeandclaim.component.html',
  styleUrls: ['./hospitalwisedischargeandclaim.component.scss']
})
export class HospitalwisedischargeandclaimComponent implements OnInit {
  currentPage:any;
  pageElement:any;
  txtsearchDate: any;
  record: any = 0;
  showPegi: boolean;
  list:any=[];
  user: any;
  getAllYears: any = [];
  selectedYear: any;
  selectedmonth: any;
  public stateList: any = [];
  public districtList: any = [];
  public hospitalList: any = [];
  hospcode:any="";
  hospname:any="ALL";
  sum:any=0;
  sum1:any=0;
  sum2:any=0;
  sum3:any=0;
  sum4:any=0;
  sum5:any=0;
  keyword1: any = 'hospitalName';
  statecode:any="";
  distcode:any="";
  statename: any="ALL";
  distname: any="ALL";


  constructor(private snoService: SnocreateserviceService,private snawiseClaimsubmitreportServiceService: SnawiseClaimsubmitreportServiceService,public headerService:HeaderService,private sessionService: SessionStorageService,) { }

  ngOnInit(): void {
    this.headerService.setTitle('Hospital Wise Discharge and Claim');
    // this.user = JSON.parse(sessionStorage.getItem("user"));
    this.user = this.sessionService.decryptSessionData("user");
    this.selectedYear = new Date().getFullYear();
    this.selectedmonth=new Date().getMonth()+1;
    // alert(this.selectedmonth)
    for (let year = this.selectedYear; year >= 2015; year--) {
      this.getAllYears.push(year);
    }
    this.SearchMethod();
    this.getStateList();
  }

  getStateList() {

    this.snoService.getStateList().subscribe(
      (response) => {
        this.stateList = response;
        console.log(this.stateList);
      },
      (error) => console.log(error)
    )
  }

  OnChangeState(id) {
    $("#districtId").val("");
    this.statecode=id
       localStorage.setItem("stateCode", id);
    this.snoService.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = response;
        console.log(response);


      },
      (error) => console.log(error)
    )
  }


  OnChangeDistrict(id) {
    this.distcode=id
        var stateCode = localStorage.getItem("stateCode");
    this.snoService.getHospitalbyDistrictId(id, stateCode).subscribe(
      (response) => {

        this.hospitalList = response;
        console.log(response);


      },
      (error) => console.log(error)
    )
  }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
    console.log(this.pageElement);

   }

  selectEvent1(item) {
    this.hospcode = item.hospitalCode;
    this.hospname = item.hospitalName;
    }
onReset2() {
  this.hospcode="";
}

  SearchMethod(){

    this.snawiseClaimsubmitreportServiceService.hospitalwisedischargelist(this.selectedYear,this.selectedmonth,this.user.userId,this.statecode,this.distcode,this.hospcode).subscribe(
      (result: any) => {
        console.log(result);
        this.list=result;
        this.record = this.list.length;
        if (this.record > 0) {
          // this.showPegi = true;
          let sum=0;
          let sum1=0;
          let sum2=0;
          let sum3=0;
          let sum4=0;
          let sum5=0;
          for(let i = 0; i < this.list.length; i++){
            sum+=parseInt(this.list[i].totalDischarge);
            sum1+=parseInt(this.list[i].dischargeAmt);
            sum2+=parseInt(this.list[i].clmSubmitted);
            sum3+=parseInt(this.list[i].clmSubmitAmt);
            sum4+=parseInt(this.list[i].totalPaid);
            sum5+=parseInt(this.list[i].paidAmount);
          }
          this.sum=sum;
          this.sum1=sum1;
          this.sum2=sum2;
          this.sum3=sum3;
          this.sum4=sum4;
          this.sum5=sum5;

          this.currentPage = 1;
          this.pageElement = 100;
          this.showPegi=true;
        }
        else {
          this.showPegi = false;
        }
      }, (err: any) => {
        console.log(err);
      }
    );
  }

  Reset(){
    window.location.reload();
  }


  report: any = [];
  snaPendingClaimList: any = {
    slNo: "",
    monthName: "",
    hospcode: "",
    totalDischarge: "",
    dischargeAmt: "",
    clmSubmitted: "",
    clmSubmitAmt: "",
    totalPaid: "",
    paidAmount: "",
  };

  heading = [['Sl No.', 'Hospital Name', 'Hospital Code', 'Total Discharge', 'Discharge Amount', 'Claim Submitted', 'Claim Submitted Amount', 'Total Paid', 'Paid Amount']];
  downloadReport(type){
    this.report = [];
    let item: any;
    for (var i = 0; i < this.list.length; i++) {
      item = this.list[i];
      this.snaPendingClaimList = [];
      this.snaPendingClaimList.slNo = i + 1;
      this.snaPendingClaimList.monthName = item.hospname;
      this.snaPendingClaimList.hospcode = item.hospcode;
      this.snaPendingClaimList.totalDischarge = item.totalDischarge;
      this.snaPendingClaimList.dischargeAmt = this.convertCurrency(item.dischargeAmt);
      this.snaPendingClaimList.clmSubmitted = item.clmSubmitted;
      this.snaPendingClaimList.clmSubmitAmt = this.convertCurrency(item.clmSubmitAmt);
      this.snaPendingClaimList.totalPaid = item.totalPaid;
      this.snaPendingClaimList.paidAmount = this.convertCurrency(item.paidAmount);
      this.report.push(this.snaPendingClaimList);
      console.log(this.report);
    }
    this.snaPendingClaimList = [];
    this.snaPendingClaimList.monthName="Total";
    this.snaPendingClaimList.hospcode = "";
    this.snaPendingClaimList.totalDischarge = this.sum;
    this.snaPendingClaimList.dischargeAmt =this.convertCurrency(this.sum1);
    this.snaPendingClaimList.clmSubmitted = this.sum2;
    this.snaPendingClaimList.clmSubmitAmt=this.convertCurrency(this.sum3);
     this.snaPendingClaimList.totalPaid=this.sum4;
     this.snaPendingClaimList.paidAmount=this.convertCurrency(this.sum5);
     this.report.push(this.snaPendingClaimList);
    // if(type=='excel'){
      for(let j=0; j < this.stateList.length;j++){
        if(this.stateList[j].stateCode==this.statecode){
          this.statename=this.stateList[j].stateName;
        }
      }
      for(let j=0; j < this.districtList.length;j++){
        if(this.districtList[j].districtcode==this.distcode){
          this.distname=this.districtList[j].districtname;
        }
      }
    if (type == 1) {
      let filter = [];
      filter.push([['Year:-', this.selectedYear]]);
      filter.push([['Month:-', this.month(this.selectedmonth)]]);
      filter.push([['State:-', this.statename]]);
      filter.push([['District:-', this.distname]]);
      filter.push([['Hospital Name:-', this.hospname]]);
      TableUtil.exportListToExcelWithFilter(this.report, "SNA Wise Month Wise Discharge and Claim", this.heading, filter);
    } else if (type == 2) {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('p', 'mm', [297, 210]);
      doc.setFontSize(20);
      doc.text("Hospital Wise Discharge and Claim", 40, 15);
      doc. line(40, 17,150,17);
      doc.setFontSize(12);
      doc.text("Year: "+ this.selectedYear, 15, 25);
      doc.text("Month: "+ this.month(this.selectedmonth), 120, 25);
      doc.text("State: "+ this.statename, 15, 33);
      doc.text("District: "+ this.distname, 120, 33);
      doc.text("Hospital Name: "+ this.hospname, 15, 41);
      doc.text("Generated On: " + this.convertDate(new Date()), 120, 49);
      doc.text("Generated By: " + this.sessionService.decryptSessionData("user").fullName, 15, 49);

      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.slNo;
        pdf[1] = clm.monthName;
        pdf[2] = clm.hospcode;
        pdf[3] = clm.totalDischarge;
        pdf[4] = clm.dischargeAmt;
        pdf[5] = clm.clmSubmitted;
        pdf[6] = clm.clmSubmitAmt;
        pdf[7] = clm.totalPaid;
        pdf[8] = clm.paidAmount;
        rows.push(pdf);
      }
      console.log(rows);
      autoTable(doc, {
        head: this.heading,
        body: rows,
        theme: 'grid',
        startY: 55,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 40 },
          2: { cellWidth: 25 },
          // 2: { cellWidth: 30 },
          // 3: { cellWidth: 35 },
          // 4: { cellWidth: 30 },
          // 5: { cellWidth: 50 },
          // 6: { cellWidth: 40 },
          // 7: { cellWidth: 30 }
        }
      });
      doc.save('Bsky_Hospital Wise Discharge and Claim.pdf');

    }
  }
  convertCurrency(dischargeAmt: any) {
    var formatter = new CurrencyPipe('en-US');
    dischargeAmt = formatter.transform(dischargeAmt, '', '');
    return dischargeAmt;
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  convertDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy hh:mm:ss a');
    return date;
  }
  month(no:any){
    if(no==1){
      return "January"
    }else if(no==2){
      return "February"
    }else if(no==3){
      return "March"
    }else if(no==4){
      return "April"
    }else if(no==5){
      return "May"
    }else if(no==6){
      return "June"
    }else if(no==7){
      return "July"
    }else if(no==8){
      return "August"
    }else if(no==9){
      return "September"
    }else if(no==10){
      return "October"
    }else if(no==11){
      return "November"
    }else{
      return "December"
    }
  }
}





