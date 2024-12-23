import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../header.service';
import { SnoCLaimDetailsService } from '../Services/sno-claim-details.service';
import Swal from 'sweetalert2';
import { PreauthService } from '../Services/preauth.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { PackageDetailsMasterService } from '../Services/package-details-master.service';
import { formatDate } from '@angular/common';
import { TableUtil } from '../util/TableUtil';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
declare let $: any;

@Component({
  selector: 'app-view-preauth-approval',
  templateUrl: './view-preauth-approval.component.html',
  styleUrls: ['./view-preauth-approval.component.scss']
})
export class ViewPreauthApprovalComponent implements OnInit {

  snoclaimlist: any;
  user: any;
  txtsearchDate: any;
  isDisplayed: boolean = false;
  userId: any;
  preauthV: any;
  preauthCloseList: any;
  record: any;
  selected: any[];
  preauthData: any;
  group: FormGroup;
  snaremarks: any;
  item: string;
  preAuthId: any;
  pageElement: any;
  currentPage: number;
  preauthCount: any;
  preauthListCount: any;
  totalCount: any;
  completePer: number = 0;
  pendingPer: number = 0;
  totalCost: number;
  preauthCountData: any;
  totalCountP: any;
  totalCountC: any;
  totalOthers: any;
  showHide() {
    this.isDisplayed = !this.isDisplayed;
  }

  statelist: Array<any> = [];
  stateData: any = [];
  distList: any;
  distCode: any;
  hospitalList: any;
  stateCode: any;
  maxChars = 500;
  HighlightRow: Number;
  showPegi: boolean;
  txnpackagedetailid: number;
  hedList: any;
  hed: any;
  impList: any;
  implant: any;
  public isCollapsed = false;

  constructor(
    public headerService: HeaderService,
    public snoService: SnoCLaimDetailsService,
    public preauthService: PreauthService,
    public route: Router,
    private sessionService: SessionStorageService,
    private encryptionService: EncryptionService, public packageDetailsMasterService: PackageDetailsMasterService
  ) { }

  ngOnInit(): void {
    this.getSchemeData();
    this.headerService.setTitle('SNA Action Taken');
    this.user = this.sessionService.decryptSessionData("user");
    localStorage.removeItem('preauthData');
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
      format: 'DD-MM-YYYY LT',
      daysOfWeekDisabled: ['', 7],
    });
    var date = new Date();
    let year = date.getFullYear();
    let date1 = '01';
    let month: any = date.getMonth() - 1;
    if (month == -1) {
      month = 11;
      year = year - 1;
    }
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
    this.getPreAuthorizationList();
    this.getPreAuthorizationCount();
  }

  status(item, id) {
    this.selected = [];
    var list = this.preauthCloseList;
    var l = list.filter((opt: any) => opt.statusFlag).map((opt: any) => opt);
    for (var j = 0; j < l.length; j++) {
      this.selected.push(l[j])
      this.totalCost = (parseInt(l[j].wardamount?.valueOf() ?? 0)) + parseInt((l[j].implantamount?.valueOf() ?? 0)) + parseInt((l[j].hedprice?.valueOf() ?? 0))
    }
    this.txnpackagedetailid = id;
    this.getImplantList();
    this.getHedList();
  }

  getStateList() {
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
    });
  }

  OnChangeState(event) {
    this.stateCode = event.target.value;
    this.userId = this.user.userId;
    this.snoService
      .getDistrictListByState(this.userId, this.stateCode)
      .subscribe((data) => {
        this.distList = data;
        this.distList.sort((a, b) =>
          a.DISTRICTNAME.localeCompare(b.DISTRICTNAME)
        );
      });
  }

  OnChangeDist(event) {
    this.distCode = event.target.value;
    this.userId = this.user.userId;
    this.snoService
      .getHospitalByDist(this.userId, this.stateCode, this.distCode)
      .subscribe((data) => {
        this.hospitalList = data;
      });
  }

  keyPress(event: KeyboardEvent) {
    const pattern = /^[A-Za-z0-9.,-_ \\s]+$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }

  getPreAuthorizationList() {
    let userId = this.user.userId;
    let flag = $('#statusAR').val();
    let fromDate = $('#formdateAR').val();
    let distCode1 = $('#distAR').val();
    let hospitalCode = $('#hospitalAR').val();
    let toDate = $('#todateAR').val();
    let stateCode1 = $('#stateAR').val();
    let schemeid = this.schemeidvalue;
    let schemecategoryid = this.schemecategoryidvalue;
    if (schemecategoryid == null || schemecategoryid == undefined || schemecategoryid == '') {
      schemecategoryid = "";
    } else {
      schemecategoryid = schemecategoryid;
    }
    if (Date.parse(fromDate) > Date.parse(toDate)) {
      this.swal('', ' From Date should be less To Date', 'error');
      return;
    }
    let requestData = {
      userId: userId,
      fromDate: fromDate,
      toDate: toDate,
      stateCode1: stateCode1,
      distCode1: distCode1,
      hospitalCode: hospitalCode,
      flag: flag,
      action: "B",
      schemeid: schemeid,
      schemecategoryid: schemecategoryid
    };
    this.preauthService.getPreAuthorizationList(requestData).subscribe(
      (data) => {
        this.preauthV = data;
        if (this.preauthV.status == 'success') {
          this.preauthCloseList = this.preauthV.data;
          if (this.preauthCloseList.length) {
            this.currentPage = 1;
            this.pageElement = 50;
            this.showPegi = true;
          } else {
            this.showPegi = false;
          }
        } else {
          this.swal('', 'Something went wrong.', 'error');
        }
      },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      }
    );
    this.getPreAuthorizationCount();
  }

  getPreAuthorizationCount() {
    let userId = this.user.userId;
    let flag = $('#statusAR').val();
    let fromDate = $('#formdateAR').val();
    let distCode1 = $('#distAR').val();
    let hospitalCode = $('#hospitalAR').val();
    let toDate = $('#todateAR').val();
    let stateCode1 = $('#stateAR').val();
    let schemeid = this.schemeidvalue;
    let schemecategoryid = this.schemecategoryidvalue;
    if (schemecategoryid == null || schemecategoryid == undefined || schemecategoryid == '') {
      schemecategoryid = "";
    } else {
      schemecategoryid = schemecategoryid;
    }
    if (Date.parse(fromDate) > Date.parse(toDate)) {
      this.swal('', ' From Date should be less To Date', 'error');
      return;
    }
    let requestData = {
      userId: userId,
      fromDate: fromDate,
      toDate: toDate,
      stateCode1: stateCode1,
      distCode1: distCode1,
      hospitalCode: hospitalCode,
      flag: flag,
      action: "C",
      schemeid: schemeid,
      schemecategoryid: schemecategoryid
    };
    this.preauthService.getPreAuthorizationList(requestData).subscribe(
      (data) => {
        this.preauthListCount = data;
        if (this.preauthListCount.status == 'success') {
          this.preauthCount = this.preauthListCount.data;
          this.preauthCountData = this.preauthCount[0]
          this.totalCount = this.preauthCountData.fresh + this.preauthCountData.querycomplied + this.preauthCountData.query + this.preauthCountData.approve + this.preauthCountData.reject + this.preauthCountData.autoapprove + this.preauthCountData.autoreject + this.preauthCountData.expired + this.preauthCountData.cancelled;
          this.totalCountP = this.preauthCountData.fresh + this.preauthCountData.querycomplied;
          this.totalCountC = this.preauthCountData.approve + this.preauthCountData.reject + this.preauthCountData.autoapprove + this.preauthCountData.query + this.preauthCountData.autoreject + this.preauthCountData.expired + this.preauthCountData.cancelled;
          this.totalOthers = this.preauthCountData.autoapprove + this.preauthCountData.autoreject + this.preauthCountData.expired + this.preauthCountData.cancelled;
          this.pendingPer = ((this.totalCountP) / this.totalCount) * 100
          this.completePer = ((this.totalCountC) / this.totalCount) * 100
          if (this.preauthCountData.length) {
            this.currentPage = 1;
            this.pageElement = 50;
            this.showPegi = true;
          } else {
            this.showPegi = false;
          }
        } else {
          this.swal('', 'Something went wrong.', 'error');
        }
      },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      }
    );
  }

  getHedList() {
    let userId = this.user.userId;
    let flag = $('#status').val();
    let fromDate = $('#formdate').val();
    let distCode1 = $('#dist').val();
    let hospitalCode = $('#hospital').val();
    let toDate = $('#todate').val();
    let stateCode1 = $('#state').val();
    let TXNPACKAGEDETAILID = this.txnpackagedetailid;
    let schemeid = this.schemeidvalue;
    let schemecategoryid = this.schemecategoryidvalue;
    if (schemecategoryid == null || schemecategoryid == undefined || schemecategoryid == '') {
      schemecategoryid = "";
    } else {
      schemecategoryid = schemecategoryid;
    }
    if (Date.parse(fromDate) > Date.parse(toDate)) {
      this.swal('', ' From Date should be less To Date', 'error');
      return;
    }
    let requestData = {
      userId: "",
      fromDate: "",
      toDate: "",
      stateCode1: stateCode1,
      distCode1: distCode1,
      hospitalCode: hospitalCode,
      flag: flag,
      action: "D",
      txnPackageDetailId: TXNPACKAGEDETAILID,
      schemeid: schemeid,
      schemecategoryid: schemecategoryid
    };
    this.preauthService.getPreAuthorizationList(requestData).subscribe(
      (data) => {
        this.hedList = data;
        if (this.hedList.status == 'success') {
          this.hed = this.hedList.data;
        }
      },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      }
    );
  }

  getImplantList() {
    let userId = this.user.userId;
    let flag = $('#status').val();
    let fromDate = $('#formdate').val();
    let distCode1 = $('#dist').val();
    let hospitalCode = $('#hospital').val();
    let toDate = $('#todate').val();
    let stateCode1 = $('#state').val();
    let TXNPACKAGEDETAILID = this.txnpackagedetailid;
    if (Date.parse(fromDate) > Date.parse(toDate)) {
      this.swal('', ' From Date should be less To Date', 'error');
      return;
    }
    let requestData = {
      userId: "",
      fromDate: "",
      toDate: "",
      stateCode1: stateCode1,
      distCode1: distCode1,
      hospitalCode: hospitalCode,
      flag: flag,
      action: "E",
      txnPackageDetailId: TXNPACKAGEDETAILID,
    };
    this.preauthService.getPreAuthorizationList(requestData).subscribe(
      (data) => {
        this.impList = data;
        if (this.impList.status == 'success') {
          this.implant = this.impList.data;
        }
      },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      }
    );
  }

  download(pdfName, hCode, dateOfAdm) {
    let img = this.preauthService.downloadFileBySNA(pdfName, hCode, dateOfAdm);
    window.open(img, '_blank');
  }

  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  }

  reset() {
    window.location.reload();
  }

  statusSubmit(urn, id) {
    let state = {
      urnNo: urn,
      txnPckgDetailId: id,
    };
    localStorage.setItem('preauthData', JSON.stringify(state));
    this.route.navigate(['/application/viewpreauthdetails']);
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
  report: any = [];
  heading1 = [['Sl No', 'URN', 'Patient Name', 'Hospital Name', 'Hospital Code', 'Requested Date',
    'No of Days', 'Last Action On', 'Package Code', 'Package Details', 'Description', 'Status', 'Package Amount']];
  downloadReport(no: any) {
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy = this.user.fullName;
    this.report = [];
    let item: any;

    for (let i = 0; i < this.preauthCloseList.length; i++) {
      item = this.preauthCloseList[i];
      let row = [];
      row.push(i + 1);
      row.push(item.urnno);
      row.push(item.membername);
      row.push(item.hospitalName);
      row.push(item.hospitalcode);
      row.push(item.hospitaluploaddate);
      row.push(item.noofdays);
      row.push(item.lastactiondate);
      row.push(item.procedurecode);
      row.push(item.packageheadername)
      row.push(item.description);
      row.push(item.status);
      row.push(item.totalpackagecost);
      this.report.push(row);
    }

    let statename = 'All';
    let distname = 'All';
    let hospital = 'All';
    let schemeList = 'All';

    for (let j = 0; j < this.statelist.length; j++) {
      if (this.statelist[j].stateCode == $('#stateAR').val()) {
        statename = this.statelist[j].stateName;
      }
    }
    for (let j = 0; j < this.distList?.length; j++) {
      if (this.distList[j].DISTRICTCODE == $('#distAR').val()) {
        distname = this.distList[j].DISTRICTNAME;
      }
    }

    for (let j = 0; j < this.hospitalList?.length; j++) {
      if (this.hospitalList[j].HOSPITALCODE == $('#hospitalAR').val()) {
        hospital = this.hospitalList[j].HOSPITALNAME;
      }
    }
    for (let j = 0; j < this.schemeList?.length; j++) {
      if (this.schemeList[j].schemeCategoryId == $('#schemacategory').val()) {
        schemeList = this.schemeList[j].categoryName;
      }
    }
    let selectedText = $('#statusAR option:selected').text();
    if (no == 1) {
      let filter = [];
      filter.push([['Scheme Name', 'GJAY']]);
      filter.push([['Scheme Category Name', schemeList]]);
      filter.push([['Hospital Upload Date From', $('#formdateAR').val()]]);
      filter.push([['To Date ', $('#todateAR').val()]]);
      filter.push([['Status', selectedText]]);
      filter.push([['State Name', statename]]);
      filter.push([['District Name', distname]]);
      filter.push([['Hospital Name', hospital]]);
      TableUtil.exportListToExcelWithFilter(this.report, 'SNA Action Taken List', this.heading1, filter);
    } else {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      let doc = new jsPDF('p', 'mm', [297, 210]); // A4 Size in mm
      doc.setFont('helvetica');
      // Header
      doc.setFontSize(20);
      doc.setTextColor(26, 99, 54);
      doc.text("SNA Action Taken List", 15, 15);
      // Adding a line under header
      doc.setLineWidth(0.5);
      doc.setDrawColor(26, 99, 54);
      doc.line(15, 18, 195, 18);
      // Set font for the rest of the text
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      // Two-column layout for report fields
      const leftMargin = 15;
      const rightMargin = 105;
      let currentY = 25;
      const fields = [
        { label: 'Scheme Name', value: 'GJAY' },
        { label: 'Scheme Category Name', value: schemeList },
        { label: 'Hospital Upload Date From', value: $('#formdateAR').val() },
        { label: 'To Date', value: $('#todateAR').val() },
        { label: 'Status', value: selectedText },
        { label: 'State Name', value: statename },
        { label: 'District Name', value: distname },
        { label: 'Hospital Name', value: hospital },
        { label: 'Generated By', value: generatedBy },
        { label: 'Generated On', value: generatedOn }
      ];
      // Print fields in two columns
      fields.forEach((field, index) => {
        const xPosition = index % 2 === 0 ? leftMargin : rightMargin;
        if (index % 2 === 0 && index > 0) currentY += 7;
        doc.text(`${field.label}: ${field.value}`, xPosition, currentY);
      });
      // Auto-table for report data
      autoTable(doc, {
        head: this.heading1, body: this.report, startY: currentY + 10, theme: 'grid',
        styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
        bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
        columnStyles: {
          0: { cellWidth: 6 },
          1: { cellWidth: 15 },
          2: { cellWidth: 15 },
          3: { cellWidth: 20 },
          4: { cellWidth: 15 },
          5: { cellWidth: 15 },
          6: { cellWidth: 12 },
          7: { cellWidth: 15 },
          8: { cellWidth: 13 },
          9: { cellWidth: 15 },
          10: { cellWidth: 15 },
          11: { cellWidth: 15 },
          12: { cellWidth: 15 },
          13: { cellWidth: 15 },

        }
      })
      // Footer with page number
      const pageCount = doc.internal.pages.length - 1; // Adjust to get total page count
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
      }
      doc.save('SNA_Action_Taken_List.pdf');
    }
  }
}
