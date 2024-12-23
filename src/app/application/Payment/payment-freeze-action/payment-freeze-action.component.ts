import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { PaymentfreezeserviceService } from '../../Services/paymentfreezeservice.service';
import { ReportcountService } from '../../Services/reportcount.service';
import { SnamasterserviceService } from '../../Services/snamasterservice.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { PackageDetailsMasterService } from '../../Services/package-details-master.service';
declare let $: any;

@Component({
  selector: 'app-payment-freeze-action',
  templateUrl: './payment-freeze-action.component.html',
  styleUrls: ['./payment-freeze-action.component.scss']
})
export class PaymentFreezeActionComponent implements OnInit {

  fileName: any;
  fileToUpload?: File;
  childmessage: any;
  user: any;
  claimCount: any;
  public stateList: any = [];
  public districtList: any = [];
  public hospitalList: any = [];
  fromDate: any;
  toDate: any;
  hospitalId: any = '';
  districtId: any = '';
  stateId: any = '';
  mortality: any;
  keyword: any = "hospitalName";
  keyword1: any = "districtname";
  keyword2: any = "stateName";
  totalAmount: number;
  totalCount: number;
  search: any;
  @ViewChild('auto') auto;
  @ViewChild('auto1') auto1;
  @ViewChild('auto2') auto2;
  constructor(private sessionService: SessionStorageService,public fb: FormBuilder, private snamasterService: SnamasterserviceService, private pymntFrzSrvc: PaymentfreezeserviceService,
    private reportCount: ReportcountService, public headerService: HeaderService, public route: Router,
    private encryptionService: EncryptionService, public packageDetailsMasterService: PackageDetailsMasterService) { }

  ngOnInit(): void {
    this.getSchemeData();
    this.headerService.setTitle('Payment Freeze Action');
    this.headerService.isIndicate(false);
    this.headerService.isBack(true);
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
      format: 'YYYY-MM-DD LT',
      daysOfWeekDisabled: ['', 7],
    });
    var date = new Date();

    let year = date.getFullYear();
    let date1 = '01';
    let month: any = date.getMonth();

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
    var frstDay = date1 + '-' + month + '-' + year;
    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr('placeholder', 'From Date *');

    // $('input[name="toDate"]').val('');
    $('input[name="toDate"]').attr('placeholder', 'To Date *');
    this.getStateList();
    this.getCountDetails();
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
    this.auto1.clear();
    this.auto.clear();
    this.districtId = '';
    this.hospitalId = '';
    this.auto.clear();
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
    this.hospitalId = '';
    this.auto.clear();
    var stateCode = localStorage.getItem("stateCode");
    this.snamasterService.getHospitalbyDistrictId(this.user.userId, id, stateCode).subscribe(
      (response) => {
        this.hospitalList = response;
      },
      (error) => console.log(error)
    )
  }

  selectEvent(item) {
    // do something with selected item
    this.hospitalId = item.hospitalCode;
  }

  clearEvent() {
    this.hospitalId = '';
  }

  selectEvent1(item) {
    // do something with selected item
    this.districtId = item.districtcode;
    this.OnChangeDistrict(this.districtId);
  }

  clearEvent1() {
    this.districtId = '';
    this.OnChangeDistrict(this.districtId);
  }

  selectEvent2(item) {
    // do something with selected item
    this.stateId = item.stateCode;
    this.OnChangeState(this.stateId);
  }

  clearEvent2() {
    this.stateId = '';
    this.OnChangeState(this.stateId);
  }

  getCountDetails() {
    let userId = this.user.userId;
    let fromDate = $('#formdate').val();
    let toDate = $('#todate').val();
    let stateId = this.stateId;
    let districtId = this.districtId;
    let hospitalId = this.hospitalId;
    let mortality = $('#mortality').val();
    let Search = $('#search').val();
    let schemecategoryid = this.schemecategoryidvalue;
    if (schemecategoryid == null || schemecategoryid == undefined || schemecategoryid == '') {
      schemecategoryid = "";
    } else {
      schemecategoryid = schemecategoryid;
    }
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
    if (Date.parse(fromDate) < Date.parse('01-Jan-2023')) {
      if (Date.parse(toDate) >= Date.parse('01-Jan-2023')) {
        this.swal('Info', 'Please select To Date before 01-Jan-2023', 'info');
        return;
      }
    }

    this.fromDate = fromDate;
    this.toDate = toDate;
    this.mortality = mortality;
    this.claimCount = '';
    this.search=Search;
    let requestData = {
      userId: userId,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      stateId: stateId,
      districtId: districtId,
      hospitalId: hospitalId,
      mortality: mortality,
      searchtype: Search,
      schemecategoryid:schemecategoryid
    };
    this.reportCount.getPaymentFreezeReport(requestData).subscribe(
      (data) => {
        this.claimCount = data;
        this.totalCount = this.claimCount.snaapproved + this.claimCount.cpdapproved;
        this.totalAmount = parseFloat(this.claimCount.snoamount) + parseFloat(this.claimCount.cpdamount);
      },
      (error) => {
        console.log(error);
        this.swal('Error', 'Something went wrong.', 'error');
      }
    );
  }

  paymentFreeze() {
    let userId = this.user.userId;
    let fromDate = this.fromDate;
    let toDate = this.toDate
    let stateId = this.stateId;
    let districtId = this.districtId;
    let hospitalId = this.hospitalId;
    let mortality = this.mortality;
    var Image = this.fileToUpload;
    var searchtype=this.search;
    let schemecategoryid = this.schemecategoryidvalue;
    if (schemecategoryid == null || schemecategoryid == undefined || schemecategoryid == '') {
      schemecategoryid = "";
    } else {
      schemecategoryid = schemecategoryid;
    }
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
    if (Date.parse(fromDate) < Date.parse('01-Jan-2023')) {
      if (Date.parse(toDate) >= Date.parse('01-Jan-2023')) {
        this.swal('Info', 'Please select To Date before 01-Jan-2023', 'info');
        return;
      }
    }

    Swal.fire({
      title: 'Are You Sure?',
      text: this.fileToUpload?'You want to Freeze this payment!':'You want to Freeze this payment without Uploading the Float Report!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Freeze it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const formData: FormData = new FormData();
        formData.append('file', Image);
        formData.append('userId', userId);
        formData.append('fromDate', fromDate);
        formData.append('toDate', toDate);
        formData.append('stateId', stateId);
        formData.append('districtId', districtId);
        formData.append('hospitalId', hospitalId);
        formData.append('mortality', mortality);
        formData.append('amount', this.totalAmount.toString());
        formData.append('searchtype',this.search);
        formData.append('schemecategoryid',schemecategoryid);
        this.pymntFrzSrvc.paymentFreezeAction(formData).subscribe(
          (data) => {
            if(data.status=='success') {
              this.swal('Success', 'Payment Has Been Freezed', 'success');
              this.getCountDetails();
              $('#bannkpass').val('');
              this.fileToUpload = null;
              this.fileName = '';
            } else {
              this.swal('Error', 'Some error happened', 'error');
            }
          }
        );
      }
    });
  }

  resetTable() {
    window.location.reload();
  }

  handleFileInput(event: any) {
    this.fileToUpload = event.target.files[0];
    if(Math.round(this.fileToUpload.size / 1024) >= 10000){
      this.swal('Warning', ' Please Upload File with Size Less than 10MB', 'warning');
      $('#bannkpass').val('');
      this.fileToUpload = null;
      this.fileName = '';
    } else {
      this.fileName = this.fileToUpload.name;
    }
  }

  downloadfiletreatmentbill() {
    if (this.fileToUpload) {
      const file: File | null = this.fileToUpload;
      if (file) {
        let documentType: any = file.type;
        const blob = new Blob([file], { type: documentType });
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      }
    } else {
      this.swal('Info', 'Please Select File', 'info');
    }
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }


  ///scheme
  scheme: any = [];
  schemeidvalue: any = 1;
  schemeName: any = ''
  getSchemeData() {
    let data = {
      action: 'A',
      schemeId: 1,
      schemeCategoryId: '',
    };
    let encData = this.encryptionService.encryptRequest(data);
    this.packageDetailsMasterService.getSchemeDetails(encData).subscribe((res: any) => {
      let resData = this.encryptionService.getDecryptedData(res);
      if (resData.status == 'success') {
        this.scheme = resData.data;
        for (let i = 0; i < this.scheme.length; i++) {
          this.schemeidvalue = this.scheme[i].schemeId;
          this.schemeName = this.scheme[i].schemeName;
        }
        this.getSchemeDetails();

      } else {
        this.swal('', 'Something went wrong.', 'error');
      }
    },
      (error) => {
        this.swal('', 'Something went wrong.', 'error');
      });
  }

  schemeList: any = [];
  getSchemeDetails() {
    let data = {
      action: 'B',
      schemeId: 1,
      schemeCategoryId: '',
    };
    let encData = this.encryptionService.encryptRequest(data);
    this.packageDetailsMasterService.getSchemeDetails(encData).subscribe((res: any) => {
      let resData = this.encryptionService.getDecryptedData(res);
      if (resData.status == 'success') {
        this.schemeList = resData.data;
      } else {
        this.swal('', 'Something went wrong.', 'error');

      }
    },
      (error) => {
        this.swal('', 'Something went wrong.', 'error');
      });
  }

  schemecategoryidvalue: any
  schemecategoryName: any;
  getschemacategoryid(event: any) {
    if (event != null && event != undefined && event != '' && event != "") {
      for (let i = 0; i < this.schemeList.length; i++) {
        if (event == this.schemeList[i].schemeCategoryId)
          this.schemecategoryidvalue = this.schemeList[i].schemeCategoryId;
        this.schemecategoryName = this.schemeList[i].categoryName;
      }
    } else {
      this.schemecategoryidvalue = '';
      this.schemecategoryName = "All"
    }
  }
}