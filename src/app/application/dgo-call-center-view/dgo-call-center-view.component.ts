import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../header.service';
import { CallCenterExecutiveService } from '../Services/call-center-executive.service';
import { SnoCLaimDetailsService } from '../Services/sno-claim-details.service';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import Swal from 'sweetalert2';
import { DgoCallCenterService } from '../Services/dgo-call-center.service';
import { TableUtil } from '../util/TableUtil';
import { DatePipe } from '@angular/common';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ReportcountService } from '../Services/reportcount.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-dgo-call-center-view',
  templateUrl: './dgo-call-center-view.component.html',
  styleUrls: ['./dgo-call-center-view.component.scss']
})
export class DgoCallCenterViewComponent implements OnInit {
  months: string;
  year: number;
  user: any;
  getCceOutboundData: any;
  cceOutboundData: any;
  currentPage: any;
  showPegi: boolean;
  record: any;
  pageElement: any;
  txtsearchDate: any;
  cceOutboundDataById: any;
  openDetails: boolean;
  dataDc: any;
  cceCountData: any;
  stateList: any;
  districtList: any
  hospitalList: any
  selectedItems: any = [];
  pageIn: number;
  pageEnd: number;
  size: number;
  pgElement: any;
  pgList: any = [];
  selectedIndex: number;
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
  selectedItems1: any[];
  first: number;
  last: number;
  newList: any = [];

  constructor(public headerService: HeaderService,
    private dgoCallCenterService: DgoCallCenterService,
    public snoservice: SnoCLaimDetailsService,
    private snoService: SnocreateserviceService,
    private reportcount: ReportcountService,
    private sessionService: SessionStorageService,
    public datepipe: DatePipe) { }

  report: any = [];
  callCenter: any = {
    slNo: "",
    urn: "",
    patientName: "",
    callResponse: "",
    activeStatus: "",
    hospitalstate: "",
    hospitalDist: "",
    hospitalName: "",
    CCERemarks: "",
    DCRemarks: "",
    DGORemarks: "",
    DGOQueryRemarks:"",
    GOQueryRemarks:"",
    dateOfAdm: "",
    alottedDate:"",
    amountBlocked: "",
  };
  heading = [['Sl No', 'URN', 'Patient Name', 'Call Response', 'Active Status', 'Hospital State', 'Hospital District', 'Hospital Name', 'CCE Remarks', 'DC Remarks', 'DGO Remarks', 'DGO Query Remarks','GO Query Remarks','Allotted Date','Date of Admission', 'Total Amount Blocked']];

  ngOnInit(): void {
    this.headerService.setTitle('Call Center View');
    this.user =  this.sessionService.decryptSessionData("user");
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
    //this.outBoundData();
    //this.getCountDetails();
    this.getStateList();
    this.dropdownSettingsfrdistrict = {
      singleSelection: false,
      idField: 'DistrictCode',
      textField: 'DistrictName',
      itemsShowLimit: 2,
      allowSearchFilter: true,
      selectAllText: 'Select All',
      unSelectAllText: "Un-Select All",
    };
    this.dropdownSettingsfrhospitalist = {
      singleSelection: false,
      idField: 'HospitalCode',
      textField: 'HospitalName',
      itemsShowLimit: 1,
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
    // $("#districtId").val("");
    // this.selectedItems = [];
    // localStorage.setItem("stateCode", id);
    // this.snoService.getDistrictListByStateId(id).subscribe(
    //   (response) => {
    //     this.districtList = response;
    //     console.log(response);
    //   },
    //   (error) => console.log(error)
    // )
    this.stateCodeList = [];
    this.districtCodeList = [];
    this.districtNamelist = [];
    this.hospitalistCodeList = [];
    this.hospitalNameList = [];
    this.districtlistdataformultidropdown = [];
    this.hospitaldatadataformultidropdown = [];
    this.stateCodeList.push(id);
    this.getdistrictlistformultidrodown();
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
  list(hospList:any=[]){
    let hospital="";
      if(hospList.length==0){
        hospital="A";
      }else{
        for(let i=0;i<hospList.length;i++){
          hospital=hospital+hospList[i]+","
        }
      }
      return hospital;
  }

  onSearch() {
    this.pageElement = 10;
    $('#pageItem').val(this.pageElement);
    this.pageIn = 1;
    this.pageEnd = this.pageElement;
    this.selectedIndex = 1;
    this.first = 0;
    this.last = 10;
    this.outBoundData();
  }
  outBoundData() {
    let userId = this.user.userId;
    let fromDate = $('#date1').val();
    let toDate = $('#date2').val();
    let action = 'D';
    let cceId = 0
    let hospitalCode = this.list(this.hospitalistCodeList);
    let queryStatus = $('#queryStatus').val();
    let stateCode = $('#stateId').val();
    let distCode = this.list(this.districtCodeList);
    if (Date.parse(fromDate) > Date.parse(toDate)) {
      this.swal('', ' From Date should be less To Date', 'error');
      return;
    }
    this.dgoCallCenterService.getDgoCallCenterData(userId, action, fromDate, toDate, cceId, hospitalCode,this.pageIn, this.pageEnd,queryStatus,stateCode,distCode).subscribe((data: any) => {
      this.size = data.size;
      this.cceOutboundData = data.list;
      this.cceOutboundData.forEach((element)=>{
        element.alottedDate=this.convertDateFormat(element.alottedDate);
      });
      this.record = this.cceOutboundData.length;
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
      var fst = this.first ? this.first : 0;
      var lst = this.last ? this.last : 10;
      if (this.pgList.length > 0) {
        if (lst > this.pgList[this.pgList.length - 1].id) {
          lst = this.pgList[this.pgList.length - 1].id;
        }
        for (var j = fst; j < lst; j++) {
          var elem = this.pgList[j];
          this.newList.push(elem);
        }
      }
      console.log(data)
    })
    //this.getCountDetails();
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
  getCountDetails() {
    let userId = this.user.userId;
    let fromDate = $('#date1').val();
    let toDate = $('#date2').val();
    let action = 'C';
    let cceId = 0
    let hospitalCode = ''
    let queryStatus = $('#queryStatus').val();
    let stateCode = $('#stateId').val();
    let distCode = $('#districtId').val();
    this.dgoCallCenterService.getDgoCallCenterData(userId, action, fromDate, toDate, cceId, hospitalCode,0,0,queryStatus,stateCode,distCode).subscribe((data: any) => {
      console.log(data[0])
      this.cceCountData = data[0];
    })
  }
  rowDetails(item, flag) {
    this.openDetails = true;
    let userId = this.user.userId;
    let fromDate = $('#date1').val();
    let toDate = $('#date2').val();
    let action = 'B';
    let cceId = item
    let hospitalCode = ''
    this.dgoCallCenterService.getDgoCallCenterData(userId, action, fromDate, toDate, cceId, hospitalCode,0,0,null,null,null).subscribe((data: any) => {
      let list: any[] = data.list;
      this.cceOutboundDataById = list[0];
      this.cceOutboundDataById.alottedDate=this.convertDateFormat(this.cceOutboundDataById.alottedDate);
      console.log(this.cceOutboundDataById)
    })
  }
  // openHospDetails(item, flag) {
  //   this.rowDetails(item, flag)
  // }
  resetField() {
    window.location.reload();
  }
  pageItemChange() {
    this.pageElement = $("#pageItem").val();
    this.pageIn = 1;
    this.pageEnd = this.pageElement;
    this.selectedIndex = 1;
    this.outBoundData();
  }

  paginate(element) {
    this.selectedIndex = element.id;
    this.pageIn = element.init;
    this.pageEnd = element.end;
    this.outBoundData();
  }

  prev() {
    this.selectedIndex = this.selectedIndex - 1;
    this.pageIn = this.pageIn - this.pageElement;
    this.pageEnd = this.pageEnd - this.pageElement;
    this.outBoundData();
  }

  next() {
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
    this.pageIn = this.newList[0].init - this.pageElement * 10;
    this.pageEnd = this.newList[0].end - this.pageElement * 10;
    this.outBoundData();
  }
  nextlist() {
    var lst = +this.newList[this.newList.length - 1].id;
    this.first = lst;
    this.last = lst + 10;

    this.selectedIndex = lst + 1;
    this.pageIn = +this.newList[this.newList.length - 1].init + +this.pageElement;
    this.pageEnd = +this.newList[this.newList.length - 1].end + +this.pageElement;
    this.outBoundData();
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
      target = $(target);
      let anchor = target.parent();
      anchor = anchor.get(0);

      if (fileName != null) {
        // let img = this.snoservice.downloadFile(fileName, hCode, dateOfAdm);
        // window.open(img, '_blank');
        this.snoservice.downloadFiles(fileName, hCode, dateOfAdm).subscribe(
          (response: any) => {
            var result = response;
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
  downloadReport() {
    this.report = [];
    let item: any;
    for (var i = 0; i < this.cceOutboundData.length; i++) {
      item = this.cceOutboundData[i];
      console.log(item);
      this.callCenter = [];
      this.callCenter.slNo = i + 1;
      this.callCenter.urn = item.urn;
      this.callCenter.patientName = item.patientName;
      this.callCenter.callResponse = item.callResponse ? item.callResponse : '-NA-';
      this.callCenter.activeStatus = item.mobileActiveStatus ? item.mobileActiveStatus : '-NA-';
      this.callCenter.hospitalstate = item.state ? item.state : '-NA-';
      this.callCenter.hospitalDist = item.districtName ? item.districtName : '-NA-';
      this.callCenter.hospitalName = item.hospitalName ? item.hospitalName : '-NA-';
      this.callCenter.CCERemarks = item.executiveRemarks ? item.executiveRemarks : '-NA-';
      this.callCenter.DCRemarks = item.dcRemarks ? item.dcRemarks : '-NA-';
      this.callCenter.DGORemarks = item.dgoRemarks ? item.dgoRemarks : '-NA-';
      this.callCenter.DGOQueryRemarks = item.dgoQueryRemarks ? item.dgoQueryRemarks : '-NA-';
      this.callCenter.GOQueryRemarks = item.goQueryRemarks ? item.goQueryRemarks : '-NA-';
      this.callCenter.alottedDate = this.datepipe.transform(item.alottedDate, 'dd-MMM-yyyy');
      this.callCenter.dateOfAdm = this.datepipe.transform(item.dateOfAdm, 'dd-MMM-yyyy');
      this.callCenter.amountBlocked = item.totalAmountBlocked ? item.totalAmountBlocked : '-NA-';
      this.report.push(this.callCenter);
      console.log(this.report);
    }
    TableUtil.exportListToExcel(this.report, "DGO Call Center Details", this.heading);
  }

                // Date         :-  05-09-2023
                // Modified By  :-  Rajendra prasad sahoo
                // purpose      :-  Adding MultiSelect Dropdown

  getdistrictlistformultidrodown() {
    this.selectedItems=[];
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
    for (var i = 0; i < this.districtlistdataformultidropdown.length;
      i++) {
      if (item.DistrictCode == this.districtlistdataformultidropdown[i].DistrictCode) {
        var index = this.districtCodeList.indexOf(this.districtlistdataformultidropdown[i]);
        if (index !== -1) {
          this.districtlistdataformultidropdown.splice(index, 1);
        }
      }
    }
    for (var i = 0; i < this.districtlistdataformultidropdown.length;
      i++) {
      if (item.DistrictName == this.districtlistdataformultidropdown[i].DistrictName) {
        var index = this.districtNamelist.indexOf(this.districtlistdataformultidropdown[i]);
        if (index !== -1) {
          this.districtNamelist.splice(index, 1);
        }
      }
    }
  }
  onSelectAllfrdistrict(item) {
    for (var i = 0; i < item.length; i++) {
      if (!this.districtCodeList.includes(JSON.parse(JSON.stringify(item[i])).DistrictCode)) {
        this.districtCodeList.push(JSON.parse(JSON.stringify(item[i])).DistrictCode);
      }
    }
    for (var i = 0; i < item.length; i++) {
      if (!this.districtNamelist.includes(JSON.parse(JSON.stringify(item[i])).DistrictName)) {
        this.districtNamelist.push(JSON.parse(JSON.stringify(item[i])).DistrictName);
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
    this.selectedItems1=[];
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
    for (var i = 0; i < this.hospitaldatadataformultidropdown.length;
      i++) {
      if (item.HospitalCode == this.hospitaldatadataformultidropdown[i].HospitalCode) {
        var index = this.hospitalistCodeList.indexOf(this.hospitaldatadataformultidropdown[i]);
        if (index !== -1) {
          this.hospitaldatadataformultidropdown.splice(index, 1);
        }
      }
    }
    for (var i = 0; i < this.hospitaldatadataformultidropdown.length;
      i++) {
      if (item.HospitalName == this.hospitaldatadataformultidropdown[i].HospitalName) {
        var index = this.hospitalNameList.indexOf(this.hospitaldatadataformultidropdown[i]);
        if (index !== -1) {
          this.hospitalNameList.splice(index, 1);
        }
      }
    }
  }
  onSelectAllfrhospital(item) {
    for (var i = 0; i < item.length; i++) {
      if (!this.hospitalistCodeList.includes(JSON.parse(JSON.stringify(item[i])).HospitalCode)) {
        this.hospitalistCodeList.push(JSON.parse(JSON.stringify(item[i])).HospitalCode);
      }
    }
    for (var i = 0; i < item.length; i++) {
      if (!this.hospitalNameList.includes(JSON.parse(JSON.stringify(item[i])).HospitalName)) {
        this.hospitalNameList.push(JSON.parse(JSON.stringify(item[i])).HospitalName);
      }
    }
  }
  onDeSelectAllforhospital(item) {
    this.hospitalistCodeList = [];
    this.hospitalNameList = [];
  }

}
