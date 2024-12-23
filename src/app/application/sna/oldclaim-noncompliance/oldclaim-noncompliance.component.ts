import { CurrencyPipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { HeaderService } from '../../header.service';
import { SnamasterserviceService } from '../../Services/snamasterservice.service';
import { SnafloatgenerationserviceService } from '../../snafloatgenerationservice.service';
import { environment } from 'src/environments/environment';
import { JwtService } from 'src/app/services/jwt.service';
import { TableUtil } from '../../util/TableUtil';
declare let $: any;

@Component({
  selector: 'app-oldclaim-noncompliance',
  templateUrl: './oldclaim-noncompliance.component.html',
  styleUrls: ['./oldclaim-noncompliance.component.scss']
})
export class OldclaimNoncomplianceComponent implements OnInit {
  countfloate: any;
  childmessage: any;
  txtsearchDate: any;
  showPegi: any;
  pageElement: any;
  currentPage: any;
  floate: any;
  formdate: any;
  toDate: any;
  state:any;
  dist:any;
  hospital:any;
  user: any;
  stateList: any = [];
  districtList: any = [];
  hospitalList: any = [];

  constructor(private route: Router, public headerService: HeaderService,
    public snafloatgenerationservice: SnafloatgenerationserviceService
    ,private sessionService: SessionStorageService,
    private snamasterService: SnamasterserviceService,
    private jwtService: JwtService,) { }

  ngOnInit(): void {
    this.headerService.setTitle('Old Claim SNA Non-Compliance');
    this.user =  this.sessionService.decryptSessionData("user");
    this.showPegi = false;
    $('.selectpicker').selectpicker();

    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      // endDate: '0d',
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

    this.getStateList();
    this.claimlist();
  }

  getStateList() {
      this.snamasterService.getStateList(this.user.userId).subscribe(
        (response) => {
          this.stateList = response;
        },
        (error) => console.log(error)
      )
  }

  OnChangeState(id) {
    $("#districtId").val("");
    localStorage.setItem("stateCode", id);
      this.snamasterService.getDistrictListByStateId(this.user.userId, id).subscribe(
        (response) => {
          this.districtList = response;
        },
        (error) => console.log(error)
      )
  }
  OnChangeDistrict(id) {
    let stateCode = localStorage.getItem("stateCode");
      this.snamasterService.getHospitalbyDistrictId(this.user.userId, id, stateCode).subscribe(
        (response) => {
          this.hospitalList = response;
        },
        (error) => console.log(error)
      )
  }

  reset() {
    this.ngOnInit();
    this.claimlist();
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  claimlist() {
    this.formdate = $('#datepicker1').val().toString().trim();
    this.toDate = $('#datepicker2').val().toString().trim();
    if (Date.parse(this.formdate) > Date.parse(this.toDate)) {
      this.swal('', ' From Date should be less To Date', 'error');
      return;
    }
    this.state = $('#stateId').val();
    this.dist = $('#districtId').val();
    this.hospital = $('#hospital').val();
    this.snafloatgenerationservice.oldclaimnoncompliance(this.formdate, this.toDate, this.user.userId,this.state,this.dist,this.hospital).subscribe((data: any) => {
      if (data.status == 200) {
        this.floate = data.data;
        this.countfloate = this.floate.length;
        if (this.countfloate > 0) {
          this.currentPage = 1;
          this.pageElement = 50;
          this.showPegi = true;
        } else {
          this.showPegi = false;
        }
      } else {
        this.swal('', ' SomeThing Went Wrong', 'error');
      }
    });
  }

  onAction(id: any, urn: any, transid: any) {
    let transId = transid;
    let state = {
      Urn: urn
    }
    localStorage.setItem("claimid", transId);
    localStorage.setItem("trackingdetails", JSON.stringify(state));
    localStorage.setItem("token", this.jwtService.getJwtToken());
    this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/oldClaimtrackingdetails'); });
  }

  report: any = [];
  sno: any = [];
  heading = [["Sl#",
  "URN",
  "Patient Name",
  "Invoice No",
  "Case No",
  "Hospital Details",
  "Package Code",
  "Package Name",
  "Date of Admission",
  "Actual Date of Admission",
  "Date of Discharge",
  "Actual Date of Discharge",
  "Claim Amount",
  "SNA Query On",
  "SNA Remarks"]];
  downloadList(no: any) {
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy =  this.user.fullName;
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.floate.length; i++) {
      sna = this.floate[i];
      this.sno = [];
      this.sno.push(i + 1);
      this.sno.push(sna.urn);
      this.sno.push(sna.patientName);
      this.sno.push(sna.invoiceNo);
      this.sno.push(sna.caseNo);
      this.sno.push(sna.hoispitalName);
      this.sno.push(sna.pkgCode);
      this.sno.push(sna.pkgName);
      this.sno.push(sna.dateofAdm);
      this.sno.push(sna.actDateofAdm);
      this.sno.push(sna.dateofDis);
      this.sno.push(sna.actDateofDis);
      this.sno.push(this.convertCurrency(sna.totalAmount));
      this.sno.push(sna.queryOn);
      this.sno.push(sna.remark);
      this.report.push(this.sno);
    }

    let statename='All';
    let distname='All';
    let hospname='All';
    for (let j = 0; j < this.stateList.length; j++) {
      if (this.stateList[j].stateCode == this.state) {
        statename  = this.stateList[j].stateName;
      }
    }
    for (let j = 0; j < this.districtList.length; j++) {
      if (this.districtList[j].districtcode == this.dist) {
        distname = this.districtList[j].districtname;
      }
    }
    for (let j = 0; j < this.hospitalList.length; j++) {
      if (this.hospitalList[j].hospitalCode == this.hospital) {
        hospname = this.hospitalList[j].hospName;
      }
    }

    if (no == 1) {
      let filter = [];
      filter.push([['Actual Date Of Discharge From', this.formdate]]);
      filter.push([['Actual Date Of Discharge To', this.toDate]]);
      filter.push([['State Name', statename]]);
      filter.push([['District Name', distname]]);
      filter.push([['Hospital Name', hospname]]);
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'Old Claim NON Compliance',
        this.heading, filter
      );
    } else {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('l', 'mm', [386, 273]);
      doc.setFontSize(22);
      doc.text("Old Claim NON Compliance", 140, 15);
      doc.setFontSize(15);
      doc.text('Actual Date Of Discharge From :- ' + this.formdate, 15, 23);
      doc.text('Actual Date Of Discharge To :- ' + this.toDate, 220, 23);
      doc.text('State Name :- ' + statename, 15, 31);
      doc.text('District Name :- ' + distname, 220, 31);
      doc.text('Hospital Name :- ' + hospname, 15, 39);
      doc.text('GeneratedOn :- ' + generatedOn, 220, 47);
      doc.text('GeneratedBy :- ' + generatedBy, 15, 47);
      autoTable(doc, {
        head: this.heading,
        body: this.report,
        theme: 'grid',
        startY: 55,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          // 0: { cellWidth: 10 },
        }
      });
      doc.save('Old Claim NON Compliance.pdf');
    }
  }

  convertCurrency(amount) {
    var formatter = new CurrencyPipe('en-US');
    amount = formatter.transform(amount, '', '');
    return amount;
  }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

}
