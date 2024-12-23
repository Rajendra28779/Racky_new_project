import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../header.service';
import { CallCenterExecutiveService } from '../../Services/call-center-executive.service';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TableUtil } from '../../util/TableUtil';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';
import autoTable from 'jspdf-autotable';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { DatePipe } from '@angular/common';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-hospitalwise-ccedata',
  templateUrl: './hospitalwise-ccedata.component.html',
  styleUrls: ['./hospitalwise-ccedata.component.scss']
})
export class HospitalwiseCcedataComponent implements OnInit {
  currentPage: any;
  months: string;
  year: number;
  user: any;
  pageElement: any;
  txtsearchDate: any;
  showPegi: boolean;
  hsptlwisecceView: any;
  cceView: any;
  record: any;
  countfloate: any;
  cceelist: any;
  totalNotConnected: any;
  openDetails: boolean;
  dataDc: any;
  cceCountData: any;
  stateList: any;
  districtList: any
  hospitalList: any
  selectedItems: any = [];
  cceOutboundData: any;

  constructor(public headerService: HeaderService,
    public callCenterExecutiveService: CallCenterExecutiveService,
    public fb: FormBuilder,
    public router: Router,
    private sessionService: SessionStorageService,
    private snoService: SnocreateserviceService,
    public datepipe: DatePipe) { }

  ngOnInit(): void {
    this.headerService.setTitle('CCE Report Data');
    this.user = this.sessionService.decryptSessionData("user");
    this.currentPage = 1;
    this.pageElement = 10;
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
    var date = new Date();
    let year = date.getFullYear();
    let date1 = '01';
    let month: any = date.getMonth();
    if (month == -1) {
      this.months = 'Dec';
      this.year = year - 1;
    } else {
      this.months = this.getMonthFrom(month);
      this.year = year;
    }
    var frstDay = date1 + '-' + this.months + '-' + this.year;
    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr("placeholder", "From Date *");
    $('input[name="toDate"]').attr("placeholder", "To Date *");
    this.getStateList();
    this.outBoundData();
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
  getDate(date) {
    let year = date.getFullYear();
    let date1 = date.getDate();
    let months = date.getMonth();
    let month = this.getMonthFrom(months);
    var frstDay = date1 + '-' + month + '-' + year;
    return frstDay;
  }

  getStateList() {
    this.snoService.getStateList().subscribe(
      (response) => {
        this.stateList = response;
        console.log(this.stateList);
      },
      (error) => console.log(error)
    )
  }
  OnChangeState(id) {
    $("#districtId").val("");
    this.selectedItems = [];
    localStorage.setItem("stateCode", id);
    this.snoService.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = response;
        console.log(response);
      },
      (error) => console.log(error)
    )
  }
  OnChangeDistrict(id) {
    this.selectedItems = [];
    var stateCode = localStorage.getItem("stateCode");
    this.snoService.getHospitalbyDistrictId(id, stateCode).subscribe(
      (response) => {

        this.hospitalList = response;
        console.log(response);
      },
      (error) => console.log(error)
    )
  }

  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  }
  report: any = [];
  totalNotConnectedList: any = {
    slNo: "",
    transId: "",
    urn: "",
    patientName: "",
    districtName: "",
    blockName: "",
    panchayatName: "",
    villageName: "",
    dateOfAdm: "",
    amountBlocked: "",
    hospitalDist: "",
    hospitalName: "",
    procedureName: "",
    packageName: "",
    patientPhoneNo: "",
    alterPhoneNo: "",
    invoiceNo: "",
    mobileActiveStatus: "",
    callResponse: "",
    feedBackLoginId: "",
    dataReceivedDate: "",
    callingDate: "",
    // repeatCheck:"",
    dialedCount: "",
    question1Response: "",
    question2Response: "",
    question3Response: "",
    question4Response: "",
    remark: "",
  };
  heading = [['Sl No', 'Case No', 'URN', 'Patient Name', 'District Name', 'Block Name', 'Panchayat Name', 'Village Name', 'DateOf Admission', 'Total Amount Blocked', 'Hospital District', 'Hospital Name', 'Procedure Name', 'Package Name', 'Patient PhoneNo', 'Alternate PhoneNo', 'Invoice No', 'MobileNo Active Status', 'Call Response', 'Feedback App Login Id', 'Data Receive Date', 'Calling Date', 'Dialed Count', 'Are you receiving cashless treatment under GJAY', 'Are you satisfied with service? ', 'Whether you have paid any extra money for treatment under GJAY', 'Did Swasthya Mitra facilitate your care?', 'Remark']];

  downloadReport(type: any) {
    this.report = [];
    let item: any;
    for (var i = 0; i < this.cceOutboundData.length; i++) {
      item = this.cceOutboundData[i];
      console.log(item);
      this.totalNotConnectedList = [];
      this.totalNotConnectedList.slNo = i + 1;
      this.totalNotConnectedList.transId = item.transId ? item.transId : '-NA-';
      this.totalNotConnectedList.urn = item.urn ? item.urn : '-NA-';
      this.totalNotConnectedList.patientName = item.patientName ? item.patientName : '-NA-';
      this.totalNotConnectedList.districtName = item.districtName ? item.districtName : '-NA-';
      this.totalNotConnectedList.blockName = item.blockName ? item.blockName : '-NA-';
      this.totalNotConnectedList.panchayatName = item.panchayatName ? item.panchayatName : '-NA-';
      this.totalNotConnectedList.villageName = item.villageName ? item.villageName : '-NA-';
      this.totalNotConnectedList.dateOfAdm = this.datepipe.transform(item.dateOfAdm, 'dd-MMM-yyyy');
      this.totalNotConnectedList.amountBlocked = item.totalAmountBlocked ? item.totalAmountBlocked : '-NA-';
      this.totalNotConnectedList.hospitalDist = item.hospitalDist ? item.hospitalDist : '-NA-';
      this.totalNotConnectedList.hospitalName = item.hospitalName ? item.hospitalName : '-NA-';
      this.totalNotConnectedList.procedureName = item.procedureName ? item.procedureName : '-NA-';
      this.totalNotConnectedList.packageName = item.packageName ? item.packageName : '-NA-';
      this.totalNotConnectedList.patientPhoneNo = item.mobileNo ? item.mobileNo : '-NA-';
      this.totalNotConnectedList.alterPhoneNo = item.alternativeNo ? item.alternativeNo : '-NA-';
      this.totalNotConnectedList.invoiceNo = item.invoiceNo ? item.invoiceNo : '-NA-';
      this.totalNotConnectedList.mobileActiveStatus = item.mobileActiveStatus ? item.mobileActiveStatus : '-NA-';
      this.totalNotConnectedList.callResponse = item.callResponse ? item.callResponse : '-NA-';
      this.totalNotConnectedList.feedBackLoginId = item.feedbackLoginId ? item.feedbackLoginId : '-NA-';
      this.totalNotConnectedList.dataReceivedDate = this.datepipe.transform(item.alottedDate, 'dd-MMM-yyyy') ? item.alottedDate : '-NA-';
      this.totalNotConnectedList.callingDate = this.datepipe.transform(item.createdOn, 'dd-MMM-yyyy');
      // this.totalNotConnectedList.repeatCheck=item.repeatCheck ? item.repeatCheck : '-NA-' ;
      this.totalNotConnectedList.dialedCount = item.dialedCount ? item.dialedCount : '-NA-';
      this.totalNotConnectedList.question1Response = item.question1Response ? item.question1Response : '-NA-';
      this.totalNotConnectedList.question2Response = item.question2Response ? item.question2Response : '-NA-';
      this.totalNotConnectedList.question3Response = item.question3Response ? item.question3Response : '-NA-';
      this.totalNotConnectedList.question4Response = item.question4Response ? item.question4Response : '-NA-';
      this.totalNotConnectedList.remark = item.executiveRemarks ? item.executiveRemarks : '-NA-';

      this.report.push(this.totalNotConnectedList);
      console.log(this.report);
      console.log(this.totalNotConnectedList);
    }
    if (type == 'excel') {
      TableUtil.exportListToExcel(this.report, "CCE Report", this.heading);
    }

  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  outBoundData() {
    let userId = this.user.userId;
    let fromDate = $('#date1').val();
    let toDate = $('#date2').val();
    let action = 'A';
    let cceId = 0
    let hospitalCode = $('#hospital').val();
    let cceUserId = ''
    let stateCode = $('#stateId').val();
    let distCode = $('#districtId').val();
    this.callCenterExecutiveService.getSupervisorCallCenterData(action, userId, fromDate, toDate, cceId, hospitalCode, cceUserId, null, null,stateCode,distCode).subscribe((data: any) => {
      this.cceOutboundData = data;
      this.record = this.cceOutboundData.length;
      if (this.record > 0) {
        this.showPegi = true;
      }
      else {
        this.showPegi = false
      }
      console.log(data)
    })
  }
  resetField() {
    window.location.reload();
  }
}


