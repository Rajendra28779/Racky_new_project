import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../header.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { DcClaimService } from '../Services/dc-claim.service';
import { TableUtil } from '../util/TableUtil';
import { DatePipe, formatDate } from '@angular/common';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import { SnamasterserviceService } from '../Services/snamasterservice.service';
declare let $: any;

@Component({
  selector: 'app-hospitalenrollmentactiontakenreport',
  templateUrl: './hospitalenrollmentactiontakenreport.component.html',
  styleUrls: ['./hospitalenrollmentactiontakenreport.component.scss']
})
export class HospitalenrollmentactiontakenreportComponent implements OnInit {
  txtsearchDate: any;
  user: any;
  currentPage: any;
  pageElement: any;
  months: any;
  months2: any;
  year: any;
  secoundDay: any;
  frstDay: any;
  fromDate: any;
  toDate: any;
  urn: any;
  search: any;
  record: any;
  showPegi: boolean;
  stateList:any=[];
  districtList:any=[];
  hospitalList:any=[];
  state: any="";
  dist: any="";
  hospital: any="";

  constructor(private headerService: HeaderService,
    public router: Router, private http: HttpClient,
    private dsService: DcClaimService,
    private sessionService: SessionStorageService,
    private snoService: SnocreateserviceService,
    private snamasterService: SnamasterserviceService
    ) { }

  ngOnInit(): void {
    this.headerService.setTitle('Hospital Enrollment Action Taken List');
    this.user = this.sessionService.decryptSessionData("user");
    this.currentPage = 1;
    this.pageElement = 50;
    this.getStateList();
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
    let date = new Date();
    let year = date.getFullYear();
    let date1 = '01';
    let month: any = date.getMonth() - 2;

    if (month == -1) {
      this.months = 'Dec';
      this.year = year - 1;
    } else if (month == -2) {
      this.months = 'Nov';
      this.year = year - 1;
    } else {
      this.months = this.getMonthFrom(month);
      this.year = year;
    }
    let date2 = date.getDate();
    this.months2 = this.getMonthFrom(date.getMonth())
    this.frstDay = date1 + '-' + 'Jan' + '-' + 2024;
    this.secoundDay = date2 + "-" + this.months2 + "-" + year;

    $('input[name="fromDate"]').val(this.frstDay).attr('placeholder', 'From Date *');
    $('input[name="toDate"]').attr('placeholder', 'To Date *');
    this.getActionstatus();

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
  report: any = [];
  sno: any = {
    Slno: "",
    URN: "",
    hospcode: "",
    hospname: "",
    Name: "",
    Gender: "",
    Age: "",
    DateOfBirth: "",
    Registeron: "",
    currentstatus: "",
    remarks: "",
    description: "",
  };
  heading = [['Sl#', 'URN','Hospital Code','Hospital Name', 'Name', 'Gender', 'Age', 'Date Of Birth', 'Register On', 'Current Status', 'Remarks']];
  downloadReportpdf() {
    this.report = [];
    if (this.actiontakenstatus.length == 0) {
      this.swal('', 'No Data Found', 'info');
      return;
    }

    let SlNo = 1;
    this.actiontakenstatus.forEach(element => {
      let rowData = [];
      rowData.push(SlNo);
      rowData.push(element.urn);
      rowData.push(element.hospitalcode);
      rowData.push(element.hospitalname);
      rowData.push(element.membername);
      rowData.push(element.gender);
      rowData.push(element.age);
      rowData.push(this.dateconvert(element.dob));
      rowData.push(this.dateconvertwithtimestamp(element.registrationdate));
      rowData.push(element.currentstatus);
      rowData.push(element.remark);
      this.report.push(rowData);
      SlNo++;
    }
    );

    let statename='All';
    let distname='All';
    let hospitalName='All';
    for (const element of this.stateList) {
      if (element.stateCode == this.state) {
        statename = element.stateName;
      }
    }
    for (const element of this.districtList) {
      if (element.districtcode == this.dist) {
        distname = element.districtname;
      }
    }
    for (const element of this.hospitalList) {
      if (element.hospitalCode == this.hospital) {
        hospitalName = element.hospitalName;
      }
    }


    let doc = new jsPDF('l', 'mm', [297, 210]);

    doc.setFontSize(20);
    doc.text('Action Taken List', 120, 15);
    doc.setFontSize(12);
    doc.text('Authority Name :-' + this.user.fullName, 15, 25);
    doc.text('Document Generate Date :-' + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en').toString(), 170, 25);
    doc.text('Register From:-' + this.fromDate, 15, 32);
    doc.text('Register To:-' + this.toDate, 170, 32);
    doc.text('State Name:-' + statename, 15, 39);
    doc.text('District Name:-' + distname, 170, 39);
    doc.text('Hospital Name:-' + hospitalName, 15, 46);
    if (this.search == 1) {
      doc.text('Search By:-' + 'Approved', 15, 53);
    } else if (this.search == 2) {
      doc.text('Search By:-' + 'Rejected', 15, 53);
    } else if (this.search == 3) {
      doc.text('Search By:-' + 'Query', 15, 53);
    } else if (this.search == null || this.search == undefined || this.search == '') {
      doc.text('Search By:-' + 'N/A', 15, 53);
    }


    autoTable(doc, {
      head: this.heading, body: this.report, startY: 58, theme: 'grid',
      styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 9, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
      bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
      headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
      columnStyles: {
        0: { cellWidth: 10 },
      }
    })
    doc.save('Action_Taken_List.pdf');
  }
  downloadReportExcel() {
    this.report = [];
    let claim: any;
    for (var i = 0; i < this.actiontakenstatus.length; i++) {
      claim = this.actiontakenstatus[i];
      this.sno = [];
      this.sno.Slno = i + 1;
      this.sno.URN = claim.urn;
      this.sno.hospcode = claim.hospitalcode;
      this.sno.hospname = claim.hospitalname;
      this.sno.Name = claim.membername;
      this.sno.gender = claim.gender;
      this.sno.Age = claim.age;
      this.sno.DateOfBirth = this.dateconvert(claim.dob);
      this.sno.Registeron = this.dateconvertwithtimestamp(claim.registrationdate);
      this.sno.currentstatus = claim.currentstatus;
      this.sno.remarks = claim.remark;
      this.report.push(this.sno);
    }

    let statename='All';
    let distname='All';
    let hospitalName='All';
    for (const element of this.stateList) {
      if (element.stateCode == this.state) {
        statename = element.stateName;
      }
    }
    for (const element of this.districtList) {
      if (element.districtcode == this.dist) {
        distname = element.districtname;
      }
    }
    for (const element of this.hospitalList) {
      if (element.hospitalCode == this.hospital) {
        hospitalName = element.hospitalName;
      }
    }


    let filter1 = [];
    filter1.push([['Register From:-', this.fromDate]]);
    filter1.push([['Register To:-', this.toDate]]);
    filter1.push([['State Name:-', statename]]);
    filter1.push([['District Name:-', distname]]);
    filter1.push([['Hospital Name:-', hospitalName]]);
    if (this.search == 1) {
      filter1.push([['Search By:-', 'Approved']]);
    } else if (this.search == 2) {
      filter1.push([['Search By:-', 'Rejected']]);
    } else if (this.search == 3) {
      filter1.push([['Search By:-', 'Query']]);
    } else if (this.search == null || this.search == undefined || this.search == '') {
      filter1.push([['Search By:-', 'N/A']]);
    }
    TableUtil.exportListToExcelWithFilterforhospitals(this.report, "Action Taken List", this.heading, filter1);
  }
  actiontakenstatus: any = [];
  getActionstatus() {
    this.actiontakenstatus = [];
    this.fromDate = $('input[name="fromDate"]').val();
    this.toDate = $('input[name="toDate"]').val();
    this.urn = $('#urn').val();
    this.search = $('#search').val();
    this.state = $('#stateId').val();
    this.dist = $('#districtId').val();
    this.hospital = $('#hospital').val();
    if (this.urn == '' || this.urn == null || this.urn == undefined) {
      this.urn = '';
    } if (this.search == '' || this.search == null || this.search == undefined) {
      this.search = '';
    }
    if (Date.parse(this.fromDate) > Date.parse(this.toDate)) {
      this.swal('', 'Register From  should be Less Than Register To.', 'error');
      return;
    }
    this.dsService.getActionTakenDetals(this.urn, this.fromDate, this.toDate, this.user.userId, this.user.userName, this.search,this.state,this.dist,this.hospital).subscribe((data: any) => {
      this.actiontakenstatus = data;
      this.record = this.actiontakenstatus.length;
      if (this.record > 0) {
        this.showPegi = true;
      } else {
        this.showPegi = false;
      }
    })
  }
  getRestdata() {
    window.location.reload();
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  }
  dateconvert(date: any) {
    var datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'dd-MMM-yyyy');
  }
  dateconvertwithtimestamp(date: any) {
    var datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'dd-MMM-yyyy hh:mm:ss a');
  }

  onclaim(data: any) {
    let state = {
      fromdate: this.fromDate,
      todate: this.toDate,
      userid: this.user.userId,
      depregid: data.deprgid,
      acknowledgementnumber: data.acknowledgementno,
      flag: 'viewonly'
    }
    localStorage.setItem("enrollmnent", JSON.stringify(state));
    this.router.navigate(['/application/hospitalenrollmentview/Action']);
  }

  getStateList() {
    if (this.user.groupId == 4) {
      this.snamasterService.getStateList(this.user.userId).subscribe(
        (response) => {
          this.stateList = response;
        },
        (error) => console.log(error)
      )
    } else {
      this.snoService.getStateList().subscribe(
        (response) => {
          this.stateList = response;
        },
        (error) => console.log(error)
      );
    }
  }
  OnChangeState(id) {
    $("#districtId").val("");
    localStorage.setItem("stateCode", id);
    if (this.user.groupId == 4) {
      this.snamasterService.getDistrictListByStateId(this.user.userId, id).subscribe(
        (response) => {
          this.districtList = response;
        },
        (error) => console.log(error)
      )
    } else if (this.user.groupId == 6) {
      this.snoService.getDistrictListByStateIddcid(this.user.userId, id).subscribe(
        (response) => {
          this.districtList = response;
        },
        (error) => console.log(error)
      )
    } else {
      this.snoService.getDistrictListByStateId(id).subscribe(
        (response) => {
          this.districtList = response;
        },
        (error) => console.log(error)
      )
    }

  }
  OnChangeDistrict(id) {
    var stateCode = localStorage.getItem("stateCode");
    if (this.user.groupId == 4) {
      this.snamasterService.getHospitalbyDistrictId(this.user.userId, id, stateCode).subscribe(
        (response) => {
          this.hospitalList = response;
        },
        (error) => console.log(error)
      )
    } else if (this.user.groupId == 6) {
      this.snoService.getHospitalbyDistrictIddcid(this.user.userId, id, stateCode).subscribe(
        (response) => {

          this.hospitalList = response;
        },
        (error) => console.log(error)
      )
    } else {
      this.snoService.getHospitalbyDistrictId(id, stateCode).subscribe(
        (response) => {
          this.hospitalList = response;
        },
        (error) => console.log(error)
      )
    }
  }


}
