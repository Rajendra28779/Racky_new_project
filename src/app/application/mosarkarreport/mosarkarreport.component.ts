import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderService } from '../header.service';
import { HospitalPackageMappingService } from '../Services/hospital-package-mapping.service';
import { TableUtil } from '../util/TableUtil';
import { DatePipe } from '@angular/common';
declare let $: any;


@Component({
  selector: 'app-mosarkarreport',
  templateUrl: './mosarkarreport.component.html',
  styleUrls: ['./mosarkarreport.component.scss']
})
export class MosarkarreportComponent implements OnInit {
  currentPage: any
  pageElement: any;
  txtsearchDate: any;
  fromDate: any;
  toDate: any;
  serachtype: any
  record: any;
  details: any = [];
  showPegi: boolean;
  recoedlength: any
  constructor(public router: Router, private http: HttpClient,
    private headerService: HeaderService, private hospitalService: HospitalPackageMappingService) { }
  ngOnInit(): void {
    this.headerService.setTitle('MoSarkar Reports');
    this.currentPage = 1;
    this.pageElement = 500;
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
    this.getmosarkardetails();
  }
  getmosarkardetails() {
    this.fromDate = $('#datepicker4').val();
    this.toDate = $('#datepicker3').val();
    this.serachtype = $('#seach').val();
    this.hospitalService.getmosarkardetails(this.fromDate, this.toDate, this.serachtype).subscribe((res: any) => {
      console.log(res);
      this.record = res;
      if (this.record.status == 'success') {
        this.details = JSON.parse(this.record.details);
        console.log(this.details);
        this.recoedlength = this.details.length;
      }
      if (this.recoedlength > 0) {
        this.showPegi = true;
      }
      else {
        this.showPegi = false;
      }
    }
    ), err => {
      console.log(err);
    }
  }

  report: any = [];
  sno: any = {
    Slno: "",
    transactionid: "",
    districtcode: "",
    mosarkarinstituionid: "",
    hospitalname: "",
    patientname: "",
    patientphonenumber: "",
    age: "",
    gender: "",
    totalamountclaimed: "",
    invoicenumber: "",
    actualdateofdischarge: "",
    packagename: "",
    claimno: "",
    claimid: "",
    transactiondetailsid: "",
    districtname: "",
  };
  heading = [['TRANSACTIONID', 'DISTRICTCODE', 'MOSARKARINSTITUTIONID', 'HOSPITAL_NAME', 'PATIENTNAME',
    'PATIENTPHONENO', 'AGE', 'GENDER',
    'TOTALAMOUNTCLAIMED', 'INVOICENO', 
    'ACTUALDATEOFDISCHARGE', 'PACKAGENAME',
     'CLAIM_NO','CLAIMID','TRANSACTIONDETAILSID','DISTRICTNAME']];
  downloadReport(type: any) {
    this.report = [];
    if (type == 'excel') {
      let claim: any;
      for (var i = 0; i < this.details.length; i++) {
        claim = this.details[i];
        this.sno = [];
        this.sno.transactionid = claim.TRANSACTIONID;
        this.sno.districtcode = claim.DISTRICTCODE;
        this.sno.mosarkarinstituionid = claim.MOSARKARINSTITUTIONID;
        this.sno.hospitalname = claim.HOSPITAL_NAME;
        this.sno.patientname = claim.PATIENTNAME;
        this.sno.patientphonenumber = claim.PATIENTPHONENO;
        this.sno.age = claim.AGE;
        this.sno.gender = claim.GENDER;
        this.sno.totalamountclaimed = claim.TOTALAMOUNTCLAIMED;
        this.sno.invoicenumber = claim.INVOICENO;
        this.sno.actualdateofdischarge = this.Dateconvert(claim.ACTUALDATEOFDISCHARGE);
        this.sno.packagename = claim.PACKAGENAME;
        this.sno.claimno = claim.CLAIM_NO;
        this.sno.claimid = claim.CLAIMID;
        this.sno.transactiondetailsid = claim.TRANSACTIONDETAILSID;
        this.sno.districtname = claim.DISTRICTNAME;
        this.report.push(this.sno);
      }
      TableUtil.exportListToExcelmosarkar(this.report, "MoSarkar Reports List", this.heading);
    }
  }
  getRestdata() {
    window.location.reload();
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
    console.log(this.pageElement);
  }
  Dateconvert(date) {
    var datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'dd-MMM-yy');
  }
}
