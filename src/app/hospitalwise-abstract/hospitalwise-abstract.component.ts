import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { PaymentfreezeserviceService } from '../application/Services/paymentfreezeservice.service';
import { HeaderService } from '../application/header.service';
import { Router } from '@angular/router';
import { SessionStorageService } from '../services/session-storage.service';
import { DatePipe, DecimalPipe, formatDate } from '@angular/common';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { TableUtil } from '../application/util/TableUtil';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { CpdPaymentReportService } from '../application/Services/cpd-payment-report.service';
import { SnoCLaimDetailsService } from '../application/Services/sno-claim-details.service';
import { IndianCurrencyPipe } from '../indian-currency.pipe';
declare let $: any;

@Component({
  selector: 'app-hospitalwise-abstract',
  templateUrl: './hospitalwise-abstract.component.html',
  styleUrls: ['./hospitalwise-abstract.component.scss'],
  providers: [IndianCurrencyPipe]
})
export class HospitalwiseAbstractComponent implements OnInit {
  floatNumber: any;
  childmessage: any;
  pageElement: any;
  currentPage: any;
  pageElement1: any;
  currentPage1: any;
  fromdate: any;
  record: any;
  showPegi: boolean;
  showPegi1: boolean;
  hospitalwisefloatdetails: any = [];
  logdata: any = [];
  txtsearchDate: any;
  districtId: any;
  stateId: any;
  user: any;
  hospitalId: any;
  modaldala: any = [];
  float: any;
  createdByName: any;
  snoName: any;
  bankname: any;
  accountnumber: any;
  ifsccode: any;
  showStar: boolean = true;
  hospitalCode: any;
  hospitalName: any;
  hoveredRow: number | null = null;
  bankdate: any; // New date field
  @ViewChild('closebutton') closebutton;
  constructor(public paymentfreezeService: PaymentfreezeserviceService,
    public headerService: HeaderService,
    public route: Router,
    private sessionService: SessionStorageService,
    private cpdpaymentservice: CpdPaymentReportService,
    public snoService: SnoCLaimDetailsService,private indianCurrencyPipe: IndianCurrencyPipe) { }

  ngOnInit(): void {
    this.headerService.setTitle('Hospital Wise Float List(For Post Payment Updation)');
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
    if (date.getMonth() == 0) {
      year = year - 1;
      month = 11;
    } else {
      month = date.getMonth() - 1;
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
    $('input[name="currentDate"]').attr("placeholder", "Date *");
    this.floatNumber = this.sessionService.decryptSessionData('hospitalwisefloatnumber');
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
  totalClaimRaised: any = 0;
  totalClaimAmount: any = 0;
  totalApproved: any = 0;
  totalSnoAmount: any = 0;
  roundofamount: any = 0;
  Ongetdatahospitalwisefloatdetails() {
    this.totalClaimRaised = 0;
    this.totalClaimAmount = 0;
    this.totalApproved = 0;
    this.totalSnoAmount = 0;
    let fromdatevalue = this.convertdatetostring(this.fromdate);
    this.paymentfreezeService.getfloatdetailshospitalwiseabstaact(this.floatNumber).subscribe(
      (res: any) => {
        this.hospitalwisefloatdetails = res.data;
        this.snoName = this.hospitalwisefloatdetails[0]?.snaName;
        this.createdByName = this.hospitalwisefloatdetails[0]?.createdBy;
        this.bankname = this.hospitalwisefloatdetails[0]?.bankname
        this.accountnumber = this.hospitalwisefloatdetails[0]?.accountnumber
        this.ifsccode = this.hospitalwisefloatdetails[0]?.ifsccode

        this.hospitalwisefloatdetails.forEach((element) => {
          let totalClaimAmount = parseFloat(element.claimamount);
          let totalSnoAmount = parseFloat(element.snoamount);
          let roundofamount = parseFloat(element.roundofamount);
          this.totalClaimRaised += parseFloat(element.claimraised) || 0; // Handle NaN cases
          this.totalClaimAmount += totalClaimAmount || 0; // Handle NaN cases
          this.totalApproved += parseFloat(element.approved) || 0; // Handle NaN cases
          this.totalSnoAmount += totalSnoAmount || 0; // Handle NaN cases
          this.roundofamount += roundofamount || 0; // Handle NaN cases
        });
        if (this.hospitalwisefloatdetails.length > 0) {
          this.record = this.hospitalwisefloatdetails.length;
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
      'Amount',
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
          ClaimAmount: claim.claimamount,
          ApprovedClaims: claim.approved,
          SNAApprovedAmount: claim.snoamount
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
        ClaimAmount: this.totalClaimAmount,
        ApprovedClaims: this.totalApproved,
        SNAApprovedAmount: this.totalSnoAmount
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
          amount: floathistory?.amount,
          remarks: floathistory?.remarks
        };
        floatHistoryData.push(this.sno1);
      }

      // Add additional data at the top
      const additionalData = [
        ['Float Number:', this.float],
        ['Generated By:', this.createdByName],
        ['SNA Doctor:', this.snoName],
        ['Excel Generated Date:', formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en').toString()],
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
            item.SNAApprovedAmount
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
    roundofamount: '',
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
      'Freezed Round of Amount',
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
          element?.claimamount,
          element?.approved,
          element?.snoamount,
          element?.roundofamount,
          element?.bankname,
          element?.accountnumber,
          element?.ifsccode,
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
        this.indianCurrencyPipe.transform(this.roundofamount)
      ];
      this.reportdata.push(totalRow);
      // Create a new PDF document
      let doc = new jsPDF('l', 'mm', [238, 270]);
      if (this.reportdata.length > 0) {
        doc.setFontSize(10);
        doc.text('Generated BY: ' + this.user.fullName, 5, 5);
        doc.text(
          'Generated ON: ' +
          formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString(),
          5, 10
        );

        // Add additional data
        doc.text('Float Number:' + this.float, 5, 15);
        doc.text('SNA Doctor:' + this.snoName, 5, 20);

        // Add hospital data section header
        doc.text('Hospital Wise Float Details', 100, 35);
        doc.setLineWidth(0.7);
        doc.line(100, 36, 142, 36);

        // Add hospital data
        autoTable(doc, {
          head: this.headingdata,
          body: this.reportdata,
          startY: 38,
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
            1: { cellWidth: 16 },
            2: { cellWidth: 16 },
            3: { cellWidth: 16 },
            4: { cellWidth: 35 },
            5: { cellWidth: 16 },
            6: { cellWidth: 16 },
            7: { cellWidth: 16 },
            8: { cellWidth: 23 },
            9: { cellWidth: 23 },
            10: { cellWidth: 23 },
            11: { cellWidth: 23 },
            12: { cellWidth: 23 },
          },
        });
      }
      // Save the PDF
      doc.save(this.float + '.pdf');
    }
  }


  districtCode: any;
  stateCode: any;
  districtName: any;
  stateName: any;

  view(item) {
    this.hospitalCode = item.hospitalCode;
    this.sessionService.encryptSessionData('floatNumber', this.floatNumber);
    this.sessionService.encryptSessionData('hospitalCode', this.hospitalCode);
    sessionStorage.setItem('currentPageNum', JSON.stringify(this.currentPage));
    this.route.navigate([]).then((result) => {
      window.open(environment.routingUrl + '/postpaymentnewsummarydetails');
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

  totalPaidAmount: any = 0;
  snaApprovedAmount: any = 0;
  spprovedClaims: any = 0;
  hospitalcode: any;
  hospitalCodedata: any;
  hospitalnamedata: any;

  paidAmount: any;
  selectedPaymentMode: any ='';
  banknamedata: any ='';
  accountnamedata: any ='';
  ifsccodedata: any ='';
  typeNumber: any;
  selectedBank: any='';
  currentDatevalue: any;

  initializePayment(roundofamount: Number, hospitalcode: any, snaAmount: any, approvedClaims: any, hospitalName: any,bankname:any,ifsccode:any,accountnumber:any) {
    this.logdata = [];
    this.totalPaidAmount = 0;
    this.totalPaidAmount = roundofamount;
    this.hospitalcode = hospitalcode;
    this.snaApprovedAmount = snaAmount;
    this.spprovedClaims = approvedClaims
    this.hospitalCodedata = hospitalcode;
    this.hospitalnamedata = hospitalName;
    this.banknamedata = bankname;
    this.accountnamedata = accountnumber;
    this.ifsccodedata = ifsccode;
    this.getBankList();
    this.getBankMode();
    this.typeNumber = '';
    this.selectedBank = '';
    this.paidAmount = '';
    this.selectedPaymentMode = '';
    let currentDate = this.getDate(new Date());
    $('input[name="currentDate"]').val(currentDate);
    this.paymentfreezeService.getpreviousRecord(hospitalcode, this.float).subscribe(
      (res: any) => {
        this.logdata = res.data;
        console.log(this.logdata);
        if (this.logdata.length > 0) {
          this.paidAmount = this.logdata[0]?.actualpaidamount;
          this.selectedPaymentMode = this.logdata[0]?.paymentmodeid;
          this.typeNumber = this.logdata[0]?.ddchequeetno;
          this.selectedBank = this.logdata[0]?.bankid;
          this.currentDatevalue = this.logdata[0]?.bankdate;
          this.bankdate = this.convertDate(this.currentDatevalue);
        } else {
          console.log("No Data Found");
          $('#postpaymentModal').show();
          $('#bankModeId').val('');
          $('#typeNumber').val('');
          $('#bankId').val('');
          $('#paidamount').val('');
          $('input[name="currentDate"]').val(currentDate);
        }
      }
    )
  }
  convertDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy');
    return date;
  }
  approved_Amount(event: KeyboardEvent) {
    const pattern = /^[0-9\b]+$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
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
  cancel() {
    $('#bankModeId').val('');
    $('#typeNumber').val('');
    $('#bankId').val('');
  }

  checkAmount() {
    let paidAmount = Number($('#paidamount').val());
    let totalAmount = Number(this.totalPaidAmount);
    if (paidAmount > totalAmount) {
      let lessAmount = paidAmount - totalAmount;
      this.swal(
        '',
        'You are Entering ₹ ' + lessAmount + ' higher amount than Approved Amount.',
        'info'
      );
    }
  }

  getMode() {
    let bankModeId = $('#bankModeId').val();
    if (bankModeId == '1') {
      this.showStar = false;
    } else {
      this.showStar = true;
    }
  }

  bankList: any = [];
  getBankList() {
    this.bankList = [];
    this.snoService.getBankList().subscribe(
      (data: any) => {
        let responseData = data;
        if (responseData.status == 'success') {
          this.bankList = responseData.details;
          this.bankList.sort((a, b) => a.bankName.localeCompare(b.bankName));
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
  bankMode: any = [];
  getBankMode() {
    this.bankMode = [];
    this.snoService.getBankMode().subscribe(
      (data: any) => {
        let responseData = data;
        if (responseData.status == 'success') {
          this.bankMode = responseData.details;
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getValidNo(event) {
    const pattern = /^\S*$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  currentDate: any;
  maxChars = 5;
  JavaScript
  submitPayment() {
    let bankModeId = $('#bankModeId').val();
    let typeNumber = $('#typeNumber').val();
    let bankId = $('#bankId').val();
    let paidamount = $('#paidamount').val();
    this.currentDate = $('#currentDate').val();
    let hospitacode = this.hospitalCodedata;
    let snaApprovedamount = this.snaApprovedAmount;
    let approvedclaims = this.spprovedClaims
    // Input validation
    if (paidamount === '' || paidamount === undefined || paidamount === null) {
      this.swal('', 'Please Enter Paid Amount', 'info');
      return;
    }
    if (paidamount === '' || paidamount === undefined || paidamount === null || paidamount <= 0) {
      this.swal('', 'Please Enter a Valid Paid Amount Greater Than Zero', 'info');
      return;
    }

    if (paidamount.toLocaleString().startsWith('.')) {
      this.swal('', 'Paid Amount cannot start with a decimal point.', 'info');
      return;
    }

    if (bankModeId === '' || bankModeId === undefined || bankModeId === null) {
      this.swal('', 'Please Select Paid By', 'info');
      return;
    }

    if (typeNumber === '' || typeNumber === undefined || typeNumber === null) {
      this.swal('', 'Please Enter DD/CHEQUE/ET No.', 'info');
      return;
    }

    if (bankModeId !== '1') {
      if (typeNumber.toLocaleString().length < 6) {
        this.swal('', 'Please Enter 6 digit DD/CHEQUE/ET No.', 'info');
        return;
      }

      if (bankId === '' || bankId === undefined || bankId === null) {
        this.swal('', 'Please Select Bank Name', 'info');
        return;
      }
    }

    if (this.currentDate === '' || this.currentDate === undefined || this.currentDate === null) {
      this.swal('', 'Please Select Current Date', 'info');
      return;
    }

    let requestData = {
      userId: this.user.userId,
      bankModeId: bankModeId,
      typeNumber: typeNumber.toLocaleString().trim(),
      bankId: bankId,
      currentDate: new Date(this.currentDate),
      totalPaidAmount: this.totalPaidAmount,
      paidAmount: paidamount,
      hospitacode: hospitacode,
      snaApprovedamount: snaApprovedamount,
      approvedclaims: approvedclaims,
      floatno:this.float
    };
    console.log(requestData);
    Swal.fire({
      title: '',
      text: 'Are You Sure to Update the payment ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        this.snoService.updatePaymentnew(requestData).subscribe(
          (data: any) => {
            let responseData = data;
            if (responseData.status == 'success') {
              if (responseData.data.status == 'success') {
                Swal.fire({
                  title: 'Success',
                  text: 'Updated Successfully',
                  icon: 'success',
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: 'Ok',
                }).then((result) => {
                  if (result.isConfirmed) {
                    window.location.reload();
                  }
                });
              } else if (responseData.data.status == 'failed') {
                Swal.fire({
                  title: '',
                  text: responseData.data.message,
                  icon: 'info',
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: 'Ok',
                }).then((result) => {
                  if (result.isConfirmed) {
                    window.location.reload();
                  }
                });
              }
              else {
                this.swal(
                  '',
                  'Something went wrong... Please try again later.',
                  'error'
                );
              }
            } else {
              this.swal(
                '',
                'Something went wrong... Please try again later.',
                'error'
              );
            }
          },
          (error) => {
            console.log(error);
            this.swal('', 'Something went wrong.', 'error');
          }
        );
      }
    });
  }
  dtls: any;
  viewDescription(descriptinDtls) {
    this.dtls = descriptinDtls;
    $('#appealDisposal').show();
  }
  modalClose() {
    $('#appealDisposal').hide();
  }
  reporter: any = [];
  snoer: any = {
    Slno: "",
    bankName: "",
    paymentType: "",
    ddchechequeno: "",
    paymentdate: "",
    paidamount: "",
    bankname: "",
    accountname: "",
    ifsccode: "",
  };
  header = [['Sl#', 'Bank Name', 'Payment Type', 'DD/CHEQUE/ET No.', 'Payment Date','Actual Paid Amount','Bank Name','Account Number','IFSC Code']];
  downloadList1(type: any) {
    this.reporter = [];
    if (type == 'excel') {
      let claim: any;
      for (var i = 0; i < this.logdetails.length; i++) {
        claim = this.logdetails[i];
        this.snoer = [];
        this.snoer.Slno = i + 1;
        this.snoer.bankName = claim.bankname;
        this.snoer.paymentType = claim.paidby;
        this.snoer.ddchechequeno = claim.ddchequeetno;
        this.snoer.paymentdate = this.dateconvert(claim.bankdate);
        this.snoer.paidamount = claim.actualpaidamount;
        this.snoer.bankname = claim.bankname;
        this.snoer.accountname = claim.accountnumber;
        this.snoer.ifsccode = claim.ifsccode;
        this.reporter.push(this.snoer);
      }
      let filter1 = [];
      filter1.push([['Float Number:-', this.float]]);
      filter1.push([['Generated By:-', this.createdByName]]);
      filter1.push([['SNA Doctor:-', this.snoName]]);
      filter1.push([['Hospital Name:-', this.hospitalnamedata]]);
      filter1.push([['Hospital Code:-', this.hospitalCodedata]]);
      filter1.push([['Freezed Round of Amount:-', this.totalPaidAmount]]);
      TableUtil.exportListToExcelWithFilterforadmin(this.reporter, "Payment History", this.header, filter1);
    }else if (type == 'pdf') {
      if (this.logdetails.length == 0) {
        this.swal('', 'No Data Found', 'info');
        return;
      }
      let SlNo = 1;
      this.logdetails.forEach(element => {
        let rowData = [];
        rowData.push(SlNo++);
        rowData.push(element.bankname);
        rowData.push(element.paidby);
        rowData.push(element.ddchequeetno);
        rowData.push(this.dateconvert(element.bankdate));
        rowData.push(element.actualpaidamount);
        rowData.push(element.bankname);
        rowData.push(element.accountnumber);
        rowData.push(element.ifsccode);
        this.reporter.push(rowData);
      });
      let doc = new jsPDF('l', 'mm', [238, 270]);
      doc.setFontSize(10);
      doc.text('Authority Name :-' + this.user.fullName , 5, 5);
      doc.text('Float Number:-' + this.float, 5, 10);
      doc.text('Generated By:-' + this.createdByName, 5, 15);
      doc.text('SNA Doctor:-' + this.snoName, 5, 20);
      doc.text('Hospital Name:-' + this.hospitalnamedata, 5, 25);
      doc.text('Hospital Code:-' + this.hospitalCodedata, 5, 30);
      doc.text('Freezed Round of Amount:-' + this.totalPaidAmount, 5, 35);
      doc.text('Document Generate Date :-' + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en').toString(), 5, 40);
      doc.text('Payment History', 100, 42);
      doc.setLineWidth(0.7);
      doc.line(100, 43, 124, 43);
      autoTable(doc, {
        head: this.header, body: this.reporter, startY: 45, theme: 'grid',
        styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
        bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
        columnStyles: {
          0: { cellWidth: 10},
          1: { cellWidth: 30 },
          2: { cellWidth: 30 },
          3: { cellWidth: 30 },
          4: { cellWidth: 30 },
          5: { cellWidth: 30 },
          6: { cellWidth: 30 },
          7: { cellWidth: 30 },
          8: { cellWidth: 30 },
        }
      })
      doc.save('Payment_History.pdf');
    }
  }
  logdetails=[];
  viewData(hospitalcode: any,hospitalName:any,roundofamount:any) {
    let floano = this.float;
    this.hospitalCodedata = hospitalcode;
    this.hospitalnamedata = hospitalName;
    this.totalPaidAmount = roundofamount;
    this.paymentfreezeService.getLogDetails(this.hospitalCodedata, floano).subscribe(
      (result: any) => {
        console.log(result);
       this.logdetails = result.data;
      }
    )
  }
  dateconvert(date: any) {
    var datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'dd-MMM-yyyy');
  }
}

