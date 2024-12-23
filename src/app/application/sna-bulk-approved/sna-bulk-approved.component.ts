import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { HeaderService } from '../header.service';
import { SnamasterserviceService } from '../Services/snamasterservice.service';
import { SnoCLaimDetailsService } from '../Services/sno-claim-details.service';
import { TableUtil } from '../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;


@Component({
  selector: 'app-sna-bulk-approved',
  templateUrl: './sna-bulk-approved.component.html',
  styleUrls: ['./sna-bulk-approved.component.scss']
})
export class SnaBulkApprovedComponent implements OnInit {
  statelist: Array<any> = [];
  stateCode: any;
  user: any;
  stateId: any;
  userId: any;
  distList: any = [];
  distCode: any;
  hospitalList: any = [];
  snoclaimlist: any = [];
  totalClaimCount: any;
  public stateList: any = [];
  record: any;
  hospitalId: any;
  districtId: any;
  showPegi: boolean;
  txtsearchDate: any;
  pageElement: any;
  currentPage: any;
  countdetails: any;
  datavalue: any;
  percentage: number;
  division: any;
  keyword: any = "hospitalName";
  keyword1: any = "districtname";
  keyword2: any = "stateName";
  bulkdata: any;
  buttonhide: boolean = false;
  public districtList: any = [];
  ipAddress = '';
  @ViewChild('auto') auto;
  @ViewChild('auto1') auto1;
  @ViewChild('auto2') auto2;
  constructor(public headerService: HeaderService, public snoService: SnoCLaimDetailsService, private http: HttpClient,
    private snamasterService: SnamasterserviceService, public router: Router, private sessionService: SessionStorageService) { }


  ngOnInit(): void {
    this.headerService.setTitle('Bulk Approve of Cpd Approved');
    this.headerService.isIndicate(true);
    this.headerService.isPrint(true);
    this.headerService.isDelete(true);
    this.headerService.isDownload(true);
    this.headerService.isBack(false);
    this.user = this.sessionService.decryptSessionData("user");

    this.currentPage = 1;
    this.pageElement = 10;
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
    this.getStateList();
    this.getbulkapproved();
  }
  getStateList() {
    this.snamasterService.getStateList(this.user.userId).subscribe(
      (response) => {
        this.stateList = response;
      },
      (error) => console.log(error)
    )
  }
  stateData: any = [];
  cpdFlag: any = 0;
  responseData: any;
  fromDate: any;
  toDate: any;
  searchtype: any;
  getbulkapproved() {
    this.buttonhide = false;
    let userId = this.user.userId;
    this.fromDate = $('#datepicker1').val();
    this.toDate = $('#datepicker2').val();
    let stateId = this.stateId;
    let districtId = this.districtId;
    let hospitalId = this.hospitalId;
    this.searchtype = $('#search').val();
    if (Date.parse(this.fromDate) > Date.parse(this.toDate)) {
      this.swal('', 'Discharge Date From should be Less Than Discharge Date To', 'error');
      return;
    }
    let requestData = {
      "userId": userId,
      "fromDate": new Date(this.fromDate),
      "toDate": new Date(this.toDate),
      "stateCode1": stateId,
      "distCode1": districtId,
      "hospitalCode": hospitalId,
      "cpdFlag": this.cpdFlag,
      "searchtype": this.searchtype
    }
    this.snoService.getBulkapproved(requestData).subscribe(response => {
      this.countdetails = response;
      this.datavalue = this.countdetails.percentage;
      this.division = this.countdetails.tcpdApproved;
      if (this.countdetails?.pendatsna != 0 && this.countdetails?.app_persent_flag >= 10) {
        this.buttonhide = true;
      } else {
        this.buttonhide = false;
      }
    },
      (error) => {
        console.log(error);
        this.swal('', 'Something went wrong.', 'error');
      });
  }
  resetField() {
    window.location.reload()
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  Submitbulk() {
    let user = this.user.userId;
    let group = this.user.groupId;
    let flags = "bulk";
    let fromDate = $('#datepicker1').val();
    let toDate = $('#datepicker2').val();
    let stateId = this.stateId != null ? this.stateId : '';
    let districtId = this.districtId != null ? this.districtId : '';
    let hospitalId = this.hospitalId != null ? this.hospitalId : '';
    Swal.fire({
      title: '',
      text: 'Are you sure to Bulk Approved?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        this.snoService.getapprovedforbulk(user, group, flags, fromDate, toDate, stateId, districtId, hospitalId).subscribe((data) => {
          this.bulkdata = data;
          if (this.bulkdata.status == "Success") {
            this.swal("Success", this.bulkdata.message, "success");
            this.router.navigate(['/application/snabulkapproval']);
            this.getbulkapproved();
          } else if (this.bulkdata.status == "Failed") {
            this.swal("Error", this.bulkdata.message, "error");
          }
        })
      }
    });


  }
  selectEvent2(item) {
    this.stateId = item.stateCode;
    this.OnChangeState(this.stateId);
  }
  OnChangeState(id) {
    this.auto1.clear();
    this.auto.clear();
    this.districtId = '';
    this.hospitalId = '';
    this.auto.clear();
    this.hospitalList = [];
    localStorage.setItem("stateCode", id);
    this.snamasterService.getDistrictListByStateId(this.user.userId, id).subscribe(
      (response) => {
        this.districtList = response;
      },
      (error) => console.log(error)
    )
  }
  selectEvent1(item) {
    this.districtId = item.districtcode;
    this.OnChangeDistrict(this.districtId);
  }
  OnChangeDistrict(id) {
    this.hospitalId = '';
    this.auto.clear();
    var stateCode = localStorage.getItem("stateCode");
    this.snamasterService.getHospitalbyDistrictId(this.user.userId, id, stateCode).subscribe(
      (response) => {
        this.hospitalList = response;
      },
      (error) => console.log(error)
    )
  }
  selectEvent(item) {
    this.hospitalId = item.hospitalCode;
  }
  clearEvent1() {
    this.districtId = '';
    this.OnChangeDistrict(this.districtId);
  }
  clearEvent() {
    this.hospitalId = '';
  }
  clearEvent2() {
    this.stateId = '';
    this.OnChangeState(this.stateId);
  }

  report: any = [];
  sno: any = {
    Slno: "",
    TotalcpdApproved: "",
    SNAApproved: "",
    SNARejected: "",
    SNAInvestigated: "",
    PendingAtHospital: "",
    PendingAtSNAOfResettlement: "",
    PendingAtSNA: "",
    percentage: ""
  };
  heading = [['Sl#', 'Total CPD Approved', 'SNA Approved', 'SNA Rejected', 'SNA Investigated', 'Pending At Hospital', 'Pending At SNA Of Resettlement', 'Pending At SNA', 'Percentage']];
  downloadList() {
    this.report = [];
    let bulk: any;
    bulk = this.countdetails;
    this.sno = [];
    this.sno.Slno = 1;
    this.sno.TotalcpdApproved = bulk.tcpdApproved != null ? bulk.tcpdApproved : 'N/A';
    this.sno.SNAApproved = bulk.snaActionOfCpdAprvd != null ? bulk.snaActionOfCpdAprvd : 'N/A';
    this.sno.SNARejected = bulk.snaRjctdOfCpdAprvd != null ? bulk.snaRjctdOfCpdAprvd : 'N/A';
    this.sno.SNAInvestigated = bulk.snaInvstgOfCpdRjctd != null ? bulk.snaInvstgOfCpdRjctd : 'N/A';
    this.sno.PendingAtHospital = bulk.snaQueryOfCpdAprvd != null ? bulk.snaQueryOfCpdAprvd : 'N/A';
    this.sno.PendingAtSNAOfResettlement = bulk.resettlement != null ? bulk.resettlement : 'N/A';
    this.sno.PendingAtSNA = bulk.pendatsna != null ? bulk.pendatsna : 'N/A';
    this.sno.percentage = this.percentage + "%";
    this.report.push(this.sno);
    let filter = [];
    filter.push([['Generated By', this.user.fullName]]);
    filter.push([['Actual Date of Discharge From Date', this.fromDate]]);
    filter.push([['To Date', this.toDate]]);
    TableUtil.exportListToExcelWithFilter(this.report, "Summary for Bulk Approve", this.heading, filter);
  }
  heading1 = [
    [
      'Count Details',
      'Count',
    ]
  ];
  downloadListpdf() {
    let item = this.countdetails;
    const doc = new jsPDF('p', 'mm', [275, 225]);
    doc.text("Generated By:-" + this.user.fullName, 5, 5);
    doc.text("Actual Date of Discharge From Date:-" + this.fromDate, 5, 10);
    doc.text("To Date:-" + this.toDate, 5, 15);
    doc.text("Summary for Bulk Approve", 5, 20);
    doc.setFontSize(8);
    let list = [];
    list[0] = ['Total CPD Approved', item.tcpdApproved != null ? item.tcpdApproved : 'N/A'];
    list[1] = ['SNA Approved', item.snaActionOfCpdAprvd != null ? item.snaActionOfCpdAprvd : 'N/A'];
    list[2] = ['SNA Rejected', item.snaRjctdOfCpdAprvd != null ? item.snaRjctdOfCpdAprvd : 'N/A'];
    list[3] = ['SNA Investigated', item.snaInvstgOfCpdRjctd != null ? item.snaInvstgOfCpdRjctd : 'N/A'];
    list[4] = ['Pending At Hospital(SNA Query) ', item.snaQueryOfCpdAprvd != null ? item.snaQueryOfCpdAprvd : 'N/A'];
    list[5] = ['Pending At SNA Of Resettlement', item.resettlement != null ? item.resettlement : 'N/A'];
    list[6] = ['Pending At SNA(CPD Approved) ', item.pendatsna != null ? item.pendatsna : 'N/A'];
    list[7] = ['Percentage(%)', this.percentage + "%"];
    autoTable(doc, {
      head: this.heading1,
      body: list,
      theme: 'grid',
      startY: 25,
      headStyles: {
        fillColor: [26, 99, 54]
      },
      columnStyles: {
        0: { cellWidth: 175 },
        1: { cellWidth: 20 },
      }
    });
    let filename = 'Bulk_Approved_of_Cpd_Approved_Report.pdf';
    doc.save(filename);
  }
}
