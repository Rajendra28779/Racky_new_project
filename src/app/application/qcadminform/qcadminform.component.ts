import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HeaderService } from '../header.service';
import { NotificationService } from '../Services/notification.service';
import { QcadminServicesService } from '../Services/qcadmin-services.service';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import { HospitalWiseClaimReportServiceService } from '../Services/hospital-wise-claim-report-service.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { DatePipe } from '@angular/common';
declare let $: any;

@Component({
  selector: 'app-qcadminform',
  templateUrl: './qcadminform.component.html',
  styleUrls: ['./qcadminform.component.scss']
})
export class QcadminformComponent implements OnInit {
  status: any;
  mouStatus: any;
  maxChars = 100;
  user: any;
  user1: any;
  stateCd: any = '';
  public stateList: any = [];
  public catList: any = [];
  public districtList: any = [];
  public hospitalList: any = [];
  public Listbyhoscode: any;
  keyword2 = "hospitalName";
  hospitalId: any = "";
  hospitalname: any = "ALL";
  data: any;
  hosCValidDateFrom: any;
  hosCValidDateTo: any;
  mouStartDt: any;
  mouEndDt: any;
  isSaveData: boolean = true;
  ishidemandatory: boolean = true;
  mailformat = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
  empanelmentstatus: any;
  cpdApprovalRequired: any;
  preauthapprovalrequired: any;
  fileToUpload?: File;
  fileToUpload2?: File;
  flag2toUpload2?: File;
  flag3toUpload2?: File;
  flag: any = false;
  flag2: any = false;
  flag3: any = false;
  documentType: any;
  docpath: any;
  isBlockActive: any;
  certification: any;
  validateFrom1: any;
  validateFrom2: any;
  hospitalregistration: any;
  validateFrom3: any;
  validateFrom4: any;
  updateEmpanelHospitalData = {
    hospitalId: "",
    hospitalCode: "",
    hospitalName: "",
    stateCode: "",
    districtCode: "",
    mobile: "",
    emailId: "",
    status: "",
    hospitalCategoryid: "",
    hosCValidDateFrom: "",
    hosCValidDateTo: "",
    mou: "",
    mouStartDt: "",
    mouEndDt: "",
    mouStatus: "",
    updatedby: "",
    updateon: "",
    empanelmentstatus: "",
    isBlockActive: "",
    cpdApprovalRequired: "",
    preauthapprovalrequired: "",
    certification: "",
    validateFrom1: "",
    validateFrom2: "",
    hospitalregistration: "",
    validateFrom3: "",
    validateFrom4: "",
  };
  previousuploadedfiredistingusher: any
  previousuploadedclinical: any
  mouDocUpload: any
  constructor(public headerService: HeaderService, private route: Router, public qcadminserv: QcadminServicesService, private snoService: SnocreateserviceService, private hospitalwiseclaimreportserv: HospitalWiseClaimReportServiceService, private notificationservice: NotificationService, private sessionService: SessionStorageService) { }
  HospitalType = new FormGroup({
    hospitalname: new FormControl(''),
    hospitalCode: new FormControl(''),
    mobile: new FormControl(''),
    emailId: new FormControl(''),
    stateId: new FormControl(''),
    districtId: new FormControl(''),
    hospitalCategoryid: new FormControl(''),
    hosCValidDateFrom: new FormControl(''),
    hosCValidDateTo: new FormControl(''),
    mou: new FormControl(''),
    mouStartDt: new FormControl(''),
    mouEndDt: new FormControl(''),
    mouStatus: new FormControl(''),
    empanelmentstatus: new FormControl(''),
    isBlockActive: new FormControl(''),
    preauthapprovalrequired: new FormControl(''),
    cpdApprovalRequired: new FormControl(''),

    certification: new FormControl(''),
    validateFrom1: new FormControl(''),
    validateFrom2: new FormControl(''),
    hospitalregistration: new FormControl(''),
    validateFrom3: new FormControl(''),
    validateFrom4: new FormControl(''),
  });

  ngOnInit(): void {
    this.headerService.setTitle('Hospital MOU Update');
    this.user = this.sessionService.decryptSessionData("user");
    $('.selectpicker').selectpicker();
    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      daysOfWeekDisabled: ['', 7],
    });
    $('.timepicker').datetimepicker({
      format: 'LT',
      daysOfWeekDisabled: ['', 7],
    });
    $('.datetimepicker').datetimepicker({
      format: 'DD-MMM-YYYY LT',
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
    var frstDay = date1 + "-" + month + "-" + year;
    this.getStateList();
    this.getCategoryList();
    this.getHospitalList();
    this.ishidemandatory = true;
  }

  getCategoryList() {
    this.snoService.getHospitalCategoryList().subscribe(
      (response) => {
        this.catList = response;
      },
      (error) => console.log(error)
    );
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
    this.stateCd = id;
    $('#districtId').val("");
    this.HospitalType.controls['districtId'].setValue("");
    localStorage.setItem("stateCode", id);
    this.snoService.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = response;
      },
      (error) => console.log(error)
    );
  }

  //hospital list in first drop down
  getHospitalList() {
    this.qcadminserv.getHospitalList().subscribe(
      (response) => {
        this.hospitalList = response;
      },
      (error) => console.log(error)
    )
  }

  //get all data bind in update page by hospital code
  getDatabyHospitalCode() {
    this.qcadminserv.getDatabyhospitalCode(this.hospitalId).subscribe(
      (response) => {
        this.Listbyhoscode = response;
        console.log("get data by hospital id ");
        console.log(this.Listbyhoscode);
        this.updateEmpanelHospitalData.hospitalCode = this.Listbyhoscode.hospitalCode;
        this.updateEmpanelHospitalData.hospitalId = this.Listbyhoscode.hospitalId;
        this.updateEmpanelHospitalData.mobile = this.Listbyhoscode.mobile;
        this.updateEmpanelHospitalData.emailId = this.Listbyhoscode.emailId;
        this.updateEmpanelHospitalData.stateCode = this.Listbyhoscode.districtcode.statecode.stateCode;
        this.OnChangeState(this.updateEmpanelHospitalData.stateCode);
        this.updateEmpanelHospitalData.districtCode = this.Listbyhoscode.districtcode.districtcode;
        this.updateEmpanelHospitalData.hospitalCategoryid = this.Listbyhoscode.hospitalCategoryid;
        this.updateEmpanelHospitalData.hosCValidDateFrom = this.Listbyhoscode.hosCValidDateFrom;
        this.updateEmpanelHospitalData.hosCValidDateTo = this.Listbyhoscode.hosCValidDateTo;
        this.updateEmpanelHospitalData.mou = this.Listbyhoscode.mou;
        this.updateEmpanelHospitalData.mouStartDt = this.Listbyhoscode.mouStartDt;
        this.updateEmpanelHospitalData.mouEndDt = this.Listbyhoscode.mouEndDt;
        this.updateEmpanelHospitalData.status = this.Listbyhoscode.status;
        this.status = this.Listbyhoscode.status;
        this.updateEmpanelHospitalData.mouStatus = this.Listbyhoscode.mouStatus;
        this.mouStatus = this.Listbyhoscode.mouStatus;
        this.updateEmpanelHospitalData.empanelmentstatus = this.Listbyhoscode.empanelmentstatus;
        this.empanelmentstatus = this.Listbyhoscode.empanelmentstatus;
        this.isBlockActive = this.Listbyhoscode.isBlockActive;
        this.updateEmpanelHospitalData.preauthapprovalrequired = this.Listbyhoscode.preauthapprovalrequired;
        this.preauthapprovalrequired = this.Listbyhoscode.preauthapprovalrequired;
        this.updateEmpanelHospitalData.cpdApprovalRequired = this.Listbyhoscode.cpdApprovalRequired;
        this.cpdApprovalRequired = this.Listbyhoscode.cpdApprovalRequired;
        this.updateEmpanelHospitalData.certification = this.Listbyhoscode.certification;
        this.updateEmpanelHospitalData.validateFrom1 = this.Dateconversion(this.Listbyhoscode.validateFrom1);
        this.updateEmpanelHospitalData.validateFrom2 = this.Dateconversion(this.Listbyhoscode.validateFrom2);
        this.updateEmpanelHospitalData.hospitalregistration = this.Listbyhoscode.hospitalregistration;
        this.updateEmpanelHospitalData.validateFrom3 = this.Dateconversion(this.Listbyhoscode.validateFrom3);
        this.updateEmpanelHospitalData.validateFrom4 = this.Dateconversion(this.Listbyhoscode.validateFrom4);
        this.previousuploadedfiredistingusher = this.Listbyhoscode.certificationRegistration
        this.previousuploadedclinical = this.Listbyhoscode.documentRegistration
        this.mouDocUpload = this.Listbyhoscode.mouDocUpload
        this.firedictriguesUpload = this.previousuploadedfiredistingusher
        this.clicnicalUpload = this.previousuploadedclinical
        if (Number(this.Listbyhoscode.hospitalCategoryid) == 2 || Number(this.Listbyhoscode.hospitalCategoryid) == 6) {
          this.ishidemandatory = false;
        }
      },
      (error) => console.log(error)
    )
  }

  selectEvent2(item) {
    this.hospitalId = item.hospitalCode;
    this.hospitalname = item.hospitalName;
    this.getDatabyHospitalCode();
    this.isSaveData = true;
  }

  clearEvent2() {
    this.hospitalId = '';
    this.isSaveData = false;
    this.districtList = [];
    $("#hospitalCode").val("");
    $("#mobile").val("");
    $("#emailId").val("");
    $("#districtId").val("");
    $("#hospitalCategory").val("");
    $("#formdate").val("");
    $("#todate").val("");
    $("#moudescription").val("");
    $("#formdate1").val("");
    $("#todate1").val("");
    this.updateEmpanelHospitalData.stateCode = "";
    this.updateEmpanelHospitalData.districtCode = "";
    this.ishidemandatory = true;
    this.updateEmpanelHospitalData.mouStartDt = "";
    this.updateEmpanelHospitalData.mouEndDt = "";
    this.updateEmpanelHospitalData.hospitalCategoryid = "";
    this.updateEmpanelHospitalData.hosCValidDateFrom = "";
    this.updateEmpanelHospitalData.hosCValidDateTo = "";
    this.updateEmpanelHospitalData.mou = "";
    this.updateEmpanelHospitalData.certification = "";
    this.updateEmpanelHospitalData.validateFrom1 = "";
    this.updateEmpanelHospitalData.validateFrom2 = "";
    this.updateEmpanelHospitalData.hospitalregistration = "";
    this.updateEmpanelHospitalData.validateFrom3 = "";
    this.updateEmpanelHospitalData.validateFrom4 = "";
    this.previousuploadedfiredistingusher = "";
    this.previousuploadedclinical = "";
  }

  keyfunction1(e) {
    if (e.value[0] == " ") {
      $('#hospitalName').val('');
    }
    if (e.value[0] == " ") {
      $('#emailId').val('');
    }
  }


  yes($event: any) {
    this.empanelmentstatus = 0;
  }

  no($event: any) {
    this.empanelmentstatus = 1;
  }

  yes1($event: any) {
    this.mouStatus = 0;
  }

  no1($event: any) {
    this.mouStatus = 1;
  }

  yes3($event: any) {
    this.isBlockActive = 0;
    //this.status = 0;

  }

  no3($event: any) {
    this.isBlockActive = 1;
  }

  preauthcheck: boolean = false;
  preflag: boolean = true;
  update() {
    this.user1 = this.sessionService.decryptSessionData("user");
    let hosCValidDateFrom = $('#formdate').val();
    let hosCValidDateTo = $('#todate').val();
    let mouStartDt = $('#formdate1').val();
    let mouEndDt = $('#todate1').val();
    let hospitalcat = $('#hospitalCategory').val();
    let preauthapprovalrequired = $('#preauthapprovalrequired').val();
    let certification = $('#certification').val();
    let formdate3 = $('#formdate3').val();
    let formdate4 = $('#formdate4').val();
    let hospitalregistration = $('#hospitalregistration').val();
    let formdate5 = $('#formdate5').val();
    let formdate6 = $('#formdate6').val();
    if (Number(this.updateEmpanelHospitalData.stateCode) != 21) {
      if (preauthapprovalrequired == 0) {
        this.swal("Info", "Outside Odisha Hospital Can not under NO Exception", 'info');
        $("#preauthapprovalrequired").focus();
        return;
      }
    }

    let check;
    if (hospitalcat == 2 || hospitalcat == 6) {
      check = false;
    } else {
      check = true;
    }

    if (this.hospitalId == null || this.hospitalId == "" || this.hospitalId == undefined) {
      $(this.hospitalId).focus();
      this.swal("Info", "Please Select Hospital Name", 'info');
      return;
    }

    if (check) {
      if (hosCValidDateFrom == null || hosCValidDateFrom == "" || hosCValidDateFrom == undefined) {
        $("#formdate").focus();
        this.swal("Info", "Please enter Hospital Category Valid Date From", 'info');
        return;
      }

      if (hosCValidDateTo == null || hosCValidDateTo == "" || hosCValidDateTo == undefined) {
        $("#formdate").focus();
        this.swal("Info", "Please enter Hospital Category Valid Date To", 'info');
        return;
      }

      if (Date.parse(hosCValidDateFrom) > Date.parse(hosCValidDateTo)) {
        this.swal('Warning', ' From Date should be less Than To Date', 'error');
        return;
      }
    }

    if (mouStartDt == null || mouStartDt == "" || mouStartDt == undefined) {
      $("#formdate1").focus();
      this.swal("Info", "Please enter MOU Start Date", 'info');
      return;
    }

    if (mouEndDt == null || mouEndDt == "" || mouEndDt == undefined) {
      $("#todate1").focus();
      this.swal("Info", "Please enter MOU End Date", 'info');
      return;
    }

    if (Date.parse(mouStartDt) > Date.parse(mouEndDt)) {
      this.swal('Warning', ' Start Date should be less Than End Date', 'error');
      return;
    }

    if (certification == null || certification == "" || certification == undefined) {
      $("#certification").focus();
      this.swal("Info", "Please enter Certification Number", 'info');
      return;
    }

    if (formdate3 == null || formdate3 == "" || formdate3 == undefined) {
      $("#formdate3").focus();
      this.swal("Info", "Please enter  Certification Number Validate From", 'info');
      return;
    }

    if (formdate4 == null || formdate4 == "" || formdate4 == undefined) {
      $("#formdate4").focus();
      this.swal("Info", "Please enter  Certification Number Validate To", 'info');
      return;
    }

    if (Date.parse(formdate3) > Date.parse(formdate4)) {
      this.swal('Warning', ' Certification Number Validate From Date should be less Than  Certification Number Validate To Date', 'error');
      return;
    }

    if (this.firedictriguesUpload == null || this.firedictriguesUpload == undefined) {
      this.swal("Info", "Please Fire Distinguisher Upload Document", 'info');
      return;
    }

    if (hospitalregistration == null || hospitalregistration == "" || hospitalregistration == undefined) {
      $("#hospitalregistration").focus();
      this.swal("Info", "Please enter Hospital Registration Case No.", 'info');
      return;
    }

    if (formdate5 == null || formdate5 == "" || formdate5 == undefined) {
      $("#formdate5").focus();
      this.swal("Info", "Please enter  Hospital Registration Case No. Validate From", 'info');
      return;
    }

    if (formdate6 == null || formdate6 == "" || formdate6 == undefined) {
      $("#formdate6").focus();
      this.swal("Info", "Please enter  Hospital Registration Case No. Validate To", 'info');
      return;
    }
    if (Date.parse(formdate5) > Date.parse(formdate6)) {
      this.swal('Warning', ' Hospital Registration Case No. Validate From Date should be less Than  Hospital Registration Case No. Validate To Date', 'error');
      return;
    }

    if (this.clicnicalUpload == null || this.clicnicalUpload == undefined) {
      this.swal("Info", "Please Clinical Certificate  Upload Document", 'info');
      return;
    }


    Swal.fire({
      title: 'Are you sure?',
      text: "You want to Update this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Update it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.updateEmpanelHospitalData.hospitalCode = $('#hospitalCode').val().toString();
        this.updateEmpanelHospitalData.mobile = $('#mobile').val().toString();
        this.updateEmpanelHospitalData.emailId = $('#emailId').val().toString();
        this.updateEmpanelHospitalData.stateCode = $('#stateId').val().toString();
        this.updateEmpanelHospitalData.districtCode = $('#districtId').val().toString();
        this.updateEmpanelHospitalData.hospitalCategoryid = $('#hospitalCategory').val().toString();
        this.updateEmpanelHospitalData.hosCValidDateFrom = $('#formdate').val();
        this.updateEmpanelHospitalData.hosCValidDateTo = $('#todate').val();
        if (this.updateEmpanelHospitalData.hosCValidDateFrom != "") {
          this.updateEmpanelHospitalData.hosCValidDateFrom = this.updateEmpanelHospitalData.hosCValidDateFrom;
        }
        else {
          this.updateEmpanelHospitalData.hosCValidDateFrom = null;
        }
        if (this.updateEmpanelHospitalData.hosCValidDateTo != "") {
          this.updateEmpanelHospitalData.hosCValidDateTo = this.updateEmpanelHospitalData.hosCValidDateTo;
        }
        else {
          this.updateEmpanelHospitalData.hosCValidDateTo = null;
        }
        this.updateEmpanelHospitalData.mou = $('#moudescription').val().toString();
        this.updateEmpanelHospitalData.mouStartDt = $('#formdate1').val();
        this.updateEmpanelHospitalData.mouEndDt = $('#todate1').val();
        this.updateEmpanelHospitalData.empanelmentstatus = this.empanelmentstatus;
        this.updateEmpanelHospitalData.mouStatus = this.mouStatus;
        this.updateEmpanelHospitalData.updatedby = this.user1.userId;
        this.updateEmpanelHospitalData.isBlockActive = this.isBlockActive;
        this.updateEmpanelHospitalData.preauthapprovalrequired = $('#preauthapprovalrequired').val().toString();
        this.updateEmpanelHospitalData.cpdApprovalRequired = $('#cpdApprovalRequired').val().toString();
        this.updateEmpanelHospitalData.certification = $('#certification').val();
        this.updateEmpanelHospitalData.validateFrom1 = $('#formdate3').val();
        this.updateEmpanelHospitalData.validateFrom2 = $('#formdate4').val();
        this.updateEmpanelHospitalData.hospitalregistration = $('#hospitalregistration').val();
        this.updateEmpanelHospitalData.validateFrom3 = $('#formdate5').val();
        this.updateEmpanelHospitalData.validateFrom4 = $('#formdate6').val();
        let object = {
          hospitalCode: this.updateEmpanelHospitalData.hospitalCode,
          mobile: this.updateEmpanelHospitalData.mobile,
          emailId: this.updateEmpanelHospitalData.emailId,
          stateCode: this.updateEmpanelHospitalData.stateCode,
          districtCode: this.updateEmpanelHospitalData.districtCode,
          hospitalCategoryid: this.updateEmpanelHospitalData.hospitalCategoryid,
          hosCValidDateFrom: this.updateEmpanelHospitalData.hosCValidDateFrom,
          hosCValidDateTo: this.updateEmpanelHospitalData.hosCValidDateTo,
          mou: this.updateEmpanelHospitalData.mou,
          mouStartDt: this.updateEmpanelHospitalData.mouStartDt,
          mouEndDt: this.updateEmpanelHospitalData.mouEndDt,
          mouStatus: this.updateEmpanelHospitalData.mouStatus,
          empanelmentstatus: 0,
          isBlockActive: 0,
          updatedby: this.updateEmpanelHospitalData.updatedby,
          preauthapprovalrequired: this.updateEmpanelHospitalData.preauthapprovalrequired,
          cpdApprovalRequired: this.updateEmpanelHospitalData.cpdApprovalRequired,
          certification: this.updateEmpanelHospitalData.certification,
          validateFrom1: this.updateEmpanelHospitalData.validateFrom1,
          validateFrom2: this.updateEmpanelHospitalData.validateFrom2,
          hospitalregistration: this.updateEmpanelHospitalData.hospitalregistration,
          validateFrom3: this.updateEmpanelHospitalData.validateFrom3,
          validateFrom4: this.updateEmpanelHospitalData.validateFrom4,
        }
        this.qcadminserv.updateEmpanelhospData(object, this.fileToUpload, this.firedictriguesUpload, this.clicnicalUpload, this.previousuploadedfiredistingusher, this.previousuploadedclinical).subscribe((response: any) => {
          console.log(response);
          this.data = response;
          if (this.data.status == "Success") {
            this.swal('Success', this.data.message, 'success');
            this.route.navigate(['/application/shasqcadminformview']);
          } else if (this.data.status == "Failed") {
            this.swal('Failed', this.data.message, 'error');
          } else if (this.data.status == "error") {
            this.swal('Failed', this.data.message, 'error');
          }
          else {
            this.swal("Error", "Something went wrong", 'error');
          }
        })
      }
    })
  }
  showdoj: Boolean = false
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }


  handleFileInput(event: any) {
    this.flag = false;
    this.fileToUpload2 = event.target.files[0];
    if (this.fileToUpload2 != null || this.fileToUpload2 != undefined) {
      if (Math.round(this.fileToUpload2.size / 1024) >= 8192) {
        this.swal('Warning', ' Please Provide Document Size Less than 8MB', 'warning');
        $('#notficationdoc').val('');
        this.fileToUpload = event.target.files[0];
        this.flag = false;
      } else {
        this.fileToUpload = event.target.files[0];
        this.flag = true;
      }
      console.log(this.fileToUpload);
    } else {

    }
  }


  firedictriguesUpload?: File;
  handleFileInput2(event: any) {
    this.flag2 = false;
    this.flag2toUpload2 = event.target.files[0];
    if (this.flag2toUpload2 != null || this.flag2toUpload2 != undefined) {
      if (Math.round(this.flag2toUpload2.size / 1024) >= 8192) {
        this.swal('Warning', ' Please Provide Document Size Less than 8MB', 'warning');
        $('#notficationdoc').val('');
        this.flag2 = false;
      } else {
        this.firedictriguesUpload = event.target.files[0];
        this.flag2 = true;
      }
      console.log(this.firedictriguesUpload);
    } else {

    }
  }

  clicnicalUpload?: File;
  handleFileInput3(event: any) {
    this.flag3 = false;
    this.flag3toUpload2 = event.target.files[0];
    if (this.flag3toUpload2 != null || this.flag3toUpload2 != undefined) {
      if (Math.round(this.flag3toUpload2.size / 1024) >= 8192) {
        this.swal('Warning', ' Please Provide Document Size Less than 8MB', 'warning');
        $('#notficationdoc').val('');
        this.flag3 = false;
      } else {
        this.clicnicalUpload = event.target.files[0];
        this.flag3 = true;
      }
      console.log(this.clicnicalUpload);
    } else {

    }
  }

  downloadfiletreatmentbill(event: any, fileName: any) {
    console.log('file: ' + fileName);
    if (this.flag == false) {
      if (this.user) {
        let target = event.target;
        if (
          target.nodeName == 'A' ||
          target.nodeName == 'a' ||
          target.nodeName == 'IMG' ||
          target.nodeName == 'img' ||
          target.nodeName == 'I' ||
          target.nodeName == 'i'
        ) {
          target = $(target);
          let anchor = target.parent();
          anchor = anchor.get(0);

          if (fileName != null && fileName != '' && fileName != undefined) {
            let img = this.notificationservice.downloadFile(fileName);
            window.open(img, '_blank');
          } else {
            this.swal('Info', 'Please Select File', 'info');
          }
        }
      } else {
        this.swal('Info', 'Please Select File', 'info');
      }
    } else {
      if (this.fileToUpload) {
        const file: File | null = this.fileToUpload;
        if (file) {
          this.documentType = file.type;
          const blob = new Blob([file], { type: this.documentType });
          const url = window.URL.createObjectURL(blob);
          window.open(url);
        }
      } else {
        this.swal('Info', 'Please Select File', 'info');
      }
    }
  }

  resetVal() {
    window.location.reload();
    this.isSaveData = false;
    this.ishidemandatory = true;
  }

  keyPress(event: KeyboardEvent) {
    const pattern = /^[A-Za-z0-9.,-_ \\s]+$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  validateEmail() {
    let emailId = $("#emailId").val().toString();
    if (!emailId.match(this.mailformat)) {
      $("#emailId").focus();
      this.swal("Info", "Please Provide Valid Email Id", 'info');
      return;
    }
  }

  getId(val: any) {
    if (Number(val.target.value) == 2 || Number(val.target.value) == 6) {
      this.ishidemandatory = false;
    }
    if (Number(val.target.value) == 1 || Number(val.target.value) == 3 || Number(val.target.value) == 4 || Number(val.target.value) == 3) {
      this.ishidemandatory = true;
    }
  }

  getpreauth(val: any) {
  }



  SeedownloadfiletreatFireDistinguisher(event: any, fileName: any, flag: any, subFolder: any) {
    console.log('file: ' + fileName);
    if (this.flag2 == false) {
      if (this.user) {
        let target = event.target;
        if (
          target.nodeName == 'A' ||
          target.nodeName == 'a' ||
          target.nodeName == 'IMG' ||
          target.nodeName == 'img' ||
          target.nodeName == 'I' ||
          target.nodeName == 'i'
        ) {
          target = $(target);
          let anchor = target.parent();
          anchor = anchor.get(0);

          if (fileName != null && fileName != '' && fileName != undefined) {
            let img = this.notificationservice.downloadFileSeedownloadfiletreatFireDistinguisher(fileName, flag, subFolder);
            window.open(img, '_blank');
          } else {
            this.swal('Info', 'Please Select File', 'info');
          }
        }
      } else {
        this.swal('Info', 'Please Select File', 'info');
      }
    } else {
      if (this.firedictriguesUpload) {
        const file: File | null = this.firedictriguesUpload;
        if (file) {
          this.documentType = file.type;
          const blob = new Blob([file], { type: this.documentType });
          const url = window.URL.createObjectURL(blob);
          window.open(url);
        }
      } else {
        this.swal('Info', 'Please Select File', 'info');
      }
    }
  }


  SeeClinicalCertificate(event: any, fileName: any, flag: any, subFolder: any) {
    console.log('file: ' + fileName);
    if (this.flag3 == false) {
      if (this.user) {
        let target = event.target;
        if (
          target.nodeName == 'A' ||
          target.nodeName == 'a' ||
          target.nodeName == 'IMG' ||
          target.nodeName == 'img' ||
          target.nodeName == 'I' ||
          target.nodeName == 'i'
        ) {
          target = $(target);
          let anchor = target.parent();
          anchor = anchor.get(0);

          if (fileName != null && fileName != '' && fileName != undefined) {
            let img = this.notificationservice.downloadFileSeedownloadfiletreatFireDistinguisher(fileName, flag, subFolder);
            window.open(img, '_blank');
          } else {
            this.swal('Info', 'Please Select File', 'info');
          }
        }
      } else {
        this.swal('Info', 'Please Select File', 'info');
      }
    } else {
      if (this.clicnicalUpload) {
        const file: File | null = this.clicnicalUpload;
        if (file) {
          this.documentType = file.type;
          const blob = new Blob([file], { type: this.documentType });
          const url = window.URL.createObjectURL(blob);
          window.open(url);
        }
      } else {
        this.swal('Info', 'Please Select File', 'info');
      }
    }
  }

  Dateconversion(date) {
    var datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'dd-MMM-yyyy');
  }
}
