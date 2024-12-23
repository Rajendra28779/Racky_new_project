import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { SnoCLaimDetailsService } from '../../Services/sno-claim-details.service';
import { Router } from '@angular/router';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { TableUtil } from '../../util/TableUtil';
import { DatePipe } from '@angular/common';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-oldprocessedclaimlist',
  templateUrl: './oldprocessedclaimlist.component.html',
  styleUrls: ['./oldprocessedclaimlist.component.scss']
})
export class OldprocessedclaimlistComponent implements OnInit {
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
  claimstatus: any = "";
  fromDate: any;
  toDate: any;
  stateCode1: any;
  distCode1: any;
  hospitalCode: string = "";
  currentPagenNum: any;
  month: any;
  year: any;
  description: any;
  hospital: any = '';
  districtId: any = '';
  stateId: any = '';
  placeHolder = "Select Hospital";
  dropdownSettings: IDropdownSettings = {};
  hospList: any = [];
  @ViewChild('multiSelect') multiSelect;
  constructor(
    public headerService: HeaderService,
    public snoService: SnoCLaimDetailsService,
    private snoService1: SnocreateserviceService,
    public route: Router,
    private sessionService: SessionStorageService
  ) {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'hospitalCode',
      textField: 'hospitalName',
      itemsShowLimit: 2,
      allowSearchFilter: true,
      selectAllText: 'Select All',
      unSelectAllText: "Un-Select All",
    };
  }

  ngOnInit(): void {
    this.user = this.sessionService.decryptSessionData("user");
    this.dataRequest = this.sessionService.decryptSessionData('requestData');
    this.currentPagenNum = this.sessionService.decryptSessionData('currentPageNum');
    this.headerService.setTitle('Old Processed Claim');
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
    this.getStateList();
    this.currentPage = 1;
    this.pageElement = 50;
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
    let months: any = date.getMonth() - 1;
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
      this.chooseHospital(this.dataRequest.hospitalCode);
      this.claimstatus = this.dataRequest.action;
      this.getSnoClaimDetails();
    }
  }

  chooseHospital(list) {
    let temp = {
      "hospitalId": 0,
      "hospName": "",
      "hospitalName": "",
      "hospitalCode": ""
    }

    for (let i = 0; i < list.length; i++) {
      temp.hospitalId = list[i].hospitalId;
      temp.hospName = list[i].hospName;
      temp.hospitalName = list[i].hospitalName;
      temp.hospitalCode = list[i].hospitalCode;
      this.selectedItems.push(temp);
    }
    this.hospList = list;
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
  stateList: any;
  districtList: any
  hospitalList: any
  selectedItems: any = [];
  getStateList() {
    this.snoService1.getStateList().subscribe(
      (response) => {
        this.stateList = response;
      },
      (error) => console.log(error)
    )
  }
  OnChangeState(id) {
    $("#districtId").val("");
    this.districtId = "";
    this.selectedItems = [];
    this.hospList = [];
    this.hospitalList = [];
    localStorage.setItem("stateCode", id);
    this.snoService1.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = response;
      },
      (error) => console.log(error)
    )
  }
  OnChangeDistrict(districtId) {
    this.selectedItems = [];
    this.hospList = [];
    this.hospitalList = [];
    var stateCode = localStorage.getItem("stateCode");
    this.snoService1.getHospitalByDistrictIdSno(this.user.userId, districtId, stateCode).subscribe(
      (response) => {
        this.hospitalList = response;
      },
      (error) => console.log(error)
    )
  }

  hospObj: any;
  onItemSelect(item) {
    this.hospObj = {
      stateCode: "",
      stateName: "",
      districtCode: "",
      districtName: "",
      hospitalCode: "",
      hospitalName: ""
    }
    this.hospObj.stateCode = $('#stateId').val();
    for (var i = 0; i < this.stateList.length; i++) {
      if (this.hospObj.stateCode == this.stateList[i].stateCode) {
        this.hospObj.stateName = this.stateList[i].stateName;
      }
    }
    this.hospObj.districtCode = $('#districtId').val();
    for (var i = 0; i < this.districtList.length; i++) {
      if (this.hospObj.districtCode == this.districtList[i].districtcode) {
        this.hospObj.districtName = this.districtList[i].districtname;
      }
    }
    this.hospObj.hospitalCode = item.hospitalCode;
    for (var i = 0; i < this.hospitalList.length; i++) {
      if (this.hospObj.hospitalCode == this.hospitalList[i].hospitalCode) {
        this.hospObj.hospitalName = this.hospitalList[i].hospitalName;
        this.hospObj.hospitalId = this.hospitalList[i].hospitalId;
        this.hospObj.hospName = this.hospitalList[i].hospName;
      }
    }
    var stat: boolean = false;
    for (const i of this.hospList) {
      if (i.hospitalCode == this.hospObj.hospitalCode) {
        stat = true;
      }
    }
    if (stat == false) {
      this.hospList.push(this.hospObj);
    }
  }

  onSelectAll(list) {
    for (var x = 0; x < list.length; x++) {
      let item = list[x];
      this.hospObj = {
        stateCode: "",
        stateName: "",
        districtCode: "",
        districtName: "",
        hospitalCode: "",
        hospitalName: ""
      }
      this.hospObj.stateCode = $('#stateId').val();
      for (var i = 0; i < this.stateList.length; i++) {
        if (this.hospObj.stateCode == this.stateList[i].stateCode) {
          this.hospObj.stateName = this.stateList[i].stateName;
        }
      }
      this.hospObj.districtCode = $('#districtId').val();
      for (var i = 0; i < this.districtList.length; i++) {
        if (this.hospObj.districtCode == this.districtList[i].districtcode) {
          this.hospObj.districtName = this.districtList[i].districtname;
        }
      }
      this.hospObj.hospitalCode = item.hospitalCode;
      for (var i = 0; i < this.hospitalList.length; i++) {
        if (this.hospObj.hospitalCode == this.hospitalList[i].hospitalCode) {
          this.hospObj.hospitalName = this.hospitalList[i].hospitalName;
          this.hospObj.hospitalId = this.hospitalList[i].hospitalId;
          this.hospObj.hospName = this.hospitalList[i].hospName;
        }
      }

      var stat: boolean = false;
      for (const i of this.hospList) {
        if (i.hospitalCode == this.hospObj.hospitalCode) {
          stat = true;
        }
      }
      if (stat == false) {
        this.hospList.push(this.hospObj);
      }
    }
  }

  onItemDeSelect(item) {
    for (var i = 0; i < this.hospList.length; i++) {
      if (item.hospitalCode == this.hospList[i].hospitalCode) {
        var index = this.hospList.indexOf(this.hospList[i]);
        if (index !== -1) {
          this.hospList.splice(index, 1);
        }
      }
    }
  }

  onDeSelectAll(list) {
    //this.onDeSelectAll.emit(this.emittedValue(this.selectedItems));
    this.hospList = [];
    // this.placeHolder = "Select Hospital";
    // for(var x=0;x<list.length;x++) {
    //   let item = list[x];
    //   for(var i=0;i<this.hospList.length;i++) {
    //     if(item.hospitalCode==this.hospList[i].hospitalCode) {
    //       var index = this.hospList.indexOf(this.hospList[i]);
    //       if (index !== -1) {
    //         this.hospList.splice(index, 1);
    //       }
    //     }
    //   }
    // }
  }

  requestData: any;
  checkStatus: any = 0;
  getSnoClaimDetails() {
    let userId = this.user.userId;
    this.fromDate = $('#datepicker15').val();
    this.toDate = $('#datepicker16').val();
    this.stateCode1 = this.stateId;
    this.distCode1 = this.districtId;
    let claimStatus = this.claimstatus;
    if (this.fromDate == '' || this.fromDate == null) {
      this.swal('', 'From Date Should not be Blank', 'error');
      return;
    }
    if (this.toDate == '' || this.toDate == null) {
      this.swal('', 'To Date Should not be Blank', 'error');
      return;
    }
    if (Date.parse(this.fromDate) > Date.parse(this.toDate)) {
      this.swal('', 'From Date should be less than To Date', 'error');
      return;
    }
    if (claimStatus == '' || claimStatus == null) {
      this.swal('', 'Please Select Claim Status', 'error');
      return;
    }
    if (this.stateCode1 == '' || this.stateCode1 == null) {
      this.swal('', ' Please Select State', 'error');
      return;
    }
    let count = 0;
    this.hospitalCode = "";
    this.hospList.forEach(element => {
      count++;
      if (this.hospList.length == count) {
        this.hospitalCode = this.hospitalCode + element.hospitalCode;
      } else {
        this.hospitalCode = this.hospitalCode + element.hospitalCode + ",";
      }
    });
    this.requestData = {
      userId: userId,
      fromDate: new Date(this.fromDate),
      toDate: new Date(this.toDate),
      stateCode: this.stateCode1,
      distCode: this.distCode1,
      hospitalCode: this.hospitalCode,
      action: claimStatus,
    };
    this.snoService.getOldProcessedClaimlist(this.requestData).subscribe(
      (data) => {
        this.requestData.hospitalCode = this.hospList;
        this.sessionService.encryptSessionData('requestData', this.requestData);
        this.snoclaimlist = data;
        this.totalClaimCount = this.snoclaimlist.length;
        this.record = this.snoclaimlist.length;
        if (this.record > 0) {
          this.showPegi = true;
          if (this.claimstatus == 'SNARejected' || this.claimstatus == 'Approved') {
            this.checkStatus = 1;
          } else {
            this.checkStatus = 0;
          }
        } else {
          this.swal('', 'No Records Found', 'info');
          this.showPegi = false;
        }
      },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      }
    );
  }
  onAction(id: any, urn: any, transid: any) {
    let state = {
      transactionId: id,
      URN: urn,
      transId: transid,
    };
    localStorage.setItem('actionData', JSON.stringify(state));
    this.sessionService.encryptSessionData('currentPageNum',this.currentPage);
    this.route.navigate(['/application/OldProcessedClaimList/action']);
  }
  stateData: any = [];
  // getStateList() {
  //   this.snoService.getStateList().subscribe((data: any) => {
  //     this.stateData = data;
  //     this.stateData.sort((a, b) => a.stateName.localeCompare(b.stateName));
  //     for (let j = 0; j < this.stateData.length; j++) {
  //       if (this.stateData[j].stateCode == '21') {
  //         this.statelist.push(this.stateData[j]);
  //       }
  //     }
  //     for (let i = 0; i < this.stateData.length; i++) {
  //       if (this.stateData[i].stateCode != '21') {
  //         this.statelist.push(this.stateData[i]);
  //       }
  //     }
  //   });
  // }
  distId: any = '';
  // getDistrict(code) {
  //   this.stateCode = code;
  //   this.userId = this.user.userId;
  //   this.snoService
  //     .getDistrictListByState(this.userId, this.stateCode)
  //     .subscribe((data:any) => {
  //       this.distList = data;
  //       this.distList.sort((a, b) =>
  //         a.DISTRICTNAME.localeCompare(b.DISTRICTNAME)
  //       );
  //     });
  // }
  hospitalId: any = '';
  // getHospital(code) {
  //   this.distCode = code;
  //   this.userId = this.user.userId;
  //   this.snoService
  //     .getHospitalByDist(this.userId, this.stateCode, this.distCode)
  //     .subscribe((data:any) => {
  //       this.hospitalList = data;
  //     });
  // }

  ResetField() {
    sessionStorage.removeItem('requestData');
    window.location.reload();
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  traverseToRequiredPage() {
    if (this.currentPagenNum != null && this.currentPagenNum != undefined) {
      this.currentPage = this.currentPagenNum;
      sessionStorage.removeItem('currentPageNum');
    } else {
      this.currentPage = 1;
    }
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
  report: any = [];
  sno: any = {
    Slno: "",
    OldClaimNo: "",
    URN: "",
    PatientName: "",
    InvoiceNo: "",
    HospitalName: "",
    HospitalCode: "",
    DateofAdmission: "",
    ActualDateofAdmission: "",
    DateofDischarge: "",
    ActualDateofDischarge: "",
    claimStatus: "",
    SNARemarks: "",
    approvedUser: "",
    rejectedUser: "",
    investigatedUser: "",
    snaApprovedUser: "",
    snaRejectedUser: "",
    snaInvestigatedUser: "",
    snaFinalDecisionUser: "",
    paidUser: "",
    tpaFinalDecisionUser: ""
  };
  heading = [['Sl#', 'Claim No.', 'URN', 'Patient Name', 'Invoice No', 'Hospital Name', 'Hospital Code', 'Date of Admission', 'Actual Date of Admission', 'Date of Discharge', 'Actual Date of Discharge', 'Claim Status', 'SNA Remarks', 'Approved User', 'Rejected User', 'Investigated User', 'SNA Approved User', 'SNA Rejected User', 'SNA Investigated User', 'SNA Final Decision User', 'Paid User', 'TPA Final Decision User']];
  downloadReport() {
    this.report = [];
    let claim: any;
    for (var i = 0; i < this.snoclaimlist.length; i++) {
      claim = this.snoclaimlist[i];
      this.sno = [];
      this.sno.Slno = i + 1;
      this.sno.OldClaimNo = claim.oldClaimNo;
      this.sno.URN = claim.urn;
      this.sno.PatientName = claim.patientName;
      this.sno.InvoiceNo = claim.invoiceNumber;
      this.sno.HospitalName = claim.hospitalname;
      this.sno.HospitalCode = claim.hospitalcode;
      this.sno.DateofAdmission = claim.dateofadmission;
      this.sno.ActualDateofAdmission = claim.actualDateOfAdmission;
      this.sno.DateofDischarge = claim.dateofdischarge;
      this.sno.ActualDateofDischarge = claim.actualDateOfDischarge;
      this.sno.claimStatus = claim.claimstatus;
      this.sno.SNARemarks = claim.snaremarks;
      this.sno.approvedUser = claim.approveduser;
      this.sno.rejectedUser = claim.rejecteduser;
      this.sno.investigatedUser = claim.investigationuser;
      this.sno.snaApprovedUser = claim.snaapproveduser;
      this.sno.snaRejectedUser = claim.snarejecteduser;
      this.sno.snaInvestigatedUser = claim.snainvestigationuser;
      this.sno.snaFinalDecisionUser = claim.snafinaldecisionuser;
      this.sno.paidUser = claim.paiduser;
      this.sno.tpaFinalDecisionUser = claim.tpafinaldecisionuser;
      this.report.push(this.sno);
    }
    let stateName = 'All', districtName = 'All', hospitalName = 'All';
    for (var i = 0; i < this.stateList.length; i++) {
      if (this.requestData.stateCode == this.stateList[i].stateCode) {
        stateName = this.stateList[i].stateName;
      }
    }
    for (var i = 0; i < this.districtList.length; i++) {
      if (this.requestData.distCode == this.districtList[i].districtcode) {
        districtName = this.districtList[i].districtname;
      }
    }
    for (var i = 0; i < this.hospitalList.length; i++) {
      if (this.requestData.hospitalCode == this.hospitalList[i].hospitalCode) {
        hospitalName = this.hospitalList[i].hospitalName;
      }
    }
    let filter = [];
    filter.push([['Actual Date of Discharge From', this.convertStringToDate(this.requestData.fromDate)]]);
    filter.push([['Actual Date of Discharge To', this.convertStringToDate(this.requestData.toDate)]]);
    filter.push([['Claim Status', this.requestData.action]]);
    filter.push([['State Name', stateName]]);
    filter.push([['District Name', districtName]]);
    filter.push([['Hospital Name', hospitalName]]);
    TableUtil.exportListToExcelWithFilter(this.report, 'Old Processed Claim List', this.heading, filter);
  }
  downloadPdf() {
    var doc = new jsPDF('l', 'mm', [500, 450]);
    doc.setFontSize(12);
    doc.text('Actual Date of Discharge From:' + this.convertStringToDate(this.requestData.fromDate), 10, 10);
    doc.text('Actual Date of Discharge To:' + this.convertStringToDate(this.requestData.toDate), 100, 10);
    doc.text('Claim Status:' + this.requestData.action, 190, 10);
    let stateName = 'All', districtName = 'All', hospitalName = 'All';
    for (var i = 0; i < this.stateList.length; i++) {
      if (this.requestData.stateCode == this.stateList[i].stateCode) {
        stateName = this.stateList[i].stateName;
      }
    }
    for (var i = 0; i < this.districtList.length; i++) {
      if (this.requestData.distCode == this.districtList[i].districtcode) {
        districtName = this.districtList[i].districtname;
      }
    }
    for (var i = 0; i < this.hospitalList.length; i++) {
      if (this.requestData.hospitalCode == this.hospitalList[i].hospitalCode) {
        hospitalName = this.hospitalList[i].hospitalName;
      }
    }
    doc.text('State Name:' + stateName, 10, 20);
    doc.text('District Name:' + districtName, 80, 20);
    doc.text('Hospital Name:' + hospitalName, 150, 20);
    doc.text("Generated On: " + this.convertDate(new Date()), 10, 30);
    doc.text("Generated By: " +this.user.fullName, 150, 30);
    doc.text("Old Processed Claim List", 110, 40);
    var col = [['Sl#', 'Claim No.', 'URN', 'Patient Name', 'Invoice No', 'Hospital Name', 'Hospital Code', 'Date of Admission', 'Actual Date of Admission', 'Date of Discharge', 'Actual Date of Discharge', 'Claim Status', 'SNA Remarks', 'Approved User', 'Rejected User', 'Investigated User', 'SNA Approved User', 'SNA Rejected User', 'SNA Investigated User', 'SNA Final Decision User', 'Paid User', 'TPA Final Decision User']];
    var rows = [];
    var claim: any;
    for (var i = 0; i < this.snoclaimlist.length; i++) {
      claim = this.snoclaimlist[i];
      var temp = [i + 1, claim.oldClaimNo, claim.urn, claim.patientName, claim.invoiceNumber, claim.hospitalname, claim.hospitalcode, claim.dateofadmission, claim.actualDateOfAdmission, claim.dateofdischarge, claim.actualDateOfDischarge, claim.claimstatus, claim.snaremarks,
      claim.approveduser, claim.rejecteduser, claim.investigationuser, claim.snaapproveduser, claim.snarejecteduser, claim.snainvestigationuser, claim.snafinaldecisionuser, claim.paiduser, claim.tpafinaldecisionuser];
      rows.push(temp);
    }
    autoTable(doc, {
      head: col,
      body: rows,
      theme: 'grid',
      startY: 50,
      styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
      bodyStyles: { overflow: 'linebreak', cellWidth: 'wrap', lineWidth: 0.1, lineColor: 0, textColor: 20 },
      headStyles: { overflow: 'linebreak', cellWidth: 'wrap', lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 20 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 25 },
        5: { cellWidth: 30 },
        6: { cellWidth: 25 },
        7: { cellWidth: 20 },
        8: { cellWidth: 20 },
        9: { cellWidth: 20 },
        10: { cellWidth: 20 },
        11: { cellWidth: 20 },
        12: { cellWidth: 20 },
        13: { cellWidth: 20 },
        14: { cellWidth: 20 },
        15: { cellWidth: 20 },
        16: { cellWidth: 20 },
        17: { cellWidth: 20 },
        18: { cellWidth: 20 },
        19: { cellWidth: 20 },
        20: { cellWidth: 20 },
        21: { cellWidth: 20 },
      }
    });
    doc.save('Old Processed Claim List.pdf');
  }
  convertStringToDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy');
    return date;
  }
  convertDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy, h:mm:ss a');
    return date;
  }
}
