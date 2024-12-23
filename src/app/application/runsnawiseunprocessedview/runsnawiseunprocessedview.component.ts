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
import { LoginService } from 'src/app/services/shared-services/login.service';
import { HospitalService } from '../Services/hospital.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;


@Component({
  selector: 'app-runsnawiseunprocessedview',
  templateUrl: './runsnawiseunprocessedview.component.html',
  styleUrls: ['./runsnawiseunprocessedview.component.scss']
})
export class RunsnawiseunprocessedviewComponent implements OnInit {
  keyword: any = 'fullName';
  txtsearchDate: any;
  list: any = [];
  stateList: any = [];
  districtList: any = []
  hospitalList: any = [];
  pageElement: any;
  currentPage: any;
  state: any = "";
  dist: any = "";
  hospital: any = "";
  snolist: any = "";
  statename: any = "ALL";
  districtName: any = "ALL";
  hospitalname: any = "ALL";
  public snoList: any = [];
  showPegi: boolean = false;
  record: any = 0
  user: any;
  snoUserId: any;
  snanamedata: any;
  showsna: boolean = false;
  selectedItems: any;
  snaname: any;
  formdate: any;
  toDate: any;
  eventName: any;

  constructor(private snoService: SnocreateserviceService, private hospitalService: HospitalService, public headerService: HeaderService,
    private unprocessedService: UnprocessedclaimService, public route: Router, private snoConfigService: SnocreateserviceService, private service: LoginService,private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    // this.user = JSON.parse(sessionStorage.getItem("user"));
    this.user = this.sessionService.decryptSessionData("user");
    this.headerService.setTitle('Run SNA Wise Unprocessed Claim View');
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
    $('input[name="fromDate"]').val(frstDay);
    $('input[name="fromDate"]').attr("placeholder", "From Date *");
    $('input[name="toDate"]').attr("placeholder", "To Date *");
    if (this.user.groupId == 4) {
      this.snoUserId = this.user.userId;
      this.snanamedata = this.user.fullName;
      this.showsna = true;
    } else {
      this.snoUserId = "";
      this.snanamedata = "";
      this.showsna = false;
    }
    this.getSNOList();
    this.getStateList();
  }

  getSNOList() {
    this.snoConfigService.getSNODetails().subscribe(
      (response) => {
        this.snoList = response;
      },
      (error) => console.log(error)
    )
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


  Search() {
    this.formdate = $('#datepicker1').val();
    this.toDate = $('#datepicker2').val();
    this.state = $('#stateId').val();
    this.dist = $('#districtId').val();
    this.hospital = $('#hospital').val();
    if (this.formdate == '' || this.formdate == null || this.formdate == undefined) {
      this.swal('', 'From Date should not be blank', 'error');
      return;
    }
    if (this.toDate == '' || this.toDate == null || this.toDate == undefined) {
      this.swal('', 'To Date should not be blank', 'error');
      return;
    }
    const fromDate1 = new Date(this.formdate);
    const todate1 = new Date(this.toDate);
    let diffTime = Math.abs(todate1.getTime() - fromDate1.getTime());
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (days > 30) {
      this.swal('', ' Maximum 30 days Allow', 'error');
      return;
    }
    if (Date.parse(this.formdate) > Date.parse(this.toDate)) {
      this.swal('', ' From Date should be less than To Date', 'error');
      return;
    }
    if (this.snoUserId == '' || this.snoUserId == null || this.snoUserId == undefined) {
      this.swal('', 'SNA Doctor Name should not be blank', 'error');
      return;
    }
    let data = {
      "fromDate": this.formdate,
      "toDate": this.toDate,
      "stateCode": this.state,
      "districtCode": this.dist,
      "hospitalCode": this.hospital,
      "snoid": this.snoUserId,
    }
    this.unprocessedService.snawiseunprocessedreport(data).subscribe(
      (response: any) => {
        this.list = response
        this.record = this.list.length;
        if (this.record > 0) {
          this.showPegi = true;
          this.currentPage = 1;
          this.pageElement = 100;
        } else {
          this.swal('info', 'No Record Found', 'info');
          this.showPegi = false;
        }
      },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      });
  }

  ResetField() {
    window.location.reload();
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
    Unprocessedby: "",
    Unprocessedon: "",
  };
  heading = [['Sl#', 'URN', 'Claim Number', 'Case Number', 'Patient Name', 'Hospital Name', 'Package Code', 'Package Name', 'Actual Date Of Admission', 'Actual Date Of Discharge', 'Unprocessed By', 'Unprocessed On']];

  downloadReport(no: any) {
    this.report = [];
    let claim: any;
    for (var i = 0; i < this.list.length; i++) {
      claim = this.list[i];
      this.sno = [];
      this.sno.Slno = i + 1;
      this.sno.URN = claim.urnnumber;
      this.sno.Claimno = claim.claimnumber;
      this.sno.caseno = claim.caseno;
      this.sno.PatientName = claim.patientname;
      this.sno.Hospitaldetails = claim.hospitalname + '(' + claim.hospitalcode + ')';
      this.sno.PackageCode = claim.packagecode;
      this.sno.packageName = claim.packagename;
      this.sno.ActualDateOfAdmission = claim.actualdateofadmission;
      this.sno.ActualDateOfDischarge = claim.actialdateofdischarge;
      this.sno.Unprocessedby = claim.unprocessedby
      this.sno.Unprocessedon = claim.unprocessdate
      this.report.push(this.sno);
    }
    for (let i = 0; i < this.stateList.length; i++) {
      if (this.stateList[i].stateCode == this.state) {
        this.statename = this.stateList[i].stateName
      }
    }
    for (let i = 0; i < this.districtList.length; i++) {
      if (this.districtList[i].districtcode == this.dist) {
        this.districtName = this.districtList[i].districtname;
      }
    }
    for (let i = 0; i < this.hospitalList.length; i++) {
      if (this.hospital == this.hospitalList[i].hospitalCode) {
        this.hospitalname = this.hospitalList[i].hospitalName;
      }
    }

    if (no == 1) {
      let filter = [];
      filter.push([['Actual Date of Discharge From:-', this.formdate]]);
      filter.push([['To:-', this.toDate]]);
      filter.push([['State:- ', this.statename]]);
      filter.push([['District:- ', this.districtName]]);
      filter.push([['Hospital Name:- ', this.hospitalname]]);
      if (this.user.groupId == 4) {
        filter.push([['SNA Name:- ', this.snanamedata]]);
      } else {
        filter.push([['SNA Name:- ', this.snaname]]);
      }
      TableUtil.exportListToExcelWithFilter(this.report, "Unprocessed View Report", this.heading, filter);
    } else {
      if (this.list.length == 0) {
        this.swal('', 'No Data Found', 'info');
        return;
      }

      let doc = new jsPDF('l', 'mm', [310, 210]);
      doc.setFontSize(20);
      doc.text("Unprocessed View Report", 80, 15);
      doc.setFontSize(12);
      doc.text('Actual Date of Discharge From :- ' + this.formdate + ' To :- ' + this.toDate, 15, 23);
      doc.text('State Name :- ' + this.statename, 190, 23);
      doc.text('District Name :- ' + this.districtName, 190, 30);
      doc.text('Hospital Name :- ' + this.hospitalname, 15, 30);
      doc.text('Generated By :- ' + this.user.fullName, 15, 37);
      doc.text('Generated On :- ' + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en').toString(), 190, 37);
      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.Slno;
        pdf[1] = clm.URN;
        pdf[2] = clm.Claimno;
        pdf[3] = clm.caseno;
        pdf[4] = clm.PatientName;
        pdf[5] = clm.Hospitaldetails;
        pdf[6] = clm.PackageCode;
        pdf[7] = clm.packageName;
        pdf[8] = clm.ActualDateOfAdmission;
        pdf[9] = clm.ActualDateOfDischarge;
        pdf[10] = clm.Unprocessedby;
        pdf[11] = clm.Unprocessedon;
        rows.push(pdf);
      }
      autoTable(doc, {
        head: this.heading, body: rows, startY: 40, theme: 'grid',
        styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
        bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
        columnStyles: {
          0: { cellWidth: 8 },
        }
      })
      doc.save('Unprocessed View Report.pdf');
    }
  }

}
