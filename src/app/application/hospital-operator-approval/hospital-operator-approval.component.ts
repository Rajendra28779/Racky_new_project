import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { UsercreateService } from './../Services/usercreate.service';
import { Router, NavigationExtras } from '@angular/router';
import { HeaderService } from './../header.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TableUtil } from './../util/TableUtil';
import { SnopipePipe } from './../pipes/snopipe.pipe';
import { HospitaloperatorService } from './../Services/hospitaloperator.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatDate } from '@angular/common';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-hospital-operator-approval',
  templateUrl: './hospital-operator-approval.component.html',
  styleUrls: ['./hospital-operator-approval.component.scss']
})
export class HospitalOperatorApprovalComponent implements OnInit {

  constructor(private userservice: UsercreateService, private route: Router, public headerService: HeaderService, private hospoitalservice: HospitaloperatorService,
    private snopipePipe: SnopipePipe,private sessionService: SessionStorageService
    ) { }

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
  operatordetails: any;
  hospsperatorlist: any = [];

  ngOnInit(): void {
    this.headerService.setTitle("Hospital Operator Details");
    this.user1 = this.sessionService.decryptSessionData("user");
    this.currentPage = 1;
    this.pageElement = 100;
    this.getappliedhospitaloperatorlist();
  }

  getappliedhospitaloperatorlist() {
    let groupId = this.user1.groupId;
    this.hospoitalservice.getappliedhospitaloperatorlist(groupId, this.user1.userId).subscribe((alldta) => {
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
    this.getappliedhospitaloperatorlist();
    this.districtList = [];
  }

  edit(item: any) {
    this.operatordetails = item;
    if (this.operatordetails.hospitalCode != null) {
      this.hospoitalservice.getUserDetails(this.operatordetails.hospitalCode).subscribe((alldta) => {
        this.hospsperatorlist = alldta;
      });
    }
    $('#showdetails').show();
  }
  cloasemodeal() {
    $('#showdetails').hide();
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
    hospname: "",
    hospmobile: "",
    fullname: "",
    userName: "",
    mobile: "",
    state: "",
    district: "",
    apply: "",
  };
  heading = [['Sl No', 'Hospital Name', 'Hospital MobileNO', 'Operator Full Name', 'Operator Username', 'Operator Mobile No', 'Operator State', 'Operator District', 'Applied Date']];
  downloadReport(no: any) {
    this.report = [];
    let item: any;
    for (var i = 0; i < this.userData.length; i++) {
      item = this.userData[i];
      this.user = [];
      this.user.slNo = i + 1;
      this.user.hospname = item.hospitalname;
      this.user.hospmobile = item.hospmobile;
      this.user.fullname = item.fullName;
      this.user.userName = item.userName;
      this.user.mobile = item.mobileNo;
      this.user.state = item.stateCode;
      this.user.district = item.distCode;
      this.user.apply = item.applydate;
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
      doc.text("Applied Hospital Operator List", 100, 15);
      doc.setFontSize(14);
      doc.text('GeneratedOn :- ' + generatedOn, 180, 23);
      doc.text('GeneratedBy :- ' + generatedBy, 15, 23);
      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.slNo;
        pdf[1] = clm.hospname;
        pdf[2] = clm.hospmobile;
        pdf[3] = clm.fullname;
        pdf[4] = clm.userName;
        pdf[5] = clm.mobile;
        pdf[6] = clm.state;
        pdf[7] = clm.district;
        pdf[8] = clm.apply;
        rows.push(pdf);
      }
      autoTable(doc, {
        head: this.heading,
        body: rows,
        theme: 'grid',
        startY: 30,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },
        }
      });
      doc.save('Applied Hospital Operator List.pdf');
    }
  }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

  action(action: any, operatorid: any) {
    let act = "Take Action";
    let act1 = "Success";
    if (action == 1) {
      act = "Approve";
      act1 = "Application Approved Successfully.";
    } else if (action == 2) {
      act = "Reject";
      act1 = "Application Rejected Successfully.";
    }
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to " + act + " this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, ' + act + ' it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.hospoitalservice.takeactiononhospitaloperatorlist(action, operatorid, this.user1.userId).subscribe((alldta: any) => {
          if (alldta.status == 200) {
            this.swal("Success", act1, "success");
            this.getappliedhospitaloperatorlist();
            $("#showdetails").hide();
          } else {
            this.swal("Error", alldta.message, "error");
          }
        });
      }
    });
  }
}
