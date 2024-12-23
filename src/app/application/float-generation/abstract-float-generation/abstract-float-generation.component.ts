import { CurrencyPipe, formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { FloatgenerationserviceService } from '../../Services/floatgenerationservice.service';
import { SnamasterserviceService } from '../../Services/snamasterservice.service';
import * as Excel from "exceljs/dist/exceljs.min.js";
import { TableUtil } from '../../util/TableUtil';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { PackageDetailsMasterService } from '../../Services/package-details-master.service';
declare let $: any;

@Component({
  selector: 'app-abstract-float-generation',
  templateUrl: './abstract-float-generation.component.html',
  styleUrls: ['./abstract-float-generation.component.scss']
})
export class AbstractFloatGenerationComponent implements OnInit {

  childmessage: any;
  user: any;
  txtsearchDate: any;
  txtSearch: any;
  pageElement: any;
  currentPage: any;
  record: any;
  showPegi: boolean;
  public stateList: any = [];
  public districtList: any = [];
  public hospitalList: any = [];
  floatList: any = [];
  abstractLict: any = [];
  summary: any;
  fromDate: any;
  toDate: any;
  hospitalId: any;
  districtId: any;
  stateId: any;
  mortality: any;
  keyword: any = "hospitalName";
  keyword1: any = "districtname";
  keyword2: any = "stateName";
  hospitalCode: any;
  districtCode: any;
  stateCode: any;
  hospitalName: any;
  districtName: any;
  stateName: any;
  totalDischarged: number;
  totalClaims: number;
  totalClaimAmount: number;
  totalApproved: number;
  totalApprvAmount: number;
  totalRejected: number;
  totalCases: number;
  searchtype: any;
  schemeNamefrpdf: any;

  @ViewChild('auto') auto;
  @ViewChild('auto1') auto1;
  @ViewChild('auto2') auto2;
  constructor(private floatgenerationService: FloatgenerationserviceService, public headerService: HeaderService,
    private snamasterService: SnamasterserviceService, public route: Router,
    private sessionService: SessionStorageService,
    private encryptionService: EncryptionService, public packageDetailsMasterService: PackageDetailsMasterService
  ) { }

  ngOnInit(): void {
    this.getSchemeData();
    this.headerService.setTitle('Hospital Wise Float Generation');
    this.headerService.isIndicate(false);
    this.headerService.isBack(true);
    this.user = this.sessionService.decryptSessionData("user");
    this.currentPage = 1;
    this.pageElement = 100;
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
      format: 'YYYY-MM-DD LT',
      daysOfWeekDisabled: ['', 7],
    });
    var date = new Date();

    let year = date.getFullYear();
    let date1 = '01';
    let month: any = date.getMonth();

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

    $('input[name="toDate"]').attr('placeholder', 'To Date *');
    this.getStateList();
  }

  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }

  getStateList() {
    this.snamasterService.getStateList(this.user.userId).subscribe(
      (response) => {
        this.stateList = response;
      },
      (error) => console.log(error)
    )
  }

  OnChangeState(id) {
    this.auto1.clear();
    this.auto.clear();
    this.districtId = '';
    this.hospitalId = '';
    this.auto.clear();
    this.hospitalList = [];
    localStorage.setItem("stateCode", id);
    this.snamasterService.getDistrictListByStateId(this.user.userId, id).subscribe(
      (response) => {
        this.districtList = response;
      },
      (error) => console.log(error)
    )
  }

  OnChangeDistrict(id, stateCode) {
    this.hospitalId = '';
    this.auto.clear();
    this.snamasterService.getHospitalbyDistrictId(this.user.userId, id, stateCode).subscribe(
      (response) => {
        this.hospitalList = response;
      },
      (error) => console.log(error)
    )
  }

  selectEvent(item) {
    this.hospitalId = item.hospitalCode;
  }

  clearEvent() {
    this.hospitalId = '';
  }

  selectEvent1(item) {
    this.districtId = item.districtcode;
    this.OnChangeDistrict(this.districtId, this.stateId);
  }

  clearEvent1() {
    this.districtId = '';
    this.OnChangeDistrict(this.districtId, this.stateId);
  }

  selectEvent2(item) {
    this.stateId = item.stateCode;
    this.OnChangeState(this.stateId);
  }

  clearEvent2() {
    this.stateId = '';
    this.OnChangeState(this.stateId);
  }

  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  }

  getAbstractDetails() {
    this.txtsearchDate = '';
    let userId = this.user.userId;
    let fromDate = $('#formdate').val();
    let toDate = $('#todate').val();
    let stateId = this.stateId;
    let districtId = this.districtId;
    let hospitalId = this.hospitalId;
    let mortality = $('#mortality').val();
    this.searchtype = $('#search').val();
    let schemecategoryid = this.schemecategoryidvalue;
    if (schemecategoryid == null || schemecategoryid == undefined || schemecategoryid == '') {
      schemecategoryid = "";
    } else {
      schemecategoryid = schemecategoryid;
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
    if (Date.parse(fromDate) < Date.parse('01-Jan-2023')) {
      if (Date.parse(toDate) >= Date.parse('01-Jan-2023')) {
        this.swal('Info', 'Please select To Date before 01-Jan-2023', 'info');
        return;
      }
    }

    this.fromDate = fromDate;
    this.toDate = toDate;
    this.mortality = mortality;
    this.abstractLict = [];
    this.currentPage = 1;
    this.pageElement = 100;
    let requestData = {
      userId: userId,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      stateId: stateId,
      districtId: districtId,
      hospitalId: hospitalId,
      mortality: mortality,
      searchtype: this.searchtype,
      schemecategoryid: schemecategoryid
    };
    this.totalDischarged = 0;
    this.totalClaims = 0;
    this.totalClaimAmount = 0;
    this.totalApproved = 0;
    this.totalApprvAmount = 0;
    this.totalRejected = 0;
    this.totalCases = 0;
    this.floatgenerationService.getAbstractlist(requestData).subscribe(
      (data) => {
        this.abstractLict = data;
        if (this.abstractLict.length > 0) {
          this.record = this.abstractLict.length;
          if (this.record > 0) {
            this.showPegi = true;
            for (var i = 0; i < this.abstractLict.length; i++) {
              var item = this.abstractLict[i];
              this.totalDischarged = this.totalDischarged + item.discharged;
              this.totalClaims = this.totalClaims + item.claimraised;
              this.totalClaimAmount = this.totalClaimAmount + item.claimamount;
              this.totalApproved = this.totalApproved + item.approved;
              this.totalApprvAmount = this.totalApprvAmount + item.snoamount;
              this.totalRejected = this.totalRejected + item.rejected;
              this.totalCases = this.totalCases + item.count;
            }
          } else {
            this.showPegi = false;
          }
        } else {
          this.swal('Info', 'No Data Found', 'info');
        }
      },
      (error) => {
        console.log(error);
        this.swal('Error', 'Something went wrong.', 'error');
      }
    );
  }

  getFloatDetails() {
    this.txtSearch = '';
    let userId = this.user.userId;
    let fromDate = this.fromDate
    let toDate = this.toDate
    let stateId = this.stateCode;
    let districtId = this.districtCode;
    let hospitalId = this.hospitalCode;
    let mortality = this.mortality;
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
    if (Date.parse(fromDate) < Date.parse('01-Jan-2023')) {
      if (Date.parse(toDate) >= Date.parse('01-Jan-2023')) {
        this.swal('Info', 'Please select To Date before 01-Jan-2023', 'info');
        return;
      }
    }

    this.floatList = [];
    let requestData = {
      userId: userId,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      stateId: stateId,
      districtId: districtId,
      hospitalId: hospitalId,
      mortality: mortality,
      searchtype: this.searchtype
    };
    this.floatgenerationService.getfloatlist(requestData).subscribe(
      (data) => {
        this.floatList = data;
        if (this.floatList.length == 0) {
          this.swal('Info', 'No Data Found', 'info');
        }
      },
      (error) => {
        console.log(error);
        this.swal('Error', 'Something went wrong.', 'error');
      }
    );
  }

  resetTable() {
    window.location.reload();
  }

  show(item) {
    this.swal('', item, '');
  }

  view(item) {
    this.hospitalCode = item.hospitalCode;
    this.districtCode = item.districtCode;
    this.stateCode = item.stateCode;
    this.stateName = item.stateName;
    this.districtName = item.districtName;
    this.hospitalName = item.hospitalName + ' (' + item.hospitalCode + ')';
    this.getFloatDetails();
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

  convertCurrency(amount: any) {
    var formatter = new CurrencyPipe('en-IN');
    amount = formatter.transform(amount, '', '');
    return amount;
  }

  list: any = [];
  sna: any;
  heading1 = [
    [
      'Sl No',
      'State Name',
      'District Name',
      'Hospital Name',
      'Hospital Code',
      'Total Discharged',
      'Claims Submitted',
      'Claim Amount (₹)',
      'Approved Claims',
      'SNA Approved Amount (₹)',
      'Rejected Claims',
      'Total Cases For Float'
    ]
  ];

  downloadList(file) {
    this.list = [];
    let date1 = formatDate(new Date(), 'yyyyMMddhhmmssa', 'en-US');
    let item: any;
    let stateName = 'All', districtName = 'All', hospitalName = 'All';
    for (var i = 0; i < this.stateList.length; i++) {
      if (this.stateId == this.stateList[i].stateCode) {
        stateName = this.stateList[i].stateName;
      }
    }
    for (var i = 0; i < this.districtList.length; i++) {
      if (this.districtId == this.districtList[i].districtcode) {
        districtName = this.districtList[i].districtname;
      }
    }
    for (var i = 0; i < this.hospitalList.length; i++) {
      if (this.hospitalId == this.hospitalList[i].hospitalCode) {
        hospitalName = this.hospitalList[i].hospitalName;
      }
    }

    let searchtype;
    if (this.searchtype == 2) {
      searchtype = "1.0 Block Data";
    } else {
      searchtype = "Normal";
    }

    if (file == 'xcl') {
      for (var i = 0; i < this.abstractLict.length; i++) {
        item = this.abstractLict[i];
        this.sna = {
          slNo: "",
          state: "",
          dist: "",
          hname: "",
          hcode: "",
          discharged: "",
          claimraised: "",
          claimamount: "",
          approved: "",
          snaamount: "",
          rejected: "",
          count: ""
        };
        this.sna.slNo = (i + 1).toString();
        this.sna.state = item.stateName;
        this.sna.dist = item.districtName;
        this.sna.hname = item.hospitalName;
        this.sna.hcode = item.hospitalCode;
        this.sna.discharged = item.discharged.toString();;
        this.sna.claimraised = item.claimraised.toString();;
        this.sna.claimamount = this.convertCurrency(item.claimamount);
        this.sna.approved = item.approved.toString();
        this.sna.snaamount = this.convertCurrency(item.snoamount);
        this.sna.rejected = item.rejected.toString();
        this.sna.count = item.count.toString();
        this.list.push(this.sna);
      }
      this.sna = {
        slNo: "",
        state: "",
        dist: "",
        hname: "",
        hcode: "",
        discharged: "",
        claimraised: "",
        claimamount: "",
        approved: "",
        snaamount: "",
        rejected: "",
        count: ""
      };
      this.sna.slNo = '';
      this.sna.state = '';
      this.sna.dist = '';
      this.sna.hname = '';
      this.sna.hcode = 'Total:';
      this.sna.discharged = this.totalDischarged.toString();;
      this.sna.claimraised = this.totalClaims.toString();;
      this.sna.claimamount = this.convertCurrency(this.totalClaimAmount);
      this.sna.approved = this.totalApproved.toString();
      this.sna.snaamount = this.convertCurrency(this.totalApprvAmount);
      this.sna.rejected = this.totalRejected.toString();
      this.sna.count = this.totalCases.toString();
      this.list.push(this.sna);
      let filter = [];
      filter.push([['Discharge Date From', this.fromDate]]);
      filter.push([['Discharge Date To', this.toDate]]);
      filter.push([['State', stateName]]);
      filter.push([['District', districtName]]);
      filter.push([['Hospital', hospitalName]]);
      filter.push([['Search Type', searchtype]]);
      if (this.schemecategoryidvalue === '1') {
        filter.push([['Scheme Category Name', "NFSA/SFSS"]]);
      } else if (this.schemecategoryidvalue === '2') {
        filter.push([['Scheme Category Name', "GJAY-1"]]);
      } else {
        filter.push([['Scheme Category Name', "All"]]);
      }
      TableUtil.exportListToExcelWithFilter(this.list, "Hospital_Wise_Float_Report_" + date1, this.heading1, filter);
    } else {
      if (this.schemecategoryidvalue === '1') {
        this.schemeNamefrpdf = "NFSA/SFSS"
      } else if (this.schemecategoryidvalue === '2') {
        this.schemeNamefrpdf = "GJAY-1"
      } else {
        this.schemeNamefrpdf = "All"
      }
      const doc = new jsPDF('l', 'mm', [280, 425]);
      doc.setFontSize(24);
      doc.text("Hospital Wise Float Generation Report", 14, 20);
      doc.setFontSize(16);
      doc.text("Actual Date Of Discharge From: " + this.fromDate + "\t Actual Date Of Discharge To: " + this.toDate, 14, 30);
      doc.text("State: " + stateName + "\t District: " + districtName + "\t Hospital: " + hospitalName + "\t Sreatch Type: " + searchtype + "\tScheme Category Name:" + this.schemeNamefrpdf, 14, 40);
      doc.text("Generated By: " + this.user.fullName + "\tGenerated On: " + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString(), 14, 50);

      doc.setFontSize(12);
      for (var i = 0; i < this.abstractLict.length; i++) {
        item = this.abstractLict[i];
        this.sna = [];
        this.sna[0] = i + 1;
        this.sna[1] = item.stateName;
        this.sna[2] = item.districtName;
        this.sna[3] = item.hospitalName;
        this.sna[4] = item.hospitalCode;
        this.sna[5] = item.discharged.toString();;
        this.sna[6] = item.claimraised.toString();;
        this.sna[7] = this.convertCurrency(item.claimamount);
        this.sna[8] = item.approved.toString();
        this.sna[9] = this.convertCurrency(item.snoamount);
        this.sna[10] = item.rejected.toString();
        this.sna[11] = item.count.toString();
        this.list.push(this.sna);
      }
      this.sna = [];
      this.sna[0] = '';
      this.sna[1] = '';
      this.sna[2] = '';
      this.sna[3] = '';
      this.sna[4] = 'Total:';
      this.sna[5] = this.totalDischarged.toString();;
      this.sna[6] = this.totalClaims.toString();;
      this.sna[7] = this.convertCurrency(this.totalClaimAmount);
      this.sna[8] = this.totalApproved.toString();
      this.sna[9] = this.convertCurrency(this.totalApprvAmount);
      this.sna[10] = this.totalRejected.toString();
      this.sna[11] = this.totalCases.toString();
      this.list.push(this.sna);
      autoTable(doc, {
        head: this.heading1,
        body: this.list,
        theme: 'grid',
        startY: 60,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: 30 },
          2: { cellWidth: 30 },
          3: { cellWidth: 50 },
          4: { cellWidth: 40 },
          5: { cellWidth: 30 },
          6: { cellWidth: 30 },
          7: { cellWidth: 40 },
          8: { cellWidth: 30 },
          9: { cellWidth: 40 },
          10: { cellWidth: 30 },
          11: { cellWidth: 30 },
        }
      });
      doc.save('Hospital_Wise_Float_Report_' + date1);
    }
  }

  heading = [
    [
      'Sl No',
      'HOSPITAL NAME',
      'HOSPITAL CODE',
      'DISTRICT NAME',
      'URN',
      'INVOICE NO',
      'CLAIM NO',
      'CASE NO',
      'PATIENT NAME',
      'GENDER',
      'PACKAGE CODE',
      'PACKAGE NAME',
      'PACKAGE COST (₹)',
      'PROCEDURE NAME',
      'ACTUAL DATE OF ADMISSION',
      'ACTUAL DATE OF DISCHARGE',
      'MORTALITY (Hospital)',
      'MORTALITY (CPD)',
      'HOSPITAL CLAIMED AMOUNT (₹)',
      'IMPLANT DATA',
      'CPD CLAIM STATUS',
      'CPD REMARKS',
      'CPD APPROVED AMOUNT (₹)',
      'SNA CLAIM STATUS',
      'SNA REMARKS',
      'SNA APPROVED AMOUNT(SNA/CPD) (₹)'
    ]
  ];

  downloadReport(type) {
    let userId = this.user.userId;
    let fromDate = this.fromDate;
    let toDate = this.toDate;
    let stateId = this.stateCode;
    let districtId = this.districtCode;
    let hospitalId = this.hospitalCode;
    let mortality = this.mortality;
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
    if (Date.parse(fromDate) < Date.parse('01-Jan-2023')) {
      if (Date.parse(toDate) >= Date.parse('01-Jan-2023')) {
        this.swal('Info', 'Please select To Date before 01-Jan-2023', 'info');
        return;
      }
    }

    if (this.floatList.length == 0) {
      this.swal("Info", "No record found", 'info');
      return;
    }

    let stateName = this.stateName, districtName = this.districtName, hospitalName = this.hospitalName;

    let date = formatDate(new Date(), 'yyyyMMddhhmmssa', 'en-US');
    let fileName = '';
    let file: File;
    if (type == 'xcl') {
      var options = {
        filename: './streamed-workbook.xlsx',
        useStyles: true,
        useSharedStrings: true
      };
      let workbook = new Excel.Workbook(options);
      var worksheet = workbook.addWorksheet('Sheet 1');
      worksheet.addRow(['Discharge Date From', fromDate]);
      worksheet.addRow(['Discharge Date To', toDate]);
      worksheet.addRow(['State', stateName]);
      worksheet.addRow(['District', districtName]);
      worksheet.addRow(['Hospital', hospitalName]);
      worksheet.addRow(['Generated By', this.user.fullName]);
      worksheet.addRow(['Generated On', formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString()]);
      worksheet.addRow(['', '']);
      worksheet.addRow(this.heading[0]);
      for (var i = 0; i < this.floatList.length; i++) {
        worksheet.addRow(this.floatList[i]);
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
      fileName = 'Float_Generation_Report_' + date + '.xlsx';
      const excelBuffer: any = workbook.xlsx.writeBuffer();
      workbook.xlsx.writeBuffer().then(
        (buffer) => {
          const data = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          file = new File([data], fileName);
          var formData = new FormData();
          formData.append('pdf', file);
          formData.append('userId', userId);
          formData.append('fromDate', fromDate);
          formData.append('toDate', toDate);
          formData.append('stateId', stateId ? stateId : 'All');
          formData.append('districtId', districtId ? districtId : 'All');
          formData.append('hospitalId', hospitalId ? hospitalId : 'All');
          formData.append('mortality', mortality ? mortality : 'All');
          formData.append('createdBy', userId);
          this.floatgenerationService.saveFloatReport(formData).subscribe(
            (data) => {
              if (data.status == 'success') {
                let img = this.floatgenerationService.downloadFile(fileName, userId);
                window.open(img, '_blank');
              } else {
                this.swal('Error', 'Some error happened', 'error');
              }
            }
          );
        }
      );

    } else if (type == 'pdf') {
      const doc = new jsPDF('l', 'mm', [608, 350]);
      doc.text("Float Generation Report", 14, 20);
      doc.text("Actual Date Of Discharge From: " + fromDate + "\t Actual Date Of Discharge To: " + toDate, 14, 30);
      doc.text("State: " + stateName + "\t District: " + districtName + "\t Hospital: " + hospitalName, 14, 40);
      doc.text("Generated By: " + this.user.fullName + "\tGenerated On: " + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString(), 14, 50);
      doc.setFontSize(12);

      autoTable(doc, {
        head: this.heading,
        body: this.floatList,
        theme: 'grid',
        startY: 60,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 20 },
          2: { cellWidth: 20 },
          3: { cellWidth: 20 },
          4: { cellWidth: 20 },
          5: { cellWidth: 20 },
          6: { cellWidth: 20 },
          7: { cellWidth: 20 },
          8: { cellWidth: 20 },
          9: { cellWidth: 20 },
          10: { cellWidth: 30 },
          11: { cellWidth: 20 },
          12: { cellWidth: 20 },
          13: { cellWidth: 20 },
          14: { cellWidth: 20 },
          15: { cellWidth: 20 },
          16: { cellWidth: 20 },
          17: { cellWidth: 30 },
          18: { cellWidth: 20 },
          19: { cellWidth: 20 },
          20: { cellWidth: 20 },
          21: { cellWidth: 30 },
          22: { cellWidth: 30 },
          23: { cellWidth: 30 },
          24: { cellWidth: 30 },
          25: { cellWidth: 30 }
        }
      });
      fileName = 'Float_Generation_Report_' + date + '.pdf';
      let blob = doc.output('blob');
      file = new File([blob], fileName);
      var formData = new FormData();
      formData.append('pdf', file);
      formData.append('userId', userId);
      formData.append('fromDate', fromDate);
      formData.append('toDate', toDate);
      formData.append('stateId', stateId ? stateId : 'All');
      formData.append('districtId', districtId ? districtId : 'All');
      formData.append('hospitalId', hospitalId ? hospitalId : 'All');
      formData.append('mortality', mortality ? mortality : 'All');
      formData.append('createdBy', userId);
      this.floatgenerationService.saveFloatReport(formData).subscribe(
        (data) => {
          if (data.status == 'success') {
            let img = this.floatgenerationService.downloadFile(fileName, userId);
            window.open(img, '_blank');
          } else {
            this.swal('Error', 'Some error happened', 'error');
          }
        }
      );
    }
  }

  downloadFloat() {
    Swal.fire({
      title: 'Generate Float',
      icon: 'question',
      showConfirmButton: true,
      showDenyButton: true,
      confirmButtonColor: '#1f723f',
      denyButtonColor: '#d33',
      confirmButtonText: 'Excel Report',
      denyButtonText: 'Pdf Report'
    }).then((result) => {
      if (result.isConfirmed) {
        this.downloadReport('xcl');
      } else if (result.isDenied) {
        this.downloadReport('pdf');
      }
    });
  }

  ///scheme
  scheme: any = [];
  schemeidvalue: any = 1;
  schemeName: any = ''
  getSchemeData() {
    let data = {
      action: 'A',
      schemeId: 1,
      schemeCategoryId: '',
    };
    let encData = this.encryptionService.encryptRequest(data);
    this.packageDetailsMasterService.getSchemeDetails(encData).subscribe((res: any) => {
      let resData = this.encryptionService.getDecryptedData(res);
      if (resData.status == 'success') {
        this.scheme = resData.data;
        for (let i = 0; i < this.scheme.length; i++) {
          this.schemeidvalue = this.scheme[i].schemeId;
          this.schemeName = this.scheme[i].schemeName;
        }
        this.getSchemeDetails();

      } else {
        this.swal('', 'Something went wrong.', 'error');

      }
    },
      (error) => {
        this.swal('', 'Something went wrong.', 'error');
      });
  }

  schemeList: any = [];
  getSchemeDetails() {
    let data = {
      action: 'B',
      schemeId: 1,
      schemeCategoryId: '',
    };
    let encData = this.encryptionService.encryptRequest(data);
    this.packageDetailsMasterService.getSchemeDetails(encData).subscribe((res: any) => {
      let resData = this.encryptionService.getDecryptedData(res);
      if (resData.status == 'success') {
        this.schemeList = resData.data;
      } else {
        this.swal('', 'Something went wrong.', 'error');

      }
    },
      (error) => {
        this.swal('', 'Something went wrong.', 'error');
      });
  }

  schemecategoryidvalue: any
  schemecategoryName: any;
  getschemacategoryid(event: any) {
    if (event != null && event != undefined && event != '' && event != "") {
      for (let i = 0; i < this.schemeList.length; i++) {
        if (event == this.schemeList[i].schemeCategoryId)
          this.schemecategoryidvalue = this.schemeList[i].schemeCategoryId;
        this.schemecategoryName = this.schemeList[i].categoryName;
      }
    } else {
      this.schemecategoryidvalue = '';
      this.schemecategoryName = "All"
    }
  }
}


