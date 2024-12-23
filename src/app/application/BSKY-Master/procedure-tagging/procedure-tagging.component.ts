import { formatDate } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { HospitalspecialityreportserviceService } from '../../Services/hospitalspecialityreportservice.service';
import { QcadminServicesService } from '../../Services/qcadmin-services.service';
import { HeaderService } from '../../header.service';
import { TableUtil } from '../../util/TableUtil';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-procedure-tagging',
  templateUrl: './procedure-tagging.component.html',
  styleUrls: ['./procedure-tagging.component.scss']
})
export class ProcedureTaggingComponent implements OnInit {
  @ViewChild('auto') auto;
  @ViewChild('autocopy') autocopy;
  @ViewChild('packageModalId') packageModalId: ElementRef;

  txtsearchDate: any;
  txtsearchPkgData: any;
  user: any;
  procedureList: any = [];
  pageElement1: any;
  currentPage1: any;
  showPegi1: any;
  record1: any;
  pageElement2: any;
  currentPage2: any;
  showPegi2: any;
  record2: any;
  hsptltype: any = 1;
  show: any;
  username: any;
  timespan: any;
  report: any = [];
  headerCodeList: any = [];
  packageList: any = [];
  showPackagesPegi: any = false;
  packageData: any;

  hideSubmitButton: boolean = false;
  currentProcedureCode: any;
  specialist: any = [];
  specialistbkp: any = [];
  special: any;
  currentProcedureId: any;
  selectedProcedureArray: any = [];
  // alredyAvailabelProcedureArray: any = [];

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
  constructor(
    public headerService: HeaderService,
    public hospitalspecialityreportservice: HospitalspecialityreportserviceService,
    public qcadminserv: QcadminServicesService,
    public router: Router,
    private modalService: NgbModal,
    private sessionService: SessionStorageService
  ) { }

  ngOnInit() {
    this.headerService.setTitle('Hospital Package Tagging');
    this.user = this.sessionService.decryptSessionData("user");
    this.getPackageHeaderCodeList();
    let procedurePackageBean = {
      actionCode: 1,
      userId: this.user.userId,
      procedureId: 1,
      headerId: 1,
      procedureCode: "",
      packageHeaderCode: ""
    }
    this.getTaggedProcedureList(procedurePackageBean);
    this.pageElement1 = 50;
    this.pageElement2 = 10;
  }


  getPackageHeaderCodeList() {
    this.hospitalspecialityreportservice
      .getPackageHeaderCodeList()
      .subscribe((data: any) => {
        this.headerCodeList = data;
        $('#headerCode').val('All');
      });
  }

  onChangePackageHeader(headerCode) {
    let procedurePackageBean = {
      actionCode: 1,
      userId: this.user.userId,
      procedureId: 1,
      headerId: 1,
      procedureCode: "",
      packageHeaderCode: headerCode
    }
    this.getTaggedProcedureList(procedurePackageBean);
  }

  getTaggedProcedureList(procedurePackageBean) {
    if (procedurePackageBean.actionCode == 1) {
      this.procedureCode = "";
      this.procedureDescription = "";
      this.procedureList = [];
      this.packageList = [];
    } else {
      this.packageList = [];
    }

    this.hospitalspecialityreportservice
      .getProcedurePackageInfo(procedurePackageBean)
      .subscribe((data: any) => {
        if (procedurePackageBean.actionCode == 1) {
          this.procedureList = data;
          this.record1 = this.procedureList.length;
          if (this.record1 > 0) {
            this.currentPage1 = 1;
            this.pageElement1 = 50;
            this.showPegi1 = true;
          } else {
            this.showPegi1 = false;
          }
        } else {
          this.packageList = data;
          this.record2 = this.packageList.length;
          if (this.record2 > 0) {
            this.currentPage2 = 1;
            this.pageElement2 = 10;
            this.showPegi2 = true;
          } else {
            this.showPegi2 = false;
          }
          if (procedurePackageBean.viewStatus == "edit") {
            this.hideSubmitButton = true;
            this.packageList.forEach(element => {
              if ((element.masterStatus == 1 || element.insertStatus == 1) && !element.viewStatus) {
                let selectedIteam = {
                  procedureId: this.currentProcedureId,
                  procedureCode: this.currentProcedureCode,
                  headerId: element.headerId,
                  headerCode: element.packageHeaderCode,
                  status: 1
                }
                // this.alredyAvailabelProcedureArray.push(selectedIteam);
                this.selectedProcedureArray.push(selectedIteam);
              }
            });
            if(this.selectedProcedureArray.length == 1){
              this.selectedProcedureArray[0].status = 0;
            }
          } else {
            this.hideSubmitButton = false;
          }
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

  downloadReport(type) {
    this.report = [];
    let claim: any;
    for (var i = 0; i < this.procedureList.length; i++) {
      claim = this.procedureList[i];
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

    // for (let i = 0; i < this.stateList.length; i++) {
    //   if (this.stateList[i].stateCode == this.state) {
    //     this.statename = this.stateList[i].stateName;
    //   }
    // }
    // for (let i = 0; i < this.districtList.length; i++) {
    //   if (this.districtList[i].districtcode == this.dist) {
    //     this.distname = this.districtList[i].districtname;
    //   }
    // }
    // for (let i = 0; i < this.hospitalList.length; i++) {
    //   if (this.hospitalList[i].hospitalCode == this.hospitalId) {
    //     this.hospitalname = this.hospitalList[i].hospitalName;
    //   }
    // }

    if (type == 'xcl') {
      let filter = [];
      if (this.hsptltype == 1) {
        filter.push([['Type:-Tagged']]);
      } else {
        filter.push([[' Type:-Untagged']]);
      }
      // if (this.showfilter) {
      //   filter.push([['State Name :-', this.statename]]);
      //   filter.push([['Dist Name :-', this.distname]]);
      // }
      // filter.push([['Hospital Name :-', this.hospitalname]]);
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
      // if (this.showfilter) {
      //   doc.text('State Name :-' + this.statename, 15, 18);
      //   doc.text('Dist Name :-' + this.distname, 130, 18);
      // }
      // doc.text('Hospital Name :-' + this.hospitalname, 15, 26);
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

  procedureDescription: any;
  procedureCode: any;
  getPackage(claim, flag) {
    this.selectedProcedureArray = [];
    this.currentProcedureId = claim.procedureId;
    this.procedureCode = claim.procedureCode;
    this.procedureDescription = claim.procedureDescription;
    this.currentProcedureCode = claim.procedureCode;
    this.openModal();
    let procedurePackageBean = {
      actionCode: 2,
      userId: this.user.userId,
      procedureId: 1,
      headerId: 1,
      procedureCode: claim.procedureCode,
      packageHeaderCode: claim.packageHeaderCode,
      viewStatus: flag
    }
    this.getTaggedProcedureList(procedurePackageBean);
  }

  selectitem(data, isChecked) {

    let selectedIteam = {
      procedureId: this.currentProcedureId,
      procedureCode: this.currentProcedureCode,
      headerId: data.headerId,
      headerCode: data.packageHeaderCode,
      status: data.insertStatus
    }
    if (this.selectedProcedureArray.length == 0) {
      this.selectedProcedureArray.push(selectedIteam);
    } else {
      if (isChecked) {
        let index = 0;
        let flag = false;
          this.selectedProcedureArray.forEach(element => {
            if (element.headerCode == data.packageHeaderCode) {
              this.selectedProcedureArray[index].status = 1;
              flag = true;
            }
            index++;
          });
          if(!flag){
            this.selectedProcedureArray.push(selectedIteam);
          }
      } else {
        if (data.insertStatus == 1) {
          let index = 0;
          this.selectedProcedureArray.forEach(element => {
            if (element.headerCode == data.packageHeaderCode) {
              this.selectedProcedureArray[index].status = 2;
            }
            index++;
          });
        } else {
          let index = 0;
          this.selectedProcedureArray.forEach(element => {
            if (element.headerCode == data.packageHeaderCode) {
              this.selectedProcedureArray.splice(index, 1);
            }
            index++;
          });
        }
      }
    }
  }


  submit() {
    if (this.selectedProcedureArray.length <= 1) {
      this.swal('Info', 'Please select at least One specialist.', 'info');
      return;
    }
    let procedurePackageBean = {
      actionCode: 3,
      userId: this.user.userId,
      procedureId: this.selectedProcedureArray[0].procedureId,
      headerId: this.selectedProcedureArray[0].headerId,
      procedureCode: this.selectedProcedureArray[0].procedureCode,
      packageHeaderCode: ""
    }
    let index = 0;
    this.selectedProcedureArray.forEach(element => {
      if (index == 0) {
        procedurePackageBean.packageHeaderCode = element.headerCode + "#" + element.headerId + "#" + element.status;
      } else {
        procedurePackageBean.packageHeaderCode = procedurePackageBean.packageHeaderCode + "~"
          + element.headerCode + "#" + element.headerId + "#" + element.status;
      }

      index++;
    });

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
        this.hospitalspecialityreportservice
          .submitTaggedProcedureDetails(procedurePackageBean)
          .subscribe((data: any) => {
            if (data.status == "success") {
              this.selectedProcedureArray = [];
              this.closeModal();
              this.swal('Success', 'Record Updated Succefully', 'success');
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

  showPreDoc1(text, index) {
    $('#proceduredescription' + index).text(text);
    $('#showMoreId6' + index).empty()
    $('#showMoreId7' + index).append('<div style="cursor: pointer; color: #1d89c9">Show Less</div>');
  }

  hidePreDoc1(text, index) {
    if (text.length > 30) {
      $('#proceduredescription' + index).text(text.substring(0, 30) + '...');
      $('#showMoreId7' + index).empty()
      $('#showMoreId6' + index).empty();
      $('#showMoreId6' + index).append('<span style="cursor: pointer; color: #1d89c9">Show More</span>');
    }
  }


  openModal() {
    this.modalService.open(this.packageModalId, { size: 'lg', backdrop: 'static', keyboard: false, ariaLabelledBy: 'modal-basic-title' }).result.then((result: any) => {
    }, (reason: any) => { });
  }

  closeModal() {
    this.currentProcedureId = "";
    this.procedureCode = "";
    this.procedureDescription = "";
    this.currentProcedureCode = "";
    this.modalService.dismissAll();
  }
}
