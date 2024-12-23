import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderService } from '../../header.service';
import { DatePipe, formatDate } from '@angular/common';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { TableUtil } from '../../util/TableUtil';
import Swal from 'sweetalert2';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { HospitalspecialityreportserviceService } from '../../Services/hospitalspecialityreportservice.service';
import { QcadminServicesService } from '../../Services/qcadmin-services.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-package-updation',
  templateUrl: './package-updation.component.html',
  styleUrls: ['./package-updation.component.scss'],
})
export class PackageUpdationComponent implements OnInit {
  @ViewChild('auto') auto;
  @ViewChild('autocopy') autocopy;

  txtsearchDate: any;
  txtsearchPkgData: any;
  user: any;
  showPegi: any;
  hospitallist: any = [];
  // pageElement: any;
  currentPage: any;
  hsptltype: any = 1;
  record: any;
  show: any;
  username: any;
  timespan: any;
  stateList: any = [];
  districtList: any = [];
  keyword2 = 'hospitalName';
  hospitalId: any = '';
  hospitalname: any = 'All';
  hospitalList: any = [];
  showfilter: any = true;
  statename: any = 'All';
  distname: any = 'All';
  state: any;
  dist: any;
  checkAllBox:boolean=false;
  constructor(
    public headerService: HeaderService,
    private snoService: SnocreateserviceService,
    public hospitalspecialityreportservice: HospitalspecialityreportserviceService,
    public qcadminserv: QcadminServicesService,
    private sessionService: SessionStorageService
  ) {}

  ngOnInit(): void {
    this.getStateList();

    this.headerService.setTitle('Hospital Package Tagging');
    this.user = this.sessionService.decryptSessionData("user");
    // $('#stateId').val('');
    // $('#districtId').val('');
    if (this.user.groupId == 5) {
      this.showfilter = false;
      this.getHospitalList();
    } else {
      this.showfilter = true;
    }
    // this.gethsptlList(1);
    // this.pageElement = 100;
  }
  getStateList() {
    this.snoService.getStateList().subscribe(
      (response) => {
        this.stateList = response;
      },
      (error) => console.log(error)
    );
  }
  OnChangeState(id) {
    this.snoService.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = response;
      },
      (error) => console.log(error)
    );
  }
  getHospitalList() {
    let state;
    let dist;
    if (!this.showfilter) {
      state = '';
      dist = '';
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
      (error) => console.log(error)
    );
  }
  hospitalCode:any;
  selectEvent2(item) {
    this.hospitalId = item.hospitalId;
    this.hospitalCode = item.hospitalCode;
    this.hospitalname = item.hospitalName;
  }

  clearEvent2() {
    this.hospitalId = '';
    this.hospitalname = 'All';
  }
  gethsptlList(data) {
    // let state;
    // let dist;
    this.hospitallist= [];
    this.packageList=[];
    this.state = $('#stateId').val();
    this.dist = $('#districtId').val();
    if (data != 1) {
      if (this.state == undefined || this.state == null || this.state == '') {
        this.swal('Info', 'Please Select State', 'info');
        return;
      }
      if (this.dist == undefined || this.dist == null || this.dist == '') {
        this.swal('Info', 'Please Select District', 'info');
        return;
      }
      if (
        this.hospitalCode == undefined ||
        this.hospitalCode == null ||
        this.hospitalCode == ''
      ) {
        this.swal('Info', 'Please Select Hospital', 'info');
        return;
      }
    }
    // this.state = state;
    // this.dist = dist;
    let userId = this.user.userId;
    this.username = this.user.fullName;
    this.hospitalspecialityreportservice
      .getlist(userId, this.hsptltype, this.state, this.dist, this.hospitalCode)
      .subscribe((data) => {
        this.hospitallist = data;
        this.record = this.hospitallist.length;
        this.showPackagesBtn = false;
        this.showPackages = false;
        if (this.record > 0) {
          this.currentPage = 1;
          // this.pageElement = 100;
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
    HospitalCode: '',
    HospitalName: '',
    SpecialityCode: '',
    SpecialityName: '',
  };
  heading = [
    [
      'Sl#',
      'Hospital Code',
      'Hospital Name',
      'Speciality Code',
      'Speciality Name',
    ],
  ];
  heading1 = [['Sl#', 'Hospital Code', 'Hospital Name']];
  downloadReport(type) {
    this.report = [];
    let claim: any;
    for (var i = 0; i < this.hospitallist.length; i++) {
      claim = this.hospitallist[i];
      this.sno = [];
      this.sno.Slno = i + 1;
      this.sno.HospitalCode = claim.hospitalcode;
      this.sno.HospitalName = claim.hospitalname;

      if (this.show != 2) {
        this.sno.SpecialityCode = claim.packagecode;
        this.sno.SpecialityName = claim.packagename;
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
          'Hospital Specialist  Report',
          this.heading,
          filter
        );
      } else {
        TableUtil.exportListToExcelWithFilter(
          this.report,
          'Hospital Specialist  Report',
          this.heading1,
          filter
        );
      }
    } else if (type == 'pdf') {
      if (this.report == null || this.report.length == 0) {
        this.swal('Info', 'No Record Found', 'info');
        return;
      }
      var doc = new jsPDF('p', 'mm', [297, 210]);
      doc.setFontSize(20);
      doc.text('Hospital Specialist  Report', 80, 10);
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
      doc.text(
        'Generated On :' +
          formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString(),
        15,
        50
      );
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
            fillColor: [26, 99, 54],
          },
          columnStyles: {
            0: { cellWidth: 10 },
            // 1: { cellWidth:  },
            // 2: { cellWidth:  },
          },
        });
      } else {
        for (var i = 0; i < this.report.length; i++) {
          var clm = this.report[i];
          var pdf = [];
          pdf[0] = clm.Slno;
          pdf[1] = clm.HospitalCode;
          pdf[2] = clm.HospitalName;
          pdf[3] = clm.SpecialityCode;
          pdf[4] = clm.SpecialityName;
          rows.push(pdf);
        }
        autoTable(doc, {
          head: this.heading,
          body: rows,
          theme: 'grid',
          startY: 55,
          headStyles: {
            fillColor: [26, 99, 54],
          },
          columnStyles: {
            0: { cellWidth: 10 },
            // 1: { cellWidth: 20 },
            // 2: { cellWidth: 20 },
            // 3: { cellWidth: 15 },
            // 4: { cellWidth: 15 },
          },
        });
      }
      let j = doc.getNumberOfPages();
      doc.save('GJAY_Hospital Specialist  Report.pdf');
    }
  }
  resObject: any;
  packageList: any = [];
  procedureList: any = [];
  showPackages: any = false;
  showPackagesPegi: any = false;
  packageData:any;
  backupPackList:any=[];
  backupProcedureList:any=[];
  procList:any=[];
  getPackage(data,flag) {
    this.packageData = data;
    this.packageList = [];
    this.hospitalspecialityreportservice.getPackages(data).subscribe(
      (data) => {
        this.resObject = data;
        // JSON.parse(data.details);
        if (this.resObject.status == 'success') {
          this.showPackages = true;
          let packages = JSON.parse(this.resObject.details);
          this.packageList = packages.packages;
          this.procedureList = packages.procedureList;
          this.backupPackList = this.packageList;
          this.backupProcedureList = packages.procedureList;
          this.procedureList = this.removeDuplicates(this.procedureList, 'headerId');
          // this.backupProcedureList.forEach(element => {
          //   this.procedureList.forEach(element1 => {
          //     if(element.headerId == element1.headerId){
          //       this.procList.push(element);
          //     }
          //   });
          // });
          if(flag == 'edit'){
            this.showPackagesBtn = true;
            this.packageList.forEach(element => {
              element.statusView = false
            });
          }else{
            this.showPackagesBtn = false;
            this.packageList.forEach(element => {
              element.statusView = true
            });
          } //JSON.parse(this.resObject.details);
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
  showPackagesBtn:any = false;
  specialist: any = [];
  specialistbkp: any = [];
  special: any;
  selectitem(data) {
    this.special = {
      packageid: '',
      packagecode: '',
      packageSubCatagoryId: '',
      packageSubCode: '',
      procedureId: '',
      procedureCode: '',
      status: 0,
    };
    this.special.packageid = data.packageHeaderId;
    this.special.packagecode = data.packageHeaderCode;
    this.special.packageSubCatagoryId = data.packageSubCatagoryId;
    this.special.packageSubCode = data.packageSubCode;
    this.special.procedureId = data.procedureId;
    this.special.procedureCode = data.procedureCode;
    this.special.status = data.status == 0 ? 1 : 0;
    let stat = false;
    for (const i of this.specialist) {
      if (i.procedureCode == this.special.procedureCode) {
        stat = true;
      }
    }
    if (stat == false) {
      this.specialist.push(this.special);
    } else {
      for (var i = 0; i < this.specialist.length; i++) {
        if (data.procedureCode == this.specialist[i].procedureCode) {
          var index = this.specialist.indexOf(this.specialist[i]);
          if (index !== -1) {
            this.specialist.splice(index, 1);
          }
        }
      }
    }
    if(this.specialist.length == this.packageList.length){
      this.checkAllBox = true;
    }else{
      this.checkAllBox = false;
    }
  }
  submit() {
    if (
      this.hospitalId == null ||
      this.hospitalId == '' ||
      this.hospitalId == undefined
    ) {
      this.swal('Info', 'Please select Hospital', 'info');
      return;
    }
    if (this.specialist.length == 0) {
      this.swal('Info', 'Please select at least One Specialist', 'info');
      return;
    }
    Swal.fire({
      title: 'Are You Sure?',
      text: 'You Want To Save This Data!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,Submit It!',
    }).then((result) => {
      if (result.isConfirmed) {
        let reqData = {
          hospitalId: this.hospitalId,
          hospitalcode: this.hospitalCode,
          specialist: this.specialist,
          createdby: this.user.userId,
        };
        this.qcadminserv.updatePackageSpecility(reqData).subscribe(
          (data: any) => {
            if (data.status == "success") {
                if(data.details.status == 200) {
                  this.swal('Success', 'Record Updated Succefully', 'success');
                  this.specialist = [];
                  this.getPackage(this.packageData,'edit');
                }else{
                  this.swal('Error', 'Something went wrong', 'error');
                }
            } else {
              this.swal('Error', 'Something went wrong', 'error');
            }
          },
          (error) => {
            console.log(error);
            this.swal('Error', 'Something went wrong', 'error');
          }
        );
      }
    });
  }
  onReset(){
    this.getPackage(this.packageData,'edit');
  }
  showPreDoc1(text,index) {
    $('#proceduredescription'+index).text(text);
    $('#showMoreId6'+index).empty()
    $('#showMoreId7'+index).append('<div style="cursor: pointer; color: #1d89c9">Show Less</div>');
  }
  hidePreDoc1(text,index) {
    if (text.length > 30) {
      $('#proceduredescription'+index).text(text.substring(0, 30) + '...');
      $('#showMoreId7'+index).empty()
      $('#showMoreId6'+index).empty();
      $('#showMoreId6'+index).append('<span style="cursor: pointer; color: #1d89c9">Show More</span>');
    }
  }
  selectAll(event){
    this.special = {
      packageid: '',
      packagecode: '',
      packageSubCatagoryId: '',
      packageSubCode: '',
      procedureId: '',
      procedureCode: '',
      status: 0,
    };
    if(event.target.checked){
      this.checkAllBox = true;
      this.packageList.forEach(element => {
        element.status = 0;
        this.special.packageid = element.packageHeaderId;
        this.special.packagecode = element.packageHeaderCode;
        this.special.packageSubCatagoryId = element.packageSubCatagoryId;
        this.special.packageSubCode = element.packageSubCode;
        this.special.procedureId = element.procedureId;
        this.special.procedureCode = element.procedureCode;
        this.special.status = element.status;
        this.specialist.push(this.special);
      });
    }else{
      this.checkAllBox = false;
      this.packageList.forEach(element => {
        element.status = 1;
      });
      this.specialist = [];
    }
    if(this.specialist.length == this.packageList.length){
      this.checkAllBox = true;
    }else{
      this.checkAllBox = false;
    }
  }
  changeProcedure(){
    let procedureId = $('#procedureid').val();
    this.packageList = [];
    this.specialist = []
    this.procList = [];
    this.checkAllBox = false;
    if(procedureId != 0 ){
      this.backupProcedureList.forEach(element => {
        if(element.headerId == procedureId){
          this.procList.push(element);
        }
      });
      this.backupPackList.forEach(element => {
        this.procList.forEach(element1 => {
          if(element.procedureId == element1.procedureId){
            this.packageList.push(element);
          }
        });
      });
    }else{
      this.packageList=this.backupPackList;
    }
  }
  removeDuplicates(array, propertyName) {
    const uniqueObjects = [];
    const seenNames = {};
    for (const obj of array) {
      const name = obj[propertyName];
      if (!seenNames[name]) {
        seenNames[name] = true;
        uniqueObjects.push(obj);
      }
    }
    return uniqueObjects;
  }
}
