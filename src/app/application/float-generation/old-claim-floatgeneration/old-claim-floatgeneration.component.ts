import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderService } from '../../header.service';
import { SnamasterserviceService } from '../../Services/snamasterservice.service';
import { CurrencyPipe, formatDate } from '@angular/common';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { FloatgenerationserviceService } from '../../Services/floatgenerationservice.service';
import * as Excel from "exceljs/dist/exceljs.min.js";
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-old-claim-floatgeneration',
  templateUrl: './old-claim-floatgeneration.component.html',
  styleUrls: ['./old-claim-floatgeneration.component.scss']
})
export class OldClaimFloatgenerationComponent implements OnInit {

  childmessage: any;
  user: any;
  txtsearchDate: any;
  stateCode: any;
  userId: any;
  distCode: any;
  snoclaimlist: any = [];
  record: any;
  showPegi: boolean;
  currentPage: any;
  pageElement: any;
  totalClaimCount: any;
  dataRequest: any;
  fromDate: any;
  toDate: any;
  stateCode1: any;
  distCode1: any;
  hospitalCode: any;
  currentPagenNum: any;
  month: any;
  year: any;
  description: any;
  hospital: any = '';
  districtId: any = '';
  stateId: any = '';
  floatList: any = [];
  constructor(
    public headerService: HeaderService,
    private snamasterService: SnamasterserviceService,
    private floatgenerationService: FloatgenerationserviceService,
    public route: Router,
    private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    //this.user = JSON.parse(sessionStorage.getItem('user'));
    this.user = this.sessionService.decryptSessionData("user");
    //this.dataRequest = JSON.parse(sessionStorage.getItem('requestData'));
    //this.currentPagenNum = JSON.parse(sessionStorage.getItem('currentPageNum'));
    this.dataRequest = this.sessionService.decryptSessionData("requestData");
    this.currentPagenNum = this.sessionService.decryptSessionData("currentPageNum");
    this.headerService.setTitle('Old Claim Float Generation');
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
    this.getStateList();
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
      format: 'DD-MMM-YYYY LT',
      daysOfWeekDisabled: ['', 7],
    });
    var date = new Date();
    let year = date.getFullYear();
    let date1 = '01';
    let months: any = date.getMonth();
    if (months == -1) {
      this.month = 'Dec';
      this.year = year - 1;
    } else {
      this.month = this.getMonthFrom(months);
      this.year = year;
    }
    var frstDay = date1 + '-' + this.month + '-' + this.year;
    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr('placeholder', 'From Date *');
    $('input[name="toDate"]').attr('placeholder', 'To Date *');
    if (
      this.dataRequest == null ||
      this.dataRequest == undefined ||
      this.dataRequest == ''
    ) {
    } else {
      let date = new Date(this.dataRequest.fromDate);
      let fromDate = this.getDate(date);
      $('input[name="fromDate"]').val(fromDate);
      let date1 = new Date(this.dataRequest.toDate);
      let toDate = this.getDate(date1);
      $('input[name="toDate"]').val(toDate);
      this.stateId = this.dataRequest.stateCode;
      this.OnChangeState(this.stateId);
      this.districtId = this.dataRequest.distCode;
      this.OnChangeDistrict(this.districtId);
      this.hospital = this.dataRequest.hospitalCode;
    }
    this.getFloatDetails();
  }

  getFloatDetails() {
    this.txtsearchDate = '';
    let userId = this.user.userId;
    let fromDate = $('#formdate').val();
    let toDate = $('#todate').val();
    let stateId = this.stateId;
    let districtId = this.districtId;
    let hospitalId = this.hospital;
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

    this.fromDate = fromDate;
    this.toDate = toDate;
    this.floatList = [];
    this.currentPage = 1;
    this.pageElement = 100;
    let requestData = {
      userId: userId,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      stateId: stateId,
      districtId: districtId,
      hospitalId: hospitalId
    };
    this.floatgenerationService.getoldfloatlist(requestData).subscribe(
      (data: any) => {
        if (data.status == 'success') {
          this.floatList = data.list;
          this.record = this.floatList.length;
          if (this.record > 0) {
            this.showPegi = true;
          } else {
            this.showPegi = false;
          }
        } else {
          this.swal('Error', 'Something went wrong.', 'error');
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

  getDate(date) {
    let year = date.getFullYear();
    let date1 = date.getDate();
    let months = date.getMonth();
    let month = this.getMonthFrom(months);
    var frstDay = date1 + '-' + month + '-' + year;
    return frstDay;
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

  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }

  stateList: any = [];
  districtList: any = [];
  hospitalList: any = [];
  selectedItems: any = [];
  getStateList() {
    this.snamasterService.getStateList(this.user.userId).subscribe(
      (response) => {
        this.stateList = response;
      },
      (error) => console.log(error)
    )
  }

  OnChangeState(id) {
    $('#districtId').val('');
    $('#hospital').val('');
    this.districtId = '';
    this.hospital = '';
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
    this.hospital = '';
    $('#hospital').val('');
    var stateCode = localStorage.getItem("stateCode");
    this.snamasterService.getHospitalbyDistrictId(this.user.userId, id, stateCode).subscribe(
      (response) => {
        this.hospitalList = response;
      },
      (error) => console.log(error)
    )
  }

  heading = [
    [
      'Sl No',
      'HOSPITAL NAME',
      'HOSPITAL CODE',
      'DISTRICT NAME',
      'URN',
      'INVOICE NO',
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
      'HOSPITAL CLAIMED AMOUNT (₹)',
      'IMPLANT DATA',
      'SNA CLAIM STATUS',
      'SNA REMARKS',
      'SNA APPROVED AMOUNT (₹)'
    ]
  ];

  downloadReport(type) {
    let userId = this.user.userId;
    let fromDate = this.fromDate;
    let toDate = this.toDate;
    let stateId = this.stateId;
    let districtId = this.districtId;
    let hospitalId = this.hospital;
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
      fileName = 'Old_Float_Generation_Report_' + date + '.xlsx';
      // const excelBuffer: any = workbook.xlsx.writeBuffer();
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
          formData.append('createdBy', userId);
          this.floatgenerationService.saveOldFloatReport(formData).subscribe(
            (data) => {
              if (data.status == 'success') {
                let img = this.floatgenerationService.downloadOldFile(fileName, userId);
                window.open(img, '_blank');
              } else {
                this.swal('Error', 'Some error happened', 'error');
              }
            }
          );
        }
      );
    } else if (type == 'pdf') {
      const doc = new jsPDF('l', 'mm', [740, 350]);
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
          0: { cellWidth: 15 },
          1: { cellWidth: 40 },
          2: { cellWidth: 30 },
          3: { cellWidth: 30 },
          4: { cellWidth: 30 },
          5: { cellWidth: 30 },
          6: { cellWidth: 40 },
          7: { cellWidth: 50 },
          8: { cellWidth: 20 },
          9: { cellWidth: 40 },
          10: { cellWidth: 40 },
          11: { cellWidth: 30 },
          12: { cellWidth: 40 },
          13: { cellWidth: 30 },
          14: { cellWidth: 30 },
          15: { cellWidth: 25 },
          16: { cellWidth: 30 },
          17: { cellWidth: 40 },
          18: { cellWidth: 40 },
          19: { cellWidth: 50 },
          20: { cellWidth: 30 }
        }
      });
      fileName = 'Old_Float_Generation_Report_' + date + '.pdf';
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
      formData.append('createdBy', userId);
      this.floatgenerationService.saveOldFloatReport(formData).subscribe(
        (data) => {
          if (data.status == 'success') {
            let img = this.floatgenerationService.downloadOldFile(fileName, userId);
            window.open(img, '_blank');
          } else {
            this.swal('Error', 'Some error happened', 'error');
          }
        }
      );
    }
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }

  pageItemChange() {
    this.pageElement = $("#pageItem").val();
  }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

  convertCurrency(amount: any) {
    var formatter = new CurrencyPipe('en-IN');
    amount = formatter.transform(amount, '', '');
    return amount;
  }
}
