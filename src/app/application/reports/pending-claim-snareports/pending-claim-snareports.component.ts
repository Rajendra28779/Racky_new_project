import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderService } from '../../header.service';
import { FormControl, FormGroup } from '@angular/forms';
import { PendingClaimSnaReportServiceService } from '../../Services/pending-claim-sna-report-service.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { JwtService } from 'src/app/services/jwt.service';
import { TableUtil } from '../../util/TableUtil';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CurrencyPipe } from '@angular/common';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-pending-claim-snareports',
  templateUrl: './pending-claim-snareports.component.html',
  styleUrls: ['./pending-claim-snareports.component.scss']
})
export class PendingClaimSnareportsComponent implements OnInit {

  public snaDoctorList: any = [];
  public taggedList: any = [];
  Months: any;
  searchdata: any;
  user: any;
  userId: any;
  txtsearchDate: any;
  searchdatalength: any;
  currentPage: any;
  pageElement: any;
  showPegi: boolean;
  data: any;
  name: any = "";

  snadoctor: any = "";
  keyword: any = 'fullName';
  keyword1: any = 'hospitalName';
  showdropdown: boolean;
  authTaggingId: any;
  username: string | number | string[];
  hospitalCode: string = "";
  id: any;
  fullname: any;
  item1: any;
  item: any;
  record: any = 0;
  snaDetails: any = [];
  deleteDetails: any;
  status: any;
  hospitalName: any;
  safullName: any;
  // getHospitalName: any;


  constructor(private pendingclaimsnareprtservice: PendingClaimSnaReportServiceService, private jwtService: JwtService, private route: Router, public headerService: HeaderService, private snoService: SnocreateserviceService,private sessionService: SessionStorageService,) { }


  SearchForm = new FormGroup({
    snadoctor: new FormControl(''),
    hospitalCode: new FormControl(''),
    hospitalName: new FormControl(''),
  });
  ngOnInit(): void {
    this.currentPage = 1;
    this.pageElement = 10;
    this.headerService.setTitle("SNA Pending Claim Report");
    // this.user = JSON.parse(sessionStorage.getItem("user"));
    this.user = this.sessionService.decryptSessionData("user");
    this.userId = this.user.userId;
    this.getSNAList();
    if (this.user.groupId != 4) {
      this.showdropdown = true
    } else {
      this.showdropdown = false
    }
  }

  getSNAList() {
    this.snoService.getSNODetails().subscribe(
      (response) => {
        this.snaDoctorList = response;
        if (this.user.groupId == 4) {
          let data = this.snaDoctorList;
          for (let i = 0; i <= this.snaDoctorList.length; i++) {
            if (data[i].userId == this.userId) {
              this.name = data[i].userId;
              this.snaDoctorList = [];
              this.snaDoctorList.push(data[i]);
              this.ongotHospitalCode(data[i]);
              break;
            }
          }
        } else {
          this.name = "";
        }
      },
      (error) => console.log(error)
    )

  }


  selectEvent(item) {
    this.snadoctor = item.userId;
    this.safullName=item.fullName;
    this.userId = item.userId.userId;
  }

  selectEvent1(item) {
    this.hospitalCode = item.hospitalCode;
    this.getHospitalName=item.hospitalName;
  }

  ongotHospitalCode(item) {
    var id = item.userId;
    // this.auto.clear();  
    let name1 = id;
    this.taggedList = [];
    let list = [];
    this.pendingclaimsnareprtservice.getHospitalTageed(name1).subscribe(
      (response) => {
        list = response;
        for (var i = 0; i < list.length; i++) {
          var h = list[i];
          h.hospitalName = h.hospitalName + ' (' + h.hospitalCode + ')';
          this.taggedList.push(h);
        }
      },
      (error) => console.log(error)
    )
    if (this.user.groupId == 4) {
      this.SearchMethod();
    }
  }

  onReset1() {
    this.hospitalCode = "";

  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }


  getHospitalName:any="--";
 
  SearchMethod() {
    let a = this.snadoctor;
    if (this.user.groupId != 4) {
      if (a == null || a == "" || a == undefined) {
        $("#snadoctor").focus();
        this.swal("Info", "Please select SNA  ", 'info');
        return;
      }
    } else {
      this.snadoctor = this.name
    }
    this.pendingclaimsnareprtservice.searchReportList(this.snadoctor, this.hospitalCode).subscribe(
      (result: any) => {
        this.snaDetails = result;
        this.record = this.snaDetails.length;
        if (this.record > 0) {
          this.showPegi = true;
        }
        else {
          this.showPegi = false;
        }
      }, (err: any) => {
        console.log(err);
      }
    )
  }

  details(claim: any) {
    localStorage.setItem("claimid", claim)
    localStorage.setItem("token", this.jwtService.getJwtToken())
    this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/trackingdetails'); });
  }
  report: any = [];
  snaPendingClaimList: any = {
    slNo: "",
    hospitalName: "",
    claimNo: "",
    cpdName: "",
    allotedDate: "",
    packageCode: "",
    packageName: "",

    totalAmountClaimed: "",
    appliedType: "",
  };

  heading = [['Sl No.', 'Hospital Name', 'Claim Number', 'CPD Name', 'Alloted Date', 'Package Code', 'Package Name', 'Claim Amount (₹)', 'Applied Type']];


  downloadReport(type) {
    this.report = [];
    let item: any;
    for (var i = 0; i < this.snaDetails.length; i++) {
      item = this.snaDetails[i];
      this.snaPendingClaimList = [];
      this.snaPendingClaimList.slNo = i + 1;
      this.snaPendingClaimList.hospitalName = item.hospitalName;
      this.snaPendingClaimList.claimNo = item.claimNo;
      this.snaPendingClaimList.cpdName = item.cpdName;
      this.snaPendingClaimList.allotedDate = item.allotedDate;
      this.snaPendingClaimList.packageCode = item.packageCode;
      this.snaPendingClaimList.packageName = item.packageName;
      this.snaPendingClaimList.totalAmountClaimed = this.convertCurrency(item.totalAmountClaimed);
      this.snaPendingClaimList.appliedType = item.appliedType;
      this.report.push(this.snaPendingClaimList);
    }
    if (type == 1) {
      let filter = [];
      filter.push([['SNA Name :-', this.safullName]]);
      filter.push([['Hospital Name:-', this.hospitalName]]);
      TableUtil.exportListToExcelWithFilter(this.report, "Pending Claim SNA Report", this.heading, filter);
    } else if (type == 2) {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('l', 'mm', [360, 260]);
      doc.setFontSize(12);
      doc.text("SNA Pending Claim List", 5, 10);
      doc.text("SNA Name :-"+this.safullName, 5, 20);
      doc.text("Hospital Name:-"+this.getHospitalName, 5, 30);
     

      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.slNo;
        pdf[1] = clm.hospitalName;
        pdf[2] = clm.claimNo;
        pdf[3] = clm.cpdName;
        pdf[4] = clm.allotedDate;
        pdf[5] = clm.packageCode;
        pdf[6] = clm.packageName;
        pdf[7] = clm.totalAmountClaimed;
        pdf[8] = clm.appliedType;
        rows.push(pdf);
      }
      autoTable(doc, {
        head: this.heading,
        body: rows,
        theme: 'grid',
        startY: 40,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 60 },
          2: { cellWidth: 30 },
          3: { cellWidth: 35 },
          4: { cellWidth: 30 },
          5: { cellWidth: 50 },
          6: { cellWidth: 40 },
          7: { cellWidth: 30 },
          8: { cellWidth: 50 }
        }
      });
      doc.save('Bsky_SNA Pending Claim List.pdf');

    }
  }
  convertCurrency(totalAmountClaimed: any) {
    var formatter = new CurrencyPipe('en-US');
    totalAmountClaimed = formatter.transform(totalAmountClaimed, '', '');
    return totalAmountClaimed;
  }
  getReset() {
    window.location.reload();

  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }



}
