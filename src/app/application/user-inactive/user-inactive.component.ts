import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { HeaderService } from '../header.service';
import { ResetPasswordserviceService } from '../Services/reset-passwordservice.service';
import { AdminconsoleService } from '../Services/adminconsole.service';
import { TableUtil } from '../util/TableUtil';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-user-inactive',
  templateUrl: './user-inactive.component.html',
  styleUrls: ['./user-inactive.component.scss']
})
export class UserInactiveComponent implements OnInit {
  record: any;
  currentPage: any;
  pageElement: any;
  showPegi: boolean;
  txtsearchDate: any;
  listData: any = [];
  userList: any = [];
  keyword: any = 'fullname';
  user: any;
  @ViewChild('auto') auto;
  fDate: string;
  tDate: string;
  userId: any;
  username: any = "All";
  useId: any;
  constructor(private resetpasswordservice: ResetPasswordserviceService, public headerService: HeaderService,
    private adminService: AdminconsoleService, private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle("User Inactivation");
    this.currentPage = 1;
    this.pageElement = 100;
    this.getList();
    this.user = this.sessionService.decryptSessionData("user");
  }

  getUserList() {
    this.adminService.getUserList().subscribe(
      (response) => {
        this.userList = response;
      },
      (error) => console.log(error)
    );
  }

  getList() {
    this.listData = [];
    this.resetpasswordservice.getListUserData().subscribe((alldata) => {
      this.listData = alldata;
      this.record = this.listData.length;
      if (this.listData.length == 0) {
        this.showPegi = false;
      }
      if (this.record > 0) {
        this.showPegi = true;
      }
      else {
        this.showPegi = false;
      }
      this.userList = [];
      for (var i = 0; i < this.listData.length; i++) {
        var user = this.listData[i];
        user.fullname = user.fullname + ' (' + user.userName + ')';
        this.userList.push(user);
      }
    });
  }

  selectEvent(item) {
    this.listData = [];
    let userId = item.userId;
    this.useId = userId;
    this.resetpasswordservice.getListUserDataFiltered(userId).subscribe((alldata) => {
      this.listData = alldata;
      this.record = this.listData.length;
      if (this.record > 0) {
        this.showPegi = true;
      }
      else {
        this.showPegi = false;
      }
    });
  }

  onReset() {
    this.getList();
  }

  statusChange(userId: any, isActive: any) {
    let status;
    if (isActive == 0) {
      status = 'InActive';
    } else if (isActive == 1) {
      status = 'Active';
    } else {
      isActive = 1;
      status = 'Active';
    }
    if (isActive == 0) {
      this.resetpasswordservice.checkStatus(userId).subscribe(
        (data) => {
          if (data.status == "Info") {
            this.swal("Info", data.message, "info");
            return;
          } else if (data.status == "Failed") {
            this.swal("Error", data.message, "error");
            return;
          }
        }
      );
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'You want change status to ' + status + '!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Change It',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.resetpasswordservice.changeStatus(userId, isActive, this.user.userId).subscribe(
          (data: any) => {
            if (data.status == "Success") {
              this.swal("Success", data.message, "success");
              this.getList();
              this.txtsearchDate = '';
              this.auto.clear();
            } else if (data.status == "Failed") {
              this.swal("Error", data.message, "error");
            }
          },
          (err: any) => {
            console.log(err);
            this.swal("Error", 'Smoething went wrong!', "error");
          }
        )
      }
    });
  }

  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  report: any = [];
  listdata: any = {
    slNo: "",
    userName: "",
    fullname: "",
    groupTypeName: "",
    status: ""
  };
  heading = [['Sl No', 'Username', 'Full Name', 'User Type', 'Status']];
  downloadReport(type) {
    this.report = [];
    let item: any;
    for (var i = 0; i < this.listData.length; i++) {
      item = this.listData[i];
      this.listdata = [];
      this.listdata.slNo = i + 1;
      this.listdata.userName = item.userName;
      this.listdata.fullname = item.fullname;
      this.listdata.groupTypeName = item.groupId.groupTypeName;
      if (item.status == '0') {
        this.listdata.status = "Active";
      } else if (item.status == '1') {
        this.listdata.status = "In Active";
      }
      this.report.push(this.listdata);
    }
    for (let i = 0; i < this.userList.length; i++) {
      if (this.useId == this.userList[i].userId) {
        this.username = this.userList[i].userName;
      }
    }
    if (type == 1) {
      let filter = [];
      filter.push([['User Name:-', this.username]]);
      TableUtil.exportListToExcelWithFilter(this.report, "User Inactive List", this.heading, filter);
    } else if (type == 2) {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('l', 'mm', [260, 260]);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text("User Inactive List", 120, 10);
      doc.setFontSize(12);
      doc.text("User Name :-" + this.username, 40, 25);
      doc.text("Generated On: " + this.convertDate(new Date()), 40, 33);
      doc.text("Generated By: " + this.sessionService.decryptSessionData("user").fullName, 180, 33);
      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.slNo;
        pdf[1] = clm.userName;
        pdf[2] = clm.fullname;
        pdf[3] = clm.groupTypeName;
        pdf[4] = clm.status;

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
          0: { cellWidth: 30 },
          1: { cellWidth: 40 },
          2: { cellWidth: 60 },
          3: { cellWidth: 50 },
          4: { cellWidth: 45 }
        }
      });
      doc.save('GJAY_User Inactive List.pdf');
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
