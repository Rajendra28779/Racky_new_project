import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../application/header.service';
import { SnocreateserviceService } from '../application/Services/snocreateservice.service';
import { CpdPaymentReportService } from '../application/Services/cpd-payment-report.service';
import { JwtService } from '../services/jwt.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TableUtil } from '../application/util/TableUtil';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { SessionStorageService } from '../services/session-storage.service';

@Component({
  selector: 'app-cpdclaimprocessingpaymentreportdetails',
  templateUrl: './cpdclaimprocessingpaymentreportdetails.component.html',
  styleUrls: ['./cpdclaimprocessingpaymentreportdetails.component.scss']
})
export class CpdclaimprocessingpaymentreportdetailsComponent implements OnInit {
  txtsearchDate: any;
  showPegi: boolean;
  currentPage: any;
  pageElement: any;
  record: any;
  payinner: any;
  user: any;
  year: any;
  month: any;
  searchby: any;
  searchbyName: any = 'Alloted Date';
  countdata: any;
  status: any;
  reportName: any;
  statecode: any;
  statename: any;
  districtcode: any;
  districtname: any;
  hospitalcode: any;
  hospitalname: any;
  userId: any;
  groupId: any;
  monthname: any;
  monthnameData: any = '';
  cpdstatus: any;
  cpdname: any;
  cpduserid: any;
  constructor(public headerService: HeaderService,
    private snoService: SnocreateserviceService,
    private cpdpaymentservice: CpdPaymentReportService,
    private route: Router, private jwtService: JwtService,private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.payinner = JSON.parse(localStorage.getItem("payinner"));
    this.user = this.sessionService.decryptSessionData("user");
    
    this.currentPage = 1;
    this.pageElement = 200;
    this.year = this.payinner.year
    this.month = this.payinner.month
    this.searchby = this.payinner.searchby
    this.countdata = this.payinner.countdata
    this.status = this.payinner.status
    this.reportName = this.payinner.reportName
    this.statecode = this.payinner.statecode
    this.statename = this.payinner.statename
    this.districtcode = this.payinner.districtcode
    this.districtname = this.payinner.districtname
    this.hospitalcode = this.payinner.hospitalcode
    this.hospitalname = this.payinner.hospitalname
    this.userId = this.payinner.userId
    this.groupId = this.payinner.groupId;
    this.cpdstatus = this.payinner.cpdstatus;
    this.cpdname = this.payinner.cpdname;
    this.cpduserid = this.payinner.cpduserid;
    this.getInnerPageDetails();

  }
  innerdata: any = [];
  getInnerPageDetails() {
    this.innerdata = [];
    let year = this.year;
    let month = this.month;
    let searchby = this.searchby;
    let countdata = this.countdata;
    let status = this.status;
    let statecode = this.statecode;
    let districtcode = this.districtcode;
    let hospitalcode = this.hospitalcode;
    this.monthnameData = this.getMonthName(this.month);
    if (districtcode == null || districtcode == undefined || districtcode == '') {
      districtcode = '';
    }
    if (hospitalcode == null || hospitalcode == undefined || hospitalcode == '') {
      hospitalcode = '';
    }
    if (statecode == null || statecode == undefined || statecode == '') {
      statecode = '';
    }
    this.cpdpaymentservice.getInnerdetails(this.cpduserid, year, month, this.hospitalcode, this.statecode, this.districtcode, status).subscribe((data: any) => {
      if (data.status = 'success') {
        this.innerdata = data.details;
        this.record = this.innerdata.length;
        if (this.record > 0) {
          this.showPegi = true;
        } else {
          this.showPegi = false;
        }
      } else if (data.status = 'fails') {
        this.swal('', 'Something went wrong. ', 'error');
      }
    }, (error) => {
      console.log(error);
      this.swal('', 'Something went wrong.', 'error');
    })
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  report: any = [];
  sno: any = {
    Slno: "",
    claimno: "",
    invoicenumber: "",
    urn: "",
    patientname: "",
    packagecode: "",
    actualdateofadmission: "",
    actualdateofdischarge: "",
    actionon: "",
    claimsubmitted: "",
    claimamount: "",
    approvedamount: "",
  };
  heading = [['Sl#', 'Claim Number', 'Invoice Number', 'URN', 'Patient Name', 'Package Code', 'Actual Date Of Admission', 'Actual Date Of Discharge', 'Action On', 'Claim Submitted Date', 'Claimed Amount(₹)', 'Approved Amount(₹)']];
  downloadReportExcel() {
    this.report = [];
    let claim: any;
    for (var i = 0; i < this.innerdata.length; i++) {
      claim = this.innerdata[i];
      this.sno = [];
      this.sno.Slno = i + 1;
      this.sno.claimno = claim.claimnumber;
      this.sno.invoicenumber = claim.invoicenumber;
      this.sno.urn = claim.urn;
      this.sno.patientname = claim.patientname;
      this.sno.packagecode = claim.packagecode;
      this.sno.actualdateofadmission = claim.actualdateofadmission;
      this.sno.actualdateofdischarge = claim.actualdateofdischarge;
      this.sno.actionon = claim.actionon;
      this.sno.claimsubmitted = claim.createdon;
      this.sno.claimamount = claim.totalamountclaimed;
      this.sno.approvedamount = claim.approvedamount;
      this.report.push(this.sno);
    }
    let filter = [];
    if (this.groupId == 3) {
      filter.push([['CPD Name:- ',this.cpdname]]);
      filter.push([['Search By: :- ', "Alloted Date"]]);
      filter.push([['Year:- ', this.year]]);
      filter.push([['Month :- ', this.monthnameData]]);
      filter.push([['CPD Status :- ', this.cpdstatus]]);
      filter.push([['Header Name :- ', this.reportName]]);
    } else {
      filter.push([['CPD Name:- ',this.cpdname]]);
      filter.push([['CPD Name:- ', this.cpdname]]);
      filter.push([['Search By: :- ', "Alloted Date"]]);
      filter.push([['Year:- ', this.year]]);
      filter.push([['Month :- ', this.monthnameData]]);
      filter.push([['CPD Status :- ', this.cpdstatus]]);
      filter.push([['Header Name :- ', this.reportName]]);
      filter.push([['State Name: :- ', this.statename]]);
      filter.push([['District Name: :- ', this.districtname]]);
      filter.push([['Hospital Name: :- ', this.hospitalname]]);
    }
    TableUtil.exportListToExcelWithFilterforadmin(this.report, "CPD Claim Processing Payment Report Details", this.heading, filter);
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
    console.log(this.pageElement);
  }

  getMonthName(month: any) {
    if (month == '01') {
      this.monthname = 'January'
    } else if (month == '02') {
      this.monthname = 'February'
    } else if (month == '02') {
      this.monthname = 'February'
    } else if (month == '03') {
      this.monthname = 'March'
    } else if (month == '04') {
      this.monthname = 'April'
    } else if (month == '05') {
      this.monthname = 'May'
    } else if (month == '06') {
      this.monthname = 'June'
    } else if (month == '07') {
      this.monthname = 'July'
    } else if (month == '08') {
      this.monthname = 'August'
    } else if (month == '09') {
      this.monthname = 'September'
    } else if (month == '10') {
      this.monthname = 'October'
    } else if (month == '11') {
      this.monthname = 'November'
    } else if (month == '12') {
      this.monthname = 'December'
    }
    return this.monthname;
  }
}
