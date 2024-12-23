import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { JwtService } from 'src/app/services/jwt.service';
// import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { UnprocessedclaimService } from '../../Services/unprocessedclaim.service';
import { TableUtil } from '../../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-urnwiseaction',
  templateUrl: './urnwiseaction.component.html',
  styleUrls: ['./urnwiseaction.component.scss']
})
export class UrnwiseactionComponent implements OnInit {
  snareportList: any = [];
  showPegi: boolean;
  record: any;
  currentPage: any;
  pageElement: any;
  check: boolean = false;
  txtsearchDate: any;
  days: any;
  searchBy: any = '';
  fieldValue: any = '';
  user: any;
  userId: any;
  dataRequest: any;
  childmessage: any;
  actionTaken: any;
  constructor(private sessionService: SessionStorageService,public headerService: HeaderService, private jwtService: JwtService, public route: Router, public unprocessed: UnprocessedclaimService) { }

  ngOnInit(): void {
    this.headerService.setTitle('URN Wise Action');
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
    this.user = this.sessionService.decryptSessionData("user");
    this.actionTaken = localStorage.getItem('actionTaken');

    // if (localStorage.getItem('treatment') != 'N' || this.actionTaken != "Y") {
    //   sessionStorage.removeItem('requestData1');
    // }
    if(this.unprocessed.getIsValidData() != 1)
      sessionStorage.removeItem('requestData1');

    if(this.unprocessed.getIsValidData() == 1)
      this.unprocessed.setIsValidData(0);


    this.dataRequest = this.sessionService.decryptSessionData('requestData1');
    localStorage.removeItem('treatment');
    localStorage.removeItem('actionTaken');
    this.currentPage = 1;
    this.pageElement = 20;
    if (this.dataRequest != null && this.dataRequest != undefined && this.dataRequest != '') {
      this.searchBy = this.dataRequest.searchBy;
      this.fieldValue = this.dataRequest.fieldValue;
      this.getSNAReports();
    }
  }
  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }
  show(item) {
    this.swal('', item, '');
  }
  getSNAReports() {
    this.userId = this.user.userId;
    if (this.searchBy == '' || this.searchBy == null || this.searchBy == undefined) {
      this.swal('', 'Please Select Search By', 'error');
    }
    if (this.searchBy != '' && this.searchBy != null && this.searchBy != undefined) {
      if (this.fieldValue == '' || this.fieldValue == null || this.fieldValue == undefined) {
        if (this.searchBy == 'URN') {
          this.swal('', 'Please Enter URN', 'error');
        } else {
          this.swal('', 'Please Enter Claim Number', 'error');
        }
      }
    }
    if (this.searchBy != '' && this.searchBy != null && this.searchBy != undefined && this.fieldValue != '' && this.fieldValue != null && this.fieldValue != undefined) {
      let requestData = {
        userId: this.userId,
        searchBy: this.searchBy,
        fieldValue: this.fieldValue
      }
      this.sessionService.encryptSessionData('requestData1', requestData);
      this.unprocessed.getByUrnAndClaimNo(this.userId, this.searchBy, this.fieldValue).subscribe((data: any) => {
        let resData = data;
        if (resData.status == 'success') {
          let details = JSON.parse(resData.details);
          this.snareportList = details;
          this.record = this.snareportList.length;
          if (this.record > 0) {
            this.showPegi = true;
          }
          else {
            this.showPegi = false;
            if (this.searchBy == 'URN') {
              this.swal('', 'No Record Pending for this URN', 'info');
            } else {
              this.swal('', 'No Record Pending for this Claim No.', 'info');
            }
          }
        }
      }, (error: any) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      })
    }

  }

  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;

  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
  resetField() {
    sessionStorage.removeItem('requestData1');
    window.location.reload();
  }
  clearField() {
    this.fieldValue = '';
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  onAction(id: any, urn: any, packageCode: any, claimStatus: any, txnpackagedetailid: any) {
    let state = {
      transactionId: id,
      URN: urn,
      packageCode: packageCode,
      txnpackagedetailid: txnpackagedetailid
    };
    localStorage.setItem('actionData', JSON.stringify(state));
    this.route.navigate(['/application/urnwisedetailsaction']);
    // }
    // if(claimStatus == 2){
    //   let state = {
    //     transactionId:id,
    //     URN:urn,
    //     packageCode:packageCode
    //   }
    // localStorage.setItem('treatment', 'N');
    // localStorage.setItem("actionData",JSON.stringify(state));
    // this.route.navigate(['/application/cpdrejectedaction/action']);
    // }
    // if(claimStatus == 3){
    // let state = {
    //   transactionId: id,
    //   URN: urn,
    //   packageCode: packageCode,
    // };
    // localStorage.setItem('treatment', 'N');
    // localStorage.setItem('actionData', JSON.stringify(state));
    // this.route.navigate(['/application/NonComplianceQueryCPDToSNA/action']);
    // }
    // if(claimStatus == 4){
    //   let state = {
    //     transactionId: id,
    //     flag: 'REAPRV',
    //     URN: urn,
    //     packageCode: packageCode,
    //   };
    //   localStorage.setItem('treatment', 'N');
    //   localStorage.setItem('actionData', JSON.stringify(state));
    //   this.route.navigate(['/application/snoreapproval/action']);
    // }
    // if(claimStatus == 7){
    //   let state={
    //     transactionId:id,
    //     URN:urn,
    //     packageCode:packageCode
    //   }
    // localStorage.setItem('treatment', 'N');
    // localStorage.setItem("actionData",JSON.stringify(state));
    // this.route.navigate(['/application/unProcessedClaimList/action']);
    // }
    // if(claimStatus == 9){
    //   let state = {
    //     transactionId: id,
    //     flag: 'DC',
    //     URN: urn,
    //     packageCode: packageCode,
    //   };
    //   localStorage.setItem('treatment', 'N');
    //   localStorage.setItem('actionData', JSON.stringify(state));
    //   this.route.navigate(['/application/dcCompliance/action']);
    // }
    // if(claimStatus == 13){
    //   let state = {
    //     transactionId: id,
    //     flag: 'HOLD',
    //     URN: urn,
    //     packageCode: packageCode,
    //   };
    //   localStorage.setItem('hold', "Y");
    //   localStorage.setItem('treatment', 'N');
    //   localStorage.setItem('actionData', JSON.stringify(state));
    //   this.route.navigate(['/application/claimsOnHold/action']);
    // }
  }
  report: any = [];
  sno: any = {
    Slno: "",
    claimNo: "",
    URN: "",
    PatientName: "",
    HospitalName: "",
    procedurecode: "",
    DateofAdmission: "",
    ActualDateofAdmission: "",
    DateofDischarge: "",
    ActualDateofDischarge: "",
    HospitalClaimAmount: "",
    CPDClaimStatus: "",
    CPDRemarks: "",
    CPDApprovedAmount: "",
    SNAClaimStatus: "",
    SNARemarks: "",
    snaamount: "",
    ClaimStatus: ""
  };
  heading = [['Sl#', 'Claim No', 'URN', 'Patient Name', 'Hospital Details', 'Procedure Code', 'Admission Date', 'Actual Admission Date', 'Discharge Date', 'Actual Discharge Date', 'Hospital Claim Amount (₹)', 'CPD Claim Status', 'CPD Remarks', 'CPD Approved Amount (₹)', 'SNA Claim Status', 'SNA Remarks', 'SNA Approved Amount (₹)', 'Claim Status']];

  downloadReport() {

    this.report = [];
    let claim: any;
    for (var i = 0; i < this.snareportList.length; i++) {
      claim = this.snareportList[i];
      this.sno = [];
      this.sno.Slno = i + 1;
      this.sno.claimNo = claim.claimNo;
      this.sno.URN = claim.urn;
      this.sno.PatientName = claim.patientname;
      this.sno.HospitalName = claim.hospitalName;
      this.sno.procedurecode = claim.packagecode;
      this.sno.DateofAdmission = this.convertStringToDate(claim.dateofadmission);
      this.sno.ActualDateofAdmission = this.convertStringToDate(claim.actualdateofadmission);
      this.sno.DateofDischarge = this.convertStringToDate(claim.dateofdischarge);
      this.sno.ActualDateofDischarge = this.convertStringToDate(claim.actualdateofdischarge);
      this.sno.HospitalClaimAmount = this.convertCurrency(claim.totalamountclaimed);
      this.sno.CPDClaimStatus = claim.CPDClaimStatus;
      this.sno.CPDRemarks = claim.CPDRemarks;
      this.sno.CPDApprovedAmount = this.convertCurrency(claim.cpdapprovedamount);
      this.sno.SNAClaimStatus = claim.SNAClaimStatus;
      this.sno.SNARemarks = claim.SNARemarks;
      this.sno.snaamount = this.convertCurrency(claim.snaapprovedamount)
      this.sno.ClaimStatus = claim.actiontype;
      this.report.push(this.sno);
    }
    let filter = [];
    filter.push([[this.searchBy, this.fieldValue]]);
    TableUtil.exportListToExcelWithFilter(this.report, 'URN Wise Action List', this.heading, filter);
  }
  GetDate(str) {
    var arr = str.split("-");
    var months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

    var month = months.indexOf(arr[1].toLowerCase());

    return new Date(parseInt(arr[2]), month, parseInt(arr[0]));
  }
  //convert string to date
  convertStringToDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy');
    return date;
  }
  //convert timestamp to date
  convertDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy, h:mm:ss a');
    return date;
  }
  //convert number to currency
  convertCurrency(amount: any) {
    if (amount == null) {
      return '-NA-';
    } else {
      var formatter = new CurrencyPipe('en-US');
      amount = formatter.transform(amount, '', '');
      return amount;
    }
  }
  downloadPdf() {
    if (this.snareportList.length == 0) {
      this.swal('info', 'No record found', 'info');
      return;
    }
    else {
      var doc = new jsPDF('l', 'mm', [380, 310]);
      doc.setFontSize(12);
      doc.text(this.searchBy + ':' + this.fieldValue, 10, 10);
      doc.text("Generated On: " + this.convertDate(new Date()), 10, 20);
      doc.text("Generated By: " + this.user.fullName, 150, 20);
      doc.text("URN Wise Action List", 150, 30);
      var col = [['Sl#', 'Claim No', 'URN', 'Patient Name', 'Hospital Details', 'Procedure Code', 'Admission Date', 'Actual Admission Date', 'Discharge Date', 'Actual Discharge Date', 'Hospital Claim Amount (₹)', 'CPD Claim Status', 'CPD Remarks', 'CPD Approved Amount (₹)', 'SNA Claim Status', 'SNA Remarks', 'SNA Approved Amount (₹)', 'Claim Status']];
      var rows = [];
      var claim: any;
      for (var i = 0; i < this.snareportList.length; i++) {
        claim = this.snareportList[i];
        var temp = [(i + 1), claim.claimNo, claim.urn, claim.patientname, claim.hospitalName, claim.packagecode, this.convertStringToDate(claim.dateofadmission), this.convertStringToDate(claim.actualdateofadmission), this.convertStringToDate(claim.dateofdischarge), this.convertStringToDate(claim.actualdateofdischarge), this.convertCurrency(claim.totalamountclaimed),
        this.checkNA(claim.CPDClaimStatus), this.checkNA(claim.CPDRemarks), this.convertCurrency(claim.cpdapprovedamount), this.checkNA(claim.SNAClaimStatus), this.checkNA(claim.SNARemarks), this.convertCurrency(claim.snaapprovedamount), claim.actiontype];
        rows.push(temp);
      }

      autoTable(doc, {
        head: col,
        body: rows,
        theme: 'grid',
        startY: 40,
        styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
        bodyStyles: { overflow: 'linebreak', cellWidth: 'wrap', lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: { overflow: 'linebreak', cellWidth: 'wrap', lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 20 },
          2: { cellWidth: 20 },
          3: { cellWidth: 20 },
          4: { cellWidth: 20 },
          5: { cellWidth: 20 },
          6: { cellWidth: 20 },
          7: { cellWidth: 20 },
          8: { cellWidth: 20 },
          9: { cellWidth: 30 },
          10: { cellWidth: 20 },
          11: { cellWidth: 20 },
          12: { cellWidth: 30 },
          13: { cellWidth: 20 },
          14: { cellWidth: 20 },
          15: { cellWidth: 20 },
          16: { cellWidth: 20 },
        },
      });
      doc.save('URN Wise Action List.pdf');
    }
  }
  checkNA(value: any) {
    if (value == null) {
      return '-NA-';
    }
    else {
      return value;
    }
  }
}
