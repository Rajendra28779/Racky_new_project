import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../header.service';
import { Router } from '@angular/router';
import { PackagewisedischargeclaimService } from '../../Services/packagewisedischargeclaim.service';
import { TableUtil } from '../../util/TableUtil';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-packagewisedischargeclaimdetails',
  templateUrl: './packagewisedischargeclaimdetails.component.html',
  styleUrls: ['./packagewisedischargeclaimdetails.component.scss']
})
export class PackagewisedischargeclaimdetailsComponent implements OnInit {
  txtsearchDate: any;
  gramwisedata: any = [];
  pageElement: any;
  currentPage: any;
  showPegi: boolean;
  packageHeader: any;
  record: any;
  // state: any='All';
  // dist: any='All';
  // hosp: any= 'All';
  state: any;
  dist: any;
  hosp: any;
  user: any;
  userId: any;
  dataClaim: any;
  district: any;
  fromDate: any;
  toDate: any;
  hospital: any;
  packageheder: any;
  packageCod: any;
  stateNam: any = 'All';
  hospitalname1: any;
  disName: any = 'All';
  hopName: any = 'All';
  showsdh: boolean;
  constructor(public headerService: HeaderService,private sessionService: SessionStorageService,
    private packagewisedischargeclaimService: PackagewisedischargeclaimService, private route: Router) { }

  ngOnInit(): void {
    // this.user = JSON.parse(sessionStorage.getItem("user"));
    this.user = this.sessionService.decryptSessionData("user");
    this.dataClaim = JSON.parse(localStorage.getItem("actionDataforpackage"));
    this.stateNam = this.dataClaim.stateName;
    this.disName = this.dataClaim.distName;
    this.hopName = this.dataClaim.hospName;
    this.state = this.dataClaim.stat;
    this.district = this.dataClaim.dist;
    this.hospital = this.hosp;
    this.fromDate = this.dataClaim.fromdate;
    this.toDate = this.dataClaim.todate;
    this.packageheder = this.dataClaim.packageHeader;
    this.hospitalname1 = this.dataClaim.hospitalname;

    this.gramwisedetails();
  }
  gramwisedetails() {
    // this.user = JSON.parse(sessionStorage.getItem("user"));
    this.user = this.sessionService.decryptSessionData("user");
    if (this.user.groupId == 5) {
      this.hosp = this.user.userName;
      this.showsdh = false;
    } else {
      this.showsdh = true;
    }
    // alert(this.hosp);
    let userId = this.user.userId;
    if (this.state == undefined) {
      this.state = "";
    }
    if (this.dist == undefined) {
      this.dist = "";
    }
    if (this.hosp == undefined) {
      this.hosp = "";
    }
    this.packagewisedischargeclaimService.getData(userId, this.state, this.dist, this.hosp, this.packageheder, this.fromDate, this.toDate).subscribe(
      (result) => {
        console.log(result);
        this.gramwisedata = [];
        this.gramwisedata = result;
        this.record = this.gramwisedata.length;
        if (this.record > 0) {
          this.currentPage = 1;
          this.pageElement = 50;
          this.showPegi = true;
        } else {
          this.showPegi = false;
        }
      },
      (error) => console.log(error)
    )
  }

  report: any = [];
  snaPendingClaimList: any = {
    slNo: "",
    packageCod: "",
    packageName: "",
    noOfDischrge: "",
    dischargeAmt: "",
    noOfClaim: "",
    claimedAmt: "",
    paidAmt: ""
  };

  heading = [['Sl No.', 'Package Code', 'Package Name', 'No of Discharge', 'Discharge Amount', 'No. of Claim', 'Claimed Amount', 'Paid Amount']];

  downloadReport(type) {
    if (this.gramwisedata == null || this.gramwisedata.length == 0) {
      this.swal("Info", "No Record Found", "info");
      return;
    }
    this.report = [];
    let item: any;
    for (var i = 0; i < this.gramwisedata.length; i++) {
      item = this.gramwisedata[i];
      this.snaPendingClaimList = [];
      this.snaPendingClaimList.slNo = i + 1;
      this.snaPendingClaimList.packageCod = item.packageCod;
      this.snaPendingClaimList.packageName = item.packageName;
      this.snaPendingClaimList.noOfDischrge = item.noOfDischrge;
      this.snaPendingClaimList.dischargeAmt = this.convertCurrency1(item.dischargeAmt);
      this.snaPendingClaimList.noOfClaim = item.noOfClaim;
      this.snaPendingClaimList.claimedAmt = this.convertCurrency2(item.claimedAmt);
      this.snaPendingClaimList.paidAmt = this.convertCurrency3(item.paidAmt);
      this.report.push(this.snaPendingClaimList);
      console.log(this.report);
    }
    if (type == 1) {
      let filter = [];
      if (this.user.groupId != 5) {
        filter.push([['State Name:-', this.stateNam]]);
        filter.push([['District Name:-', this.disName]]);
        filter.push([['Hospital Name :-', this.hopName]]);
      }
      this.hopName = this.user.fullName;
      filter.push([['Hospital Name :-', this.hopName]]);
      filter.push([['Package Header:-', this.packageheder]])
      filter.push([['From Date :-', this.fromDate]]);
      filter.push([['To Date:-', this.toDate]]);
      TableUtil.exportListToExcelWithFilter(this.report, "Package Wise Discharge Claim Details", this.heading, filter);
    }
    else if (type == 2) {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('p', 'mm', [360, 260]);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text("Package Wise Discharge Claim Details", 70, 10);
      doc.setFontSize(12);
      if (this.user.groupId != 5) {
        doc.text("State Name :-" + this.stateNam, 20, 25);
        doc.text("District Name:-" + this.disName, 150, 25);
        doc.text("Hospital Name:-" + this.hopName, 20, 33);
      }
      else {
        this.hopName = this.user.fullName;
        doc.text("Hospital Name:-" + this.hopName, 20, 33);
      }
      doc.text("Package Header:-" + this.packageheder, 20, 41);
      doc.text("From Date :-" + this.fromDate, 150, 41);
      doc.text("To Date:-" + this.toDate, 20, 49);
      doc.text("Generated On:-" + this.convertDate(new Date()), 150, 49);
      doc.text("Generated By:-" + this.sessionService.decryptSessionData("user").fullName, 20, 57);
      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.slNo;
        pdf[1] = clm.packageCod;
        pdf[2] = clm.packageName;
        pdf[3] = clm.noOfDischrge;
        pdf[4] = clm.dischargeAmt;
        pdf[5] = clm.noOfClaim;
        pdf[6] = clm.claimedAmt;
        pdf[7] = clm.paidAmt;

        rows.push(pdf);
      }
      console.log(rows);
      autoTable(doc, {
        head: this.heading,
        body: rows,
        theme: 'grid',
        startY: 60,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: 30 },
          2: { cellWidth: 45 },
          3: { cellWidth: 30 },
          4: { cellWidth: 30 },
          5: { cellWidth: 30 },
          6: { cellWidth: 30 },
          7: { cellWidth: 30 },
        }
      });
      doc.save('GJAY_Package Wise Discharge Claim Details.pdf');

    }
  }

  convertCurrency1(dischargeAmt: any) {
    var formatter = new CurrencyPipe('en-US');
    dischargeAmt = formatter.transform(dischargeAmt, '', '');
    return dischargeAmt;
  }
  convertCurrency2(claimedAmt: any) {
    var formatter = new CurrencyPipe('en-US');
    claimedAmt = formatter.transform(claimedAmt, '', '');
    return claimedAmt;
  }
  convertCurrency3(paidAmt: any) {
    var formatter = new CurrencyPipe('en-US');
    paidAmt = formatter.transform(paidAmt, '', '');
    return paidAmt;
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  view(packageCod: any) {
    this.stateNam = this.dataClaim.stateName;
    this.disName = this.dataClaim.distName;
    // this.hopName=this.dataClaim.hospName;
    if (this.user.groupId == 5) {
      this.hopName = this.user.fullName;
      this.showsdh = false;
    } else {
      this.hopName = this.dataClaim.hospName;
    }
    let state = {
      stat: this.state,
      stateName: this.stateNam,
      disName: this.disName,
      hospitalName: this.hopName,
      dist: this.dist,
      hosp: this.hospital,
      fromdate: this.fromDate,
      todate: this.toDate,
      packageHeader: this.packageheder,
      packageCod: packageCod
    }
    localStorage.setItem("packagebenificiary", JSON.stringify(state));
    this.route.navigate([]).then(result => {
      window.open(environment.routingUrl + '/packagewisebenificiarydetails');
    });
  }

  convertDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy hh:mm:ss a');
    return date;
  }
}
