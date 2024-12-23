import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderService } from '../../header.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HospitalspecialityreportserviceService } from '../../Services/hospitalspecialityreportservice.service';
import { TableUtil } from '../../util/TableUtil';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatePipe, formatDate } from '@angular/common';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { QcadminServicesService } from '../../Services/qcadmin-services.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-hospitalspecialistupdationreport',
  templateUrl: './hospitalspecialistupdationreport.component.html',
  styleUrls: ['./hospitalspecialistupdationreport.component.scss']
})
export class HospitalspecialistupdationreportComponent implements OnInit {
  @ViewChild('auto') auto;
  @ViewChild('autocopy') autocopy;

  txtsearchDate: any;
  user: any;
  showPegi: any;
  hospitallist: any = [];
  pageElement: any;
  currentPage: any;
  hsptltype: any = 1;
  record: any;
  show: any;
  username: any;
  timespan: any;
  stateList: any = [];
  districtList: any = [];
  keyword2 = "hospitalName";
  hospitalId: any = "";
  hospitalname: any = "All";
  hospitalList: any = [];
  showfilter: any = true;
  statename: any = "All";
  distname: any = "All";
  state: any = "";
  dist: any = "";
  isTabHide: boolean;
  isRowHide: boolean;
  isRowshown: boolean;
  constructor(public headerService: HeaderService, public qcadminserv: QcadminServicesService,
    private route: Router, private snoService: SnocreateserviceService, private sessionService: SessionStorageService,
    public hospitalspecialityreportservice: HospitalspecialityreportserviceService) { }

  ngOnInit(): void {
    this.headerService.setTitle('Hospital Speciality Tagging');
    this.user = this.sessionService.decryptSessionData("user");
    $('#stateId').val('');
    $('#districtId').val('');
    this.hospitalId = '';
    if (this.user.groupId == 5) {
      this.showfilter = false;
      this.isTabHide = false;
      this.isRowHide = true;
      this.isRowshown = false;
      this.getHospitalList();
    } else {
      this.showfilter = true;
      this.isRowHide = false;
      this.isRowshown = true;
      this.isTabHide =true;
    }
    this.getStateList();
    this.gethsptlList();

  }
  getStateList() {
    this.snoService.getStateList().subscribe(
      (response) => {
        this.stateList = response;
      },
    );
  }
  OnChangeState(id) {
    this.snoService.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = response;
      },
    )
  }
  getHospitalList() {
    let state;
    let dist;
    if (!this.showfilter) {
      state = ""; dist = ""
    } else {
      state = $('#stateId').val();
      dist = $('#districtId').val();
    }
    this.qcadminserv.gettmasactivehospitallist(state, dist).subscribe(
      (response) => {
        this.hospitalList = response;
        if (!this.showfilter) {
          for (let i = 0; i < this.hospitalList.length; i++) {
            if (this.hospitalList[i].hospitalCode == this.user.userName) {
              this.hospitalId = this.hospitalList[i].hospitalId;
              this.hospitalname = this.hospitalList[i].hospitalName;
            }
          }
        }
      },
    )
  }

  selectEvent2(item) {
    this.hospitalId = item.hospitalCode;
    this.hospitalname = item.hospitalName;
  }

  clearEvent2() {
    this.hospitalId = '';
    this.hospitalname = 'All';
  }
  onSelected(event:any){
    this.hsptltype= event;
  }
  gethsptlList() {
    let state;
    let dist;
    state = $('#stateId').val();
    dist = $('#districtId').val();
    if (state == undefined || state == null) { state = ""; };
    if (dist == undefined || dist == null) { dist = ""; };
    this.state = state;
    this.dist = dist;
    let userId = this.user.userId;
    this.show = 0
    if (this.hsptltype == 2) {
      this.show = 2;
    } this.username = this.user.fullName
    this.hospitalspecialityreportservice.getlist(userId, this.hsptltype, state, dist, this.hospitalId).subscribe(
      (data) => {
        this.hospitallist = data;
        this.record = this.hospitallist.length;
        if (this.record > 0) {
          this.currentPage = 1;
          this.pageElement = 100;
          this.showPegi = true;
        } else {
          this.showPegi = false;
        }
      });
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  resetField() {
    window.location.reload();
  }
  report: any = [];
  sno: any = {
    Slno: '',
    StateName: '',
    DistrictName: '',
    HospitalCode: '',
    HospitalName: '',
    SpecialityCode: '',
    SpecialityName: '',
    Type: '',
  };
  heading = [
    [
      'Sl#',
      'State Name',
      'District Name',
      'Hospital Code',
      'Hospital Name',
      'Speciality Code',
      'Speciality Name',
      'Type'
    ],
  ];
  heading1 = [
    [
      'Sl#',
      'Hospital Code',
      'Hospital Name',

    ],
  ];
  downloadReport(type) {
    this.report = [];
    let claim: any;
    for (var i = 0; i < this.hospitallist.length; i++) {
      claim = this.hospitallist[i];
      this.sno = [];
      this.sno.Slno = i + 1;
      this.sno.StateName = claim.stateName;
      this.sno.DistrictName = claim.distName;
      this.sno.HospitalCode = claim.hospitalcode;
      this.sno.HospitalName = claim.hospitalname;

      if (this.show != 2) {
        this.sno.SpecialityCode = claim.packagecode;
        this.sno.SpecialityName = claim.packagename;
        this.sno.Type = claim.hospitalTypeName;
      }
      this.report.push(this.sno);
    }

    for (let i = 0; i < this.stateList.length; i++) {
      if (this.stateList[i].stateCode == this.state) {
        this.statename = this.stateList[i].stateName;
      }
    }
    for (let i = 0; i < this.districtList.length; i++) {
      if (this.districtList[i].districtcode == this.dist) {
        this.distname = this.districtList[i].districtname;
      }
    }
    for (let i = 0; i < this.hospitalList.length; i++) {
      if (this.hospitalList[i].hospitalCode == this.hospitalId) {
        this.hospitalname = this.hospitalList[i].hospitalName;
      }
    }

    if (type == 'xcl') {
      let filter = [];
      if (this.hsptltype == 1) {
        filter.push([['Type:-Tagged']]);
      } else {
        filter.push([[' Type:-Untagged']]);
      }
      if (this.showfilter) {
        filter.push([['State Name :-', this.statename]]);
        filter.push([['Dist Name :-', this.distname]]);
      }
      filter.push([['Hospital Name :-', this.hospitalname]]);
      if (this.show != 2) {
        TableUtil.exportListToExcelWithFilter(
          this.report,
          'Hospital Specialist Report',
          this.heading, filter
        );
      } else {
        TableUtil.exportListToExcelWithFilter(
          this.report,
          'Hospital Specialist Report',
          this.heading1, filter
        );
      }
    }
    else if (type == 'pdf') {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('p', 'mm', [297, 210]);
      doc.setFontSize(20);
      doc.text("Hospital Specialist  Report", 80, 10);
      doc.setFontSize(14);
      if (this.showfilter) {
        doc.text('State Name :-' + this.statename, 15, 18);
        doc.text('Dist Name :-' + this.distname, 130, 18);
      }
      doc.text('Hospital Name :-' + this.hospitalname, 15, 26);
      if (this.hsptltype == 1) {
        doc.text('Type:-Tagged', 15, 34);
      } else {
        doc.text('Type:-Untagged', 15, 34);
      }
      doc.text('Generated By :- ' + this.username, 15, 42);
      doc.text('Generated On :' + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString(), 15, 50);
      var rows = [];
      if (this.show == 2) {
        for (var i = 0; i < this.report.length; i++) {
          var clm = this.report[i];
          var pdf = [];
          pdf[0] = clm.Slno;
          pdf[1] = clm.HospitalCode;
          pdf[2] = clm.HospitalName;
          rows.push(pdf);
        }
        autoTable(doc, {
          head: this.heading1,
          body: rows,
          theme: 'grid',
          startY: 55,
          headStyles: {
            fillColor: [26, 99, 54]
          },
          columnStyles: {
            0: { cellWidth: 10 },
            // 1: { cellWidth:  },
            // 2: { cellWidth:  },

          }
        });

      } else {
        for (var i = 0; i < this.report.length; i++) {
          var clm = this.report[i];
          var pdf = [];
          pdf[0] = clm.Slno;
          pdf[1] = clm.StateName;
          pdf[2] = clm.DistrictName;
          pdf[3] = clm.HospitalCode;
          pdf[4] = clm.HospitalName;
          pdf[5] = clm.SpecialityCode;
          pdf[6] = clm.Type;
          rows.push(pdf);
        }
        autoTable(doc, {
          head: this.heading,
          body: rows,
          theme: 'grid',
          startY: 55,
          headStyles: {
            fillColor: [26, 99, 54]
          },
          columnStyles: {
            0: { cellWidth: 10 },
            // 1: { cellWidth: 20 },
            // 2: { cellWidth: 20 },
            // 3: { cellWidth: 15 },
            // 4: { cellWidth: 15 },

          }
        });
      }
      let j = doc.getNumberOfPages();
      doc.save('Bsky_Hospital Specialist Report.pdf');
    }
  }
  convertDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy, h:mm:ss a');
    return date;
  }
}
