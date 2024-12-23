import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { PaymentfreezeserviceService } from '../application/Services/paymentfreezeservice.service';
import { HeaderService } from '../application/header.service';
import { TableUtil } from '../application/util/TableUtil';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from '../services/session-storage.service';
import { log } from 'console';
import { IndianCurrencyPipe } from '../indian-currency.pipe';

@Component({
  selector: 'app-hospitalwisefloatdetails',
  templateUrl: './hospitalwisefloatdetails.component.html',
  styleUrls: ['./hospitalwisefloatdetails.component.scss'],
  providers: [IndianCurrencyPipe]
})
export class HospitalwisefloatdetailsComponent implements OnInit {
  floatNumber: any;
  childmessage: any;
  pageElement: any;
  pageElement1: any;
  currentPage: any;
  currentPage1: any;
  fromdate: any;
  record: any;
  record1: any;
  showPegi: boolean;
  showPegi1: boolean;
  hospitalwisefloatdetails: any = [];
  txtsearchDate: any;
  districtId: any;
  stateId: any;
  user: any;
  hospitalId: any;
  modaldala: any = [];
  float: any;
  createdByName: any;
  snoName: any;
  constructor(
    public paymentfreezeService: PaymentfreezeserviceService,
    public headerService: HeaderService,
    public route: Router,
    private sessionService: SessionStorageService,
    private indianCurrencyPipe: IndianCurrencyPipe
  ) { }

  ngOnInit(): void {
    this.headerService.setTitle('Hospital Wise Float List');
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
    this.user = this.sessionService.decryptSessionData('user');
    this.currentPage = 1;
    this.currentPage1 = 1;
    this.pageElement = 100;
    this.pageElement1 = 100;
    this.floatNumber = this.sessionService.decryptSessionData(
      'hospitalwisefloatnumber'
    );
    this.float = this.floatNumber;
    this.fromdate = this.sessionService.decryptSessionData('Date');
    this.Ongetdatahospitalwisefloatdetails();
  }
  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>(
      document.getElementById('pageItem')
    )).value;
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

  pageItemChangehistory() {
    this.pageElement1 = (<HTMLInputElement>(
      document.getElementById('pageItem1')
    )).value;
  }
  onPageBoundsCorrectionhistory(number: number) {
    this.currentPage1 = number;
  }
  totalClaimRaised: any = 0;
  totalClaimAmount: any = 0;
  roundTotalSnoAmount: any = 0;
  totalApproved: any = 0;
  totalSnoAmount: any = 0;
  totalpendingcase: any = 0;
  floatid: any;
  Ongetdatahospitalwisefloatdetails() {
    this.totalClaimRaised = 0;
    this.totalClaimAmount = 0;
    this.totalApproved = 0;
    this.totalSnoAmount = 0;
    this.roundTotalSnoAmount = 0;
    let fromdatevalue = this.convertdatetostring(this.fromdate);
    this.paymentfreezeService
      .getfloatdetailshospitalwise(this.floatNumber, fromdatevalue)
      .subscribe(
        (res: any) => {
          this.hospitalwisefloatdetails = res;
          if (this.hospitalwisefloatdetails.length > 0) {
            this.snoName = this.hospitalwisefloatdetails[0].snaName;
            this.createdByName = this.hospitalwisefloatdetails[0].createdBy;
            this.floatid = this.hospitalwisefloatdetails[0].floatid;
            this.hospitalwisefloatdetails.forEach((element) => {
              let totalClaimAmount = parseFloat(element.claimamount);
              let totalSnoAmount = parseFloat(element.snoamount);
              let roundTotalAmnt = Math.round(element.roundSnoAmount);
              this.totalClaimRaised = this.totalClaimRaised + element.claimraised;
              this.totalClaimAmount = this.totalClaimAmount + totalClaimAmount;
              this.roundTotalSnoAmount = this.roundTotalSnoAmount + roundTotalAmnt;
              this.totalApproved = this.totalApproved + element.approved;
              this.totalSnoAmount = this.totalSnoAmount + totalSnoAmount;
              this.totalpendingcase = this.totalpendingcase + element.pendingcase;
            });
            if (this.hospitalwisefloatdetails.length > 0) {
              this.record = this.hospitalwisefloatdetails.length;
              if (this.record > 0) {
                this.showPegi = true;
                this.viewHistory(this.floatid);
              } else {
                this.showPegi = false;
              }
            } else {
              this.swal('Info', 'No Data Found', 'info');
            }
          } else {
            this.swal('Info', 'No Data Found', 'info');
          }
        },
        (error) => {
          console.log(error);
          this.swal('Error', 'Something went wrong.', 'error');
        }
      );
  }
  convertdatetostring(date: any) {
    var datePipe = new DatePipe('en-US');
    date = datePipe.transform(date, 'yyyy-MM-dd');
    return date;
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
    SlNo: '',
    StateName: '',
    DistrictName: '',
    HospitalDetails: '',
    ClaimsSubmitted: '',
    ClaimAmount: '',
    ApprovedClaims: '',
    SNAApprovedAmount: '',
    roundSnoAmount:'',
    bankname: '',
    accountnumber: '',
    ifsccode: '',
  };
  heading = [
    [
      'Sl No',
      'State Name',
      'District Name',
      'Hospital Code',
      'Hospital Name',
      'Claims Submitted',
      'Claim Amount',
      'Approved Claims',
      'SNA Approved Amount',
      'Rounded Approved Amount',
      'Bank Name',
      'Account Number',
      'IFSC Code',
    ],
  ];
  sno1: any = {
    SlNo: '',
    floatnumber: '',
    actionby: '',
    actionon: '',
    amount: '',
    remarks: '',
  };
  heading1 = [
    [
      'Sl No',
      'Float Number',
      'Action By',
      'Action On',
      'Rounded Approved Amount',
      'Remarks',
    ],
  ];

  downloadReport(type: any) {
    this.report = [];
    if (type === 'excel') {
      let claim: any;
      let hospitalData = [];
      for (let i = 0; i < this.hospitalwisefloatdetails.length; i++) {
        claim = this.hospitalwisefloatdetails[i];
        this.sno = {
          SlNo: i + 1,
          StateName: claim.stateName,
          DistrictName: claim.districtName,
          HospitalCode: claim.hospitalCode,
          HospitalDetails: claim.hospitalName,
          ClaimsSubmitted: claim.claimraised,
          ClaimAmount: this.indianCurrencyPipe.transform(claim.claimamount),
          ApprovedClaims: claim.approved,
          SNAApprovedAmount: this.indianCurrencyPipe.transform(claim.snoamount),
          roundSnoAmount: this.indianCurrencyPipe.transform(claim.roundSnoAmount),
          bankname: claim.bankname,
          accountnumber: claim.accountnumber,
          ifsccode: claim.ifsccode
        };
        hospitalData.push(this.sno);
      }
      this.sno = {
        SlNo: "Total",
        StateName: '',
        DistrictName: '',
        HospitalCode: '',
        HospitalDetails: '',
        ClaimsSubmitted: this.totalClaimRaised,
        ClaimAmount: this.indianCurrencyPipe.transform(this.totalClaimAmount),
        ApprovedClaims: this.totalApproved,
        SNAApprovedAmount: this.indianCurrencyPipe.transform(this.totalSnoAmount),
        roundSnoAmount: this.indianCurrencyPipe.transform(this.roundTotalSnoAmount)
      };
      hospitalData.push(this.sno);

      // Prepare float history data
      let floatHistoryData = [];
      for (let i = 0; i < this.floatHistoryList.length; i++) {
        let floathistory = this.floatHistoryList[i];
        this.sno1 = {
          SlNo: i + 1,
          floatnumber: floathistory?.floateno,
          actionby: floathistory?.actionby?.fullname !== undefined ? floathistory?.actionby?.fullname + (floathistory?.actionby?.groupId?.groupTypeName !== undefined ?
            `(${floathistory?.actionby?.groupId?.groupTypeName})` : "") : "N/A",
          actionon: floathistory?.actionon,
          amount: this.indianCurrencyPipe.transform(floathistory?.amount),
          remarks: floathistory?.remarks
        };
        floatHistoryData.push(this.sno1);
      }

      // Add additional data at the top
      const additionalData = [
        ['Float Number:', this.float],
        ['Document Generated By:', this.createdByName],
        ['SNA Doctor:', this.snoName],
        ['Document Generated Date:', formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en').toString()],
        ['Total Claim Amount:' + this.indianCurrencyPipe.transform(this.totalClaimAmount)],
        ['Total Approved Amount:' + this.indianCurrencyPipe.transform(this.totalSnoAmount)],
        ['Rounded Approved Amount:' + this.indianCurrencyPipe.transform(this.roundTotalSnoAmount)],
        [] // Empty row to separate the additional data from the headers
      ];

      // Combine additional data, headings and data
      const combinedData = [
        ...additionalData // Add additional data at the top
      ];

      if (hospitalData.length > 0) {
        combinedData.push(
          this.heading[0],
          ...hospitalData.map(item => [
            item.SlNo,
            item.StateName,
            item.DistrictName,
            item.HospitalCode,
            item.HospitalDetails,
            item.ClaimsSubmitted,
            item.ClaimAmount,
            item.ApprovedClaims,
            item.SNAApprovedAmount,
            item.roundSnoAmount,
            item.bankname,
            item.accountnumber,
            item.ifsccode
          ])
        );
        combinedData.push([], []); // Empty rows to separate sections if both sections are present
      }
      if (floatHistoryData.length > 0) {
        combinedData.push(
          this.heading1[0],
          ...floatHistoryData.map(item => [
            item.SlNo,
            item.floatnumber,
            item.actionby,
            this.Dateconvert(item.actionon),
            item.amount,
            item.remarks
          ])
        );
      }
      // Create worksheet for combined data
      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(combinedData);
      // Create a new workbook
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      // Append worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Data");
      // Export the workbook
      XLSX.writeFile(wb, 'HospitalWise Abstract Report And Float History Report.xlsx');
    }
  }

  reportdata: any = [];
  snodata: any = {
    SlNo: '',
    StateName: '',
    DistrictName: '',
    HospitalDetails: '',
    ClaimsSubmitted: '',
    ClaimAmount: '',
    ApprovedClaims: '',
    SNAApprovedAmount: '',
    bankname: '',
    accountnumbe: '',
    ifsccode: '',
  };
  headingdata = [
    [
      'Sl No',
      'State Name',
      'District Name',
      'Hospital Code',
      'Hospital Name',
      'Claims Submitted',
      'Claim Amount',
      'Approved Claims',
      'SNA Approved Amount',
      'Rounded Approved Amount',
      'Bank Name',
      'Account Number',
      'IFSC Code',
    ],
  ];

  downloadReportforpdf(type: any) {
    this.reportdata = [];
    if (type === 'pdf') {
      if (this.hospitalwisefloatdetails.length === 0) {
        this.swal('', 'No Data Found', 'info');
        return;
      }
      // Prepare hospital data
      let SlNo = 1;
      this.hospitalwisefloatdetails.forEach((element) => {
        let rowData = [
          SlNo++,
          element?.stateName,
          element?.districtName,
          element?.hospitalCode,
          element?.hospitalName,
          element?.claimraised,
          this.indianCurrencyPipe.transform(element?.claimamount),
          element?.approved,
          this.indianCurrencyPipe.transform(element?.snoamount),
          this.indianCurrencyPipe.transform(element?.roundSnoAmount),
          element?.bankname,
          element?.accountnumber,
          element?.ifsccode
        ];
        this.reportdata.push(rowData);
      });
      // Add total row for hospital data
      let totalRow = [
        "Total",
        "",
        "",
        "",
        "",
        this.totalClaimRaised,
        this.indianCurrencyPipe.transform(this.totalClaimAmount),
        this.totalApproved,
        this.indianCurrencyPipe.transform(this.totalSnoAmount),
        this.indianCurrencyPipe.transform(this.roundTotalSnoAmount)
      ];
      this.reportdata.push(totalRow);
      let floatHistoryData = [];
      this.floatHistoryList.forEach((element, index) => {
        let rowData = [
          index + 1,
          element?.floateno !== null ? element?.floateno : "N/A",
          element?.actionby?.fullname !== undefined ? element?.actionby?.fullname + (element?.actionby?.groupId?.groupTypeName !== undefined ?
            `(${element?.actionby?.groupId?.groupTypeName})` : "") : "N/A",
          this.Dateconvert(element?.actionon),
          this.indianCurrencyPipe.transform(element?.amount) !== null ? this.indianCurrencyPipe.transform(element?.amount) : "0",
          element?.remarks !== null ? element?.remarks : "N/A",
        ];
        floatHistoryData.push(rowData);
      });


      // Create a new PDF document
      let doc = new jsPDF('l', 'mm', [238, 270]);
      if (this.reportdata.length > 0) {
        doc.setFontSize(10);
        doc.text('Document Generated BY: ' + this.user.fullName, 10, 10);
        doc.text(
          'Document Generated ON: ' +
          formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString(),
          10, 15
        );

        // Add additional data
        doc.text('Float Number: ' + this.float, 10, 20);
        doc.text('SNA Doctor: ' + this.snoName, 10, 25);
        doc.text('Total Claim Amount: ' + this.indianCurrencyPipe.transform(this.totalClaimAmount), 150, 10);
        doc.text('Total Approved Amount: ' + this.indianCurrencyPipe.transform(this.totalSnoAmount), 150, 15);
        doc.text('Rounded Approved Amount: ' + this.indianCurrencyPipe.transform(this.roundTotalSnoAmount), 150, 20);

        // Add hospital data section header
        doc.text('Hospital Wise Float Details', 100, 30);
        doc.setLineWidth(0.7);
        doc.line(100, 31, 142, 31);

        // Add hospital data
        autoTable(doc, {
          head: this.headingdata,
          body: this.reportdata,
          startY: 40,
          theme: 'grid',
          styles: {
            overflow: 'linebreak',
            halign: 'center',
            valign: 'middle',
            fontSize: 8,
            cellPadding: 1,
            lineWidth: 0.1,
            lineColor: 0,
            textColor: 20,
          },
          bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
          headStyles: {
            lineWidth: 0.1,
            lineColor: 0,
            textColor: [255, 255, 255],
            fillColor: [26, 99, 54],
          },
          columnStyles: {
            0: { cellWidth: 8 },
            1: { cellWidth: 20 },
            2: { cellWidth: 20 },
            3: { cellWidth: 20 },
            4: { cellWidth: 40 },
            5: { cellWidth: 10 },
            6: { cellWidth: 20 },
            7: { cellWidth: 10 },
            8: { cellWidth: 20 },
            9: { cellWidth: 20 },
            10: { cellWidth: 20 },
            11: { cellWidth: 20 },
            12: { cellWidth: 20 },
          },
        });
      }
      if (floatHistoryData.length > 0) {
        // Calculate the position for the second table
        let finalY = (doc as any).lastAutoTable.finalY + 10;
        // Add float history data section header
        doc.text('Float History', 100, finalY);
        doc.setLineWidth(0.7);
        doc.line(100, finalY + 1, 120, finalY + 1);
        finalY += 10; // Adjust position for the Float Number
        doc.text('Float Number: ' + this.float, 14, finalY);
        finalY += 5;
        doc.text('SNA Doctor: ' + this.snoName, 14, finalY);
        // Add float history data table
        autoTable(doc, {
          head: this.heading1,
          body: floatHistoryData,
          startY: finalY +2, // Ensure table starts below the Float Number
          theme: 'grid',
          styles: {
            overflow: 'linebreak',
            halign: 'center',
            valign: 'middle',
            fontSize: 8,
            cellPadding: 1,
            lineWidth: 0.1,
            lineColor: 0,
            textColor: 20,
          },
          bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
          headStyles: {
            lineWidth: 0.1,
            lineColor: 0,
            textColor: [255, 255, 255],
            fillColor: [26, 99, 54],
          },
          columnStyles: {
            0: { cellWidth: 8 },
            1: { cellWidth: 60 },
            2: { cellWidth: 50 },
            3: { cellWidth: 40 },
            4: { cellWidth: 20 },
            5: { cellWidth: 60 },
          },
        });
      }
      // Save the PDF
      doc.save(this.float + '.pdf');
    }
  }


  hospitalCode: any;
  districtCode: any;
  stateCode: any;
  hospitalName: any;
  districtName: any;
  stateName: any;

  view(item) {
    this.hospitalCode = item.hospitalCode;
    this.sessionService.encryptSessionData('floatNumber', this.floatNumber);
    this.sessionService.encryptSessionData('hospitalCode', this.hospitalCode);
    sessionStorage.setItem('currentPageNum', JSON.stringify(this.currentPage));
    this.route.navigate([]).then((result) => {
      window.open(environment.routingUrl + '/summarydetails');
    });
  }
  gethospitawisefloatdetailsmodal() {
    let requestData = {
      hospitacode: this.hospitalCode,
      floatnumber: this.floatNumber,
      userId: this.user.userId,
      fromDate: this.convertdatetostring(this.fromdate),
    };
    this.paymentfreezeService
      .gethospitawisefloatmodalreport(requestData)
      .subscribe(
        (data) => {
          this.modaldala = data;
          console.log(data);
          console.log(this.modaldala);
          if (this.modaldala.length > 0) {
            this.record = this.modaldala.length;
            if (this.record > 0) {
              this.showPegi = true;
            } else {
              this.showPegi = false;
            }
          } else {
            this.swal('Info', 'No Data Found', 'info');
          }
        },
        (error) => {
          console.log(error);
          this.swal('Error', 'Something went wrong.', 'error');
        }
      );
  }
  show(item) {
    this.swal('', item, '');
  }
  reports: any = [];
  snos: any = {
    SlNo: '',
    HOSPITALNAME: '',
    HOSPITALCODE: '',
    DISTRICTNAME: '',
    URN: '',
    INVOICENO: '',
    CLAIMNO: '',
    PATIENTNAME: '',
    GENDER: '',
    PACKAGECODE: '',
    PACKAGENAME: '',
    PACKAGECOST: '',
    PROCEDURENAME: '',
    ACTUALDATEOFADMISSION: '',
    ACTUALDATEOFDISCHARGE: '',
    HospitaMORTALITY: '',
    CpdMORTALITY: '',
    HOSPITALCLAIMEDAMOUNT: '',
    IMPLANTDATA: '',
    CPDCLAIMSTATUS: '',
    CPDREMARKS: '',
    CPDAPPROVEDAMOUNT: '',
    SNACLAIMSTATUS: '',
    SNAREMARKS: '',
    SNAAPPROVEDAMOUNT: '',
  };
  headings = [
    [
      'Sl No',
      'HOSPITAL NAME',
      'HOSPITAL CODE',
      'DISTRICT NAME',
      'URN',
      'INVOICE NO',
      'CLAIM NO',
      'PATIENT NAME',
      'GENDER',
      'PACKAGE CODE',
      'PACKAGE NAME',
      'PACKAGE COST (₹)',
      'PROCEDURE NAME',
      'ACTUAL DATE OF ADMISSION',
      'ACTUAL DATE OF DISCHARGE',
      'MORTALITY (Hospital)',
      'MORTALITY (CPD)',
      'HOSPITAL CLAIMED AMOUNT (₹)',
      'IMPLANT DATA',
      'CPD CLAIM STATUS',
      'CPD REMARKS',
      'CPD APPROVED AMOUNT',
      'SNA CLAIM STATUS',
      'SNA REMARKS',
      'SNA APPROVED AMOUNT(SNA/CPD)',
    ],
  ];
  downloadReports(type) {
    this.reports = [];
    if (type == 'excel') {
      let claim: any;
      this.modaldala.forEach((element) => {
        this.snos = [];
        this.snos.push(element[0]);
        this.snos.push(element[1]);
        this.snos.push(element[2]);
        this.snos.push(element[3]);
        this.snos.push(element[4]);
        this.snos.push(element[5]);
        this.snos.push(element[6]);
        this.snos.push(element[7]);
        this.snos.push(element[8]);
        this.snos.push(element[9]);
        this.snos.push(element[10]);
        this.snos.push(element[11]);
        this.snos.push(element[12]);
        this.snos.push(element[13]);
        this.snos.push(element[14]);
        this.snos.push(element[15]);
        this.snos.push(element[16]);
        this.snos.push(element[17]);
        this.snos.push(element[18]);
        this.snos.push(element[19]);
        this.snos.push(element[20]);
        this.snos.push(element[21]);
        this.snos.push(element[22]);
        this.snos.push(element[23]);
        this.snos.push(element[24]);
        this.reports.push(this.snos);
      });
      let filter = [];
      TableUtil.exportListToExcelWithFilter(
        this.reports,
        'Hospital Wise Float Details',
        this.headings,
        filter
      );
    } else if (type == 'pdf') {
      if (this.modaldala.length == 0) {
        this.swal('', 'No Data Found', 'info');
        return;
      }
      this.modaldala.forEach((element) => {
        let rowDatas = [];
        rowDatas.push(element[0]);
        rowDatas.push(element[1]);
        rowDatas.push(element[2]);
        rowDatas.push(element[3]);
        rowDatas.push(element[4]);
        rowDatas.push(element[5]);
        rowDatas.push(element[6]);
        rowDatas.push(element[7]);
        rowDatas.push(element[8]);
        rowDatas.push(element[9]);
        rowDatas.push(element[10]);
        rowDatas.push(element[11]);
        rowDatas.push(element[12]);
        rowDatas.push(element[13]);
        rowDatas.push(element[14]);
        rowDatas.push(element[15]);
        rowDatas.push(element[16]);
        rowDatas.push(element[17]);
        rowDatas.push(element[18]);
        rowDatas.push(element[19]);
        rowDatas.push(element[20]);
        rowDatas.push(element[21]);
        rowDatas.push(element[22]);
        rowDatas.push(element[23]);
        rowDatas.push(element[24]);
        this.reports.push(rowDatas);
      });
      let doc = new jsPDF('l', 'mm', [238, 270]);
      doc.setFontSize(10);
      doc.text('Generated BY :-' + this.user.fullName, 5, 5);
      doc.text('Generated ON : ' + new Date().toLocaleString(), 5, 10);
      doc.text('Hospital Wise Float Details', 100, 25);
      doc.setLineWidth(0.7);
      doc.line(100, 26, 139, 26);
      autoTable(doc, {
        head: this.headings,
        body: this.reports,
        startY: 28,
        theme: 'grid',
        styles: {
          overflow: 'linebreak',
          halign: 'center',
          valign: 'middle',
          fontSize: 8,
          cellPadding: 1,
          lineWidth: 0.1,
          lineColor: 0,
          textColor: 20,
        },
        bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: {
          lineWidth: 0.1,
          lineColor: 0,
          textColor: [255, 255, 255],
          fillColor: [26, 99, 54],
        },
        columnStyles: {
          0: { cellWidth: 3 },
          1: { cellWidth: 10 },
          2: { cellWidth: 10 },
          3: { cellWidth: 10 },
          4: { cellWidth: 10 },
          5: { cellWidth: 10 },
          6: { cellWidth: 10 },
          7: { cellWidth: 10 },
          8: { cellWidth: 10 },
          9: { cellWidth: 10 },
          10: { cellWidth: 10 },
          11: { cellWidth: 10 },
          12: { cellWidth: 10 },
          13: { cellWidth: 10 },
          14: { cellWidth: 10 },
          15: { cellWidth: 10 },
          16: { cellWidth: 10 },
          17: { cellWidth: 10 },
          18: { cellWidth: 10 },
          19: { cellWidth: 10 },
          20: { cellWidth: 10 },
          21: { cellWidth: 10 },
          22: { cellWidth: 10 },
          23: { cellWidth: 10 },
          24: { cellWidth: 10 },
          25: { cellWidth: 10 },
        },
      });
      doc.save('Hospital_Wise_Float_Details.pdf');
    }
  }

  floatHistoryList: any = [];
  floatNum: any;
  resData: any;
  floatCreatedBy: any;
  floatAmount: any;
  createdOn: any;
  viewHistory(floatData: any) {
    this.paymentfreezeService.getFloatLogList(floatData).subscribe(
      (data) => {
        this.resData = data;
        if (this.resData.status == 'success') {
          this.floatHistoryList = this.resData.data;
          this.floatNum = this.floatHistoryList[0].floateno;
          this.floatCreatedBy = this.floatHistoryList[0].createby.fullname;
          this.floatAmount = this.floatHistoryList.at(-1).amount;
          this.createdOn = this.floatHistoryList[0].createon;
          if (this.floatHistoryList.length > 0) {
            this.record1 = this.floatHistoryList.length;
            if (this.record1 > 0) {
              this.showPegi1 = true;
            } else {
              this.showPegi1 = false;
            }
          }
        } else if (this.resData.status == 'failed') {
          this.swal('', this.resData.msg, 'error');
        } else {
          this.swal('', 'Something went wrong.', 'error');
        }
      },
      (error) => {
        this.swal('', 'Something went wrong.', 'error');
      }
    );
  }

  Dateconvert(date) {
    var datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'dd-MMM-yyyy hh:mm:ss a');
  }

  pendingclaimlist:any=[];
  hospname:any=""
  pendingclaimdetails(hospcode:any,hospname:any,pendingclaim:any){
    this.pendingclaimlist = [];
    this.hospname=hospname + " ("+hospcode+")";
    if(pendingclaim==0){
      this.swal('', 'No Record Found!!', 'info');
      return;
    }
    this.paymentfreezeService.gethospwisependingclaimdetails(this.floatNumber, hospcode)
    .subscribe((res: any) => {
      if(res.status ==200){
        this.pendingclaimlist=res.data;
      }else{
        this.swal('Error', 'Something Went Wrong', 'error');
      }
    });
  }

  report1: any = [];
  heading2 = [['Sl#', 'URN', 'Claim No', 'Patient Name', 'Actual Date Of Admission', 'Actual Date Of Discharge',
                'Package Name','Package Code','Current Status']];
  downloadList2(no:any){
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy =  this.user.fullName;
    this.report1 = [];
    let sna: any;
    for (let i = 0; i < this.pendingclaimlist.length; i++) {
      sna = this.pendingclaimlist[i];
      let sno = [];
      sno.push(i + 1);
      sno.push(sna.urn);
      sno.push(sna.claimNo);
      sno.push(sna.patientName);
      sno.push(sna.packageCode);
      sno.push(sna.packageName);
      sno.push(sna.actdateofadm);
      sno.push(sna.actdateofdis);
      sno.push(sna.claimstatus);
      this.report1.push(sno);
    }
    if (no == 1) {
      let filter = [];
      filter.push([['Float No', this.floatNumber]]);
      filter.push([['Hospital Name', this.hospname]]);
      TableUtil.exportListToExcelWithFilter(
        this.report1,
        'Hospital wise Pending Claim List',
        this.heading2, filter
      );
    } else {
      if (this.report1 == null || this.report1.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      let doc = new jsPDF('p', 'mm', [297, 210]);
      doc.setFontSize(20);
      doc.text("Hospital wise Pending Claim List", 80, 15);
      doc.setFontSize(13);
      doc.text('Float No :- ' + this.floatNumber, 15, 25);
      doc.text('Hospital Name :- ' + this.hospname, 15, 32);
      doc.text('GeneratedOn :- ' + generatedOn, 15, 39);
      doc.text('GeneratedBy :- ' + generatedBy, 15, 46);
      autoTable(doc, {
        head: this.heading2,
        body: this.report1,
        theme: 'grid',
        startY: 51,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },
        }
      });
      doc.save('Hospital wise Pending Claim List.pdf');
    }
  }
}
