import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { CurrencyPipe, formatDate } from '@angular/common';
import { FloatgenerationserviceService } from '../../Services/floatgenerationservice.service';
import { HeaderService } from '../../header.service';
import { SnamasterserviceService } from '../../Services/snamasterservice.service';
import * as Excel from "exceljs/dist/exceljs.min.js";
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { PackageDetailsMasterService } from '../../Services/package-details-master.service';
declare let $: any;

@Component({
  selector: 'app-floatgeneration',
  templateUrl: './floatgeneration.component.html',
  styleUrls: ['./floatgeneration.component.scss']
})
export class FloatgenerationComponent implements OnInit {
  childmessage: any;
  user: any;
  txtsearchDate: any;
  pageElement: any;
  currentPage: any;
  record: any;
  showPegi: boolean;
  public stateList: any = [];
  public districtList: any = [];
  public hospitalList: any = [];
  floatList: any = [];
  summary: any;
  fromDate: any;
  toDate: any;
  hospitalId: any = '';
  districtId: any = '';
  stateId: any = '';
  mortality: any;
  search: any;
  keyword: any = "hospitalName";
  keyword1: any = "districtname";
  keyword2: any = "stateName";
  searchtype: any;

  @ViewChild('auto') auto;
  @ViewChild('auto1') auto1;
  @ViewChild('auto2') auto2;
  constructor(private floatgenerationService: FloatgenerationserviceService, public headerService: HeaderService,
    private snamasterService: SnamasterserviceService, public route: Router,
    private sessionService: SessionStorageService,
    private encryptionService: EncryptionService, public packageDetailsMasterService: PackageDetailsMasterService) { }

  ngOnInit(): void {
    this.getSchemeData();
    this.headerService.setTitle('Float Generation');
    this.headerService.isIndicate(false);
    this.headerService.isBack(true);
    this.user = this.sessionService.decryptSessionData("user");
    this.currentPage = 1;
    this.pageElement = 100;

    $('.selectpicker').selectpicker();

    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      // endDate: '0d',
      maxDate: new Date(),
      minDate: new Date("01-Jan-2018"),
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

  OnChangeDistrict(id) {
    this.hospitalId = '';
    this.auto.clear();
    var stateCode = localStorage.getItem("stateCode");
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
    this.OnChangeDistrict(this.districtId);
  }

  clearEvent1() {
    this.districtId = '';
    this.OnChangeDistrict(this.districtId);
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

  getFloatDetails() {
    this.txtsearchDate = '';
    this.summary = '';
    let userId = this.user.userId;
    let fromDate = $('#formdate').val();
    let toDate = $('#todate').val();
    let stateId = this.stateId;
    let districtId = this.districtId;
    let hospitalId = this.hospitalId;
    let mortality = $('#mortality').val();
    let Search = $('#search').val();
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
    // if (Date.parse(fromDate) < Date.parse('01-Jan-2023')) {
    //   if (Date.parse(toDate) >= Date.parse('01-Jan-2023')) {
    //     this.swal('Info', 'Please select To Date before 01-Jan-2023', 'info');
    //     return;
    //   }
    // }
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.mortality = mortality;
    this.floatList = [];
    this.currentPage = 1;
    this.pageElement = 100;
    this.search = Search;
    let requestData = {
      userId: userId,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      stateId: stateId,
      districtId: districtId,
      hospitalId: hospitalId,
      mortality: mortality,
      searchtype: Search,
      schemecategoryid:schemecategoryid
    };
    this.floatgenerationService.getfloatlist(requestData).subscribe(
      (data) => {
        this.floatList = data;
        if (this.floatList.length > 0) {
          this.record = this.floatList.length;
          if (this.record > 0) {
            this.showPegi = true;
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

  getSummary() {
    let userId = this.user.userId;
    let fromDate = this.fromDate;
    let toDate = this.toDate
    let stateId = this.stateId;
    let districtId = this.districtId;
    let hospitalId = this.hospitalId;
    let mortality = this.mortality;
    let Search = $('#search').val();
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
    // if (Date.parse(fromDate) < Date.parse('01-Jan-2023')) {
    //   if (Date.parse(toDate) >= Date.parse('01-Jan-2023')) {
    //     this.swal('Info', 'Please select To Date before 01-Jan-2023', 'info');
    //     return;
    //   }
    // }

    this.summary = '';
    this.search = Search;
    let requestData = {
      userId: userId,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      stateId: stateId,
      districtId: districtId,
      hospitalId: hospitalId,
      mortality: mortality,
      searchtype: Search,
      schemecategoryid:schemecategoryid
    };
    this.floatgenerationService.getSummary(requestData).subscribe(
      (data) => {
        this.summary = data;
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
    let stateId = this.stateId;
    let districtId = this.districtId;
    let hospitalId = this.hospitalId;
    let mortality = this.mortality;
    this.search = $('#search').val();
    let schemecategoryid = this.schemecategoryidvalue;
    if (schemecategoryid == null || schemecategoryid == undefined || schemecategoryid == '') {
      schemecategoryid = "";
    } else {
      schemecategoryid = schemecategoryid;
    }
    console.log(schemecategoryid)
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
    // if (Date.parse(fromDate) < Date.parse('01-Jan-2023')) {
    //   if (Date.parse(toDate) >= Date.parse('01-Jan-2023')) {
    //     this.swal('Info', 'Please select To Date before 01-Jan-2023', 'info');
    //     return;
    //   }
    // }
    if (this.search != null && this.search != '' && this.search != undefined && this.search == 1) {
      this.searchtype = "Normal";
    } else if (this.search != null && this.search != '' && this.search != undefined && this.search == 2) {
      this.searchtype = "1.0 Block Data";
    }

    if (this.floatList.length == 0) {
      this.swal("Info", "No record found", 'info');
      return;
    }

    let stateName = 'All', districtName = 'All', hospitalName = 'All';
    for (var i = 0; i < this.stateList.length; i++) {
      if (stateId == this.stateList[i].stateCode) {
        stateName = this.stateList[i].stateName;
      }
    }
    for (var i = 0; i < this.districtList.length; i++) {
      if (districtId == this.districtList[i].districtcode) {
        districtName = this.districtList[i].districtname;
      }
    }
    for (var i = 0; i < this.hospitalList.length; i++) {
      if (hospitalId == this.hospitalList[i].hospitalCode) {
        hospitalName = this.hospitalList[i].hospitalName;
      }
    }

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
      if (this.search != null && this.search != '' && this.search != undefined && this.search == 1) {
        worksheet.addRow(['Search Type', "Normal"]);
      } else if (this.search != null && this.search != '' && this.search != undefined && this.search == 2) {
        worksheet.addRow(['Search Type', "1.0 Block Data"]);
      }
      if(this.schemecategoryidvalue ==='1'){
        worksheet.addRow(['Scheme Category Name', "NFSA/SFSS"]);
      }else if(this.schemecategoryidvalue ==='2'){
        worksheet.addRow(['Scheme Category Name', "GJAY-1"]);
      }else{
        worksheet.addRow(['Scheme Category Name', "All"]);
      }
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
          formData.append('searchtype', this.search);
          formData.append('schemecategoryid', schemecategoryid);
          console.log(formData);
          console.log("okkk");
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
      if(this.schemecategoryidvalue ==='1'){
        doc.text("Scheme Category Name: " + "NFSA/SFSS", 14, 40);
      }else if(this.schemecategoryidvalue ==='2'){
        doc.text("Scheme Category Name: " + "GJAY-1", 14, 40);
      }else{
        doc.text("Scheme Category Name: " + "All", 14, 40);
      }
      doc.text("State: " + stateName + "\t District: " + districtName + "\t Hospital: " + hospitalName + "\t Search Type:" + this.searchtype, 14, 50);
      doc.text("Generated By: " + this.user.fullName + "\tGenerated On: " + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString(), 14, 60);
      doc.setFontSize(12);

      autoTable(doc, {
        head: this.heading,
        body: this.floatList,
        theme: 'grid',
        startY: 70,
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
      formData.append('searchtype', this.search);
      formData.append('schemecategoryid', schemecategoryid);
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



