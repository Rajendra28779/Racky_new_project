import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service';
import { SnamasterserviceService } from '../Services/snamasterservice.service';
import { HeaderService } from '../header.service';
import Swal from 'sweetalert2';
import { HospitalWiseClaimReportServiceService } from '../Services/hospital-wise-claim-report-service.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-testing-process-execution',
  templateUrl: './testing-process-execution.component.html',
  styleUrls: ['./testing-process-execution.component.scss']
})
export class TestingProcessExecutionComponent implements OnInit {

  statelist: any = [];
  user: any;
  stateCode: any;
  userId: any;
  distList: any = [];
  distCode: any;
  hospitalList: any = [];
  claimlist: any = [];
  txtsearchDate: any;
  pageElement: any;
  currentPage: any;
  totalpaymentlist: any;
  record: any;
  dataa: any;
  childmessage: any;
  hospitalId: any = '';
  districtId: any = '';
  stateId: any = '';
  fromDate: any;
  toDate: any;
  showPegi: boolean;
  urn: any;

  constructor(
    public headerService: HeaderService,
    public hospitalService: HospitalWiseClaimReportServiceService,
    public snoService: SnamasterserviceService,
    private sessionService: SessionStorageService,
    public route: Router
  ) { }

  ngOnInit(): void {
    this.headerService.setTitle('Testing Process Execution');
    this.headerService.isIndicate(false);
    this.headerService.isBack(true);
    this.user = this.sessionService.decryptSessionData("user");
    this.currentPage = 1;
    this.pageElement = 10;
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
      format: 'DD-MM-YYYY LT',
      daysOfWeekDisabled: ['', 7],
    });
    var date = new Date();

    let year = date.getFullYear();
    let date1 = '01';
    let month: any = date.getMonth() - 1;
    if(month == -1){
      month = 11;
      year = year-1;
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
    var frstDay = date1 + '-' + month + '-' + year;
    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr('placeholder', 'From Date *');

    // $('input[name="toDate"]').val('');
    $('input[name="toDate"]').attr('placeholder', 'To Date *');
    this.getStateList();
    this.onSearch();
  }

  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }

  getStateList() {
    this.statelist = [];
    this.snoService.getStateList(this.user.userId).subscribe((data: any) => {
      this.statelist = data;
    });
  }

  OnChangeState(event) {
    $('#dist').val("");
    this.distCode = "";
    $('#hospital').val("");
    this.hospitalList = [];
    this.stateCode = event.target.value;
    // this.userId = this.user.userId;
    this.snoService.getDistrictListByStateId(this.user.userId, this.stateCode).subscribe((data) => {
      this.distList = data;
      // this.distList.sort((a, b) =>
      //   a.DISTRICTNAME.localeCompare(b.DISTRICTNAME)
      // );
    });
  }

  OnChangeDist(event) {
    $('#hospital').val("");
    this.distCode = event.target.value;
    // this.userId = this.user.userId;
    this.snoService.getHospitalbyDistrictId(this.user.userId, this.distCode, this.stateCode).subscribe((data) => {
      this.hospitalList = data;
    });
  }

  resData: any;
  onSearch() {
    let fromDate = $('#formdate').val();
    let distCode1 = $('#dist').val();
    let hospitalCode = $('#hospital').val();
    let toDate = $('#todate').val();
    let stateCode1 = $('#state').val();

    if (Date.parse(fromDate) > Date.parse(toDate)) {
      this.swal('Error', ' From Date should be less than To Date', 'error');
      return;
    }

    this.fromDate = fromDate;
    this.toDate = toDate;
    this.stateId = stateCode1;
    this.districtId = distCode1;
    this.hospitalId = hospitalCode;
    this.claimlist = [];
   
    let requestData = {
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      stateCode: stateCode1,
      distCode: distCode1,
      hospitalCode: hospitalCode,
    };
    this.hospitalService.getClaimList(requestData).subscribe(
      (data) => {
        this.resData = data;
        if (this.resData.status == 'success') {
          this.claimlist = this.resData.data;
          this.record = this.claimlist.length;
          if (this.record > 0) {
            this.showPegi = true;
          } else {
            this.showPegi = false;
            this.swal('Info', 'No Data Found', 'info');
          }
        } else {
          this.swal('Error', 'Something went wrong.', 'error');
        }
      },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      }
    );
  }

  resetField() {
    window.location.reload();
  }

  pageItemChange() {
    this.pageElement = $('#pageItem').val();
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }

  selectVal(urn) {
    this.urn=urn;
  }

  onSubmit() {
    let processId = $('#processId').val();
    if (this.urn == null || this.urn == '' || this.urn == undefined) {
      this.swal('Info', 'Please select a transaction', 'info');
      return;
    }
    if (processId == null || processId == '' || processId == undefined) {
      this.swal('Info', 'Please select Process', 'info');
      return;
    }
    
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to execute this process!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Execute It!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.hospitalService.executeProcess(this.urn, processId).subscribe(
          (data: any) => {
            if (data.status == 'Success') {
              this.swal('Success', data.message, 'success');
              $('#processId').val("");
              this.onSearch();
            }
            else if (data.status == 'Failed') {
              this.swal('error', data.message, 'error');
            }
          }
        );
      }
    });
  }

}
