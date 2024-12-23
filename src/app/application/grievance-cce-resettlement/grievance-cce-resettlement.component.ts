import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { HeaderService } from '../header.service';
import { CallCenterExecutiveService } from '../Services/call-center-executive.service';
import { SnoCLaimDetailsService } from '../Services/sno-claim-details.service';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import { Router } from '@angular/router';
import { ReportcountService } from '../Services/reportcount.service';
import Swal from 'sweetalert2';
import { TableUtil } from '../util/TableUtil';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-grievance-cce-resettlement',
  templateUrl: './grievance-cce-resettlement.component.html',
  styleUrls: ['./grievance-cce-resettlement.component.scss']
})
export class GrievanceCceResettlementComponent implements OnInit {
  months: string;
  year: number;
  user: any;
  getCceOutboundData: any;
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
    public fb: FormBuilder, private sessionService: SessionStorageService
  ) { }

  ngOnInit(): void {
    this.headerService.setTitle('CCE Resettlement');
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
    // this.getCountDetails();
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
    );
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
    // );
    this.selectedItems = [];
    this.selectedItems1 = [];
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
    this.selectedItems1 = [];
    var stateCode = localStorage.getItem("stateCode");
    this.snoService.getHospitalbyDistrictId(id, stateCode).subscribe(
      (response) => {

        this.hospitalList = response;
        console.log(response);
      },
      (error) => console.log(error)
    );
  }
  // outBoundData() {
  //   let userId = this.user.userId;
  //   let fromDate = $('#date1').val();
  //   let toDate = $('#date2').val();
  //   let action = 'A';
  //   let cceId = 0
  //   let hospitalCode=$('#hospital').val();
  //   this.dgoCallCenterService.getDgoCallCenterData(userId,action, fromDate, toDate, cceId,hospitalCode).subscribe((data: any) => {
  //     this.cceOutboundData = data;
  //     this.record = this.cceOutboundData.length;
  //     if (this.record > 0) {
  //       this.showPegi = true;
  //     }
  //     else {
  //       this.showPegi = false
  //     }
  //     console.log(data)
  //   })
  //   // this.getCountDetails();
  // }

  onSearch() {
    this.currentPage = 1;
    this.pageElement = 10;
    this.getPendingData();
    // this.getPendingDataCount();

  }

  getPendingData() {
    let fromDate = $('#date1').val();
    let toDate = $('#date2').val();
    let action = 'A';
    let stateCode = $('#stateId').val();
    let distCode = this.list(this.districtCodeList);
    let hospitalCode = this.list(this.hospitalistCodeList);
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

    this.callCenterExecutiveService.getCceResettleData(fromDate, toDate, stateCode, distCode, hospitalCode, action).subscribe(
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
          this.currentPage = 1;
          this.pageElement = 10;
        }
        else {
          this.showPegi = false
        }
        
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
  openHospDetails(item, flag) {
    this.rowDetails(item, flag)
  }

  resetField() {
    window.location.reload();
  }

 
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
    console.log(this.pageElement);
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
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
    for (var i = 0; i < this.goData.length; i++) {
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
      this.hed.dgoQueryRemarks = packageP.dgoQueryRemarks;
      this.hed.allottedDate = this.convertDate2(packageP.allottedDate);
      this.hed.admissionDate = this.convertDate2(packageP.admissionDate);
      this.hed.totalAmoutClaimed = packageP.totalAmoutClaimed;
      this.report.push(this.hed);
    }
    TableUtil.exportListToExcel(
      this.report, 'CCE Resettlement', this.heading
    );
  }
  //convert timestamp to date
convertDate(date) {
  var datePipe = new DatePipe("en-US");
  date = datePipe.transform(date, 'dd-MMM-yyyy, h:mm:ss a');
  return date;
  }
  convertDate2(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd/MM/yyyy');
    return date;
    }
  downloadPdf() {
    if(this.goData.length==0){
      this.swal('info', 'No record found', 'info');
      return;
    }
    else{
      var doc = new jsPDF('l', 'mm', [290, 255]);
      doc.setFontSize(12);
      doc.text("Generated On: "+this.convertDate(new Date()), 10, 10);
      doc.text("Generated By: "+this.user.fullName, 150, 10);
      doc.text("CCE Resettlement", 100, 20);
      var col =this.heading;
      var rows = [];
      var claim: any;
      for(var i=0;i<this.goData.length;i++) {
        claim = this.goData[i];
        var temp = [(i+1),claim.urn,claim.patientName,claim.status,claim.categoryName,
          claim.hospitalName,claim.executiveRemarks,claim.dcRemarks,
          claim.dgoRemarks,claim.dgoQueryRemarks,this.convertDate2(claim.allottedDate),this.convertDate2(claim.admissionDate),claim.totalAmoutClaimed];
          rows.push(temp);
      }
  
      autoTable(doc, {
        head: col,
        body: rows,
        theme: 'grid',
        startY: 30,
        styles: {overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20},
        bodyStyles: {overflow: 'linebreak',cellWidth: 'wrap',lineWidth: 0.1, lineColor: 0, textColor: 20},
        headStyles: {overflow: 'linebreak',cellWidth: 'wrap',lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255],fillColor: [26, 99, 54]},
        columnStyles: {
          0: {cellWidth: 10},
          1: {cellWidth: 20},
          2: {cellWidth: 20},
          3: {cellWidth: 20},
          4: {cellWidth: 20},
          5: {cellWidth: 20},
          6: {cellWidth: 20},
          7: {cellWidth: 20},
          8: {cellWidth: 20},
          9: {cellWidth: 30},
          10: {cellWidth: 20},
          11: {cellWidth: 20},
          12: {cellWidth: 20},
        },
      });
      doc.save('CCE Resettlement.pdf');
     }
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
