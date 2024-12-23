import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../application/header.service';
import { PaymentfreezeserviceService } from '../application/Services/paymentfreezeservice.service';
import { SessionStorageService } from '../services/session-storage.service';
import { Router } from '@angular/router';
import { JwtService } from '../services/jwt.service';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { TableUtil } from '../application/util/TableUtil';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-postpaymentsummarydetails',
  templateUrl: './postpaymentsummarydetails.component.html',
  styleUrls: ['./postpaymentsummarydetails.component.scss']
})
export class PostpaymentsummarydetailsComponent implements OnInit {
  pageElement: any;
  currentPage: any;
  txtsearchDate: any;
  showPegi: boolean;
  floatDetails: any = [];
  resData: any;
  user: any;
  record: any;
  floatNumber: any;
  hospitalCode: any;
  maxChars = 250;
  hideStatus: boolean = true;
  RemarkhideStatus: boolean = true;
  childmessage: any;
  searchType: any;
  searchTypeValue: any;
  statusvalue: any;
  searchTypeinView: any;
  createdByName: any;

  constructor(
    public headerService: HeaderService,
    public paymentfreezeService: PaymentfreezeserviceService,
    public route: Router,
    private jwtService: JwtService,private sessionService: SessionStorageService
  ) { }

  ngOnInit(): void {

    this.headerService.setTitle('Float Details');
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
    this.user = this.sessionService.decryptSessionData("user");
    this.currentPage = 1;

    this.pageElement = 50;
    this.createdByName = this.sessionService.decryptSessionData('createdByName');
    this.floatNumber = this.sessionService.decryptSessionData('floatNumber');
    this.hospitalCode = this.sessionService.decryptSessionData('hospitalCode');
    this.statusvalue = this.sessionService.decryptSessionData('Status');
    this.searchType = this.sessionService.decryptSessionData('Searchtype');
    this.searchTypeinView = this.sessionService.decryptSessionData('Searchtypeinview');
    if (this.searchType == 3) {
      this.searchTypeValue = 'Compliance By SNA'
    } else if (this.searchType == 2) {
      this.searchTypeValue = 'Fresh'
    }
    if (this.searchTypeinView == 4) {
      this.searchTypeValue = 'Reverted'
    } else if (this.searchTypeinView == 5) {
      this.searchTypeValue = 'Verified'
    }
    if (this.hospitalCode) {
      this.getDetailsByHospital();
    } else {
      this.getDetails();
    }
  }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>(
      document.getElementById('pageItem')
    )).value;
    console.log(this.pageElement);
  }

  snoName: any;
  backUpData: any = [];
  float: any;
  hospitalName: any;
  district: any;
  incentiveStatus: any;
  hospitalCodes: any;
  colors: string[] = ['blue', 'red'];
  currentIndex: number = 0;
  getDetails() {
    this.paymentfreezeService.getFloatClaimDetails(this.floatNumber).subscribe(
      (data) => {
        this.resData = data;
        console.log(data);
        this.floatDetails = this.resData;
        this.backUpData = this.floatDetails;
        this.floatDetails.forEach((element, index) => {
          if (Number(element.currentTotalAmount) > Number(element.snaApprovedAmount)) {
            element.colorStatus = true;
          } else {
            element.colorStatus = false;
          }
          if (element.isFloatGenerate == 1) {
            setInterval((timeout) => {
              $('#tags' + index).css({
                color: this.colors[this.currentIndex]
              });
              if (!this.colors[this.currentIndex]) {
                this.currentIndex = 0;
              } else {
                this.currentIndex++;
              }
            }, 200);
          }
        });
        this.float = this.floatDetails[0].floatNumber;
        this.createdByName = this.floatDetails[0].createdBy;
        this.snoName = this.floatDetails[0].snaName;
        this.record = this.floatDetails.length;
        this.hospitalName = this.floatDetails[0].hospitalName;
        this.district = this.floatDetails[0].districtName;
        this.incentiveStatus = this.floatDetails[0].incenticeStatus;
        this.hospitalCodes = this.floatDetails[0].hospitalCode;
        if (this.statusvalue != undefined && this.statusvalue != null && this.statusvalue != '' && this.statusvalue == "B") {
          $('#action').hide();
          this.hideStatus = false;
        }
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

  getDetailsByHospital() {
    this.paymentfreezeService.getFloatDetailsByHospital(this.floatNumber, this.hospitalCode).subscribe(
      (data) => {
        this.resData = data;
        console.log(data);
        if (this.resData.status == 'success') {
          this.floatDetails = this.resData.data;
          this.backUpData = this.floatDetails;
          this.floatDetails.forEach((element) => {
            if (Number(element.currentTotalAmount) > Number(element.snaApprovedAmount))
              element.colorStatus = false;
            else
              element.colorStatus = false;
          });
          this.float = this.floatDetails[0].floatNumber;
          this.createdByName = this.floatDetails[0].createdBy;
          this.snoName = this.floatDetails[0].snaName;
          this.record = this.floatDetails.length;
          this.hospitalName = this.floatDetails[0].hospitalName;
          this.district = this.floatDetails[0].districtName;
          this.incentiveStatus = this.floatDetails[0].incenticeStatus;
          this.hospitalCodes = this.floatDetails[0].hospitalCode;
          if (this.statusvalue != undefined && this.statusvalue != null && this.statusvalue != '' && this.statusvalue == "B") {
            $('#action').hide();
            this.hideStatus = false;
          }
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
      }
    );
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }

  report: any = [];
  sno: any = {
    Slno: "",
    URN: "",
    claimno: "",
    hospitalname: "",
    caseno: "",
    InvoiceNumber: "",
    PatientName: "",
    ActualDateOfAdmission: "",
    ActualDateOfDischarge: "",
    hospitalclaimedamount: "",
    cpdapprovedAmount: "",
    snaapprovedAmount: "",
    foremarks: "",
    generatedBy: "",
    gender: "",
    packagename: "",
    packagecode: "",
    packageprocedure: "",
    packagecost: "",
    mortalityhospitals: "",
    mortalitycpd: "",
    hospitalclaimedamounthos: "",
    implantdata: "",
    cpdclaimstatus: "",
    cpdremarks: "",
    cpdapprovalAmount: "",
    snaclaimstatus: "",
    snaremarks: "",
    snaapprovedamountsnacpd: "",
    jointceofinanceremarks: "",
    internalauditorremarksRevertcase: "",
    jointceofinamcerevertremarksRevertcase: "",
    nodalofficerremarks: "",
    nodalofficerrevisedapprovedamount: "",
    jointceofinanceremarksFoverification: "",
    finalforemarks: "",
    internalauditorremarks: "",
    dyceofinanceremarks: "",
    finaljointceoremarks: "",
    ceoremarkrevertcase: "",
    snaremarkrevertcase: "",
    ceoremarks: "",

  };
  heading = [['Sl#', 'URN', 'Invoice Number', 'Claim Number', 'Patient Name', 'Gender', 'Package Name', 'Package Code', 'Package Procedure',
    'Package Cost (₹)', 'Actual Date Of Admission', 'Actual Date Of Discharge',
    'Mortality (Hospital)', 'Mortality (CPD)', 'Hospital Claimed Amount (₹)', 'Implant Data', 'CPD Claim Status', 'CPD Remarks', 'CPD Approved Amount (₹)'
    , 'SNA Claim Status', 'SNA Remarks', 'SNA Approved Amount(SNA/CPD) (₹)', 'Joint CEO Finance Remarks', 'FO Remarks', 'Internal Auditor Remarks (Revert Case)'
    , 'Joint CEO Finance Remarks (Revert Case)', 'Nodal Officer Remark', 'Nodal officer Revised Approved Amount (₹)', 'Joint CEO Finance Remarks (FO Verification)'
    , 'Final FO Remarks', 'Internal Auditor Remarks', 'DY. CEO Finance Remarks', 'Final Joint CEO Remarks', 'CEO Remark Revert Case', 'SNA Remark Revert Case', 'CEO Remark	']];
  downloadReport(type: any) {
    this.report = [];
    if (type == 'excel') {
      let claim: any;
      for (var i = 0; i < this.floatDetails.length; i++) {
        claim = this.floatDetails[i];
        this.sno = [];
        this.sno.Slno = i + 1;
        this.sno.URN = claim.urn ? claim.urn : 'N/A';
        this.sno.InvoiceNumber = claim.invoiceNo ? claim.invoiceNo : 'N/A';
        this.sno.claimno = claim.claimNo ? claim.claimNo : 'N/A';
        this.sno.PatientName = claim.patientName ? claim.patientName : 'N/A';
        this.sno.gender = claim.gender ? claim.gender : 'N/A';
        this.sno.packagename = claim.packageName ? claim.packageName : 'N/A';
        this.sno.packagecode = claim.packageCode ? claim.packageCode : 'N/A';
        this.sno.packageprocedure = claim.procedureName ? claim.procedureName : 'N/A';
        this.sno.packagecost = claim.packageCost ? claim.packageCost : 'N/A';
        this.sno.ActualDateOfAdmission = this.convertdatetostring(claim.actualDateOfAdmission);
        this.sno.ActualDateOfDischarge = this.convertdatetostring(claim.actualDateOfDischarge);
        this.sno.mortalityhospitals = claim.mortality ? claim.mortality : 'N/A';
        this.sno.mortalitycpd = claim.cpdMortality ? claim.cpdMortality : 'N/A';
        this.sno.hospitalclaimedamounthos = claim.totalAmountClaimed ? claim.totalAmountClaimed : 'N/A';
        this.sno.implantdata = claim.implantData ? claim.implantData : 'N/A';
        this.sno.cpdclaimstatus = claim.cpdClaimStatus ? claim.cpdClaimStatus : 'N/A';
        this.sno.cpdremarks = claim.cpdRemarks ? claim.cpdRemarks : 'N/A';
        this.sno.cpdapprovalAmount = claim.cpdApprovedAmount ? claim.cpdApprovedAmount : 'N/A';
        this.sno.snaclaimstatus = claim.snaClaimStatus ? claim.snaClaimStatus : 'N/A';
        this.sno.snaremarks = claim.snaRemarks ? claim.snaRemarks : 'N/A';
        this.sno.snaapprovedamountsnacpd = claim.snoApprovedAmount ? claim.snoApprovedAmount : 'N/A';
        this.sno.jointceofinanceremarks = claim.jointCeoRemarks ? claim.jointCeoRemarks : 'N/A';
        this.sno.foremarks = claim.foRemarks ? claim.foRemarks : 'N/A';
        this.sno.internalauditorremarksRevertcase = claim.iarRevertCase ? claim.iarRevertCase : 'N/A';
        this.sno.jointceofinamcerevertremarksRevertcase = claim.jointCeoRemarksRevert ? claim.jointCeoRemarksRevert : 'N/A';
        this.sno.nodalofficerremarks = claim.noRemarks ? claim.noRemarks : 'N/A';
        this.sno.nodalofficerrevisedapprovedamount = claim.noApprovedAmount ? claim.noApprovedAmount : 'N/A';
        this.sno.jointceofinanceremarksFoverification = claim.jointCeoRemarksVerify ? claim.jointCeoRemarksVerify : 'N/A';
        this.sno.finalforemarks = claim.finalFoRemarks ? claim.finalFoRemarks : 'N/A';
        this.sno.internalauditorremarks = claim.audRemarks ? claim.audRemarks : 'N/A';
        this.sno.dyceofinanceremarks = claim.dyceoRemarks ? claim.dyceoRemarks : 'N/A';
        this.sno.finaljointceoremarks = claim.jointCeoRemarksFinal ? claim.jointCeoRemarksFinal : 'N/A';
        this.sno.ceoremarkrevertcase = claim.ceoremarkrevertcase ? claim.ceoremarkrevertcase : 'N/A';
        this.sno.snaremarkrevertcase = claim.snaremarkrevertcase ? claim.snaremarkrevertcase : 'N/A';
        this.sno.ceoremarks = claim.ceoremark ? claim.ceoremark:'N/A';
        this.report.push(this.sno);
      }
      let filter = [];
      filter.push([['Float Number', this.floatDetails[0].floatNumber]]);
      filter.push([['Float Generated By', this.floatDetails[0].createdBy]]);
      filter.push([['SNA Doctor', this.snoName]]);
      filter.push([['Hospital Name', this.hospitalName]]);
      filter.push([['District', this.district]]);
      filter.push([['GJAY Incentive Status', this.incentiveStatus]]);
      TableUtil.exportListToExcelWithFilter(this.report, this.floatDetails[0].floatNumber, this.heading, filter);
    } else if (type == 'pdf') {
      if (this.floatDetails.length == 0) {
        this.swal('', 'No Data Found', 'info');
        return;
      }
      let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      let SlNo = 1;
      this.floatDetails.forEach(element => {
        let rowData = [];
        rowData.push(SlNo++);
        rowData.push(element.urn);
        rowData.push(element.invoiceNo);
        rowData.push(element.claimNo);
        rowData.push(element.patientName);
        rowData.push(element.gender);
        rowData.push(element.hospitalName + '(' + element.hospitalCode + ')');
        rowData.push(element.caseNo != null ? element.caseNo : "N/A");
        rowData.push(this.convertdatetostring(element.actualDateOfAdmission));
        rowData.push(this.convertdatetostring(element.actualDateOfDischarge));
        rowData.push(element.totalAmountClaimed != null ? element.totalAmountClaimed : "N/A");
        rowData.push(element.cpdApprovedAmount != null ? element.cpdApprovedAmount : "N/A");
        rowData.push(element.snoApprovedAmount != null ? element.snoApprovedAmount : "N/A");
        rowData.push(element.finalFoRemarks != null ? element.finalFoRemarks : "N/A");
        rowData.push(element.createdBy != null ? element.createdBy : "N/A");
        this.report.push(rowData);
      });
      let doc = new jsPDF('l', 'mm', [238, 270]);
      doc.setFontSize(10);
      doc.text('Generated By :-' + this.user.fullName, 5, 5);//this.user.fullName
      doc.text('Generated On : ' + new Date().getDate() + ' ' + months[new Date().getMonth()] + ' ' + new Date().getFullYear() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds(), 5, 10);
      doc.text('Float Number : ' + this.floatDetails[0].floatNumber, 5, 15);
      doc.text('Float Generated By : ' + this.floatDetails[0].createdBy, 5, 20);
      doc.text('Float Details List', 100, 25);
      doc.setLineWidth(0.7);
      doc.line(100, 26, 128, 26);
      autoTable(doc, {
        head: this.heading, body: this.report, startY: 28, theme: 'grid',
        styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
        bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
        columnStyles: {
          0: { cellWidth: 6 },
          1: { cellWidth: 18 },
          2: { cellWidth: 18 },
          3: { cellWidth: 30 },
          4: { cellWidth: 18 },
          5: { cellWidth: 15 },
          6: { cellWidth: 20 },
          7: { cellWidth: 10 },
          8: { cellWidth: 20 },
          9: { cellWidth: 20 },
          10: { cellWidth: 20 },
          11: { cellWidth: 18 },
          12: { cellWidth: 18 },
          13: { cellWidth: 18 },
          14: { cellWidth: 18 },
          15: { cellWidth: 18 },

        }
      })
      doc.save(this.floatDetails[0].floatNumber+'.pdf');
    }
  }
  convertdatetostring(date: any) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy');
    return date;
  }

  getActionDetails(claimid, urn: any, floatNumber: any) {
    localStorage.setItem('claimid', claimid);
    let state = {
      Urn: urn,
      Claimid: claimid,
      Floatnumber: floatNumber
    }
    localStorage.setItem("floatclaimdetails", JSON.stringify(state));
    localStorage.setItem('token', this.jwtService.getJwtToken());
    this.route.navigate([]).then((result) => {
      window.open(environment.routingUrl + '/floatclaimdetails');
    });
  }

  keyPress(event: KeyboardEvent) {
    const pattern = /^[A-Za-z0-9 ' ',@,#,*,%,,,.',",{,}]+$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }

}

