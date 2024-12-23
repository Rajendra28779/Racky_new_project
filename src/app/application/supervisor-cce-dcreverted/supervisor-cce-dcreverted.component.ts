import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../header.service';
import { CallCenterExecutiveService } from '../Services/call-center-executive.service';
import { Router } from '@angular/router';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { TableUtil } from '../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-supervisor-cce-dcreverted',
  templateUrl: './supervisor-cce-dcreverted.component.html',
  styleUrls: ['./supervisor-cce-dcreverted.component.scss']
})
export class SupervisorCceDCRevertedComponent implements OnInit {
  months: string;
  year: number;
  user: any;
  getCceOutboundData: any;
  cceOutboundData: any;
  currentPage: any;
  showPegi: boolean;
  record: any;
  pageElement: number;
  txtsearchDate: any;
  cceOutboundDataById: any;
  openDetails: boolean;
  dataDc: any;
  cceCountData: any;
  stateList: any;
  districtList: any
  hospitalList: any
  selectedItems: any = [];
  userList: any;
  pageIn: number;
  pageEnd: number;
  size: number;
  pgElement: any;
  pgList: any = [];
  newList: any = [];
  selectedIndex: number;
  first: number;
  last: number;

  constructor(
    public headerService: HeaderService,
    private callCenterExecutiveService: CallCenterExecutiveService,
    public router: Router,
    private snoService: SnocreateserviceService,
    public datepipe: DatePipe,
    public route: Router,
    private sessionService: SessionStorageService
  ) { }
  report: any = [];
  callCenter: any = {
    slNo: "",
    id: "",
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
    question1: "",
    question2: "",
    question3: "",
    question4: "",
    remark: "",
    dcUpdatedOn:""
  };
  maxChars = 500;

  heading = [['Sl No', 'Case No', 'URN', 'Patient Name', 'District Name', 'Block Name', 'Panchayat Name', 'Village Name', 'DateOf Admission', 'Total Amount Blocked', 'Hospital District', 'Hospital Name', 'Procedure Name', 'Package Name', 'Patient PhoneNo', 'Alternate PhoneNo', 'Invoice No', 'MobileNo Active Status', 'Call Response', 'Feedback App Login Id', 'Data Receive Date', 'Calling Date', 'Not connected dial count', 'Remark','DC Reverted On']];

  ngOnInit(): void {
    this.headerService.setTitle('Call Details');
    this.user =  this.sessionService.decryptSessionData("user");
    console.log(this.user)
    this.currentPage = 1;
    this.pageElement = 10;
    this.selectedIndex = 1;

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

    //Date input placeholder
    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr("placeholder", "From Date *");

    // $('input[name="toDate"]').val('');
    $('input[name="toDate"]').attr("placeholder", "To Date *");
    this.onSearch();
    // this.getCountDetails();
    this.getStateList();
    this.getAllSupervisorUser();
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

  onSearch() {
    this.pageElement = 10;
    $('#pageItem').val(this.pageElement);
    this.pageIn = 1;
    this.pageEnd = this.pageElement;
    this.selectedIndex = 1;
    this.outBoundData();
  }

  outBoundData() {
    let userId = this.user.userId;
    let fromDate = $('#date3').val();
    let toDate = $('#date4').val();
    let action = 'E';
    let cceId = 0
    let hospitalCode = $('#hospital').val();
    let cceUserId = $('#userName').val();
    let stateCode = $('#stateId').val();
    let distCode = $('#districtId').val();
    if (Date.parse(fromDate) > Date.parse(toDate)) {
      this.swal('', ' From Date should be less To Date', 'error');
      return;
    }
    //let cceUserId= '';
    this.callCenterExecutiveService.getSupervisorCallCenterData(action, userId, fromDate, toDate, cceId, hospitalCode, cceUserId, this.pageIn, this.pageEnd,stateCode,distCode).subscribe(
      (data: any) => {
        console.log(data);
        this.size = data.size;
        this.cceOutboundData = data.list;
        this.record = this.cceOutboundData.length;
        if (this.record > 0) {
          this.showPegi = true;
        }
        else {
          this.showPegi = false
        }
        for(var i=0;i<this.cceOutboundData?.length;i++){
          var dialData=this.cceOutboundData[i];
          if(dialData.dialedCount == 0){
            dialData.dialedCount = '-NA-';
          }
        }
        console.log('size: ' + this.size);
        console.log('pg: ' + this.pageElement);
        let count = Math.ceil(this.size / this.pageElement);
        console.log('count: ' + count);
          this.pgList = [];
          for (var i = 0; i < count; i++) {
            this.pgElement = {
              id: "",
              init: "",
              end: "",
            }
            this.pgElement.id = i + 1;
            this.pgElement.init = (this.pgElement.id * this.pageElement) - this.pageElement + 1;
            this.pgElement.end = this.pgElement.id * this.pageElement;
            console.log(this.pgElement);
            this.pgList.push(this.pgElement);
          }
          this.newList = [];
          var fst = this.first?this.first:0;
          var lst = this.last?this.last:10;
          if (this.pgList.length>0) {
            if(lst>this.pgList[this.pgList.length-1].id) {
              lst = this.pgList[this.pgList.length-1].id;
            }
            for(var j=fst;j<lst;j++) {
              var elem = this.pgList[j];
              this.newList.push(elem);
            }
          }
          console.log(this.pgList);
          console.log(this.newList);
      }
    );
    // this.getCountDetails();
  }

  getCountDetails() {
    let userId = this.user.userId;
    let fromDate = $('#date3').val();
    let toDate = $('#date4').val();
    let action = 'C';
    let cceId = 0
    let hospitalCode = $('#hospital').val();
    let cceUserId = $('#userName').val();
    let stateCode = $('#stateId').val();
    let distCode = $('#districtId').val();
    this.callCenterExecutiveService.getSupervisorCallCenterData(action, userId, fromDate, toDate, cceId, hospitalCode, cceUserId, 0, 0,stateCode,distCode).subscribe((data: any) => {
      console.log(data.list[0])
      this.cceCountData = data.list[0];
    })
  }

  resetField() {
    window.location.reload();
  }

  pageItemChange() {
    this.pageElement = $('#pageItem').val();
    console.log(this.pageElement);
    this.pageIn = 1;
    this.pageEnd = this.pageElement;
    this.selectedIndex = 1;
    this.first = 0;
    this.last = 10;
    this.outBoundData();
  }

  paginate(element) {
    this.selectedIndex = element.id;
    this.pageIn = element.init;
    this.pageEnd = element.end;
    this.outBoundData();
  }

  prev() {
    if(this.selectedIndex == this.newList[0].id) {
      var fst = this.newList[0].id - 1;
      this.first = fst - 10;
      this.last = fst;
    }
    this.selectedIndex = this.selectedIndex - 1;
    this.pageIn = this.pageIn - this.pageElement;
    this.pageEnd = this.pageEnd - this.pageElement;
    this.outBoundData();
  }

  next() {
    if(this.selectedIndex == this.newList[this.newList.length-1].id) {
      var lst = +this.newList[this.newList.length-1].id;
      this.first = lst;
      this.last = lst + 10;
    }
    this.selectedIndex = this.selectedIndex + 1;
    this.pageIn = +this.pageIn + +this.pageElement;
    this.pageEnd = +this.pageEnd + +this.pageElement;
    this.outBoundData();
  }

  prevlist() {
    var fst = this.newList[0].id - 1;
    this.first = fst - 10;
    this.last = fst;
    this.selectedIndex = fst - 10 + 1;
    this.pageIn = this.newList[0].init - this.pageElement*10;
    this.pageEnd = this.newList[0].end - this.pageElement*10;
    this.outBoundData();
  }

  nextlist() {
    var lst = +this.newList[this.newList.length-1].id;
    this.first = lst;
    this.last = lst + 10;
    this.selectedIndex = lst + 1;
    this.pageIn = +this.newList[this.newList.length-1].init + +this.pageElement;
    this.pageEnd = +this.newList[this.newList.length-1].end + +this.pageElement;
    this.outBoundData();
  }

  swal(title, text, icon) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  downloadReport() {
    this.report = [];
    let item: any;
    for (var i = 0; i < this.cceOutboundData.length; i++) {
      item = this.cceOutboundData[i];
      console.log(item);

      this.callCenter = [];
      this.callCenter.slNo = i + 1;
      this.callCenter.id = item.transId ? item.transId : '-NA-';
      this.callCenter.urn = item.urn ? item.urn : '-NA-';
      this.callCenter.patientName = item.patientName ? item.patientName : '-NA-';
      this.callCenter.districtName = item.districtName ? item.districtName : '-NA-';
      this.callCenter.blockName = item.blockName ? item.blockName : '-NA-';
      this.callCenter.panchayatName = item.panchayatName ? item.panchayatName : '-NA-';
      this.callCenter.villageName = item.villageName ? item.villageName : '-NA-';
      this.callCenter.dateOfAdm = this.datepipe.transform(item.dateOfAdm, 'dd-MMM-yyyy');
      this.callCenter.amountBlocked = item.totalAmountBlocked ? item.totalAmountBlocked : '-NA-';
      this.callCenter.hospitalDist = item.hospitalDist ? item.hospitalDist : '-NA-';
      this.callCenter.hospitalName = item.hospitalName ? item.hospitalName : '-NA-';
      this.callCenter.procedureName = item.procedureName ? item.procedureName : '-NA-';
      this.callCenter.packageName = item.packageName ? item.packageName : '-NA-';
      this.callCenter.patientPhoneNo = item.mobileNo ? item.mobileNo : '-NA-';
      this.callCenter.alterPhoneNo = item.alternativeNo ? item.alternativeNo : '-NA-';
      this.callCenter.invoiceNo = item.invoiceNo ? item.invoiceNo : '-NA-';
      this.callCenter.mobileActiveStatus = item.mobileActiveStatus ? item.mobileActiveStatus : '-NA-';
      this.callCenter.callResponse = item.callResponse ? item.callResponse : '-NA-';
      this.callCenter.feedBackLoginId = item.feedbackLoginId ? item.feedbackLoginId : '-NA-';
      this.callCenter.dataReceivedDate = this.datepipe.transform(item.alottedDate, 'dd-MMM-yyyy') ? item.alottedDate : '-NA-';
      this.callCenter.callingDate = this.datepipe.transform(item.createdOn, 'dd-MMM-yyyy');
      // this.callCenter.repeatCheck=item.repeatCheck ? item.repeatCheck : '-NA-' ;
      this.callCenter.dialedCount = item.dialedCount ? item.dialedCount : '-NA-';
      // this.callCenter.question1 = item.question1Response ? item.question1Response : '-NA-';
      // this.callCenter.question2 = item.question2Response ? item.question2Response : '-NA-';
      // this.callCenter.question3 = item.question3Response ? item.question3Response : '-NA-';
      // this.callCenter.question4 = item.question4Response ? item.question4Response : '-NA-';
      this.callCenter.remark = item.executiveRemarks ? item.executiveRemarks : '-NA-';
      this.callCenter.dcUpdatedOn = item.dcSubmittedDate;
      this.report.push(this.callCenter);
      console.log(this.report);
      console.log(this.callCenter);
    }
    TableUtil.exportListToExcel(this.report, "DC Reverted Call Details", this.heading);
  }
  view(item: any) {
    //this.cceOutboundData = data[0]
    let userId = this.user.userId;
    let fromDate = $('#date3').val();
    let toDate = $('#date4').val();
    let action = 'B';
    //let cceId = item
    let hospitalCode = ''
    let cceUserId = ''
    this.callCenterExecutiveService.getSupervisorCallCenterData(action, userId, fromDate, toDate, item, hospitalCode, cceUserId, this.pageIn, this.pageEnd,null,null).subscribe((data: any) => {
      let list: any[] = data.list;
      this.cceOutboundDataById = list[0];
      console.log(this.cceOutboundDataById)
      //console.log(data)
    })
  }
  saveReassignData() {
    let remark = $('#reassignRemark').val();
    let cceUserId=$('#cceuserName').val();
    if (cceUserId == undefined || cceUserId == null || cceUserId == "") {
      this.swal('Warning', 'Please Select CCE User', 'warning');
      return;
    }
    if (remark == undefined || remark == null || remark == "") {
      this.swal('Warning', 'Please Enter Remark', 'warning');
      return;
    }
    let id = this.cceOutboundDataById.cceId
    this.callCenterExecutiveService.saveReassignRemark(id, remark, this.user.userId,cceUserId).subscribe((data: any) => {
      if (data.status == "Success") {
        this.swal("Success", data.message, "success");
        this.outBoundData();
      } else if (data.status == "Failed") {
        this.swal("Error", data.message, "error");
      }
      console.log(data)
    })
  }
  cceUserList:any=[];
  getAllSupervisorUser() {
    this.callCenterExecutiveService.getUserNameByGroupId().subscribe((data: any) => {
      this.userList = data;
      this.cceUserList=data;
      console.log(data)
    })
  }
  remarkRemove() {
    $(".modal-body textarea").val("")
  }

}
