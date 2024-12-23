import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderService } from 'src/app/application/header.service';
import { CpdPaymentReportService } from 'src/app/application/Services/cpd-payment-report.service';
import { SnoCLaimDetailsService } from 'src/app/application/Services/sno-claim-details.service';
import { SnocreateserviceService } from 'src/app/application/Services/snocreateservice.service';
import Swal from 'sweetalert2';
declare let $: any;
@Component({
  selector: 'app-cpd-post-payment',
  templateUrl: './cpd-post-payment.component.html',
  styleUrls: ['./cpd-post-payment.component.scss'],
})
export class CpdPostPaymentComponent implements OnInit {
  txtsearchDate: any;
  cpdList: any = [];

  constructor(
    public headerService: HeaderService,
    private userService: SnocreateserviceService,
    private paymentReportService: CpdPaymentReportService,
    public snoService: SnoCLaimDetailsService
  ) {}

  ngOnInit(): void {
    this.headerService.setTitle('CPD Post Payment Update');
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
    $('.selectpicker').selectpicker();
    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      // endDate: '0d',
      minDate: new Date(),
      daysOfWeekDisabled: ['', 7],
    });
    this.getMonth();
    this.date = new Date();
    let monthId = this.date.getMonth();
    let checkMonth = monthId.toString();
    if (checkMonth.length == 1) {
      this.month = '0' + monthId;
    } else {
      this.month = monthId;
    }
    this.year = this.date.getFullYear();

    this.getBankMode();
    this.getBankList();
  }
  responseData: any;
  selectedMonth: any;
  selectedYear: any;
  checkDisable:boolean = false;
  onClickSearch() {
    this.cpdList = [];
    let cpdLists = [];
    let paidCPDArray = [];
    $('#allCheck').prop('checked', false);
    this.selectedMonth = $('#month').val();
    this.selectedYear = $('#year').val();
    this.paymentReportService
      .getPaymentcpdList(this.selectedMonth, this.selectedYear)
      .subscribe(
        (response) => {
          this.responseData = response;
          console.log(this.responseData);
          if (this.responseData.status == 'success') {
            let details = JSON.parse(this.responseData.details);
            cpdLists = details.allCPDArray;
            paidCPDArray = details.paidCPDArray;
            console.log(cpdLists);
            console.log(paidCPDArray);
            cpdLists.forEach((element) => {
              element.statusView = false;
              element.status = 1;
              paidCPDArray.forEach((element1) => {
                if (element.cpdUserId == element1.cpdUserId) {
                  element.statusView = true;
                  element.status = 0;
                }
              });
              this.cpdList.push(element);
            });
            if (cpdLists.length == paidCPDArray.length) {
              $('#allCheck').prop('checked', true);
              this.checkDisable = true;
            } else {
              $('#allCheck').prop('checked', false);
              this.checkDisable = false;
            }
          } else {
            this.swal('Error', 'Something went wrong.', 'error');
          }
        },
        (error) => {
          console.log(error);
          this.swal('Error', 'Something went wrong.', 'error');
        }
      );
  }
  resetField() {
    window.location.reload();
  }
  months: any = [];
  yearList: any = [];
  monthList: any = [];
  year: any;
  date: any;
  month: any;
  getMonth() {
    this.userService.getMonths().subscribe(
      (response) => {
        this.months = response;
        console.log(this.months);
        this.userService.getYears().subscribe(
          (data) => {
            this.yearList = data;
            console.log(data);
            this.monthList = [];
            for (var i = 0; i < this.months.length; i++) {
              if (this.year == this.date.getFullYear()) {
                if (this.months[i].index < this.date.getMonth()) {
                  this.monthList.push(this.months[i]);
                }
              } else {
                this.monthList.push(this.months[i]);
              }
            }
          },
          (error) => console.log(error)
        );
      },
      (error) => console.log(error)
    );
  }
  getCountDetails() {
    this.monthList = [];
    for (var i = 0; i < this.months.length; i++) {
      if (this.year == this.date.getFullYear()) {
        if (this.months[i].index <= this.date.getMonth()) {
          this.monthList.push(this.months[i]);
        }
      } else {
        this.monthList.push(this.months[i]);
      }
    }

    if (this.year == this.date.getFullYear()) {
      if (parseInt(this.month) - 1 > this.date.getMonth()) {
        let monthId = this.date.getMonth() + 1;
        let checkMonth = monthId.toString();
        if (checkMonth.length == 1) {
          this.month = '0' + monthId;
        } else {
          this.month = monthId;
        }
      }
    }
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  show: any = false;
  tdCheck(event: any, cpdUserId) {
    if (event.target.checked) {
      this.dataIdArray.push(cpdUserId);
    } else {
      for (let i = 0; i < this.dataIdArray.length; i++) {
        if (this.dataIdArray[i] == cpdUserId) {
          this.dataIdArray.splice(i, 1);
        }
      }
    }
    if (this.dataIdArray.length == this.cpdList.length) {
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
  dataIdArray: any = [];
  checkAllCheckBox(event: any) {
    // Angular 13
    if (event.target.checked) {
      for (let i = 0; i < this.cpdList.length; i++) {
        $('#' + this.cpdList[i].cpdUserId).prop('checked', true);
        this.dataIdArray.push(this.cpdList[i].cpdUserId);
      }
    } else {
      for (let i = 0; i < this.cpdList.length; i++) {
        $('#' + this.cpdList[i].cpdUserId).prop('checked', false);
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
  selectedCPdList: any = [];
  initializePayment() {
    this.selectedCPdList = [];
    this.totalPaidAmount = 0;
    this.cpdList.forEach((element) => {
      this.dataIdArray.forEach((element1) => {
        if (element.cpdUserId == element1) {
          let amount = parseFloat(element.finalAmount);
          this.totalPaidAmount = this.totalPaidAmount + amount;
          let data = {
            CPD_USERID: element.cpdUserId,
            FINAL_AMOUNT: element.finalAmount,
          };
          this.selectedCPdList.push(data);
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
  @ViewChild('closebutton') closebutton;
  currentDate: any;
  submitPayment() {
    let bankModeId = $('#bankModeId').val();
    let typeNumber = $('#typeNumber').val();
    let bankId = $('#bankId').val();
    this.currentDate = $('#currentDate').val();
    if (bankModeId == '' || bankModeId == undefined || bankModeId == null) {
      this.swal('', 'Please Select Paid By', 'info');
      return;
    }
    if (typeNumber == '' || typeNumber == undefined || typeNumber == null) {
      this.swal('', 'Please Enter DD/CHEQUE/ET No.', 'info');
      return;
    }
    if (bankModeId != '1') {
      if (typeNumber.length < 6) {
        this.swal('', 'Please Enter 6 digit DD/CHEQUE/ET No.', 'info');
        return;
      }
      if (bankId == '' || bankId == undefined || bankId == null) {
        this.swal('', 'Please Select Bank Name', 'info');
        return;
      }
    }
    if (
      this.currentDate == '' ||
      this.currentDate == undefined ||
      this.currentDate == null
    ) {
      this.swal('', 'Please Select Current Date', 'info');
      return;
    }
    let requestData = {
      bankModeId: bankModeId,
      typeNumber: typeNumber.trim(),
      bankId: bankId,
      cpdList: this.selectedCPdList,
      currentDate: new Date(this.currentDate),
      totalPaidAmount: this.totalPaidAmount,
      month: this.selectedMonth,
      year: this.selectedYear,
    };
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
        this.paymentReportService.updatePayment(requestData).subscribe(
          (data: any) => {
            let responseData = data;
            if (responseData.status == 'success') {
              if (responseData.data.status == 'success') {
                this.closebutton.nativeElement.click();
                Swal.fire({
                  title: 'Success',
                  text: 'Updated Successfully',
                  icon: 'success',
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: 'Ok',
                }).then((result) => {
                  this.onClickSearch();
                  this.dataIdArray = [];
                  this.show = false;
                });
              } else if (responseData.data.status == 'exists') {
                this.closebutton.nativeElement.click();
                Swal.fire({
                  title: '',
                  text: responseData.data.message,
                  icon: 'info',
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: 'Ok',
                }).then((result) => {
                  this.onClickSearch();
                  this.dataIdArray = [];
                  this.show = false;
                });
              } else {
                this.swal(
                  '',
                  'Something went wrong... Please try again later.',
                  'error'
                );
              }
              // $('#postpaymentModal').hide();
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
  cancel() {}
  bankMode: any = [];
  getBankMode() {
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
  bankList: any = [];
  getBankList() {
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
  showStar: boolean = true;
  totalPaidAmount: any;
  getMode() {
    let bankModeId = $('#bankModeId').val();
    if (bankModeId == '1') {
      this.showStar = false;
    } else {
      this.showStar = true;
    }
  }
  approved_Amount(event: KeyboardEvent) {
    const pattern = /^[0-9\b]+$/;
    //var regex = new RegExp("^[A-Za-z0-9.,-\\s]+$");
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }
  getValidNo(event) {
    const pattern = /^\S*$/;
    //var regex = new RegExp("^[A-Za-z0-9.,-\\s]+$");
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }
  checkAmount() {
    let paidAmount = Number($('#paidamount').val());
    let totalAmount = Number(this.totalPaidAmount);
    if (paidAmount > totalAmount) {
      let lessAmount = paidAmount - totalAmount;
      this.swal(
        '',
        'You are Entering ₹ ' +
          lessAmount +
          ' higher amount than Approved Amount.',
        'info'
      );
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
}
