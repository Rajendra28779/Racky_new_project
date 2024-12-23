import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SnamasterserviceService } from '../../Services/snamasterservice.service';
import { HeaderService } from '../../header.service';
import Swal from 'sweetalert2';
import { ReportcountService } from '../../Services/reportcount.service';
import { PaymentfreezeserviceService } from '../../Services/paymentfreezeservice.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-old-claim-payment-freeze',
  templateUrl: './old-claim-payment-freeze.component.html',
  styleUrls: ['./old-claim-payment-freeze.component.scss']
})
export class OldClaimPaymentFreezeComponent implements OnInit {

  fileName: any;
  fileToUpload?: File;
  childmessage: any;
  user: any;
  public stateList: any = [];
  public districtList: any = [];
  public hospitalList: any = [];
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

  constructor(
    public headerService: HeaderService,
    private reportCount: ReportcountService,
    private pymntFrzSrvc: PaymentfreezeserviceService,
    private snamasterService: SnamasterserviceService,
    public route: Router,private sessionService: SessionStorageService
  ) {}

  ngOnInit(): void {
    // dynamic title
    this.user = this.sessionService.decryptSessionData("user");
    this.headerService.setTitle('Old Claim Payment Freeze');
    // localStorage.removeItem("click");
    // localStorage.removeItem("click1");
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
    this.getStateList();

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
    let months: any = date.getMonth();
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

    this.getCountDetails();
  }
  getCountDetails() {
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

    this.fromDate = fromDate;
    this.toDate = toDate;
    this.summary = '';
    let requestData = {
      userId: userId,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      stateId: stateId,
      districtId: districtId,
      hospitalId: hospitalId
    };
    this.reportCount.getPaymentFreezeOldReport(requestData).subscribe(
      (data) => {
        this.summary = data;
        // this.totalCount = this.summary.snaapproved + this.summary.cpdapproved;
        // this.totalAmount = parseFloat(this.summary.snoamount) + parseFloat(this.summary.cpdamount);
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
    let hospitalId = this.hospital
    var Image = this.fileToUpload;

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
        this.pymntFrzSrvc.paymentFreezeOldAction(formData).subscribe(
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

}
