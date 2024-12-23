import { Component, OnInit, ViewChild } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { SnoCLaimDetailsService } from '../../Services/sno-claim-details.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { HeaderService } from '../../header.service';
import { SnamasterserviceService } from '../../Services/snamasterservice.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;
import 'datatables.net';

@Component({
  selector: 'app-old-claim-post-payment',
  templateUrl: './old-claim-post-payment.component.html',
  styleUrls: ['./old-claim-post-payment.component.scss']
})
export class OldClaimPostPaymentComponent implements OnInit {

  stateId: any = '';
  districtId: any = '';
  hospital: any = '';
  placeHolder = "Select Hospital";
  stateList: any = [];
  stateData: any = [];
  districtList: any = [];
  user: any;
  hospitalList: any = [];
  stateCode: any;
  distCode: any;
  userId: any;
  months: any;
  year: any;
  months2: any;
  frstDay: string;
  secoundDay: string;
  public snoList: any = [];
  keyword: any = 'fullName';
  snoUserId: any;
  selectedItems: any = [];
  paymentList: any = [];
  showPegi: boolean;
  pageElement: any;
  currentPage: any;
  txtsearchDate: any;
  // dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  dropdownSettings: IDropdownSettings = {};
  hospObj: any;
  hospList: any = [];
  showStar: boolean = true;
  disabled: boolean = false;
  selectedValue: "";
  showview: boolean = false;

  @ViewChild('closebutton') closebutton;
  constructor(
    public headerService: HeaderService,
    public snoService: SnoCLaimDetailsService,
    private snamasterService: SnamasterserviceService,
    private snoConfigService: SnocreateserviceService,
    private sessionService: SessionStorageService
  ) { }

  ngOnInit(): void {
    this.headerService.setTitle('Old Claim Post Payment List');
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
    this.getStateList();
    this.getBankMode();
    this.getBankList();
    if(this.user.groupId != 4){
      this.getSNOList();
      this.showview = false;
    }else{
      this.snoList = [{
        fullName:this.user.fullName
      }]
      this.selectedValue = this.snoList[0];
      this.disabled = true;
      this.snoUserId = this.user.userId;
      this.showview = true;
      this.getPostPaymentList();
    }

    // this.getPostPaymentList();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'hospitalCode',
      textField: 'hospitalName',
      itemsShowLimit: 5,
      allowSearchFilter: true,
      selectAllText: 'Select All',
      unSelectAllText: "Un-Select All",
    };
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
  getStateList() {
    this.snamasterService.getStateList(this.user.userId).subscribe(
      (response) => {
        this.stateList = response;
      },
      (error) => console.log(error)
    )
  }
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
  OnChangeState(id) {
    $('#districtId').val('');
    $('#hospital').val('');
    this.districtId = '';
    this.hospital = '';
    this.hospitalList = [];
    this.hospList = [];
    this.selectedItems = [];
    localStorage.setItem("stateCode", id);
    this.snamasterService.getDistrictListByStateId(this.user.userId, id).subscribe(
      (response) => {
        this.districtList = response;
      },
      (error) => console.log(error)
    )
  }
  // getDistrict(code) {
  //   this.stateCode = code;
  //   this.snoService
  //     .getDistrictListByStateCode(this.stateCode)
  //     .subscribe((data) => {
  //       this.distList = data;
  //       this.distList.sort((a, b) =>
  //         a.districtname.localeCompare(b.districtname)
  //       );
  //     });
  // }
  OnChangeDistrict(id) {
    this.hospital = '';
    $('#hospital').val('');
    this.selectedItems = [];
    this.hospitalList = [];
    this.hospList = [];
    var stateCode = localStorage.getItem("stateCode");
    this.snamasterService.getHospitalbyDistrictId(this.user.userId, id, stateCode).subscribe(
      (response) => {
        this.hospitalList = response;
      },
      (error) => console.log(error)
    )
  }
  // getHospital(code) {
  //   this.distCode = code;
  //   this.snoServicebox
  //     .getHospitalByDistCode(this.stateCode, this.distCode)
  //     .subscribe((data) => {
  //       this.hospitalList = data;
  //     });
  // }
  pageItemChange() {
    this.pageElement = $('#pageItem').val();
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
  responseData: any;
  fromDate: any;
  toDate: any;
  record: any;
  hospcodearr: any
  getPostPaymentList() {
    this.hospcodearr = []
    for (var i = 0; i < this.hospList.length; i++) {
      this.hospcodearr.push(parseInt(this.hospList[i].hospitalCode))
    }
    this.fromDate = $('#datepicker1').val();
    this.toDate = $('#datepicker2').val();
    if (Date.parse(this.fromDate) > Date.parse(this.toDate)) {
      this.swal('', 'From Date should be less than To Date', 'error');
      return;
    }
    if (this.snoUserId == '' || this.snoUserId == null || this.snoUserId == undefined) {
      this.swal('', 'Please Select SNA Doctor Name', 'info');
      return;
    }
    // if(this.stateId == '' || this.stateId == null || this.stateId==undefined) {
    //   this.swal('', 'Please Select State', 'info');
    //   return;
    // }
    // if(this.distId == '' || this.distId == null || this.distId==undefined) {
    //   this.swal('', 'Please Select District', 'info');
    //   return;
    // }
    // if(this.hospitalId == '' || this.hospitalId == null || this.hospitalId==undefined) {
    //   this.swal('', 'Please Select Hospital', 'info');
    //   return;
    // }
    let requestData = {
      userId: this.snoUserId,
      fromDate: new Date(this.fromDate),
      toDate: new Date(this.toDate),
      stateId: this.stateId,
      districtId: this.districtId,
      hospitalCodeArr: this.hospcodearr,
    };
    this.snoService.getOldPostPaymentList(requestData).subscribe(
      (response) => {
        this.responseData = response;
        this.paymentList = this.responseData;
        this.record = this.paymentList.length;
        this.dtTrigger.next(null);
        if (this.record > 0) {
          this.showPegi = true;
        } else {
          this.showPegi = false;
          // this.swal('', 'Record not found.', 'info');
        }
        // } else {
        //   this.swal('', 'Something went wrong.', 'error');
        // }
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
    if (event.target.checked) {
      for (let i = 0; i < this.paymentList.length; i++) {
        $('#' + this.paymentList[i].transid).prop('checked', true);
        this.dataIdArray.push(this.paymentList[i].transid);
      }
    } else {
      for (let i = 0; i < this.paymentList.length; i++) {
        $('#' + this.paymentList[i].transid).prop('checked', false);
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
  tdCheck(event: any, transid) {
    if (event.target.checked) {
      this.dataIdArray.push(transid);
    } else {
      for (let i = 0; i < this.dataIdArray.length; i++) {
        if (this.dataIdArray[i] == transid) {
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
        if (element.transid == element1) {
          if (element.snaApprovedAmount != undefined && element.snaApprovedAmount != null && element.snaApprovedAmount != '') {
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
  currentDate: any;
  maxChars = 5;
  submitPayment() {
    let bankModeId = $('#bankModeId').val();
    let typeNumber = $('#typeNumber').val();
    let bankId = $('#bankId').val();
    let paidamount = $('#paidamount').val();
    this.currentDate = $('#currentDate').val();
    if (paidamount == '' || paidamount == undefined || paidamount == null) {
      this.swal('', 'Please Enter Paid Amount', 'info');
      return;
    }
    if (paidamount.startsWith('.')) {
      this.swal('', 'Please Enter Valid Paid Amount', 'info');
      return;
    }
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
    if (this.currentDate == '' || this.currentDate == undefined || this.currentDate == null) {
      this.swal('', 'Please Select Current Date', 'info');
      return;
    }
    let requestData = {
      userId: this.user.userId,
      bankModeId: bankModeId,
      typeNumber: typeNumber.trim(),
      bankId: bankId,
      claimList: this.dataIdArray,
      currentDate: new Date(this.currentDate),
      totalPaidAmount: this.totalPaidAmount,
      paidAmount: paidamount
    };
    Swal.fire({
      title: 'Are You Sure?',
      text: 'You want to Update the payment!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Update It!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.snoService.updateOldPayment(requestData).subscribe(
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
                  this.getPostPaymentList();
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
                  this.getPostPaymentList();
                  this.dataIdArray = [];
                  this.show = false;
                });
              }
              else {
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
  cancel() {
    $('#bankModeId').val('');
    $('#typeNumber').val('');
    $('#bankId').val('');
  }
  // getSNOList() {
  //   this.snoConfigService.getSNODetails().subscribe(
  //     (response) => {
  //       this.snoList = response;
  //     },
  //     (error) => console.log(error)
  //   )
  // }
  getSNOList() {
    let userid = this.user.userId;
    this.snoConfigService.getSNOListByExecutive(userid).subscribe(
      (response) => {
        this.responseData = response;
        if (this.responseData.status == 'success') {
          this.snoList = JSON.parse(this.responseData.data);
        } else {
          this.swal('', 'Something went wrong.', 'error');
        }
      },
      (error) => console.log(error)
    );
  }
  clearEvent() {
    this.snoUserId = '';
    $("#statecode1").val("");
    $("#distcode1").val("");
    this.selectedItems = [];
  }
  selectEvent(item) {
    // do something with selected item
    this.snoUserId = item.snaUserId;
    // $("#statecode1").val("");
    // $("#distcode1").val("");
    // this.selectedItems = [];
    // this.getPostPaymentList();
  }

  dtls: any;
  viewDescription(descriptinDtls) {
    this.swal('',descriptinDtls,'');
    // this.dtls = descriptinDtls;
    // $('#appealDisposal').show();
  }
  modalClose() {
    $('#appealDisposal').hide();
  }

  onItemSelect(item) {
    this.hospObj = {
      stateCode: "",
      stateName: "",
      districtCode: "",
      districtName: "",
      hospitalCode: "",
      hospitalName: ""
    }
    this.hospObj.stateCode = this.stateId;
    for (var i = 0; i < this.stateList.length; i++) {
      if (this.hospObj.stateCode == this.stateList[i].stateCode) {
        this.hospObj.stateName = this.stateList[i].stateName;
      }
    }
    this.hospObj.districtCode = this.districtId;
    for (var i = 0; i < this.districtList.length; i++) {
      if (this.hospObj.districtCode == this.districtList[i].districtcode) {
        this.hospObj.districtName = this.districtList[i].districtname;
      }
    }
    this.hospObj.hospitalCode = item.hospitalCode;
    for (var i = 0; i < this.hospitalList.length; i++) {
      if (this.hospObj.hospitalCode == this.hospitalList[i].hospitalCode) {
        this.hospObj.hospitalName = this.hospitalList[i].hospitalName;
      }
    }

    var stat: boolean = false;
    for (const i of this.hospList) {
      if (i.hospitalCode == this.hospObj.hospitalCode) {
        stat = true;
      }
    }
    if (stat == false) {
      this.hospList.push(this.hospObj);
    }
  }
  onSelectAll(list) {
    console.log(list);
    for (var x = 0; x < list.length; x++) {
      let item = list[x];
      this.hospObj = {
        stateCode: "",
        stateName: "",
        districtCode: "",
        districtName: "",
        hospitalCode: "",
        hospitalName: ""
      }
      this.hospObj.stateCode = this.stateId;
      for (var i = 0; i < this.stateList.length; i++) {
        if (this.hospObj.stateCode == this.stateList[i].stateCode) {
          this.hospObj.stateName = this.stateList[i].stateName;
        }
      }
      this.hospObj.districtCode = this.districtId;
      for (var i = 0; i < this.districtList.length; i++) {
        if (this.hospObj.districtCode == this.districtList[i].districtcode) {
          this.hospObj.districtName = this.districtList[i].districtname;
        }
      }
      this.hospObj.hospitalCode = item.hospitalCode;
      for (var i = 0; i < this.hospitalList.length; i++) {
        if (this.hospObj.hospitalCode == this.hospitalList[i].hospitalCode) {
          this.hospObj.hospitalName = this.hospitalList[i].hospitalName;
        }
      }
      console.log(this.hospObj);

      var stat: boolean = false;
      for (const i of this.hospList) {
        if (i.hospitalCode == this.hospObj.hospitalCode) {
          stat = true;
        }
      }
      if (stat == false) {
        this.hospList.push(this.hospObj);
      }
    }
  }

  onItemDeSelect(item) {
    console.log(item);
    for (var i = 0; i < this.hospList.length; i++) {
      if (item.hospitalCode == this.hospList[i].hospitalCode) {
        var index = this.hospList.indexOf(this.hospList[i]);
        if (index !== -1) {
          this.hospList.splice(index, 1);
        }
      }
    }
  }

  onDeSelectAll(list) {
    //this.onDeSelectAll.emit(this.emittedValue(this.selectedItems));
    // for(var x=0;x<list.length;x++) {
    //   let item = list[x];
    //   for(var i=0;i<this.hospList.length;i++) {
    //     if(item.hospitalCode==this.hospList[i].hospitalCode) {
    //       var index = this.hospList.indexOf(this.hospList[i]);
    //       if (index !== -1) {
    //         this.hospList.splice(index, 1);
    //       }
    //     }
    //   }
    // }
    this.hospList = [];
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
  getMode() {
    let bankModeId = $('#bankModeId').val();
    if (bankModeId == '1') {
      this.showStar = false;
    } else {
      this.showStar = true;
    }
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

}
