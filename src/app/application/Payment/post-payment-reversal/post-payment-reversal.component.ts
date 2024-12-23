import { DatePipe, CurrencyPipe, formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { SnoCLaimDetailsService } from '../../Services/sno-claim-details.service';
import { HeaderService } from '../../header.service';
import { TableUtil } from '../../util/TableUtil';
import { LoginService } from 'src/app/services/shared-services/login.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-post-payment-reversal',
  templateUrl: './post-payment-reversal.component.html',
  styleUrls: ['./post-payment-reversal.component.scss']
})
export class PostPaymentReversalComponent implements OnInit {

  user: any;
  userId: any;
  months: any;
  year: any;
  months2: any;
  frstDay: string;
  secoundDay: string;
  public snoList: any = [];
  keyword: any = 'fullName';
  selectedItems: any = [];
  paymentList: any = [];
  showPegi: boolean;
  pageElement: any;
  currentPage: any;
  txtsearchDate: any;
  txtsearch: any;
  disabled: boolean = false;
  selectedValue: "";
  claimList: any = [];
  userDetails: any;
  timeleft: number = 0;

  @ViewChild('hdbtn') hdbtn;
  @ViewChild('closebutton1') closebutton1;
  constructor(
    private headerService: HeaderService,
    private snoClaimService: SnoCLaimDetailsService,
    private service: LoginService,
    private encryptionService: EncryptionService,
    private sessionService: SessionStorageService
  ) { }

  ngOnInit(): void {
    this.headerService.setTitle('Post Payment Reversal');
    this.user = this.sessionService.decryptSessionData("user");

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
    let month: any = date.getMonth() - 1;
    if (month == -1) {
      this.months = 'Dec';
      this.year = year - 1;
    } else {
      this.months = this.getMonthFrom(month);
      this.year = year;
    }
    let date2 = date.getDate();

    this.months2 = this.getMonthFrom(date.getMonth());
    this.frstDay = date1 + '-' + this.months + '-' + this.year;

    this.secoundDay = date2 + '-' + this.months2 + '-' + year;

    //Date input placeholder
    $('input[name="fromDate"]').val(this.frstDay);
    $('input[name="fromDate"]').attr('placeholder', 'From Date *');

    // $('input[name="toDate"]').val('');
    $('input[name="toDate"]').attr('placeholder', 'To Date *');
    this.currentPage = 1;
    this.pageElement = 20;
    this.getPaymentList();
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

  // pageItemChange() {
  //   this.pageElement = $('#pageItem').val();
  //   alert(this.pageElement);
  // }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

  responseData: any;
  fromDate: any;
  toDate: any;
  record: any;
  hospcodearr: any
  getPaymentList() {
    // let userId = this.user.userId;
    this.fromDate = $('#datepicker1').val();
    this.toDate = $('#datepicker2').val();
    if (Date.parse(this.fromDate) > Date.parse(this.toDate)) {
      this.swal('', 'From Date should be less than To Date', 'error');
      return;
    }

    let requestData = {
      userId: this.user.userId,
      fromDate: new Date(this.fromDate),
      toDate: new Date(this.toDate),
    };

    this.snoClaimService.getPaymentList(requestData).subscribe(
      (response) => {
        this.responseData = response;
        if (this.responseData.status == 'success') {
          this.paymentList = JSON.parse(this.responseData.data);
          this.record = this.paymentList.length;
          if (this.record > 0) {
            this.showPegi = true;
          } else {
            this.showPegi = false;
            // this.swal('', 'Record not found.', 'info');
          }
        } else {
          this.swal('', 'Something went wrong.', 'error');
        }
      },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
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
  swal2(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
      timer: 3000,
      showCancelButton: false,
      showConfirmButton: false
    });
  }

  dataIdArray: any = [];
  checkAllCheckBox(event: any) {
    // Angular 13
    if (event.target.checked) {
      for (let i = 0; i < this.paymentList.length; i++) {
        $('#' + this.paymentList[i].paymentInfo).prop('checked', true);
        this.dataIdArray.push(this.paymentList[i].paymentInfo);
      }
    } else {
      for (let i = 0; i < this.paymentList.length; i++) {
        $('#' + this.paymentList[i].paymentInfo).prop('checked', false);
        this.dataIdArray = [];
      }
    }
    this.dataIdArray = this.dataIdArray.filter(
      (value, index) => this.dataIdArray.indexOf(value) === index
    );
    if (this.dataIdArray.length > 0) {
      this.show = true;
    } else {
      this.show = false;
    }
  }
  show: boolean = false;
  tdCheck(event: any, claimId) {
    if (event.target.checked) {
      this.dataIdArray.push(claimId);
    } else {
      for (let i = 0; i < this.dataIdArray.length; i++) {
        if (this.dataIdArray[i] == claimId) {
          this.dataIdArray.splice(i, 1);
        }
      }
    }
    if (this.dataIdArray.length == this.paymentList.length) {
      $('#allCheck').prop('checked', true);
    } else {
      $('#allCheck').prop('checked', false);
    }
    if (this.dataIdArray.length > 0) {
      this.show = true;
    } else {
      this.show = false;
    }
    this.dataIdArray = this.dataIdArray.filter(
      (value, index) => this.dataIdArray.indexOf(value) === index
    );
  }
  resetField() {
    window.location.reload();
  }
  totalPaidAmount: any = 0;
  initializePayment() {
    this.totalPaidAmount = 0;
    this.paymentList.forEach(element => {
      this.dataIdArray.forEach(element1 => {
        if (element.paymentInfo == element1) {
          if (element.snaApprovedAmount == undefined || element.snaApprovedAmount == null || element.snaApprovedAmount == '') {
            let cpdApprovedAmount = Math.round(element.cpdApprovedAmount);
            this.totalPaidAmount = this.totalPaidAmount + cpdApprovedAmount;
          } else {
            let amount = Math.round(element.snaApprovedAmount);
            this.totalPaidAmount = this.totalPaidAmount + amount;
          }

        }
      });

    });
    $('#postpaymentModal').show();
    $('#bankModeId').val('');
    $('#typeNumber').val('');
    $('#bankId').val('');
    $('#paidamount').val('');
    // $('#currentDate').val('');
    let currentDate = this.getDate(new Date());
    $('input[name="currentDate"]').val(currentDate);
  }
  getDate(date) {
    let year = date.getFullYear();
    let date1 = date.getDate();
    let months = date.getMonth();
    let month = this.getMonthFrom(months);
    var frstDay = date1 + '-' + month + '-' + year;
    return frstDay;
  }

  reverse() {
    let otpId = $('#otpId').val().toString();

    if (otpId == null || otpId == '' || otpId == undefined) {
      this.swal("Info", "Please enter OTP", 'info');
      return;
    }
    if (this.dataIdArray == '' || this.dataIdArray == undefined || this.dataIdArray == null || this.dataIdArray.length == 0) {
      this.swal('Info', 'Please select a payment for reversal', 'info');
      return;
    }
    let requestData = {
      userId: this.user.userId,
      fromDate: new Date(this.fromDate),
      toDate: new Date(this.toDate),
      userName: this.user.userName,
      otp: otpId,
      pymntList: this.dataIdArray
    };
    this.snoClaimService.reversePayment(requestData).subscribe(
      (data: any) => {
        let responseData = data;
        if (responseData.data.status == 'success') {
          this.swal('Success', 'Payment Reversed Successfully', 'success');
          this.timeleft = 0;
          this.closebutton1.nativeElement.click();
          // $('#exampleOtpModal').hide();
          this.getPaymentList();
          this.dataIdArray = [];
          this.show = false;
        } else {
          this.swal('Error', responseData.data.message, 'error');
        }
      },
      (error) => {
        console.log(error);
        this.swal('Error', 'Something went wrong.', 'error');
      }
    );
  }

  OnGenerateOtp() {
    if (this.dataIdArray == '' || this.dataIdArray == undefined || this.dataIdArray == null || this.dataIdArray.length == 0) {
      this.swal('Info', 'Please select a payment for reversal', 'info');
      return;
    }
    Swal.fire({
      title: 'Are You Sure?',
      text: 'The following payments will be reversed:- \n' + this.dataIdArray,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Reverse It!',
    }).then((result) => {
      if (result.isConfirmed) {
        $('#otpId').val("");
        $('#otpId').focus();
        let data = {
          "userName": this.user.userName,
        }
        this.service.forgotPassword(data).subscribe((response: any) => {
          response = this.encryptionService.getDecryptedData(response);
          this.userDetails = response.data;
          if (response.status == "success") {
            if (this.userDetails.status == "success") {
              this.hdbtn.nativeElement.click();
              $('#sendId').show();
              $('#reSendId').hide();
              $('#timerdivId').show();
              $('#timeCounter').show();
              $('#mobileNoId').show();
              $('#phoneId').show();
              $('#userId').val(this.userDetails.userName);

              let phoneNo = this.userDetails.phone;
              this.timeleft = 60;
              let downloadTimer = setInterval((res) => {
                if (this.timeleft <= 0) {
                  clearInterval(downloadTimer);
                  $('#sendId').hide();
                  $('#reSendId').show();
                  $('#timeCounter').hide();
                  $('#timerdivId').hide();
                  $('#mobileNoId').hide();
                  $('#phoneId').hide();
                } else {
                  $('#timeCounter').val(this.timeleft + " seconds remaining");
                  $('#mobileNoId').val("OTP is sent to your " + phoneNo + " mobile number");
                }
                this.timeleft -= 1;
              }, 1000);
              $('#exampleOtpModal').on('hidden.bs.modal', (result) => {
                this.timeleft = 0;
              });
            } else {
              this.timeleft = 0;
              this.closebutton1.nativeElement.click();
              // $('#exampleOtpModal').hide();
              this.swal('Warning', this.userDetails.message, 'warning');
            }
          } else {
            this.timeleft = 0;
            this.closebutton1.nativeElement.click();
            // $('#exampleOtpModal').hide();
            this.swal('Warning', response.message, 'warning');
          }
        });
      }
    });
  }

  onResendOtp() {
    $('#otpId').val("");
    $('#otpId').focus();
    let data = {
      "userName": this.user.userName,
    }
    this.service.forgotPassword(data).subscribe((response: any) => {
      response = this.encryptionService.getDecryptedData(response);
      this.userDetails = response.data;
      if (response.status == "success") {
        if (this.userDetails.status == "success") {
          $('#timeDivId').show();
          $('#sendId').show();
          $('#reSendId').hide();
          $('#timerdivId').show();
          $('#timeCounter').show();
          $('#mobileNoId').show();
          $('#phoneId').show();
          $('#userId').val(this.userDetails.userName);

          let phoneNo = this.userDetails.data.phone;
          this.timeleft = 60;
          let downloadTimer = setInterval((res) => {
            if (this.timeleft <= 0) {
              clearInterval(downloadTimer);
              $('#sendId').hide();
              $('#reSendId').show();
              $('#timeCounter').hide();
              $('#timerdivId').hide();
              $('#mobileNoId').hide();
              $('#phoneId').hide();
            } else {
              $('#timeCounter').val(this.timeleft + " seconds remaining");
              $('#mobileNoId').val("OTP is sent to your " + phoneNo + " mobile number");
            }
            this.timeleft -= 1;
          }, 1000);
          $('#exampleOtpModal').on('hidden.bs.modal', (result) => {
            this.timeleft = 0;
          });
        } else {
          this.timeleft = 0;
          this.closebutton1.nativeElement.click();
          this.swal('Warning', this.userDetails.message, 'error');
        }
      } else {
        this.timeleft = 0;
        this.closebutton1.nativeElement.click();
        this.swal('Warning', response.message, 'error');
      }
    });
  }

  closemodal() {
    this.timeleft = 0;
  }

  paymentdetails(claim) {
    let typeNumber = claim.paymentInfo;
    if (typeNumber == null || typeNumber == '' || typeNumber == undefined) {
      this.swal('Info', 'Please Select DD/CHEQUE/ET No.', 'info');
      return;
    }
    let requestData = {
      typeNumber: typeNumber,
      fromDate: new Date(this.fromDate),
      toDate: new Date(this.toDate),
    };
    this.snoClaimService.getPaidClaimList(requestData).subscribe(
      (data: any) => {
        let responseData = data;
        if (responseData.status == 'success') {
          this.claimList = responseData.data;
        } else {
          this.swal('Error', 'Something went wrong... Please try again later.', 'error');
        }
      },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      }
    );
  }

  viewDescription(descriptinDtls) {
    this.swal('', descriptinDtls, '');
  }

  report: any = [];
  sno: any = {
    SlNo: "",
    URN: "",
    ClaimNo: "",
    PatientName: "",
    HospitalDetails: "",
    InvoiceNo: "",
    PackageID: "",
    ActualDateofAdmission: "",
    ActualDateofDischarge: "",
    HospitalClaimAmount: "",
    CPDApprovedAmount: "",
    SNAApprovedAmount: "",
    CPDMortality: "",
    HospitalMortality: "",
    CPDClaimStatus: "",
    CPDRemarks: "",
    SNAClaimStatus: "",
    SNARemarks: "",
  };
  heading = [['Sl No', 'URN', 'Claim No.', 'Patient Name', 'Hospital Details',
    'Invoice No.', 'Package', 'Actual Date of Admission',
    'Actual Date of Discharge', 'Hospital Claim Amount',
    'CPD Approved Amount', 'SNA Approved Amount', 'CPD Mortality',
    'Hospital Mortality', 'CPD Claim Status', 'CPD Remarks', 'SNA Claim Status', 'SNA Remarks']];

  downloadReport(type: any) {
    this.report = [];
    if (type == 'excel') {
      let claim: any;
      for (var i = 0; i < this.claimList.length; i++) {
        claim = this.claimList[i];
        this.sno = [];
        this.sno.SlNo = i + 1;
        this.sno.URN = claim.urn != null ? claim.urn : "N/A";
        this.sno.ClaimNo = claim.claimNo != null ? claim.claimNo : "N/A";
        this.sno.PatientName = claim.patientName != null ? claim.patientName : "N/A";
        this.sno.HospitalDetails = claim.hospitalName + '(' + claim.hospitalCode + ')';
        this.sno.InvoiceNo = claim.invoiceNumber != null ? claim.invoiceNumber : "N/A";
        this.sno.PackageID = claim.packageName != null ? claim.packageName : "N/A";
        this.sno.ActualDateofAdmission = this.convertdatetostring(claim.actualDateOfAdmission);
        this.sno.ActualDateofDischarge = this.convertdatetostring(claim.actualDateOfDischarge);
        this.sno.HospitalClaimAmount = this.convertCurrency(claim.currentTotalAmount);
        this.sno.CPDApprovedAmount = this.convertCurrency(claim.cpdApprovedAmount);
        this.sno.SNAApprovedAmount = this.convertCurrency(claim.snaApprovedAmount);
        if (claim.mortality == 'Y') {
          this.sno.CPDMortality = 'Yes';
        } else if (claim.mortality == 'N') {
          this.sno.CPDMortality = 'No';
        } else {
          this.sno.CPDMortality = 'N/A';
        }
        if (claim.hospitalMortality == 'Y') {
          this.sno.HospitalMortality = 'Yes';
        } else if (claim.hospitalMortality == 'N') {
          this.sno.HospitalMortality = 'No';
        } else {
          this.sno.HospitalMortality = 'N/A';
        }
        this.sno.CPDClaimStatus = claim.cpdClaimStatus != null ? claim.cpdClaimStatus : "N/A";
        this.sno.CPDRemarks = claim.cpdRemarks != null ? claim.cpdRemarks : "N/A";
        this.sno.SNAClaimStatus = claim.snaClaimStatus != null ? claim.snaClaimStatus : "N/A";
        this.sno.SNARemarks = claim.snaRemarks != null ? claim.snaRemarks : "N/A";
        this.report.push(this.sno);
      }
      let filter1 = [];
      filter1.push([['Payment Date From:-', this.fromDate]]);
      filter1.push([['Payment Date To:-', this.toDate]]);
      TableUtil.exportListToExcelWithFilter(this.report, "Post Payment Claim List", this.heading, filter1);
    }
    else if (type == 'pdf') {
      if (this.claimList.length == 0) {
        this.swal('', 'No Data Found', 'info');
        return;
      }
      let SlNo = 1;
      this.claimList.forEach(element => {
        let rowData = [];
        rowData.push(SlNo);
        rowData.push(element.urn != null ? element.urn : "N/A");
        rowData.push(element.claimNo != null ? element.claimNo : "N/A");
        rowData.push(element.patientName != null ? element.patientName : "N/A");
        rowData.push(element.hospitalName + '(' + element.hospitalCode + ')');
        rowData.push(element.invoiceNumber != null ? element.invoiceNumber : "N/A");
        rowData.push(element.packageName != null ? element.packageName : "N/A");
        rowData.push(this.convertdatetostring(element.actualDateOfAdmission));
        rowData.push(this.convertdatetostring(element.actualDateOfDischarge));
        rowData.push(this.convertCurrency(element.currentTotalAmount));
        rowData.push(this.convertCurrency(element.cpdApprovedAmount));
        rowData.push(this.convertCurrency(element.snaApprovedAmount));
        if (element.mortality == 'Y') {
          rowData.push('Yes');
        } else if (element.mortality == 'N') {
          rowData.push('No');
        } else {
          rowData.push('N/A');
        }
        if (element.hospitalMortality == 'Y') {
          rowData.push('Yes');
        } else if (element.hospitalMortality == 'N') {
          rowData.push('No');
        } else {
          rowData.push('N/A');
        }
        rowData.push(element.cpdClaimStatus != null ? element.cpdClaimStatus : "N/A");
        rowData.push(element.cpdRemarks != null ? element.cpdRemarks : "N/A");
        rowData.push(element.snaClaimStatus != null ? element.snaClaimStatus : "N/A");
        rowData.push(element.snaRemarks != null ? element.snaRemarks : "N/A");
        this.report.push(rowData);
        SlNo++;
      })
      let doc = new jsPDF('l', 'mm', [238, 270]);
      doc.setFontSize(10);
      doc.text('Payment Date From:-' + this.fromDate, 5, 10);
      doc.text('Payment Date To:-' + this.toDate, 5, 15);
      doc.text('Document Generate Date :-' + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US'), 5, 20);
      doc.text('Post Payment List', 100, 45);
      doc.setLineWidth(0.7);
      doc.line(100, 46, 128, 46);
      autoTable(doc, {
        head: this.heading, body: this.report, startY: 48, theme: 'grid',
        styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
        bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
        columnStyles: {
          0: { cellWidth: 10 },
        }
      })
      doc.save('GJAY_Post Payment Claim List.pdf');
    }
  }
  convertdatetostring(date: any) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy');
    return date;
  }
  convertCurrency(amount: any) {
    var formatter = new CurrencyPipe('en-US');
    amount = formatter.transform(amount, '', '');
    return amount;
  }

  list: any = [];
  pymnt: any = {
    SlNo: "",
    paymentDate: "",
    paymentInfo: "",
    paymentType: "",
    bankName: "",
    paymentBy: "",
    finalAmount: "",
    actualPaidAmount: "",
    count: "",
  };
  heading1 = [['Sl No', 'Payment Date', 'DD/CHEQUE/ET No.', 'Payment Type', 'Bank Name',
    'Paid By', 'Final Amount (₹)', 'Actual Paid Amount (₹)', 'Total Claims']];

  downloadList(type: any) {
    this.list = [];
    if (type == 'excel') {
      let claim: any;
      for (var i = 0; i < this.paymentList.length; i++) {
        claim = this.paymentList[i];
        this.pymnt = [];
        this.pymnt.SlNo = i + 1;
        this.pymnt.paymentDate = this.convertdatetostring(claim.paymentDate);
        this.pymnt.paymentInfo = claim.paymentInfo != null ? claim.paymentInfo : "N/A";
        this.pymnt.paymentType = claim.paymentType != null ? claim.paymentType : "N/A";
        this.pymnt.bankName = claim.bankName != null ? claim.bankName : "N/A";
        this.pymnt.paymentBy = claim.paymentBy != null ? claim.paymentBy : "N/A";
        this.pymnt.finalAmount = this.convertCurrency(claim.finalAmount);
        this.pymnt.actualPaidAmount = this.convertCurrency(claim.actualPaidAmount);
        this.pymnt.count = claim.count.toString();
        this.list.push(this.pymnt);
      }
      let filter1 = [];
      filter1.push([['Payment Date From:-', this.fromDate]]);
      filter1.push([['Payment Date To:-', this.toDate]]);
      TableUtil.exportListToExcelWithFilter(this.list, "Post Payment Reversal List", this.heading1, filter1);
    }
    else if (type == 'pdf') {
      if (this.paymentList.length == 0) {
        this.swal('', 'No Data Found', 'info');
        return;
      }
      let SlNo = 1;
      this.paymentList.forEach(claim => {
        let rowData = [];
        rowData.push(SlNo);
        rowData.push(this.convertdatetostring(claim.paymentDate));
        rowData.push(claim.paymentInfo != null ? claim.paymentInfo : "N/A");
        rowData.push(claim.paymentType != null ? claim.paymentType : "N/A");
        rowData.push(claim.bankName != null ? claim.bankName : "N/A");
        rowData.push(claim.paymentBy != null ? claim.paymentBy : "N/A");
        rowData.push(this.convertCurrency(claim.finalAmount));
        rowData.push(this.convertCurrency(claim.actualPaidAmount));
        rowData.push(claim.count.toString());
        this.list.push(rowData);
        SlNo++;
      })
      let doc = new jsPDF('l', 'mm', [238, 270]);
      doc.setFontSize(10);
      doc.text('Payment Date From:-' + this.fromDate, 5, 20);
      doc.text('Payment Date To:-' + this.toDate, 5, 25);
      doc.text('Document Generate Date :-' + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US'), 5, 30);
      doc.text('Post Payment Reversal List', 100, 10);
      doc.setLineWidth(0.4);
      doc.line(100, 10, 145, 10);
      autoTable(doc, {
        head: this.heading1, body: this.list, startY: 40, theme: 'grid',
        // styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
        bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: { fillColor: [26, 99, 54] },
        columnStyles: {
          0: { cellWidth: 10 },
        }
      })
      doc.save('GJAY_Post Payment Reversal List.pdf');
    }
  }

}
