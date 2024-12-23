import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../header.service';
import { Router } from '@angular/router';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import { QcadminServicesService } from '../Services/qcadmin-services.service';
import Swal from 'sweetalert2';
import { TaggingHistoryServiceService } from '../Services/tagging-history-service.service';
import { TableUtil } from '../util/TableUtil';
import { formatDate } from '@angular/common';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-tagging-history',
  templateUrl: './tagging-history.component.html',
  styleUrls: ['./tagging-history.component.scss']
})
export class TaggingHistoryComponent implements OnInit {
  txtsearchDate: any;
  user: any;
  showfilter: any = true;
  record: any;
  taggedPackegeDetails: any = [];
  showPegi: any;
  pageElement: any;
  currentPage: any;
  hospitalId: any = "";
  stateList: any = [];
  districtList: any = [];
  hospitalList: any = [];
  hospitalname: any = "All";
  keyword2 = "hospitalName";
  stateId: any = "";
  districtId: any = "";
  username: any;
  statename: any = "All";
  distname: any = "All";

  constructor(public headerService: HeaderService,
    private sessionService: SessionStorageService,
    private snoService: SnocreateserviceService,
    public qcadminserv: QcadminServicesService,
    public tagginghistoryservice: TaggingHistoryServiceService,
    private route: Router) { }

  ngOnInit(): void {
    this.headerService.setTitle(' Untagging History');
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

  getTaggedPackegeDetails(){
    let stateId = $('#stateId').val();
    let districtId = $('#districtId').val();
    if (stateId == undefined || stateId == null) { stateId = ""; };
    if (districtId == undefined || districtId == null) { districtId = ""; };
    this.stateId = stateId;
    this.districtId = districtId;
    this.username = this.user.fullName
    this.tagginghistoryservice.gettaggedhistory(stateId, districtId, this.hospitalId).subscribe(
      (data) => {
        this.taggedPackegeDetails = data;
        console.log(data);
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
  resetField() {
    window.location.reload();
  }
  selectEvent2(item) {
    this.hospitalId = item.hospitalCode;
    this.hospitalname = item.hospitalName;
  }

  clearEvent2() {
    this.hospitalId = '';
    this.hospitalname = 'All';
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
    Fullname: '',
    Createdon: '',
    UpdatedBy: '',
    UpdatedOn: '',


    // Type: '',
  };

  taggedHeading = [
    [
      'Sl#',
      'State Name',
      'District Name',
      'Hospital Name',
      'Hospital Code',
      'Speciality Type',
      // 'Header Name',
      'Header Code',
      // 'Sub-Package Name',
      'Sub-Package Code',
      'Procedure Code',
      'Description',
      'Package Amount',
      'Created By',
      'Created On',
      'Updated By',
      'Updated On',


      // 'Type'
    ],
  ];

  // untaggedHeading = [
  //   [
  //     'Sl#',
  //     'State Name',
  //     'District Name',
  //     'Hospital Name',
  //     'Hospital Code',
  //     'Speciality Type',
  //     'Header Name',
  //     'Header Code',
  //     // 'Type'
  //   ],
  // ];
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
      this.sno.HeaderCode = claim.headerCode;
      this.sno.SubPackageCode = claim.subPackageCode;
      this.sno.ProcedureCode = claim.procedureCode;
      this.sno.Description = claim.procedureDescription;
      this.sno.PackageAmount = claim.packageAmount;
      this.sno.Fullname = claim.fullname;
      this.sno.Createdon = claim.createdon;
      this.sno.UpdatedBy = claim.updatedby;
      this.sno.UpdatedOn = claim.updatedon;



      // if (this.taggedType == 0) {//tagged
      //   this.sno.SubPackageName = claim.subPackageName;
      //   this.sno.SubPackageCode = claim.subPackageCode;
      //   this.sno.ProcedureCode = claim.procedureCode;
      //   this.sno.Description = claim.procedureDescription;
      //   this.sno.PackageAmount = claim.packageAmount;
      // }
      // this.sno.Type = claim.taggedType;
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
      // if (this.taggedType == 0) {
      //   filter.push([['Type:-Tagged']]);
      // } else {
      //   filter.push([[' Type:-Untagged']]);
      // }
      if (this.showfilter) {
        filter.push([['State Name :-', this.statename]]);
        filter.push([['Dist Name :-', this.distname]]);
      }
      filter.push([['Hospital Name :-', this.hospitalname]]);
      // if (this.taggedType == 0) {
      //   TableUtil.exportListToExcelWithFilter(
      //     this.report,
      //     'Hospital Package Tagging Report',
      //     this.taggedHeading, filter
      //   );
      // } else {
        TableUtil.exportListToExcelWithFilter(
          this.report,
          ' Untagging History',
          this.taggedHeading, filter
        );
    //  }
    } else if (type == 'pdf') {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('p', 'mm', [297, 210]);
      doc.setFontSize(20);
      doc.text("Untagging  History", 80, 10);
      doc.setFontSize(14);
      if (this.showfilter) {
        doc.text('State Name :-' + this.statename, 15, 18);
        doc.text('District Name :-' + this.distname, 130, 18);
      }
      doc.text('Hospital Name :-' + this.hospitalname, 15, 26);
      // if (this.taggedType == 0) {
      //   doc.text('Type:-Tagged', 15, 34);
      // } else {
      //   doc.text('Type:-Untagged', 15, 34);
      // }
      doc.text('Generated By :- ' + this.username, 15, 42);
      doc.text('Generated On :' + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString(), 15, 50);
      var rows = [];

        for (var i = 0; i < this.report.length; i++) {
          var clm = this.report[i];
          var pdf = [];
          pdf[0] = clm.Slno;
          pdf[1] = clm.StateName;
          pdf[2] = clm.DistrictName;
          pdf[3] = clm.HospitalName;
          pdf[4] = clm.HospitalCode;
          pdf[5] = clm.SpecialityType;
          pdf[6] = clm.HeaderCode;
          pdf[7] = clm.SubPackageCode;
          pdf[8] = clm.ProcedureCode;
          pdf[9] = clm.Description;
          pdf[10] = clm.PackageAmount;
          pdf[11] = clm.Fullname;
          pdf[12] = clm.Createdon;
          pdf[13] = clm.UpdatedBy;
          pdf[14] = clm.UpdatedOn;




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
            0: { cellWidth: 10 },
            1: { cellWidth: 13 },
            2: { cellWidth: 13 },
            3: { cellWidth: 13 },
            4: { cellWidth: 13 },
            5: { cellWidth: 13 },
            6: { cellWidth: 13 },
            7: { cellWidth: 13 },
            8: { cellWidth: 13 },
            9: { cellWidth: 13 },
            10: { cellWidth: 13 },
            11: { cellWidth: 13 },
            12: { cellWidth: 13 },
            13: { cellWidth: 13 },
            14: { cellWidth: 13 },




          }
        });

      // } else {
      //   for (var i = 0; i < this.report.length; i++) {
      //     var clm = this.report[i];
      //     var pdf = [];
      //     pdf[0] = clm.Slno;
      //     pdf[1] = clm.StateName;
      //     pdf[2] = clm.DistrictName;
      //     pdf[3] = clm.HospitalName;
      //     pdf[4] = clm.HospitalCode;
      //     pdf[5] = clm.SpecialityType;
      //     pdf[6] = clm.HeaderName;
      //     pdf[7] = clm.HeaderCode;
      //     pdf[13] = clm.Type;

      //     rows.push(pdf);
      //   }
      //   autoTable(doc, {
      //     head: this.untaggedHeading,
      //     body: rows,
      //     theme: 'grid',
      //     startY: 55,
      //     headStyles: {
      //       fillColor: [26, 99, 54]
      //     },
      //     columnStyles: {
      //       0: { cellWidth: 10 },
      //       // 1: { cellWidth: 20 },
      //       // 2: { cellWidth: 20 },
      //       // 3: { cellWidth: 15 },
      //       // 4: { cellWidth: 15 },

      //     }
      //   });
      // }
      let j = doc.getNumberOfPages();
      doc.save('GJAY Untagging History.pdf');
    }
   }
}
