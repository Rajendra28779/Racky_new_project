import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderService } from '../../header.service';
import { PackagewisedischargeclaimService } from '../../Services/packagewisedischargeclaim.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { data } from 'jquery';
import Swal from 'sweetalert2';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { TableUtil } from '../../util/TableUtil';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-packagebenificiarydtls',
  templateUrl: './packagebenificiarydtls.component.html',
  styleUrls: ['./packagebenificiarydtls.component.scss']
})
export class PackagebenificiarydtlsComponent implements OnInit {
  user: any;
  benificiarydata: any;
  state: any;
  district: any;
  hospital: any;
  fromDate: any;
  toDate: any;
  packageheder: any;
  packageCode: any;
  txtsearchDate: any;
  benificrydata: any = [];
  pageElement: any;
  currentPage: any;
  showPegi: boolean;
  packageHeader: any;
  record: any;
  dist: any;
  hosp: any;
  userId: any;
  dataClaim: any;
  packageCod: any;
  stName: any;
  disName: any;
  hopName: any;
  showsdh: boolean;
  constructor(public headerService: HeaderService,private snoService: SnocreateserviceService,private sessionService: SessionStorageService,
    private packagewisedischargeclaimService: PackagewisedischargeclaimService,private route: Router) { }

  ngOnInit(): void {
    // this.user = JSON.parse(sessionStorage.getItem("user"));
    this.user = this.sessionService.decryptSessionData("user");
    this.benificiarydata = JSON.parse(localStorage.getItem("packagebenificiary"));

    this.state = this.benificiarydata.stat;
    this.district = this.benificiarydata.dist;
    // stateName: this.stateNam,
    // disName: this.disName,
    // hospitalName: this.hopName,
    this.stName=this.benificiarydata.stateName;
    this.disName=this.benificiarydata.disName;
    this.hopName=this.benificiarydata.hospitalName;
    this.hospital = this.benificiarydata.hosp;
    this.fromDate = this.benificiarydata.fromdate;
    this.toDate = this.benificiarydata.todate;
    this.packageheder = this.benificiarydata.packageHeader;
    this.packageCode=this.benificiarydata.packageCod;
    this.benificiarywisedetails();
  }

  benificiarywisedetails() {
    // this.user = JSON.parse(sessionStorage.getItem("user"));
    this.user = this.sessionService.decryptSessionData("user");
    if(this.user.groupId==5){
      this.hospital=this.user.userName;
      this.showsdh=false;
    }else{
      this.showsdh=true;
    }
    let userId = this.user.userId;
    if (this.state == undefined) {
      this.state = "";
    }
    if (this.district == undefined) {
      this.district = "";
    }
    if (this.hospital == undefined) {
      this.hospital = "";
    }
    this.packagewisedischargeclaimService.getBenificiarydata(userId, this.state, this.district, this.hospital,this.fromDate, this.toDate, this.packageCode ).subscribe(
      (result) => {
        console.log(result);
        this.benificrydata = [];
        this.benificrydata = result;
        this.record = this.benificrydata.length;
        if (this.record > 0) {
          this.currentPage = 1;
          this.pageElement = 50;
          this.showPegi = true;
        } else {
          this.showPegi = false;
        }
      },
      (error) => console.log(error)
    )
  }
  report: any = [];
  snaPendingClaimList: any = {
    slNo: "",
    urn: "",
    patientName: "",
    patientPhone: "",
    dateOfAdm: "",
    dateOfDischrge: "",
    actlDateAdm: "",
    actlDateDischarge: "",
    dischargeAmt:"",
    claimedAmt:"",
    paidAmt:"",
    packageCod:"",
    packageName:""

  };

  heading = [['Sl No.', 'URN','Patient Name', 'Patient Phone', ' Date of Admission', ' Date of Discharge', 'Actual Date of Admission', 'Actual Date of Discharge','Discharge Amount','Claimed Amount',
   'Paid Amount' ,'Package  Code','Package Name']];
  downloadReport(type){
    if (this.benificrydata == null || this.benificrydata.length == 0) {
      this.swal("Info", "No Record Found", "info");
      return;
    }
    this.report = [];
    let item: any;
    for (var i = 0; i < this.benificrydata.length; i++) {
      item = this.benificrydata[i];
      this.snaPendingClaimList = [];
      this.snaPendingClaimList.slNo = i + 1;
      this.snaPendingClaimList.urn = item.urn;
      this.snaPendingClaimList.patientName = item.patientName;
      this.snaPendingClaimList.patientPhone = item.patientPhone;
      this.snaPendingClaimList.dateOfAdm = this.convertDate1(item.dateOfAdm);
      this.snaPendingClaimList.dateOfDischrge = this.convertDate2(item.dateOfDischrge);
      this.snaPendingClaimList.actlDateAdm = this.convertDate3(item.actlDateAdm);
      this.snaPendingClaimList.actlDateDischarge=this.convertDate4(item.actlDateDischarge);
      this.snaPendingClaimList.dischargeAmt = this.convertCurrency1(item.dischargeAmt);
      this.snaPendingClaimList.claimedAmt = this.convertCurrency2(item.claimedAmt);
      this.snaPendingClaimList.paidAmt=this.convertCurrency3(item.paidAmt);
      this.snaPendingClaimList.packageCod=item.packageCod;
      this.snaPendingClaimList.packageName=item.packageName;


      this.report.push(this.snaPendingClaimList);
      console.log(this.report);
    }
    if (type == 1) {
      let filter = [];
      if(this.user.groupId!=5){
        filter.push([['State Name:-',  this.stName]]);
        filter.push([['District Name:-', this.disName]]);
        filter.push([['Hospital Name :-', this.hopName]]);
      }
      filter.push([['Hospital Name :-', this.hopName]]);
      filter.push([['Package Header :-', this.packageheder]]);
      filter.push([['Actual Date of Discharge From:-', this.fromDate]]);
      filter.push([['Actual Date of Discharge To:-', this.toDate]]);
      // Package Header Beneficiary Discharge Claim Report
      TableUtil.exportListToExcelWithFilter(this.report, "  Package  Beneficiary Discharge Claim Report", this.heading, filter);
    }
    else if (type == 2) {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('l', 'mm', [380, 260]);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text("Package Beneficiary Discharge Claim Report", 130, 10);
      doc.setFontSize(13);
      if(this.user.groupId!=5){
      doc.text("State Name :-" + this.stName, 35, 25);
      doc.text("District Name:-" +   this.disName, 135, 25);
      doc.text("Hospital Name:-" + this.hopName, 265, 25);
      }
      else{
        this.hopName = this.user.fullName;
      doc.text("Hospital Name:-" + this.hopName, 265, 25);
      }
      doc.text("Actual Date Of Discharge From:-" + this.fromDate, 35, 33);
      doc.text("Actual Date Of Discharge To:-" + this.toDate, 135, 33);
      doc.text("Package Header:-" + this.packageheder,265,33);
      doc.text("Generated On:-" + this.convertDate(new Date()), 35, 40);
      doc.text("Generated By:-" + this.sessionService.decryptSessionData("user").fullName, 265, 40);


      // JSON.parse(sessionStorage.getItem('user')).fullName, 40, 49
      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.slNo;
        pdf[1] = clm.urn;
        pdf[2] = clm.patientName;
        pdf[3] = clm.patientPhone;
        pdf[4] = clm.dateOfAdm;
        pdf[5] = clm.dateOfDischrge;
        pdf[6]=clm.actlDateAdm;
        pdf[7] = clm.actlDateDischarge;
        pdf[8] = clm.dischargeAmt;
        pdf[9] = clm.claimedAmt;
        pdf[10] = clm.paidAmt;
        pdf[11]=clm.packageCod;
        pdf[12] = clm.packageName;


        rows.push(pdf);
      }
      console.log(rows);
      autoTable(doc, {
        head: this.heading,
        body: rows,
        theme: 'grid',
        startY: 60,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: 30 },
          2: { cellWidth: 45 },
          3: { cellWidth: 25 },
          4: { cellWidth: 25 },
          5: { cellWidth: 25 },
          6: { cellWidth: 26 },
          7: { cellWidth: 25 },
          8: { cellWidth: 20 },
          9: { cellWidth: 20 },
          10: { cellWidth: 20 },
          11: { cellWidth: 30 },
          12: { cellWidth: 35 },

        }
      });
      doc.save('GJAY_  Package  Beneficiary Discharge Claim Report.pdf');

    }

  }
  convertCurrency2(claimedAmt: any) {
    var formatter = new CurrencyPipe('en-US');
    claimedAmt = formatter.transform(claimedAmt, '', '');
    return claimedAmt;
  }
  convertCurrency1(dischargeAmt: any) {
    var formatter = new CurrencyPipe('en-US');
    dischargeAmt = formatter.transform(dischargeAmt, '', '');
    return dischargeAmt;
  }
  convertDate4(actlDateDischarge: any) {
    var datePipe = new DatePipe("en-US");
    actlDateDischarge = datePipe.transform(actlDateDischarge, 'dd-MMM-yyyy');
    return actlDateDischarge;
  }
  convertDate3(actlDateAdm: any) {
    var datePipe = new DatePipe("en-US");
    actlDateAdm = datePipe.transform(actlDateAdm, 'dd-MMM-yyyy');
    return actlDateAdm;
  }
  convertDate2(dateOfDischrge: any) {
    var datePipe = new DatePipe("en-US");
    dateOfDischrge = datePipe.transform(dateOfDischrge, 'dd-MMM-yyyy');
    return dateOfDischrge;
  }
  convertDate1(dateOfAdm: any) {
    var datePipe = new DatePipe("en-US");
    dateOfAdm = datePipe.transform(dateOfAdm, 'dd-MMM-yyyy');
    return dateOfAdm;
  }
  convertDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy hh:mm:ss a');
    return date;
  }

  convertCurrency3(paidAmt: any) {
    var formatter = new CurrencyPipe('en-US');
    paidAmt = formatter.transform(paidAmt, '', '');
    return paidAmt;
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

}
