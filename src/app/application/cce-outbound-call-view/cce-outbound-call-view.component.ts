import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../header.service';
import { CallCenterExecutiveService } from '../Services/call-center-executive.service';
import Swal from 'sweetalert2';
import { SnoCLaimDetailsService } from '../Services/sno-claim-details.service';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import { DatePipe } from '@angular/common';
import { TableUtil } from '../util/TableUtil';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ReportcountService } from '../Services/reportcount.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-cce-outbound-call-view',
  templateUrl: './cce-outbound-call-view.component.html',
  styleUrls: ['./cce-outbound-call-view.component.scss']
})
export class CceOutboundCallViewComponent implements OnInit {
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
  report: any = [];
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


  callCenter: any = {
    slNo: "",
    urn: "",
    patientName: "",
    patientPhoneNo: "",
    districtName: "",
    blockName: "",
    panchayatName: "",
    villageName: "",
    callResponse: "",
    mobileActiveStatus: "",
    hospitalstate:"",
    hospitalDist: "",
    hospitalName: "",
    procedureName: "",
    packageName: "",
    invoiceNo: "",
    alottedDate: "",
    alterPhoneNo: "",
    id: "",
    cceRemarks: "",
    dcRemarks: "",
    DGOQueryRemarks:"",
    dateOfAdm: "",
    amountBlocked: "",
    question1: "",
    question2: "",
    question3: "",
    question4: "",
  };
  heading = [['Sl No', 'URN', 'Patient Name', 'Patient PhoneNo','District Name','Block Name','Panchayat Name','Village Name','Call Response', 'MobileNo Active Status', 'Hospital State', 'Hospital District', 'Hospital Name', 'Procedure Name', 'Package Name', 'Invoice No', 'Alloted Date', 'Alternate PhoneNo', 'ID', 'DateOf Admission', 'Total Amount Blocked', 'Are you receiving cashless treatment under GJAY', 'Are you satisfied with service? ', 'Whether you have paid any extra money for treatment under GJAY', 'Did Swasthya Mitra facilitate your care?', 'CCE Remarks', 'DC Remarks','DGO Query Remarks']];
  distCode: any;
  userId: any;
  stateCode: any;
  selectedItems1: any[];


  constructor(public headerService: HeaderService,
    private callCenterExecutiveService: CallCenterExecutiveService,
    public snoservice: SnoCLaimDetailsService,
    private snoService: SnocreateserviceService,
    private reportcount: ReportcountService,
    private sessionService: SessionStorageService,
    public datepipe: DatePipe) { }

  ngOnInit(): void {
    this.headerService.setTitle('CCE OutBound Call View');
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
    this.onSearch();
    this.getCountDetails();
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
  getStateList() {
    this.snoService.getStateList().subscribe(
      (response) => {
        this.stateList = response;
        console.log(this.stateList);
      },
      (error) => console.log(error)
    )
  }
  // OnChangeState(id) {
  //   $("#districtId").val("");
  //   this.selectedItems = [];
  //   localStorage.setItem("stateCode", id);
  //   this.snoService.getDistrictListByStateId(id).subscribe(
  //     (response) => {
  //       this.districtList = response;
  //       console.log(response);
  //     },
  //     (error) => console.log(error)
  //   )
  // }
  // OnChangeDistrict(id) {
  //   this.selectedItems = [];
  //   var stateCode = localStorage.getItem("stateCode");
  //   this.snoService.getHospitalbyDistrictId(id, stateCode).subscribe(
  //     (response) => {

  //       this.hospitalList = response;
  //       console.log(response);
  //     },
  //     (error) => console.log(error)
  //   )
  // }
  OnChangeState(event) {
    this.stateCode = event.target.value;
    // this.userId = this.user.userId;
    // this.callCenterExecutiveService
    //   .getDistrictListByStateDC(this.userId, this.stateCode)
    //   .subscribe((data) => {
    //     this.districtList = data;
    //     // this.districtList.sort((a, b) =>
    //     //   a.DISTRICTNAME.localeCompare(b.DISTRICTNAME)
    //     // );
    //     console.log(data);
    //   });
    this.stateCodeList = [];
    this.districtCodeList = [];
    this.districtNamelist = [];
    this.hospitalistCodeList = [];
    this.hospitalNameList = [];
    this.districtlistdataformultidropdown = [];
    this.hospitaldatadataformultidropdown = [];
    this.stateCodeList.push(this.stateCode);
    this.getdistrictlistformultidrodown();
  }

  OnChangeDistrict(event) {
    this.distCode = event.target.value;
    this.userId = this.user.userId;
    this.callCenterExecutiveService
      .getHospitalListByDc(this.userId, this.stateCode, this.distCode)
      .subscribe((data) => {
        this.hospitalList = data;
        console.log(data);
      });
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
    let fromDate = $('#date1').val();
    let toDate = $('#date2').val();
    let action = 'D';
    let cceId = 0
    let queryStatus = $('#queryStatus').val();
    let hospitalCode = this.list(this.hospitalistCodeList);
    let stateCode = $('#stateId').val();
    let distCode = this.list(this.districtCodeList);
    if (Date.parse(fromDate) > Date.parse(toDate)) {
      this.swal('', ' From Date should be less To Date', 'error');
      return;
    }
    this.callCenterExecutiveService.getCceOutBound(action, userId, fromDate, toDate, cceId, hospitalCode, this.pageIn, this.pageEnd
      ,queryStatus,stateCode,distCode).subscribe((data: any) => {
      this.size = data.size;
      this.cceOutboundData = data.list;
      this.cceOutboundData.forEach((element)=>{
        element.alottedDate=this.convertDateFormat(element.alottedDate);
      })
      this.record = this.cceOutboundData?.length;
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
      console.log(data)
    })
    this.getCountDetails();
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
    let hospitalCode = this.list(this.hospitalistCodeList);
    let queryStatus = $('#queryStatus').val();
    let stateCode = $('#stateId').val();
    let distCode = this.list(this.districtCodeList);
    this.callCenterExecutiveService.getCceOutBound(action, userId, fromDate, toDate, cceId, hospitalCode, 0, 0
      ,queryStatus,stateCode,distCode).subscribe((data: any) => {
      console.log(data.list[0])
      this.cceCountData = data.list[0];
    })
  }
  rowDetails(item, flag) {
    // this.openDetails = true;
    let userId = this.user.userId;
    let fromDate = $('#date1').val();
    let toDate = $('#date2').val();
    let action = 'B';
    let cceId = item
    let hospitalCode = ''
    let queryStatus = ''
    this.callCenterExecutiveService.getCceOutBound(action, userId, fromDate, toDate, cceId, hospitalCode, 0, 0,queryStatus,null,null).subscribe((data: any) => {
      let list: any[] = data.list;
      this.cceOutboundDataById = list[0];
      this.cceOutboundDataById.alottedDate=this.convertDateFormat(this.cceOutboundDataById.alottedDate);
      console.log(this.cceOutboundDataById)
    })
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
      // console.log(item);

      this.callCenter = [];
      this.callCenter.slNo = i + 1;
      this.callCenter.urn = item.urn ? item.urn : '-NA-';
      this.callCenter.patientName = item.patientName ? item.patientName : '-NA-';
      this.callCenter.patientPhoneNo = item.mobileNo ? item.mobileNo : '-NA-';
      this.callCenter.districtName = item.districtName ? item.districtName : '-NA-';
      this.callCenter.blockName = item.blockName ? item.blockName : '-NA-';
      this.callCenter.panchayatName = item.panchayatName ? item.panchayatName : '-NA-';
      this.callCenter.villageName = item.villageName ? item.villageName : '-NA-';
      this.callCenter.callResponse = item.callResponse ? item.callResponse : '-NA-';
      this.callCenter.mobileActiveStatus = item.mobileActiveStatus ? item.mobileActiveStatus : '-NA-';
      this.callCenter.hospitalstate = item.state;
      this.callCenter.hospitalDist = item.hospitalDist ? item.hospitalDist : '-NA-';
      this.callCenter.hospitalName = item.hospitalName ? item.hospitalName : '-NA-';
      this.callCenter.procedureName = item.procedureName ? item.procedureName : '-NA-';
      this.callCenter.packageName = item.packageName ? item.packageName : '-NA-';
      this.callCenter.invoiceNo = item.invoiceNo ? item.invoiceNo : '-NA-';
      this.callCenter.alottedDate = item.alottedDate ? item.alottedDate : '-NA-'
      this.callCenter.alterPhoneNo = item.alternativeNo ? item.alternativeNo : '-NA-';
      this.callCenter.id = item.transId ? item.transId : '-NA-';
      this.callCenter.dateOfAdm = this.datepipe.transform(item.dateOfAdm, 'dd-MMM-yyyy');
      this.callCenter.amountBlocked = item.totalAmountBlocked ? item.totalAmountBlocked : '-NA-';
      this.callCenter.question1 = item.question1Response ? item.question1Response : '-NA-';
      this.callCenter.question2 = item.question2Response ? item.question2Response : '-NA-';
      this.callCenter.question3 = item.question3Response ? item.question3Response : '-NA-';
      this.callCenter.question4 = item.question4Response ? item.question4Response : '-NA-';
      this.callCenter.cceRemarks = item.executiveRemarks ? item.executiveRemarks : '-NA-';
      this.callCenter.dcRemarks = item.dcRemarks ? item.dcRemarks : '-NA-';
      this.callCenter.DGOQueryRemarks = item.dgoQueryRemarks ? item.dgoQueryRemarks : '-NA-';
      console.log(this.callCenter);

      this.report.push(this.callCenter);
    }
    TableUtil.exportListToExcel(this.report, "CCE OutBound Call", this.heading);
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
    this.reportcount.getdcwisehospitallistformultidrodown(this.stateCodeList, this.districtCodeList,this.user.userId).subscribe((data: any) => {
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
