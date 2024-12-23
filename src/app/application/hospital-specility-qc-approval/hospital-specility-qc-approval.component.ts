import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HospitalPackageMappingService } from '../Services/hospital-package-mapping.service';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import { HeaderService } from '../header.service';
import { HospitalService } from '../Services/hospital.service';
import { QcadminServicesService } from '../Services/qcadmin-services.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TableUtil } from '../util/TableUtil';
import jsPDF from 'jspdf';
import { formatDate } from '@angular/common';
import autoTable from 'jspdf-autotable';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare let $: any;

@Component({
  selector: 'app-hospital-specility-qc-approval',
  templateUrl: './hospital-specility-qc-approval.component.html',
  styleUrls: ['./hospital-specility-qc-approval.component.scss']
})
export class HospitalSpecilityQcApprovalComponent implements OnInit {
  @ViewChild('specialitymodal') specialitymodal: ElementRef;
  user: any;
  stateList: any = [];
  districtList: any = [];
  txtsearchDate: any;
  currentPage: any;
  pageElement: any;
  showPegi: boolean;
  statecode: any;
  districtcode: any;
  buttonhide: boolean;
  // actionbuttonhide: boolean = false;
  hospitalname: any;
  hospitalcode: any;
  constructor(private modalService: NgbModal,
    private snoService: SnocreateserviceService,
    public headerService: HeaderService, private hospitaService: HospitalService,
    public route: Router, public qcadminserv: QcadminServicesService, private sessionService: SessionStorageService
  ) {

  }
  ngOnInit(): void {
    this.headerService.setTitle('Hospital Speciality Approval');
    this.user = this.sessionService.decryptSessionData("user");
    this.currentPage = 1;
    this.pageElement = 50;
    $('#specialitymodal').hide();
    this.getStateList();
    this.search();
  }

  openModal() {
    this.modalService.open(this.specialitymodal, { scrollable: true, size: 'xl', backdrop: 'static', keyboard: false, ariaLabelledBy: 'modal-basic-title' }).result.then((result: any) => {
    }, (reason: any) => { });
  }


  catList: any = [];
  categoryList: any = [];
  getCategoryList() {
    this.catList = [];
    let stateId = $('#stateId').val();
    this.snoService.getHospitalCategoryList().subscribe(
      (response) => {
        this.categoryList = response;
        console.log(this.categoryList);
        this.categoryList.forEach((element) => {
          if (stateId == 21) {
            if (
              element.categoryId == 1 ||
              element.categoryId == 2 ||
              element.categoryId == 3
            ) {
              this.catList.push(element);
            }
          } else {
            if (
              element.categoryId == 2 ||
              element.categoryId == 4 ||
              element.categoryId == 5 ||
              element.categoryId == 6
            ) {
              this.catList.push(element);
            }
          }
        });
        console.log(this.catList);
      },
      (error) => console.log(error)
    );
  }

  getStateList() {
    this.snoService.getStateList().subscribe(
      (response) => {
        this.stateList = response;
        this.getCategoryList();
      },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      }
    );
  }

  OnChangeState(id) {
    this.snoService.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = response;
      },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      }
    )
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  onReset() {
    window.location.reload();
  }
  detailsExistingcase: any = [];
  detailspendingcase: any = [];
  hospitalid: any
  recordexisting: any;
  clickaction(hospitalid: any, hospitalName: any, hospitalCode: any) {
    this.dataIdArray = [];
    this.hospitalid = hospitalid;
    this.detailsExistingcase = [];
    this.detailspendingcase = [];
    this.hospitalname = hospitalName;
    this.hospitalcode = hospitalCode;
    this.qcadminserv.getHospitalspecialityaDetailsExistingcase(this.hospitalid).subscribe((data: any) => {
      this.detailsExistingcase = data;
      this.recordexisting = this.detailsExistingcase.length
      // $('#specialitymodal').show();
      this.openModal();
      if (this.recordexisting >= 0 || this.recordexisting <= 0) {
        this.qcadminserv.getHospitaspecialitydetaislforpendingcase(this.hospitalid).subscribe((response: any) => {
          this.detailspendingcase = response;
          if (this.detailspendingcase.length > 0) {
            this.buttonhide = true;
          } else {
            this.buttonhide = false;
          }
        },
          (error) => {
            console.log(error);
            this.swal('', 'Something went wrong.', 'error');
          })
      } else {
        this.hospitalid = '';
      }
    },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      }
    );
  }
  modalClose() {
    // $('#specialitymodal').hide();
    this.modalService.dismissAll();
  }
  report: any = [];
  sno: any = {
    Slno: "",
    statename: "",
    districtname: "",
    hospitalcode: "",
    hospitalname: "",
    appliedon: "",
  };
  heading = [['Sl#', 'State Name', 'District Name', 'Hospital Code', 'Hospital Name', 'Applied On']];
  stateId: any = "All"
  stateName: any = "All"
  districtId: any = "";
  districtname: any = "All";
  downloadReport(type: any) {
    this.report = [];
    if (type == 'excel') {
      let claim: any;
      for (var i = 0; i < this.data.length; i++) {
        claim = this.data[i];
        this.sno = [];
        this.sno.Slno = i + 1;
        this.sno.statename = claim.statename;
        this.sno.districtname = claim.districtname;
        this.sno.hospitalcode = claim.hospitalCode;
        this.sno.hospitalname = claim.hospitalName;
        this.sno.appliedon = claim.appliedon;
        this.report.push(this.sno);
      }
      for (var i = 0; i < this.stateList.length; i++) {
        if (this.statecode == this.stateList[i].stateCode) {
          this.stateName = this.stateList[i].stateName;
        }
      }
      for (var i = 0; i < this.districtList.length; i++) {
        if (this.districtcode == this.districtList[i].districtcode) {
          this.districtname = this.districtList[i].districtname;
        }
      }
      let filter1 = [];
      filter1.push([['State Name:-', this.stateName]]);
      filter1.push([['District Name:-', this.districtname]]);
      TableUtil.exportListToExcelWithFilterforadmin(this.report, "Hospital Speciality Approval", this.heading, filter1);
    } else if (type == 'pdf') {
      if (this.data.length == 0) {
        this.swal('', 'No Data Found', 'info');
        return;
      }
      for (var i = 0; i < this.stateList.length; i++) {
        if (this.statecode == this.stateList[i].stateCode) {
          this.stateName = this.stateList[i].stateName;
        }
      }
      for (var i = 0; i < this.districtList.length; i++) {
        if (this.districtcode == this.districtList[i].districtcode) {
          this.districtname = this.districtList[i].districtname;
        }
      }
      let SlNo = 1;
      this.data.forEach(element => {
        let rowData = [];
        rowData.push(SlNo++);
        rowData.push(element.statename);
        rowData.push(element.districtname);
        rowData.push(element.hospitalCode);
        rowData.push(element.hospitalName);
        rowData.push(element.appliedon);
        this.report.push(rowData);
      });
      let doc = new jsPDF('l', 'mm', [238, 270]);
      doc.setFontSize(10);
      doc.text('Authority Name :-' + this.user.fullName + '(' + (this.user.userName) + ')', 5, 5);
      doc.text('State Name:-' + this.stateName, 5, 10);
      doc.text('District Name:-' + this.districtname, 5, 15);
      doc.text('Document Generate Date :-' + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en').toString(), 5, 20);
      doc.text('Hospital Speciality Approval', 100, 25);
      doc.setLineWidth(0.7);
      doc.line(100, 26, 148, 26);
      autoTable(doc, {
        head: this.heading, body: this.report, startY: 28, theme: 'grid',
        styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
        bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 30 },
          2: { cellWidth: 30 },
          3: { cellWidth: 30 },
          4: { cellWidth: 60 },
          5: { cellWidth: 50 },
        }
      })
      doc.save('Hospital_Speciality_Approval.pdf');
    }
  }
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  }
  dataIdArray: any = [];
  checkAllCheckBox(checked: boolean) {
    if (checked) {
      for (let i = 0; i < this.detailspendingcase.length; i++) {
        $('#' + this.detailspendingcase[i].specialityid).prop('checked', true);
        this.dataIdArray.push(this.detailspendingcase[i].specialityid);
      }
      // this.actionbuttonhide = true;
      this.dataIdArray = this.dataIdArray.filter(
        (value, index) => this.dataIdArray.indexOf(value) === index
      );
      this.show = false;
    } else {
      for (let i = 0; i < this.detailspendingcase.length; i++) {
        $('#' + this.detailspendingcase[i].specialityid).prop('checked', false);
        $('#hospitalTypeId' + this.detailspendingcase[i].specialityid).val('0');
      }
      this.dataIdArray = [];
      // this.actionbuttonhide = false;
      this.show = true;
    }
  }
  show: boolean = false;
  tdCheck(event: any, specialityid) {
    if (event.target.checked) {
      this.dataIdArray.push(specialityid);
      // this.actionbuttonhide = true;
    } else {
      for (let i = 0; i < this.dataIdArray.length; i++) {
        let store = this.dataIdArray[i].toString();
        let typeId = this.dataIdArray[i];
        if (store.includes('~')) {
          typeId = store.split('~')[0];
        }
        if (typeId == specialityid) {
          $('#hospitalTypeId' + specialityid).val('0');
          this.dataIdArray.splice(i, 1);
        }
      }
      // this.actionbuttonhide = true;
    }
    if (this.dataIdArray.length == this.detailspendingcase.length) {
      $('#allCheck').prop('checked', true);
    } else {
      $('#allCheck').prop('checked', false);
      // this.actionbuttonhide = false;
    }
    if (this.dataIdArray.length > 0) {
      this.show = true;
      // this.actionbuttonhide = true;
    } else {
      this.show = false;
      // this.actionbuttonhide = false;
    }
    this.dataIdArray = this.dataIdArray.filter(
      (value, index) => this.dataIdArray.indexOf(value) === index
    );
  }

  onSelectType(value, specialityId) {
    let flag: boolean = false
    for (let i = 0; i < this.dataIdArray.length; i++) {
      let store: string = this.dataIdArray[i].toString();
      let typeId = store;
      if (store.includes('~')) {
        typeId = store.split('~')[0];
        if (typeId == specialityId) {
          flag = true;
          this.dataIdArray[i] = typeId + "~" + value;
        }
      } else {
        if (this.dataIdArray[i] == specialityId) {
          flag = true;
          this.dataIdArray[i] += "~" + value;
        }
      }
    }
    if (!flag) {
      $('#hospitalTypeId' + specialityId).val('0');
      this.swal("Warning", "Please check the checkbox before adding respective speciality type.", "warning");
    }
  }

  onSubmitrecords(type: Number) {
    if (this.dataIdArray.length == 0) {
      this.swal("Warning", "Please select atleast one speciality.", "warning");
      $('#specialitymodal').show();
      return;
    }
    if (type == 1) {
      for (const element of this.dataIdArray) {
        if (!element.toString().includes('~')) {
          this.swal("Warning", "Please select the speciality type of respective checked records.", "warning");
          return;
        }
      }
    }
    if (type == 1) {
      Swal.fire({
        title: 'Are You Sure?',
        text: "You Want To Approve This Data!",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes,Submit It!'
      }).then((result) => {
        if (result.isConfirmed) {
          let object = {
            specialistid: this.dataIdArray,
            userid: this.user.userId,
            actiontype: 1
          }
          this.qcadminserv.getQcApproval(object).subscribe((data: any) => {
            if (data.status == 200) {
              Swal.fire({
                title: "Record Approved Successfully",
                icon: 'success',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'ok',
                allowOutsideClick: false
              }).then((result) => {
                if (result.isConfirmed) {
                  // window.location.reload();
                  this.modalClose();
                } else {
                  // window.location.reload();
                  this.modalClose();
                }
              }
              );
            } else if (data.status == 400) {
              this.swal("Error", "Record Already  Submitted", 'error');
              this.checkAllCheckBox(false);
              this.dataIdArray = []
            }
          },
            (error) => {
              console.log(error);
              this.swal('', 'Something went wrong.', 'error');
              this.checkAllCheckBox(false);
              this.dataIdArray = []
            }
          )
        }
      });
    } else if (type == 2) {
      Swal.fire({
        title: 'Are You Sure?',
        text: "You Want To Reject This Data!",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes,Reject It!'
      }).then((result) => {
        if (result.isConfirmed) {
          let object = {
            specialistid: this.dataIdArray,
            userid: this.user.userId,
            actiontype: 2
          }
          this.qcadminserv.getQcApproval(object).subscribe((data: any) => {
            if (data.status == 200) {
              Swal.fire({
                title: "Record Rejected Successfully",
                icon: 'success',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'ok',
                allowOutsideClick: false
              }).then((result) => {
                if (result.isConfirmed) {
                  // window.location.reload();
                  this.modalClose();
                } else {
                  // window.location.reload();
                  this.modalClose();
                }
              }
              );
            } else if (data.status == 400) {
              this.swal("Error", "Record Already  Submitted", 'error');
              this.checkAllCheckBox(false);
              this.dataIdArray = []
            }
          },
            (error) => {
              console.log(error);
              this.swal('', 'Something went wrong.', 'error');
              this.checkAllCheckBox(false);
              this.dataIdArray = []
            }
          )
        }
      });
    }
  }
  statecodeval: any;
  districtcodeval: any;
  data: any = [];
  record: any;
  search() {
    this.statecode = $('#stateId').val();
    this.districtcode = $('#districtId').val();
    if (this.statecode == null || this.statecode == undefined || this.statecode == '') {
      this.statecodeval = '';
    } else {
      this.statecodeval = this.statecode;
    }
    if (this.districtcode == null || this.districtcode == undefined || this.districtcode == '') {
      this.districtcodeval = '';
    } else {
      this.districtcodeval = this.districtcode
    }
    this.qcadminserv.getSerachdata(this.statecodeval, this.districtcodeval, this.user.userId).subscribe((data: any) => {
      this.data = data
      this.record = this.data.length
      if (this.record > 0) {
        this.showPegi = true;
      } else {
        this.showPegi = false;
      }
    },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      }
    );
  }
}
