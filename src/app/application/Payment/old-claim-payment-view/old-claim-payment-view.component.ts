import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PaymentfreezeserviceService } from '../../Services/paymentfreezeservice.service';
import { SnamasterserviceService } from '../../Services/snamasterservice.service';
import { HeaderService } from '../../header.service';
import { CurrencyPipe, formatDate } from '@angular/common';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TableUtil } from '../../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-old-claim-payment-view',
  templateUrl: './old-claim-payment-view.component.html',
  styleUrls: ['./old-claim-payment-view.component.scss']
})
export class OldClaimPaymentViewComponent implements OnInit {

  childmessage: any;
  user: any;
  txtsearchDate: any;
  pageElement: any;
  currentPage: any;
  record: any;
  showPegi: boolean;
  public stateList: any = [];
  public districtList: any = [];
  public hospitalList: any = [];
  floatList: any =[];
  fromDate: any;
  toDate: any;
  hospital: any = '';
  districtId: any = '';
  stateId: any = '';
  // claimstatus: any;
  keyword: any = "hospitalName";
  keyword1: any = "districtname";
  keyword2: any = "stateName";
  totalAmount: number;
  totalCount: number;
  summary: any;
  month:any;
  year:any;
  claimList: any = [];

  constructor(
    public headerService: HeaderService,
    private pymntFrzSrvc: PaymentfreezeserviceService,
    private snamasterService: SnamasterserviceService,
    public route: Router,private sessionService: SessionStorageService
  ) {}

  ngOnInit(): void {
    // dynamic title
    this.user = this.sessionService.decryptSessionData("user");
    this.headerService.setTitle('Old Claim Payment Freeze Reports');
    // localStorage.removeItem("click");
    // localStorage.removeItem("click1");
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
    this.getStateList();
    this.currentPage = 1;
    this.pageElement = 100;

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

    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr('placeholder', 'From Date *');

    $('input[name="toDate"]').attr('placeholder', 'To Date *');

    this.getGeneratedReports();
  }

  getGeneratedReports() {
    this.txtsearchDate = '';
    let userId = this.user.userId;
    let fromDate = $('#formdate').val();
    let toDate = $('#todate').val();
    let stateId = this.stateId;
    let districtId = this.districtId;
    let hospitalId = this.hospital;
    if (fromDate == null || fromDate == "" || fromDate == undefined) {
      this.swal("Info", "Please Select Actual Date of Discharge From", 'info');
      return;
    }
    if (toDate == null || toDate == "" || toDate == undefined) {
      this.swal("Info", "Please Select Actual Date of Discharge To", 'info');
      return;
    }
    if (Date.parse(fromDate) > Date.parse(toDate)) {
      this.swal('Info', ' From Date should be less than To Date', 'info');
      return;
    }

    this.floatList = [];
    this.currentPage = 1;
    this.pageElement = 50;
    let requestData = {
      userId: userId,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      stateId: stateId,
      districtId: districtId,
      hospitalId: hospitalId
    };
    this.pymntFrzSrvc.paymentFreezeViewOld(requestData).subscribe(
      (data) => {
        this.floatList = data;
        if (this.floatList.length>0) {
          this.record = this.floatList.length;
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

  download(filename) {
    let img = this.pymntFrzSrvc.downloadOldPfzFile(filename, this.user.userId);
    window.open(img, '_blank');
  }

  resetTable() {
    window.location.reload();
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

  getStateList() {
    this.snamasterService.getStateList(this.user.userId).subscribe(
      (response) => {
        this.stateList = response;
      },
      (error) => console.log(error)
    )
  }

  OnChangeState(id) {
    $('#districtId').val('');
    $('#hospital').val('');
    this.districtId = '';
    this.hospital = '';
    this.hospitalList = [];
    localStorage.setItem("stateCode", id);
    this.snamasterService.getDistrictListByStateId(this.user.userId, id).subscribe(
      (response) => {
        this.districtList = response;
      },
      (error) => console.log(error)
    )
  }

  OnChangeDistrict(id) {
    this.hospital = '';
    $('#hospital').val('');
    var stateCode = localStorage.getItem("stateCode");
    this.snamasterService.getHospitalbyDistrictId(this.user.userId, id, stateCode).subscribe(
      (response) => {
        this.hospitalList = response;
      },
      (error) => console.log(error)
    )
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }

  pageItemChange() {
    this.pageElement = $("#pageItem").val();
  }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

  convertCurrency(amount: any){
    var formatter = new CurrencyPipe('en-IN');
    amount = formatter.transform(amount, '', '');
    return amount;
  }

  claimdetails(claim) {
    let fdate=claim.actualDateOfDischargeFrom;
    let tdate=claim.actualDateOfDischargeTo;
    let stateId=claim.stateCode==undefined?'':claim.stateCode;
    let districtId=claim.districtCode==undefined?'':claim.districtCode;
    let hospitalId=claim.hospitalCode==undefined?'':claim.hospitalCode;

    this.claimList = [];
    this.pymntFrzSrvc.paymentFreezeOldDetails(fdate, tdate, stateId, districtId, hospitalId).subscribe(
      (data) => {
        this.claimList = data;
      },
      (error) => {
        console.log(error);
        this.swal('Error', 'Something went wrong.', 'error');
      }
    );
  }

  report: any = [];
  sno: any = {
    Slno: "",
    hospitalname: "",
    hospitalcode: "",
    urn: "",
    InvoiceNumber: "",
    caseno: "",
    PatientName: "",
    packagecode: "",
    packagename: "",
    packageprocedure: "",
    ActualDateOfAdmission: "",
    ActualDateOfDischarge: "",
    mortality: "",
    hospitalclaimedamount: "",
    approvedAmount: ""
  };
  heading = [[
    'Sl No',
    'Hospital Name',
    'Hospital Code',
    'URN',
    'Invoice Number',
    'Case Number',
    'Patient Name',
    'Package Code',
    'Package Name',
    'Package Procedure',
    'Actual Date Of Admission',
    'Actual Date Of Discharge',
    'Mortality (Hospital)',
    'Hospital Claim Amount',
    'Approved Amount'
  ]];

  downloadReport(type: any) {
    this.report = [];
    if (type == 'xcl') {
      let claim: any;
      for (var i = 0; i < this.claimList.length; i++) {
        claim = this.claimList[i];
        this.sno = [];
        this.sno.Slno = i + 1;
        this.sno.hospitalname = claim.hospitalname;
        this.sno.hospitalcode = claim.hospitalcode;
        this.sno.urn = claim.urn;
        this.sno.InvoiceNumber = claim.invoiceno;
        this.sno.caseno = claim.caseno != null ? claim.caseno : "N/A";
        this.sno.PatientName = claim.patientname;
        this.sno.packagecode = claim.packagecode;
        this.sno.packagename = claim.packagename;
        this.sno.packageprocedure = claim.procedurename;
        this.sno.ActualDateOfAdmission = claim.actualdateofadmission;
        this.sno.ActualDateOfDischarge = claim.actualdateofdischarge;
        this.sno.mortality = claim.mortality;
        this.sno.hospitalclaimedamount = claim.totalamountclaimed != null ? this.convertCurrency(claim.totalamountclaimed) : "N/A";
        this.sno.approvedAmount = claim.snoapprovedamount != null ? this.convertCurrency(claim.snoapprovedamount) : "N/A";
        this.report.push(this.sno);
      }
      let filter = [];
      TableUtil.exportListToExcelWithFilter(this.report, "Payment Freeze Old Claim Details", this.heading, filter);
    } else if (type == 'pdf') {
      if (this.claimList.length == 0) {
        this.swal('', 'No Data Found', 'info');
        return;
      }
      let SlNo = 1;
      this.claimList.forEach(claim => {
        let rowData = [];
        rowData.push(SlNo++);
        rowData.push(claim.hospitalname);
        rowData.push(claim.hospitalcode);
        rowData.push(claim.urn);
        rowData.push(claim.invoiceno);
        rowData.push(claim.caseno != null ? claim.caseno : "N/A");
        rowData.push(claim.patientname);
        rowData.push(claim.packagecode);
        rowData.push(claim.packagename);
        rowData.push(claim.procedurename);
        rowData.push(claim.actualdateofadmission);
        rowData.push(claim.actualdateofdischarge);
        rowData.push(claim.mortality);
        rowData.push(claim.totalamountclaimed != null ? this.convertCurrency(claim.totalamountclaimed) : "N/A");
        rowData.push(claim.snoapprovedamount != null ? this.convertCurrency(claim.snoapprovedamount) : "N/A");
        this.report.push(rowData);
      });
      let doc = new jsPDF('l', 'mm', [230, 470]);
      doc.setFontSize(10);
      doc.text('Generated By :-' + this.user.fullName, 5, 5);
      doc.text('Generated On : ' + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString(), 5, 10);
      doc.text('Payment Freeze Old Claim Details', 100, 25);
      autoTable(doc, {
        head: this.heading, body: this.report, startY: 28, theme: 'grid',
        styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
        bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
        columnStyles: {
          0: { cellWidth: 15},
          1: { cellWidth: 30 },
          2: { cellWidth: 30},
          3: { cellWidth: 30},
          4: { cellWidth: 30 },
          5: { cellWidth: 45 },
          6: { cellWidth: 40 },
          7: { cellWidth: 20 },
          8: { cellWidth: 30 },
          9: { cellWidth: 30 },
          10: { cellWidth: 30 },
          11: { cellWidth: 30 },
          12: { cellWidth: 20 },
          13: { cellWidth: 30 },
          14: { cellWidth: 30 },
        }
      });
      doc.save('GJAY_Payment Freeze Old Claim Details.pdf');
    }
  }

}
