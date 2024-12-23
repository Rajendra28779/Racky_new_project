import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { HeaderService } from '../header.service';
import { CallCenterExecutiveService } from '../Services/call-center-executive.service';
import { SnoCLaimDetailsService } from '../Services/sno-claim-details.service';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import { Router } from '@angular/router';
import { ReportcountService } from '../Services/reportcount.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { TableUtil } from '../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-cceoutbound-call-shas-ceo',
  templateUrl: './cceoutbound-call-shas-ceo.component.html',
  styleUrls: ['./cceoutbound-call-shas-ceo.component.scss']
})
export class CCEOutboundCallShasCEOComponent implements OnInit {

  months: string;
  year: number;
  user: any;
  getCceOutboundData: any;
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
  selectedItems1: any = [];
  cceView: any;
  res: any;
  goData: any;
  report: any[];
  pageIn: number;
  pageEnd: number;
  size: number;
  pgElement: any;
  pgList: any = [];
  selectedIndex: number;
  newList: any = [];
  first: number;
  last: number;
  placeholderdistrict = "Select District";
  placeholderdistricthospital = "Select Hospital";
  dropdownSettingsfrdistrict: IDropdownSettings = {};
  dropdownSettingsfrhospitalist: IDropdownSettings = {};
  stateCodeList: any = [];
  districtCodeList: any = [];
  districtNamelist: any = [];
  hospitalistCodeList: any = [];
  hospitalNameList: any = [];
  districtlistdataformultidropdown: any = [];
  hospitaldatadataformultidropdown: any = [];

  hed: any = {
    slNo: '',
    urn: '',
    memberName: '',
    status: '',
    categoryName: '',
    hospitalName: '',
    executiveRemarks: '',
    dcRemarks: '',
    dgoRemarks: '',
    goRemark:'',
    dgoQueryRemarks: '',
    allottedDate: '',
    admissionDate: '',
    totalAmoutClaimed: '',
  };
  heading = [
    [
      'Sl#',
      'URN',
      'Patient Name',
      'Active Status',
      'Call Response',
      'Hospital Name',
      'CCE Remarks',
      'DC Remarks',
      'DGO Remarks',
      'DGO Query Remarks',
      'GO Remarks',
      'CCE Alloted Date',
      'Date of Admission',
      'Total Amount Blocked'
    ],
  ];
  goForm: FormGroup;
  action: any;
  pendingDc: any;
  pendingDgo: any;
  pendingGo: any;
  pending: any;
  maxChars = 500;

  constructor(public headerService: HeaderService,
    private callCenterExecutiveService: CallCenterExecutiveService,
    public snoservice: SnoCLaimDetailsService,
    private snoService: SnocreateserviceService,
    private route: Router,
    private reportcount: ReportcountService,
    private sessionService: SessionStorageService,
    public fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.headerService.setTitle('CCE Outbound Call');
    // this.user = JSON.parse(sessionStorage.getItem("user"));
    this.user = this.sessionService.decryptSessionData("user");
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
    let date = new Date();
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
    let frstDay = date1 + '-' + this.months + '-' + this.year;

    //Date input placeholder
    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr("placeholder", "From Date *");

    $('input[name="toDate"]').attr("placeholder", "To Date *");
    this.getStateList();
    this.onSearch();
    this.goForm = new FormGroup({
      remarks: new FormControl(''),
    });
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
    let frstDay = date1 + '-' + month + '-' + year;
    return frstDay;
  }

  getStateList() {
    this.snoService.getStateList().subscribe(
      (response) => {
        this.stateList = response;
        console.log(this.stateList);
      },
      (error) => console.log(error)
    );
  }

  OnChangeState(id) {
    $("#districtId").val("");
    $("#hospital").val("");
    localStorage.setItem("stateCode", id);
    this.snoService.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = response;
        console.log(response);
      },
      (error) => console.log(error)
    );
  }

  OnChangeDistrict(id) {
    $("#hospital").val("");
    let stateCode = localStorage.getItem("stateCode");
    this.snoService.getHospitalbyDistrictId(id, stateCode).subscribe(
      (response) => {
        this.hospitalList = response;
        console.log(response);
      },
      (error) => console.log(error)
    );
  }
  pagenodata:any;
  onSearch() {
    $('#pageItem').val(this.pageElement);
    this.pageIn = 1;
    this.pageEnd = this.pageElement;
    this.selectedIndex = 1;
    this.getPendingData();
  }
  onSearch2() {
    $('#pageItem').val(this.pageElement);
    if(this.pagenodata=="" || this.pagenodata==null || this.pagenodata==undefined){
    this.pageIn = 1;
    this.pageEnd = this.pageElement;
    this.selectedIndex = 1;
    }else{
      this.selectedIndex = this.pagenodata;
      this.pageIn = (this.selectedIndex * this.pageElement) - this.pageElement + 1;
      this.pageEnd = this.selectedIndex * this.pageElement;
    }
    this.getPendingData();
  }

  getPendingData() {
    let fromDate = $('#date1').val();
    let toDate = $('#date2').val();
    let action = 'A';
    let stateCode = $('#stateId').val();
    let distCode = $("#districtId").val();
    let hospitalCode = $("#hospital").val();
    if(fromDate == '' || fromDate == null || fromDate == undefined) {
      this.swal('', 'Please Select From Date', 'error');
      return;
    }
    if(toDate == '' || toDate == null || toDate == undefined) {
      this.swal('', 'Please Select To Date', 'error');
      return;
    }
    if (Date.parse(fromDate) > Date.parse(toDate)) {
      this.swal('', ' From Date should be less than To Date', 'error');
      return;
    }
    let requestData={
      "fromDate":fromDate,
      "toDate":toDate,
      "stateCode":stateCode,
      "distCode":distCode,
      "hospitalCode":hospitalCode,
      "action":action
    }
    console.log(requestData);
    this.callCenterExecutiveService.getCceDataForShasCEO(fromDate, toDate, stateCode, distCode, hospitalCode, this.pageIn, this.pageEnd).subscribe(
      (data: any) => {
        console.log(data);
        this.size = data.size;
        this.goData = data.list;
        this.goData.forEach((element)=>{
          element.allottedDate=this.convertDateFormat(element.allottedDate);
        });
        this.record = this.goData.length;
        if (this.record > 0) {
          this.showPegi = true;
        }
        else {
          this.showPegi = false
        }
        console.log('size: ' + this.size);
        console.log('pg: ' + this.pageElement);
        let count = Math.ceil(this.size / this.pageElement);
        console.log('count: ' + count);
        this.pgList = [];
        for (let i = 0; i < count; i++) {
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
      }
    );
  }
  convertDateFormat(value:any){
    const parts = value.split('-');
    if (parts.length === 3) {
      const day = parts[0];
      const month = parts[1];
      const year = parts[2].length<3?`20${parts[2]}`:parts[2]; // Assuming the year is in the 20xx format
      const date = new Date(`${year}-${month}-${day}`);

      const datePipe = new DatePipe('en-US');
      return datePipe.transform(date, 'dd-MMM-yyyy');
    }
    return value;
  }
  goData1:any=[];
  getPendingDataCount() {
    let fromDate = $('#date1').val();
    let toDate = $('#date2').val();
    let action = 'C';
    let stateCode = $('#stateId').val();
    let distCode = this.list(this.districtCodeList);
    let hospitalCode = this.list(this.hospitalistCodeList);
    let actionBy = $('#actionBy').val();
    let pendingAt = $('#pendingAt').val();
    if (Date.parse(fromDate) > Date.parse(toDate)) {
      this.swal('', ' From Date should be less To Date', 'error');
      return;
    }


    this.callCenterExecutiveService.getCceData(fromDate, toDate, stateCode, distCode, hospitalCode, actionBy, pendingAt, action, null, this.pageIn, this.pageEnd).subscribe(
      (data: any) => {
        console.log(data);
        this.size = data.size;
        this.goData1 = data.list;
        this.action = this.goData1[0].actionDcCount + this.goData1[0].actionDgoCount + this.goData1[0].actionCceCount
        this.pendingDc = this.goData1[0].pendingDcCount
        this.pendingDgo = this.goData1[0].pendingDgoCount
        this.pendingGo = this.goData1[0].pendingGoCount
        this.pending = this.pendingDc + this.pendingDgo + this.pendingGo
      }
    );
  }

  rowDetails(item, flag) {
    this.openDetails = true;
    let userId = this.user.userId;
    let fromDate = $('#date1').val();
    let toDate = $('#date2').val();
    let action = 'B';
    let cceId = item
    let hospitalCode = ''
    this.callCenterExecutiveService.getCceOutBound(action, userId, fromDate, toDate, cceId, hospitalCode, 0, 0, null,null,null).subscribe((data: any) => {
      let list: any[] = data.list;
      this.cceOutboundDataById = list[0];
      this.cceOutboundDataById.alottedDate=this.convertDateFormat(this.cceOutboundDataById.alottedDate);
      console.log(this.cceOutboundDataById)
    });
  }

  openHospDetails(item, flag) {
    this.rowDetails(item, flag)
  }

  resetField() {
    window.location.reload();
  }
  pageItemChange() {
    this.pageElement = $("#pageItem").val();
    this.pageIn = 1;
    this.pageEnd = this.pageElement;
    this.selectedIndex = 1;
    this.getPendingData();
  }

  paginate(element) {
    this.selectedIndex = element.id;
    this.pagenodata = element.id;
    this.pageIn = element.init;
    this.pageEnd = element.end;
    this.getPendingData();
  }

  prev() {
    this.selectedIndex = this.selectedIndex - 1;
    this.pageIn = this.pageIn - this.pageElement;
    this.pageEnd = this.pageEnd - this.pageElement;
    this.getPendingData();
  }

  next() {
    this.selectedIndex = this.selectedIndex + 1;
    this.pageIn = +this.pageIn + +this.pageElement;
    this.pageEnd = +this.pageEnd + +this.pageElement;
    this.getPendingData();
  }

  downloadAction(event: any, fileName: any, hCode: any, dateOfAdm: any) {
    console.log("hi" + fileName)
    let target = event.target;
    if (
      target.nodeName == 'A' ||
      target.nodeName == 'a' ||
      target.nodeName == 'IMG' ||
      target.nodeName == 'img' ||
      target.nodeName == 'I' ||
      target.nodeName == 'i'
    ) {

      if (fileName != null) {
        this.snoservice.downloadFiles(fileName, hCode, dateOfAdm).subscribe(
          (response: any) => {
            let result = response;
            let blob = new Blob([result], { type: result.type });
            let url = window.URL.createObjectURL(blob);
            window.open(url);
          },
          (error) => {
            console.log(error);
          }
        );
      }
    }
  }

  swal(title, text, icon) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  saveGoRemark(id, action) {
    if (this.goForm.value.remarks == null || this.goForm.value.remarks == "" || this.goForm.value.remarks == undefined) {
      $("#remarks").focus();
      this.swal("Info", "Please Enter Remarks", 'info');
      return;
    }
    Swal.fire({
      title: 'Are you sure  to save?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Save it!'
    }).then((result) => {
      if (result.isConfirmed) {

        console.log(id)
        console.log(action)

        let remarks = $('#remarks').val();
        let userId = this.user.userId;
        this.callCenterExecutiveService.addGoRemark(id, action, remarks, userId).subscribe((data: any) => {
          this.res = data;
          if (data.status == "Success") {
            this.swal("Success", data.message, "success");
            this.getPendingData();
          } else if (data.status == "Failed") {
            this.swal("Error", data.message, "error");
          }
          console.log(data)
        })
      }
    })
  }

  downloadList() {
    this.report = [];
    let packageP: any;
    for (let i = 0; i < this.goData.length; i++) {
      packageP = this.goData[i];
      this.hed = [];
      this.hed.slNo = i + 1;
      this.hed.urn = packageP.urn;
      this.hed.patientName = packageP.patientName;
      this.hed.status = packageP.status;
      this.hed.categoryName = packageP.categoryName;
      this.hed.hospitalName = packageP.hospitalName;
      this.hed.executiveRemarks = packageP.executiveRemarks;
      this.hed.dcRemarks = packageP.dcRemarks;
      this.hed.dgoRemarks = packageP.dgoRemarks;
      this.hed.goRemark=packageP.goRemarks;
      this.hed.dgoQueryRemarks = packageP.dgoQueryRemarks;
      this.hed.allottedDate = packageP.allottedDate;
      this.hed.admissionDate = packageP.admissionDate;
      this.hed.totalAmoutClaimed = packageP.totalAmoutClaimed;
      this.report.push(this.hed);
    }
    TableUtil.exportListToExcel(
      this.report, 'Call Center Executive In Shas Ceo', this.heading
    );
  }

  getdistrictlistformultidrodown() {
    this.reportcount.getdistrictdetailsformultidropdown(this.stateCodeList).subscribe((data: any) => {
      this.districtlistdataformultidropdown = data;
      if (this.districtlistdataformultidropdown.status == 'success') {
        this.districtlistdataformultidropdown = this.districtlistdataformultidropdown.data;
      }
      console.log(this.districtlistdataformultidropdown);
      this.gethospitallistformultidrodown();
    },
      (error) => console.log(error)
    )
  }

  onItemSelectfrdistrict(item) {
    if (!this.districtCodeList.includes(JSON.parse(JSON.stringify(item)).DistrictCode)) {
      this.districtCodeList.push(JSON.parse(JSON.stringify(item)).DistrictCode);
    }
    if (!this.districtNamelist.includes(JSON.parse(JSON.stringify(item)).DistrictName)) {
      this.districtNamelist.push(JSON.parse(JSON.stringify(item)).DistrictName);
    }
    this.gethospitallistformultidrodown();
  }
  onItemDeSelectfrdistrict(item) {
    if (this.districtCodeList.includes(JSON.parse(JSON.stringify(item)).DistrictCode)) {
      this.districtCodeList.splice(this.districtCodeList.indexOf(JSON.parse(JSON.stringify(item)).DistrictCode),
        1);
    }
    if (this.districtNamelist.includes(JSON.parse(JSON.stringify(item)).DistrictName)) {
      this.districtNamelist.splice(this.districtNamelist.indexOf(JSON.parse(JSON.stringify(item)).DistrictName),
        1);
    }
    this.gethospitallistformultidrodown();
    for (const element of this.districtlistdataformultidropdown) {
      if (item.DistrictCode == element.DistrictCode) {
        let index = this.districtCodeList.indexOf(element);
        if (index !== -1) {
          this.districtlistdataformultidropdown.splice(index, 1);
        }
      }
    }
    for (const element of this.districtlistdataformultidropdown) {
      if (item.DistrictName == element.DistrictName) {
        let index = this.districtNamelist.indexOf(element);
        if (index !== -1) {
          this.districtNamelist.splice(index, 1);
        }
      }
    }
  }
  onSelectAllfrdistrict(item) {
    for (const element of item) {
      if (!this.districtCodeList.includes(JSON.parse(JSON.stringify(element)).DistrictCode)) {
        this.districtCodeList.push(JSON.parse(JSON.stringify(element)).DistrictCode);
      }
    }
    for (const element of item) {
      if (!this.districtNamelist.includes(JSON.parse(JSON.stringify(element)).DistrictName)) {
        this.districtNamelist.push(JSON.parse(JSON.stringify(element)).DistrictName);
      }
    }
  }
  onDeSelectAllfordistrict(item) {
    this.districtCodeList = [];
    this.districtNamelist = [];
    this.gethospitallistformultidrodown();
  }
  //hospital
  gethospitallistformultidrodown() {
    this.selectedItems1=[]
    this.reportcount.gethospitallistformultidrodown(this.stateCodeList, this.districtCodeList).subscribe((data: any) => {
      this.hospitaldatadataformultidropdown = data;
      if (this.hospitaldatadataformultidropdown.status == 'success') {
        this.hospitaldatadataformultidropdown = this.hospitaldatadataformultidropdown.data;
      }
      console.log(this.hospitaldatadataformultidropdown);
    },
      (error) => console.log(error)
    )
  }
  onItemSelectfrhospital(item) {
    if (!this.hospitalistCodeList.includes(JSON.parse(JSON.stringify(item)).HospitalCode)) {
      this.hospitalistCodeList.push(JSON.parse(JSON.stringify(item)).HospitalCode);
    }
    if (!this.hospitalNameList.includes(JSON.parse(JSON.stringify(item)).HospitalName)) {
      this.hospitalNameList.push(JSON.parse(JSON.stringify(item)).HospitalName);
    }
  }
  onItemDeSelectfrhospital(item) {
    if (this.hospitalistCodeList.includes(JSON.parse(JSON.stringify(item)).HospitalCode)) {
      this.hospitalistCodeList.splice(this.hospitalistCodeList.indexOf(JSON.parse(JSON.stringify(item)).HospitalCode),
        1);
    }
    if (this.hospitalNameList.includes(JSON.parse(JSON.stringify(item)).HospitalName)) {
      this.hospitalNameList.splice(this.hospitalNameList.indexOf(JSON.parse(JSON.stringify(item)).HospitalName),
        1);
    }
    for (const element of this.hospitaldatadataformultidropdown) {
      if (item.HospitalCode == element.HospitalCode) {
        let index = this.hospitalistCodeList.indexOf(element);
        if (index !== -1) {
          this.hospitaldatadataformultidropdown.splice(index, 1);
        }
      }
    }
    for (const element of this.hospitaldatadataformultidropdown) {
      if (item.HospitalName == element.HospitalName) {
        let index = this.hospitalNameList.indexOf(element);
        if (index !== -1) {
          this.hospitalNameList.splice(index, 1);
        }
      }
    }
  }
  onSelectAllfrhospital(item) {
    for (const element of item) {
      if (!this.hospitalistCodeList.includes(JSON.parse(JSON.stringify(element)).HospitalCode)) {
        this.hospitalistCodeList.push(JSON.parse(JSON.stringify(element)).HospitalCode);
      }
    }
    for (const element of item) {
      if (!this.hospitalNameList.includes(JSON.parse(JSON.stringify(element)).HospitalName)) {
        this.hospitalNameList.push(JSON.parse(JSON.stringify(element)).HospitalName);
      }
    }
  }
  onDeSelectAllforhospital(item) {
    this.hospitalistCodeList = [];
    this.hospitalNameList = [];
  }

  list(hospList:any=[]){
    let hospital="";
      if(hospList.length==0){
        hospital="A";
      }else{
        for(const element of hospList){
          hospital=hospital+element+","
        }
      }
      return hospital;
  }
}
