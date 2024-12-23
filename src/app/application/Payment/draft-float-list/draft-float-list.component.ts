import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderService } from '../../header.service';
import { PaymentfreezeserviceService } from '../../Services/paymentfreezeservice.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import Swal from 'sweetalert2';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FormControl, FormGroup } from '@angular/forms';
declare let $: any;

@Component({
  selector: 'app-draft-float-list',
  templateUrl: './draft-float-list.component.html',
  styleUrls: ['./draft-float-list.component.scss'],
})
export class DraftFloatListComponent implements OnInit {
  Status: any;
  public snoList: any = [];
  keyword: any = 'fullName';
  snoUserId: any;
  txtsearchDate: any;
  DraftList: any = [];
  currentPage: any;
  pageElement: any;
  user: any;
  showPegi: boolean;
  record: any;
  show: boolean = false;
  secoundDay: string;

  months: any;
  year: any;
  months2: any;
  frstDay: string;
  constructor(
    public headerService: HeaderService,
    public paymentfreezeService: PaymentfreezeserviceService,
    private snoConfigService: SnocreateserviceService,
    private sessionService: SessionStorageService,
    public route: Router
  ) {}

  ngOnInit(): void {
    this.Status = 'A';
    this.headerService.setTitle('Float Distribution');
    this.user = this.sessionService.decryptSessionData('user');
    this.currentPage = 1;
    this.pageElement = 100;
    $('.selectpicker').selectpicker();
    $('#assignDocModal').hide();

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
    this.getSNOList();
    if (this.user.groupId == 4) {
      this.snadoctornamehidestatus = false;
      this.snoUserId = this.user.userId;
      this.getDraftFloatList();
    }
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
  getSNOList() {
    this.snoConfigService.getSNAList().subscribe(
      (response) => {
        this.snoList = response;
        console.log(this.snoList);
      },
      (error) => console.log(error)
    );
  }
  clearEvent() {
    this.snoUserId = '';
  }
  selectEvent(item) {
    this.snoUserId = item.userId;
  }
  formdate: any;
  todate: any;
  sonid: any;
  resData: any;
  snadoctornamehidestatus: boolean = true;
  getDraftFloatList() {
    this.formdate = $('#datepicker1').val();
    this.todate = $('#datepicker2').val();
    this.sonid = this.snoUserId;
    if (Date.parse(this.formdate) > Date.parse(this.todate)) {
      this.swal('', 'From Date Should Be Less Than To Date', 'error');
      return;
    }
    if (this.sonid == null || this.sonid == '' || this.sonid == undefined) {
      this.swal('', 'Please Select SNA Doctor', 'info');
      return;
    }
    this.paymentfreezeService.getDraftDetails(this.sonid,this.formdate,this.todate).subscribe(
      (data) => {
        this.resData = data;
        if (this.resData.status == 'success') {
          this.DraftList = this.resData.data;
          console.log(this.DraftList);
          this.record = this.DraftList.length;
          if (this.record > 0) {
            this.showPegi = true;
          } else {
            this.showPegi = false;
          }
        } else if (this.resData.status == 'failed') {
          this.swal('', this.resData.msg, 'info');
          sessionStorage.clear();
          localStorage.clear();
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

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
  pageItemChange() {
    // this.ngOnInit();
    this.pageElement = (<HTMLInputElement>(
      document.getElementById('pageItem')
    )).value;
    console.log(this.pageElement);
    // alert("Page Capcity Extended Upto " + this.pageElement);
  }

  dataIdArray: any = [];
  checkAllCheckBox(event: any) {
    this.dataIdArray = [];
    // Angular 13
    if (event.target.checked) {
      for (let i = 0; i < this.DraftList.length; i++) {
        $('#' + this.DraftList[i].floateId).prop('checked', true);
        this.dataIdArray.push(this.DraftList[i].floateId);
      }
    } else {
      for (let i = 0; i < this.DraftList.length; i++) {
        $('#' + this.DraftList[i].floateId).prop('checked', false);
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
  tdCheck(event: any, floateId) {
    // this.dataIdArray = [];
    if (event.target.checked) {
      this.dataIdArray.push(floateId);
    } else {
      for (let i = 0; i < this.dataIdArray.length; i++) {
        if (this.dataIdArray[i] == floateId) {
          this.dataIdArray.splice(i, 1);
        }
      }
    }
    if (this.dataIdArray.length == this.DraftList.length) {
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

  floatHistoryList: any = [];
  floatNum: any;
  floatCreatedBy: any;
  floatAmount: any;
  createdOn: any;
  viewHistory(floatData) {
    let floatId = floatData.floateId;
    $('#historyModal').show();
    this.paymentfreezeService.getFloatLogList(floatId).subscribe(
      (data) => {
        this.resData = data;
        console.log(data);
        if (this.resData.status == 'success') {
          this.floatHistoryList = this.resData.data;
          this.floatNum = this.floatHistoryList[0].floateno;
          this.floatCreatedBy = this.floatHistoryList[0].createby.fullname;
          // this.floatAmount = this.floatHistoryList[0].amount;
          this.floatAmount = this.floatHistoryList.at(-1).amount;
          this.createdOn = this.floatHistoryList[0].createon;
        } else if (this.resData.status == 'failed') {
          this.swal('', this.resData.msg, 'error');
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
  view(floatNumber, fullname, snaName) {
    sessionStorage.removeItem('Searchtype');
    sessionStorage.removeItem('floatNumber');
    sessionStorage.removeItem('Status');
    sessionStorage.removeItem('currentPageNum');
    sessionStorage.removeItem('fullname');
    sessionStorage.removeItem('snaName');
    let Searchtype = $('#authMode').val();
    this.sessionService.encryptSessionData('Searchtype', Searchtype);
    this.sessionService.encryptSessionData('floatNumber', floatNumber);
    this.sessionService.encryptSessionData('Status', this.Status);
    this.sessionService.encryptSessionData('fullname', fullname);
    this.sessionService.encryptSessionData('snaName', snaName);
    this.sessionService.encryptSessionData('currentPageNum', this.currentPage);
    this.route.navigate(['/application/floatReport']);
  }
  getfloatdetailsHospitalwise(floatnumber: any) {
    this.sessionService.encryptSessionData(
      'hospitalwisefloatnumber',
      floatnumber
    );
    this.sessionService.encryptSessionData('Date', this.formdate);
    this.route.navigate([]).then((result) => {
      window.open(environment.routingUrl + '/hospitalwisefloatnumberDetails');
    });
    // this.route.navigate(['/application/hospitalwisefloatnumberDetails']);
  }
  floatfiledata: any;
  snaCertificationFile: any;
  meCertificationFile: any;
  otherFile: any;
  changeSNACertificationFile(files: any) {
    this.floatfiledata = files.target.files;
    for (var i = 0; i < this.floatfiledata.length; i++) {
      var filename = files.target.files[0];
      var extension = filename.name.split('.').pop();
    }
    var allowedExtensions = /(\xls|\xlsx|pdf|jpeg|jpg)$/i;
    if (!allowedExtensions.exec(extension)) {
      this.swal('Warning', 'Only Excel/PDF/JPG are Allowed!', 'warning');
      $('#certificationfile').val('');
      this.snaCertificationFile = '';
      return;
    } else this.snaCertificationFile = files.target.files[0];
    if (Math.round(this.snaCertificationFile.size / 1024) >= 10192) {
      this.swal(
        'Warning',
        'Please provide Document with Limited Size',
        'warning'
      );
      $('#floatfile').val('');
      this.snaCertificationFile = '';
      return;
    }
  }
  changeMECertificationFile(files: any) {
    this.floatfiledata = files.target.files;
    for (var i = 0; i < this.floatfiledata.length; i++) {
      var filename = files.target.files[0];
      var extension = filename.name.split('.').pop();
    }
    var allowedExtensions = /(\xls|\xlsx|pdf|jpeg|jpg)$/i;
    if (!allowedExtensions.exec(extension)) {
      this.swal('Warning', 'Only Excel/PDF/JPG are Allowed!', 'warning');
      $('#mecertification').val('');
      this.meCertificationFile = '';
      return;
    } else this.meCertificationFile = files.target.files[0];
    if (Math.round(this.meCertificationFile.size / 1024) >= 10192) {
      this.swal(
        'Warning',
        'Please provide Document with Limited Size',
        'warning'
      );
      $('#floatfile').val('');
      this.meCertificationFile = '';
      return;
    }
  }
  changeOtherFile(files: any) {
    this.floatfiledata = files.target.files;
    for (var i = 0; i < this.floatfiledata.length; i++) {
      var filename = files.target.files[0];
      var extension = filename.name.split('.').pop();
    }
    var allowedExtensions = /(\xls|\xlsx|pdf|jpeg|jpg)$/i;
    if (!allowedExtensions.exec(extension)) {
      this.swal('Warning', 'Only Excel/PDF/JPG are Allowed!', 'warning');
      $('#floatfile').val('');
      this.otherFile = '';
      return;
    } else this.otherFile = files.target.files[0];
    if (Math.round(this.otherFile.size / 1024) >= 10192) {
      this.swal(
        'Warning',
        'Please provide Document with Limited Size',
        'warning'
      );
      $('#floatfile').val('');
      this.otherFile = '';
      return;
    }
  }
  responseData: any;
  description: any;
  submit() {
    this.description = $('#remarks').val();
    if (this.description == '' || this.description == null) {
      this.swal('', 'Description should not be left blank', 'error');
      return;
    }
    if (this.description != '' && this.description != null) {
      const pattern = /'/;
      if (pattern.test(this.description)) {
        this.swal('', ' Special character is not allowed', 'error');
        return;
      }
    }
    if (
      this.snaCertificationFile == '' ||
      this.snaCertificationFile == undefined ||
      this.snaCertificationFile == null
    ) {
      this.swal('', 'Please select the SNA Certification file', 'info');
      return;
    }
    if (
      this.meCertificationFile == '' ||
      this.meCertificationFile == undefined ||
      this.meCertificationFile == null
    ) {
      this.swal('', 'Please select the M&E Certification file', 'info');
      return;
    }
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to Forward the Float!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append('floatId', this.floatNumber);
        formData.append('snoUserId', this.snoUserId);
        formData.append('snacertification', this.snaCertificationFile);
        formData.append('mecertification', this.meCertificationFile);
        formData.append('otherfile', this.otherFile);
        formData.append('description', this.description);
        this.paymentfreezeService.forwardDraftFloat(formData).subscribe(
          (data) => {
            this.responseData = data;
            if (this.responseData.data.status == 'success') {
              if (this.responseData.data.status == 'success') {
                $('#assignDocModal').hide();
                this.swal('Success', this.responseData.data.message, 'success');
                this.snaCertificationFile = null;
                this.meCertificationFile = null;
                this.otherFile = null;
                $('#otherfile').val('');
                $('#certificationfile').val('');
                $('#mecertification').val('');
                this.getDraftFloatList();
              } else if (this.responseData.data.status == 'failed') {
                this.swal('Warning', this.responseData.data.message, 'warning');
              } else {
                this.swal('', 'Something went wrong.', 'error');
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
    });
  }
  cancel() {
    $('#assignDocModal').hide();
  }
  onresetrecord() {
    window.location.reload();
  }
  maxChars = 500;
  remarks: any;
  myGroup = new FormGroup({
    remarks: new FormControl(),
  });
  keyPress(event: KeyboardEvent) {
    const pattern = /'/;
    const inputChar = String.fromCharCode(event.charCode);
    if (pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  @ViewChild('closebutton') closebutton;
  floatNumber:any;
  onAction(floatNumber){
    this.floatNumber = floatNumber;
    $('#remarks').val('');
    $('#certificationfile').val('');
    this.snaCertificationFile = '';
    $('#mecertification').val('');
      this.meCertificationFile = '';
      $('#otherfile').val('');
      this.otherFile = '';
    $('#assignDocModal').show();
  }
}
