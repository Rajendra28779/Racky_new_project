import { formatDate, DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import Swal from 'sweetalert2';
import { HospitalspecialityreportserviceService } from '../../Services/hospitalspecialityreportservice.service';
import { QcadminServicesService } from '../../Services/qcadmin-services.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { HeaderService } from '../../header.service';
import { TableUtil } from '../../util/TableUtil';

@Component({
  selector: 'app-package-tagging-report',
  templateUrl: './package-tagging-report.component.html',
  styleUrls: ['./package-tagging-report.component.scss']
})
export class PackageTaggingReportComponent implements OnInit {
  @ViewChild('auto') auto;
  @ViewChild('autocopy') autocopy;

  txtsearchDate: any;
  user: any;
  showPegi: any;
  taggedPackegeDetails: any = [];
  pageElement: any;
  currentPage: any;
  taggedType: any = 0;
  record: any;
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
  stateId: any = "";
  districtId: any = "";
  constructor(public headerService: HeaderService, public qcadminserv: QcadminServicesService,
    private route: Router, private snoService: SnocreateserviceService, private sessionService: SessionStorageService,
    public hospitalspecialityreportservice: HospitalspecialityreportserviceService) { }

  ngOnInit(): void {
    this.headerService.setTitle('Hospital Package Tagging');
    this.user = this.sessionService.decryptSessionData("user");
    $('#stateId').val('');
    $('#districtId').val('');
    this.hospitalId = '';
    if (this.user.groupId == 5) {
      this.showfilter = false;
      this.getHospitalList();
    } else {
      this.showfilter = true;
    }
    this.getStateList();
    this.getTaggedPackegeDetails();

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

  onChangeType(event:any){
    this.taggedType= event;
  }

  getTaggedPackegeDetails() {
    let stateId = $('#stateId').val();
    let districtId = $('#districtId').val();
    if (stateId == undefined || stateId == null) { stateId = ""; };
    if (districtId == undefined || districtId == null) { districtId = ""; };
    this.stateId = stateId;
    this.districtId = districtId;
    this.username = this.user.fullName
    this.hospitalspecialityreportservice.getTaggedPackegeDetails(stateId, districtId, this.hospitalId, this.taggedType).subscribe(
      (data) => {
        this.taggedPackegeDetails = data;
        this.record = this.taggedPackegeDetails.length;
        if (this.record > 0) {
          this.currentPage = 1;
          this.pageElement = 100;
          this.showPegi = true;
        } else {
          this.showPegi = false;
        }
      });
  }

  showPreDoc1(text, index) {
    $('#proceduredescription' + index).text(text);
    $('#showMoreId6' + index).empty()
    $('#showMoreId7' + index).append('<div style="cursor: pointer; color: #1d89c9">Show Less</div>');
  }

  hidePreDoc1(text, index) {
    if (text.length > 10) {
      $('#proceduredescription' + index).text(text.substring(0, 10) + '...');
      $('#showMoreId7' + index).empty()
      $('#showMoreId6' + index).empty();
      $('#showMoreId6' + index).append('<span style="cursor: pointer; color: #1d89c9">Show More</span>');
    }
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
    HospitalName: '',
    HospitalCode: '',
    SpecialityType: '',
    HeaderName: '',
    HeaderCode: '',
    SubPackageName: '',
    SubPackageCode: '',
    ProcedureCode: '',
    Description: '',
    PackageAmount: '',
    Type: '',
  };

  taggedHeading = [
    [
      'Sl#',
      'State Name',
      'District Name',
      'Hospital Name',
      'Hospital Code',
      'Speciality Type',
      'Header Name',
      'Header Code',
      'Sub-Package Name',
      'Sub-Package Code',
      'Procedure Code',
      'Description',
      'Package Amount',
      'Type'
    ],
  ];

  untaggedHeading = [
    [
      'Sl#',
      'State Name',
      'District Name',
      'Hospital Name',
      'Hospital Code',
      'Speciality Type',
      'Header Name',
      'Header Code',
      'Type'
    ],
  ];

  downloadReport(type) {
    this.report = [];
    let claim: any;
    for (var i = 0; i < this.taggedPackegeDetails.length; i++) {
      claim = this.taggedPackegeDetails[i];
      this.sno = [];
      this.sno.Slno = i + 1;
      this.sno.StateName = claim.stateName;
      this.sno.DistrictName = claim.districtName;
      this.sno.HospitalName = claim.hospitalName;
      this.sno.HospitalCode = claim.hospitalCode;
      this.sno.SpecialityType = claim.specialityType;
      this.sno.HeaderName = claim.headerName;
      this.sno.HeaderCode = claim.headerCode;

      if (this.taggedType == 0) {//tagged
        this.sno.SubPackageName = claim.subPackageName;
        this.sno.SubPackageCode = claim.subPackageCode;
        this.sno.ProcedureCode = claim.procedureCode;
        this.sno.Description = claim.procedureDescription;
        this.sno.PackageAmount = claim.packageAmount;
      }
      this.sno.Type = claim.taggedType;
      this.report.push(this.sno);
    }

    for (let i = 0; i < this.stateList.length; i++) {
      if (this.stateList[i].stateCode == this.stateId) {
        this.statename = this.stateList[i].stateName;
      }
    }
    for (let i = 0; i < this.districtList.length; i++) {
      if (this.districtList[i].districtcode == this.districtId) {
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
      if (this.taggedType == 0) {
        filter.push([['Type:-Tagged']]);
      } else {
        filter.push([[' Type:-Untagged']]);
      }
      if (this.showfilter) {
        filter.push([['State Name :-', this.statename]]);
        filter.push([['Dist Name :-', this.distname]]);
      }
      filter.push([['Hospital Name :-', this.hospitalname]]);
      if (this.taggedType == 0) {
        TableUtil.exportListToExcelWithFilter(
          this.report,
          'Hospital Package Tagging Report',
          this.taggedHeading, filter
        );
      } else {
        TableUtil.exportListToExcelWithFilter(
          this.report,
          'Hospital Package Tagging Report',
          this.untaggedHeading, filter
        );
      }
    } else if (type == 'pdf') {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('p', 'mm', [297, 210]);
      doc.setFontSize(20);
      doc.text("Hospital Package Tagging  Report", 80, 10);
      doc.setFontSize(14);
      if (this.showfilter) {
        doc.text('State Name :-' + this.statename, 15, 18);
        doc.text('Dist Name :-' + this.distname, 130, 18);
      }
      doc.text('Hospital Name :-' + this.hospitalname, 15, 26);
      if (this.taggedType == 0) {
        doc.text('Type:-Tagged', 15, 34);
      } else {
        doc.text('Type:-Untagged', 15, 34);
      }
      doc.text('Generated By :- ' + this.username, 15, 42);
      doc.text('Generated On :' + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString(), 15, 50);
      var rows = [];
      if (this.taggedType == 0) {
        for (var i = 0; i < this.report.length; i++) {
          var clm = this.report[i];
          var pdf = [];
          pdf[0] = clm.Slno;
          pdf[1] = clm.StateName;
          pdf[2] = clm.DistrictName;
          pdf[3] = clm.HospitalName;
          pdf[4] = clm.HospitalCode;
          pdf[5] = clm.SpecialityType;
          pdf[6] = clm.HeaderName;
          pdf[7] = clm.HeaderCode;
          pdf[8] = clm.SubPackageName;
          pdf[9] = clm.SubPackageCode;
          pdf[10] = clm.ProcedureCode;
          pdf[11] = clm.Description;
          pdf[12] = clm.PackageAmount;
          pdf[13] = clm.Type;

          rows.push(pdf);
        }
        autoTable(doc, {
          head: this.taggedHeading,
          body: rows,
          theme: 'grid',
          startY: 55,
          headStyles: {
            fillColor: [26, 99, 54]
          },
          columnStyles: {
            0: { cellWidth: 50 },
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
          pdf[3] = clm.HospitalName;
          pdf[4] = clm.HospitalCode;
          pdf[5] = clm.SpecialityType;
          pdf[6] = clm.HeaderName;
          pdf[7] = clm.HeaderCode;
          pdf[13] = clm.Type;

          rows.push(pdf);
        }
        autoTable(doc, {
          head: this.untaggedHeading,
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
      doc.save('GJAY Hospital Package Tagging Report.pdf');
    }
  }
  convertDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy, h:mm:ss a');
    return date;
  }
}
