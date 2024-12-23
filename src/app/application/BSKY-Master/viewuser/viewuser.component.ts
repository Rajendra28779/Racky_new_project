import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { UsercreateService } from '../../Services/usercreate.service';
import { Router, NavigationExtras } from '@angular/router';
import { HeaderService } from '../../header.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TableUtil } from '../../util/TableUtil';
import { SnopipePipe } from '../../pipes/snopipe.pipe';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import jsPDF from 'jspdf';
import { EncryptionService } from 'src/app/services/encryption.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-viewuser',
  templateUrl: './viewuser.component.html',
  styleUrls: ['./viewuser.component.scss']
})
export class ViewuserComponent implements OnInit {
  stat: any;
  dist: any;
  type: any;
  groups: any = [];
  districtname: any = "ALL";
  grp: any;

  constructor(private userservice: UsercreateService, private route: Router, public headerService: HeaderService,
    private snopipePipe: SnopipePipe, private encryptionService: EncryptionService, private sessionService: SessionStorageService) { }

  record: any;
  currentPage: any;
  pageElement: any;
  showPegi: boolean;
  userData: any = [];
  groupList: any = [];
  stateList: any = [];
  districtList: any = [];
  Filtered: any;
  groupId: any;
  stateId: any;
  districtId: any;
  txtsearchDate: any;
  statename: any = "ALL";
  districtName: any = "ALL";
  groupTypeName: any = "ALL";

  ngOnInit(): void {
    this.headerService.setTitle("User Details");
    this.currentPage = 1;
    this.pageElement = 100;
    $('#groupId').val("");
    $('#stateId').val("");
    $('#districtId').val("");
    this.getUserDetails();
    this.getGroupList();
    this.getStateList();
  }

  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  }

  resetTable() {
    this.currentPage = 1;
    this.pageElement = 100;
    this.districtList = [];
    $('#groupId').val("");
    $('#stateId').val("");
    $('#districtId').val("");
    this.getUserDetails();
  }

  edit(item: any) {
    let objToSend: NavigationExtras = {
      state: {
        bskyUserId: item
      }
    };
    this.route.navigate(['/application/createuser'], objToSend);
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  getGroupList() {
    this.stateId = "";
    this.districtId = "";
    let groups;
    this.userservice.getGroupList().subscribe(
      (response: any) => {
        response = this.encryptionService.getDecryptedData(response);
        groups = response.data;
        for (var i = 0; i < groups.length; i++) {
          var g = groups[i];
          if (g.typeId != 3 && g.typeId != 5) {
            this.groupList.push(g);
          }
        }
      },
      (error) => console.log(error)
    )
  }

  getStateList() {
    this.userservice.getStateList().subscribe(
      (response) => {
        this.stateList = [];
        this.stateList = response;
      },
      (error) => console.log(error)
    )
  }

  OnChangeState(id) {
    $('#districtId').val("");
    localStorage.setItem("stateCode", id);
    this.userservice.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = [];
        this.districtList = response;
      },
      (error) => console.log(error)
    )
  }

  getUserDetails() {
    this.groupId = $('#groupId').val();
    this.stateId = $('#stateId').val();
    this.districtId = $('#districtId').val();
    this.userData = [];
    this.currentPage = 1;
    this.pageElement = 100;
    if (this.stateId == undefined) {
      this.stateId = "";
    }
    if (this.districtId == undefined) {
      this.districtId = "";
    }
    if (this.groupId == undefined) {
      this.groupId = "";
    }
    this.stat = this.stateId;
    this.dist = this.districtId;
    this.grp = this.groupId;
    this.userservice.getUserDetailsData(this.grp, this.stat, this.dist).subscribe(
      (data) => {
        this.Filtered = data;
        if (this.Filtered.length != 0) {
          this.userData = this.snopipePipe.transform(this.userData, this.Filtered);
          console.log(this.userData);

          $('#htmlData').show();
        }
        else if (this.Filtered.length <= 0) {
          $('#htmlData').hide();
          Swal.fire("", "No Record Found !", 'info');
        }
        this.record = this.userData.length;
        if (this.record > 0) {
          this.showPegi = true;
        }
        else {
          this.showPegi = false;
        }
      }
    );
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
  downloadReport(type) {
    this.report = [];
    let item: any;
    for (var i = 0; i < this.userData.length; i++) {
      item = this.userData[i];
      this.user = [];
      this.user.slNo = i + 1;
      this.user.fullname = item.fullName;
      this.user.userName = item.userName;
      this.user.mobile = item.mobileNo.toString();
      this.user.email = item.emailId;
      this.user.state = item.districtCode.statecode.stateName;
      this.user.district = item.districtCode.districtname;
      this.user.group = item.groupId.groupTypeName;
      if (item.status == '0') {
        this.user.status = "Active";
      } else if (item.status == '1') {
        this.user.status = "Inactive";
      }
      this.report.push(this.user);
    }
    for (let i = 0; i < this.stateList.length; i++) {
      if (this.stateList[i].stateCode == this.stat) {
        this.statename = this.stateList[i].stateName
      }
    }
    for (let i = 0; i < this.districtList.length; i++) {
      if (this.districtList[i].districtcode == this.dist) {
        this.districtname = this.districtList[i].districtname;
      }
    }
    for (var i = 0; i < this.groupList.length; i++) {
      var g = this.groupList[i];
      if (g.typeId == this.groupId) {
        this.groupTypeName = g.groupTypeName;
      }
    }
    if (type == 1) {
      let filter = [];
      filter.push([['State Name:-', this.statename]]);
      filter.push([['District Name:-', this.districtname]]);
      filter.push([['Group Name:-', this.groupTypeName]]);
      TableUtil.exportListToExcelWithFilter(this.report, "User Details List", this.heading, filter);
    } else if (type == 2) {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('l', 'mm', [320, 260]);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text("User Details List", 125, 10);
      doc.setFontSize(12);
      doc.text("State Name :-" + this.statename, 40, 25);
      doc.text("District Name:-" + this.districtname, 190, 25);
      doc.text("Group Name:-" + this.groupTypeName, 40, 33);
      doc.text("Generated On: " + this.convertDate(new Date()), 190, 33);
      doc.text("Generated By: " + this.sessionService.decryptSessionData("user").fullName, 40, 39);
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
        startY: 50,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: 35 },
          2: { cellWidth: 25 },
          3: { cellWidth: 30 },
          4: { cellWidth: 50 },
          5: { cellWidth: 40 },
          6: { cellWidth: 40 },
          7: { cellWidth: 30 },
          8: { cellWidth: 20 }
        }
      });
      doc.save('User Details List.pdf');
    }
  }

  convertDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy hh:mm:ss a');
    return date;
  }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }
}
