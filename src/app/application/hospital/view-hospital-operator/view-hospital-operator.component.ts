import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { UsercreateService } from '../../Services/usercreate.service';
import { Router, NavigationExtras } from '@angular/router';
import { HeaderService } from '../../header.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TableUtil } from '../../util/TableUtil';
import { SnopipePipe } from '../../pipes/snopipe.pipe';
import { HospitaloperatorService } from '../../Services/hospitaloperator.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatDate } from '@angular/common';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-view-hospital-operator',
  templateUrl: './view-hospital-operator.component.html',
  styleUrls: ['./view-hospital-operator.component.scss']
})
export class ViewHospitalOperatorComponent implements OnInit {

  constructor(private userservice: UsercreateService, private route: Router, public headerService: HeaderService, private hospoitalservice: HospitaloperatorService, private sessionService: SessionStorageService
    , private snopipePipe: SnopipePipe) { }

  record: any;
  currentPage: any;
  pageElement: any;
  showPegi: boolean;
  userData: any = [];
  groupList: any = [];
  stateList: any;
  districtList: any;
  Filtered: any;
  groupId: any;
  stateId: any;
  districtId: any;
  txtsearchDate: any;
  user1: any;

  ngOnInit(): void {
    this.headerService.setTitle("Create Hospital Operator ");
    this.user1 = this.sessionService.decryptSessionData("user");
    this.currentPage = 1;
    this.pageElement = 100;
    this.getUserDetails();
  }

  getUserDetails() {
    let hospitalcode = this.user1.userName;
    this.hospoitalservice.getUserDetails(hospitalcode).subscribe((alldta) => {
      this.userData = alldta;
      this.record = this.userData.length;
      if (this.record > 0) {
        this.showPegi = true;
      }
      else {
        this.showPegi = false;
      }
    })
  }
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  }

  resetTable() {
    this.currentPage = 1;
    this.pageElement = 100;
    this.getUserDetails();
  }

  edit(item: any) {
    let objToSend: NavigationExtras = {
      state: {
        bskyUserId: item
      }
    };
    this.route.navigate(['/application/hospitalopreator'], objToSend);
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  report: any = [];
  user: any = {
    slNo: "",
    fullname: "",
    userName: "",
    mobile: "",
    email: "",
    state: "",
    district: "",
    group: "",
    status: "",
  };
  heading = [['Sl No', 'Full Name', 'Username', 'Mobile No', 'Email Id', 'State', 'District', 'Group', 'Status']];

  downloadReport(no: any) {
    this.report = [];
    let item: any;
    for (var i = 0; i < this.userData.length; i++) {
      item = this.userData[i];
      this.user = [];
      this.user.slNo = i + 1;
      this.user.fullname = item.fullName;
      this.user.userName = item.userName;
      this.user.mobile = item.mobileNo;
      this.user.email = item.email;
      this.user.state = item.stateCode;
      this.user.district = item.distCode;
      this.user.group = "Hospital Operator";
      this.user.status = item.status;
      this.report.push(this.user);
    }
    if (no == 1) {
      let filter = [];
      filter.push([["Hospital name", this.user1.fullName + " (" + this.user1.userName + ")"]]);
      TableUtil.exportListToExcelWithFilter(
        this.report,
        this.user1.fullName + ' Hospital Operator List ',
        this.heading, filter
      );
    } else {
      let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
      let generatedBy = this.user1.fullName;
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('l', 'mm', [297, 210]);
      doc.setFontSize(20);
      doc.text("Hospital Operator List", 110, 15);
      doc.setFontSize(12);
      doc.text("Hospital name :- " + this.user1.fullName + " (" + this.user1.userName + ")", 15, 25);
      doc.text('GeneratedOn :- ' + generatedOn, 180, 33);
      doc.text('GeneratedBy :- ' + generatedBy, 15, 33);
      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.slNo;
        pdf[1] = clm.fullname;
        pdf[2] = clm.userName;
        pdf[3] = clm.mobile;
        pdf[4] = clm.email;
        pdf[5] = clm.state;
        pdf[6] = clm.district;
        pdf[7] = clm.group;
        pdf[8] = clm.status;
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
        }
      });
      doc.save(this.user1.fullName + ' Hospital Operator List.pdf');
    }
  }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

}
