import { Component, OnInit } from '@angular/core';
import { UsercreateService } from '../../Services/usercreate.service';
import { SnopipePipe } from '../../pipes/snopipe.pipe';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { InternalGrivanceServiceService } from '../../Services/internal-grivance-service.service';
import { TableUtil } from '../../util/TableUtil';
import jsPDF from 'jspdf';
import { DatePipe } from '@angular/common';
import autoTable from 'jspdf-autotable';
import { EncryptionService } from 'src/app/services/encryption.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-user-otp-required',
  templateUrl: './user-otp-required.component.html',
  styleUrls: ['./user-otp-required.component.scss'],
})
export class UserOtpRequiredComponent implements OnInit {
  groupList: any = [];
  groupId: any;
  userData: any = [];
  currentPage: any;
  pageElement: any;
  showPegi: boolean;
  Filtered: any;
  record: any;
  txtsearchDate: any;
  user: any;
  constructor(
    private userservice: UsercreateService,
    private snopipePipe: SnopipePipe,
    private headerService: HeaderService,
    private encryptionService: EncryptionService,
    private internalGrivanceServiceService: InternalGrivanceServiceService,
    private sessionService: SessionStorageService
  ) { }

  ngOnInit(): void {
    this.headerService.setTitle('User OTP Configuration');
    this.user = this.sessionService.decryptSessionData("user");
    this.currentPage = 1;
    this.pageElement = 100;
    $('#groupId').val('');
    this.getUserDetails();
    this.getGroupList();
  }
  getGroupList() {
    this.userservice.getGroupList().subscribe(
      (response: any) => {
        response = this.encryptionService.getDecryptedData(response);
        this.groupList = response.data;
      },
      (error) => console.log(error)
    );
  }

  getUserDetails() {
    this.groupId = $('#groupId').val();
    this.userData = [];
    this.currentPage = 1;
    this.pageElement = 100;
    if (this.groupId == undefined) {
      this.groupId = '';
    }
    this.internalGrivanceServiceService
      .getGrievanceByDetails(this.groupId)
      .subscribe((data) => {
        this.Filtered = data;
        if (this.Filtered.length != 0) {
          this.userData = this.snopipePipe.transform(
            this.userData,
            this.Filtered
          );
        } else if (this.Filtered.length <= 0) {
          Swal.fire('', 'No Record Found !', 'info');
        }
        this.backUpUserData = this.userData;
        let count = 0;
        this.userData.forEach((element) => {
          if (element.isOtp == 0) {
            count = count + 1;
          }
        });
        if (count == this.userData.length) {
          this.checkAllBox = true;
        } else {
          this.checkAllBox = false;
        }
        this.record = this.userData.length;
        if (this.record > 0) {
          this.showPegi = true;
        } else {
          this.showPegi = false;
        }
      });
  }
  checkAllBox: boolean = false;
  backUpUserData: any = [];
  checkAllCheckBox(event: any, id: string) {
    const isChecked = event.target.checked;

    // Determine which checkbox group is being toggled
    switch (id) {
      case 'allCheck':
        this.checkAllBox = isChecked;
        this.userData.forEach((element) => {
          element.isOtp = isChecked ? 0 : 1;
        });
        break;

      case 'logCheck':
        this.authcheckAllBox = isChecked;
        this.userData.forEach((element) => {
          element.isauthentication = isChecked ? 0 : 1;
        });
        break;

      case 'actionCheck':
        this.actioncheckAllBox = isChecked;
        this.userData.forEach((element) => {
          element.isactionauthentication = isChecked ? 0 : 1;
        });
        break;
    }

    // Update `selectedUser` based on the updated userData
    this.selectedUser = this.userData.filter(
      (element) =>
        element.isOtp === 0 ||
        element.isauthentication === 0 ||
        element.isactionauthentication === 0
    );
  }
  userOtp: any;
  selectedUser: any = [];
  tdCheck(event, data, type: any) {
    // Update the respective property based on the checkbox type
    if (type === 'allCheck') {
      data.isOtp = event.target.checked ? 0 : 1;
    } else if (type === 'logCheck') {
      data.isauthentication = event.target.checked ? 0 : 1;
    } else if (type === 'actionCheck') {
      data.isactionauthentication = event.target.checked ? 0 : 1;
    }

    // Check if the user is already in the selectedUser list
    const existingUserIndex = this.selectedUser.findIndex((item) => item.userid === data.userid);

    if (event.target.checked) {
      // Add to selectedUser if not already present
      if (existingUserIndex === -1) {
        this.selectedUser.push(data);
      }
    } else {
      // Remove from selectedUser if present
      if (existingUserIndex !== -1) {
        this.selectedUser.splice(existingUserIndex, 1);
      }
    }

    // Update the checkAllBox status
    this.checkAllBox = this.selectedUser.length === this.userData.length;
  }

  submit() {
    if (this.selectedUser.length == 0) {
      this.swal('Info', 'Please select at least one User', 'info');
      return;
    }
    Swal.fire({
      title: 'Are You Sure?',
      text: 'You Want To Update This Data!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        let data = {
          userId: this.user.userId,
          selectedUser: this.selectedUser
        }
        this.userservice.updateUserOtp(data).subscribe(
          (data: any) => {
            if (data.status == "success") {
              this.swal('Success', 'Record Updated Succefully', 'success');
              this.selectedUser = [];
              this.getUserDetails();
            } else {
              this.swal('Error', 'Something went wrong', 'error');
            }
          },
          (error) => {
            console.log(error);
            this.swal('Error', 'Something went wrong', 'error');
          }
        );
      }
    });
  }
  onReset() {
    this.getUserDetails();
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  heading = [['Sl No', 'Full Name', 'Username', 'Mobile No', 'Group', 'Is OTP Required', 'Login Authentication Required', 'Action Authentication Required']];
  report: any = [];
  downloadReport(type) {
    this.report = [];
    let item: any;
    for (var i = 0; i < this.backUpUserData.length; i++) {
      item = this.userData[i];
      this.user = [];
      this.user.slNo = i + 1;
      this.user.fullname = item.fullname;
      this.user.username = item.username;
      this.user.phoneno = item.phoneno;
      this.user.groupName = item.groupName;

      if (item.isOtp == 0) {
        this.user.status = "Yes";
      } else if (item.isOtp == 1) {
        this.user.status = "No";
      }


      if (item.isauthentication == 0) {
        this.user.logingstatus = "Yes";
      } else if (item.isauthentication == 1) {
        this.user.logingstatus = "No";
      }


      if (item.isactionauthentication == 0) {
        this.user.actionstatus = "Yes";
      } else if (item.isactionauthentication == 1) {
        this.user.actionstatus = "No";
      }

      this.report.push(this.user);
    }
    if (type == 1) {
      let filter = [];
      // TableUtil.exportListToExcel(this.report, "User Details List", this.heading);
      TableUtil.exportListToExcelWithFilter(this.report, "User OTP Required list", this.heading, filter);
    } else if (type == 2) {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('l', 'mm', [320, 260]);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text("User OTP Required list", 125, 10);
      doc.setFontSize(12);
      doc.text("Generated On: " + this.convertDate(new Date()), 190, 33);
      doc.text("Generated By: " + this.sessionService.decryptSessionData("user").fullName, 40, 39);
      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.slNo;
        pdf[1] = clm.fullname;
        pdf[2] = clm.username;
        pdf[3] = clm.phoneno;
        pdf[4] = clm.groupName;
        pdf[5] = clm.status;
        pdf[6] = clm.logingstatus;
        pdf[7] = clm.actionstatus;
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
          0: { cellWidth: 10 },
          1: { cellWidth: 80 },
          2: { cellWidth: 30 },
          3: { cellWidth: 30 },
          4: { cellWidth: 30 },
          5: { cellWidth: 30 },
          6: { cellWidth: 30 },
          7: { cellWidth: 30 }
        }
      });
      doc.save('User OTP Required list.pdf');
    }
  }
  otpLogList: any = [];
  fullName: any;
  groupName: any;
  logDetails(data) {
    this.fullName = data.fullname;
    this.groupName = data.groupName;
    this.userservice.viewhistory(data).subscribe(
      (data: any) => {
        if (data.status == "success") {
          this.otpLogList = data.data;
        } else {
          this.swal('Error', 'Something went wrong', 'error');
        }
      },
      (error) => {
        console.log(error);
        this.swal('Error', 'Something went wrong', 'error');
      }
    );
  }
  convertDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy hh:mm:ss a');
    return date;
  }


  userloging: any;
  authcheckAllBox: boolean = false;
  selectedUserloging: any = [];
  logingtdCheck(event, data) {
    if (event.target.checked) {
      data.isauthentication = 0;
    } else {
      data.isauthentication = 1;
    }
    let statusCheckloging = false;
    for (const i of this.selectedUserloging) {
      if (i.userid == data.userid) {
        statusCheckloging = true;
      }
    }
    if (statusCheckloging == false) {
      this.selectedUserloging.push(data);
    } else {
      for (var i = 0; i < this.selectedUserloging.length; i++) {
        if (data.userid == this.selectedUserloging[i].userid) {
          var index = this.selectedUserloging.indexOf(this.selectedUserloging[i]);
          if (index !== -1) {
            this.selectedUserloging.splice(index, 1);
          }
        }
      }
    }
    if (this.selectedUserloging.length == this.userData.length) {
      this.authcheckAllBox = true;
    } else {
      this.authcheckAllBox = false;
    }
  }

  useraction: any;
  actioncheckAllBox: boolean = false;
  selectedUseraction: any = [];
  ActiontdCheck(event, data) {
    if (event.target.checked) {
      data.isactionauthentication = 0;
    } else {
      data.isactionauthentication = 1;
    }
    let statusCheckaction = false;
    for (const i of this.selectedUseraction) {
      if (i.userid == data.userid) {
        statusCheckaction = true;
      }
    }
    if (statusCheckaction == false) {
      this.selectedUseraction.push(data);
    } else {
      for (var i = 0; i < this.selectedUseraction.length; i++) {
        if (data.userid == this.selectedUseraction[i].userid) {
          var index = this.selectedUseraction.indexOf(this.selectedUseraction[i]);
          if (index !== -1) {
            this.selectedUseraction.splice(index, 1);
          }
        }
      }
    }
    if (this.selectedUseraction.length == this.userData.length) {
      this.actioncheckAllBox = true;
    } else {
      this.actioncheckAllBox = false;
    }
  }
}
