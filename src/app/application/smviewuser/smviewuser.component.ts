import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { UsercreateService } from './../Services/usercreate.service';
import { Router, NavigationExtras } from '@angular/router';
import { HeaderService } from './../header.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TableUtil } from './../util/TableUtil';
import { SnopipePipe } from './../pipes/snopipe.pipe';
import { SwastyaMitraHospitalService } from '../Services/swastya-mitra-hospital.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { EncryptionService } from 'src/app/services/encryption.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-smviewuser',
  templateUrl: './smviewuser.component.html',
  styleUrls: ['./smviewuser.component.scss']
})
export class SmviewuserComponent implements OnInit {
  data: any;
  detailData: any = [];
  header: any;
  count: any;
  statename: any = '--';
  districtName: any = '--';

  constructor(private userservice: UsercreateService, private route: Router, public headerService: HeaderService,
    private encryptionService: EncryptionService, public swastyaMitraHospitalService: SwastyaMitraHospitalService, private sessionService: SessionStorageService) { }

  record: any;
  currentPage: any;
  pageElement: any;
  showPegi: boolean;
  swasthyaData: any = [];
  groupList: any = [];
  stateList: any = [];
  districtList: any = [];
  Filtered: any;
  groupId: any;
  stateId: any;
  districtId: any;
  txtsearchDate: any;
  user:any;

  ngOnInit(): void {
    this.headerService.setTitle("SwasthyaMitra Details View");
    this.user = this.sessionService.decryptSessionData("user");
    this.currentPage = 1;
    this.pageElement = 100;
    $('#groupId').val("");
    $('#stateId').val("");
    $('#districtId').val("");
    this.getSwasthyaMitraData();
    this.getGroupList();
    this.getStateList();
  }

  // getUserDetails() {
  //   this.userservice.getUserDetails().subscribe((alldta) => {

  //     this.userData = alldta;
  //     this.record = this.userData.length;
  //     if (this.record > 0) {
  //       this.showPegi = true;
  //     }
  //     else {
  //       this.showPegi = false;
  //     }
  //   })
  // }

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
    this.getSwasthyaMitraData();
  }

  edit(bskyUserId: any) {

    let objToSend: NavigationExtras = {
      state: {
        bskyUserId: bskyUserId
      }
    };
    this.route.navigate(['/application/smusercreate'], objToSend);
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  getGroupList() {
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

  // getUserDetails() {


  //   this.groupId = 14;
  //   this.stateId = $('#stateId').val();
  //   this.districtId = $('#districtId').val();

  //   this.userData = [];
  //   this.currentPage = 1;
  //   this.pageElement = 100;

  //   this.userservice.getUserDetailsData(this.groupId, this.stateId, this.districtId).subscribe(
  //     (data) => {
  //       this.Filtered = data;
  //       if (this.Filtered.length != 0) {
  //         this.userData = this.snopipePipe.transform(this.userData, this.Filtered);
  //         $('#htmlData').show();
  //       }
  //       else if (this.Filtered.length <= 0) {
  //         $('#htmlData').hide();
  //         Swal.fire("", "No Record Found !", 'info');
  //       }
  //       this.record = this.userData.length;
  //       if (this.record > 0) {
  //         this.showPegi = true;
  //       }
  //       else {
  //         this.showPegi = false;
  //       }
  //     }
  //   );
  // }
  getSwasthyaMitraData() {
    this.groupId = 14;
    this.stateId = $('#stateId').val();
    this.districtId = $('#districtId').val();
    this.swastyaMitraHospitalService.getSwasthyaMitraDeta(this.groupId, this.stateId, this.districtId).subscribe(
      (data) => {
        this.swasthyaData = data;
        this.record = this.swasthyaData.length;
        if (this.record > 0) {
          this.currentPage = 1;
          this.pageElement = 100;
          this.showPegi = true;
        } else {
          this.showPegi = false
        }
      },
      (error: any) => {
        console.log(error);
      }
    )
  }
  getSwasthyaMitra() {

    this.stateId = $('#stateId').val();
    this.districtId = $('#districtId').val();
    this.swastyaMitraHospitalService.getSwasthyaFilter(this.stateId, this.districtId).subscribe(
      (result) => {
        this.swasthyaData = [];
        this.swasthyaData = result;
        this.record = this.swasthyaData.length;
        if (this.record > 0) {
          this.currentPage = 1;
          this.pageElement = 100;
          this.showPegi = true;
        } else {
          this.showPegi = false
        }
      },
      (error: any) => {
        console.log(error);
      }
    )
  }

  view(item) {
    this.user = item.swasthyaId
    this.header = item.fullName
    // alert(item.fullName);
    this.swastyaMitraHospitalService.getsmtaggedhospital(this.user).subscribe(
      (response) => {
        this.detailData = response;
        this.count = this.detailData.length;
        if (this.count > 0) {
          this.currentPage = 1;
          this.pageElement = 100;
          this.showPegi = true;
        } else {
          this.showPegi = false
        }
      },
      (error) => console.log(error)
    );
  }

  report: any = [];
  user1: any = {
    slNo: "",
    fullName: "",
    userName: "",
    mobileNo: "",
    stateName: "",
    districtName: "",
    gropName: "",
    stateFlg: "",
    counthospital: "",
    hospitalName: ""
  };
  heading = [['Sl No', 'Full Name', 'Username', 'Mobile No', 'State Name', 'District Name', 'Group', 'Status', 'Tagged Hospital']];

  downloadReport(type) {
    this.report = [];
    let item: any;
    for (var i = 0; i < this.swasthyaData.length; i++) {
      item = this.swasthyaData[i];
      this.user1 = [];
      this.user1.slNo = i + 1;
      this.user1.fullName = item.fullName;
      this.user1.userName = item.userName;
      this.user1.mobileNo = item.mobileNo.toString();
      this.user1.stateName = item.stateName;
      this.user1.districtName = item.districtName;
      this.user1.gropName = item.gropName;
      if (item.stateFlg == '0') {
        this.user1.stateFlg = "Active";
      } else if (item.stateFlg == '1') {
        this.user1.stateFlg = "Inactive";
      }
      this.user1.hospitalName = item.hospitalName;
      this.report.push(this.user1);
    }
    for (let i = 0; i < this.stateList.length; i++) {
      if (this.stateList[i].stateCode == this.stateId) {
        this.statename = this.stateList[i].stateName
      }
    }
    for (let i = 0; i < this.districtList.length; i++) {
      if (this.districtList[i].districtcode == this.districtId) {
        this.districtName = this.districtList[i].districtname;
      }
    }
    if (type == 1) {
      let filter = [];
      filter.push([['State Name', this.statename]])
      filter.push([['District Name', this.districtName]])
      TableUtil.exportListToExcelWithFilter(this.report, "SwasthyaMitra Details", this.heading, filter);
    }
    else if (type == 2) {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('l', 'mm', [380, 280]);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text("SwasthyaMitra Details", 155, 20);
      doc.setFontSize(12);
      doc.text("State Name: " + this.statename, 35, 35);
      doc.text("District Name: " + this.districtName, 180, 35);
      doc.text("Generated By: " + this.user.fullName, 35, 43);
      doc.text("Generated On: " + this.convertDate(new Date()), 180, 43);
      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.slNo;
        pdf[1] = clm.fullName;
        pdf[2] = clm.userName;
        pdf[3] = clm.mobileNo;
        pdf[4] = clm.stateName;
        pdf[5] = clm.districtName;
        pdf[6] = clm.gropName;
        pdf[7] = clm.stateFlg;
        pdf[8] = clm.hospitalName;
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
          1: { cellWidth: 45 },
          2: { cellWidth: 35 },
          3: { cellWidth: 30 },
          4: { cellWidth: 30 },
          5: { cellWidth: 40 },
          6: { cellWidth: 45 },
          7: { cellWidth: 30 },
          8: { cellWidth: 60 }
        }
      });
      doc.save('GJAY_SwasthyaMitra Details.pdf');
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

  // delete(userid:any){
  //   Swal.fire({
  //     title: 'Are you sure?',
  //      text: "You want to In-Active this!",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, Update it!'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  // let bskyid=JSON.parse(sessionStorage.getItem("user")).userId
  // alert(bskyid)
  // alert(userid)
  //   this.swastyaMitraHospitalService.inactiveSwasthyaMitra(bskyid,userid).subscribe(
  //     (data) => {
  //       this.data=data;
  //       if (this.data.status == "200") {
  //         this.swal("Success", this.data.message, "success");
  //         this.getUserDetails();
  //       } else if (this.data.status == "400") {
  //         this.swal("Error", this.data.message, "error");
  //       }
  //     });
  //   }
  // });
  // }

  report1: any = [];

  user2: any = {
    slNo: "",
    hospitalName: "",
    hospitalCode: "",
    state: "",
    dist: ""
  };
  heading1 = [['Sl No', 'Hospital Name','Hospital Code' ,'State', 'District']];

  downloadReportList(type) {
    this.report1 = [];
    let item: any;
    for (var i = 0; i < this.detailData.length; i++) {
      item = this.detailData[i];
      this.user2 = [];
      this.user2.slNo = i + 1;
      this.user2.hospitalName = item.hospitalName;
      this.user2.hospitalCode = item.hospitalCode;
      this.user2.state = item.state;
      this.user2.dist = item.dist;
      this.report1.push(this.user2);
    }

    if (type == 1) {
      let filter = [];
      filter.push([['SwasthyaMitra Name', this.header]])
      TableUtil.exportListToExcel(this.report1, "SwasthyaMitra Details", this.heading1);
    }
    else if (type == 2) {
      if (this.report1 == null || this.report1.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('p', 'mm', [250, 220]);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text("SwasthyaMitra Details", 60, 20);
      doc.setFontSize(12);
      doc.text("Generated By: " + this.user.fullName, 15, 28);
      doc.text("Generated On: " + this.convertDate(new Date()), 120, 28);
      var rows = [];
      for (var i = 0; i < this.report1.length; i++) {
        var clm = this.report1[i];
        var pdf = [];
        pdf[0] = clm.slNo;
        pdf[1] = clm.hospitalName;
        pdf[2] = clm.hospitalCode;
        pdf[3] = clm.state;
        pdf[4] = clm.dist;
        rows.push(pdf);
      }
      autoTable(doc, {
        head: this.heading1,
        body: rows,
        theme: 'grid',
        startY: 35,
        headStyles: {
          fillColor: [26, 99, 54]
          // fillColor:[30,99,54]
        },
        columnStyles: {
          0: { cellWidth: 30 },
        }
      });
      doc.save('GJAY_SwasthyaMitra Details.pdf');
    }
  }

}
