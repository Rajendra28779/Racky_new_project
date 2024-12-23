import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderService } from '../../header.service';
import { MnthWiseDischargeMeService } from '../../Services/mnth-wise-discharge-me.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
declare let $: any;
import { environment } from 'src/environments/environment';
import { TableUtil } from '../../util/TableUtil';
import autoTable, { Cell, Column } from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { CurrencyPipe, DatePipe, formatDate } from '@angular/common';
import { ClaimRaiseServiceService } from '../../Services/claim-raise-service.service';
import { format } from 'path';
import { execFile } from 'child_process';
import * as Excel from "exceljs/dist/exceljs.min.js";
import { debug } from 'console';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-mnth-wise-discharge-me',
  templateUrl: './mnth-wise-discharge-me.component.html',
  styleUrls: ['./mnth-wise-discharge-me.component.scss']
})
export class MnthWiseDischargeMeComponent implements OnInit {
  @ViewChild('auto') auto;
  @ViewChild('autocopy') autocopy;
  stickyear: any;
  searchby: any;
  selectedYear: any;
  years: any[] = [];
  Months: any;
  txtsearchDate: any;
  hospitalWisePackage: any = [];
  showPegi: boolean;
  pageElement: any;
  currentPage: any;
  user: any;
  selectedItems: any = [];
  stateList: any = [];
  districtList: any = [];
  hospitalList: any;
  hospitalCode: any;
  fromdate: any;
  todate: any;
  keyword: any = 'hospitalName';
  record: any = 0;
  stat: any;
  dist: any;
  showsdh: any = true;
  gramwisedata: any = [];
  showdropdown: any;
  showdischarge: any;
  userId: any;
  hospitalname: any = 'All';
  name: any;
  data: any;
  valuedata: string;
  statename: any = 'All';
  districtName: any = 'All';
  searchName: string;
  public serachdata: any = [];
  packagenamedata: any
  packageName: any;
  totaldays: number;
  dump: any;
  hospitalwise: any;
  documentType: any;
  statu: any;
  statusFlag: any;
  showSearch: any = 1;
  constructor(private mnthWiseDischargeMeService: MnthWiseDischargeMeService,
    public headerService: HeaderService,
    private snoService: SnocreateserviceService,private sessionService: SessionStorageService,
    private route: Router, public fb: FormBuilder, private LoginServ: ClaimRaiseServiceService) { }
  form: FormGroup;
  ngOnInit(): void {
    // this.user = JSON.parse(sessionStorage.getItem("user"));
    this.user = this.sessionService.decryptSessionData("user");
    this.userId = this.user.userId;
    this.form = this.fb.group({
      name: new FormControl(''),
    })
    this.headerService.setTitle('Download Discharge and Admission Dump Report');
    // this.user = JSON.parse(sessionStorage.getItem("user"));
    this.user = this.sessionService.decryptSessionData("user");
    if (this.user.groupId == 4) {
      this.name = this.user.fullName;
      this.showdropdown = true;
    } else {
      this.showdropdown = false;
    }
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
    this.getStateList();
    this.hospitalCode = null;
    $('#admission').hide();
    $('#discharge').hide();
    $('#tableopen').hide();
  }

  getPackageName(event: any) {
    for (let i = 0; i < this.serachdata.length; i++) {
      if (this.serachdata[i].id == event) {
        this.packageName = this.serachdata[i].procedurecode;
        this.LoginServ.getdatapackgaename(this.packageName).subscribe(data => {
          this.packagenamedata = data;
        });
      }
    }
  }

  Inclusionofsearchingforpackagedetails() {
    this.LoginServ.getsearcdetails().subscribe(data => {
      this.serachdata = data;
    });
  }

  time() {
    this.hospitalWisePackage = ''
    let serchtype = $('#search').val();
    if (serchtype == 2) {
      $('#admission').show();
      $('#discharge').hide();
      this.valuedata = 'Total Number of Admission'
    } else {
      this.hospitalWisePackage = ''
      $('#admission').hide();
      $('#discharge').show();
      this.valuedata = 'Total Number of Discharge'
    }
  }

  getStateList() {
    this.snoService.getStateList().subscribe(
      (response) => {
        this.stateList = [];
        this.stateList = response;
        this.record = this.stateList.length;
      },
      (error) => console.log(error)
    )
  }

  OnChangeState(id) {
    $("#districtId").val("");
    this.auto.clear();
    this.hospitalCode = "";
    this.selectedItems = [];
    localStorage.setItem("stateCode", id);
    this.snoService.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = [];
        this.districtList = response;
      },
      (error) => console.log(error)
    )
  }
  OnChangeDistrict(id) {
    this.auto.clear();
    this.hospitalCode = "";
    this.selectedItems = [];
    var stateCode = localStorage.getItem("stateCode");
    this.snoService.getHospitalbyDistrictId(id, stateCode).subscribe(
      (response) => {
        this.hospitalList = [];
        this.hospitalList = response;
      },
      (error) => console.log(error)
    )
  }
  serchtype: any;
  search() {
    this.hospitalWisePackage = ''
    let userId = this.user.userId;
    this.serchtype = $('#search').val();
    let fromDate = $('#fromDate').val();
    let toDate = $('#toDate').val();
    this.fromdate = new Date(fromDate);
    this.todate = new Date(toDate);
    this.fromdate = this.fromdate.getTime();
    this.todate = this.todate.getTime();
    let singleDay = 1000 * 60 * 60 * 24;
    this.totaldays = (this.todate - this.fromdate) / singleDay + 1;
    let stateId = $('#stateId').val();
    let districtId = $('#districtId').val();
    let searchFrom = $('#searchFrom').val();
    if (this.serchtype == '' || this.serchtype == null || this.serchtype == undefined) {
      this.swal('', 'Please Select Search Type', 'error');
      return;
    }
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
    if (this.showhide == 1) {
      if (this.totaldays > 31) {
        this.swal('', 'You can Search maximum 31 days', 'error');
        return;
      }
      if (stateId == null || stateId == "" || stateId == undefined) {
        this.swal("Info", "Please Select State", 'info');
        return;
      }
      if (districtId == null || districtId == "" || districtId == undefined) {
        this.swal("Info", "Please Select District", 'info');
        return;
      }
    }
    if (this.showhide == 2) {
      if (this.totaldays > 10) {
        this.swal('', 'You can Search maximum 10 days', 'error');
        return;
      }
    }
    if (stateId == undefined) {
      stateId = "";
    }
    if (districtId == undefined) {
      districtId = "";
    }
    if (this.hospitalCode == undefined) {
      this.hospitalCode = "";
    }
    this.stat = stateId;
    this.dist = districtId;
    this.fromdate = fromDate;
    this.todate = toDate;
    this.mnthWiseDischargeMeService.monthWiseDischargeMeData(userId, this.fromdate, this.todate, this.stat, this.dist, this.hospitalCode, this.serchtype).subscribe(
      (result) => {
        $('#tableopen').show();
        this.hospitalWisePackage = result;
      },
      (error) => console.log(error)
    )
  }

  selectEvent1(item) {
    this.hospitalCode = "";
    this.hospitalCode = item.hospitalCode;
    this.hospitalname = item.hospitalName;
  }
  onReset2() {
    this.hospitalCode = "";
    this.hospitalname = "All";
  }
  view() {
    this.statename = 'All';
    this.districtName = 'All';
    this.hospitalname = 'All';
    if (this.hospitalWisePackage.countData > 20000) {
      return;
    }
    for (let i = 0; i < this.stateList.length; i++) {
      if (this.stateList[i].stateCode == this.stat) {
        this.statename = this.stateList[i].stateName
      }
    }
    for (let i = 0; i < this.districtList.length; i++) {
      if (this.districtList[i].districtcode == this.dist) {
        this.districtName = this.districtList[i].districtname;
      }
    }
    for (let i = 0; i < this.hospitalList; i++) {
      if (this.hospitalCode == this.hospitalList[i].hospitalCode) {
        this.hospitalname = this.hospitalList[i].hospitalName;
      }
    }
    if (this.serchtype == 1) {
      this.searchName = "Discharge";
    } else {
      this.searchName = "Admission";
    }
    if (this.showhide == 1) {
      this.showSearch = "Hospital Wise";
    } else {
      this.showSearch = "Dump";
    }
    localStorage.setItem("serchtype", this.serchtype)
    localStorage.setItem("stat", this.stat)
    localStorage.setItem("dist", this.dist)
    localStorage.setItem("hospitalCode", this.hospitalCode)
    localStorage.setItem("formDate", this.fromdate)
    localStorage.setItem("toDate", this.todate)
    localStorage.setItem("searchName", this.searchName)
    localStorage.setItem("stateName", this.statename)
    localStorage.setItem("distName", this.districtName)
    localStorage.setItem("hospitalName", this.hospitalname);
    localStorage.setItem("showhide", this.showSearch)
    this.route.navigate([]).then(result => {
      window.open(environment.routingUrl + '/downloaddischargeadmiisiondumpdetails');
    });
  }

  getReset() {
    window.location.reload();
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  heading = [['Sl No.', 'URN', 'Invoice No.', 'State Name', 'District Name', 'Hospital Name', 'Hospital Code', 'Patient Name', 'Package Header', 'Procedure Name', 'Package  Code',
    'Package Name', 'IS Pre Auth ', 'Actual Date of Admission', 'Date of Blocking', 'Total Package Cost',
    'Blocked Amount', 'Surgical Type', 'Verification Mode']];

  showhide: any = 1;
  findStatus(event: any) {
    this.statename = '';
    this.districtName = '';
    $('#tableopen').hide();
    $('#stateId').val('');
    $('#districtId').val('');
    this.hospitalCode = "";
    this.hospitalname = "";
    this.showhide = event;
    this.showSearch = this.showhide;
  }

  heading1 = [['Sl No.', 'URN', 'Claim No.', 'Invoice No.', 'Hospital State Name', 'Hospital District Name', 'Hospital Name', 'Hospital Code', 'Patient Name', 'Patient No.', 'Gender', 'Age', 'Family Header',
    'Verifier Name ', 'Patient State Name', 'Patient District Name', 'Patient Block Name', 'Patient Panchayat Name', 'Patient Village Name', 'Transactio Type', 'Transaction Date', 'Fund Available', 'No. of Days', 'Mortality', 'Actual Admission', 'Actual Discharge',
    'Package Header', 'Procedure Name', 'Package Code', 'Package Name,', 'CPD Remark', 'SNA Remark', 'CPD Approved Amount', 'SNA Approved Amount', 'Hospital Claimed Amount']];

  packageCodedata: any;
  download() {
    this.statename = 'All';
    this.districtName = 'All';
    this.hospitalname = 'All';
    this.showhide = "";
    let date = formatDate(new Date(), 'yyyyMMddhhmmssa', 'en-US');
    let fileName = '';
    let file: File;
    var options = {
      filename: './streamed-workbook.xlsx',
      useStyles: true,
      useSharedStrings: true
    };
    let workbook = new Excel.Workbook(options);
    var worksheet = workbook.addWorksheet('Sheet 1');
    if (this.serchtype == 1) {
      this.searchName = "Discharge";
    } else {
      this.searchName = "Admission";
    }
    for (let i = 0; i < this.stateList.length; i++) {
      if (this.stateList[i].stateCode == this.stat) {
        this.statename = this.stateList[i].stateName
      }
    }
    for (let i = 0; i < this.districtList.length; i++) {
      if (this.districtList[i].districtcode == this.dist) {
        this.districtName = this.districtList[i].districtname;
      }
    }
    worksheet.addRow(['Search Type', this.searchName]);
    worksheet.addRow(['From Date', this.fromdate]);
    worksheet.addRow(['To Date', this.todate]);
    worksheet.addRow(['State Name', this.statename]);
    worksheet.addRow(['District Name', this.districtName]);
    worksheet.addRow(['Hospital Name ', this.hospitalname]);
    if (this.showSearch == 1) {
      this.showSearch = "Hospital Wise";
    } else {
      this.showSearch = "Dump";
    }
    worksheet.addRow(['Search For Record', this.showSearch]);
    worksheet.addRow(['Generated By', this.user.fullName]);
    worksheet.addRow(['Generated On', formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString()]);
    if (this.serchtype == 1) {
      worksheet.addRow(this.heading1[0]);
    } else {
      worksheet.addRow(this.heading[0]);
    }
    if (this.serchtype == 1) {
      for (var i = 0; i < this.gramwisedata.length; i++) {
        let rowData = [];
        rowData.push(i + 1);
        rowData.push(this.gramwisedata[i].urn);
        rowData.push(this.gramwisedata[i].claimid);
        rowData.push(this.gramwisedata[i].invoiceNo);
        rowData.push(this.gramwisedata[i].hosstateName);
        rowData.push(this.gramwisedata[i].hosdistrictName);
        rowData.push(this.gramwisedata[i].hospitalName);
        rowData.push(this.gramwisedata[i].hospitalCode);
        rowData.push(this.gramwisedata[i].patientName);
        rowData.push(this.gramwisedata[i].patientNo);
        rowData.push(this.gramwisedata[i].gender);
        rowData.push(this.gramwisedata[i].age);
        rowData.push(this.gramwisedata[i].familyHeader);
        rowData.push(this.gramwisedata[i].varyfyName);
        rowData.push(this.gramwisedata[i].pStateName);
        rowData.push(this.gramwisedata[i].pDistName);
        rowData.push(this.gramwisedata[i].pBlockName);
        rowData.push(this.gramwisedata[i].pPanchytName);
        rowData.push(this.gramwisedata[i].pVilName);
        rowData.push(this.gramwisedata[i].transactionType);
        rowData.push(this.convertDate1(this.gramwisedata[i].transactionDate));
        rowData.push(this.gramwisedata[i].fundBalance);
        rowData.push(this.gramwisedata[i].noOfDays);
        rowData.push(this.gramwisedata[i].mortality);
        rowData.push(this.gramwisedata[i].actualDateAdmission);
        rowData.push(this.convertDate1(this.gramwisedata[i].actualDateDischarge));
        rowData.push(this.gramwisedata[i].packageCategCode);
        rowData.push(this.gramwisedata[i].procedureName);
        rowData.push(this.gramwisedata[i].packageCode);
        rowData.push(this.gramwisedata[i].packageName);
        rowData.push(this.gramwisedata[i].cpdRemark);
        rowData.push(this.gramwisedata[i].snaRemark);
        rowData.push(this.convertCurrency(this.gramwisedata[i].cpdApprovedAmt));
        rowData.push(this.convertCurrency(this.gramwisedata[i].snaApprovedAmt));
        rowData.push(this.convertCurrency(this.gramwisedata[i].hospitalClaimAmt));
        worksheet.addRow(rowData);
      }
    } else {
      for (var i = 0; i < this.gramwisedata.length; i++) {
        let rowData = [];
        rowData.push(i + 1);
        rowData.push(this.gramwisedata[i].urn);
        rowData.push(this.gramwisedata[i].invoiceNo);
        rowData.push(this.gramwisedata[i].stateName);
        rowData.push(this.gramwisedata[i].districtName);
        rowData.push(this.gramwisedata[i].hospitalName);
        rowData.push(this.gramwisedata[i].hospitalCode);
        rowData.push(this.gramwisedata[i].patientName);
        rowData.push(this.gramwisedata[i].packageSubCatg);
        rowData.push(this.gramwisedata[i].procedureName);
        rowData.push(this.gramwisedata[i].packageCode);
        rowData.push(this.gramwisedata[i].packageName);
        rowData.push(this.gramwisedata[i].isPreAuth);
        rowData.push(this.gramwisedata[i].actualDateAdmission);
        rowData.push(this.gramwisedata[i].dateOfAdmission);
        rowData.push(this.convertCurrency(this.gramwisedata[i].totalPackageCost));
        rowData.push(this.convertCurrency(this.gramwisedata[i].blockedAmt));
        rowData.push(this.gramwisedata[i].surgicalType);
        rowData.push(this.gramwisedata[i].varificationMode);
        worksheet.addRow(rowData);
      }
    }
    worksheet.columns.forEach(column => {
      const lengths = column.values.map(v => v.toString().length);
      const maxLength = Math.max(...lengths.filter(v => typeof v === 'number'));
      column.width = maxLength + 3;
    });
    worksheet.autoFilter = {
      from: 'A9',
      to: 'Y9'
    }
    var row = worksheet.getRow(9);
    row.eachCell(function (cell, colNumber) {
      if (cell.value) {
        row.getCell(colNumber).fill = { type: 'pattern', pattern: 'darkVertical', bgColor: { argb: "FF32CD32" } };
        row.getCell(colNumber).font = { name: 'Calibri', bold: true, color: { argb: "FFFFFFFF" } };
      }
    });
    fileName = 'GJAY_Discharge_And Admission_Dump_Report_' + date + '.xlsx';
    const excelBuffer: any = workbook.xlsx.writeBuffer();
    workbook.xlsx.writeBuffer().then(
      (buffer) => {
        const data = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        file = new File([data], fileName);
        var formData = new FormData();
        formData.append('pdf', file);
        this.mnthWiseDischargeMeService.saveDischargeReport(formData).subscribe(
          (data: any) => {
            if (data.status == 200) {
              this.downlorddoc(fileName);
            } else {
              this.swal('Error', 'Some error happened', 'error');
            }
          }
        );
      }
    );
  }

  convertDate1(actualDateAdmission) {
    var datePipe = new DatePipe("en-US");
    actualDateAdmission = datePipe.transform(actualDateAdmission, 'dd-MMM-yyyy');
    return actualDateAdmission;
  }

  convertCurrency(cpdApprovedAmt: any) {
    var formatter = new CurrencyPipe('en-US');
    cpdApprovedAmt = formatter.transform(cpdApprovedAmt, '', '');
    return cpdApprovedAmt;
  }

  fileToUpload: any;
  downlorddoc(file: any) {
    if (file != null && file != '' && file != undefined) {
      let img = this.mnthWiseDischargeMeService.downloadDischargeReport(file);
      window.open(img, '_blank');
    } else {
      this.swal('Info', 'Please Select File', 'info');
    }
  }

  getcountlist() {
    let Package = this.packageName;
    this.packageCodedata = $('#Package').val();
    let packageName = $('#PackageName').val();
    let userId = this.user.userId;
    if (Package == undefined) {
      Package = '';
    }
    if (packageName == null || packageName == undefined || packageName == '') {
      packageName = '';
    }
    this.mnthWiseDischargeMeService.monthWiseDetailData(userId, this.fromdate, this.todate, this.stat, this.dist, this.hospitalCode, this.serchtype, Package,
      packageName).subscribe(
        (result) => {
          this.gramwisedata = [];
          this.gramwisedata = result;
          this.download();
        },
        (error) => console.log(error)
      )
  }
}
