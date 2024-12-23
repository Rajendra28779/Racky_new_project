import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../header.service';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import { CpdPaymentReportService } from '../Services/cpd-payment-report.service';
import { Router } from '@angular/router';
import { JwtService } from 'src/app/services/jwt.service';
import { SnoCLaimDetailsService } from '../Services/sno-claim-details.service';
import Swal from 'sweetalert2';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { TableUtil } from '../util/TableUtil';
import jsPDF from 'jspdf';
import { CurrencyPipe, formatDate } from '@angular/common';
import autoTable from 'jspdf-autotable';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-packagecalculator',
  templateUrl: './packagecalculator.component.html',
  styleUrls: ['./packagecalculator.component.scss']
})
export class PackagecalculatorComponent implements OnInit {
  placeHolder = "Select Package Name";
  dropdownSettings: IDropdownSettings = {};
  stateList: any = [];
  user: any;
  stateId: any = '';
  dataRequest: any;
  statelist: Array<any> = [];
  distList: Array<any> = [];
  distCode: any;
  distId: any = '';
  hospitalList: Array<any> = [];
  selectedItems: any = [];
  districtList: any = []
  hospitalListforadmin: any = []
  hidestatusfordropdownsna: boolean = false;
  hidestatusfordropdownAdmin: boolean = false;
  txtsearchDate: any;
  pageElement: any;
  currentPage: any;
  hidepackagedetails: boolean = false;
  hideimplantdetails: boolean = false;
  hidepdf: boolean = false;
  hideheddetails: boolean = false;
  showPegi: boolean;
  showPegiimplant: boolean;
  showPegihed: boolean;
  txtsearchDateImplant: any;
  currentPageimplant: any;
  pageElementimplant: any;
  currentPagehed: any;
  pageElementhed: any;
  isDisabled: boolean = true;
  constructor(public headerService: HeaderService,
    private cpdpaymentservice: CpdPaymentReportService,
    private route: Router,
    private jwtService: JwtService,
    public snoService: SnoCLaimDetailsService,
    private snoServices: SnocreateserviceService,
    private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.user = this.sessionService.decryptSessionData("user");
    this.headerService.setTitle('Package Calculator ');
    this.currentPage = 1;
    this.currentPageimplant = 1;
    this.currentPagehed = 1;
    this.pageElement = 10;
    this.pageElementimplant = 10;
    this.pageElementhed = 10;
    if (this.user.groupId == 1) {
      this.hidestatusfordropdownsna = false;
      this.hidestatusfordropdownAdmin = true;
      this.getStateListForAdmin();
      this.getpackagedetails();
    } else if (this.user.groupId == 4 || this.user.groupId == 18 || this.user.groupId == 32 || this.user.groupId == 33 || this.user.groupId == 34) {
      this.hidestatusfordropdownsna = true;
      this.hidestatusfordropdownAdmin = false;
      this.getStateListForSNA();
      this.getpackagedetails();
    }
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'packageconcat',
      itemsShowLimit: 4,
      allowSearchFilter: true,
      selectAllText: 'Select All',
      unSelectAllText: "Un-Select All",
    };
    $('#packagecalculator').hide();
  }

  stateData: any = [];
  getStateListForSNA() {
    this.snoService.getStateList().subscribe((data: any) => {
      this.stateData = data;
      this.stateData.sort((a, b) => a.stateName.localeCompare(b.stateName));
      for (let j = 0; j < this.stateData.length; j++) {
        if (this.stateData[j].stateCode == '21') {
          this.statelist.push(this.stateData[j]);
        }
      }
      for (let i = 0; i < this.stateData.length; i++) {
        if (this.stateData[i].stateCode != '21') {
          this.statelist.push(this.stateData[i]);
        }
      }
      if (this.dataRequest) {
        this.stateId = this.dataRequest.stateCode;
        this.getDistrict(this.stateId);
      }
    });
  }
  stateCode: any;
  userId: any;
  getDistrict(code) {
    this.stateCode = code;
    this.userId = this.user.userId;
    this.snoService.getDistrictListByState(this.userId, this.stateCode).subscribe(
      (data: any) => {
        this.distList = data;
        this.distList.sort((a, b) =>
          a.DISTRICTNAME.localeCompare(b.DISTRICTNAME)
        );
        if (this.dataRequest) {
          this.distId = this.dataRequest.distCode;
          this.getHospital(this.distId);
        }
      }
    );
  }
  hospitalId: any = '';
  getHospital(code) {
    this.distCode = code;
    this.userId = this.user.userId;
    this.snoService.getHospitalByDist(this.userId, this.stateCode, this.distCode).subscribe(
      (data: any) => {
        this.hospitalList = data;
        this.hospitalId = this.dataRequest.hospitalCode;
      }
    );
  }
  getStateListForAdmin() {
    this.snoService.getStateList().subscribe(
      (response) => {
        this.stateList = response;
      },
      (error) => console.log(error)
    )
  }
  OnChangeState(id) {
    $("#districtId").val("");
    this.selectedItems = [];
    localStorage.setItem("stateCode", id);
    this.snoServices.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = response;
      },
      (error) => console.log(error)
    )
  }
  OnChangeDistrict(id) {
    this.selectedItems = [];
    var stateCode = localStorage.getItem("stateCode");
    this.snoServices.getHospitalbyDistrictId(id, stateCode).subscribe(
      (response) => {
        this.hospitalListforadmin = response;
      },
      (error) => console.log(error)
    )
  }

  packagedata: any = [];
  getpackagedetails() {
    this.cpdpaymentservice.getpackagedetails().subscribe((data: any) => {
      if (data.status = 'success') {
        this.packagedata = data.details;
      } else if (data.status = 'fails') {
        this.swal('', 'Something went wrong. ', 'error');
      }
    }, (error) => {
      console.log(error);
      this.swal('', 'Something went wrong.', 'error');
    })
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  distictObj: any;
  pckList: any = [];
  onItemSelect(item) {
    this.distictObj = {
      id: "",
      packageheadercode: ""
    }
    this.distictObj.id = item.id;
    for (var i = 0; i < this.packagedata.length; i++) {
      if (this.distictObj.id == this.packagedata[i].id) {
        this.distictObj.packageheadercode = this.packagedata[i].packageheadercode;
      }
    }
    var stat: boolean = false;
    for (const i of this.pckList) {
      if (i.id == this.distictObj.id) {
        stat = true;
      }
    }
    if (stat == false) {
      this.pckList.push(this.distictObj);
    }
  }

  onDeSelectAll(list) {
    this.pckList = [];
  }

  onItemDeSelect(item) {
    for (var i = 0; i < this.pckList.length; i++) {
      if (item.id == this.pckList[i].id) {
        var index = this.pckList.indexOf(this.pckList[i]);
        if (index !== -1) {
          this.pckList.splice(index, 1);
        }
      }
    }
  }

  onSelectAll(list) {
    for (var x = 0; x < list.length; x++) {
      let item = list[x];
      this.distictObj = {
        id: "",
        packageheadercode: ""
      }
      this.distictObj.id = item.id;
      for (var i = 0; i < this.packagedata.length; i++) {
        if (this.distictObj.id == this.packagedata[i].id) {
          this.distictObj.packageheadercode = this.packagedata[i].packageheadercode;
        }
      }
      var stat: boolean = false;
      for (const i of this.pckList) {
        if (i.id == this.distictObj.id) {
          stat = true;
        }
      }
      if (stat == false) {
        this.pckList.push(this.distictObj);
      }
    }
  }
  packlist: any;
  packagelist: any = [];
  record: any;
  statedata: any;
  districtdata: any;
  hospitaldata: any;
  hospitaltype: any;
  getImplant() {
    this.packagelist = [];
    this.hideimplantdetails =false;
    this.hideheddetails =false;
    this.hidepdf =false;
    this.impfinaldata=[];
    this.hedFinalData=[];
    let userid = this.user.userId;
    if (this.user.groupId == 4 || this.user.groupId == 18 || this.user.groupId == 32 || this.user.groupId == 33 || this.user.groupId == 34) {
      this.statedata = this.stateId;
      this.districtdata = this.distId;
      this.hospitaldata = this.hospitalId;
    } else if (this.user.groupId == 1) {
      this.statedata = $("#stateId").val();
      this.districtdata = $("#districtId").val();
      this.hospitaldata = $("#hospital").val();
    }
    this.hospitaltype = $("#hospitaltype").val();
    if (this.statedata == null || this.statedata == undefined || this.statedata == '') {
      this.statedata = '';
    } else if (this.districtdata == null || this.districtdata == undefined || this.districtdata == '') {
      this.districtdata = '';
    } else if (this.hospitaldata == null || this.hospitaldata == undefined || this.hospitaldata == '') {
      this.hospitaldata = '';
    } else if (this.hospitaltype == null || this.hospitaltype == undefined || this.hospitaltype == '') {
      this.hospitaltype = '';
    }
    if (this.pckList.length == 0) {
      this.swal('', 'Please Choose Package Name ', 'error');
      this.hidepackagedetails = false;
      return;
    } else {
      this.packlist = this.hosplisttostring(this.pckList);
    }
    this.cpdpaymentservice.getpackagedetailsForCalculation(this.packlist, userid, this.statedata, this.districtdata, this.hospitaldata, this.hospitaltype).subscribe((data: any) => {
      if (data.status = 'success') {
        this.packagelist = data.details;
        this.record = this.packagelist.length;
        if (this.record > 0) {
          this.showPegi = true;
        } else {
          this.showPegi = false;
        }
        this.hidepackagedetails = true;
      } else if (data.status = 'fails') {
        this.swal('', 'Something went wrong. ', 'error');
      }
    }, (error) => {
      console.log(error);
      this.swal('', 'Something went wrong.', 'error');
    })
  }

  getPackReset() {
    window.location.reload();
  }
  id: any;
  packageheadercode: any;
  hosplisttostring(packlist: any = []) {
    this.id = "";
    this.packageheadercode = "";
    if (packlist.length == 0) {
      this.id = "";
      this.packageheadercode = "";
    } else {
      for (let i = 0; i < packlist.length; i++) {
        this.id = this.id + packlist[i].id + ",";
        this.packageheadercode = this.packageheadercode + packlist[i].packageheadercode + ",";
      }
    }
    return this.packageheadercode;
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  }
  report: any = [];
  sno: any = {
    Slno: "",
    selectedpackage: "",
    selectedpackageheadername: "",
    selectedpackageheadercode: "",
    amount: "",
  };
  heading = [['Sl#', 'Selected Package', 'Selected Package Header Name', 'Selected Package Header Code', 'Amount']];

  downloadReportforpackageExcel() {
    this.report = [];
    let claim: any;
    for (var i = 0; i < this.packagelist.length; i++) {
      claim = this.packagelist[i];
      this.sno = [];
      this.sno.Slno = i + 1;
      this.sno.selectedpackage = claim.packageheadercode;
      this.sno.selectedpackageheadername = claim.packageheadername;
      this.sno.selectedpackageheadercode = claim.procedurecode;
      this.sno.amount = claim.amount;
      this.report.push(this.sno);
    }
    let filter = [];
    filter.push([['Package Name:- ', this.packlist]]);
    TableUtil.exportListToExcelWithFilterforadmin(this.report, "Package Calculator For Package Report", this.heading, filter);
  }
  downloadReportforpackagepdf() {
    this.report = [];
    let SlNo = 1;
    this.packagelist.forEach(element => {
      let rowData = [];
      rowData.push(SlNo++);
      rowData.push(element.packageheadercode);
      rowData.push(element.packageheadername);
      rowData.push(element.procedurecode);
      rowData.push(element.amount);
      this.report.push(rowData);
    });
    let doc = new jsPDF('l', 'mm', [238, 270]);
    doc.setFontSize(10);
    doc.text('Authority Name :-' + this.user.fullName, 5, 5);
    doc.text('Package Name:-' + this.packlist, 5, 10);
    doc.text('Document Generate Date :-' + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en').toString(), 5, 15);
    doc.text('Package Calculator For Package Report', 100, 20);
    doc.setLineWidth(0.7);
    doc.line(100, 22, 158, 22);
    autoTable(doc, {
      head: this.heading, body: this.report, startY: 24, theme: 'grid',
      styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
      bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
      headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 30 },
        2: { cellWidth: 50 },
        3: { cellWidth: 50 },
        4: { cellWidth: 30 },
        5: { cellWidth: 30 },
      }
    })
    doc.save('Package_Calculator_For_Package_Report.pdf');
  }
  impantlist: any = [];
  procedurecode: any;
  recordimplant: any;
  implantallamount: number = 0;
  packageheadercodeData: any = '';
  packageheadernameData: any = '';
  amountData: any = '';
  view(procedurecode: any, packageheadercode: any, packageheadername: any, amount: any) {
    this.impantlist = [];
    let userid = this.user.userId;
    this.procedurecode = procedurecode;
    this.packageheadercodeData = packageheadercode;
    this.packageheadernameData = packageheadername;
    this.amountData = amount;
    if (this.user.groupId == 4) {
      this.statedata = this.stateId;
      this.districtdata = this.distId;
      this.hospitaldata = this.hospitalId;
    } else if (this.user.groupId == 1) {
      this.statedata = $("#stateId").val();
      this.districtdata = $("#districtId").val();
      this.hospitaldata = $("#hospital").val();
    }
    this.hospitaltype = $("#hospitaltype").val();
    if (this.statedata == null || this.statedata == undefined || this.statedata == '') {
      this.statedata = '';
    } else if (this.districtdata == null || this.districtdata == undefined || this.districtdata == '') {
      this.districtdata = '';
    } else if (this.hospitaldata == null || this.hospitaldata == undefined || this.hospitaldata == '') {
      this.hospitaldata = '';
    } else if (this.hospitaltype == null || this.hospitaltype == undefined || this.hospitaltype == '') {
      this.hospitaltype = '';
    }
    this.cpdpaymentservice.getpackagedetailsForImpant(userid, this.procedurecode, this.statedata, this.districtdata, this.hospitaldata, this.hospitaltype).subscribe((data: any) => {
      if (data.status = 'success') {
        this.impantlist = data.details;
        this.impantlist.forEach((element: any) => {
          let data = {
            implantcode: element.implantcode,
            unitprice: element.unitprice,
            procedurecode: element.procedurecode,
            checked: false
          }
          this.tempPriceArray.push(data);
          this.tempFinalPriceArray.push(data);
        });
        this.recordimplant = this.impantlist.length;
        this.hideimplantdetails = true;
        if (this.recordimplant > 0) {
          this.showPegiimplant = true;
          this.getHedDEtails();
          // this.hideimplantdetails = false;
          this.hideheddetails = false;
        } else {
          this.showPegiimplant = false;
        }
        if (this.recordimplant == 0) {
          this.implantallamount = 0;
        } else {
          for (let i = 0; i < this.impantlist.length; i++) {
            this.implantallamount += Number(this.impantlist[i].unitprice);
          }
        }
      } else if (data.status = 'fails') {
        this.swal('', 'Something went wrong. ', 'error');
      }
    }, (error) => {
      console.log(error);
      this.swal('', 'Something went wrong.', 'error');
    })
  }

  reportimplant: any = [];
  snoimplnt: any = {
    Slno: "",
    procedurecode: "",
    implantcode: "",
    implantname: "",
    price: "",
    priceeditable: "",
  };
  headingimplant = [['Sl#', 'Selected Procedure Code', 'Selected Implant Code', 'Selected Implant Name', 'Price', 'Price Editable']];
  downloadReportforImplantExcel() {
    this.reportimplant = [];
    let claimimplant: any;
    for (var i = 0; i < this.impantlist.length; i++) {
      claimimplant = this.impantlist[i];
      this.snoimplnt = [];
      this.snoimplnt.Slno = i + 1;
      this.snoimplnt.procedurecode = claimimplant.procedurecode;
      this.snoimplnt.implantcode = claimimplant.implantcode;
      this.snoimplnt.implantname = claimimplant.implantname;
      this.snoimplnt.price = claimimplant.unitprice;
      this.snoimplnt.priceeditable = claimimplant.priceeditable;
      this.reportimplant.push(this.snoimplnt);
    }
    let filter = [];
    filter.push([['Package Name:- ', this.packlist]]);
    if (this.hospitaltype === '1') {
      filter.push([['Hospital Name:- ', "NABH"]]);
    } else if (this.hospitaltype === '2') {
      filter.push([['Hospital Name:- ', "NON-NABH"]]);
    } else if (this.hospitaltype === '3') {
      filter.push([['Hospital Name:- ', "NABH ENTRY LEVEL"]]);
    } else if (this.hospitaltype === '4') {
      filter.push([['Hospital Name:- ', ">OUTSIDE STATE NABH"]]);
    } else if (this.hospitaltype === '5') {
      filter.push([['Hospital Name:- ', "OUTSIDE STATE NABH ENTRY LEVEL"]]);
    } else if (this.hospitaltype === '6') {
      filter.push([['Hospital Name:- ', "OUTSIDE STATE HOSPITAL WITH > 100 BED"]]);
    }
    TableUtil.exportListToExcelWithFilterforadmin(this.reportimplant, "Package Calculator For Implant Report", this.headingimplant, filter);
  }
  downloadReportforImplantpdf() {
    this.reportimplant = [];
    let SlNo = 1;
    this.impantlist.forEach(element => {
      let rowData = [];
      rowData.push(SlNo++);
      rowData.push(element.procedurecode);
      rowData.push(element.implantcode);
      rowData.push(element.implantname);
      rowData.push(element.unitprice);
      rowData.push(element.priceeditable);
      this.reportimplant.push(rowData);
    });
    let doc = new jsPDF('l', 'mm', [238, 270]);
    doc.setFontSize(10);
    doc.text('Authority Name :-' + this.user.fullName, 5, 5);
    if (this.hospitaltype === '1') {
      doc.text('Hospital Type:-' + "NABH", 5, 10);
    } else if (this.hospitaltype === '2') {
      doc.text('Hospital Type:-' + "NON-NABH", 5, 10);
    } else if (this.hospitaltype === '3') {
      doc.text('Hospital Type:-' + "NABH ENTRY LEVEL", 5, 10);
    } else if (this.hospitaltype === '4') {
      doc.text('Hospital Type:-' + "OUTSIDE STATE NABH", 5, 10);
    } else if (this.hospitaltype === '5') {
      doc.text('Hospital Type:-' + "OUTSIDE STATE NABH ENTRY LEVEL", 5, 10);
    } else if (this.hospitaltype === '6') {
      doc.text('Hospital Type:-' + "OUTSIDE STATE HOSPITAL WITH > 100 BED", 5, 10);
    }
    doc.text('Package Name:-' + this.packlist, 5, 15);
    doc.text('Document Generate Date :-' + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en').toString(), 5, 20);
    doc.text('Package Calculator For Package Report', 100, 25);
    doc.setLineWidth(0.7);
    doc.line(100, 26, 168, 26);
    autoTable(doc, {
      head: this.headingimplant, body: this.reportimplant, startY: 28, theme: 'grid',
      styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
      bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
      headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 50 },
        2: { cellWidth: 50 },
        3: { cellWidth: 50 },
        4: { cellWidth: 30 },
        5: { cellWidth: 30 },
      }
    })
    doc.save('Package_Calculator_For_Package_Implant_Report.pdf');
  }

  onPageBoundsCorrectionimplnt(number: number) {
    this.currentPageimplant = number;
  }
  pageItemChangeimpant() {
    this.pageElementimplant = (<HTMLInputElement>document.getElementById("pageItemimplant")).value;
  }
  hedlist: any = [];
  recordhed: any;
  hedallamount: number = 0;
  tempFinalHedArray = []
  getHedDEtails() {
    this.hedlist = [];
    this.hedallamount = 0;
    this.cpdpaymentservice.getheddetails().subscribe((data: any) => {
      if (data.status = 'success') {
        this.hedlist = data.details;
        this.hedlist.forEach((element: any) => {
          let datahed = {
            hedcode: element.hedcode,
            hedname: element.hedname,
            price: element.price,
            checked: false
          }
          this.tempFinalHedArray.push(datahed);
        });
        this.recordhed = this.hedlist.length;
        this.hideimplantdetails = true;
        if (this.recordhed > 0) {
          this.showPegihed = true;
        } else {
          this.showPegihed = false;
          this.hideimplantdetails = false;
        }
        if (this.recordhed == 0) {
          this.hedallamount = 0;
        } else {
          for (let i = 0; i < this.hedlist.length; i++) {
            this.hedallamount += Number(this.hedlist[i].price);
          }
        }
      } else if (data.status = 'fails') {
        this.swal('', 'Something went wrong. ', 'error');
      }
    }, (error) => {
      console.log(error);
      this.swal('', 'Something went wrong.', 'error');
    })
  }

  reporthed: any = [];
  snohed: any = {
    Slno: "",
    hedcode: "",
    hedname: "",
    price: "",
  };
  headinghed = [['Sl#', 'HED Code', 'HED Name', 'Price']];
  downloadReportforHedpdf() {
    this.reporthed = [];
    let SlNo = 1;
    this.hedlist.forEach(element => {
      let rowData = [];
      rowData.push(SlNo++);
      rowData.push(element.hedcode);
      rowData.push(element.hedname);
      rowData.push(element.price);
      this.reporthed.push(rowData);
    });
    let doc = new jsPDF('l', 'mm', [238, 270]);
    doc.setFontSize(10);
    doc.text('Authority Name :-' + this.user.fullName, 5, 5);
    if (this.hospitaltype === '1') {
      doc.text('Hospital Type:-' + "NABH", 5, 10);
    } else if (this.hospitaltype === '2') {
      doc.text('Hospital Type:-' + "NON-NABH", 5, 10);
    } else if (this.hospitaltype === '3') {
      doc.text('Hospital Type:-' + "NABH ENTRY LEVEL", 5, 10);
    } else if (this.hospitaltype === '4') {
      doc.text('Hospital Type:-' + "OUTSIDE STATE NABH", 5, 10);
    } else if (this.hospitaltype === '5') {
      doc.text('Hospital Type:-' + "OUTSIDE STATE NABH ENTRY LEVEL", 5, 10);
    } else if (this.hospitaltype === '6') {
      doc.text('Hospital Type:-' + "OUTSIDE STATE HOSPITAL WITH > 100 BED", 5, 10);
    }
    doc.text('Package Name:-' + this.packlist, 5, 15);
    doc.text('Document Generate Date :-' + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en').toString(), 5, 20);
    doc.text('Package Calculator For HED Report', 100, 25);
    doc.setLineWidth(0.7);
    doc.line(100, 26, 168, 26);
    autoTable(doc, {
      head: this.headinghed, body: this.reporthed, startY: 28, theme: 'grid',
      styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
      bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
      headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 50 },
        2: { cellWidth: 50 },
        3: { cellWidth: 50 },
        4: { cellWidth: 30 },
        5: { cellWidth: 30 },
      }
    })
    doc.save('Package_Calculator_For_Package_HED_Report.pdf');
  }
  downloadReportforHedExcel() {
    this.report = [];
    let claim: any;
    for (var i = 0; i < this.hedlist.length; i++) {
      claim = this.hedlist[i];
      this.sno = [];
      this.sno.Slno = i + 1;
      this.sno.hedcode = claim.hedcode;
      this.sno.hedname = claim.hedname;
      this.sno.price = claim.price;
      this.report.push(this.sno);
    }
    let filter = [];
    filter.push([['Package Name:- ', this.packlist]]);
    if (this.hospitaltype === '1') {
      filter.push([['Hospital Name:- ', "NABH"]]);
    } else if (this.hospitaltype === '2') {
      filter.push([['Hospital Name:- ', "NON-NABH"]]);
    } else if (this.hospitaltype === '3') {
      filter.push([['Hospital Name:- ', "NABH ENTRY LEVEL"]]);
    } else if (this.hospitaltype === '4') {
      filter.push([['Hospital Name:- ', ">OUTSIDE STATE NABH"]]);
    } else if (this.hospitaltype === '5') {
      filter.push([['Hospital Name:- ', "OUTSIDE STATE NABH ENTRY LEVEL"]]);
    } else if (this.hospitaltype === '6') {
      filter.push([['Hospital Name:- ', "OUTSIDE STATE HOSPITAL WITH > 100 BED"]]);
    }
    TableUtil.exportListToExcelWithFilterforadmin(this.report, "Package Calculator For HED Report", this.heading, filter);
  }

  onPageBoundsCorrectionhed(number: number) {
    this.currentPagehed = number;
  }
  pageItemChangehed() {
    this.pageElementhed = (<HTMLInputElement>document.getElementById("pageItemhed")).value;
  }

  impfinaldata = [];
  finalimplantAmount: Number;
  finalhedAmount: Number;
  finalamount: Number = 0
  getPackageFinalCalculationpdf() {
    this.impfinaldata = [];
    this.finalimplantAmount = 0;
    this.finalhedAmount = 0;
    this.tempFinalPriceArray.forEach((elem: any) => {
      if (elem.checked) {
        this.finalimplantAmount = Number(this.finalimplantAmount) + Number(elem.unitprice);
        let data = {
          procedurecode: elem.procedurecode,
          implantcode: elem.implantcode,
          unitprice: elem.unitprice,
        }
        this.impfinaldata.push(data);
      }
    });
    this.hedFinalData.forEach((data: any) => {
      this.finalhedAmount = Number(this.finalhedAmount) + Number(data.price);
    })
    //final Calculation
    this.finalamount = Number(this.amountData) + Number(this.finalimplantAmount) + Number(this.finalhedAmount)

    $('#packagecalculator').show();
  }
  ///calculation of package hed with check box
  dataCodehed: any = [];
  dataAmounthed: any = [];
  hedFinalData: any = [];
  checkAllCheckBoxHed(event: any) {
    this.dataCodehed = [];
    this.dataAmounthed = [];
    this.hedFinalData = [];
    if (event.target.checked == true) {
      this.hidepdf = true;
      for (let i = 0; i < this.hedlist.length; i++) {
        $('#' + this.hedlist[i].hedcode).prop('checked', true);
        this.dataCodehed.push(this.hedlist[i].hedcode);
        this.dataAmounthed.push(this.hedlist[i].price);
        let datahed = {
          hedcode: this.hedlist[i].hedcode,
          hedname: this.hedlist[i].hedname,
          price: this.hedlist[i].price,
        }
        this.hedFinalData.push(datahed);
      }
    } else {
      for (let i = 0; i < this.hedlist.length; i++) {
        $('#' + this.hedlist[i].hedcode).prop('checked', false);
        this.dataCodehed = [];
        this.dataAmounthed = [];
        this.hedFinalData = [];
        this.hidepdf = false;
      }
    }
  }
  tdCheckHed(event: any, hedcode: any, price: any, hedname: any) {
    if (event.target.checked) {
      // this.hidepdf = true;
      this.dataCodehed.push(hedcode);
      this.dataAmounthed.push(price);
      let datahed = {
        hedcode: hedcode,
        hedname: hedname,
        price: price,
      }
      this.hedFinalData.push(datahed);
      if (this.hedFinalData.length != 0) {
        this.hidepdf = true;
      } else {
        this.hidepdf = false;
      }
    } else {
      this.hidepdf = false;
      for (let i = 0; i < this.hedlist.length; i++) {
        if (this.dataCodehed[i] == hedcode) {
          this.dataCodehed.splice(i, 1);
        }
        if (this.dataAmounthed[i] == price) {
          this.dataAmounthed.splice(i, 1);
        }
      }
      for (let i = 0; i < this.hedFinalData.length; i++) {
        if (this.hedFinalData[i].hedcode == hedcode) {
          this.hedFinalData.splice(i, 1);
        }
      }
      if (this.hedFinalData.length != 0) {
        this.hidepdf = true;
      } else {
        this.hidepdf = false;
      }
    }
    if (this.dataCodehed.length == this.hedlist.length) {
      $('#allCheckhed').prop('checked', true);
    } else {
      $('#allCheckhed').prop('checked', false);
    }
  }

  //calculation for hed selected check box amount
  sumhed: number
  gethedSelectedAmountDetails() {
    this.sumhed = this.dataAmounthed.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  }

  ///calculation of package Implant with check box
  dataCodeimplant: any = [];
  dataAmountimpalnt: any = [];
  finalUnitPrice: number = 0;
  tempPriceArray: any[] = [];
  tempFinalPriceArray: any[] = [];
  checkAllCheckBoxImplant(checked: boolean) {
    this.dataCodeimplant = [];
    this.dataAmountimpalnt = [];
    if (checked) {
      for (let i = 0; i < this.impantlist.length; i++) {
        $('#check' + this.impantlist[i].implantcode + i).prop('checked', true);
        $('#unitprice' + this.impantlist[i].implantcode + i).prop('disabled', false);
        this.dataCodeimplant.push(this.impantlist[i].implantcode);
        this.dataAmountimpalnt.push(this.impantlist[i].unitprice);
        this.impantlist[i].disabelflag = true;
        this.impantlist[i].isCheckedImplant = true;
        this.finalUnitPrice = this.finalUnitPrice + Number($('#unitprice' + this.impantlist[i].implantcode + i).val());
        this.tempFinalPriceArray[i].implantcode = this.impantlist[i].implantcode;
        this.tempFinalPriceArray[i].checked = true;
        this.hidepdf =false;
      }
    } else {
      this.hidepdf =false;
      this.finalUnitPrice = 0;
      for (let i = 0; i < this.impantlist.length; i++) {
        $('#check' + this.impantlist[i].implantcode + i).prop('checked', false);
        $('#unitprice' + this.impantlist[i].implantcode + i).prop('disabled', true);
        this.dataCodeimplant = [];
        this.dataAmountimpalnt = [];
        this.impantlist[i].disabelflag = false;
        // this.hideheddetails = false;
        this.impantlist[i].isCheckedImplant = false;
      }
      let i = 0;
      this.tempPriceArray.forEach((element: any) => {
        $('#unitprice' + element.implantcode + i).val(element.unitprice);
        this.tempFinalPriceArray[i].implantcode = element.implantcode;
        this.tempFinalPriceArray[i].checked = false;
        i++;
      });
    }
    if (this.dataCodeimplant.length != 0) {
      this.hideheddetails = true;
    } else {
      this.hideheddetails = false;
    }
  }
  unitprice: any;
  tdCheckimplant(checked: boolean, implantcode: any, unitprice: any, claim: any, index: any) {
    if (checked) {
      this.dataCodeimplant.push(implantcode);
      this.dataAmountimpalnt.push(unitprice);
      $('#unitprice' + implantcode + index).prop('disabled', false);
      this.impantlist[index].isCheckedImplant = true;
      this.finalUnitPrice = this.finalUnitPrice + Number($('#unitprice' + this.impantlist[index].implantcode + index).val());
      this.tempFinalPriceArray[index].implantcode = implantcode;
      this.tempFinalPriceArray[index].checked = true;
    } else {
      this.impantlist[index].isCheckedImplant = false;
      for (let i = 0; i < this.impantlist.length; i++) {
        if (this.dataCodeimplant[i] == implantcode) {
          this.dataCodeimplant.splice(i, 1);
        }
        if (this.dataAmountimpalnt[i] == unitprice) {
          this.dataAmountimpalnt.splice(i, 1);
        }
      }
      $('#unitprice' + implantcode + index).prop('disabled', true);
      this.finalUnitPrice = this.finalUnitPrice - Number($('#unitprice' + this.impantlist[index].implantcode + index).val());
      this.tempPriceArray.forEach((element: any) => {
        if (element.implantcode == implantcode) {
          $('#unitprice' + implantcode + index).val(element.unitprice);
          this.finalUnitPrice = this.finalUnitPrice - element.unitprice;
          this.tempFinalPriceArray[index].implantcode = element.implantcode;
          this.tempFinalPriceArray[index].checked = false;
        }
      });
    }
    if (this.dataCodeimplant.length == this.impantlist.length) {
      $('#allCheck').prop('checked', true);
    } else {
      $('#allCheck').prop('checked', false);
    }
    if (this.dataCodeimplant.length != 0) {
      this.hideheddetails = true;
    } else {
      this.hideheddetails = false;
      this.hedFinalData =[];
      this.hidepdf=false;
    }
  }

  onChangeUnitPrice(value, implantcode, index) {
    let str = "" + value;
    let length = str.length;
    this.finalUnitPrice = this.finalUnitPrice - value;
    this.tempFinalPriceArray[index].unitprice = value;
    this.tempFinalPriceArray[index].checked = true;
  }

  //calculation for IMpalnt selected check box amount
  sumImplant: Number
  getImpalntSelectedAmountDetails() {
    // Calculate the sum using the reduce method
    this.sumImplant = this.dataAmountimpalnt.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  }

  modalClose() {
    $('#packagecalculator').hide();
  }

  headingpackage = [['Sl#', 'Package Name', 'Package Header code', 'Procedure Code', 'Package Amount']];
  headingpimpalnt = [['Sl#', 'Procedure Code', 'Implant Name', 'Unit/cycle price']];
  headingpackagehed = [['Sl#', 'HED Name', 'HED Code', 'price']];
  packagefinalist: any = [];
  implantfinallist: any = [];
  hedfinallist: any = [];
  packagestartY: any;
  implantyaxis: any;
  hedaxisY: any;
  roundedValuepackagestartY: any;
  roundedValueimplantstartY: any;
  roundedAmount: any;
  downloadpackagecalculation() {
    this.packagefinalist = [];
    this.implantfinallist = [];
    this.hedfinallist = [];
    this.packagestartY = 28;
    let SlNo = 1;
    let rowData = [];
    rowData.push(SlNo++);
    rowData.push(this.packageheadercodeData);
    rowData.push(this.procedurecode);
    rowData.push(this.packageheadernameData);
    rowData.push(this.amountData);
    this.packagefinalist.push(rowData);
    let doc = new jsPDF('l', 'mm', [238, 270]);
    doc.setFontSize(10);
    doc.text('Authority Name :-' + this.user.fullName, 5, 5);
    if (this.hospitaltype === '1') {
      doc.text('Hospital Type:-' + "NABH", 5, 10);
    } else if (this.hospitaltype === '2') {
      doc.text('Hospital Type:-' + "NON-NABH", 5, 10);
    } else if (this.hospitaltype === '3') {
      doc.text('Hospital Type:-' + "NABH ENTRY LEVEL", 5, 10);
    } else if (this.hospitaltype === '4') {
      doc.text('Hospital Type:-' + "OUTSIDE STATE NABH", 5, 10);
    } else if (this.hospitaltype === '5') {
      doc.text('Hospital Type:-' + "OUTSIDE STATE NABH ENTRY LEVEL", 5, 10);
    } else if (this.hospitaltype === '6') {
      doc.text('Hospital Type:-' + "OUTSIDE STATE HOSPITAL WITH > 100 BED", 5, 10);
    }
    doc.text('Package Name:-' + this.packlist, 5, 15);
    doc.text('Document Generate Date :-' + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en').toString(), 5, 20);
    doc.text('Package Calculator', 100, 25);
    doc.setLineWidth(0.7);
    doc.line(100, 26, 130, 26);
    autoTable(doc, {
      head: this.headingpackage, body: this.packagefinalist, startY: this.packagestartY, theme: 'grid',
      styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
      bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
      headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 50 },
        2: { cellWidth: 50 },
        3: { cellWidth: 50 },
        4: { cellWidth: 50 },
      }
    })
    const finalYpackagestartY = (doc as any).autoTable.previous.finalY;
    this.roundedValuepackagestartY = Math.round(finalYpackagestartY);
    let SlNoimplant = 1;
    this.implantyaxis = this.packagefinalist.length + Number(this.packagestartY) + 1
    this.impfinaldata.forEach(element => {
      let rowData = [];
      rowData.push(SlNoimplant++);
      rowData.push(element.procedurecode);
      rowData.push(element.implantcode);
      rowData.push(element.unitprice);
      this.implantfinallist.push(rowData);
    });
    autoTable(doc, {
      head: this.headingpimpalnt, body: this.implantfinallist, startY: this.roundedValuepackagestartY + 10, theme: 'grid',
      styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
      bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
      headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 50 },
        2: { cellWidth: 50 },
        3: { cellWidth: 50 },
        4: { cellWidth: 50 },
      }
    })
    const finalYmplant = (doc as any).autoTable.previous.finalY;
    this.roundedValueimplantstartY = Math.round(finalYmplant);
    let SlNohed = 1;
    this.hedaxisY = this.implantfinallist.length + Number(this.implantyaxis) + 1
    this.hedFinalData.forEach(element => {
      let rowData = [];
      rowData.push(SlNohed++);
      rowData.push(element.hedname);
      rowData.push(element.hedcode);
      rowData.push(element.price);
      this.hedfinallist.push(rowData);
    });
    autoTable(doc, {
      head: this.headingpackagehed, body: this.hedfinallist, startY: this.roundedValueimplantstartY + 10, theme: 'grid',
      styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
      bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
      headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 50 },
        2: { cellWidth: 50 },
        3: { cellWidth: 50 },
        4: { cellWidth: 50 },
      }
    })
    const finalYhed = (doc as any).autoTable.previous.finalY;
    this.roundedAmount = Math.round(finalYhed);
    doc.text('Total Package Amount:' + this.convertCurrency(this.amountData), this.roundedAmount + 40, this.roundedAmount + 20);
    doc.text('Total Implant price :' + this.convertCurrency(this.finalimplantAmount), this.roundedAmount + 40, this.roundedAmount + 25);
    doc.text('Total HED Price     :' + this.convertCurrency(this.finalhedAmount), this.roundedAmount + 40, this.roundedAmount + 30);
    doc.line(this.roundedAmount + 40, this.roundedAmount + 35, 191, this.roundedAmount + 35);
    doc.setLineWidth(0.7);
    doc.text(' Total Amount :-' + this.convertCurrency(this.finalamount), this.roundedAmount + 40, this.roundedAmount + 40);
    doc.save('Package_Calculator.pdf');
  }
  convertCurrency(amount: any) {
    var formatter = new CurrencyPipe('en-US');
    amount = formatter.transform(amount, '', '');
    return amount;
  }
}
