import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../header.service';
import { CallCenterExecutiveService } from '../Services/call-center-executive.service';
import Swal from 'sweetalert2';
import { SnoCLaimDetailsService } from '../Services/sno-claim-details.service';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import { TableUtil } from '../util/TableUtil';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ReportcountService } from '../Services/reportcount.service';
import { DatePipe } from '@angular/common';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-grievance-cce-view',
  templateUrl: './grievance-cce-view.component.html',
  styleUrls: ['./grievance-cce-view.component.scss']
})
export class GrievanceCCEViewComponent implements OnInit {

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
  stateList:any;
  districtList:any
  hospitalList:any
  selectedItems: any = [];
  goView: any;
  res: any;
  report: any[];
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

  hed: any = {
    slNo: '',
    urn: '',
    memberName: '',
    status:'',
    categoryName: '',
    hospitalName: '',
    executiveRemarks: '',
    dcRemarks: '',
    dgoRemarks: '',
    goRemarks: '',
    goQueryRemarks: '',
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
      'GO Query Remarks',
      'Date of Admission',
      'Total Amount Blocked'
    ],
  ];
  selectedItems1: any[];

  constructor(
    public headerService: HeaderService,
    private callCenterExecutiveService: CallCenterExecutiveService,
    public snoservice: SnoCLaimDetailsService,
    private reportcount: ReportcountService,
    private snoService: SnocreateserviceService, private sessionService: SessionStorageService
  ) { }

  ngOnInit(): void {
    this.headerService.setTitle('Call Center Executive');
    this.user =  this.sessionService.decryptSessionData("user");
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
    // this.getActionData();
    this.onSearch();
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

  onSearch() {
    this.pageElement=100;
    $('#pageItem').val(this.pageElement);
    this.pageIn=1;
    this.pageEnd=this.pageElement;
    this.selectedIndex = 1;
    this.getActionData();
  }

  getActionData() {
    let fromDate = $('#date1').val();
    let toDate = $('#date2').val();
    let action = 'B';
    let stateCode = $('#stateId').val();
    let distCode = this.list(this.districtCodeList);
    let hospitalCode=this.list(this.hospitalistCodeList);
    // let actionBy = $('#actionBy').val();
    // let pendingAt = $('#pendingAt').val();
    // let actionBy = "A";
    // let pendingAt = 'A';
    let status =  $('#status').val();
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
    // this.callCenterExecutiveService.getCceData(fromDate, toDate, hospitalCode, action).subscribe((data: any) => {
    this.callCenterExecutiveService.getCceDataView(fromDate, toDate, stateCode, distCode, hospitalCode, null, null, action, status, this.pageIn, this.pageEnd).subscribe(
      (data: any) => {
        this.goView = data.list;
        console.log(this.goView);
        this.goView.forEach((element)=>{
          element.allottedDate=this.convertDateFormat(element.allottedDate);
        })
        this.record = this.goView.length;
        if (this.record > 0) {
          this.showPegi = true;
        }
        else {
          this.showPegi = false
        }
        console.log(data)
      }
    )
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
  resetField() {
    window.location.reload();
  }

  // pageItemChange() {
  //   this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  // }

  pageItemChange() {
    this.pageElement = $("#pageItem").val();
    this.pageIn = 1;
    this.pageEnd = this.pageElement;
    this.selectedIndex = 1;
    this.getActionData();
  }

  paginate(element) {
    this.selectedIndex = element.id;
    this.pageIn = element.init;
    this.pageEnd = element.end;
    this.getActionData();
  }

  prev() {
    this.selectedIndex = this.selectedIndex - 1;
    this.pageIn = this.pageIn - this.pageElement;
    this.pageEnd = this.pageEnd - this.pageElement;
    this.getActionData();
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

  next() {
    this.selectedIndex = this.selectedIndex + 1;
    this.pageIn = +this.pageIn + +this.pageElement;
    this.pageEnd = +this.pageEnd + +this.pageElement;
    this.getActionData();
  }

  swal(title, text, icon) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  downloadList(){
    this.report = [];
    let packageP:any;
    for (var i = 0; i < this.goView.length; i++) {
      packageP = this.goView[i];
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
      this.hed.dgoQueryRemarks = packageP.dgoQueryRemarks;
      this.hed.goRemarks = packageP.goRemarks;
      this.hed.goQueryRemarks = packageP.goQueryRemarks;
      this.hed.admissionDate = packageP.admissionDate;
      this.hed.totalAmoutClaimed = packageP.totalAmoutClaimed;
      this.report.push(this.hed);
    }
    TableUtil.exportListToExcel(
      this.report, 'Call Center Executive In Grievance Officer', this.heading
    );
  }



                // Date         :-  05-09-2023
                // Modified By  :-  Rajendra prasad sahoo
                // purpose      :-  Adding MultiSelect Dropdown

  getdistrictlistformultidrodown() {
    this.selectedItems=[]
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

}
