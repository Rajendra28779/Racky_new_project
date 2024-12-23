import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderService } from '../../header.service';
import { SnoconfigpipePipe } from '../../pipes/snoconfigpipe.pipe';
import { DcconfigurationService } from '../../Services/dcconfiguration.service';
import { DctaggedService } from '../../Services/dctagged.service';
import { SnamasterserviceService } from '../../Services/snamasterservice.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { TableUtil } from '../../util/TableUtil';
import Swal from 'sweetalert2';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-dctaggedreport',
  templateUrl: './dctaggedreport.component.html',
  styleUrls: ['./dctaggedreport.component.scss']
})
export class DctaggedreportComponent implements OnInit {
  @ViewChild('auto') auto;
  @ViewChild('autocopy') autocopy;

  updateGroup = new FormGroup({
    groupName: new FormControl(''),

  });
  selectedItems: any = [];
  hospitalCode: any;
  record: any;
  record1: any;
  currentPage: any;
  currentPage1: any;
  pageElement: any;
  pageElement1: any;
  showPegi: boolean;
  showPegi1: boolean;
  listOfDcData: any = [];
  SearchForm1: FormGroup;
  Filtered: any;
  Filtered1: any;
  dcId: any = '';
  stateId: any = null;
  districtId: any = null;
  public dcList: any = [];
  public stateList: any = [];
  public districtList: any = [];
  keyword: any = 'fullName';
  header: any;
  userId: any;
  user: any;
  hospitaldoctordata: any = [];
  stat: any;
  dist: any;
  showsdh: any = true;
  name: any;
  data: any;
  valuedata: string;
  statename: any = 'All';
  districtName: any = 'All';
  showdropdown: boolean;
  txtsearchDate: any;
  hospitalname: string;
  detailData: any = [];
  dcUserId: any;
  txtsearch: any;
  namedc: any;
  dcName: any = "All";
  fullname: any;
  dcname: any;
  dcnamedata: any;
  hospitalList: any;
  constructor(private route: Router, public headerService: HeaderService, private snoService: SnocreateserviceService,
    private dcService: DcconfigurationService, private snoconfigpipePipe: SnoconfigpipePipe,private sessionService: SessionStorageService,
    public fb: FormBuilder,
    private snamasterService: SnamasterserviceService, private dctaggedService: DctaggedService) { }

  ngOnInit(): void {
    // this.user = JSON.parse(sessionStorage.getItem("user"));
    this.user = this.sessionService.decryptSessionData("user");
    this.userId = this.user.userId;
    this.name = this.user.fullName;
    this.headerService.setTitle(' DC Tagged  Hospital Report');
    if (this.user.groupId == 6) {
      this.showdropdown = true
    } else {
      this.showdropdown = false
    }

    this.getStateList();
    this.getDCList();
    this.search();
  }
  getDCList() {
    this.dcService.getDCDetails().subscribe(
      (response) => {
        this.dcList = response;
      },
      (error) => console.log(error)
    )
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
    var stateCode = localStorage.getItem("stateCode");
    this.snoService.getHospitalbyDistrictId(id, stateCode).subscribe(
      (response) => {
        this.hospitalList = [];
        this.hospitalList = response;
      },
      (error) => console.log(error)
    )
  }


  selectEvent(item) {
    // do something with selected item
    this.dcId = item.userId;
    this.dcName = item.fullName;
  }


  search() {
    this.dcname = "";
    let userId = this.user.userId;
    let stateId = $('#stateId').val();
    let districtId = $('#districtId').val();
    if (stateId == undefined) {
      stateId = "";
    }
    if (districtId == undefined) {
      districtId = "";
    }
    if (this.dcId == undefined || this.dcId == null) {
      this.dcId = "";
    }
    this.stat = stateId;
    this.dist = districtId;
    if (this.user.groupId == 6) {
      this.dcId = this.user.userId;
    }
    this.dctaggedService.dctaggedReport(userId, this.stat, this.dist, this.dcId).subscribe(
      (result) => {
        this.hospitaldoctordata = [];
        this.hospitaldoctordata = result;
        this.record = this.hospitaldoctordata.length;
        if (this.record > 0) {
          this.currentPage = 1;
          this.pageElement = 100;
          this.showPegi = true;
        }
        else {
          this.showPegi = false;
        }
      },
      (error) => console.log(error)
    )
  }
  view(item: any) {
    this.dcnamedata = item.fullname;
    this.dcUserId = item.assignDc;
    this.stat = item.statecode;
    this.dist = item.districtcode;
    this.dctaggedService.getDcDetails(this.userId, this.dcUserId, this.stat, this.dist).subscribe((alldata) => {
      this.detailData = alldata;
      this.record1 = this.detailData.length;
      if (this.record1 > 0) {
        this.currentPage1 = 1;
        this.pageElement1 = 100;
        this.showPegi1 = true;
      }
      else {
        this.showPegi1 = false;
      }
    });
  }

  clearEvent() {
    this.dcId = "";
  }
  getReset() {
    window.location.reload();
  }

  report: any = [];
  oldClaimProcessBlockRpt: any = {
    slNo: "",
    stateName: "",
    districtName: "",
    hospitalCount: "",
    fullname: ""
  };
  heading = [['Sl No.', 'DC Name', 'Hospital Count', 'State', 'District ',]];

  downloadReport(type) {
    if (this.hospitaldoctordata == null || this.hospitaldoctordata.length == 0) {
      this.swal("Info", "No Record Found", "info");
      return;
    }
    this.report = [];
    let item: any;
    for (var i = 0; i < this.hospitaldoctordata.length; i++) {
      item = this.hospitaldoctordata[i];
      this.oldClaimProcessBlockRpt = [];
      this.oldClaimProcessBlockRpt.slNo = i + 1;
      this.oldClaimProcessBlockRpt.fullname = item.fullname;
      this.oldClaimProcessBlockRpt.hospitalCount = item.hospitalCount;
      this.oldClaimProcessBlockRpt.stateName = item.stateName;
      this.oldClaimProcessBlockRpt.districtName = item.districtName;
      this.report.push(this.oldClaimProcessBlockRpt);
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
    if (type == 1) {
      let filter = [];
      if (this.user.groupId == 6) {
        filter.push([['DC Name:-', this.name]]);
      } else {
        filter.push([['DC Name:-', this.dcName]]);
      }
      TableUtil.exportListToExcelWithFilter(this.report, " DC Tagged  Hospital Report", this.heading, filter);
    } else if (type == 2) {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('p', 'mm', [260, 250]);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text(" DC Tagged  Hospital Report", 70, 10);
      doc.setFontSize(13);
      if (this.user.groupId == 6) {
        doc.text("DC Name :-" + this.dcName, 20, 30);
      } else {
        doc.text("DC Name :-" + this.dcName, 20, 30);
      }
      doc.text("Generated By:-" + this.sessionService.decryptSessionData("user").fullName, 20, 40);
      doc.text("Generated On:- " + this.convertDate(new Date()), 130, 40);
      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.slNo;
        pdf[1] = clm.fullname;
        pdf[2] = clm.hospitalCount;
        pdf[3] = clm.stateName;
        pdf[4] = clm.districtName;

        rows.push(pdf);
      }
      autoTable(doc, {
        head: this.heading,
        body: rows,
        theme: 'grid',
        startY: 60,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 45 },
          2: { cellWidth: 35 },
          3: { cellWidth: 45 },
          4: { cellWidth: 55 },
        }
      });
      doc.save('GJAY DC Tagged  Hospital Report.pdf');
    }

  }

  report1: any = [];
  oldClaimProcessBlockRpt1: any = {
    slNo: "",
    hospitalName: "",
    hospitalCode: "",
    stateName: "",
    districtName: ""
  };
  heading1 = [['Sl No.', 'Hospital Details', 'State', 'District ']];

  downloadReport1(type) {
    if (this.detailData == null || this.detailData.length == 0) {
      this.swal("Info", "No Record Found", "info");
      return;
    }
    this.report1 = [];
    let item: any;
    for (var i = 0; i < this.detailData.length; i++) {
      item = this.detailData[i];
      this.oldClaimProcessBlockRpt1 = [];
      this.oldClaimProcessBlockRpt1.slNo = i + 1;
      this.oldClaimProcessBlockRpt1.hospitalName = item.hospitalName + '(' + item.hospitalCode + ')';
      this.oldClaimProcessBlockRpt1.stateName = item.stateName;
      this.oldClaimProcessBlockRpt1.districtName = item.districtName;
      this.report1.push(this.oldClaimProcessBlockRpt1);
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
    if (type == 1) {
      let filter = [];
      filter.push([['State:- ', this.statename]]);
      filter.push([['District Name:-', this.districtName]]);
      filter.push([['DC Name:-', this.dcName]]);
      TableUtil.exportListToExcelWithFilter(this.report1, " DC Tagged Hospital Details", this.heading1, filter);
    } else if (type == 2) {
      if (this.report1 == null || this.report1.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('p', 'mm', [260, 250]);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text(" DC Tagged Hospital Details", 70, 10);
      doc.setFontSize(13);
      doc.text("State :-" + this.statename, 20, 30);
      doc.text("District:-" + this.districtName, 130, 30);
      doc.text("DC Name :-" + this.dcName, 20, 40);
      doc.text("Generated By:-" + this.sessionService.decryptSessionData("user").fullName, 20, 50);
      doc.text("Generated On:- " + this.convertDate(new Date()), 130, 50);
      var rows = [];
      for (var i = 0; i < this.report1.length; i++) {
        var clm = this.report1[i];
        var pdf = [];
        pdf[0] = clm.slNo;
        pdf[1] = clm.hospitalName;
        pdf[2] = clm.stateName;
        pdf[3] = clm.districtName;
        rows.push(pdf);
      }
      autoTable(doc, {
        head: this.heading1,
        body: rows,
        theme: 'grid',
        startY: 60,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 55 },
          2: { cellWidth: 50 },
          3: { cellWidth: 55 },
        }
      });
      doc.save('GJAY DC Tagged Hospital Details.pdf');
    }

  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  convertDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy hh:mm:ss a');
    return date;
  }

}
