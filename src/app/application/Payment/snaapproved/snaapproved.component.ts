import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { JwtService } from 'src/app/services/jwt.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { PaymentfreezeserviceService } from '../../Services/paymentfreezeservice.service';
import { SnoCLaimDetailsService } from '../../Services/sno-claim-details.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { TableUtil } from '../../util/TableUtil';
import { formatDate } from '@angular/common';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { PackageDetailsMasterService } from '../../Services/package-details-master.service';
import { FormControl, FormGroup } from '@angular/forms';
declare let $: any;

@Component({
  selector: 'app-snaapproved',
  templateUrl: './snaapproved.component.html',
  styleUrls: ['./snaapproved.component.scss'],
})
export class SnaapprovedComponent implements OnInit {
  statelist: Array<any> = [];
  user: any;
  stateCode: any;
  userId: any;
  distList: any;
  distCode: any;
  hospitalList: any;
  paymentlist: any = [];
  public snoList: any = [];
  txtsearchDate: any;
  pageElement: any;
  currentPage: any;
  totalpaymentlist: any;
  record: any;
  dataa: any;
  status: any;
  keyword: any = 'HOSPITALNAME';
  keywords: any = 'fullName';
  snadoctornamehidestatus: boolean = true;
  summary: any;
  totalCount: number;
  totalAmount: number;
  showBtn: boolean = false;
  distCode1: any;
  pendingmoratlity: any;
  @ViewChild('multiSelect') multiSelect;
  selectedItems: any = [];
  selectedDists: any = [];
  selectedHospital: any = [];
  public settingState: IDropdownSettings = {};
  public settingDist: IDropdownSettings = {};
  public settingHospital: IDropdownSettings = {};
  statePlaceHolder: "Select State";
  distPlaceHolder: "Select District";
  hosPlaceHolder: "Select Hospital";
  stateplaceHolder = "Select State";
  maxChars = 500;
  description: string = '';

  constructor(
    public headerService: HeaderService,
    public paymentfreezeService: PaymentfreezeserviceService,
    public snoService: SnoCLaimDetailsService,
    private jwtService: JwtService,
    public route: Router,
    private snoConfigService: SnocreateserviceService, private sessionService: SessionStorageService,
    private encryptionService: EncryptionService, public packageDetailsMasterService: PackageDetailsMasterService
  ) { }
  showPegi: boolean;
  ngOnInit(): void {
    this.getSchemeData();
    this.headerService.setTitle('Float Generation');
    this.user = this.sessionService.decryptSessionData("user");
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
      format: 'DD-MM-YYYY LT',
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
    if (this.user.groupId == 4) {
      this.snadoctornamehidestatus = false;
      this.snoUserId = this.user.userId;
    }
    this.getSNOList();
    this.getStateList();
    // this.getSummary();

    this.settingState = {
      singleSelection: false,
      idField: 'stateCode',
      textField: 'stateName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true,
    };
    this.settingDist = {
      singleSelection: false,
      idField: 'districtCode',
      textField: 'districtName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true,
    };
    this.settingHospital = {
      singleSelection: false,
      idField: 'HOSPITALCODE',
      textField: 'HOSPITALNAME',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true,
    };
  }
  stateData: any = [];
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
  resDistData: any;
  OnChangeState() {
    this.distList = [];
    this.userId = this.user.userId;
    let requestData = {
      userId: this.userId,
      selectedStateList: this.selectedStateList
    }
    this.snoService
      .getDistrictByMultiState(requestData)
      .subscribe((data) => {
        this.resDistData = data;
        if (this.resDistData.status == "success") {
          this.distList = JSON.parse(this.resDistData.data);
          this.distList.sort((a, b) =>
            a.districtName.localeCompare(b.districtName)
          );
        } else {
          this.swal('', 'Something went wrong.', 'error');
        }
      });
  }
  resHosData: any;
  OnChangeDist() {
    this.userId = this.user.userId;
    this.distList.forEach(element => {
      this.selectedDistrictList.forEach(element1 => {
        if (element.districtCode == element1.districtCode && element.districtName == element1.districtName) {
          element1.stateCode = element.stateCode;
          delete element1.districtName;
        }
      })
    });
    let requestData = {
      userId: this.userId,
      selectedDistrictList: this.selectedDistrictList
    }
    this.hospitalCode = '';
    this.hospitalList = [];
    this.snoService
      .getHospitalByMultiDistrict(requestData)
      .subscribe((data) => {
        this.resHosData = data;
        if (this.resHosData.status == "success") {
          this.hospitalList = JSON.parse(this.resHosData.data);
        } else {
          this.swal('', 'Something went wrong.', 'error');
        }

      });
  }
  selectedFlag(event) {
    this.status = event.target.value;
  }

  resData: any;
  hospitalCode: any = '';
  fromDate: any;
  toDate: any;
  stateCode1: any;
  snoUserId: any;
  validateDateRange(startDate: Date, endDate: Date): boolean {
    const startUTC = new Date(startDate.toUTCString());
    const endUTC = new Date(endDate.toUTCString());
    const monthDiff = (endUTC.getFullYear() - startUTC.getFullYear()) * 12 + (endUTC.getMonth() - startUTC.getMonth());
    return monthDiff === 1;
  }
  backupStateList: any = [];
  backupDistList: any = [];
  backupHosList: any = [];
  floatList: any = [];
  Search: any;
  getSummary() {
    this.showBtn = false;
    let userId = this.snoUserId;
    this.fromDate = $('#formdate').val();
    this.toDate = $('#todate').val();
    this.stateCode1 = $('#state').val();
    this.distCode1 = $('#dist').val();
    this.Search = $('#search').val();
    let schemecategoryid = this.schemecategoryidvalue;
    if (schemecategoryid == null || schemecategoryid == undefined || schemecategoryid == '') {
      schemecategoryid = "";
    } else {
      schemecategoryid = schemecategoryid;
    }
    const startDate = new Date(this.fromDate);
    const isFirstDayOfMonth = startDate.getDate() != 1;
    if (isFirstDayOfMonth) {
      this.swal('', 'Please Select the First Date of this month', 'error');
      return;
    }
    const endDate = new Date(this.toDate);
    const isValidDateRange = this.validateDateRange(startDate, endDate);
    if (isValidDateRange) {
      this.swal('', 'Please Select the Date between One month.', 'error');
      return;
    }
    if (Date.parse(this.fromDate) > Date.parse(this.toDate)) {
      this.swal('', ' From Date should be less than To Date', 'error');
      return;
    }
    if (userId == undefined || userId == null || userId == '') {
      this.swal('', 'Please Select SNA Doctor', 'info');
      return;
    }
    this.backupStateList = this.selectedStateList;
    this.backupDistList = this.selectedDistrictList;
    this.backupHosList = this.selectedHosList;
    this.summary = '';
    let requestData = {
      userId: userId,
      fromDate: new Date(this.fromDate),
      toDate: new Date(this.toDate),
      stateCodeList: this.selectedStateList,
      distCodeList: this.selectedDistrictList,
      hospitalCodeList: this.selectedHosList,
      schemecategoryid: schemecategoryid,
      searchtype: this.Search
    };
    this.paymentfreezeService.getCountDetails(requestData).subscribe(
      (data) => {
        this.summary = data;
        // this.pendingmoratlity = Number(this.summary?.mortality) - Number(this.summary?.smortality);
        // this.pendingmoratlity=this.summary?.moratlity!=null?this.summary?.moratlity:0 - this.summary?.smortality!=null?this.summary?.smortality:0;
        // SNA action of CPD approved should be greater than or equal to 10%
        // mortality should be 100%
        // CPD rejected count should be 0
        // SNA resettlement count should be 0
        // System Rejected - Non compliance of CPD Query count should be 0
        // DC Compliance count should be 0
        // Unprocessed Claim count should be 0
        this.floatList = this.summary.floatList;
        if (this.summary?.cpdAprvOfSNAActionPercent >= 10 && this.summary?.mortalityPercent == 100 && this.summary?.cpdRejected == 0 && this.summary?.pendatsna == 0
          && this.summary?.cpdQueryafter7 == 0 && this.summary?.dcCompliance == 0 && this.summary?.unprocessed == 0 && this.summary?.cpdRejected == 0 && this.summary?.pendingMoratlity == 0) {
          this.showBtn = true;
        }
      },
      (error) => {
        console.log(error);
        this.swal('Error', 'Something went wrong.', 'error');
      }
    );
  }

  resetField() {
    window.location.reload();
  }

  pageItemChange() {
    this.pageElement = (<HTMLInputElement>(
      document.getElementById('pageItem')
    )).value;
  }

  getActionDetails(claimid) {
    localStorage.setItem('claimid', claimid);
    localStorage.setItem('token', this.jwtService.getJwtToken());
    this.route.navigate([]).then((result) => {
      window.open(environment.routingUrl + '/trackingdetails');
    });
  }
  report: any = [];
  sno: any = {
    Slno: '',
    URN: '',
    ClaimNo: '',
    hospitalname: '',
    caseno: '',
    invoiceno: '',
    PatientName: '',
    PackageID: '',
    ClaimRaisedOn: '',
    ApprovedAmount: '',
    cpdapprovedamount: '',
    snoappprovedamount: '',
  };
  heading = [
    [
      'Sl#',
      'URN',
      'Claim Number',
      'Hospital Name',
      'Case NUmber',
      'Invoice Number',
      'Patient Name',
      'Package ID',
      'Claim Raised On',
      'Amount (₹)',
      'CPD Approved Amount (₹)',
      'SNA Approved Amount (₹)',
    ],
  ];

  downloadReport(type: any) {
    this.report = [];
    if (type == 'excel') {
      let claim: any;
      for (var i = 0; i < this.paymentlist.length; i++) {
        claim = this.paymentlist[i];
        this.sno = [];
        this.sno.Slno = i + 1;
        this.sno.URN = claim.urn;
        this.sno.ClaimNo = claim.claimNo;
        this.sno.hospitalname =
          claim.hospitalname + '(' + claim.hospitalcode + ')';
        this.sno.caseno = claim.caseno != null ? claim.caseno : 'N/A';
        this.sno.invoiceno = claim.invoiceNumber;
        this.sno.PatientName = claim.patientName;
        this.sno.PackageID = claim.packageName + '(' + claim.packageCode + ')';
        this.sno.ClaimRaisedOn = claim.createdOn;
        this.sno.ApprovedAmount = claim.currentTotalAmount;
        this.sno.cpdapprovedamount =
          claim.cpdApprovedAmount != null ? claim.cpdApprovedAmount : 'N/A';
        this.sno.snoappprovedamount =
          claim.snaApprovedAmount != null ? claim.snaApprovedAmount : 'N/A';
        this.report.push(this.sno);
      }
      TableUtil.exportListToExcel(
        this.report,
        'SNA Approved List',
        this.heading
      );
    } else if (type == 'pdf') {
      if (this.paymentlist.length == 0) {
        this.swal('', 'No Data Found', 'info');
        return;
      }
      let valuedate: any;
      let todate: any;
      let months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
      valuedate = this.fromDate;
      todate = this.toDate;
      if (valuedate == undefined || valuedate == null || valuedate == '') {
        valuedate = 'N/A';
      }
      if (todate == undefined || todate == null || todate == '') {
        todate = 'N/A';
      }
      let SlNo = 1;
      this.paymentlist.forEach((element) => {
        let rowData = [];
        rowData.push(SlNo++);
        rowData.push(element.urn);
        rowData.push(element.claimNo);
        rowData.push(element.hospitalname + '(' + element.hospitalcode + ')');
        rowData.push(element.caseno != null ? element.caseno : 'N/A');
        rowData.push(element.invoiceNumber);
        rowData.push(element.patientName);
        rowData.push(element.packageName + '(' + element.packageCode + ')');
        rowData.push(element.createdOn);
        rowData.push(element.currentTotalAmount);
        rowData.push(
          element.cpdApprovedAmount != null ? element.cpdApprovedAmount : 'N/A'
        );
        rowData.push(
          element.snaApprovedAmount != null ? element.snaApprovedAmount : 'N/A'
        );
        this.report.push(rowData);
      });
      let doc = new jsPDF('l', 'mm', [238, 270]);
      doc.setFontSize(10);
      doc.text('Generate By :-' + this.user.fullName, 5, 5);
      doc.text('Actual Date of Discharge:-' + valuedate, 5, 10);
      doc.text('Discharge Date To:-' + todate, 5, 15);
      doc.text(
        'Document Generate Date : ' +
        generatedOn,
        5,
        20
      );
      doc.text('SNA Approved List', 100, 25);
      doc.setLineWidth(0.7);
      doc.line(100, 26, 132, 26);
      autoTable(doc, {
        head: this.heading,
        body: this.report,
        startY: 28,
        theme: 'grid',
        styles: {
          overflow: 'linebreak',
          halign: 'center',
          valign: 'middle',
          fontSize: 8,
          cellPadding: 1,
          lineWidth: 0.1,
          lineColor: 0,
          textColor: 20,
        },
        bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: {
          lineWidth: 0.1,
          lineColor: 0,
          textColor: [255, 255, 255],
          fillColor: [26, 99, 54],
        },
        columnStyles: {
          0: { cellWidth: 8 },
          1: { cellWidth: 20 },
          2: { cellWidth: 20 },
          3: { cellWidth: 30 },
          4: { cellWidth: 30 },
          5: { cellWidth: 20 },
          6: { cellWidth: 20 },
          7: { cellWidth: 20 },
          8: { cellWidth: 20 },
          9: { cellWidth: 20 },
          10: { cellWidth: 20 },
          11: { cellWidth: 20 },
        },
      });
      doc.save('SNA_Approved_List.pdf');
    }
  }

  generateFloat() {
    $('#floatfile').val('');
    if (this.floatList?.length >= 2) {
      $('#assignFoModal').show();
    } else {
      this.submitFloat();
    }
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  clearEvent() {
    this.hospitalCode = '';
  }
  selectEvent(item) {
    this.hospitalCode = item.HOSPITALCODE;
  }
  selectSnaEvent(item) {
    this.snoUserId = item.snaUserId;
  }
  clearSnaEvent() {
    this.snoUserId = '';
  }
  responseData: any;
  getSNOList() {
    let userid = this.user.userId;
    this.snoConfigService.getSNOListByExecutive(userid).subscribe(
      (response) => {
        this.responseData = response;
        if (this.responseData.status == 'success') {
          this.snoList = JSON.parse(this.responseData.data);
        } else {
          this.swal('', 'Something went wrong.', 'error');
        }
      },
      (error) => console.log(error)
    );
  }
  moratlityPendingStatus(pendingmoratlity: any) {
    let stateName = 'All', districtName = 'All', hospitalName = 'All';
    for (let i = 0; i < this.statelist.length; i++) {
      if (this.stateCode == this.statelist[i].stateCode) {
        stateName = this.statelist[i].stateName;
      }
    }
    if (stateName != 'All') {
      for (let i = 0; i < this.distList.length; i++) {
        if (this.distCode == this.distList[i].DISTRICTCODE) {
          districtName = this.distList[i].DISTRICTNAME;
        }
      }
    }
    if (districtName != 'All') {
      for (let i = 0; i < this.hospitalList.length; i++) {
        if (this.hospitalCode == this.hospitalList[i].HOSPITALCODE) {
          hospitalName = this.hospitalList[i].HOSPITALNAME;
        }
      }
    }
    if (pendingmoratlity != 0) {
      let state = {
        userId: this.snoUserId,
        fromDate: this.fromDate,
        toDate: this.toDate,
        stateCode: this.stateCode1,
        distCode: this.distCode1,
        hospitalCode: this.hospitalCode,
        stateName: stateName,
        districtName: districtName,
        hospitalName: hospitalName,
      };
      localStorage.setItem('moratlitypendingstatus', JSON.stringify(state));
      localStorage.setItem("token", this.jwtService.getJwtToken());
      this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/pendingmortalitystatus'); });
    } else {
      return;
    }
  }
  stateObj: any;
  selectedStateList: any = [];
  onItemSelect(item) {
    this.stateObj = {
      stateCode: "",
      stateName: ""
    }
    this.stateObj.stateCode = item.stateCode;
    for (let i = 0; i < this.statelist.length; i++) {
      if (this.stateObj.stateCode == this.statelist[i].stateCode) {
        this.stateObj.stateName = this.statelist[i].stateName;
      }
    }
    var stat: boolean = false;
    for (const i of this.selectedStateList) {
      if (i.stateCode == this.stateObj.stateCode) {
        stat = true;
      }
    }
    if (stat == false) {
      this.selectedStateList.push(this.stateObj);
    }
    this.OnChangeState();
  }
  onItemDeSelect(item) {
    for (let i = 0; i < this.selectedStateList.length; i++) {
      if (item.stateCode == this.selectedStateList[i].stateCode) {
        let index = this.selectedStateList.indexOf(this.selectedStateList[i]);
        if (index !== -1) {
          this.selectedStateList.splice(index, 1);
        }
      }
    }
    this.OnChangeState();
  }

  onSelectAll(list) {
    for (var x = 0; x < list.length; x++) {
      let item = list[x];
      this.stateObj = {
        stateCode: "",
        stateName: ""
      }
      this.stateObj.stateCode = item.stateCode;
      for (let i = 0; i < this.statelist.length; i++) {
        if (this.stateObj.stateCode == this.statelist[i].stateCode) {
          this.stateObj.stateName = this.statelist[i].stateName;
        }
      }
      let stat: boolean = false;
      for (const i of this.selectedStateList) {
        if (i.stateCode == this.stateObj.stateCode) {
          stat = true;
        }
      }
      if (stat == false) {
        this.selectedStateList.push(this.stateObj);
      }
    }
    this.OnChangeState();
  }
  onDeSelectAll(list) {
    this.selectedStateList = [];
    this.OnChangeState();
  }
  selectedDistrictList: any = [];
  distObj: any;
  onDistSelect(item) {
    this.distObj = {
      districtCode: "",
      districtName: ""
    }
    this.distObj.districtCode = item.districtCode;
    for (let i = 0; i < this.distList.length; i++) {
      if (this.distObj.districtCode == this.distList[i].districtCode) {
        this.distObj.districtName = this.distList[i].districtName;
      }
    }
    let stat: boolean = false;
    for (const i of this.selectedDistrictList) {
      if (i.districtCode == this.distObj.districtCode) {
        stat = true;
      }
    }
    if (stat == false) {
      this.selectedDistrictList.push(this.distObj);
    }
    this.OnChangeDist();
  }
  onDistDeSelect(item) {
    for (let i = 0; i < this.selectedDistrictList.length; i++) {
      if (item.districtCode == this.selectedDistrictList[i].districtCode) {
        let index = this.selectedDistrictList.indexOf(this.selectedDistrictList[i]);
        if (index !== -1) {
          this.selectedDistrictList.splice(index, 1);
        }
      }
    }
    this.OnChangeDist();
  }
  onSelectAllDist(list) {
    for (let x = 0; x < list.length; x++) {
      let item = list[x];
      this.distObj = {
        districtCode: "",
        districtName: ""
      }
      this.distObj.districtCode = item.districtCode;
      for (let i = 0; i < this.distList.length; i++) {
        if (this.distObj.districtCode == this.distList[i].districtCode) {
          this.distObj.districtName = this.distList[i].districtName;
        }
      }
      let stat: boolean = false;
      for (const i of this.selectedDistrictList) {
        if (i.districtCode == this.distObj.districtCode) {
          stat = true;
        }
      }
      if (stat == false) {
        this.selectedDistrictList.push(this.distObj);
      }
    }
    this.OnChangeDist();
  }
  onDeSelectAllDist(list) {
    this.selectedDistrictList = [];
    this.OnChangeDist();
  }
  hosObj: any;
  selectedHosList: any = [];
  onHosSelect(item) {
    this.hosObj = {
      hospitalCode: "",
    }
    this.hosObj.hospitalCode = item.HOSPITALCODE;

    let stat: boolean = false;
    for (const i of this.selectedHosList) {
      if (i.hospitalCode == this.hosObj.hospitalCode) {
        stat = true;
      }
    }
    if (stat == false) {
      this.selectedHosList.push(this.hosObj);
    }
  }
  onHosDeSelect(item) {
    for (let i = 0; i < this.selectedHosList.length; i++) {
      if (item.HOSPITALCODE == this.selectedHosList[i].hospitalCode) {
        let index = this.selectedHosList.indexOf(this.selectedHosList[i]);
        if (index !== -1) {
          this.selectedHosList.splice(index, 1);
        }
      }
    }
  }
  onSelectAllHos(list) {
    for (let x = 0; x < list.length; x++) {
      let item = list[x];
      this.hosObj = {
        hospitalCode: "",
      }
      this.hosObj.hospitalCode = item.HOSPITALCODE;

      let stat: boolean = false;
      for (const i of this.selectedHosList) {
        if (i.hospitalCode == this.hosObj.hospitalCode) {
          stat = true;
        }
      }
      if (stat == false) {
        this.selectedHosList.push(this.hosObj);
      }
    }
  }
  onDeSelectAllHos(list) {
    this.selectedHosList = [];
  }
  floatFile: any;
  floafilename: any
  floatfiledata: any;
  changeFloatFile(files: any) {
    let extension;
    this.floatfiledata = files.target.files;
    for (let i = 0; i < this.floatfiledata.length; i++) {
      let filename = files.target.files[0];
      extension = filename.name.split('.').pop();
    }
    let allowedExtensions = /(\xls|\xlsx|pdf|jpeg|jpg)$/i;
    if (!allowedExtensions.exec(extension)) {
      this.swal('Warning', 'Only Excel/PDF/JPG are Allowed!', 'warning');
      $('#floatfile').val('');
      this.floatFile = '';
      return;
    } else
      this.floatFile = files.target.files[0];
    if (Math.round(this.floatFile.size / 1024) >= 10192) {
      this.swal('Warning', 'Please provide Document with Limited Size', 'warning');
      $('#floatfile').val('');
      this.floatFile = '';
    }
  }
  @ViewChild('closebutton') closebutton;
  Description: any;
  submitFloat() {
    this.userId = this.user.userId;
    this.Description = $('#remarks').val();
    let schemecategoryid = this.schemecategoryidvalue;
    if (schemecategoryid == null || schemecategoryid == undefined || schemecategoryid == '') {
      schemecategoryid = "";
    } else {
      schemecategoryid = schemecategoryid;
    }
    if (this.floatList?.length >= 2) {
      if (this.floatFile == '' || this.floatFile == undefined || this.floatFile == null) {
        this.swal('', 'Please select the file', 'info');
        return;
      }
    }
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to Generate the Float!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Generate It',
    }).then((result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append('userId', this.userId);
        formData.append('snoUserId', this.snoUserId);
        formData.append('fromDate', this.fromDate);
        formData.append('toDate', this.toDate);
        formData.append('stateCodeList', JSON.stringify(this.selectedStateList));
        formData.append('distCodeList', JSON.stringify(this.selectedDistrictList));
        formData.append('hospitalCodeList', JSON.stringify(this.selectedHosList));
        formData.append('snaAmount', this.summary.totalAmount);
        formData.append('floatFile', this.floatFile);
        formData.append('searchtype', this.Search);
        formData.append('schemecategoryid', schemecategoryid);
        formData.append('floatList', this.floatList);
        this.paymentfreezeService.generateFloat(formData).subscribe(
          (data) => {
            this.dataa = data;
            if (this.dataa.status == 'success') {
              if (this.dataa.data.status == 'Success') {
                $('#assignFoModal').hide();
                $('#floatfile').val('');
                this.getSummary();
                this.swal('Success', this.dataa.data.message, 'success');
                this.snaCertificationFile = null;
                this.mecertification = null;
                this.otherfile = null;
                $('#otherfile').val('');
                $('#certification').val('');
                $('#mecertification').val('');
                $("#other").css("border-color", "initial");
                $("#snamecertification").css("border-color", "initial");
                $("#snacertification").css("border-color", "initial");
                this.otherfilename = "Select a file to upload";
                this.mefilename = "Select a file to upload";
                this.snacertificationname = "Select a file to upload";
                $('#remarks').val('');
              } else if (this.dataa.data.status == 'Failed') {
                this.swal('Warning', this.dataa.data.message, 'warning');
              } else if (this.dataa.data.status == 'record') {
                this.swal('Warning', this.dataa.data.message, 'warning');
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
    });
  }
  cancel() {
    $('#assignFoModal').hide();
    $('#floatfile').val('');
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
  snacertificationname: any;
  snaCertificationFile: any;
  lengthforfile: any;
  getFileNameSNACertification(files: any, filename: String) {
    console.log(files);
    console.log(filename);
    if (files != null && filename != null) {
      let filename = files.target.files[0].name;
      let extension = filename.split('.').pop();
      let allowedExtensions = /(\pdf)$/i;
      if (!allowedExtensions.exec(extension)) {
        this.swal('Warning', 'Only PDF Are Allowed!', 'warning');
        $("#snacertification").css("border-color", "red");
        $('#certification').val('');
        this.snacertificationname = "Select a file to upload";
        this.snaCertificationFile = null;
        return;
      } else {
        this.snaCertificationFile = files.target.files[0];
        $("#snacertification").css("border-color", "green");
        this.lengthforfile = files.target.files.length;
        this.snacertificationname = this.snaCertificationFile.name;
        if (Math.round(this.snaCertificationFile.size / 1024) >= 8192) {
          this.swal('Warning', ' Please provide SNA Certification  with Limited Size', 'warning');
          $("#snacertification").css("border-color", "red");
          $('#certification').val('');
          this.snacertificationname = "Select a file to upload";
          this.snaCertificationFile = undefined;
        }
      }
    }
  }
  mecertification: any;
  mefilename: any;
  melength: any;
  getFileNameMeCertification(files: any, filename: String) {
    console.log(files);
    console.log(filename);
    if (files != null && filename != null) {
      let filename = files.target.files[0].name;
      let extension = filename.split('.').pop();
      let allowedExtensions = /(\pdf)$/i;
      if (!allowedExtensions.exec(extension)) {
        this.swal('Warning', 'Only PDF Are Allowed!', 'warning');
        $("#snamecertification").css("border-color", "red");
        $('#mecertification').val('');
        this.mefilename = "Select a file to upload";
        this.mecertification = null;
        return;
      } else {
        this.mecertification = files.target.files[0];
        $("#snamecertification").css("border-color", "green");
        this.melength = files.target.files.length;
        this.mefilename = this.mecertification.name;
        if (Math.round(this.mecertification.size / 1024) >= 8192) {
          this.swal('Warning', ' Please provide M&E Certification  with Limited Size', 'warning');
          $("#snamecertification").css("border-color", "red");
          $('#mecertification').val('');
          this.mefilename = "Select a file to upload";
          this.mecertification = undefined;
        }
      }
    }

  }
  otherfilename: any;
  otherfile: any;
  otherlength: any;
  getFileNameotherfile(files: any, filename: String) {
    console.log(files);
    console.log(filename);
    if (files != null && filename != null) {
      let filename = files.target.files[0].name;
      let extension = filename.split('.').pop();
      let allowedExtensions = /(\pdf)$/i;
      if (!allowedExtensions.exec(extension)) {
        this.swal('Warning', 'Only PDF Are Allowed!', 'warning');
        $("#other").css("border-color", "red");
        $('#otherfile').val('');
        this.otherfilename = "Select a file to upload";
        this.otherfile = null;
        return;
      } else {
        this.otherfile = files.target.files[0];
        $("#other").css("border-color", "green");
        this.otherlength = files.target.files.length;
        this.otherfilename = this.otherfile.name;
        if (Math.round(this.otherfile.size / 1024) >= 8192) {
          this.swal('Warning', ' Please provide Other File  with Limited Size', 'warning');
          $("#other").css("border-color", "red");
          $('#otherfile').val('');
          this.otherfilename = "Select a file to upload";
          this.otherfile = undefined;
        }
      }
    }

  }
  downloadfile(filename: any) {
    if (filename === 'certification') {
      const file: File | null = this.snaCertificationFile;
      if (file) {
        this.snaCertificationFile = file.type;
        const blob = new Blob([file], { type: this.snaCertificationFile });
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      } else {
        this.swal('', 'please select SNA Certification File', 'warning');
      }

    } else if (filename === 'mecertification') {
      const file: File | null = this.mecertification;
      if (file) {
        this.mecertification = file.type;
        const blob = new Blob([file], { type: this.mecertification });
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      } else {
        this.swal('', 'please select M&E Certification File', 'warning');
      }

    } else if (filename === 'otherfile') {
      const file: File | null = this.otherfile;
      if (file) {
        this.otherfile = file.type;
        const blob = new Blob([file], { type: this.otherfile });
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      } else {
        this.swal('', 'please select Other File', 'warning');
      }

    } else {
      this.swal('', 'please select file', 'warning');
    }
  }

  keyPress(event: KeyboardEvent) {
    const pattern = /'/;
    const inputChar = String.fromCharCode(event.charCode);
    if (pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  remarks: any;
  myGroup = new FormGroup({
    remarks: new FormControl(),
  });

}

