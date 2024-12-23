import { Component, OnInit } from '@angular/core';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import { UnprocessedclaimService } from '../Services/unprocessedclaim.service';
import { HeaderService } from '../header.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TableUtil } from '../util/TableUtil';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { DatePipe, formatDate } from '@angular/common';
import { environment } from 'src/environments/environment';
import { LoginService } from 'src/app/services/shared-services/login.service';
import { HospitalService } from '../Services/hospital.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-runsnawiseunprocessed',
  templateUrl: './runsnawiseunprocessed.component.html',
  styleUrls: ['./runsnawiseunprocessed.component.scss']
})
export class RunsnawiseunprocessedComponent implements OnInit {
  keyword: any = 'fullName';
  stateList: any;
  districtList: any = []
  hospitalList: any = [];
  selectedItems: any = [];
  data1: any
  days: number;
  actionId: any = '';
  months: string;
  year: number;
  responseData: any;
  showPegi: boolean = false;
  record: any;
  claimlist: any = [];
  totalClaimCount: any;
  claimBy: string;
  snoclaimlist: any = [];
  snoUserId: any;
  snaname: any;
  public snoList: any = [];
  paymentList: any = [];
  pageElement: any;
  currentPage: any;
  txtsearchDate: any;
  user: any;
  state: any = "";
  dis: any = "";
  hospital: any = "";
  snolist: any = "";
  statename: any = "ALL";
  districtName: any = "ALL";
  hospitalname: any = "ALL";
  snoname: any;
  snanamedata: any;
  readonlySNA: boolean = false;
  readonlyAdmin: boolean = true;
  eventName: any;
  userDetails: any;
  timedata: any;

  constructor(private snoService: SnocreateserviceService, private hospitalService: HospitalService, public headerService: HeaderService,
    private unprocessedService: UnprocessedclaimService, public route: Router, private snoConfigService: SnocreateserviceService, private service: LoginService, private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    // this.user = JSON.parse(sessionStorage.getItem("user"))
    this.user = this.sessionService.decryptSessionData("user");
    this.currentPage = 1;
    this.pageElement = 100;
    this.headerService.setTitle('Run SNA Wise Unprocessed Claim');
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
      format: 'DD-MMM-YYYY LT',
      daysOfWeekDisabled: ['', 7],
    });

    let month: any
    var date = new Date();
    let year = date.getFullYear();
    let date1 = '01';
    if (date.getMonth() == 0) {
      year = year - 1;
      month = 11;
    } else {
      month = date.getMonth() - 1;
    }
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
    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr("placeholder", "From Date *");
    $('input[name="toDate"]').attr("placeholder", "To Date *");
    this.timedata = 60;
    if (this.user.groupId == 4) {
      this.snoUserId = this.user.userId;
      this.snanamedata = this.user.fullName;
      this.readonlySNA = true;
      this.readonlyAdmin = false;
    }
    this.getSNOList();
    this.getStateList();
    let datee = new Date();
    var today = new Date(datee.getFullYear(), datee.getMonth(), datee.getDate() + 1);
    $('.selectpicker').selectpicker();
    $('.datepickered').datetimepicker({
      format: 'DD-MMM-YYYY',
      minDate: today,
      daysOfWeekDisabled: ['', 7],
    });
    $('.timepicker').datetimepicker({
      format: 'LT',
      daysOfWeekDisabled: ['', 7],
    });
    $('.datetimepicker').datetimepicker({
      format: 'YYYY-MM-DD LT',
      daysOfWeekDisabled: ['', 7],
    });
  }
  getMonthFrom(month) {
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
    return month;
  }
  getStateList() {
    this.snoService.getStateList().subscribe(
      (response) => {
        this.stateList = response;
      },
      (error) => console.log(error)
    )
  }
  OnChangeState(id) {
    $("#districtId").val("");
    this.selectedItems = [];
    localStorage.setItem("stateCode", id);
    this.snoService.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = response;
      },
      (error) => console.log(error)
    )
  }
  OnChangeDistrict(id) {
    this.selectedItems = [];
    var stateCode = localStorage.getItem("stateCode");
    this.snoService.getHospitalbyDistrictId(id, stateCode).subscribe(
      (response) => {
        this.hospitalList = response;
      },
      (error) => console.log(error)
    )
  }
  getSNOList() {
    this.snoConfigService.getSNODetails().subscribe(
      (response) => {
        this.snoList = response;
      },
      (error) => console.log(error)
    )
  }
  ResetField() {
    window.location.reload();
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  clearEvent() {
    this.snoUserId = '';
  }
  selectEvent(item) {
    this.snoUserId = item.userId;
    this.snaname = item.fullName;
  }

  formdate: any;
  toDate: any;
  data: any;
  sonid: any;
  size: any;
  searchtype: any;
  Search() {
    this.show = false;
    this.formdate = $('#datepicker1').val();
    this.toDate = $('#datepicker2').val();
    let state = $('#stateId').val();
    let dist = $('#districtId').val();
    let hospital = $('#hospital').val();
    this.sonid = this.snoUserId;
    this.eventName = $('#searchtype').val();
    this.searchtype = $('#search').val();
    const fromDate1 = this.GetDate(this.formdate);
    const todate1 = this.GetDate(this.toDate);
    let diffTime = Math.abs(todate1.getTime() - fromDate1.getTime());
    this.days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (this.formdate == '' || this.formdate == null || this.formdate == undefined) {
      this.swal('', 'From Date should not be blank', 'error');
      return;
    }
    if (this.toDate == '' || this.toDate == null || this.toDate == undefined) {
      this.swal('', 'To Date should not be blank', 'error');
      return;
    }
    if (Date.parse(this.formdate) > Date.parse(this.toDate)) {
      this.swal('', ' From Date should be less than To Date', 'error');
      return;
    }
    if (this.sonid == '' || this.sonid == null || this.sonid == undefined) {
      this.swal('', 'SNA Doctor Name should not be blank', 'error');
      return;
    }
    if (this.eventName == '' || this.eventName == null || this.eventName == undefined) {
      this.swal('', 'Please Select Search type', 'error');
      return;
    }
    if (this.days > 30) {
      if (this.searchtype === '0') {
        this.swal('', ' Maximum 30 days Allow', 'error');
        return;
      }
    }
    this.data = {
      "fromDate": this.formdate,
      "toDate": this.toDate,
      "stateCode": state,
      "districtCode": dist,
      "hospitalCode": hospital,
      "snoid": this.sonid,
      "searchby": this.eventName,
      "searchtype": this.searchtype
    }
    Swal.fire({
      title: 'Are You Sure?',
      text: "You want to proceed for unprocess in this month",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.unprocessedService.runsnawiseunprocessed(this.data).subscribe(
          (response: any) => {
            this.responseData = response;
            if (this.responseData.status == 'success') {
              this.paymentList = this.responseData.data;
              this.record = this.paymentList.length;
              if (this.record > 0) {
                this.showPegi = true;
              } else {
                this.swal('info', 'No Record Found', 'info');
                this.showPegi = false;
                this.show = false;
              }
            } else {
              this.swal('', 'Something went wrong.', 'error');
            }
          },
          (error) => {
            console.log(error);
            this.swal('', 'Something went wrong.', 'error');
          });
      }
    });
  }

  GetDate(str) {
    var arr = str.split("-");
    var months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    var month = months.indexOf(arr[1].toLowerCase());
    return new Date(parseInt(arr[2]), month, parseInt(arr[0]));
  }
  report: any = [];
  sno: any = {
    Slno: "",
    URN: "",
    Claimno: "",
    caseno: "",
    PatientName: "",
    Hospitaldetails: "",
    PackageCode: "",
    packageName: "",
    ActualDateOfAdmission: "",
    ActualDateOfDischarge: "",
  };
  heading = [['Sl#', 'URN', 'Claim Number', 'Case Number', 'Patient Name', 'Hospital Details', 'Package Code', 'Package Name', 'Actual Date Of Admission', 'Actual Date Of Discharge']];
  downloadReport(type: any) {
    this.report = [];
    if (type == 'excel') {
      let claim: any;
      for (var i = 0; i < this.paymentList.length; i++) {
        claim = this.paymentList[i];
        this.sno = [];
        this.sno.Slno = i + 1;
        this.sno.URN = claim.urnnumber;
        this.sno.Claimno = claim.claimnumber;
        this.sno.caseno = claim.caseno;
        this.sno.PatientName = claim.patientname;
        this.sno.Hospitaldetails = claim.hospitalname + '(' + claim.hospitalcode + ')';
        this.sno.PackageCode = claim.packagecode;
        this.sno.packageName = claim.packagename;
        this.sno.ActualDateOfAdmission = this.Dateconversion(claim.actualdateofadmission);
        this.sno.ActualDateOfDischarge = this.Dateconversion(claim.actialdateofdischarge);
        this.report.push(this.sno);
      }
      for (let i = 0; i < this.stateList.length; i++) {
        if (this.stateList[i].stateCode == this.state) {
          this.statename = this.stateList[i].stateName
        }
      }
      for (let i = 0; i < this.districtList.length; i++) {
        if (this.districtList[i].districtcode == this.dis) {
          this.districtName = this.districtList[i].districtname;
        }
      }
      for (let i = 0; i < this.hospitalList.length; i++) {
        if (this.hospital == this.hospitalList[i].hospitalCode) {
          this.hospitalname = this.hospitalList[i].hospitalName;
        }
      }
      for (let i = 0; i < this.snoList.length; i++) {
        if (this.snolist == this.snoList[i].userId) {
          this.snoname = this.snoList[i].fullName;
        }
      }
      let filter = [];
      filter.push([['Actual Date of Discharge From:-', this.formdate]]);
      filter.push([['To:-', this.toDate]]);
      filter.push([['State:- ', this.statename]]);
      filter.push([['District:- ', this.districtName]]);
      filter.push([['Hospital Name:- ', this.hospitalname]]);
      if (this.user.groupId == 4) {
        filter.push([['SNA Name:- ', this.snanamedata]]);
      } else {
        filter.push([['SNA Name:- ', this.snoname]]);
      }
      TableUtil.exportListToExcelWithFilterforadmin(this.report, "Run SNA Wise Unprocessed Claim", this.heading, filter);
    } else if (type == 'pdf') {
      if (this.paymentList.length == 0) {
        this.swal('', 'No Data Found', 'info');
        return;
      }
      let valuedate: any;
      let todate: any;
      let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      valuedate = this.formdate;
      todate = this.toDate;
      let SlNo = 1;
      this.paymentList.forEach(element => {
        let rowData = [];
        rowData.push(SlNo++);
        rowData.push(element.urnnumber);
        rowData.push(element.claimnumber);
        rowData.push(element.caseno);
        rowData.push(element.patientname);
        rowData.push(element.hospitalname + '(' + element.hospitalcode + ')');
        rowData.push(element.packagecode);
        rowData.push(element.packagename);
        rowData.push(this.Dateconversion(element.actualdateofadmission));
        rowData.push(this.Dateconversion(element.actialdateofdischarge));
        this.report.push(rowData);
      });
      let doc = new jsPDF('l', 'mm', [250, 270]);
      doc.setFontSize(10);
      doc.text('Authority Name :-' + this.user.fullName, 5, 5);
      doc.text('Actual Date of Discharge From:-' + valuedate, 5, 10);
      doc.text('To:-' + todate, 5, 15);
      doc.text('State:-' + this.statename, 5, 20);
      doc.text('District:-' + this.districtName, 5, 25);
      doc.text('Hospital Name:-' + this.hospitalname, 5, 30);
      doc.text('Document Generate Date :-' + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en').toString(), 5, 35);
      doc.setLineWidth(0.7);
      autoTable(doc, {
        head: this.heading, body: this.report, startY: 42, theme: 'grid',
        styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
        bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
        columnStyles: {
          0: { cellWidth: 8 },
          1: { cellWidth: 20 },
          2: { cellWidth: 20 },
          3: { cellWidth: 30 },
          4: { cellWidth: 20 },
          5: { cellWidth: 30 },
          6: { cellWidth: 18 },
          7: { cellWidth: 18 },
          8: { cellWidth: 18 },
          9: { cellWidth: 18 },
          10: { cellWidth: 15 },
        }
      })
      doc.save('Run_SNA_Wise_Unprocessed_Claim.pdf');
    }
  }
  Dateconversion(date) {
    var datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'dd-MMM-yyyy');
  }
  Dateconvert(date) {
    var datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'dd-MM-YYYY');
  }
  dataIdArray: any = [];
  checkAllCheckBox(event: any) {
    if (event.target.checked == true) {
      for (let i = 0; i < this.paymentList.length; i++) {
        $('#' + this.paymentList[i].claimid).prop('checked', true);
        this.dataIdArray.push(this.paymentList[i].claimid);
      }
    } else {
      for (let i = 0; i < this.paymentList.length; i++) {
        $('#' + this.paymentList[i].claimid).prop('checked', false);
        this.dataIdArray = [];
      }
    }
    this.dataIdArray = this.dataIdArray.filter(
      (value, index) => this.dataIdArray.indexOf(value) === index
    );
    if (this.dataIdArray.length > 0) {
      this.show = true;
    } else {
      this.show = false;
    }
  }
  show: boolean = false;
  tdCheck(event: any, claimId) {
    if (event.target.checked) {
      this.dataIdArray.push(claimId);
    } else {
      for (let i = 0; i < this.dataIdArray.length; i++) {
        if (this.dataIdArray[i] == claimId) {
          this.dataIdArray.splice(i, 1);
        }
      }
    }
    if (this.dataIdArray.length == this.paymentList.length) {
      $('#allCheck').prop('checked', true);
    } else {
      $('#allCheck').prop('checked', false);
    }
    if (this.dataIdArray.length > 0) {
      this.show = true;
    } else {
      this.show = false;
    }
    this.dataIdArray = this.dataIdArray.filter(
      (value, index) => this.dataIdArray.indexOf(value) === index
    );
  }
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>(
      document.getElementById('pageItem')
    )).value;
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
  otpvalidate: any;
  validateOtp() {
    let otp = $('#otpId').val();
    if (otp == '' || otp == null || otp == undefined) {
      this.swal('', 'Please Provide Otp !', 'error');
      return;
    }
    // let userid = JSON.parse(sessionStorage.getItem("user")).userId;
    let userid = this.sessionService.decryptSessionData("user").userId;
    this.hospitalService.validateotpforhosp(otp, userid).subscribe((data: any) => {
      this.otpvalidate = data;
      if (this.otpvalidate.status == 'success') {
        Swal.fire({
          title: "OTP validated successfully",
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
            $('#OtpModal').hide();
            this.Snawiserununprocesed();
          }
        });
      } else {
        this.swal('Error', this.otpvalidate.message, 'error')
      }
    },
      (error) => console.log(error)
    );
  }
  // userName: any;
  // sendOtp() {
  //   this.user = JSON.parse(sessionStorage.getItem('user'));
  //   this.userName = this.user.userName;
  //   let phone = this.user.phone;
  //   let handelmobilenumber = this.validatephonrnumber(phone);
  //   if (handelmobilenumber == false) {
  //     this.swal('', 'Please Update Your Profile  And Provide Valid Phone Number', 'error');
  //     return;
  //   } else {
  //     let data = {
  //       "userName": this.userName,
  //       "phone": phone
  //     }
  //     this.service.OtpDuringInternalLogin(data).subscribe((response: any) => {
  //       this.userDetails = response;
  //       if (this.userDetails.status == "success") {
  //         if (this.userDetails.data.status == "success") {
  //           $('#unprocessotp').show();
  //           $('#sendId').show();
  //           $('#reSendId').hide();
  //           $('#timerdivId').show();
  //           $('#timeCounter').show();
  //           $('#mobileNoId').show();
  //           $('#phoneId').show();
  //           $('#userId').val(this.userDetails.data.userName);
  //           localStorage.setItem("un", this.userDetails.data.userName);
  //           let phoneNo = this.userDetails.data.phone;
  //           let timeleft = this.timedata;
  //           let downloadTimer = setInterval(function () {
  //             if (timeleft <= 0) {
  //               clearInterval(downloadTimer);
  //               $('#sendId').hide();
  //               $('#reSendId').show();
  //               $('#timeCounter').hide();
  //               $('#timerdivId').hide();
  //               $('#mobileNoId').hide();
  //               $('#phoneId').hide();
  //             } else {
  //               $('#timeCounter').val(timeleft + " seconds remaining");
  //               $('#mobileNoId').val("OTP is sent to your " + phoneNo + " mobile number");
  //             }
  //             timeleft -= 1;
  //           }, 1000);
  //         } else {
  //           $('#unprocessotp').hide();
  //           this.swal('Warning', this.userDetails.data.message, 'error');
  //         }
  //       } else {
  //         $('#unprocessotp').hide();
  //         this.swal('Warning', this.userDetails.msg, 'error');
  //       }
  //     });
  //   }
  // }
  sendOtp() {
    // let userid = JSON.parse(sessionStorage.getItem("user")).userId;
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
  unprocesseddate: any;
  date: any;
  getdata: any
  Snawiserununprocesed() {
    this.data = {
      "claimid": this.dataIdArray,
      "userId": this.sonid,
      "searchby": this.eventName
    }
    Swal.fire({
      title: '',
      text: 'Are you sure To Run?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        this.unprocessedService.runsnawiseunprocessedupdate(this.data).subscribe(
          (response: any) => {
            this.responseData = response;
            this.getdata = this.responseData.data;
            if (this.getdata.status == 'success') {
              this.swal('', this.responseData.data.message, 'success');
              setTimeout(() => {
                window.location.reload();
              }, 2000);
            } else if (this.getdata.status == 'Failed') {
              this.swal('', 'Something went wrong.', 'error');
            }
          },
          (error) => {
            console.log(error);
            this.swal('', 'Something went wrong.', 'error');
          }
        )
      }
    });
  }
  Details(urnnumber: any, transactiondetailsid: any, claimid: any, hospitalcode: any, actualDateAdmission: any) {
    localStorage.setItem("urn", urnnumber)
    localStorage.setItem("transactionId", transactiondetailsid)
    localStorage.setItem("hospitalCode", hospitalcode);
    localStorage.setItem("claimId", claimid);
    localStorage.setItem("actualDateAdmission", actualDateAdmission);
    this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/urnwiseactionreportsdetails'); });
  }
  closemodeal() {
    $('#unprocessotp').hide();
  }
  // validateOtp() {
  //   let otpId = $('#otpId').val();
  //   let userName = this.user.userName;
  //   if (otpId == "" || otpId == undefined || otpId == null) {
  //     this.swal("", "Please enter valid OTP", 'info');
  //     return;
  //   } else {
  //     let data = {
  //       "otp": otpId,
  //       "userName": userName,
  //     }
  //     this.service.validateOtp(data).subscribe((response: any) => {
  //       this.userDetails = response;
  //       if (this.userDetails.data.status == "success") {
  //         Swal.fire({
  //           title: "OTP validated successfully",
  //           icon: 'success',
  //           showCancelButton: false,
  //           confirmButtonColor: '#3085d6',
  //           cancelButtonColor: '#d33',
  //           confirmButtonText: 'OK'
  //         }).then((result) => {
  //           if (result.isConfirmed) {
  //             $('#unprocessotp').hide();
  //             $('#internal').show();
  //             $('#otpId').val('');
  //             this.Snawiserununprocesed();
  //           }
  //         });
  //       } else {
  //         this.swal('Warning', 'Invalid OTP', 'error');
  //         $('#unprocessotp').show();
  //       }
  //     });
  //   }
  // }
  onResendOtp() {
    this.sendOtp();
  }
  // onResendOtp() {
  //   this.timedata = 60;
  //   let userName = this.user.userName;
  //   let phone = this.user.phone;
  //   if (userName == "" || userName == undefined || userName == null) {
  //     this.swal("Warning", "Some error occured could not resend OTP.Please try again late", 'error');
  //     return;
  //   } else {
  //     let data = {
  //       "userName": userName,
  //       "phone": phone
  //     }
  //     this.service.OtpDuringInternalLogin(data).subscribe((response: any) => {
  //       this.userDetails = response;
  //       if (this.userDetails.status == "success") {
  //         if (this.userDetails.data.status == "success") {
  //           $('#timeDivId').show();
  //           $('#unprocessotp').show();
  //           $('#sendId').show();
  //           $('#reSendId').hide();
  //           $('#timerdivId').show();
  //           $('#timeCounter').show();
  //           $('#mobileNoId').show();
  //           $('#phoneId').show();
  //           $('#userId').val(this.userDetails.data.userName);
  //           localStorage.setItem("un", this.userDetails.data.userName);

  //           let phoneNo = this.userDetails.data.phone;
  //           let timeleft = this.timedata;
  //           let downloadTimer = setInterval(function () {
  //             if (timeleft <= 0) {
  //               clearInterval(downloadTimer);
  //               $('#sendId').hide();
  //               $('#reSendId').show();
  //               $('#timeCounter').hide();
  //               $('#timerdivId').hide();
  //               $('#mobileNoId').hide();
  //               $('#phoneId').hide();
  //             } else {
  //               $('#timeCounter').val(timeleft + " seconds remaining");
  //               $('#mobileNoId').val("OTP is sent to your " + phoneNo + " mobile number");
  //             }
  //             timeleft -= 1;
  //           }, 1000);
  //         } else {
  //           $('#unprocessotp').hide();
  //           this.swal('Warning', this.userDetails.data.message, 'error');
  //         }
  //       } else {
  //         $('#unprocessotp').hide();
  //         this.swal('Warning', this.userDetails.msg, 'error');
  //       }
  //     });
  //   }
  // }
  validatephonrnumber(Phone: string) {
    if (Phone.length == 10 && Phone.charAt(1) == '0' && Phone.charAt(2) == '0' && Phone.charAt(3) == '0' && Phone.charAt(4) == '0'
      && Phone.charAt(5) == '0' && Phone.charAt(6) == '0') {
      return false;
    } else {
      return true;
    }
  }
  close() {
    $('#OtpModal').hide();
  }
}
