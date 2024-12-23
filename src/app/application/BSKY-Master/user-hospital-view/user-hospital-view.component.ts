import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { HospitalpipePipe } from '../../pipes/hospitalpipe.pipe';
import { HospitalService } from '../../Services/hospital.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { TableUtil } from '../../util/TableUtil';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-user-hospital-view',
  templateUrl: './user-hospital-view.component.html',
  styleUrls: ['./user-hospital-view.component.scss']
})
export class UserHospitalViewComponent implements OnInit {
  record: any;
  currentPage: any;
  pageElement: any;
  showPegi: boolean;
  districtList: any = [];
  stateList: any = [];
  catList: any = [];
  Filtered: any;
  stateId: any = '';
  districtId: any = '';
  cpdApprovalRequired: any = '';
  snoTagged: any = '';
  categoryId: any = '';
  deleteDetails: any;
  hospitalData: any = [];
  SearchForm!: FormGroup;
  txtsearchDate: any;
  hospdetails: any;
  tmsActive: any = '';
  userDetails: any;
  timedata: any;
  otpvalidate: any;
  hospid: any;

  constructor(private headerService: HeaderService, private hospitalService: HospitalService, private route: Router,
    private snoService: SnocreateserviceService, private hospitalpipePipe: HospitalpipePipe, public fb: FormBuilder,
    private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle("View Hospital")
    this.currentPage = 1;
    this.pageElement = 100;
    this.timedata = 60;
    this.SearchForm = this.fb.group({
      stateId: new FormControl(''),
      districtId: new FormControl(''),
      cpdAppReq: new FormControl(''),
      snoTagged: new FormControl(''),
      hospitalType: new FormControl(''),
      tmsstatus: new FormControl('')
    });
    this.getStateList();
    this.getCategoryList();
    this.getHospitalList();
  }

  getHospitalList() {
    this.hospitalService.getHospitalList(this.stateId, this.districtId, this.cpdApprovalRequired, this.snoTagged, this.categoryId, this.tmsActive).subscribe(
      (allData) => {
        this.hospitalData = allData;
        this.record = this.hospitalData.length;
        if (this.record > 0) {
          this.showPegi = true;
        }
        else {
          this.showPegi = false;
        }
      }
    );
  }

  resetTable() {
    this.currentPage = 1;
    this.pageElement = 100;
    this.districtList = [];
    this.stateId = '';
    this.districtId = '';
    this.cpdApprovalRequired = '';
    this.snoTagged = '';
    this.categoryId = '';
    this.tmsActive = '';
    $('#stateId').val("");
    $('#districtId').val("");
    $('#cpdAppReq').val("");
    $('#snoTagged').val("");
    $('#hospitalType').val("");
    $('#tmsstatus').val("");
    this.SearchForm.value.stateId = "";
    this.SearchForm.value.districtId = "";
    this.SearchForm.value.cpdAppReq = "";
    this.SearchForm.value.snoTagged = "";
    this.SearchForm.value.hospitalType = "";
    this.SearchForm.value.tmsstatus = "";
    this.getHospitalList();
  }

  view(item: any, tmsactive: any, hospitalcode: any) {
    localStorage.setItem("hospitalid", item)
    localStorage.setItem("hospitalcode", hospitalcode)
    localStorage.setItem("tmsstatus", tmsactive)
    this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/hospdetailsreport'); });
  }

  getStateList() {
    this.snoService.getStateList().subscribe(
      (response) => {
        this.stateList = response;
      },
      (error) => console.log(error)
    )
  }

  getCategoryList() {
    this.snoService.getHospitalCategoryList().subscribe(
      (response) => {
        this.catList = response;
      },
      (error) => console.log(error)
    );
  }

  OnChangeState(id) {
    $('#districtId').val("");
    this.SearchForm.value.districtId = "";
    localStorage.setItem("stateCode", id);
    this.snoService.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = response;
      },
      (error) => console.log(error)
    )
  }

  onChange() {
    this.stateId = this.SearchForm.value.stateId;
    this.districtId = this.SearchForm.value.districtId;
    this.cpdApprovalRequired = this.SearchForm.value.cpdAppReq;
    this.snoTagged = this.SearchForm.value.snoTagged;
    this.categoryId = this.SearchForm.value.hospitalType;
    this.tmsActive = this.SearchForm.value.tmsstatus;
    this.hospitalData = [];
    this.currentPage = 1;
    this.pageElement = 100;
    this.hospitalService.getHospitalList(this.stateId, this.districtId, this.cpdApprovalRequired, this.snoTagged, this.categoryId, this.tmsActive).subscribe(
      (data) => {
        this.Filtered = data;
        if (this.Filtered.length != 0) {
          this.hospitalData = this.hospitalpipePipe.transform(this.hospitalData, this.Filtered);
          $('#htmlData').show();
        }
        else if (this.Filtered.length <= 0) {
          $('#htmlData').hide();
          Swal.fire("Info", "No Record Found !", 'info');
        }
      }
    );
  }

  report: any = [];
  hosp: any = {
    slNo: "",
    hospname: "",
    hospcode: "",
    state: "",
    district: "",
    hospitalType: "",
    NABHstartdate: "",
    NABHenddate: "",
    MOUstartdate: "",
    MOUenddate: "",
    cpdApproval: "",
    tmsStatus: "",
    status: "",
  };
  heading = [['Sl No', 'Hospital Name', 'Hospital Code', 'State', 'District', 'Hospital Type', 'Incentive Start Date', 'Incentive End Date', 'MOU Start Date', 'MOU End Date', 'CPD Approval Required', 'TMS Active Status', 'Status']];

  downloadReport() {
    this.report = [];
    let item: any;
    for (var i = 0; i < this.hospitalData.length; i++) {
      item = this.hospitalData[i];
      this.hosp = [];
      this.hosp.slNo = i + 1;
      this.hosp.hospname = item.hospitalName;
      this.hosp.hospcode = item.hospitalCode;
      this.hosp.state = item.stateName;
      this.hosp.district = item.districtName;
      this.hosp.hospitalType = item.hospitalType ? item.hospitalType : '-NA-';
      this.hosp.NABHstartdate = item.hcvalidform
      this.hosp.NABHenddate = item.hcvalidto
      this.hosp.MOUstartdate = item.moustartdate
      this.hosp.MOUenddate = item.mouenddate
      if (item.cpdApprovalRequired == '1') {
        this.hosp.cpdApproval = "No";
      } else if (item.cpdApprovalRequired == '0') {
        this.hosp.cpdApproval = "Yes";
      }
      if (item.tmsActiveStat == '0') {
        this.hosp.tmsStatus = "Active";
      } else if (item.tmsActiveStat == '1') {
        this.hosp.tmsStatus = "Inactive";
      }
      if (item.status == '0') {
        this.hosp.status = "Active";
      } else if (item.status == '1') {
        this.hosp.status = "Inactive";
      }
      this.report.push(this.hosp);
    }
    let filter = [];
    let active = 'All'; let cpdapp = 'All'; let stateName = 'All'; let districtName = 'All'; let catlist = 'All'; let SNATagged = 'All';
    for (var i = 0; i < this.stateList.length; i++) {
      if (this.stateList[i].stateCode == this.stateId) {
        stateName = this.stateList[i].stateName;
      }
    }
    for (var i = 0; i < this.districtList.length; i++) {
      if (this.districtList[i].districtcode == this.districtId) {
        districtName = this.districtList[i].districtname;
      }
    }
    for (var i = 0; i < this.catList.length; i++) {
      if (this.catList[i].categoryId == this.categoryId) {
        catlist = this.catList[i].categoryName;
      }
    }
    if (this.cpdApprovalRequired == '1') {
      cpdapp = 'No';
    }
    else if (this.cpdApprovalRequired == '0') {
      cpdapp = 'Yes';
    }
    if (this.snoTagged == '1') {
      SNATagged = 'No';
    }
    else if (this.snoTagged == '0') {
      SNATagged = 'Yes';
    }

    if (this.tmsActive == '0') {
      active = 'Active';
    } else if (this.tmsActive == '1') {
      active = 'Inactive';
    }

    filter.push([['State Name', stateName]]);
    filter.push([['District Name', districtName]]);
    filter.push([['Hospital Type', catlist]]);
    filter.push([['CPD Approval Required', cpdapp]]);
    filter.push([['SNA Tagged', SNATagged]]);
    filter.push([['TMS Active Status', active]]);
    TableUtil.exportListToExcelWithFilter(this.report, 'Hospital Details', this.heading, filter);
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
  downloadPdf() {
    if (this.hospitalData.length == 0) {
      this.swal('info', 'No record found', 'info');
      return;
    }
    else {
      let active = 'All'; let cpdapp = 'All'; let stateName = 'All'; let districtName = 'All'; let catlist = 'All'; let SNATagged = 'All';
      for (var i = 0; i < this.stateList.length; i++) {
        if (this.stateList[i].stateCode == this.stateId) {
          stateName = this.stateList[i].stateName;
        }
      }
      for (var i = 0; i < this.districtList.length; i++) {
        if (this.districtList[i].districtcode == this.districtId) {
          districtName = this.districtList[i].districtname;
        }
      }
      for (var i = 0; i < this.catList.length; i++) {
        if (this.catList[i].categoryId == this.categoryId) {
          catlist = this.catList[i].categoryName;
        }
      }
      if (this.cpdApprovalRequired == '1') {
        cpdapp = 'No';
      }
      else if (this.cpdApprovalRequired == '0') {
        cpdapp = 'Yes';
      }
      if (this.snoTagged == '1') {
        SNATagged = 'No';
      }
      else if (this.snoTagged == '0') {
        SNATagged = 'Yes';
      }

      if (this.tmsActive == '0') {
        active = 'Active';
      } else if (this.tmsActive == '1') {
        active = 'Inactive';
      }
      var doc = new jsPDF('l', 'mm', [320, 210]);
      doc.setFontSize(12);
      doc.text('State Name:' + stateName, 10, 10);
      doc.text('District Name:' + districtName, 100, 10);
      doc.text('Hospital Type:' + catlist, 200, 10);
      doc.text('CPD Approval Required:' + cpdapp, 10, 20);
      doc.text('SNA Tagged:' + SNATagged, 100, 20);
      doc.text('TMS Active Status:' + active, 200, 20);
      doc.text("Generated On: " + this.convertDate(new Date()), 10, 30);
      doc.text("Generated By: " + this.sessionService.decryptSessionData("user").fullName, 200, 30);
      doc.text("Hospital Details", 140, 40);
      var col = this.heading;
      var rows = [];
      var claim: any;
      for (var i = 0; i < this.hospitalData.length; i++) {
        claim = this.hospitalData[i];
        var temp = [i + 1, claim.hospitalName, claim.hospitalCode, claim.stateName, claim.districtName, claim.hospitalType ? claim.hospitalType : '-NA-',
        claim.hcvalidform, claim.hcvalidto, claim.moustartdate, claim.mouenddate,
        this.findcpdActive(claim.cpdApprovalRequired), this.findSNAActive(claim.tmsActiveStat), this.findSNAActive(claim.status)
        ];
        rows.push(temp);
      }
      autoTable(doc, {
        head: col,
        body: rows,
        theme: 'grid',
        startY: 45,
        styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
        bodyStyles: { overflow: 'linebreak', cellWidth: 'wrap', lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: { overflow: 'linebreak', cellWidth: 'wrap', lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 30 },
          2: { cellWidth: 20 },
          3: { cellWidth: 20 },
          4: { cellWidth: 20 },
          5: { cellWidth: 20 },
          10: { cellWidth: 20 },
        }
      });
      doc.save('Hospital Details.pdf');
    }

  }
  findcpdActive(cpdActive: any) {
    let cpdActive1 = '';
    if (cpdActive == '0') {
      cpdActive1 = 'Yes';
    } else if (cpdActive == '1') {
      cpdActive1 = 'No';
    }
    return cpdActive1;
  }
  findSNAActive(snoActive: any) {
    let snoActive1 = '';
    if (snoActive == '0') {
      snoActive1 = 'Active';
    } else if (snoActive == '1') {
      snoActive1 = 'Inactive';
    }
    return snoActive1;
  }
  convertDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy, h:mm:ss a');
    return date;
  }

  edit(item: any) {
    this.hospid = item;
    this.generateotp();
  }

  generateotp() {
    let userid = this.sessionService.decryptSessionData("user").userId;
    this.hospitalService.generateotp(userid).subscribe((data: any) => {
      this.userDetails = data;
      if (this.userDetails.status == 'success') {
        $('#OtpModal').show();
        $('#sendId').show();
        $('#reSendId').hide();
        $('#timeCounter').show();
        $('#timerdivId').show();
        $('#mobileNoId').show();
        $('#phoneId').show();
        let phoneNo = this.userDetails.phone;
        let timeleft = this.timedata;
        let downloadTimer = setInterval(function () {
          if (timeleft <= 0) {
            clearInterval(downloadTimer);
            $('#sendId').hide();
            $('#reSendId').show();
            $('#timeCounter').hide();
            $('#timerdivId').hide();
            $('#mobileNoId').hide();
            $('#phoneId').hide();
          } else {
            $('#timeCounter').val(timeleft + " seconds remaining");
            $('#mobileNoId').val("OTP is sent to your " + phoneNo + " mobile number");
          }
          timeleft -= 1;
        }, 1000);
      } else {
        this.swal('Error', this.userDetails.message, 'error')
      }
    },
      (error) => console.log(error)
    );
  }

  validateOtp() {
    let otp = $('#otpId').val();
    if (otp == '' || otp == null || otp == undefined) {
      this.swal('', 'Please Provide Otp !', 'error');
      return;
    }
    let userid = this.sessionService.decryptSessionData("user").userId;
    this.hospitalService.validateotpforhosp(otp, userid).subscribe((data: any) => {
      this.otpvalidate = data;
      if (this.otpvalidate.status == 'success') {
        $('#OtpModal').hide();
        let navigateExtras: NavigationExtras = {
          state: {
            hospitalId: this.hospid
          }
        };
        this.route.navigate(['application/userhospital'], navigateExtras)
      } else {
        this.swal('Error', this.otpvalidate.message, 'error')
      }
    },
      (error) => console.log(error)
    );
  }

  close() {
    $('#OtpModal').hide();
  }

  onResendOtp() {
    this.generateotp();
  }
}
